'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { findPaisBySlug, PAISES_MVP } from '@/lib/paises'
import { CORREDORES_DATA, OPERADORES_DATA, WIKI_ARTICLES } from '@/lib/corredores'
import { CORRIDOR_BLOGS, CORRIDOR_WIKIS, CORRIDOR_TOP_OPERATORS } from '@/lib/cross-links'
import Nav from '@/components/Nav'
import Comparador from '@/components/Comparador'
import AlertaForm from '@/components/AlertaForm'
import { Footer } from '@/components/Sections'

type BankRate = { corredor: string; tasa: number; moneda: string; actualizado_en: string }

export default function PaisContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const pais = findPaisBySlug(slug)!
  const nombre = en ? pais.nombreEn : pais.nombre
  const corredorData = CORREDORES_DATA.find(c => c.id === pais.corredorId)
  const tasaSlug = corredorData?.slug || ''

  const [bankRate, setBankRate] = useState<BankRate | null>(null)

  useEffect(() => {
    fetch('/api/tasas-banco-central')
      .then(r => r.json())
      .then((data: BankRate[]) => {
        const rate = data.find(d => d.corredor === pais.corredorId)
        if (rate) setBankRate(rate)
      })
      .catch(() => {})
  }, [pais.corredorId])

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

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[var(--color-g50)]">
        <div className="max-w-[920px] mx-auto px-6 text-center">
          <div className="text-6xl mb-4">{pais.bandera}</div>
          <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.1] mb-4">
            {en ? `Send money to ${nombre}` : `Enviar dinero a ${nombre}`}
          </h1>
          <p className="text-lg text-[var(--color-g600)] max-w-xl mx-auto">
            {en
              ? `Compare Remitly, Wise, Xoom, Ria, WorldRemit, Western Union and MoneyGram. Find the best rate to ${nombre} today.`
              : `Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Encuentra la mejor tasa a ${nombre} hoy.`}
          </p>
        </div>
      </section>

      {/* Current rate block */}
      {pais.moneda !== 'USD' && (
        <section className="pb-8">
          <div className="max-w-[920px] mx-auto px-6">
            <div className="bg-[var(--color-blue-soft)] rounded-[22px] p-6 text-center">
              <p className="text-sm text-[var(--color-g600)] mb-1">
                {en ? `Central bank reference rate — ${today}` : `Tasa de referencia del banco central — ${today}`}
              </p>
              <p className="text-3xl font-black text-[var(--color-blue)]">
                1 USD = {bankRate ? bankRate.tasa.toFixed(2) : '—'} {pais.moneda}
              </p>
              <p className="text-xs text-[var(--color-g500)] mt-2">
                {en
                  ? 'Remittance providers may offer different rates. Compare below.'
                  : 'Las remesadoras pueden ofrecer tasas diferentes. Compara abajo.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {pais.moneda === 'USD' && (
        <section className="pb-8">
          <div className="max-w-[920px] mx-auto px-6">
            <div className="bg-[var(--color-green-soft)] rounded-[22px] p-6 text-center">
              <p className="text-lg font-bold text-[var(--color-green-dark)]">
                {en
                  ? 'El Salvador uses USD — no currency conversion needed. Compare fees only.'
                  : 'El Salvador usa USD — no hay conversión de moneda. Compara solo comisiones.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Comparador preset to this corridor */}
      <section className="pb-12">
        <div className="max-w-[1240px] mx-auto px-6">
          <h2 className="font-heading font-extrabold text-xl mb-6 text-center">
            {en ? `Compare 7 providers to ${nombre}` : `Compara 7 remesadoras a ${nombre}`}
          </h2>
          <Comparador defaultCorredor={pais.corredorId} />
        </div>
      </section>

      {/* Alert form */}
      <section className="pb-12">
        <div className="max-w-[700px] mx-auto px-6">
          <AlertaForm corredorId={pais.corredorId} corredorNombre={nombre} />
        </div>
      </section>

      {/* How to receive money */}
      <section className="pb-12">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="bg-white rounded-[22px] p-8 border border-[var(--color-g200)] shadow-sm">
            <h2 className="font-heading font-extrabold text-xl mb-4">
              {en ? `How to receive money in ${nombre}` : `Cómo recibir dinero en ${nombre}`}
            </h2>
            <p className="text-[var(--color-g600)]">
              {en
                ? 'Coming soon: complete step-by-step guide for receiving remittances, including bank requirements, cash pickup locations, and mobile wallet options.'
                : 'Próximamente: guía completa paso a paso para recibir remesas, incluyendo requisitos bancarios, puntos de retiro en efectivo y opciones de billetera móvil.'}
            </p>
          </div>
        </div>
      </section>

      {/* Banks and wallets */}
      <section className="pb-12">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="bg-white rounded-[22px] p-8 border border-[var(--color-g200)] shadow-sm">
            <h2 className="font-heading font-extrabold text-xl mb-4">
              {en ? `Popular banks and wallets in ${nombre}` : `Bancos y billeteras más usados en ${nombre}`}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bancos.map(b => (
                <li key={b} className="flex items-center gap-2 text-[var(--color-ink-2)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-blue)] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="max-w-[920px] mx-auto px-6">
          <h2 className="font-heading font-extrabold text-xl mb-6 text-center">
            {en ? 'Frequently asked questions' : 'Preguntas frecuentes'}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-[18px] p-6 border border-[var(--color-g200)] shadow-sm">
                <h3 className="font-bold text-[var(--color-ink)] mb-2">{item.q}</h3>
                <p className="text-sm text-[var(--color-g600)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links SEO */}
      <section className="pb-12">
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

              {/* Top operators for this corridor */}
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

              {/* Related blog articles */}
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

              {/* Related wiki articles */}
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
                    {p.bandera} {en ? p.nombreEn : p.nombre}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-[920px] mx-auto px-6 text-center">
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
