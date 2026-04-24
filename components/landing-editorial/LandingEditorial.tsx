'use client'

import { useTranslations } from 'next-intl'
import type { CorredorContent } from '@/data/corredores'
import type { TasaBancoCentral } from '@/lib/tasas-banco-central'
import type { CorredorId } from '@/lib/schemas/alerta'
import AlertaInlineForm from './AlertaInlineForm'
import EnglishComingSoon from './EnglishComingSoon'

/**
 * Landing editorial por pais — modelo A (Magazine).
 *
 * Orquesta las 8 secciones del landing editorial, con rendering
 * condicional del fallback EnglishComingSoon cuando locale='en' sin
 * traduccion disponible.
 *
 * Este componente se renderiza en `app/[locale]/[pais]/pais-content.tsx`
 * DEBAJO del disclaimer de Comparador — reemplaza TasasReferencia y
 * LazyBelow (Sections.tsx genericas) cuando el pais tiene entry en
 * data/corredores/*.ts. Ver Commit 9 del port + Proceso 30.
 *
 * Todos los textos traducibles vienen de messages/es.json namespace
 * `landing.editorial.<corredorId>.*`. Datos estructurales no traducibles
 * (stats, nombres propios, emojis, gradientes) vienen del prop data.
 * La tasa BCH viene pre-fetched server-side desde getTasaBancoCentral().
 */

type Props = {
  data: CorredorContent
  tasa: TasaBancoCentral | null
  locale: 'es' | 'en'
  /** Slug ES del pais — usado por EnglishComingSoon para el link de fallback */
  slugEs: string
}

export default function LandingEditorial({ data, tasa, locale, slugEs }: Props) {
  // Fallback cuando EN no tiene traduccion editorial — decidido 2026-04-24.
  if (locale === 'en') {
    return <EnglishComingSoon slugEs={slugEs} />
  }
  return <LandingEditorialEs data={data} tasa={tasa} />
}

/**
 * Version ES — separado en componente interno para respetar rules of
 * hooks (useTranslations debe llamarse incondicionalmente; el early
 * return a EnglishComingSoon en el wrapper hace que esto sea necesario).
 */
function LandingEditorialEs({ data, tasa }: { data: CorredorContent; tasa: TasaBancoCentral | null }) {
  const t = useTranslations(`landing.editorial.${data.corredorId}`)

  const dateFormatter = new Intl.DateTimeFormat('es-HN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const fechaHoy = dateFormatter.format(new Date())
  const fechaActualizacion = dateFormatter.format(new Date(data.lastEditorialUpdate))

  // Tasa con fallback — si Supabase no devuelve data, mostramos "—".
  const tasaValor = tasa ? tasa.tasa.toFixed(2) : '—'
  const siglaBanco = tasa?.siglas ?? 'BCH'
  const nombreBanco = tasa?.nombre_banco ?? t('seccion0.bancoNombre')

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
           SECCION 0 — Tasa BCH + Form Alertas (primer bloque post-disclaimer)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-6 md:py-7 border-b border-g200">
        <div className="max-w-[1240px] mx-auto px-5 grid md:grid-cols-2 gap-3 md:gap-4">
          {/* Card tasa BCH */}
          <div className="bg-white rounded-2xl p-4 border border-g200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-black text-white text-[13px] shrink-0 bg-blue">
              {siglaBanco}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-base leading-none">{data.banderaEmoji}</span>
                <span className="text-[10px] font-bold text-g600 uppercase tracking-wider">
                  {t('seccion0.bancoLabel')}
                </span>
              </div>
              <div className="font-heading font-extrabold text-sm truncate text-ink">
                {nombreBanco}
              </div>
              <div className="font-heading font-black text-xl md:text-[22px] leading-tight text-green">
                {tasaValor}{' '}
                <span className="text-xs md:text-sm text-g500 font-bold">
                  {data.monedaCodigo}/USD
                </span>
              </div>
              <div className="text-[10px] text-g500 mt-0.5 font-medium">
                {t('seccion0.tasaActualizado', { fechaHoy })}
              </div>
            </div>
          </div>

          {/* Form alertas compact (location='hero') */}
          <AlertaInlineForm
            corredor={data.corredorId as CorredorId}
            idioma="es"
            location="hero"
            titulo={t('seccion0.alertasHeading')}
            subtitulo={t('seccion0.alertasSubtitle')}
            emailPlaceholder={t('seccion0.alertasEmailPlaceholder')}
            ctaText={t('seccion0.alertasCta')}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 1 — Stats (Honduras y las remesas)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1240px] mx-auto px-5">
          <div className="mb-7 max-w-2xl">
            <div className="text-[11px] font-extrabold text-blue uppercase tracking-[0.18em] mb-2.5">
              {t('stats.tag')}
            </div>
            <h2 className="font-editorial font-black text-3xl md:text-4xl leading-[1.05] mb-3 text-ink">
              {t('stats.title')}
            </h2>
            <p className="text-g600 text-base leading-relaxed">{t('stats.lede')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stat 1 — Remesas anuales */}
            <div className="bg-gradient-to-br from-blue-soft to-white border border-g200 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute -top-3 -right-3 text-[70px] opacity-10 font-heading font-black text-blue leading-none select-none">
                $
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold text-g500 uppercase tracking-wider mb-1">
                  {t('stats.remesasAnualesLabel')}
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-blue leading-none">
                  {data.stats.remesasAnuales}
                </div>
                <div className="text-xs text-g600 mt-1.5 font-medium">
                  {t('stats.remesasAnualesSubtitle')}
                </div>
              </div>
            </div>

            {/* Stat 2 — PIB */}
            <div className="bg-gradient-to-br from-green-soft to-white border border-g200 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute -top-3 -right-3 text-[70px] opacity-10 font-heading font-black text-green leading-none select-none">
                %
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold text-g500 uppercase tracking-wider mb-1">
                  {t('stats.pibLabel')}
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-green leading-none">
                  {data.stats.pibPorcentaje}
                </div>
                <div className="text-xs text-g600 mt-1.5 font-medium">
                  {t('stats.pibSubtitle')}
                </div>
              </div>
            </div>

            {/* Stat 3 — Diaspora */}
            <div className="bg-g50 border border-g200 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute -top-3 -right-3 text-[70px] opacity-10 font-heading font-black text-g400 leading-none select-none">
                M
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold text-g500 uppercase tracking-wider mb-1">
                  {t('stats.diasporaLabel')}
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-ink leading-none">
                  {data.stats.diasporaUsa}
                </div>
                <div className="text-xs text-g600 mt-1.5 font-medium">
                  {t('stats.diasporaSubtitle')}
                </div>
              </div>
            </div>

            {/* Stat 4 — Ranking */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-g200 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-[54px] opacity-15 leading-none select-none">
                🏆
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold text-g500 uppercase tracking-wider mb-1">
                  {t('stats.rankingLabel')}
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-amber-600 leading-none">
                  {data.stats.ranking}
                </div>
                <div className="text-xs text-g600 mt-1.5 font-medium">
                  {t('stats.rankingSubtitle')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 2 — Editorial oscuro (la diaspora hondureña)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 text-white py-14 md:py-16 relative overflow-hidden">
        <div className="absolute top-8 right-8 text-[160px] font-heading font-black opacity-5 leading-none select-none">
          {data.codigoPais.toUpperCase()}
        </div>

        <div className="relative max-w-[860px] mx-auto px-5">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3 text-cyan-400">
            {t('editorial.tag')}
          </div>
          <h3 className="font-editorial font-black text-2xl md:text-4xl leading-[1.1] mb-6">
            {t('editorial.titleLine1')}
            <br />
            {t('editorial.titleLine2')}
            <br />
            <span className="text-white">{t('editorial.titleLine3')}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mt-7 text-base leading-relaxed text-slate-300">
            <p>{t('editorial.p1')}</p>
            <p>
              {t.rich('editorial.p2', {
                strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                highlight: (chunks) => <strong className="text-green">{chunks}</strong>,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 3 — Ciudades (6 zonas principales)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1240px] mx-auto px-5">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div className="max-w-2xl">
              <div className="text-[11px] font-extrabold text-blue uppercase tracking-[0.18em] mb-2.5">
                {t('ciudades.tag')}
              </div>
              <h2 className="font-editorial font-black text-3xl md:text-4xl leading-[1.05] mb-2 text-ink">
                {t('ciudades.title')}
              </h2>
              <p className="text-g600 text-base leading-relaxed">{t('ciudades.lede')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.ciudades.map((ciudad) => (
              <a
                key={ciudad.slug}
                href="#comparador"
                className="block rounded-2xl overflow-hidden relative aspect-[4/5] shadow-md transition-transform hover:-translate-y-[3px]"
                style={{ background: ciudad.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-[100px] opacity-25 leading-none select-none">
                  {ciudad.emoji}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-[9px] font-bold opacity-80 uppercase tracking-wider">
                    {ciudad.departamento} · {t(`ciudades.tipo.${ciudad.tipoKey}`)} · {ciudad.poblacion}
                  </div>
                  <div className="font-heading font-black text-lg md:text-xl mt-0.5">
                    {ciudad.nombre}
                  </div>
                </div>
                {ciudad.esPrincipal && (
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t('ciudades.principalBadge')}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 4 — Errores comunes (6 warning cards)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-red-50/40">
        <div className="max-w-[1240px] mx-auto px-5">
          <div className="mb-7 max-w-2xl">
            <div className="text-[11px] font-extrabold text-red-700 uppercase tracking-[0.18em] mb-2.5">
              {t('errores.tag')}
            </div>
            <h2 className="font-editorial font-black text-3xl md:text-4xl leading-[1.05] mb-2 text-ink">
              {t('errores.title')}
            </h2>
            <p className="text-g600 text-base">{t('errores.lede')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {(t.raw('errores.items') as Array<{ titulo: string; texto: string }>).map((error, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-red-200 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-heading font-black text-sm">
                  ✕
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-[15px] mb-1 text-ink">
                    {error.titulo}
                  </h3>
                  <p className="text-[13px] text-g600 leading-relaxed">{error.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 5 — FAQ (7 preguntas, accordion)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14">
        <div className="max-w-[860px] mx-auto px-5">
          <div className="mb-7 text-center">
            <div className="text-[11px] font-extrabold text-blue uppercase tracking-[0.18em] mb-2.5">
              {t('faq.tag')}
            </div>
            <h2 className="font-editorial font-black text-3xl md:text-4xl leading-[1.05] text-ink">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-2.5">
            {(t.raw('faq.items') as FAQItem[]).map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-g200 p-4 md:p-5 group">
                <summary className="flex items-center justify-between font-heading font-extrabold text-sm md:text-base cursor-pointer list-none text-ink">
                  <span>{item.q}</span>
                  <svg
                    className="w-4 h-4 text-g400 shrink-0 ml-3 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 text-g600 leading-relaxed text-sm">
                  {item.a && <p>{item.a}</p>}
                  {item.aIntro && item.aBullets && (
                    <>
                      <p>{item.aIntro}</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {item.aBullets.map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           SECCION 6 — CTA final (titulo + checklist + form alertas grande)
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14 relative overflow-hidden bg-gradient-to-br from-blue to-blue-dark">
        <div className="relative max-w-[1100px] mx-auto px-5 grid md:grid-cols-2 gap-6 md:gap-8 items-start text-white">
          {/* Columna izquierda — titulo + CTA comparador */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.25em] mb-2.5 opacity-90">
              {t('cta.tag')}
            </div>
            <h2 className="font-editorial font-black text-3xl md:text-4xl leading-[1.05] mb-3">
              {t('cta.titleLine1')}
              <br />
              <span className="text-green">{t('cta.titleLine2')}</span>
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">{t('cta.lede')}</p>
            <a
              href="#comparador"
              className="inline-flex items-center justify-center gap-2 bg-white text-ink px-8 py-4 rounded-full font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              {t('cta.ctaPrimary')}
            </a>
          </div>

          {/* Columna derecha — checklist + form alertas grande */}
          <div className="space-y-4">
            {/* Checklist */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 md:p-6">
              <div className="font-heading font-extrabold text-lg md:text-xl uppercase tracking-wider mb-4">
                {t('cta.checklistHeading')}
              </div>
              <ul className="space-y-2 text-[13px]">
                {(t.raw('cta.checklist') as string[]).map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 text-green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form alertas grande (location='cta_final') */}
            <AlertaInlineForm
              corredor={data.corredorId as CorredorId}
              idioma="es"
              location="cta_final"
              titulo={t('seccion0.alertasHeading')}
              subtitulo={t('seccion0.alertasSubtitle')}
              emailPlaceholder={t('seccion0.alertasEmailPlaceholder')}
              ctaText={t('seccion0.alertasCta')}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           Fuentes — micro-bloque antes del footer
           ═══════════════════════════════════════════════════════════════ */}
      <section className="py-5 bg-g50 border-t border-g200">
        <div className="max-w-[1240px] mx-auto px-5">
          <p className="text-[11px] text-g500 leading-relaxed">
            <strong className="text-g700 font-bold">{t('fuentes.label')}</strong>{' '}
            {data.fuentes.join(', ')}.{' '}
            {t('fuentes.text', { fechaActualizacion })}
          </p>
        </div>
      </section>
    </>
  )
}

/** Tipo interno para un item del FAQ — match al shape en messages/es.json */
type FAQItem = {
  q: string
  a?: string
  aIntro?: string
  aBullets?: string[]
}
