import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoice — Gino’s Pizzeria',
  robots: { index: false, follow: false },
}

const phase1 = [
  {
    item: 'Custom website',
    detail: 'Court & Queen one-pager. Menu, Giorgio, visit, mobile, deploy.',
    amount: 1200,
  },
  {
    item: 'Giorgio likeness & shop art',
    detail: 'His portrait and the illustrated food. The site is built around these — not stock photos.',
    amount: 650,
  },
  {
    item: 'Logo, film & motion',
    detail: 'Wordmark and four Gino looks, oven film, scroll motion, Elizabeth ferry.',
    amount: 1350,
  },
  {
    item: 'Owner dashboard',
    detail: 'Giorgio changes today’s line, the featured plate, and specials himself. No call to anyone.',
    amount: 'included' as const,
  },
  {
    item: 'Revision rounds',
    detail: 'Color, pantry strip, brand-look switcher, boat, copy fixes. All included.',
    amount: 300,
  },
]

const phase2 = [
  {
    item: 'Direct ordering on his site',
    detail: 'Cart, pickup or delivery, card pay (Square or Stripe). Orders hit the shop — not Uber Eats / DoorDash as the storefront.',
    amount: 4500,
  },
  {
    item: 'Courier routing',
    detail: 'Uber Direct first, DoorDash Drive as backup. He keeps the customer. Couriers get a flat drop (~$6–8), not 15–30% of the check.',
    amount: 2500,
  },
]

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const familyDiscount = 500
const phase1Subtotal = phase1.reduce((sum, row) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0)
const phase1Total = phase1Subtotal - familyDiscount
const phase2Total = phase2.reduce((sum, row) => sum + row.amount, 0)
const phase2Bundle = 6500

export default function InvoicePage() {
  return (
    <main className="invoice-sheet mx-auto min-h-screen max-w-[44rem] bg-mozz px-6 py-10 text-oven md:px-10 md:py-14">
      <header className="flex items-start justify-between gap-6 border-b-[3px] border-oven pb-6">
        <div>
          <p className="font-sign text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brick">Invoice</p>
          <p className="mt-1 font-display text-[1.65rem] font-black uppercase leading-[0.95] md:text-3xl">
            1337 Singularity Systems
          </p>
          <p className="mt-3 font-body text-sm italic text-oven/60">Secure your network. Secure your net-worth.</p>
        </div>
        <div className="text-right font-sign text-[0.7rem] uppercase tracking-[0.14em]">
          <p>INV-GINO-0818</p>
          <p className="mt-1 text-oven/55">August 18, 2026</p>
          <p className="mt-1 text-brick">Due on receipt</p>
        </div>
      </header>

      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-sign text-[0.6rem] font-bold uppercase tracking-[0.2em] text-oven/45">From</p>
          <p className="mt-2 font-display text-2xl font-black uppercase leading-none">1337 Singularity Systems</p>
          <p className="mt-2 text-sm italic text-oven/70">Secure your network. Secure your net-worth.</p>
        </div>
        <div>
          <p className="font-sign text-[0.6rem] font-bold uppercase tracking-[0.2em] text-oven/45">Bill to</p>
          <p className="mt-2 font-display text-2xl font-black uppercase">Gino’s Pizzeria</p>
          <p className="mt-1 text-sm text-oven/70">George Haroon (Giorgio)</p>
          <p className="text-sm text-oven/70">455 Court St, Portsmouth, VA 23704</p>
        </div>
      </section>

      <section className="mt-10">
        <p className="font-sign text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brick">Phase 1 — due now</p>
        <p className="mt-1 max-w-md text-sm text-oven/70">
          Live Court & Queen site, owner dashboard, logo included. Friends and family rate.
        </p>
        <table className="mt-5 w-full border-collapse text-left">
          <thead>
            <tr className="font-sign text-[0.6rem] uppercase tracking-[0.16em] text-oven/45">
              <th className="pb-2 font-bold">Item</th>
              <th className="pb-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {phase1.map((row) => (
              <tr key={row.item} className="border-t border-oven/15 align-top">
                <td className="py-3 pr-4">
                  <p className="font-display text-lg font-black uppercase leading-tight">{row.item}</p>
                  <p className="mt-1 text-sm leading-snug text-oven/65">{row.detail}</p>
                </td>
                <td className="py-3 text-right font-sign text-sm tabular-nums">
                  {typeof row.amount === 'number' ? money(row.amount) : 'Included'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 space-y-2 border-t-[3px] border-oven pt-3">
          <div className="flex items-baseline justify-between font-sign text-sm">
            <p className="uppercase tracking-[0.14em] text-oven/55">Subtotal</p>
            <p className="tabular-nums">{money(phase1Subtotal)}</p>
          </div>
          <div className="flex items-baseline justify-between font-sign text-sm">
            <p className="uppercase tracking-[0.14em] text-brick">Friends & family</p>
            <p className="tabular-nums text-brick">−{money(familyDiscount)}</p>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <p className="font-sign text-[0.7rem] font-bold uppercase tracking-[0.16em]">Phase 1 total</p>
            <p className="font-display text-3xl font-black">{money(phase1Total)}</p>
          </div>
        </div>
      </section>

      <section className="mt-12 border border-oven/20 bg-kraft/25 px-5 py-6 md:px-7">
        <p className="font-sign text-[0.65rem] font-bold uppercase tracking-[0.2em] text-river">Optional — not billed unless he says yes</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none">Make it completely his</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-oven/75">
          Orders on his site, paid to him, kitchen ticket to the shop. Delivery is a courier he hires for that drop — Uber Direct, with DoorDash Drive as backup — not a listing on Uber Eats or DoorDash where they take 15–30% and own the customer.
        </p>
        <table className="mt-5 w-full border-collapse text-left">
          <tbody>
            {phase2.map((row) => (
              <tr key={row.item} className="border-t border-oven/15 align-top">
                <td className="py-3 pr-4">
                  <p className="font-display text-lg font-black uppercase leading-tight">{row.item}</p>
                  <p className="mt-1 text-sm leading-snug text-oven/65">{row.detail}</p>
                </td>
                <td className="whitespace-nowrap py-3 text-right font-sign text-sm tabular-nums">{money(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t-[3px] border-oven pt-3">
          <p className="font-sign text-[0.7rem] font-bold uppercase tracking-[0.16em]">If both</p>
          <p className="text-right">
            <span className="mr-2 font-sign text-xs uppercase tracking-[0.12em] text-oven/45 line-through">
              {money(phase2Total)}
            </span>
            <span className="font-display text-3xl font-black">{money(phase2Bundle)}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-oven/65">
          Terms if approved: half to start, half at launch. He still pays the card processor (~2.9%) and the courier per drop. No monthly cut to 1337 Singularity Systems.
        </p>
      </section>

      <section className="mt-8 text-sm text-oven/60">
        <p className="font-sign text-[0.6rem] font-bold uppercase tracking-[0.18em] text-oven/45">Not in either phase</p>
        <p className="mt-2 leading-relaxed">
          Uber Eats / DoorDash marketplace storefronts. Toast or Square POS hardware. Ongoing ads. Domain and hosting after the first year.
        </p>
      </section>

      <footer className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-oven/20 pt-5">
        <p className="max-w-xs text-sm text-oven/60">
          Payment: due on receipt for Phase 1. Details on request. Invoice is not on the public shop URL.
        </p>
        <p className="font-display text-xl font-black uppercase">
          Amount due <span className="text-brick">{money(phase1Total)}</span>
        </p>
      </footer>
    </main>
  )
}
