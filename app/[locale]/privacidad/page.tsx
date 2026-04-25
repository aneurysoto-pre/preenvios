import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import PrivacidadContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Privacy policy — PreEnvios.com' : 'Política de privacidad — PreEnvios.com',
    description: en
      ? 'How PreEnvios.com handles your data. Cookies, analytics, CCPA and GDPR user rights. We do not share personal data with third parties.'
      : 'Cómo PreEnvios.com maneja tus datos. Cookies, analítica, derechos del usuario bajo CCPA y GDPR. No compartimos datos personales con terceros.',
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/privacidad`,
      languages: { es: 'https://preenvios.vercel.app/es/privacidad', en: 'https://preenvios.vercel.app/en/privacidad' },
    },
  }
}

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://preenvios.vercel.app/${locale}/privacidad#webpage`,
    url: `https://preenvios.vercel.app/${locale}/privacidad`,
    name: en ? 'Privacy policy — PreEnvios.com' : 'Política de privacidad — PreEnvios.com',
    inLanguage: locale,
    isPartOf: { '@id': 'https://preenvios.vercel.app/#website' },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }
  return (
    <>
      <PrivacidadContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
