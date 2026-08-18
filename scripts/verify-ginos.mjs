import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const APP_URL = process.env.GINOS_URL || 'http://127.0.0.1:3017/'
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const DEVTOOLS_PORT = 9400 + (process.pid % 300)
const DEVTOOLS_URL = `http://127.0.0.1:${DEVTOOLS_PORT}`
const DESKTOP_SHOT = '/tmp/ginos-desktop.png'
const MOBILE_SHOT = '/tmp/ginos-mobile.png'

let browser
let profile
let ws

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function poll(test, label, timeout = 15000) {
  const deadline = Date.now() + timeout
  let lastError
  while (Date.now() < deadline) {
    try {
      const value = await test()
      if (value) return value
    } catch (error) {
      lastError = error
    }
    await sleep(100)
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ''}`)
}

function check(condition, message) {
  if (!condition) throw new Error(message)
  console.log(`PASS ${message}`)
}

async function launchChrome() {
  profile = await mkdtemp(join(tmpdir(), 'ginos-e2e-'))
  browser = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${DEVTOOLS_PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })

  await poll(async () => {
    const response = await fetch(`${DEVTOOLS_URL}/json/version`)
    return response.ok
  }, 'headless Chrome')
}

async function run() {
  await launchChrome()
  const response = await fetch(`${DEVTOOLS_URL}/json/new?${encodeURIComponent(APP_URL)}`, {
    method: 'PUT',
  })
  if (!response.ok) throw new Error(`Could not create Chrome target: ${response.status}`)
  const target = await response.json()
  ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out opening DevTools socket')), 5000)
    ws.addEventListener('open', () => {
      clearTimeout(timer)
      resolve()
    }, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })

  let nextId = 1
  const pending = new Map()
  const browserErrors = []
  const badResponses = []

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id)
      clearTimeout(timer)
      pending.delete(message.id)
      if (message.error) reject(new Error(JSON.stringify(message.error)))
      else resolve(message.result)
      return
    }
    if (message.method === 'Runtime.exceptionThrown') {
      browserErrors.push(message.params.exceptionDetails?.text || 'Runtime exception')
    }
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
      const { status, url } = message.params.response
      if (!url.endsWith('/favicon.ico')) badResponses.push(`${status} ${url}`)
    }
  })

  function command(method, params = {}) {
    const id = nextId++
    ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`Timed out waiting for ${method}`))
      }, 12000)
      pending.set(id, { resolve, reject, timer })
    })
  }

  async function evaluate(expression) {
    const result = await command('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
    }
    return result.result.value
  }

  await Promise.all([
    command('Page.enable'),
    command('Runtime.enable'),
    command('Network.enable'),
  ])

  async function capture(viewport, path) {
    await command('Emulation.setDeviceMetricsOverride', viewport)
    await command('Page.navigate', { url: APP_URL })
    await poll(async () => evaluate(`document.readyState === 'complete'`), 'page load')
    await evaluate(`(async () => {
      const height = document.documentElement.scrollHeight
      for (let y = 0; y <= height; y += 400) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 80))
      }
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 200))
    })()`)
    await sleep(400)
    const shot = await command('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      fromSurface: true,
    })
    await writeFile(path, Buffer.from(shot.data, 'base64'))
    return evaluate(`(() => {
      const hero = document.querySelector('h1')
      const images = [...document.querySelectorAll('img')].map((img) => ({
        src: img.getAttribute('src'),
        complete: img.complete,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }))
      return {
        title: document.title,
        hero: hero?.innerText.replace(/\\s+/g, ' ').trim(),
        heroFont: hero ? getComputedStyle(hero).fontFamily : '',
        pageText: document.body.innerText,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        images,
        motionShell: Boolean(document.querySelector('[data-motion-stage]')),
        streets: [...document.querySelectorAll('.street-sign')].map((el) => el.textContent.trim()),
      }
    })()`)
  }

  const desktop = await capture({ width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }, DESKTOP_SHOT)
  check(desktop.title.includes("Gino's Pizzeria"), 'title names the shop')
  check(/meet you/i.test(desktop.hero || '') && /corner/i.test(desktop.hero || ''), 'corner headline renders')
  check(
    /big.?shoulders|__Big_Shoulders/i.test(desktop.heroFont) && !/playfair|bodoni|fraunces/i.test(desktop.heroFont),
    `display face is the Gino sign type (${desktop.heroFont})`,
  )
  check(/455 Court/i.test(desktop.pageText), 'real address is on the page')
  check(/\(757\) 998-2040/.test(desktop.pageText), 'real phone is on the page')
  check(/giant gino/i.test(desktop.pageText), 'Giant Gino is the dominant plate')
  check(/giorgio/i.test(desktop.pageText) && /still in the dough/i.test(desktop.pageText), 'Giorgio section is on the page')
  check(desktop.images.some((img) => /giorgio-portrait/.test(img.src) && img.width > 0), 'Giorgio cartoon portrait loaded')
  check(/homemade tiramisu/i.test(desktop.pageText), 'real dessert is named')
  check(desktop.streets.some((s) => /court/i.test(s)) && desktop.streets.some((s) => /queen/i.test(s)), 'both street signs render')
  check(desktop.motionShell, 'MotionShell stage is wired')
  check(desktop.images.every((img) => img.complete && img.width > 0), 'illustrated cut-outs loaded')
  check(!desktop.overflow, `desktop does not overflow (${desktop.scrollWidth}/${desktop.innerWidth})`)
  console.log(`PASS desktop screenshot ${DESKTOP_SHOT}`)

  await evaluate(`window.scrollTo(0, 0)`)
  await sleep(200)
  const heroShot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile('/tmp/ginos-hero.png', Buffer.from(heroShot.data, 'base64'))
  await evaluate(`document.getElementById('giorgio')?.scrollIntoView()`)
  await sleep(300)
  const giorgioShot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile('/tmp/ginos-giorgio.png', Buffer.from(giorgioShot.data, 'base64'))
  await evaluate(`document.getElementById('menu')?.scrollIntoView()`)
  await sleep(300)
  const menuShot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile('/tmp/ginos-menu.png', Buffer.from(menuShot.data, 'base64'))
  await evaluate(`window.scrollTo(0, document.documentElement.scrollHeight)`)
  await sleep(300)
  const visitShot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile('/tmp/ginos-visit.png', Buffer.from(visitShot.data, 'base64'))
  console.log('PASS section screenshots /tmp/ginos-{hero,menu,visit}.png')

  const mobile = await capture({ width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, MOBILE_SHOT)
  check(/corner/i.test(mobile.hero || ''), 'mobile headline still reads')
  check(!mobile.overflow, `mobile does not overflow (${mobile.scrollWidth}/${mobile.innerWidth})`)
  console.log(`PASS mobile screenshot ${MOBILE_SHOT}`)

  const noise = [...browserErrors, ...badResponses].filter(Boolean)
  check(noise.length === 0, `no console/network errors (${noise.join('; ') || 'clean'})`)

  ws.close()
  browser.kill()
  await rm(profile, { recursive: true, force: true })
  console.log('ALL CHECKS PASSED')
}

run().catch(async (error) => {
  console.error('FAIL', error.message)
  if (ws) ws.close()
  if (browser) browser.kill()
  if (profile) await rm(profile, { recursive: true, force: true })
  process.exit(1)
})
