import type { Metadata } from 'next'
import { Big_Shoulders_Display, Newsreader, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const display = Big_Shoulders_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
  display: 'swap',
})

const body = Newsreader({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  axes: ['opsz'],
})

const sign = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-sign',
  weight: ['500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Gino's Pizzeria | Court & Queen, Olde Towne Portsmouth",
  description:
    "Brick-oven pizza, calzones, subs, and homemade tiramisu at the corner of Court and Queen in Olde Towne Portsmouth. West of the Elizabeth River. Order for pickup or delivery.",
  metadataBase: new URL('https://www.ginospizzeriava.com'),
  openGraph: {
    title: "Gino's Pizzeria | Court & Queen",
    description: 'Meet you at the corner. Pizza, pasta, subs, and calzones in Olde Towne Portsmouth.',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'PizzaRestaurant',
  name: "Gino's Pizzeria",
  address: {
    '@type': 'PostalAddress',
    streetAddress: '455 Court St',
    addressLocality: 'Portsmouth',
    addressRegion: 'VA',
    postalCode: '23704',
  },
  telephone: '+17579982040',
  url: 'https://www.ginospizzeriava.com',
  servesCuisine: ['Pizza', 'Italian', 'Subs'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '11:00',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '11:00',
      closes: '20:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '12:00',
      closes: '19:00',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${sign.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  )
}
