import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { hasDashSession } from '../../_lib/dash-session'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Back of the house · Gino’s',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function DashLoginPage() {
  if (hasDashSession()) redirect('/dash')
  return <LoginForm />
}
