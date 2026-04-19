import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactoContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Contact — PreEnvios.com' : 'Contacto — PreEnvios.com',
    description: en
      ? 'Get in touch with PreEnvios. We reply to every message within 24-48 hours. General inquiries, partnerships and rate corrections.'
      : 'Escríbenos a PreEnvios. Respondemos todos los mensajes en 24-48 horas. Consultas generales, alianzas comerciales y correcciones de tasa.',
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
