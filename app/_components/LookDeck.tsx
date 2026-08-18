'use client'

import Image from 'next/image'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export const LOOKS = [
  {
    id: 'crest',
    name: 'Seal',
    logo: '/brand/logo-crest.png',
    poster: '/brand/crest.jpg',
    width: 1024,
    height: 1024,
    alt: 'Circular seal of Gino holding a brick-oven pie',
  },
  {
    id: 'heritage',
    name: 'Heritage',
    logo: '/brand/logo-heritage.png',
    poster: '/brand/heritage.jpg',
    width: 862,
    height: 1024,
    alt: 'Heritage collage of Gino, pies, and Portsmouth',
  },
  {
    id: 'oven',
    name: "Own Gino",
    logo: '/brand/logo-oven.png',
    poster: '/brand/oven.jpg',
    width: 862,
    height: 1024,
    alt: "Portsmouth's Own Gino holding a pie at the oven",
  },
  {
    id: 'table',
    name: 'Box',
    logo: '/brand/logo-table.png',
    poster: '/brand/table.jpg',
    width: 862,
    height: 1024,
    alt: "Kraft pizza-box tabletop with the Gino's script mark",
  },
] as const

export type LookId = (typeof LOOKS)[number]['id']

type LookContextValue = {
  look: (typeof LOOKS)[number]
  setLookId: (id: LookId) => void
}

const LookContext = createContext<LookContextValue | null>(null)

function isLookId(value: string | null): value is LookId {
  return LOOKS.some((look) => look.id === value)
}

export function LookProvider({ children }: { children: ReactNode }) {
  const [lookId, setLookId] = useState<LookId>('crest')

  useEffect(() => {
    const saved = sessionStorage.getItem('ginos-look')
    if (isLookId(saved)) setLookId(saved)
  }, [])

  useEffect(() => {
    sessionStorage.setItem('ginos-look', lookId)
  }, [lookId])

  const look = LOOKS.find((item) => item.id === lookId) ?? LOOKS[0]

  return (
    <LookContext.Provider value={{ look, setLookId }}>
      {children}
    </LookContext.Provider>
  )
}

function useLook() {
  const context = useContext(LookContext)
  if (!context) {
    throw new Error('Look switcher needs LookProvider')
  }
  return context
}

export function LookSwitcher() {
  const { look, setLookId } = useLook()

  return (
    <div
      role="group"
      data-look-switcher
      aria-label="Gino's logo looks"
      className="flex shrink-0 items-center gap-1.5 md:gap-2"
    >
      {LOOKS.map((item) => {
        const pressed = look.id === item.id
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={pressed}
            aria-label={`Show the ${item.name} look`}
            onClick={() => setLookId(item.id)}
            className={`look-mark focus-ring ${pressed ? 'look-mark-on' : ''}`}
          >
            <Image
              src={item.logo}
              alt=""
              width={112}
              height={112}
              unoptimized
              className="h-full w-full object-cover"
            />
          </button>
        )
      })}
    </div>
  )
}

export function LookStage() {
  const { look } = useLook()

  return (
    <figure data-look-stage={look.id} className="relative mx-auto w-72 md:w-[30rem]">
      <Image
        src={look.poster}
        alt={look.alt}
        width={look.width}
        height={look.height}
        priority
        unoptimized
        loading="eager"
        sizes="(min-width: 1024px) 30rem, 80vw"
        className="h-auto w-full rotate-1 shadow-[0_22px_48px_rgb(var(--oven)/0.32)]"
      />
      <figcaption className="mt-3 text-center font-sign text-[0.65rem] font-bold uppercase tracking-[0.18em] text-oven/55">
        {look.name}
      </figcaption>
    </figure>
  )
}
