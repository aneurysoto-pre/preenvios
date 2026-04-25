import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import AlertasContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Free daily alerts — PreEnvios.com' : 'Alertas diarias gratis — PreEnvios.com',
    description: en
      ? 'Get the best remittance rate of the day in your inbox. Free, no spam, unsubscribe anytime.'
      : 'Recibe la mejor tasa de remesas del día en tu inbox. Gratis, sin spam, te desuscribes cuando quieras.',
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/alertas`,
      languages: { es: 'https://preenvios.vercel.app/es/alertas', en: 'https://preenvios.vercel.app/en/alertas' },
    },
  }
}

export default async function AlertasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AlertasContent />
}
