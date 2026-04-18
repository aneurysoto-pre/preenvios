import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactoContent from './content'

export const metadata: Metadata = {
  title: 'Contacto — PreEnvios.com',
  description: 'Escríbenos. Respondemos todos los mensajes en 24-48 horas.',
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ContactoContent />
}
