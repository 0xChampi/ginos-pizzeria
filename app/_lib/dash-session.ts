import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const DASH_COOKIE = 'ginos_dash'
const SESSION_TTL_DAYS = 30

function secret(): string {
  const value = process.env.DASH_SECRET
  if (value) return value
  if (process.env.NODE_ENV !== 'production') return 'ginos-dev-dash-secret'
  throw new Error('DASH_SECRET is not set.')
}

function sign(exp: string): string {
  return createHmac('sha256', secret()).update(`ginos-dash:${exp}`).digest('hex')
}

export function mintSession(): { value: string; expires: Date } {
  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000)
  const exp = String(expires.getTime())
  return { value: `${exp}.${sign(exp)}`, expires }
}

export function hasDashSession(): boolean {
  const raw = cookies().get(DASH_COOKIE)?.value
  if (!raw) return false
  const dot = raw.indexOf('.')
  if (dot < 1) return false
  const exp = raw.slice(0, dot)
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  const expected = Buffer.from(sign(exp), 'hex')
  const given = Buffer.from(raw.slice(dot + 1), 'hex')
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function passcodeMatches(candidate: string): boolean {
  const pass = process.env.DASH_PASSCODE || (process.env.NODE_ENV !== 'production' ? 'courtqueen' : '')
  if (!pass) return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(pass)
  const len = Math.max(a.length, b.length, 1)
  const pa = Buffer.alloc(len)
  const pb = Buffer.alloc(len)
  a.copy(pa)
  b.copy(pb)
  return timingSafeEqual(pa, pb) && a.length === b.length
}
