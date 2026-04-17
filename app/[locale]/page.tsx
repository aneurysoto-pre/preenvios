import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import { Footer } from '@/components/Sections'

// Below-fold components loaded lazily to reduce initial JS bundle
const OfertasDestacadas = dynamic(() => import('@/components/OfertasDestacadas'))
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
      <Comparador />
      <OfertasDestacadas hidden={true} />
      <TasasReferencia />
      <LazyBelow />
      <Footer />
    </main>
  )
}
