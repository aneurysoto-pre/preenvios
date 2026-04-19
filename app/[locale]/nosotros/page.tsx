import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NosotrosContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'About us — PreEnvios.com' : 'Nosotros — PreEnvios.com',
    description: en
      ? 'Independent remittance comparison tool built by and for the Latino diaspora. Our mission, values and how we make money — fully transparent.'
      : 'Comparador independiente de remesas creado por y para la diáspora latina. Nuestra misión, valores y cómo ganamos dinero — con total transparencia.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/nosotros`,
      languages: { es: 'https://preenvios.com/es/nosotros', en: 'https://preenvios.com/en/nosotros' },
    },
  }
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <NosotrosContent />
}
