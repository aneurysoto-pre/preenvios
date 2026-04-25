import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MetodologiaContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Ranking methodology — PreEnvios.com' : 'Metodología del ranking — PreEnvios.com',
    description: en
      ? 'How PreEnvios.com ranks remittance providers: 5 weighted criteria — exchange rate, fee, delivery speed, reliability and available delivery methods.'
      : 'Cómo PreEnvios.com ordena las remesadoras: 5 criterios ponderados — tasa de cambio, comisión, velocidad, confiabilidad y métodos de entrega disponibles.',
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/metodologia`,
      languages: { es: 'https://preenvios.vercel.app/es/metodologia', en: 'https://preenvios.vercel.app/en/metodologia' },
    },
  }
}

export default async function MetodologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://preenvios.vercel.app/${locale}/metodologia#webpage`,
    url: `https://preenvios.vercel.app/${locale}/metodologia`,
    name: en ? 'Ranking methodology — PreEnvios.com' : 'Metodología del ranking — PreEnvios.com',
    inLanguage: locale,
    isPartOf: { '@id': 'https://preenvios.vercel.app/#website' },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }
  return (
    <>
      <MetodologiaContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
