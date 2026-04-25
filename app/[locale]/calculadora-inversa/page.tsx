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
      canonical: `https://preenvios.vercel.app/${locale}/calculadora-inversa`,
      languages: {
        es: 'https://preenvios.vercel.app/es/calculadora-inversa',
        en: 'https://preenvios.vercel.app/en/calculadora-inversa',
      },
    },
  }
}

export default async function CalculadoraInversaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'

  // WebApplication schema — Google trata esto como herramienta interactiva.
  // Genera rich snippets distintos a una página común (icono de calculadora,
  // badge "Free tool").
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    url: `https://preenvios.vercel.app/${locale}/calculadora-inversa`,
    inLanguage: locale,
    name: en ? 'Reverse remittance calculator' : 'Calculadora inversa de remesas',
    description: en
      ? 'Calculate how much to send in USD so your family receives an exact amount in their currency. Honduras, Dominican Republic, Guatemala, El Salvador, Colombia, Mexico.'
      : 'Calcula cuánto enviar en USD para que tu familia reciba un monto exacto en su moneda. Honduras, Rep. Dominicana, Guatemala, El Salvador, Colombia, México.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (web browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }

  return (
    <>
      <CalculadoraInversaContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
