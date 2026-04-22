'use client'

/**
 * Country page — EXACT COPY of the landing principal (/es, /en).
 * Only difference: hero text is adapted to the country name.
 * Everything else is identical: same components, same order, same design.
 */

import dynamic from 'next/dynamic'
import { useLocale } from 'next-intl'
import { findPaisBySlug } from '@/lib/paises'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import { Footer } from '@/components/Sections'

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

export default function PaisContent({ slug, initialMonto }: { slug: string; initialMonto?: number }) {
  const locale = useLocale()
  const en = locale === 'en'
  const pais = findPaisBySlug(slug)!
  const nombre = en ? pais.nombreEn : pais.nombre
  const pageUrl = initialMonto
    ? `https://preenvios.com/${locale}/${slug}/${initialMonto}`
    : `https://preenvios.com/${locale}/${slug}`
  const pageName = initialMonto
    ? (en ? `Send $${initialMonto} to ${nombre}` : `Enviar $${initialMonto} a ${nombre}`)
    : (en ? `Send money to ${nombre}` : `Enviar dinero a ${nombre}`)
  const pageDesc = initialMonto
    ? (en
        ? `Compare remittance providers to send $${initialMonto} USD to ${nombre}.`
        : `Compara remesadoras para enviar $${initialMonto} USD a ${nombre}.`)
    : (en
        ? `Compare remittance providers to send money to ${nombre}.`
        : `Compara remesadoras para enviar dinero a ${nombre}.`)

  return (
    <main>
      <Nav />
      <Comparador
        defaultCorredor={pais.corredorId}
        defaultMonto={initialMonto}
        heroTitle={en ? `Sending money to ${nombre}?` : `Envías dinero a ${nombre}?`}
        heroHighlight={en ? 'Compare and save in seconds.' : 'Compara y ahorra en segundos.'}
        heroLede={en ? `See in seconds how much arrives in ${nombre}` : `Revisa en segundos cuánto llega a ${nombre}`}
      >
        <BannersPatrocinados />
      </Comparador>
      <OfertasDestacadas hidden={true} />
      <TasasReferencia />
      <LazyBelow />

      {/* Schema.org (invisible — for Google) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: pageName,
        url: pageUrl,
        description: pageDesc,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'PreEnvios', item: `https://preenvios.com/${locale}` },
            { '@type': 'ListItem', position: 2, name: nombre, item: `https://preenvios.com/${locale}/${slug}` },
            ...(initialMonto ? [{ '@type': 'ListItem', position: 3, name: `$${initialMonto} USD`, item: pageUrl }] : []),
          ],
        },
      })}} />

      <Footer />
    </main>
  )
}
