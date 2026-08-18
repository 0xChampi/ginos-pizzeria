import type { Config } from 'tailwindcss'

// Gino's palette — Olde Towne brick, Elizabeth River dusk, pizza-box kraft,
// coal-oven dark, window-lamp amber. Named for the corner, not generic food.
// Tokens live in globals.css :root; keep this map in lockstep.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        oven: 'rgb(var(--oven) / <alpha-value>)',
        brick: 'rgb(var(--brick) / <alpha-value>)',
        river: 'rgb(var(--river) / <alpha-value>)',
        kraft: 'rgb(var(--kraft) / <alpha-value>)',
        mozz: 'rgb(var(--mozz) / <alpha-value>)',
        basil: 'rgb(var(--basil) / <alpha-value>)',
        lamp: 'rgb(var(--lamp) / <alpha-value>)',
        sauce: 'rgb(var(--sauce) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        sign: ['var(--font-sign)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(3.4rem, 11vw, 8.4rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
        'section-title': ['clamp(2.6rem, 6vw, 6.2rem)', { lineHeight: '0.88', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
}

export default config
