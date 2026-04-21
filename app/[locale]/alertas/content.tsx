'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Mail, Sunrise, CheckCircle2 } from 'lucide-react'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'
import AlertaForm from '@/components/AlertaForm'
import { PAISES_MVP } from '@/lib/paises'

/**
 * Página /alertas — landing dedicada para suscripción a alertas diarias
 * de tasas. Reutiliza el componente AlertaForm existente con Honduras
 * como corredor default (prioridad #1 MVP / plan marketing).
 *
 * Paleta visual: inspirada en el hero de la landing principal con
 * gradient bg-gradient-to-b from-white to-[#F5F9FF], card del formulario
 * flotando sobre ese fondo (shadow-[0_20px_50px_...]), luego alternating
 * bg blanco/g50 en las secciones educativas para evitar el look
 * "blanco anemico" (todo el fondo igual).
 *
 * Orden de secciones:
 * 1. Hero + Formulario de suscripcion (integrados en gradient bg)
 * 2. Como funciona (3 pasos)
 * 3. Pills de otros paises
 * 4. FAQ
 * Razon del orden: el usuario viene decidido a suscribirse. El form
 * arriba reduce friccion (menos scroll antes del action principal).
 * Las secciones educativas bajo el form refuerzan la decision.
 *
 * Navegacion relacionada:
 * - Banner "Alertas diarias gratis" en BannersPatrocinados apunta aqui
 * - Cada página de país tiene su propio AlertaForm inline para ese
 *   corredor específico. Esta página es la única route dedicada —
 *   single source of truth para alertas genéricas.
 */
export default function AlertasContent() {
  const t = useTranslations('alertas')
  const locale = useLocale()
  const en = locale === 'en'

  const steps = [
    { n: 1, Icon: CheckCircle2, cls: 'bg-blue-soft text-blue',        titleKey: 'step1Title', descKey: 'step1Desc' },
    { n: 2, Icon: Mail,         cls: 'bg-green-soft text-green-dark',  titleKey: 'step2Title', descKey: 'step2Desc' },
    { n: 3, Icon: Sunrise,      cls: 'bg-[#FEF3C7] text-[#B45309]',   titleKey: 'step3Title', descKey: 'step3Desc' },
  ] as const

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* ═════ HERO + FORM ═════
            Gradient igual al hero del Comparador (from-white to-[#F5F9FF]).
            El form vive sobre este gradient wrapped en card blanca con
            shadow — flota visualmente como el search card de la landing. */}
        <section className="pt-[112px] pb-14 bg-gradient-to-b from-white to-[#F5F9FF]">
          <div className="max-w-[820px] mx-auto px-6">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold text-green-dark uppercase tracking-[2px] mb-4 px-3.5 py-1.5 bg-green-soft rounded-full">
                <Bell className="size-3.5" aria-hidden="true" />
                {t('tag')}
              </span>
              <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.1] mb-4 text-ink">
                {t('heroTitle')}
              </h1>
              <p className="text-ink-2 text-[16px] max-w-[580px] mx-auto">{t('heroLede')}</p>
            </div>

            {/* Form card — flota sobre el gradient con shadow prominente */}
            <div className="max-w-[640px] mx-auto bg-white rounded-[22px] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(10,79,229,.25)] border border-g200">
              <div className="text-center mb-5">
                <h2 className="font-heading text-[18px] sm:text-xl font-extrabold text-ink mb-1.5">
                  {t('formTitle')}
                </h2>
                <p className="text-ink-2 text-[13px] max-w-[480px] mx-auto">{t('formSubtitle')}</p>
              </div>
              <AlertaForm corredorId="honduras" corredorNombre="Honduras" />
            </div>
          </div>
        </section>

        {/* ═════ CÓMO FUNCIONA ═════ */}
        <section className="py-10 bg-white">
          <div className="max-w-[1040px] mx-auto px-6">
            <h2 className="font-heading text-[clamp(22px,3vw,32px)] font-black text-center mb-8 text-ink">
              {t('howTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {steps.map(({ n, Icon, cls, titleKey, descKey }) => (
                <div
                  key={n}
                  className="bg-g50 border border-g200 rounded-[22px] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-blue-soft"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${cls}`}
                  >
                    <Icon size={26} strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div className="text-xs font-extrabold text-g500 uppercase tracking-wider mb-1.5">
                    {en ? `Step ${n}` : `Paso ${n}`}
                  </div>
                  <h3 className="font-heading text-lg font-extrabold mb-2 text-ink">
                    {t(titleKey)}
                  </h3>
                  <p className="text-ink-2 text-[15px]">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════ OTROS PAÍSES ═════ */}
        <section className="py-10 bg-g50">
          <div className="max-w-[1040px] mx-auto px-6 text-center">
            <h2 className="font-heading text-xl font-extrabold mb-2 text-ink">
              {t('otherCountriesTitle')}
            </h2>
            <p className="text-ink-2 text-[15px] max-w-[640px] mx-auto mb-6">
              {t('otherCountriesText')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {PAISES_MVP.map(p => (
                <Link
                  key={p.corredorId}
                  href={`/${locale}/${en ? p.slugEn : p.slugEs}`}
                  className="inline-flex items-center gap-2 bg-white border border-g200 hover:border-blue hover:bg-blue-soft/30 rounded-full px-4 py-2 text-sm font-bold text-ink transition-colors"
                >
                  {/* flagcdn PNG — emoji flags no renderean en Windows
                      (regla del proyecto, CONTEXTO_FINAL §4.2.9) */}
                  <Image
                    src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                    alt=""
                    width={20}
                    height={14}
                    unoptimized
                    className="rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
                  />
                  {en ? p.nombreEn : p.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═════ FAQ ═════ */}
        <section className="py-10 bg-white">
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-heading text-[clamp(22px,3vw,32px)] font-black text-center mb-6 text-ink">
              {t('faqTitle')}
            </h2>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(n => (
                <details
                  key={n}
                  className="bg-g50 border border-g200 rounded-[14px] overflow-hidden hover:border-blue-soft transition-colors group"
                >
                  <summary className="px-6 py-4 font-bold text-[15px] cursor-pointer list-none flex justify-between items-center text-ink [&::-webkit-details-marker]:hidden">
                    {t(`faqQ${n}`)}
                    <span className="text-2xl text-blue font-normal transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-4 text-ink-2 text-[14px]">{t(`faqA${n}`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Schema.org — WebPage con descripcion para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: en ? 'Free rate alerts' : 'Alertas de tasas gratis',
            url: `https://preenvios.com/${locale}/alertas`,
            description: en
              ? "Subscribe free to daily rate alerts. Get the best rate from 7 remittance providers every morning."
              : 'Suscríbete gratis a alertas diarias. Recibe la mejor tasa de 7 remesadoras cada mañana.',
          }),
        }}
      />
    </div>
  )
}
