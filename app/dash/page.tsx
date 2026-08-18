import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { hasDashSession } from '../_lib/dash-session'
import { readDashData } from '../_lib/dash-store'
import DashApp from './DashApp'

export const metadata: Metadata = {
  title: 'Back of the house · Gino’s',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DashPage() {
  if (!hasDashSession()) redirect('/dash/login')
  return <DashApp initial={await readDashData()} />
}
