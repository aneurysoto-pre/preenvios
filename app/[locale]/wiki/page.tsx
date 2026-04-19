import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import WikiIndex from './wiki-index'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Remittance guides — PreEnvios Wiki' : 'Guías de remesas — Wiki PreEnvios',
    description: en
      ? 'Free educational guides: how remittances work, mid-market rate, fees vs rate, choosing the right provider and more.'
      : 'Guías educativas gratis: cómo funcionan las remesas, tasa mid-market, diferencia tasa/comisión, cómo elegir remesadora y más.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/wiki`,
      languages: { es: 'https://preenvios.com/es/wiki', en: 'https://preenvios.com/en/wiki' },
    },
  }
}

export default async function WikiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <WikiIndex />
}
