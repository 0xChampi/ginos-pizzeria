#!/usr/bin/env node
// Extra Gino's cut-outs: Giorgio (from the WTKR Super Bowl story likeness)
// plus more shop objects. Same flux-schnell / hand-inked idiom as gen-imagery.
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'public', 'generated')
await mkdir(OUT, { recursive: true })

const envRaw = await readFile(path.join(HERE, '..', '.env.gen'), 'utf8').catch(() => '')
const forgeRaw = await readFile(path.join(HERE, '../../lora-forge/.env.local'), 'utf8').catch(() => '')
const TOKEN = (
  process.env.REPLICATE_API_TOKEN ||
  envRaw.match(/REPLICATE_API_TOKEN=["']?([^"'\n]+)/)?.[1] ||
  forgeRaw.match(/REPLICATE_API_TOKEN=["']?([^"'\n]+)/)?.[1] ||
  ''
).trim()
if (!TOKEN) {
  console.error('no REPLICATE_API_TOKEN')
  process.exit(1)
}

const STYLE =
  'bold hand-inked pen-and-ink illustration, thick confident black ink outlines, ' +
  'flat screenprint color fill, cut-out on plain white background, warm kraft paper texture, ' +
  'brick-red river-blue mustard-amber color accents only, Olde Towne pizzeria warmth, ' +
  'woodcut linocut poster art style, NOT a photograph, NOT realistic, no text no words no watermark no logos'

const GIORGIO =
  'an elderly pizza-shop owner in his seventies, tan complexion, full thick white-and-grey beard and mustache, ' +
  'receding hairline with short grey hair on the sides, warm brown eyes, kind serious face, ' +
  'plain navy polo shirt, no brand logos, flour dusted on his hands'

const SUBJECTS = [
  { name: 'giorgio-portrait-ink', prompt: `bust portrait of ${GIORGIO}, looking slightly to the side, cut out on white background` },
  { name: 'giorgio-peel-ink', prompt: `${GIORGIO} standing and holding a wooden pizza peel with a pepperoni pizza, khaki pants, cut out on white background` },
  { name: 'storefront-ink', prompt: 'a red brick corner pizzeria storefront with a red signboard, black iron patio fence, a potted palm, outdoor tables, no letters no words, cut out on white background' },
  { name: 'cheese-pull-slice-ink', prompt: 'one triangular pepperoni pizza slice with a long mozzarella cheese pull, cut out on white background' },
  { name: 'giant-stromboli-ink', prompt: 'a huge golden baked stromboli on a wooden board, cut out on white background' },
  { name: 'tiramisu-ink', prompt: 'a square of homemade tiramisu dusted with cocoa on a small plate, cut out on white background' },
  { name: 'italian-sub-ink', prompt: 'a stuffed italian sub sandwich cut in half, meats and provolone spilling out, cut out on white background' },
  { name: 'mozz-sticks-ink', prompt: 'a small pile of fried mozzarella sticks with a cup of marinara, cut out on white background' },
  { name: 'dough-ball-ink', prompt: 'a round ball of pizza dough in a bowl of flour, cut out on white background' },
]

const NEG =
  'photograph, photorealistic, 3d render, realistic, blurry, deformed, text, letters, words, watermark, signature, logo, brand, gucci, ugly, muddy colors, young man, clean shaven'

async function gen(subject) {
  console.log(`[gen] ${subject.name} …`)
  const create = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({
      input: {
        prompt: `${subject.prompt}. ${STYLE}`,
        aspect_ratio: '1:1',
        num_outputs: 1,
        output_format: 'png',
        disable_safety_checker: false,
        negative_prompt: NEG,
      },
    }),
  })
  const pred = await create.json()
  if (!create.ok) {
    console.error('  create failed', pred?.detail || pred)
    return
  }

  let status = pred
  for (let i = 0; i < 60 && !['succeeded', 'failed', 'canceled'].includes(status.status); i++) {
    await new Promise((r) => setTimeout(r, 2500))
    status = await (await fetch(status.urls.get, { headers: { Authorization: `Bearer ${TOKEN}` } })).json()
  }
  if (status.status !== 'succeeded') {
    console.error(`  ${subject.name} ${status.status}`, status.error || '')
    return
  }

  const url = Array.isArray(status.output) ? status.output[0] : status.output
  const img = Buffer.from(await (await fetch(url)).arrayBuffer())
  const dest = path.join(OUT, `${subject.name}.png`)
  await writeFile(dest, img)
  console.log(`  ✓ ${path.relative(process.cwd(), dest)} (${(img.length / 1024).toFixed(0)}kb)`)
}

for (const s of SUBJECTS) await gen(s)
console.log('[gen] done')
