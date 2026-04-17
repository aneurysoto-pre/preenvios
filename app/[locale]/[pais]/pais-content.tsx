'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { findPaisBySlug, PAISES_MVP } from '@/lib/paises'
import { CORREDORES_DATA, OPERADORES_DATA, WIKI_ARTICLES } from '@/lib/corredores'
import { CORRIDOR_BLOGS, CORRIDOR_WIKIS, CORRIDOR_TOP_OPERATORS } from '@/lib/cross-links'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import AlertaForm from '@/components/AlertaForm'
import { WhySection, StepsSection, Footer } from '@/components/Sections'

type TasaBC = { codigo_pais: string; tasa: number; moneda: string; siglas: string }

export default function PaisContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const pais = findPaisBySlug(slug)!
  const nombre = en ? pais.nombreEn : pais.nombre
  const corredorData = CORREDORES_DATA.find(c => c.id === pais.corredorId)
  const tasaSlug = corredorData?.slug || ''

  const [bankRate, setBankRate] = useState<TasaBC | null>(null)
  const [openFaq, setOpenFaq] = useState<number>(0)

  useEffect(() => {
    fetch('/api/tasas-banco-central')
      .then(r => r.json())
      .then((data: TasaBC[]) => {
        if (!Array.isArray(data)) return
        const rate = data.find(d => d.codigo_pais === pais.codigoPais)
        if (rate) setBankRate(rate)
      })
      .catch(() => {})
  }, [pais.codigoPais])

  const today = new Date().toLocaleDateString(en ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const bancos = en ? pais.bancosEn : pais.bancosEs

  const faqItems = en ? [
    { q: `What is the best way to send money to ${nombre}?`, a: `Compare 7 providers on PreEnvios to find the best rate and lowest fee for transfers to ${nombre}. Rates change daily — check before you send.` },
    { q: `How long does a transfer to ${nombre} take?`, a: 'Most providers deliver within minutes to 1 business day, depending on the delivery method (bank deposit, cash pickup, or mobile wallet).' },
    { q: `Do I need documents to send money to ${nombre}?`, a: 'Yes, US regulations require identity verification. Most providers accept a state ID or passport. First-time transfers may require additional verification.' },
  ] : [
    { q: `Cuál es la mejor forma de enviar dinero a ${nombre}?`, a: `Compara 7 remesadoras en PreEnvios para encontrar la mejor tasa y menor comisión para envíos a ${nombre}. Las tasas cambian diario — revisa antes de enviar.` },
    { q: `Cuánto tarda una transferencia a ${nombre}?`, a: 'La mayoría de remesadoras entregan en minutos a 1 día hábil, dependiendo del método (depósito bancario, retiro en efectivo o billetera móvil).' },
    { q: `Necesito documentos para enviar dinero a ${nombre}?`, a: 'Sí, las regulaciones de EE.UU. requieren verificación de identidad. La mayoría de remesadoras aceptan ID estatal o pasaporte. El primer envío puede requerir verificación adicional.' },
  ]

  return (
    <main>
      <Nav />

      {/* ═══ 1. HERO with country gradient + flag image + comparador ═══ */}
      <section className={`pt-24 pb-16 bg-gradient-to-b ${pais.heroGradient}`}>
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-10">
            <img
              src={`https://flagcdn.com/w160/${pais.codigoPais}.png`}
              alt={nombre}
              width={160}
              height={120}
              className="mx-auto rounded-lg shadow-md mb-6"
            />
            <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.1] mb-4">
              {en ? `Send money to ${nombre}` : `Enviar dinero a ${nombre}`}
            </h1>
            <p className="text-lg text-[var(--color-g600)] max-w-xl mx-auto">
              {en
                ? `Compare Remitly, Wise, Xoom, Ria, WorldRemit, Western Union and MoneyGram. Find the best rate to ${nombre} today.`
                : `Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Encuentra la mejor tasa a ${nombre} hoy.`}
            </p>
          </div>
          {/* Comparador integrated in hero */}
          <Comparador defaultCorredor={pais.corredorId} />
        </div>
      </section>

      {/* ═══ 2. TASA BANCO CENTRAL (card destacada) ═══ */}
      {pais.moneda !== 'USD' && (
        <section className="py-16">
          <div className="max-w-[920px] mx-auto px-6">
            <div className="bg-gradient-to-br from-[var(--color-blue-soft)] to-white rounded-[22px] p-8 text-center border border-[var(--color-g200)] shadow-sm">
              <p className="text-sm text-[var(--color-g600)] mb-2">
                {en ? `Central bank reference rate — ${today}` : `Tasa de referencia del banco central — ${today}`}
              </p>
              <p className="text-[clamp(36px,5vw,52px)] font-black text-[var(--color-blue)] leading-tight">
                1 USD = {bankRate ? bankRate.tasa.toFixed(2) : '—'} {pais.moneda}
              </p>
              {bankRate && (
                <p className="text-xs text-[var(--color-g500)] mt-3">
                  {en ? `Source: ${bankRate.siglas}` : `Fuente: ${bankRate.siglas}`}
                </p>
              )}
              <p className="text-xs text-[var(--color-g400)] mt-1">
                {en
                  ? 'Remittance providers may offer different rates. Compare above.'
                  : 'Las remesadoras pueden ofrecer tasas diferentes. Compara arriba.'}
              </p>
              {tasaSlug && (
                <a href={`/${locale}/tasa/${tasaSlug}`} className="inline-block mt-4 text-sm text-[var(--color-blue)] font-bold hover:underline">
                  {en ? `See ${pais.moneda} historical chart →` : `Ver gráfica histórica ${pais.moneda} →`}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {pais.moneda === 'USD' && (
        <section className="py-16">
          <div className="max-w-[920px] mx-auto px-6">
            <div className="bg-[var(--color-green-soft)] rounded-[22px] p-8 text-center border border-[var(--color-green)]">
              <p className="text-xl font-bold text-[var(--color-green-dark)]">
                {en
                  ? 'El Salvador uses USD — no currency conversion needed. Compare fees only.'
                  : 'El Salvador usa USD — no hay conversión de moneda. Compara solo comisiones.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 3. WHY PreEnvios (reutilizado del landing) ═══ */}
      <WhySection />

      {/* ═══ 4. STEPS — cómo funciona (reutilizado del landing) ═══ */}
      <StepsSection />

      {/* ═══ 5. CÓMO RECIBIR DINERO (editorial placeholder) ═══ */}
      <section className="py-16 bg-white">
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

      {/* ═══ 6. BANCOS Y BILLETERAS (grid de cards) ═══ */}
      <section className="py-16 bg-[var(--color-g50)]">
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

      {/* ═══ 7. ALERTA FORM ═══ */}
      <section className="py-16">
        <div className="max-w-[700px] mx-auto px-6">
          <AlertaForm corredorId={pais.corredorId} corredorNombre={nombre} />
        </div>
      </section>

      {/* ═══ 8. FAQ (acordeón) ═══ */}
      <section className="py-16 bg-[var(--color-g50)]">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-heading font-extrabold text-2xl mb-8 text-center">
            {en ? 'Frequently asked questions' : 'Preguntas frecuentes'}
          </h2>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`bg-white border rounded-[14px] overflow-hidden transition-colors ${openFaq === i ? 'border-[var(--color-blue-soft)]' : 'border-[var(--color-g200)]'} hover:border-[var(--color-blue-soft)]`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-5 text-left font-bold text-base flex justify-between items-center text-[var(--color-ink)]"
                >
                  {item.q}
                  <span className={`text-2xl text-[var(--color-blue)] font-normal transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-[var(--color-ink-2)] text-[15px] leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. CROSS-LINKS SEO ═══ */}
      <section className="py-16">
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

      {/* ═══ 10. CTA FINAL ═══ */}
      <section className="py-20">
        <div className="max-w-[920px] mx-auto px-6 text-center">
          <h2 className="font-heading text-[clamp(24px,3vw,36px)] font-black mb-4">
            {en ? `Ready to send money to ${nombre}?` : `Listo para enviar dinero a ${nombre}?`}
          </h2>
          <p className="text-[var(--color-g600)] mb-6 max-w-md mx-auto">
            {en ? 'Compare 7 providers in seconds. Find the best rate today.' : 'Compara 7 remesadoras en segundos. Encuentra la mejor tasa hoy.'}
          </p>
          <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-8 py-4 rounded-full font-extrabold text-base hover:-translate-y-0.5 transition-transform shadow-lg">
            {en ? 'Compare all providers now' : 'Comparar todas las remesadoras ahora'} →
          </a>
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
