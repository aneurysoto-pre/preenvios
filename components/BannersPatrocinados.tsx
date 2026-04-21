'use client'

import { useLocale } from 'next-intl'
import { Calculator, TrendingUp, Bell, Heart, type LucideIcon } from 'lucide-react'

type Banner = {
  id: string
  Icon: LucideIcon
  bgCls: string      // tarjeta background + border (tailwind arbitrary values)
  iconCls: string    // circulo del icono background
  title_es: string
  title_en: string
  offer_es: string
  offer_en: string
  cta_es: string
  cta_en: string
  /** Path relativo al locale (ej. '/calculadora-inversa'). El href se calcula como /{locale}{path}. */
  path: string
}

// Publicidad propia de PreEnvios — 4 herramientas/paginas del sitio.
// Reemplaza los banners de sponsors mock (Banreservas/Popular/Viamericas/Boss
// Money con links '#') que existian hasta 2026-04-20. Decision: mostrar solo
// contenido propio funcional hasta tener acuerdos firmados con partners reales.
// Cuando haya acuerdos de sponsorship, volver a agregar banners patrocinados
// como un 2do bloque separado, dejando estos 4 como "Mas de PreEnvios" aparte.
const BANNERS: Banner[] = [
  {
    id: 'calc-inversa',
    Icon: Calculator,
    bgCls: 'bg-[#FEF2F2] border-[#FECACA]',
    iconCls: 'bg-[#C8102E]',
    title_es: 'Calculadora inversa',
    title_en: 'Reverse calculator',
    offer_es: '¿Cuánto USD te mandaron?',
    offer_en: 'How many USD were sent?',
    cta_es: 'Calcular',
    cta_en: 'Calculate',
    path: '/calculadora-inversa',
  },
  {
    id: 'tasa-honduras',
    Icon: TrendingUp,
    bgCls: 'bg-[#EFF6FF] border-[#BFDBFE]',
    iconCls: 'bg-[#003087]',
    title_es: 'Tasa del lempira',
    title_en: 'Lempira rate',
    offer_es: '30 días de historia, gratis',
    offer_en: '30-day history, free',
    cta_es: 'Ver tasa',
    cta_en: 'View rate',
    path: '/tasa/usd-hnl',
  },
  {
    id: 'alertas-gratis',
    Icon: Bell,
    bgCls: 'bg-[#F0FDF4] border-[#BBF7D0]',
    iconCls: 'bg-[#00A859]',
    title_es: 'Alertas diarias gratis',
    title_en: 'Free daily alerts',
    offer_es: 'La mejor tasa del día en tu email',
    offer_en: "Today's best rate in your inbox",
    cta_es: 'Suscribirme',
    cta_en: 'Subscribe',
    path: '/tasa/usd-hnl',
  },
  {
    id: 'nosotros',
    Icon: Heart,
    bgCls: 'bg-[#FFF7ED] border-[#FED7AA]',
    iconCls: 'bg-[#FF6B00]',
    title_es: 'Hecho por la diáspora',
    title_en: 'Made by the diaspora',
    offer_es: 'Gratis, sin registro, transparente',
    offer_en: 'Free, no signup, transparent',
    cta_es: 'Conocenos',
    cta_en: 'Learn more',
    path: '/nosotros',
  },
]

export default function BannersPatrocinados() {
  const locale = useLocale()
  const en = locale === 'en'

  return (
    <section
      id="banners-patrocinados"
      className="pt-2 pb-0 scroll-mt-[48px]"
      aria-label={en ? 'More from PreEnvios' : 'Más de PreEnvios'}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 justify-center max-w-[1160px] mx-auto">
          {BANNERS.map(b => {
            const title = en ? b.title_en : b.title_es
            const offer = en ? b.offer_en : b.offer_es
            const cta = en ? b.cta_en : b.cta_es
            const href = `/${locale}${b.path}`
            return (
              <article
                key={b.id}
                className={`relative rounded-[12px] border ${b.bgCls} p-4 h-[160px] lg:h-[140px] lg:max-w-[280px] flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(15,23,42,.15)]`}
              >
                {/* Icon top-left */}
                <div className={`w-8 h-8 ${b.iconCls} rounded-lg flex items-center justify-center text-white shrink-0`}>
                  <b.Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>

                {/* Title + offer — todo en font-heading (Work Sans) para viveza visual */}
                <div className="mt-2.5 flex-1 min-h-0">
                  <h3 className="font-heading text-[14px] font-bold text-ink mb-1 leading-tight">{title}</h3>
                  <p className="font-heading text-[16px] font-black text-green-dark leading-tight">{offer}</p>
                </div>

                {/* CTA bottom-right */}
                <a
                  href={href}
                  data-cta-id={b.id}
                  className="font-heading absolute bottom-3 right-3 text-[12px] font-extrabold text-blue hover:text-blue-dark inline-flex items-center gap-1 transition-colors"
                >
                  {cta}
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
