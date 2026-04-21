'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Calculator, TrendingUp, Bell, Heart, type LucideIcon } from 'lucide-react'

type Banner = {
  id: string
  /** Key dentro de messages/{es,en}.json banners.* */
  i18nKey: 'calcInversa' | 'tasaHonduras' | 'alertasGratis' | 'nosotros'
  Icon: LucideIcon
  /** Background + border de la tarjeta (Tailwind arbitrary values) */
  bgCls: string
  /** Background del circulo del icono */
  iconCls: string
  /** Path relativo al locale (ej. '/calculadora-inversa'). El href se calcula como /{locale}{path}. */
  path: string
}

// Publicidad propia de PreEnvios — 4 herramientas/paginas del sitio.
// Reemplaza los banners de sponsors mock (Banreservas/Popular/Viamericas/Boss
// Money con links '#') que existian hasta 2026-04-20. Decision: mostrar solo
// contenido propio funcional hasta tener acuerdos firmados con partners reales.
// Cuando haya acuerdos de sponsorship, volver a agregar banners patrocinados
// como un 2do bloque separado, dejando estos 4 como "Mas de PreEnvios" aparte.
//
// Data mantenida aca: id, icono, clases visuales, path. Textos (title, offer,
// cta) migrados a messages/{es,en}.json bajo banners.{i18nKey} — permite
// cambiar copy sin tocar codigo y mantiene consistencia i18n con el resto del
// sitio.
const BANNERS: Banner[] = [
  {
    id: 'calc-inversa',
    i18nKey: 'calcInversa',
    Icon: Calculator,
    bgCls: 'bg-[#FEF2F2] border-[#FECACA]',
    iconCls: 'bg-[#C8102E]',
    path: '/calculadora-inversa',
  },
  {
    id: 'tasa-honduras',
    i18nKey: 'tasaHonduras',
    Icon: TrendingUp,
    bgCls: 'bg-[#EFF6FF] border-[#BFDBFE]',
    iconCls: 'bg-[#003087]',
    path: '/tasa/usd-hnl',
  },
  {
    id: 'alertas-gratis',
    i18nKey: 'alertasGratis',
    Icon: Bell,
    bgCls: 'bg-[#F0FDF4] border-[#BBF7D0]',
    iconCls: 'bg-[#00A859]',
    // Apunta a /nosotros (pagina institucional) — el texto del banner
    // sigue siendo "Alertas diarias gratis" como hook CTA, pero lleva
    // al usuario a conocer el proyecto. Si se decide tener pagina
    // dedicada de alertas en el futuro, actualizar este path.
    path: '/nosotros',
  },
  {
    id: 'nosotros',
    i18nKey: 'nosotros',
    Icon: Heart,
    bgCls: 'bg-[#FFF7ED] border-[#FED7AA]',
    iconCls: 'bg-[#FF6B00]',
    path: '/nosotros',
  },
]

export default function BannersPatrocinados() {
  const locale = useLocale()
  const en = locale === 'en'
  const t = useTranslations('banners')

  return (
    <section
      id="banners-patrocinados"
      className="pt-2 pb-0 scroll-mt-[48px]"
      aria-label={en ? 'More from PreEnvios' : 'Más de PreEnvios'}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Grid:
            - mobile + tablet (<1024px): 2 col (layout 2x2 con 4 banners)
            - desktop (≥1024px): 4 col con max-w por card (1 fila)
            Decision: mantener 2x2 mobile aunque las cards sean mas
            apretadas — usuarios esperan densidad en banners CTA mobile
            segun patron establecido. Toda la card clickeable compensa
            la menor tap area de cada card (todo el area del tile responde). */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 justify-center max-w-[1160px] mx-auto">
          {BANNERS.map(b => {
            const title = t(`${b.i18nKey}.title`)
            const offer = t(`${b.i18nKey}.offer`)
            const cta = t(`${b.i18nKey}.cta`)
            const href = `/${locale}${b.path}`
            return (
              // TODA la card clickeable — Link como elemento root.
              // Patron Airbnb/Booking/Monito: el "cta" visual abajo a la
              // derecha es solo indicador visual, pero el tap funciona
              // en cualquier parte del area del card. Mejora conversion
              // en mobile (tap area mas grande) y a11y (usuarios con
              // dedos grandes o tremor no tienen que apuntar al boton).
              <Link
                key={b.id}
                href={href}
                data-cta-id={b.id}
                className={`relative rounded-[12px] border ${b.bgCls} p-4 h-[160px] lg:h-[140px] lg:max-w-[280px] flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(15,23,42,.15)]`}
              >
                {/* Icon top-left */}
                <div className={`w-8 h-8 ${b.iconCls} rounded-lg flex items-center justify-center text-white shrink-0`}>
                  <b.Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>

                {/* Title + offer — todo en font-heading (Work Sans) para viveza visual */}
                <div className="mt-2.5 flex-1 min-h-0">
                  <h3 className="font-heading text-[14px] font-bold text-ink mb-1 leading-tight">
                    {title}
                  </h3>
                  <p className="font-heading text-[16px] font-black text-green-dark leading-tight">
                    {offer}
                  </p>
                </div>

                {/* CTA visual bottom-right — <span>, NO <a>. Es solo
                    affordance visual ("mira, aqui tocas"). El tap real
                    lo captura el Link padre. Evita anidar <a> dentro
                    de <a> (HTML invalido). */}
                <span
                  aria-hidden="true"
                  className="font-heading absolute bottom-3 right-3 text-[12px] font-extrabold text-blue inline-flex items-center gap-1"
                >
                  {cta}
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
