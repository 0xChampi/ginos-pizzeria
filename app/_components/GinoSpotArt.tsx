// Gino's spot-art. House InkSwash idiom: currentColor strokes, 3.2 main
// pass, ~2.4 secondary at lowered opacity, round caps and joins. Objects
// belong to THIS corner: pie, pulled slice, peel, calzone, garlic knot,
// parm shaker, pepperoni, street blade, oven mouth.

type DoodleProps = { className?: string; 'data-testid'?: string }

export function WholePieDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="33" r="20" />
        <circle cx="32" cy="33" r="14" opacity="0.55" />
        <path d="M32 13v40M12 33h40" />
        <path d="M18 19l28 28M46 19L18 47" opacity="0.7" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <circle cx="26" cy="26" r="2.2" />
        <circle cx="40" cy="30" r="2" />
        <circle cx="30" cy="40" r="2.1" />
        <circle cx="38" cy="42" r="1.6" />
      </g>
    </svg>
  )
}

export function SlicePullDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 50L32 12l18 38Z" />
        <path d="M20 42h24" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M28 28c-2 6-1 12 2 16" opacity="0.7" />
        <path d="M36 26c2 7 1 13-1 18" opacity="0.55" />
        <circle cx="30" cy="36" r="1.8" />
        <circle cx="36" cy="40" r="1.6" />
      </g>
    </svg>
  )
}

export function PeelDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 48c8-3 18-8 28-18l8-8c3-3 8-2 10 1 2 2 3 7 0 10l-8 8C30 51 20 54 12 54Z" />
        <path d="M8 56l8-6" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M22 42c6-4 12-9 18-16" />
        <path d="M48 22l4-3M50 28h5" />
      </g>
    </svg>
  )
}

export function CalzoneDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 42c0-12 10-22 22-22s20 8 22 18c-8 4-16 8-22 8-10 0-18-2-22-4Z" />
        <path d="M16 40c6 2 14 4 20 4 8 0 16-2 22-5" opacity="0.55" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.6">
        <path d="M24 32v4M32 28v5M40 30v4" />
        <path d="M48 18c2-3 6-4 9-2" />
      </g>
    </svg>
  )
}

export function GarlicKnotDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 40c-4-8 2-16 12-16 6 0 10 3 12 8 4-4 12-2 12 6 0 8-8 14-18 14-10 0-20-4-18-12Z" />
        <path d="M28 32c2 4 8 6 14 4" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M22 22c-2-4-1-8 2-10M18 26c-4-1-7 1-8 4" />
      </g>
    </svg>
  )
}

export function ShakerDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 22h16l4 8v22c0 3-3 6-8 6H28c-5 0-8-3-8-6V30Z" />
        <path d="M26 22V16h12v6" />
        <path d="M24 30h16" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M30 16v-4M34 16v-5M38 16v-3" />
        <path d="M30 40h8M28 46h12" />
      </g>
    </svg>
  )
}

export function PepperoniDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
        <circle cx="24" cy="28" r="12" />
        <circle cx="40" cy="38" r="10" />
        <circle cx="44" cy="20" r="7" opacity="0.75" />
      </g>
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.45">
        <path d="M20 24c1 2 3 3 5 3M38 34c1 2 3 3 5 2M42 18c1 1 2 2 3 2" />
      </g>
    </svg>
  )
}

export function StreetBladeDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 22h36l6 6-6 6H10l6-6Z" />
        <path d="M18 38h28l5 5-5 5H18l5-5Z" />
        <path d="M32 10v12M32 34v4" opacity="0.7" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M20 28h18M24 43h16" />
      </g>
    </svg>
  )
}

export function WingsDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 42c2-10 8-18 16-22 2 8 1 16-2 22" />
        <path d="M22 44c4-12 12-18 20-20 0 8-2 16-6 22" />
        <path d="M18 46h8M26 46h10" opacity="0.55" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M16 28c-3-2-4-6-2-8M40 26c3-3 7-3 9 0" />
      </g>
    </svg>
  )
}

export function SubDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 36c6-8 18-12 24-12s18 4 24 12c-2 6-8 10-24 10S10 42 8 36Z" />
        <path d="M14 34h36" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.6">
        <path d="M18 30c2 2 4 2 6 0M30 29c2 2 5 2 7 0M42 30c2 2 4 2 6 0" />
      </g>
    </svg>
  )
}

export function TiramisuDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 44V28h32v16c0 4-4 6-16 6s-16-2-16-6Z" />
        <path d="M16 36h32M16 30h32" opacity="0.55" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M22 24c2-4 6-6 10-4M36 22c3-3 8-2 10 2" />
        <path d="M24 40h4M32 38h4M40 40h3" />
      </g>
    </svg>
  )
}

export function DoughBallDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="40" rx="20" ry="10" />
        <path d="M14 38c2-12 10-20 18-20s16 8 18 20" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M26 28c2 3 6 4 10 2M20 36h6M40 35h5" />
      </g>
    </svg>
  )
}

export function HeartPieDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 52C18 42 10 34 10 24c0-7 6-12 12-12 5 0 8 3 10 6 2-3 5-6 10-6 6 0 12 5 12 12 0 10-8 18-22 28Z" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <circle cx="24" cy="26" r="2" />
        <circle cx="34" cy="30" r="1.8" />
        <circle cx="28" cy="36" r="1.6" />
      </g>
    </svg>
  )
}

export function CallBellDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 40c0-10 7-18 16-18s16 8 16 18" />
        <path d="M14 42h36" />
        <circle cx="32" cy="20" r="3" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M44 18l6-4M48 24h6" />
      </g>
    </svg>
  )
}

export function FerryDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 96 36" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 24c4 6 12 8 22 8h42c8 0 12-3 14-7l-8-3H28Z" />
        <path d="M40 12h24v10H40Z" />
        <path d="M46 6h6v6" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M46 16h5M56 16h5" />
        <path d="M6 28h8M2 32h10" />
      </g>
    </svg>
  )
}

export function CraneDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 56h20M30 56V10" />
        <path d="M30 16h26" />
        <path d="M56 16v14" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M52 30h8" />
        <path d="M22 24h8M22 34h8M22 44h8" />
      </g>
    </svg>
  )
}

export function AnchorDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="12" r="5" />
        <path d="M32 17v28" />
        <path d="M20 24h24" />
        <path d="M32 45c-12 0-16 8-16 8M32 45c12 0 16 8 16 8" />
      </g>
    </svg>
  )
}

export function HullDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 120 36" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 26 20 16h78l14 10H6Z" />
        <path d="M48 8h14v8H48Z" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M76 12h10v6" />
        <path d="M28 20h8M92 20h6" />
      </g>
    </svg>
  )
}

export function GullDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 32" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M8 20q12-14 22 0" />
        <path d="M30 20q12-14 22 0" opacity="0.7" />
      </g>
    </svg>
  )
}

export function OvenMouthDoodle({ className = '', ...rest }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className} {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 50V28c0-10 10-18 24-18s24 8 24 18v22" />
        <path d="M8 50h48" />
        <path d="M18 50V34c0-6 6-10 14-10s14 4 14 10v16" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M28 40c0-4 2-6 4-6s4 2 4 6" />
        <path d="M24 14c2-4 6-6 10-4M40 14c3-3 8-3 10 0" />
      </g>
    </svg>
  )
}
