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
      canonical: `https://preenvios.com/${locale}/metodologia`,
      languages: { es: 'https://preenvios.com/es/metodologia', en: 'https://preenvios.com/en/metodologia' },
    },
  }
}

export default async function MetodologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <MetodologiaContent />
}
