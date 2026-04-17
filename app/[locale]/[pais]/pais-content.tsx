'use client'

/**
 * Country editorial page — IDENTICAL to the landing (/es, /en) but with
 * texts adapted to the specific country + extra blocks at the end.
 *
 * Uses the same components: Comparador, TasasReferencia, LogoStrip,
 * WhySection, StepsSection, CTASection, FAQSection, Footer.
 */

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { findPaisBySlug, PAISES_MVP } from '@/lib/paises'
import { CORREDORES_DATA, OPERADORES_DATA, WIKI_ARTICLES } from '@/lib/corredores'
import { CORRIDOR_BLOGS, CORRIDOR_WIKIS, CORRIDOR_TOP_OPERATORS } from '@/lib/cross-links'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import TasasReferencia from '@/components/TasasReferencia'
import AlertaForm from '@/components/AlertaForm'
import { LogoStrip, WhySection, StepsSection, CTASection, FAQSection, Footer } from '@/components/Sections'

export default function PaisContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const pais = findPaisBySlug(slug)!
  const nombre = en ? pais.nombreEn : pais.nombre
  const corredorData = CORREDORES_DATA.find(c => c.id === pais.corredorId)
  const tasaSlug = corredorData?.slug || ''

  const [openFaq, setOpenFaq] = useState<number>(0)

  const faqItems = en ? [
    { q: `What is the best way to send money to ${nombre}?`, a: `Compare 7 providers on PreEnvios to find the best rate and lowest fee for transfers to ${nombre}. Rates change daily — check before you send.` },
    { q: `How long does a transfer to ${nombre} take?`, a: 'Most providers deliver within minutes to 1 business day, depending on the delivery method (bank deposit, cash pickup, or mobile wallet).' },
    { q: `Do I need documents to send money to ${nombre}?`, a: 'Yes, US regulations require identity verification. Most providers accept a state ID or passport. First-time transfers may require additional verification.' },
  ] : [
    { q: `Cuál es la mejor forma de enviar dinero a ${nombre}?`, a: `Compara 7 remesadoras en PreEnvios para encontrar la mejor tasa y menor comisión para envíos a ${nombre}. Las tasas cambian diario — revisa antes de enviar.` },
    { q: `Cuánto tarda una transferencia a ${nombre}?`, a: 'La mayoría de remesadoras entregan en minutos a 1 día hábil, dependiendo del método (depósito bancario, retiro en efectivo o billetera móvil).' },
    { q: `Necesito documentos para enviar dinero a ${nombre}?`, a: 'Sí, las regulaciones de EE.UU. requieren verificación de identidad. La mayoría de remesadoras aceptan ID estatal o pasaporte. El primer envío puede requerir verificación adicional.' },
  ]

  const bancos = en ? pais.bancosEn : pais.bancosEs

  return (
    <main>
      {/* ═══ SAME AS LANDING: Nav + Hero/Comparador (with country-adapted text) ═══ */}
      <Nav />
      <Comparador
        defaultCorredor={pais.corredorId}
        heroTitle={en ? `Send money to ${nombre}?` : `Enviar dinero a ${nombre}?`}
        heroHighlight={en ? 'Compare first, save more.' : 'Compara primero, ahorra más.'}
        heroLede={en ? `Compare 7 providers to ${nombre} in seconds` : `Compara 7 remesadoras a ${nombre} en segundos`}
      />

      {/* ═══ SAME AS LANDING: TasasReferencia (filtered to this country only) ═══ */}
      <TasasReferencia filterCodigoPais={pais.codigoPais} />

      {/* ═══ SAME AS LANDING: LogoStrip ═══ */}
      <LogoStrip />

      {/* ═══ SAME AS LANDING: WhySection (with country name instead of "Latinoamérica") ═══ */}
      <WhySection region={nombre} />

      {/* ═══ SAME AS LANDING: StepsSection ═══ */}
      <StepsSection />

      {/* ═══ SAME AS LANDING: CTASection ═══ */}
      <CTASection />

      {/* ═══ SAME AS LANDING: FAQSection (general) ═══ */}
      <FAQSection />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* EXTRA BLOCKS SPECIFIC TO THIS COUNTRY (before Footer)     */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ── Cómo recibir dinero (editorial placeholder) ── */}
      <section className="py-[90px] bg-white">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="bg-gradient-to-br from-[var(--color-g50)] to-white rounded-[22px] p-10 border border-[var(--color-g200)] shadow-sm">
            <h2 className="font-heading font-extrabold text-2xl mb-4">
              {en ? `How to receive money in ${nombre}` : `Cómo recibir dinero en ${nombre}`}
            </h2>
            <p className="text-[var(--color-g600)] text-base leading-relaxed">
              {en
                ? 'Coming soon: complete step-by-step guide for receiving remittances, including bank requirements, cash pickup locations, and mobile wallet options.'
                : 'Próximamente: guía completa paso a paso para recibir remesas, incluyendo requisitos bancarios, puntos de retiro en efectivo y opciones de billetera móvil.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Bancos y billeteras (grid de cards) ── */}
      <section className="py-[90px] bg-[var(--color-g50)]">
        <div className="max-w-[920px] mx-auto px-6">
          <h2 className="font-heading font-extrabold text-2xl mb-8 text-center">
            {en ? `Popular banks and wallets in ${nombre}` : `Bancos y billeteras más usados en ${nombre}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bancos.map(b => (
              <div key={b} className="bg-white rounded-[16px] p-5 border border-[var(--color-g200)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-blue-soft)] flex items-center justify-center text-xl shrink-0">
                  🏦
                </div>
                <span className="font-bold text-[var(--color-ink)] text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AlertaForm ── */}
      <section className="py-[70px]">
        <div className="max-w-[700px] mx-auto px-6">
          <AlertaForm corredorId={pais.corredorId} corredorNombre={nombre} />
        </div>
      </section>

      {/* ── FAQ específica del corredor (acordeón) ── */}
      <section className="py-[90px] bg-[var(--color-g50)]">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-14">
            <span className="inline-block text-xs font-extrabold text-[var(--color-blue)] uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-[var(--color-blue-soft)] rounded-full">
              {en ? `About ${nombre}` : `Sobre ${nombre}`}
            </span>
            <h2 className="font-heading text-[clamp(24px,3vw,36px)] font-black leading-[1.1]">
              {en ? `Sending money to ${nombre}` : `Enviar dinero a ${nombre}`}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-[var(--color-g200)] rounded-[14px] overflow-hidden transition-colors hover:border-[var(--color-blue-soft)] group"
                open={i === 0}
              >
                <summary className="px-6 py-5 font-bold text-base cursor-pointer list-none flex justify-between items-center text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-2xl text-[var(--color-blue)] font-normal transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-5 text-[var(--color-ink-2)] text-[15px]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cross-links SEO ── */}
      <section className="py-[70px]">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="bg-[var(--color-g50)] rounded-[22px] p-8 border border-[var(--color-g200)]">
            <h2 className="font-heading font-extrabold text-lg mb-5">
              {en ? 'Related resources' : 'Recursos relacionados'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tasa técnica */}
              {tasaSlug && (
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider mb-2">
                    {en ? 'Exchange rate' : 'Tasa de cambio'}
                  </h3>
                  <a href={`/${locale}/tasa/${tasaSlug}`} className="text-sm text-[var(--color-blue)] font-bold hover:underline block">
                    {en ? `USD to ${pais.moneda} rate chart →` : `Gráfica USD a ${pais.moneda} →`}
                  </a>
                </div>
              )}

              {/* Top operators */}
              {(CORRIDOR_TOP_OPERATORS[pais.corredorId] || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider mb-2">
                    {en ? 'Popular providers' : 'Remesadoras populares'}
                  </h3>
                  {(CORRIDOR_TOP_OPERATORS[pais.corredorId] || []).map(opSlug => {
                    const op = OPERADORES_DATA.find(o => o.slug === opSlug)
                    return op ? (
                      <a key={opSlug} href={`/${locale}/operadores/${opSlug}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline block mb-1">
                        {op.nombre}
                      </a>
                    ) : null
                  })}
                </div>
              )}

              {/* Related blog */}
              {(CORRIDOR_BLOGS[pais.corredorId] || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider mb-2">
                    {en ? 'Blog articles' : 'Artículos del blog'}
                  </h3>
                  {(CORRIDOR_BLOGS[pais.corredorId] || []).map(blogSlug => (
                    <a key={blogSlug} href={`/${locale}/blog/${blogSlug}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline block mb-1">
                      {blogSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </a>
                  ))}
                </div>
              )}

              {/* Related wiki */}
              {(CORRIDOR_WIKIS[pais.corredorId] || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider mb-2">
                    {en ? 'Guides' : 'Guías'}
                  </h3>
                  {(CORRIDOR_WIKIS[pais.corredorId] || []).map(wikiSlug => {
                    const wa = WIKI_ARTICLES.find(a => a.slug === wikiSlug)
                    return wa ? (
                      <a key={wikiSlug} href={`/${locale}/wiki/${wikiSlug}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline block mb-1">
                        {en ? wa.titulo_en : wa.titulo}
                      </a>
                    ) : null
                  })}
                </div>
              )}

              {/* Other corridors */}
              <div>
                <h3 className="text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider mb-2">
                  {en ? 'Other countries' : 'Otros países'}
                </h3>
                {PAISES_MVP.filter(p => p.corredorId !== pais.corredorId).map(p => (
                  <a key={p.corredorId} href={`/${locale}/${en ? p.slugEn : p.slugEs}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline block mb-1">
                    <img src={`https://flagcdn.com/w20/${p.codigoPais}.png`} alt="" width={20} height={15} className="inline mr-1.5 rounded-sm" loading="lazy" />
                    {en ? p.nombreEn : p.nombre}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: en ? `Send money to ${nombre}` : `Enviar dinero a ${nombre}`,
        url: `https://preenvios.com/${locale}/${slug}`,
        description: en
          ? `Compare remittance providers to send money to ${nombre}.`
          : `Compara remesadoras para enviar dinero a ${nombre}.`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'PreEnvios', item: `https://preenvios.com/${locale}` },
            { '@type': 'ListItem', position: 2, name: nombre, item: `https://preenvios.com/${locale}/${slug}` },
          ],
        },
        mainEntity: {
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      })}} />

      <Footer />
    </main>
  )
}
