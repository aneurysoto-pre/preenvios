import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculadoraInversaContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en
      ? 'Reverse remittance calculator — PreEnvios.com'
      : 'Calculadora inversa de remesas — PreEnvios.com',
    description: en
      ? 'Calculate how much to send in USD so your family receives an exact amount. Honduras, Dominican Republic, Guatemala, El Salvador, Colombia, Mexico. Free and no signup.'
      : 'Calcula cuánto enviar en USD para que tu familia reciba un monto exacto. Honduras, Rep. Dominicana, Guatemala, El Salvador, Colombia, México. Gratis y sin registro.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/calculadora-inversa`,
      languages: {
        es: 'https://preenvios.com/es/calculadora-inversa',
        en: 'https://preenvios.com/en/calculadora-inversa',
      },
    },
  }
}

export default async function CalculadoraInversaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CalculadoraInversaContent />
}
