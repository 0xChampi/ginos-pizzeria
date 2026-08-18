import { promises as fs } from 'node:fs'
import path from 'node:path'
import { get, put } from '@vercel/blob'

import { defaultDashData, normalizeDashData, type DashData } from './dash-types'

const BLOB_PATH = 'dash/ginos.json'
const LOCAL_PATH = path.join(process.cwd(), 'data', 'dash.json')

const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export async function readDashData(): Promise<DashData> {
  try {
    if (blobConfigured()) {
      const res = await get(BLOB_PATH, { access: 'private', useCache: false })
      if (!res || res.statusCode !== 200) return defaultDashData
      return normalizeDashData(JSON.parse(await new Response(res.stream).text()))
    }
    return normalizeDashData(JSON.parse(await fs.readFile(LOCAL_PATH, 'utf8')))
  } catch {
    return defaultDashData
  }
}

export async function writeDashData(data: DashData): Promise<DashData> {
  const clean = normalizeDashData(data)
  const body = JSON.stringify(clean, null, 2)
  if (blobConfigured()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    })
  } else {
    await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true })
    await fs.writeFile(LOCAL_PATH, body)
  }
  return clean
}
