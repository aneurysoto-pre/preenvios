import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NosotrosContent from './content'

export const metadata: Metadata = {
  title: 'Nosotros — PreEnvios.com',
  description: 'Comparador independiente de remesas creado por y para la diáspora latina.',
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <NosotrosContent />
}
