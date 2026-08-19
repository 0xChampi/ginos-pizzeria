const BASE = process.env.GINOS_URL || 'http://127.0.0.1:3017'
const PASS = process.env.DASH_PASSCODE || 'courtqueen'

function check(condition, message) {
  if (!condition) throw new Error(message)
  console.log(`PASS ${message}`)
}

function cookieHeader(setCookie) {
  return (Array.isArray(setCookie) ? setCookie : [setCookie])
    .filter(Boolean)
    .map((value) => value.split(';')[0])
    .join('; ')
}

async function json(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const date = tomorrow.toISOString().slice(0, 10)
const stamp = `Giant Gino needs twenty — ${Date.now().toString(36)}`

async function run() {
  const loginPage = await fetch(`${BASE}/dash/login`)
  const loginHtml = await loginPage.text()
  check(loginPage.ok, `login page loads (${loginPage.status})`)
  check(/back of the house/i.test(loginHtml), 'login names the back of the house')
  check(/passcode/i.test(loginHtml), 'login asks for a passcode')

  const locked = await fetch(`${BASE}/dash`, { redirect: 'manual' })
  check(locked.status === 307 || locked.status === 302, `dash without session redirects (${locked.status})`)

  const wrong = await fetch(`${BASE}/api/dash/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: 'not-it' }),
  })
  check(wrong.status === 401, `wrong passcode is refused (${wrong.status})`)

  const right = await fetch(`${BASE}/api/dash/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: PASS }),
  })
  const cookie = cookieHeader(right.headers.getSetCookie?.() || right.headers.get('set-cookie'))
  check(right.ok, `dev passcode opens the back (${right.status})`)
  check(/ginos_dash=/.test(cookie), 'session cookie is set')

  const published = await fetch(`${BASE}/api/dash/data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({
      featuredPlate: 'The Giant Gino',
      todayLine: stamp,
      events: [
        {
          id: 'ev-verify',
          title: 'Catering Saturday',
          date,
          time: 'All day',
          status: 'open',
          blurb: 'Call before we 86 it.',
        },
      ],
    }),
  })
  const saved = await json(published)
  check(published.ok, `publish succeeds (${published.status})`)
  check(saved.featuredPlate === 'The Giant Gino', `featured plate saved (${saved.featuredPlate})`)
  check(saved.todayLine === stamp, 'today line saved')

  const shop = await fetch(`${BASE}/`, { cache: 'no-store' })
  const shopHtml = await shop.text()
  check(shop.ok, `shop still loads (${shop.status})`)
  check(shopHtml.includes(stamp), 'today line is on the shop')
  check(/The Giant Gino/.test(shopHtml) && /On the board today/.test(shopHtml), 'featured plate is flagged on the shop')
  check(/Catering Saturday/.test(shopHtml), 'upcoming special is on the shop')

  const invoice = await fetch(`${BASE}/invoice`)
  const invoiceHtml = await invoice.text()
  check(invoice.ok, `invoice loads (${invoice.status})`)
  check(/Owner dashboard/.test(invoiceHtml), 'dashboard is on the invoice')
  check(/Tech support/.test(invoiceHtml), 'year of support is on the invoice')
  check(/Included/.test(invoiceHtml), 'bundled lines are not billed extra')
  check(/\$150/.test(invoiceHtml) && /\$125/.test(invoiceHtml), 'after-year-1 rate is on the invoice')
  check(/\$2,849/.test(invoiceHtml), 'amount due is $2,849')

  const restored = await fetch(`${BASE}/api/dash/data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({ featuredPlate: 'Brick Oven Pizza', todayLine: '', events: [] }),
  })
  check(restored.ok, 'demo publish restored to empty board')

  console.log('ALL DASH CHECKS PASSED')
}

run().catch((error) => {
  console.error('FAIL', error.message)
  process.exit(1)
})
