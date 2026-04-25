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
      canonical: `https://preenvios.vercel.app/${locale}/nosotros`,
      languages: { es: 'https://preenvios.vercel.app/es/nosotros', en: 'https://preenvios.vercel.app/en/nosotros' },
    },
  }
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'

  // AboutPage vinculado a la Organization PreEnvios. El @id de Organization
  // matchea el declarado en la home para que Google entienda que es la
  // misma entidad en ambos sitios.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `https://preenvios.vercel.app/${locale}/nosotros`,
    inLanguage: locale,
    name: en ? 'About PreEnvios' : 'Sobre PreEnvios',
    description: en
      ? 'Independent remittance comparison tool built by and for the Latino diaspora in the US.'
      : 'Comparador independiente de remesas creado por y para la diáspora latina en EE.UU.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://preenvios.vercel.app/#organization',
      name: 'PreEnvios',
      url: 'https://preenvios.vercel.app',
      logo: 'https://preenvios.vercel.app/icon',
      foundingDate: '2026',
      description: en
        ? 'Free remittance comparison tool for USA → Latin America corridors.'
        : 'Comparador gratuito de remesas para los corredores USA → Latinoamérica.',
    },
  }

  return (
    <>
      <NosotrosContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
