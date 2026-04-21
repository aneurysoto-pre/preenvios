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
  return <ContactoContent />
}
