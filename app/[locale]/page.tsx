import { setRequestLocale } from 'next-intl/server'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import OfertasDestacadas from '@/components/OfertasDestacadas'
import TasasReferencia from '@/components/TasasReferencia'
import { LogoStrip, WhySection, StepsSection, CTASection, FAQSection, Footer } from '@/components/Sections'

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
      <LogoStrip />
      <WhySection />
      <StepsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  )
}
