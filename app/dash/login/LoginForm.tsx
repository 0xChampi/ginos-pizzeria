'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/dash/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'That is not it.')
        return
      }
      router.push('/dash')
      router.refresh()
    } catch {
      setError('Network trouble. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-oven px-4 text-mozz">
      <div className="w-full max-w-md border border-mozz/15 bg-mozz/[0.04] p-8 sm:p-10">
        <p className="flex items-center gap-3 font-sign text-[11px] font-bold uppercase tracking-[0.24em] text-lamp">
          <span className="h-2 w-2 bg-brick" /> Court & Queen
        </p>
        <h1 className="mt-5 font-display text-5xl font-black uppercase tracking-[-0.04em]">
          The back of the house.
        </h1>
        <p className="mt-4 text-sm leading-6 text-mozz/60">Family only. Giorgio&apos;s word.</p>

        <form onSubmit={submit} className="mt-8">
          <label htmlFor="passcode" className="font-sign text-[11px] font-bold uppercase tracking-[0.18em] text-mozz/50">
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            autoComplete="current-password"
            required
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            className="focus-ring mt-2 w-full border border-mozz/25 bg-transparent px-4 py-4 text-base outline-none placeholder:text-mozz/30 focus:border-lamp"
            placeholder="You know the word"
          />
          <button
            type="submit"
            disabled={busy}
            className="focus-ring mt-4 w-full bg-brick px-6 py-4 font-sign text-xs font-bold uppercase tracking-[0.16em] text-mozz transition hover:bg-mozz hover:text-oven disabled:opacity-50"
          >
            {busy ? 'Checking…' : 'Open the back'}
          </button>
          {error && (
            <p role="alert" className="mt-4 font-sign text-xs font-bold uppercase tracking-[0.13em] text-lamp">
              {error}
            </p>
          )}
        </form>

        <p className="mt-8 border-t border-mozz/15 pt-5 font-sign text-[11px] font-semibold uppercase tracking-[0.15em] text-mozz/35">
          Gino&apos;s · Olde Towne Portsmouth
        </p>
      </div>
    </main>
  )
}
