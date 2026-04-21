import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import AlertasContent from './content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en
      ? 'Free rate alerts — PreEnvios | Best daily rate in your email'
      : 'Alertas de tasas gratis — PreEnvios | Mejor tasa del día en tu email',
    description: en
      ? 'Subscribe free to daily rate alerts. Get the best rate from 7 remittance providers every morning for Honduras, Dominican Republic, Guatemala, El Salvador, Colombia and Mexico. No spam, cancel anytime.'
      : 'Suscríbete gratis a alertas diarias. Recibe la mejor tasa de 7 remesadoras cada mañana para Honduras, República Dominicana, Guatemala, El Salvador, Colombia y México. Sin spam, cancela cuando quieras.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/alertas`,
      languages: {
        es: 'https://preenvios.com/es/alertas',
        en: 'https://preenvios.com/en/alertas',
      },
    },
  }
}

export default async function AlertasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AlertasContent />
}
