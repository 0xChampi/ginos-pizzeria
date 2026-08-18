import { menuPlates } from '../content'

export type EventStatus = 'open' | 'fast' | 'sold'

export type DashEvent = {
  id: string
  title: string
  date: string
  time: string
  status: EventStatus
  blurb: string
}

export type DashData = {
  featuredPlate: string
  todayLine: string
  events: DashEvent[]
}

export const defaultDashData: DashData = {
  featuredPlate: menuPlates[0].name,
  todayLine: '',
  events: [],
}

export const eventStatusLabel: Record<EventStatus, string> = {
  open: 'On the board',
  fast: 'Going fast',
  sold: "86'd",
}

const isStatus = (s: unknown): s is EventStatus => s === 'open' || s === 'fast' || s === 'sold'

const text = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export function normalizeDashData(raw: unknown): DashData {
  const doc = (raw ?? {}) as Record<string, unknown>
  const known = menuPlates.some((plate) => plate.name === doc.featuredPlate)
  const events = (Array.isArray(doc.events) ? doc.events : [])
    .map((entry): DashEvent | null => {
      const ev = (entry ?? {}) as Record<string, unknown>
      const title = text(ev.title, 120)
      const date = text(ev.date, 10)
      if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
      return {
        id: text(ev.id, 40) || `ev-${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}`,
        title,
        date,
        time: text(ev.time, 60),
        status: isStatus(ev.status) ? ev.status : 'open',
        blurb: text(ev.blurb, 400),
      }
    })
    .filter((event): event is DashEvent => event !== null)
    .slice(0, 24)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    featuredPlate: known ? (doc.featuredPlate as string) : defaultDashData.featuredPlate,
    todayLine: text(doc.todayLine, 160),
    events,
  }
}

export function eventDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatEventDate(date: string): string {
  return eventDate(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function upcomingEvents(events: DashEvent[]): DashEvent[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return events.filter((event) => eventDate(event.date).getTime() >= today.getTime())
}
