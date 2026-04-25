import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ComoGanamosContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'How we make money — PreEnvios.com' : 'Cómo ganamos dinero — PreEnvios.com',
    description: en
      ? 'Transparency: PreEnvios.com is funded by affiliate commissions from remittance providers at no cost to you. No hidden fees, no paid rankings.'
      : 'Transparencia total: PreEnvios.com se financia con comisiones de afiliado de las remesadoras, sin costo para ti. Sin fees ocultos ni rankings pagados.',
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/como-ganamos-dinero`,
      languages: { es: 'https://preenvios.vercel.app/es/como-ganamos-dinero', en: 'https://preenvios.vercel.app/en/como-ganamos-dinero' },
    },
  }
}

export default async function ComoGanamosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://preenvios.vercel.app/${locale}/como-ganamos-dinero#webpage`,
    url: `https://preenvios.vercel.app/${locale}/como-ganamos-dinero`,
    name: en ? 'How we make money — PreEnvios.com' : 'Cómo ganamos dinero — PreEnvios.com',
    inLanguage: locale,
    isPartOf: { '@id': 'https://preenvios.vercel.app/#website' },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }
  return (
    <>
      <ComoGanamosContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
