import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { hasDashSession } from '../../../_lib/dash-session'
import { readDashData, writeDashData } from '../../../_lib/dash-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!hasDashSession()) return NextResponse.json({ error: 'Signed out.' }, { status: 401 })
  return NextResponse.json(await readDashData())
}

export async function PUT(request: Request) {
  if (!hasDashSession()) return NextResponse.json({ error: 'Signed out.' }, { status: 401 })
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Could not read that.' }, { status: 400 })
  }
  const saved = await writeDashData(body)
  revalidatePath('/')
  return NextResponse.json(saved)
}
