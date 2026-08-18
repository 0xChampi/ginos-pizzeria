import Image from 'next/image'
import MotionShell from './_components/MotionShell'
import AmbientFilm from './_components/AmbientFilm'
import { LookProvider, LookStage, LookSwitcher } from './_components/LookDeck'
import { ElizabethBand, ElizabethFerry } from './_components/Elizabeth'
import {
  WholePieDoodle,
  SlicePullDoodle,
  PeelDoodle,
  CalzoneDoodle,
  GarlicKnotDoodle,
  ShakerDoodle,
  PepperoniDoodle,
  StreetBladeDoodle,
  OvenMouthDoodle,
  WingsDoodle,
  SubDoodle,
  TiramisuDoodle,
  DoughBallDoodle,
  HeartPieDoodle,
  CallBellDoodle,
  HullDoodle,
  GullDoodle,
  CraneDoodle,
  AnchorDoodle,
} from './_components/GinoSpotArt'
import { brand, place, hours, court, queen, giant, asides, giorgio } from './content'

const plane = {
  transform:
    'translate(var(--img-x,0px),var(--img-y,0px)) rotate(var(--img-r,0deg)) scale(var(--img-scale,1))',
}


const plateIcon: Record<string, (p: { className?: string }) => JSX.Element> = {
  'Brick Oven Pizza': WholePieDoodle,
  Bianca: ShakerDoodle,
  Margherita: HeartPieDoodle,
  Rustica: PepperoniDoodle,
  Artichoke: GarlicKnotDoodle,
  'Meat Lovers': PeelDoodle,
  'The Bomb Sub': SubDoodle,
  'Milano Sub': SubDoodle,
  'Steak Philly': SubDoodle,
  'Chicken Parmigiana': OvenMouthDoodle,
  'Spaghetti and Meatballs': CallBellDoodle,
  'Homemade Tiramisu': TiramisuDoodle,
}

function CutImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      loading={priority ? undefined : 'eager'}
      sizes="(min-width: 1024px) 32vw, 80vw"
      className={className}
    />
  )
}

function StreetSign({
  children,
  tone = 'oven',
}: {
  children: string
  tone?: 'oven' | 'mozz' | 'lamp'
}) {
  const tones = {
    oven: 'border-oven bg-oven text-mozz',
    mozz: 'border-oven bg-mozz text-oven',
    lamp: 'border-oven bg-lamp text-oven',
  }
  return (
    <span className={`street-sign px-3 py-1 text-[0.7rem] md:px-4 md:text-xs ${tones[tone]}`}>
      {children}
    </span>
  )
}

export default function Page() {
  return (
    <MotionShell enabled>
      <LookProvider>
      <a href="#main" className="skip-link">
        Skip to the corner
      </a>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-oven/10 bg-mozz/90 px-5 pb-4 backdrop-blur-md md:gap-4 md:px-12 pt-[max(1rem,env(safe-area-inset-top))]">
        <LookSwitcher />
        <nav aria-label="On this page" className="hidden items-center gap-6 md:flex">
          <a href="#giorgio" className="focus-ring font-sign text-[0.65rem] font-bold uppercase tracking-[0.16em] text-oven/70 transition-colors duration-200 hover:text-brick">
            Giorgio
          </a>
          <a href="#menu" className="focus-ring font-sign text-[0.65rem] font-bold uppercase tracking-[0.16em] text-oven/70 transition-colors duration-200 hover:text-brick">
            Menu
          </a>
          <a href="#visit" className="focus-ring font-sign text-[0.65rem] font-bold uppercase tracking-[0.16em] text-oven/70 transition-colors duration-200 hover:text-brick">
            Visit
          </a>
        </nav>
        <div className="hidden items-center gap-2 lg:flex" aria-hidden="true">
          <StreetSign>Court</StreetSign>
          <span className="font-sign text-xs text-oven/40">&</span>
          <StreetSign tone="mozz">Queen</StreetSign>
        </div>
        <a
          href={brand.ctaHref}
          className="focus-ring order-btn rounded-none bg-brick px-4 py-2.5 font-sign text-[0.7rem] font-bold uppercase tracking-[0.16em] text-mozz hover:bg-sauce md:px-5"
        >
          Order
        </a>
      </header>

      <main id="main">
      <section
        id="top"
        data-motion-stage
        className="relative isolate min-h-[88vh] overflow-hidden px-5 pb-24 pt-6 md:px-12 md:pb-32 md:pt-10"
      >
        <AmbientFilm />
        <div
          data-parallax-layer
          data-depth-y="22"
          data-depth-x="-16"
          className="pointer-events-none absolute left-[-4%] top-[8%] z-10 text-brick/35"
        >
          <PepperoniDoodle className="h-28 w-28" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="18"
          data-depth-x="70"
          className="pointer-events-none absolute right-[18%] top-[6%] z-10 text-river/30"
        >
          <GullDoodle className="h-8 w-16 md:h-10 md:w-20" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="70"
          data-rotate="8"
          className="pointer-events-none absolute right-[6%] top-[12%] z-10 text-river/40"
        >
          <PeelDoodle className="h-24 w-24" />
        </div>

        <div className="relative z-10 grid items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="corner-rule pb-8 pl-6">
            <div data-reveal className="mb-8 flex flex-wrap items-end">
              <span className="street-sign border-oven bg-oven py-3 text-base text-mozz md:text-lg">
                Court St
              </span>
              <span className="street-sign -mb-5 -ml-4 rotate-[-11deg] border-oven bg-lamp py-3 text-base text-oven md:text-lg">
                Queen St
              </span>
            </div>

            <h1 className="text-balance font-display text-hero font-black uppercase text-oven [text-shadow:0_1px_0_rgb(var(--mozz)/0.55)]">
              Meet you
              <span className="mt-1 block pl-[8vw] text-brick md:pl-16">at the corner.</span>
            </h1>

            <p data-reveal className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-oven/80">
              {brand.sub}
            </p>

            <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={brand.ctaHref}
                className="focus-ring order-btn bg-brick px-6 py-3.5 font-sign text-xs font-bold uppercase tracking-[0.16em] text-mozz hover:-translate-y-0.5"
              >
                {brand.cta}
              </a>
              <a
                href={brand.phoneHref}
                className="focus-ring font-sign text-xs font-bold uppercase tracking-[0.14em] text-river underline decoration-lamp decoration-2 underline-offset-4"
              >
                {brand.phone}
              </a>
            </div>
          </div>

          <LookStage />
        </div>
        <div className="absolute bottom-0 left-0 z-10 h-1.5 w-2/3 bg-oven" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 z-10 h-1.5 w-1/3 bg-lamp" aria-hidden="true" />
      </section>

      <section aria-label="What the corner is made of" className="border-y-[3px] border-oven bg-kraft px-5 py-8 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          {(
            [
              { D: PeelDoodle, label: 'Peel', tone: 'text-oven' },
              { D: DoughBallDoodle, label: 'Dough', tone: 'text-brick' },
              { D: SlicePullDoodle, label: 'Slice', tone: 'text-sauce' },
              { D: ShakerDoodle, label: 'Mozz', tone: 'text-river' },
              { D: PepperoniDoodle, label: 'Sauce', tone: 'text-sauce' },
              { D: OvenMouthDoodle, label: 'Forno', tone: 'text-oven' },
            ] as const
          ).map(({ D, label, tone }) => (
            <div key={label} className="flex items-center gap-3">
              <D className={`h-12 w-12 ${tone}`} />
              <span className="font-display text-2xl italic leading-none text-oven/85">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section data-scroll-section className="coal-field relative overflow-hidden px-5 py-20 text-mozz md:px-12 md:py-28">
        <div
          data-parallax-layer
          data-depth-y="36"
          data-depth-x="-40"
          className="pointer-events-none absolute left-[-8%] top-[18%] text-mozz/10"
        >
          <HullDoodle className="h-16 w-52 md:h-24 md:w-80" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="50"
          data-rotate="-5"
          className="pointer-events-none absolute right-[8%] top-[10%] text-lamp/40"
        >
          <OvenMouthDoodle className="h-24 w-24" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="28"
          data-depth-x="18"
          className="pointer-events-none absolute bottom-[12%] left-[6%] text-brick/50"
        >
          <StreetBladeDoodle className="h-20 w-20" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[5fr_7fr]">
          <div data-image-anchor="feature-a" className="relative">
            <div data-image-plane="featureA" style={plane} className="relative -ml-6 w-80 md:-ml-10 md:w-[32rem]">
              <CutImage
                src="/generated/calzone-ink-cut.png"
                alt="Hand-inked illustration of a calzone with a cup of marinara"
                width={767}
                height={468}
                className="ink-cut h-auto w-full -rotate-2"
              />
            </div>
          </div>
          <div className="max-w-xl">
            <p data-reveal className="font-sign text-xs font-bold uppercase tracking-[0.22em] text-lamp">
              {place.kicker}
            </p>
            <h2 data-reveal className="mt-4 text-balance font-display text-section-title font-black uppercase">
              {place.heading}
            </h2>
            {place.body.map((p) => (
              <p key={p.slice(0, 28)} data-reveal className="mt-6 text-lg leading-relaxed text-mozz/80">
                {p}
              </p>
            ))}
            <p data-reveal className="mt-8 font-sign text-sm uppercase tracking-[0.14em] text-kraft">
              {asides[0]}
            </p>
            <CutImage
              src="/generated/dough-ball-ink-cut.png"
              alt="Hand-inked pizza dough in a flour bowl"
              width={584}
              height={514}
              className="ink-cut mt-10 h-auto w-36 -rotate-3 md:w-44"
            />
          </div>
        </div>
      </section>

      <ElizabethBand />

      <section id="giorgio" data-scroll-section className="relative overflow-hidden px-5 py-20 md:px-12 md:py-28">
        <div
          data-parallax-layer
          data-depth-y="48"
          data-rotate="6"
          className="pointer-events-none absolute right-[4%] top-[8%] text-brick/25"
        >
          <HeartPieDoodle className="h-24 w-24" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="30"
          data-depth-x="-16"
          className="pointer-events-none absolute bottom-[10%] left-[6%] text-river/30"
        >
          <CallBellDoodle className="h-16 w-16" />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr]">
          <div className="relative mx-auto w-72 md:w-[30rem]">
            <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-kraft to-lamp/35" aria-hidden="true" />
            <CutImage
              src="/generated/giorgio-portrait-ink-cut.png"
              alt="Hand-inked cartoon portrait of Giorgio, the elderly owner"
              width={1020}
              height={965}
              className="ink-cut relative z-10 h-auto w-full -rotate-2"
            />
            <DoughBallDoodle className="absolute -bottom-2 -right-4 z-10 h-16 w-16 rotate-12 text-lamp" />
          </div>
          <div className="max-w-xl">
            <p data-reveal className="font-sign text-xs font-bold uppercase tracking-[0.22em] text-brick">
              {giorgio.kicker}
            </p>
            <h2 data-reveal className="mt-4 text-balance font-display text-section-title font-black uppercase">
              {giorgio.name}. {giorgio.heading}
            </h2>
            <p data-reveal className="mt-3 font-sign text-xs uppercase tracking-[0.14em] text-oven/50">
              {giorgio.aka}
            </p>
            {giorgio.body.map((p) => (
              <p key={p.slice(0, 24)} data-reveal className="mt-6 text-lg leading-relaxed text-oven/80">
                {p}
              </p>
            ))}
            <p data-reveal className="mt-4 font-sign text-[0.7rem] uppercase tracking-[0.16em] text-brick">
              {giorgio.quoteAttr}
            </p>
          </div>
        </div>
      </section>

      <section id="menu" data-scroll-section className="relative overflow-hidden px-5 py-20 md:px-12 md:py-28">
        <div
          data-parallax-layer
          data-depth-y="60"
          data-rotate="7"
          className="pointer-events-none absolute left-[2%] top-[4%] text-brick/20"
        >
          <WholePieDoodle className="h-28 w-28" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="34"
          data-depth-x="-18"
          className="pointer-events-none absolute bottom-[6%] right-[4%] text-basil/30"
        >
          <CalzoneDoodle className="h-24 w-24" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="22"
          data-rotate="-8"
          className="pointer-events-none absolute right-[18%] top-[22%] text-sauce/25"
        >
          <WingsDoodle className="h-20 w-20" />
        </div>
        <CutImage
          src="/generated/italian-sub-ink-cut.png"
          alt="Hand-inked Italian sub"
          width={616}
          height={552}
          className="pointer-events-none absolute -right-4 top-[38%] hidden h-auto w-40 rotate-12 lg:block ink-cut"
        />
        <CutImage
          src="/generated/dough-ball-ink-cut.png"
          alt="Hand-inked pizza dough in a flour bowl"
          width={584}
          height={514}
          className="pointer-events-none absolute left-[36%] top-[8%] hidden h-auto w-28 -rotate-6 lg:block ink-cut"
        />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="max-w-xl text-balance font-display text-section-title font-black uppercase">
            Two streets. One menu.
          </h2>
          <p data-reveal className="max-w-sm text-lg leading-relaxed text-oven/70">
            Court is the oven. Queen is everything else you sit down for. Prices live on the board and in the order ticket.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <article className="corner-rule relative bg-kraft/55 p-7 md:col-span-7 md:p-10">
            <StreetSign>Court</StreetSign>
            <p className="mt-4 font-sign text-xs font-bold uppercase tracking-[0.2em] text-brick">
              {court.kicker}
            </p>
            <h3 className="mt-2 font-display text-4xl font-black uppercase leading-none md:text-5xl">
              {court.heading}
            </h3>
            <ul className="mt-8 space-y-5">
              {court.plates.map((plate, index) => (
                <li key={plate.name} className={`border-t border-oven/15 pt-4 ${index === 0 ? 'pt-6' : ''}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4
                      className={`flex items-center gap-2 font-display font-black uppercase ${
                        index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'
                      }`}
                    >
                      {(() => {
                        const Icon = plateIcon[plate.name]
                        return Icon ? <Icon className={`shrink-0 text-brick ${index === 0 ? 'h-9 w-9' : 'h-7 w-7'}`} /> : null
                      })()}
                      {plate.name}
                    </h4>
                    {'flag' in plate && plate.flag ? (
                      <span className="font-sign text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brick">
                        {plate.flag}
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-1 max-w-prose text-oven/75 ${index === 0 ? 'text-lg' : ''}`}>{plate.fill}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="river-field relative p-7 text-mozz md:col-span-5 md:translate-y-10 md:p-9">
            <StreetSign tone="lamp">Queen</StreetSign>
            <p className="mt-4 font-sign text-xs font-bold uppercase tracking-[0.2em] text-lamp">
              {queen.kicker}
            </p>
            <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none md:text-4xl">
              {queen.heading}
            </h3>
            <ul className="mt-8 space-y-5">
              {queen.plates.map((plate) => (
                <li key={plate.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="flex items-center gap-2 font-display text-xl font-black uppercase">
                      {(() => {
                        const Icon = plateIcon[plate.name]
                        return Icon ? <Icon className="h-6 w-6 shrink-0 text-lamp" /> : null
                      })()}
                      {plate.name}
                    </h4>
                    {'flag' in plate && plate.flag ? (
                      <span className="font-sign text-[0.65rem] font-bold uppercase tracking-[0.16em] text-lamp">
                        {plate.flag}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-mozz/75">{plate.fill}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="brick-field relative mt-10 overflow-hidden px-7 py-10 text-mozz md:-mt-4 md:ml-[18%] md:px-12">
          <PeelDoodle className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-mozz/10" />
          <CutImage
            src="/generated/giant-stromboli-ink-cut.png"
            alt="Hand-inked illustration of the Giant Gino stromboli"
            width={709}
            height={887}
            className="pointer-events-none absolute -right-6 bottom-0 hidden h-auto w-56 rotate-6 md:block ink-cut"
          />
          <p className="font-sign text-xs font-bold uppercase tracking-[0.2em] text-lamp">{giant.note}</p>
          <h3 className="mt-3 font-display text-5xl font-black uppercase leading-none md:text-7xl">{giant.name}</h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mozz/85">{giant.fill}</p>
        </article>
      </section>

      <section id="visit" data-scroll-section className="kraft-field relative overflow-hidden px-5 py-20 md:px-12 md:py-28">
        <div
          data-parallax-layer
          data-depth-y="44"
          data-rotate="-8"
          className="pointer-events-none absolute right-[12%] top-[14%] text-oven/20"
        >
          <AnchorDoodle className="h-20 w-20" />
        </div>
        <div
          data-parallax-layer
          data-depth-y="22"
          data-depth-x="24"
          className="pointer-events-none absolute left-[8%] bottom-[10%] text-river/25"
        >
          <CraneDoodle className="h-16 w-16" />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[6fr_6fr]">
          <div>
            <p data-reveal className="font-sign text-xs font-bold uppercase tracking-[0.22em] text-brick">
              Come find the corner
            </p>
            <h2 data-reveal className="mt-4 text-balance font-display text-section-title font-black uppercase">
              455 Court. Look for Queen.
            </h2>
            <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-oven/80">
              {asides[2]} {asides[1]}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <a
                href={place.mapsHref}
                className="focus-ring order-btn bg-oven px-5 py-3 font-sign text-xs font-bold uppercase tracking-[0.16em] text-mozz"
              >
                Open the map
              </a>
              <a
                href={brand.phoneHref}
                className="focus-ring border-2 border-oven px-5 py-3 font-sign text-xs font-bold uppercase tracking-[0.16em] text-oven"
              >
                Call the shop
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-end gap-6">
              <CutImage
                src="/generated/garlic-knots-ink-cut.png"
                alt="Hand-inked illustration of garlic knots"
                width={805}
                height={606}
                className="ink-cut h-auto w-40 -rotate-6 md:w-52"
              />
              <CutImage
                src="/generated/tiramisu-ink-cut.png"
                alt="Hand-inked illustration of homemade tiramisu"
                width={864}
                height={614}
                className="ink-cut h-auto w-32 rotate-3 md:w-40"
              />
              <CutImage
                src="/generated/italian-sub-ink-cut.png"
                alt="Hand-inked Italian sub"
                width={616}
                height={552}
                className="ink-cut h-auto w-36 -rotate-2 md:w-44"
              />
            </div>
          </div>

          <div data-reveal className="relative">
            <div className="absolute left-0 top-0 h-24 w-[3px] bg-oven" />
            <div className="absolute left-0 top-0 h-[3px] w-28 bg-oven" />
            <dl className="space-y-5 pl-8 pt-8">
              {hours.map(([day, time]) => (
                <div key={day} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-oven/15 pb-3">
                  <dt className="font-sign text-xs font-bold uppercase tracking-[0.16em]">{day}</dt>
                  <dd className="font-body text-lg tabular-nums">{time}</dd>
                </div>
              ))}
              <div className="pt-2">
                <dt className="sr-only">Address</dt>
                <dd className="font-display text-3xl font-black uppercase leading-none">
                  {place.address}
                </dd>
                <dd className="mt-2 font-sign text-xs uppercase tracking-[0.16em] text-oven/60">
                  {place.city}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      </main>

      <ElizabethFerry />

      <footer className="coal-field flex flex-col gap-4 px-5 pb-16 pt-8 text-sm text-mozz/70 md:flex-row md:items-center md:justify-between md:px-12">
        <span className="font-display text-2xl font-black uppercase text-mozz">
          {brand.wordmark} <span className="text-lamp">Pizzeria</span>
        </span>
        <span className="font-sign text-[0.7rem] uppercase tracking-[0.16em]">
          Court & Queen · Olde Towne Portsmouth · {brand.phone}
        </span>
      </footer>
      </LookProvider>
    </MotionShell>
  )
}
