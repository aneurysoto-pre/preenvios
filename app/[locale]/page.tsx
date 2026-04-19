import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import { Footer } from '@/components/Sections'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en
      ? 'PreEnvios.com — Compare remittance providers. Send more for less.'
      : 'PreEnvios.com — Compara remesadoras. Envía más por menos.',
    description: en
      ? 'Compare Remitly, Wise, Xoom, Ria, WorldRemit, Western Union and MoneyGram. Send more money to Honduras, Dominican Republic, Guatemala and El Salvador. 100% free, no signup.'
      : 'Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Envía más dinero a Honduras, República Dominicana, Guatemala y El Salvador. 100% gratis, sin registro.',
    alternates: {
      canonical: `https://preenvios.com/${locale}`,
      languages: {
        es: 'https://preenvios.com/es',
        en: 'https://preenvios.com/en',
      },
    },
  }
}

// Below-fold components loaded lazily to reduce initial JS bundle
const OfertasDestacadas = dynamic(() => import('@/components/OfertasDestacadas'))
const BannersPatrocinados = dynamic(() => import('@/components/BannersPatrocinados'))
const TasasReferencia = dynamic(() => import('@/components/TasasReferencia'))
const LazyBelow = dynamic(() => import('@/components/Sections').then(m => {
  const Combo = () => (
    <>
      <m.LogoStrip />
      <m.WhySection />
      <m.StepsSection />
      <m.CTASection />
      <m.FAQSection />
    </>
  )
  Combo.displayName = 'LazyBelow'
  return { default: Combo }
}))

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <Nav />
      <Comparador>
        <BannersPatrocinados />
      </Comparador>
      <OfertasDestacadas hidden={true} />
      <TasasReferencia />
      <LazyBelow />
      <Footer />
    </main>
  )
}
