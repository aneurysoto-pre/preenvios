import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactoContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Contact — PreEnvios.com' : 'Contacto — PreEnvios.com',
    description: en
      ? 'Reach out to PreEnvios — questions, rate issues, partnerships, press. We reply within 48 hours.'
      : 'Escríbenos a PreEnvios — consultas, problemas con tasas, partnerships, prensa. Respondemos en menos de 48 horas.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/contacto`,
      languages: { es: 'https://preenvios.com/es/contacto', en: 'https://preenvios.com/en/contacto' },
    },
  }
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `https://preenvios.com/${locale}/contacto`,
    inLanguage: locale,
    name: en ? 'Contact PreEnvios' : 'Contacto PreEnvios',
    description: en
      ? 'Reach out to PreEnvios — questions, rate issues, partnerships, press. We reply within 48 hours.'
      : 'Escríbenos a PreEnvios — consultas, problemas con tasas, partnerships, prensa. Respondemos en menos de 48 horas.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://preenvios.com/#organization',
      name: 'PreEnvios',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@preenvios.com',
        contactType: 'customer service',
        availableLanguage: ['es', 'en'],
      },
    },
  }

  return (
    <>
      <ContactoContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
