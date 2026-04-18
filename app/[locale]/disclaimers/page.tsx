import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DisclaimersContent from './content'

export const metadata: Metadata = {
  title: 'Disclaimers — PreEnvios.com',
  robots: { index: false, follow: false },
}

export default async function DisclaimersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DisclaimersContent />
}
