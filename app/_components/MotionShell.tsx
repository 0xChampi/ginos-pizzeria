'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'

// Business-agnostic scroll-motion runtime. Ported from the house "Luscious"
// standard and made reusable: it reads plain data-attributes off the DOM and
// drives them via CSS custom properties, so any page can opt in without
// coupling to a specific theme (cleaning, focacceria, whatever).
//
// What it does:
//   • Lenis-style inertial wheel smoothing (damped scroll rides)
//   • data-parallax-layer  — scroll-parallaxed via --mx/--my/--mr/--ms, with
//     per-element depth from data-depth-x / data-depth-y / data-rotate
//   • data-image-plane      — hero/feature images fly in → settle → fly out on
//     a scroll "runway" (enter/center/exit phases)
//   • pointer parallax on the hero stage (mouse tilt)
//   • data-reveal           — sets data-revealed="true" on scroll-in
//   • a side page-progress orb
// All reduced-motion guarded: with reduced motion it renders static.

export type ParallaxInput = {
  pointerX: number
  pointerY: number
  scroll01: number
  scrollSigned: number
  scrollVelocity: number
}

export type MotionPreference = 'detecting' | 'full' | 'reduced'

type MotionContextValue = {
  input: MutableRefObject<ParallaxInput>
  motion: MotionPreference
}

const MotionContext = createContext<MotionContextValue | null>(null)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
function smoothstep(value: number) {
  const c = clamp(value, 0, 1)
  return c * c * (3 - 2 * c)
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function numberFromDataset(el: HTMLElement, key: keyof DOMStringMap, fallback: number) {
  const v = Number(el.dataset[key])
  return Number.isFinite(v) ? v : fallback
}

export function usePageMotion() {
  return useContext(MotionContext)
}

export default function MotionShell({
  children,
  enabled,
}: {
  children: ReactNode
  enabled: boolean
}) {
  const scope = useRef<HTMLDivElement>(null)
  const progressOrb = useRef<HTMLDivElement>(null)
  const input = useRef<ParallaxInput>({
    pointerX: 0,
    pointerY: 0,
    scroll01: 0,
    scrollSigned: 0,
    scrollVelocity: 0,
  })
  const [motion, setMotion] = useState<MotionPreference>(enabled ? 'detecting' : 'reduced')
  const contextValue = useMemo(() => ({ input, motion }), [motion])

  useEffect(() => {
    if (!enabled) {
      setMotion('reduced')
      return
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(query.matches ? 'reduced' : 'full')
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [enabled])

  useEffect(() => {
    const root = scope.current
    if (!root || !enabled) return

    const stage = root.querySelector<HTMLElement>('[data-motion-stage]')
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-section]'))
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax-layer]'))
    const imagePlanes = Array.from(root.querySelectorAll<HTMLElement>('[data-image-plane]'))
    const imagePlaneByName = new Map(
      imagePlanes.map((p) => [p.dataset.imagePlane, p] as const),
    )
    const imageAnchors = new Map(
      Array.from(root.querySelectorAll<HTMLElement>('[data-image-anchor]')).map(
        (a) => [a.dataset.imageAnchor, a] as const,
      ),
    )
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const visualViewport = window.visualViewport
    let pointerEnabled = pointerQuery.matches
    let animationFrame = 0
    let measureQueued = false
    let lastTickAt = performance.now()
    let velocityTimer: number | undefined
    let lastScrollY = window.scrollY
    let lastScrollAt = performance.now()
    let pageVisible = document.visibilityState !== 'hidden'
    let stageBounds: DOMRect | null = null

    type LayerState = { x: number; y: number; r: number; s: number }
    const layerTargets = new Map<HTMLElement, LayerState>()
    const layerCurrents = new Map<HTMLElement, LayerState>()
    const planeTargets = new Map<HTMLElement, LayerState>()
    const planeCurrents = new Map<HTMLElement, LayerState>()
    let orbTarget = 0
    let orbCurrent = 0
    let snapAll = false
    let wheelFrames = 0
    const LAYER_LAMBDA = 10
    const PLANE_LAMBDA = 6.5
    const ORB_LAMBDA = 8
    const SETTLE_EPSILON = 0.05

    const easeState = (current: LayerState, target: LayerState, k: number) => {
      current.x += (target.x - current.x) * k
      current.y += (target.y - current.y) * k
      current.r += (target.r - current.r) * k
      current.s += (target.s - current.s) * k
      return Math.max(
        Math.abs(target.x - current.x),
        Math.abs(target.y - current.y),
        Math.abs(target.r - current.r) * 8,
        Math.abs(target.s - current.s) * 120,
      )
    }

    root.dataset.sectionCount = String(sections.length)

    const resetTarget = (t: HTMLElement) => {
      const baseRotate = numberFromDataset(t, 'baseRotate', 0)
      const baseScale = numberFromDataset(t, 'baseScale', 1)
      t.style.setProperty('--mx', '0px')
      t.style.setProperty('--my', '0px')
      t.style.setProperty('--mr', `${baseRotate}deg`)
      t.style.setProperty('--ms', String(baseScale))
      t.style.willChange = 'auto'
    }
    const resetImagePlane = (p: HTMLElement) => {
      p.style.setProperty('--img-x', '0px')
      p.style.setProperty('--img-y', '0px')
      p.style.setProperty('--img-r', '0deg')
      p.style.setProperty('--img-scale', '1')
      p.style.willChange = 'auto'
    }
    const resetMotion = () => {
      input.current = { pointerX: 0, pointerY: 0, scroll01: 0, scrollSigned: 0, scrollVelocity: 0 }
      root.dataset.pageProgress = '0.000'
      progressOrb.current?.style.setProperty('--page-progress', '0')
      sections.forEach((s) => {
        s.dataset.motion = motion
        s.dataset.active = 'false'
        s.dataset.progress = '0.000'
      })
      targets.forEach(resetTarget)
      imagePlanes.forEach(resetImagePlane)
      layerTargets.clear()
      layerCurrents.clear()
      planeTargets.clear()
      planeCurrents.clear()
      orbTarget = 0
      orbCurrent = 0
    }

    resetMotion()
    if (motion !== 'full') return

    const setImagePlane = (
      plane: HTMLElement | undefined,
      state: { x: number; y: number; rotation: number; scale: number; active: boolean },
    ) => {
      if (!plane) return
      const target = { x: state.x, y: state.y, r: state.rotation, s: state.scale }
      planeTargets.set(plane, target)
      if (!state.active || snapAll) planeCurrents.set(plane, { ...target })
      plane.style.willChange = state.active ? 'transform' : 'auto'
    }

    const runwayState = (
      progress: number,
      enterEnd: number,
      exitStart: number,
      exitEnd: number,
      entry: { x: number; y: number; rotation: number; scale: number },
      exit: { x: number; y: number; rotation: number; scale: number },
    ) => {
      if (progress < enterEnd) {
        const e = smoothstep(progress / enterEnd)
        return { x: lerp(entry.x, 0, e), y: lerp(entry.y, 0, e), rotation: lerp(entry.rotation, 0, e), scale: lerp(entry.scale, 1, e) }
      }
      if (progress <= exitStart) return { x: 0, y: 0, rotation: 0, scale: 1 }
      const e = smoothstep((progress - exitStart) / Math.max(exitEnd - exitStart, 0.001))
      return { x: lerp(0, exit.x, e), y: lerp(0, exit.y, e), rotation: lerp(0, exit.rotation, e), scale: lerp(1, exit.scale, e) }
    }

    const update = () => {
      if (!pageVisible) return
      const viewportHeight = visualViewport?.height ?? window.innerHeight
      const viewportWidth = visualViewport?.width ?? window.innerWidth
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight)
      const pageProgress = clamp(scrollY / maxScroll, 0, 1)
      root.dataset.pageProgress = pageProgress.toFixed(3)
      orbTarget = pageProgress
      snapAll = wheelFrames === 0 && Math.abs(scrollY - lastScrollY) > 140
      if (wheelFrames > 0) wheelFrames -= 1
      if (snapAll) orbCurrent = orbTarget

      const now = performance.now()
      const elapsed = Math.max(now - lastScrollAt, 16)
      input.current.scrollVelocity = clamp((scrollY - lastScrollY) / elapsed / 1.4, -1, 1)
      lastScrollY = scrollY
      lastScrollAt = now
      if (velocityTimer) window.clearTimeout(velocityTimer)
      velocityTimer = window.setTimeout(() => { input.current.scrollVelocity = 0 }, 120)

      if (stage) {
        stageBounds = stage.getBoundingClientRect()
        const heroProgress = clamp((viewportHeight - stageBounds.top) / Math.max(viewportHeight + stageBounds.height, 1), 0, 1)
        input.current.scroll01 = heroProgress
        input.current.scrollSigned = smoothstep(heroProgress) * 2 - 1
        const compact = stageBounds.width < 700
        const heroTravel = compact ? viewportWidth * 0.58 : Math.min(viewportWidth * 0.52, 720)
        const heroState = runwayState(
          heroProgress, 0.3, 0.58, 0.88,
          { x: compact ? viewportWidth * 0.48 : Math.min(viewportWidth * 0.46, 620), y: compact ? 18 : 40, rotation: compact ? 3 : 5, scale: compact ? 0.95 : 0.94 },
          { x: heroTravel, y: compact ? -64 : -120, rotation: compact ? 4 : 7, scale: 0.96 },
        )
        setImagePlane(imagePlaneByName.get('hero'), {
          x: heroState.x + input.current.pointerX * (compact ? 0 : 4),
          y: heroState.y + input.current.pointerY * (compact ? 0 : 3),
          rotation: heroState.rotation + input.current.pointerX * (compact ? 0 : 0.34),
          scale: heroState.scale,
          active: stageBounds.bottom > -viewportHeight * 0.1 && stageBounds.top < viewportHeight * 1.1,
        })
      }

      const compactPage = viewportWidth < 700
      const yMul = compactPage ? 0.44 : 1
      const xMul = compactPage ? 0.28 : 1
      const rMul = compactPage ? 0.4 : 1

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const progress = clamp((viewportHeight - rect.top) / Math.max(viewportHeight + rect.height, 1), 0, 1)
        const signed = smoothstep(progress) * 2 - 1
        const active = rect.bottom > -viewportHeight * 0.25 && rect.top < viewportHeight * 1.25
        section.dataset.active = String(active)
        section.dataset.progress = progress.toFixed(3)

        section.querySelectorAll<HTMLElement>('[data-parallax-layer]').forEach((target) => {
          const depthY = numberFromDataset(target, 'depthY', 0)
          const depthX = numberFromDataset(target, 'depthX', 0)
          const rotation = numberFromDataset(target, 'rotate', 0)
          const baseRotate = numberFromDataset(target, 'baseRotate', 0)
          const baseScale = numberFromDataset(target, 'baseScale', 1)
          const centerScale = numberFromDataset(target, 'centerScale', 0)
          const x = signed * depthX * xMul
          const y = -signed * depthY * yMul
          const r = baseRotate + signed * rotation * rMul
          const scale = baseScale + (1 - Math.abs(signed)) * centerScale
          layerTargets.set(target, { x, y, r, s: scale })
          if (!active || snapAll) layerCurrents.set(target, { x, y, r, s: scale })
          target.style.willChange = active ? 'transform' : 'auto'
        })
      })

      // Feature image anchors fly-in/out on a runway.
      const runFor = (name: string, planeName: string, cfg: {
        enterEnd: number; exitStart: number; exitEnd: number
      }) => {
        const anchor = imageAnchors.get(name)
        if (!anchor) return
        const rect = anchor.getBoundingClientRect()
        const progress = clamp((viewportHeight - rect.top) / Math.max(viewportHeight + rect.height, 1), 0, 1)
        const compact = viewportWidth < 700
        const state = runwayState(
          progress, cfg.enterEnd, cfg.exitStart, cfg.exitEnd,
          { x: -viewportWidth * (compact ? 1.1 : 1.05), y: compact ? 26 : 52, rotation: compact ? -2.5 : -4, scale: compact ? 0.94 : 0.92 },
          { x: viewportWidth * (compact ? 1.1 : 1.05), y: compact ? -24 : -44, rotation: compact ? 2.5 : 4, scale: compact ? 0.95 : 0.94 },
        )
        setImagePlane(imagePlaneByName.get(planeName), {
          ...state,
          active: rect.bottom > -viewportHeight * 0.2 && rect.top < viewportHeight * 1.2,
        })
      }
      runFor('feature-a', 'featureA', { enterEnd: 0.36, exitStart: 0.64, exitEnd: 0.92 })
      runFor('feature-b', 'featureB', { enterEnd: 0.36, exitStart: 0.64, exitEnd: 0.92 })
    }

    const tick = (now: number) => {
      animationFrame = 0
      if (!pageVisible) return
      const dt = Math.min(Math.max(now - lastTickAt, 0) / 1000, 0.1)
      lastTickAt = now
      if (measureQueued) { measureQueued = false; update() }

      const layerK = 1 - Math.exp(-dt * LAYER_LAMBDA)
      const planeK = 1 - Math.exp(-dt * PLANE_LAMBDA)
      const orbK = 1 - Math.exp(-dt * ORB_LAMBDA)
      let unsettled = 0

      orbCurrent += (orbTarget - orbCurrent) * orbK
      unsettled = Math.max(unsettled, Math.abs(orbTarget - orbCurrent) * 148)
      progressOrb.current?.style.setProperty('--page-progress', orbCurrent.toFixed(4))

      layerTargets.forEach((target, el) => {
        let current = layerCurrents.get(el)
        if (!current) { current = { ...target }; layerCurrents.set(el, current) }
        unsettled = Math.max(unsettled, easeState(current, target, layerK))
        el.style.setProperty('--mx', `${current.x.toFixed(3)}px`)
        el.style.setProperty('--my', `${current.y.toFixed(3)}px`)
        el.style.setProperty('--mr', `${current.r.toFixed(3)}deg`)
        el.style.setProperty('--ms', current.s.toFixed(4))
      })
      planeTargets.forEach((target, el) => {
        let current = planeCurrents.get(el)
        if (!current) { current = { ...target }; planeCurrents.set(el, current) }
        unsettled = Math.max(unsettled, easeState(current, target, planeK))
        el.style.setProperty('--img-x', `${current.x.toFixed(3)}px`)
        el.style.setProperty('--img-y', `${current.y.toFixed(3)}px`)
        el.style.setProperty('--img-r', `${current.r.toFixed(3)}deg`)
        el.style.setProperty('--img-scale', current.s.toFixed(4))
      })

      if (unsettled > SETTLE_EPSILON || measureQueued) {
        animationFrame = window.requestAnimationFrame(tick)
      }
    }

    const scheduleUpdate = () => {
      measureQueued = true
      if (!animationFrame) {
        lastTickAt = performance.now()
        animationFrame = window.requestAnimationFrame(tick)
      }
    }
    const resetPointer = () => {
      input.current.pointerX = 0
      input.current.pointerY = 0
      scheduleUpdate()
    }
    const updatePointer = (event: PointerEvent) => {
      if (!pointerEnabled || event.pointerType === 'touch' || !stageBounds) return
      const rx = (event.clientX - stageBounds.left) / Math.max(stageBounds.width, 1)
      const ry = (event.clientY - stageBounds.top) / Math.max(stageBounds.height, 1)
      if (rx < 0 || rx > 1 || ry < 0 || ry > 1) { resetPointer(); return }
      input.current.pointerX = clamp(rx * 2 - 1, -1, 1)
      input.current.pointerY = clamp(1 - ry * 2, -1, 1)
      scheduleUpdate()
    }
    const handlePointerCapability = () => {
      pointerEnabled = pointerQuery.matches
      if (!pointerEnabled) resetPointer()
    }
    const handleVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden'
      if (pageVisible) scheduleUpdate()
    }

    // Reveal-on-scroll
    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    let revealObserver: IntersectionObserver | undefined
    let revealCleanup: (() => void) | undefined
    if (typeof IntersectionObserver === 'function') {
      revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.revealed = 'true'
          revealObserver?.unobserve(entry.target)
        }),
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )
      revealTargets.forEach((t) => revealObserver?.observe(t))
      // A hash jump or restored scroll position lands AFTER this effect runs, so
      // anything the jump skipped past never fires an intersection event and
      // would stay invisible forever. Sweep once the browser has settled.
      const sweepRevealed = () => {
        revealTargets.forEach((t) => {
          if (t.dataset.revealed === 'true') return
          const rect = t.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            t.dataset.revealed = 'true'
            revealObserver?.unobserve(t)
          }
        })
      }
      requestAnimationFrame(() => requestAnimationFrame(sweepRevealed))
      window.addEventListener('hashchange', sweepRevealed)
      revealCleanup = () => window.removeEventListener('hashchange', sweepRevealed)
    } else {
      revealTargets.forEach((t) => { t.dataset.revealed = 'true' })
    }

    // Inertial wheel smoothing
    let smoothTarget = window.scrollY
    let smoothFrame = 0
    const smoothTick = () => {
      smoothFrame = 0
      const current = window.scrollY
      const next = current + (smoothTarget - current) * 0.16
      wheelFrames = 3
      if (Math.abs(smoothTarget - next) < 0.5) {
        window.scrollTo({ top: smoothTarget, behavior: 'instant' as ScrollBehavior })
        return
      }
      window.scrollTo({ top: next, behavior: 'instant' as ScrollBehavior })
      smoothFrame = window.requestAnimationFrame(smoothTick)
    }
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (!smoothFrame) smoothTarget = window.scrollY
      smoothTarget = clamp(smoothTarget + event.deltaY * unit, 0, max)
      if (!smoothFrame) smoothFrame = window.requestAnimationFrame(smoothTick)
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    if (stage) resizeObserver.observe(stage)
    sections.forEach((s) => resizeObserver.observe(s))
    imageAnchors.forEach((a) => resizeObserver.observe(a))
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('blur', resetPointer)
    document.addEventListener('visibilitychange', handleVisibility)
    pointerQuery.addEventListener('change', handlePointerCapability)
    visualViewport?.addEventListener('resize', scheduleUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (smoothFrame) window.cancelAnimationFrame(smoothFrame)
      window.removeEventListener('wheel', onWheel)
      if (velocityTimer) window.clearTimeout(velocityTimer)
      revealObserver?.disconnect()
      revealCleanup?.()
      revealTargets.forEach((t) => { delete t.dataset.revealed })
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('blur', resetPointer)
      document.removeEventListener('visibilitychange', handleVisibility)
      pointerQuery.removeEventListener('change', handlePointerCapability)
      visualViewport?.removeEventListener('resize', scheduleUpdate)
      resetMotion()
    }
  }, [enabled, motion])

  return (
    <MotionContext.Provider value={contextValue}>
      <div ref={scope} data-motion={motion} data-section-count="0" data-page-progress="0.000" className="contents">
        {children}
      </div>
      {enabled ? (
        <div aria-hidden="true" className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-44 w-7 -translate-y-1/2 lg:block">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-pomodoro/20" />
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pomodoro" />
          <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pomodoro" />
          <div
            ref={progressOrb}
            className="absolute left-1/2 top-0 grid h-7 w-7 place-items-center rounded-full border border-panna/70 bg-pomodoro font-display text-[9px] font-black italic text-panna shadow-[0_8px_24px_rgba(211,58,44,0.28)]"
            style={{ transform: 'translate(-50%, calc(var(--page-progress, 0) * 148px))' }}
          >
            3
          </div>
        </div>
      ) : null}
    </MotionContext.Provider>
  )
}
