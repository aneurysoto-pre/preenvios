'use client'

/**
 * Country page — EXACT COPY of the landing principal (/es, /en).
 * Only difference: hero text is adapted to the country name.
 * Everything else is identical: same components, same order, same design.
 *
 * Landing editorial por pais (2026-04-24): si `getCorredorContent(corredorId)`
 * devuelve un objeto (pais tiene entry en data/corredores/*.ts), se
 * renderiza el landing editorial modelo A en lugar de TasasReferencia +
 * LazyBelow. Feature flag "por datos" que permite rollout progresivo
 * pais por pais. Ver LOGICA_DE_NEGOCIO/28_landing_editorial_pais.md
 * (creado en Commit 10).
 */

import dynamic from 'next/dynamic'
import { useLocale } from 'next-intl'
import { findPaisBySlug } from '@/lib/paises'
import { getCorredorContent } from '@/data/corredores'
import type { TasaBancoCentral } from '@/lib/tasas-banco-central'
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

// Dynamic para que el bundle solo se cargue en paises con editorial
// (hoy solo Honduras). Los 5 paises restantes del MVP siguen usando
// TasasReferencia + LazyBelow hasta que se agreguen a data/corredores/.
const LandingEditorial = dynamic(() =>
  import('@/components/landing-editorial').then(m => ({ default: m.LandingEditorial })),
)

export default function PaisContent({
  slug,
  initialMonto,
  initialTasa,
}: {
  slug: string
  initialMonto?: number
  initialTasa?: TasaBancoCentral | null
}) {
  const locale = useLocale()
  const en = locale === 'en'
  const pais = findPaisBySlug(slug)!
  const nombre = en ? pais.nombreEn : pais.nombre
  const editorialData = getCorredorContent(pais.corredorId)
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

      {/* Renderizado condicional: landing editorial si el pais tiene
          entry en data/corredores/ (feature flag por datos), fallback
          a comportamiento legacy (TasasReferencia + LazyBelow) si no. */}
      {editorialData ? (
        <LandingEditorial
          data={editorialData}
          tasa={initialTasa ?? null}
          locale={locale === 'en' ? 'en' : 'es'}
          slugEs={pais.slugEs}
        />
      ) : (
        <>
          <TasasReferencia />
          <LazyBelow />
        </>
      )}

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
