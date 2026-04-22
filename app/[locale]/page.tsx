import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { setRequestLocale, getTranslations } from 'next-intl/server'
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
      ? 'Compare Remitly, Wise, Xoom, Ria, WorldRemit, Western Union and MoneyGram. Send more money to Honduras, Dominican Republic, Guatemala, El Salvador, Colombia and Mexico. 100% free, no signup.'
      : 'Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Envía más dinero a Honduras, República Dominicana, Guatemala, El Salvador, Colombia y México. 100% gratis, sin registro.',
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
  const tFaq = await getTranslations({ locale, namespace: 'faq' })
  const en = locale === 'en'

  // JSON-LD @graph con 3 schemas en un solo bloque — patrón recomendado
  // por Google cuando una página tiene múltiples entidades.
  // 1. WebSite + SearchAction habilita el sitelink search box en SERP.
  // 2. Organization define la entidad PreEnvios (trust signal).
  // 3. FAQPage activa FAQ rich snippet con las 6 preguntas de FAQSection.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://preenvios.com/#website',
        url: 'https://preenvios.com',
        name: 'PreEnvios',
        inLanguage: locale,
        description: en
          ? 'Compare remittance providers from the US to Latin America'
          : 'Compara remesadoras de EE.UU. a Latinoamérica',
        publisher: { '@id': 'https://preenvios.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `https://preenvios.com/${locale}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://preenvios.com/#organization',
        name: 'PreEnvios',
        url: 'https://preenvios.com',
        logo: 'https://preenvios.com/icon',
        sameAs: [],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@preenvios.com',
          contactType: 'customer service',
          availableLanguage: ['es', 'en'],
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://preenvios.com/${locale}#faq`,
        mainEntity: [1, 2, 3, 4, 5, 6].map((n) => ({
          '@type': 'Question',
          name: tFaq(`q${n}`),
          acceptedAnswer: {
            '@type': 'Answer',
            text: tFaq(`a${n}`),
          },
        })),
      },
    ],
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}
