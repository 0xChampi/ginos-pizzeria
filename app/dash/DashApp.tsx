'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { menuPlates } from '../content'
import {
  eventStatusLabel,
  formatEventDate,
  upcomingEvents,
  type DashData,
  type DashEvent,
  type EventStatus,
} from '../_lib/dash-types'

const STATUSES: EventStatus[] = ['open', 'fast', 'sold']

const newEvent = (): DashEvent => ({
  id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  date: '',
  time: '',
  status: 'open',
  blurb: '',
})

function Mark({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 font-sign text-[0.65rem] font-bold uppercase tracking-[0.2em] text-oven/50">
      <span className="h-px w-8 bg-oven/25" />
      <span>{children}</span>
    </p>
  )
}

export default function DashApp({ initial }: { initial: DashData }) {
  const router = useRouter()
  const [data, setData] = useState<DashData>(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const edit = (next: Partial<DashData>) => {
    setData((current) => ({ ...current, ...next }))
    setDirty(true)
    setNotice('')
  }

  const editEvent = (id: string, patch: Partial<DashEvent>) =>
    edit({ events: data.events.map((event) => (event.id === id ? { ...event, ...patch } : event)) })

  const removeEvent = (id: string) => edit({ events: data.events.filter((event) => event.id !== id) })

  const addEvent = () => edit({ events: [...data.events, newEvent()] })

  const liveCount = useMemo(
    () => upcomingEvents(data.events.filter((event) => event.title && event.date)).length,
    [data.events],
  )

  const publish = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/dash/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 401) {
        router.push('/dash/login')
        return
      }
      const saved = await res.json()
      if (!res.ok) {
        setError(saved.error ?? 'Could not save that.')
        return
      }
      setData(saved)
      setDirty(false)
      setNotice('Published. The shop has it now.')
    } catch {
      setError('Network trouble saving. Nothing was lost — try again.')
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await fetch('/api/dash/logout', { method: 'POST' })
    router.push('/dash/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-mozz text-oven">
      <header className="sticky top-0 z-40 border-b border-mozz/15 bg-oven/95 text-mozz backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-black uppercase sm:text-3xl">Gino&apos;s</span>
            <span className="hidden font-sign text-[10px] font-bold uppercase tracking-[0.24em] text-lamp sm:inline">
              Back of the house
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="focus-ring hidden px-3 py-2 font-sign text-[11px] font-bold uppercase tracking-[0.14em] text-mozz/60 transition hover:text-mozz sm:inline"
            >
              See the shop ↗
            </a>
            <button
              type="button"
              onClick={publish}
              disabled={busy || !dirty}
              className="focus-ring bg-brick px-4 py-3 font-sign text-[11px] font-bold uppercase tracking-[0.14em] text-mozz transition hover:bg-mozz hover:text-oven disabled:opacity-40 sm:px-5"
            >
              {busy ? 'Publishing…' : dirty ? <><span className="sm:hidden">Publish</span><span className="hidden sm:inline">Publish to the shop</span></> : 'Published'}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="focus-ring border border-mozz/30 px-4 py-3 font-sign text-[11px] font-bold uppercase tracking-[0.14em] text-mozz/70 transition hover:border-mozz hover:text-mozz"
            >
              Lock up
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="font-display text-3xl italic text-brick sm:text-4xl">The back of the house.</p>
        <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl">
          What&apos;s on
          <br />
          the board?
        </h1>

        {(notice || error) && (
          <p
            role="status"
            className={`mt-6 font-sign text-xs font-bold uppercase tracking-[0.14em] ${error ? 'text-sauce' : 'text-basil'}`}
          >
            {error || notice}
          </p>
        )}

        <section className="mt-12 border-t border-oven/20 pt-8">
          <Mark>Today at the corner</Mark>
          <p className="mt-3 max-w-xl text-sm leading-6 text-oven/55">
            The plate people should crave when they land. Tap one. It marks the menu and the hero.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {menuPlates.map((plate) => {
              const active = data.featuredPlate === plate.name
              return (
                <button
                  key={plate.name}
                  type="button"
                  onClick={() => edit({ featuredPlate: plate.name })}
                  aria-pressed={active}
                  className={`focus-ring border p-4 text-left transition ${
                    active ? 'border-brick bg-oven text-mozz' : 'border-oven/20 hover:border-oven/50'
                  }`}
                >
                  <span className={`font-display text-xl font-black uppercase ${active ? 'text-lamp' : ''}`}>
                    {plate.name}
                  </span>
                  <span className={`mt-1 block text-xs leading-5 ${active ? 'text-mozz/55' : 'text-oven/45'}`}>
                    {plate.fill}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8">
            <label htmlFor="todayLine" className="font-sign text-[11px] font-bold uppercase tracking-[0.18em] text-oven/50">
              A line for today (optional)
            </label>
            <input
              id="todayLine"
              type="text"
              maxLength={160}
              value={data.todayLine}
              onChange={(event) => edit({ todayLine: event.target.value })}
              placeholder="The Bomb is moving. Giant Gino needs twenty minutes. Closed Sunday for Easter."
              className="focus-ring mt-2 w-full border border-oven/25 bg-transparent px-4 py-4 text-base outline-none placeholder:text-oven/35 focus:border-brick"
            />
            <p className="mt-2 text-xs text-oven/45">Shows under the headline. Leave it empty to hide it.</p>
          </div>
        </section>

        <section className="mt-14 border-t border-oven/20 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Mark>Specials & nights</Mark>
              <p className="mt-3 max-w-xl text-sm leading-6 text-oven/55">
                Catering, closed days, a pie that is only tonight. Dated today or later shows on the shop;
                past nights fall off by themselves.
                {liveCount > 0 ? ` Live right now: ${liveCount}.` : ' Nothing is live right now.'}
              </p>
            </div>
            <button
              type="button"
              onClick={addEvent}
              className="focus-ring bg-oven px-5 py-4 font-sign text-xs font-bold uppercase tracking-[0.15em] text-mozz transition hover:bg-brick"
            >
              Add a night +
            </button>
          </div>

          {data.events.length === 0 ? (
            <p className="mt-8 border border-dashed border-oven/25 p-8 text-center font-display text-xl italic text-oven/45">
              Nothing on the board yet. Add one and the shop announces it.
            </p>
          ) : (
            <div className="mt-8 grid gap-5">
              {data.events.map((event) => (
                <article key={event.id} className="border border-oven/20 p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-[1.4fr_.6fr]">
                    <div>
                      <label
                        className="font-sign text-[11px] font-bold uppercase tracking-[0.16em] text-oven/50"
                        htmlFor={`title-${event.id}`}
                      >
                        The night
                      </label>
                      <input
                        id={`title-${event.id}`}
                        type="text"
                        maxLength={120}
                        value={event.title}
                        onChange={(change) => editEvent(event.id, { title: change.target.value })}
                        placeholder="Catering Saturday · Closed Easter"
                        className="focus-ring mt-2 w-full border border-oven/25 bg-transparent px-4 py-3 text-lg outline-none placeholder:text-oven/35 focus:border-brick"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          className="font-sign text-[11px] font-bold uppercase tracking-[0.16em] text-oven/50"
                          htmlFor={`date-${event.id}`}
                        >
                          Date
                        </label>
                        <input
                          id={`date-${event.id}`}
                          type="date"
                          value={event.date}
                          onChange={(change) => editEvent(event.id, { date: change.target.value })}
                          className="focus-ring mt-2 w-full border border-oven/25 bg-transparent px-3 py-3 text-sm outline-none focus:border-brick"
                        />
                      </div>
                      <div>
                        <label
                          className="font-sign text-[11px] font-bold uppercase tracking-[0.16em] text-oven/50"
                          htmlFor={`time-${event.id}`}
                        >
                          Time
                        </label>
                        <input
                          id={`time-${event.id}`}
                          type="text"
                          maxLength={60}
                          value={event.time}
                          onChange={(change) => editEvent(event.id, { time: change.target.value })}
                          placeholder="All day"
                          className="focus-ring mt-2 w-full border border-oven/25 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-oven/35 focus:border-brick"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      className="font-sign text-[11px] font-bold uppercase tracking-[0.16em] text-oven/50"
                      htmlFor={`blurb-${event.id}`}
                    >
                      The pitch
                    </label>
                    <textarea
                      id={`blurb-${event.id}`}
                      rows={2}
                      maxLength={400}
                      value={event.blurb}
                      onChange={(change) => editEvent(event.id, { blurb: change.target.value })}
                      placeholder="Call before we 86 it. Giant Gino needs twenty minutes."
                      className="focus-ring mt-2 w-full resize-y border border-oven/25 bg-transparent px-4 py-3 text-sm leading-6 outline-none placeholder:text-oven/35 focus:border-brick"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2" role="group" aria-label="Board status">
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => editEvent(event.id, { status })}
                          aria-pressed={event.status === status}
                          className={`focus-ring border px-4 py-2.5 font-sign text-[11px] font-bold uppercase tracking-[0.13em] transition ${
                            event.status === status
                              ? status === 'sold'
                                ? 'border-oven bg-oven text-mozz'
                                : status === 'fast'
                                  ? 'border-brick bg-brick text-mozz'
                                  : 'border-basil bg-basil text-mozz'
                              : 'border-oven/25 text-oven/55 hover:border-oven/60'
                          }`}
                        >
                          {eventStatusLabel[status]}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      {event.date && /^\d{4}-\d{2}-\d{2}$/.test(event.date) && (
                        <span className="font-sign text-[11px] font-bold uppercase tracking-[0.14em] text-brick">
                          {formatEventDate(event.date)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeEvent(event.id)}
                        className="focus-ring font-sign text-[11px] font-bold uppercase tracking-[0.13em] text-oven/40 underline decoration-brick underline-offset-4 transition hover:text-brick"
                      >
                        Take it off
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 flex flex-col gap-2 border-t border-oven/15 pt-6 font-sign text-[11px] font-semibold uppercase tracking-[0.14em] text-oven/40 sm:flex-row sm:justify-between">
          <span>Court & Queen · the back of the house</span>
          <span>Publish, then go check the shop.</span>
        </footer>
      </div>
    </main>
  )
}
