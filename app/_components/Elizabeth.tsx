import { AnchorDoodle, CraneDoodle, FerryDoodle } from './GinoSpotArt'

export function ElizabethFerry() {
  return (
    <div className="elizabeth" data-elizabeth aria-hidden="true">
      <span className="elizabeth-label">Elizabeth</span>
      <svg className="elizabeth-water" viewBox="0 0 1200 24" preserveAspectRatio="none">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          d="M0 12c40-8 80 8 120 0s80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0"
        />
      </svg>
      <div className="elizabeth-boat" data-elizabeth-boat>
        <FerryDoodle className="h-7 w-[4.4rem] md:h-8 md:w-20" />
      </div>
    </div>
  )
}

export function ElizabethBand() {
  return (
    <section aria-label="West of the Elizabeth" className="elizabeth-band">
      <CraneDoodle className="h-10 w-10 text-river/70" />
      <p className="font-sign text-[0.7rem] font-bold uppercase tracking-[0.22em] text-river">
        West of the Elizabeth
      </p>
      <AnchorDoodle className="h-10 w-10 text-river/70" />
    </section>
  )
}
