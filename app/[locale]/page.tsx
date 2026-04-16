import { setRequestLocale } from 'next-intl/server'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
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
      <LogoStrip />
      <WhySection />
      <StepsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  )
}
