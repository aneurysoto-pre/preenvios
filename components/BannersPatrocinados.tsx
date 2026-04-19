'use client'

import { useLocale } from 'next-intl'
import { Landmark, Building2, Zap, Gift, type LucideIcon } from 'lucide-react'

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
  href: string
}

// Mock data — links apuntan a '#' hasta tener acuerdos firmados.
// Swap href + remove la etiqueta 'Patrocinado' si cambian a partner acuerdos reales.
const BANNERS: Banner[] = [
  {
    id: 'banreservas',
    Icon: Landmark,
    bgCls: 'bg-[#FEF2F2] border-[#FECACA]',
    iconCls: 'bg-[#C8102E]',
    title_es: 'Banreservas',
    title_en: 'Banreservas',
    offer_es: 'Tasa hoy 60.50 DOP/USD',
    offer_en: "Today's rate 60.50 DOP/USD",
    cta_es: 'Abrir cuenta',
    cta_en: 'Open account',
    href: '#',
  },
  {
    id: 'banco-popular',
    Icon: Building2,
    bgCls: 'bg-[#EFF6FF] border-[#BFDBFE]',
    iconCls: 'bg-[#003087]',
    title_es: 'Banco Popular',
    title_en: 'Banco Popular',
    offer_es: 'Cuenta para diáspora',
    offer_en: 'Diaspora account',
    cta_es: 'Más info',
    cta_en: 'Learn more',
    href: '#',
  },
  {
    id: 'viamericas',
    Icon: Zap,
    bgCls: 'bg-[#F0FDF4] border-[#BBF7D0]',
    iconCls: 'bg-[#00A859]',
    title_es: 'Viamericas',
    title_en: 'Viamericas',
    offer_es: '$0 comisión primer envío',
    offer_en: '$0 fee first transfer',
    cta_es: 'Enviar ahora',
    cta_en: 'Send now',
    href: '#',
  },
  {
    id: 'boss-money',
    Icon: Gift,
    bgCls: 'bg-[#FFF7ED] border-[#FED7AA]',
    iconCls: 'bg-[#FF6B00]',
    title_es: 'Boss Money',
    title_en: 'Boss Money',
    offer_es: 'Primer envío gratis hasta $300',
    offer_en: 'First transfer free up to $300',
    cta_es: 'Probar',
    cta_en: 'Try it',
    href: '#',
  },
]

export default function BannersPatrocinados() {
  const locale = useLocale()
  const en = locale === 'en'

  return (
    <section
      className="py-8"
      aria-label={en ? 'Sponsored offers' : 'Ofertas patrocinadas'}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <p className="text-[11px] text-g500 text-center mb-3 tracking-wider uppercase">
          {en ? 'Sponsored' : 'Patrocinado'}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 justify-center max-w-[1160px] mx-auto">
          {BANNERS.map(b => {
            const title = en ? b.title_en : b.title_es
            const offer = en ? b.offer_en : b.offer_es
            const cta = en ? b.cta_en : b.cta_es
            return (
              <article
                key={b.id}
                className={`relative rounded-[12px] border ${b.bgCls} p-4 h-[160px] lg:h-[140px] lg:max-w-[280px] flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(15,23,42,.15)]`}
              >
                {/* Icon top-left */}
                <div className={`w-8 h-8 ${b.iconCls} rounded-lg flex items-center justify-center text-white shrink-0`}>
                  <b.Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>

                {/* Title + offer */}
                <div className="mt-2.5 flex-1 min-h-0">
                  <h3 className="font-heading text-[14px] font-bold text-ink mb-1 leading-tight">{title}</h3>
                  <p className="text-[16px] font-black text-green-dark leading-tight">{offer}</p>
                </div>

                {/* CTA bottom-right */}
                <a
                  href={b.href}
                  rel="noopener sponsored"
                  target="_blank"
                  data-sponsor-slot={b.id}
                  className="absolute bottom-3 right-3 text-[12px] font-extrabold text-blue hover:text-blue-dark inline-flex items-center gap-1 transition-colors"
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
