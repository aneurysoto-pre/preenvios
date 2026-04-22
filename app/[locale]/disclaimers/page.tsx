import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DisclaimersContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Disclaimers — PreEnvios.com' : 'Aclaraciones legales — PreEnvios.com',
    description: en
      ? 'Full disclaimers for PreEnvios.com: rates shown are approximate, we are not a financial institution, we do not process payments, and we may receive affiliate commissions.'
      : 'Aclaraciones legales completas de PreEnvios.com: las tasas mostradas son aproximadas, no somos una institución financiera, no procesamos pagos y podemos recibir comisiones de afiliado.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/disclaimers`,
      languages: { es: 'https://preenvios.com/es/disclaimers', en: 'https://preenvios.com/en/disclaimers' },
    },
  }
}

export default async function DisclaimersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DisclaimersContent />
}
