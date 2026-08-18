#!/usr/bin/env node
// Generate Gino's imagery via Replicate flux-schnell in the hand-inked
// illustrated style. Simple objects, cut-out on white. Token from
// .env.gen, REPLICATE_API_TOKEN, or lora-forge/.env.local.
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'public', 'generated')
await mkdir(OUT, { recursive: true })

const envRaw = await readFile(path.join(HERE, '..', '.env.gen'), 'utf8').catch(() => '')
const forgeRaw = await readFile(
  path.join(HERE, '../../lora-forge/.env.local'),
  'utf8',
).catch(() => '')
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
  'woodcut linocut poster art style, NOT a photograph, NOT realistic, no text no words no watermark'

const SUBJECTS = [
  { name: 'whole-pie-ink', prompt: 'a single whole brick-oven pepperoni pizza, cut out on white background' },
  { name: 'peel-pie-ink', prompt: 'a plain rustic wooden pizza peel with no writing and no letters, holding one cooked pizza, cut out on white background' },
  { name: 'calzone-ink', prompt: 'a golden folded calzone with a small cup of marinara, cut out on white background' },
  { name: 'garlic-knots-ink', prompt: 'a small pile of garlic knots with parsley, cut out on white background' },
]

const NEG =
  'photograph, photorealistic, 3d render, realistic, blurry, deformed, text, letters, words, watermark, signature, logo, ugly, muddy colors'

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
