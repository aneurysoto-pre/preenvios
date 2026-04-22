import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import TerminosContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Terms of use — PreEnvios.com' : 'Términos de uso — PreEnvios.com',
    description: en
      ? 'Terms and conditions for using PreEnvios.com, a free remittance comparison tool. We are not a financial institution and do not process payments.'
      : 'Términos y condiciones de uso del comparador gratuito de remesas PreEnvios.com. No somos una institución financiera y no procesamos pagos.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/terminos`,
      languages: { es: 'https://preenvios.com/es/terminos', en: 'https://preenvios.com/en/terminos' },
    },
  }
}

export default async function TerminosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <TerminosContent />
}
