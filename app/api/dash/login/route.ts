import { NextResponse } from 'next/server'

import { DASH_COOKIE, mintSession, passcodeMatches } from '../../../_lib/dash-session'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const passcode = typeof body.passcode === 'string' ? body.passcode : ''
  if (!passcodeMatches(passcode)) {
    return NextResponse.json({ error: 'That is not it. The oven is watching.' }, { status: 401 })
  }
  const { value, expires } = mintSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(DASH_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  })
  return res
}
