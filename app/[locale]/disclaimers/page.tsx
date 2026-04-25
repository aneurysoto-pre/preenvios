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
      canonical: `https://preenvios.vercel.app/${locale}/disclaimers`,
      languages: { es: 'https://preenvios.vercel.app/es/disclaimers', en: 'https://preenvios.vercel.app/en/disclaimers' },
    },
  }
}

export default async function DisclaimersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://preenvios.vercel.app/${locale}/disclaimers#webpage`,
    url: `https://preenvios.vercel.app/${locale}/disclaimers`,
    name: en ? 'Disclaimers — PreEnvios.com' : 'Aclaraciones legales — PreEnvios.com',
    inLanguage: locale,
    isPartOf: { '@id': 'https://preenvios.vercel.app/#website' },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }
  return (
    <>
      <DisclaimersContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
