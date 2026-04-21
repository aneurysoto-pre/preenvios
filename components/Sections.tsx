'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { DollarSign, Zap, ShieldCheck, Search, BarChart3, Send } from 'lucide-react'
import { useScrollToHashOnMount } from '@/lib/hooks/use-scroll-to-hash'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// ═════════════════════════════════════════════════════════════
// LOGO STRIP — marcas comparadas (7 remesadoras)
// ═════════════════════════════════════════════════════════════
const BRANDS = ['Remitly', 'Wise', 'Xoom', 'Ria', 'WorldRemit', 'Western Union', 'MoneyGram']
const BRAND_DOMAINS: Record<string, string> = {
  Remitly: 'remitly.com',
  Wise: 'wise.com',
  Xoom: 'xoom.com',
  Ria: 'riamoneytransfer.com',
  WorldRemit: 'worldremit.com',
  'Western Union': 'westernunion.com',
  MoneyGram: 'moneygram.com',
}

export function LogoStrip() {
  const t = useTranslations('strip')
  return (
    <section className="bg-white py-6">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center text-[11px] font-bold text-g500 tracking-[2px] uppercase mb-4">
          {t('title')}
        </div>
        <div className="flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
          {BRANDS.map(b => (
            <div
              key={b}
              className="flex items-center gap-2 h-9 transition-transform hover:-translate-y-0.5"
            >
              <Image
                src={`https://cdn.brandfetch.io/${BRAND_DOMAINS[b]}/w/120/h/120`}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                unoptimized
                className="h-7 w-7 object-contain rounded-md shrink-0"
              />
              <span className="font-heading font-extrabold text-[15px] text-ink whitespace-nowrap">
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// WHY SECTION — 3 razones (mobile-first: 1 col → 3 cols desktop)
// ═════════════════════════════════════════════════════════════

/** @param region — replaces "Latinoamérica"/"Latin America" in title/subtitle (e.g. "Guatemala") */
export function WhySection({ region }: { region?: string } = {}) {
  const t = useTranslations('why')
  const locale = useLocale()
  const items = [
    { key: 'bestRate', Icon: DollarSign,  cls: 'bg-blue-soft text-blue' },
    { key: 'instant',  Icon: Zap,         cls: 'bg-green-soft text-green-dark' },
    { key: 'trusted',  Icon: ShieldCheck, cls: 'bg-[#FEF3C7] text-[#B45309]' },
  ]
  const title = region
    ? t('title').replace(locale === 'en' ? 'Latin America' : 'Latinoamérica', region)
    : t('title')
  const subtitle = region
    ? t('subtitle').replace(
        locale === 'en' ? 'all providers' : 'todas las remesadoras',
        locale === 'en' ? `all providers to ${region}` : `todas las remesadoras a ${region}`
      )
    : t('subtitle')
  return (
    <section className="pt-[90px] pb-[50px] bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">
            {t('tag')}
          </span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">
            {title}
          </h2>
          <p className="text-ink-2 text-[17px]">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ key, Icon, cls }) => (
            <div
              key={key}
              className="bg-g50 border border-g200 rounded-[22px] p-8 transition-all hover:-translate-y-1.5 hover:bg-white hover:shadow-lg hover:border-blue-soft"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${cls}`}>
                <Icon size={28} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-extrabold mb-2.5">{t(key)}</h3>
              <p className="text-ink-2 text-[15px]">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// STEPS SECTION — cómo funciona en 3 pasos
// NOTA: removida la línea punteada decorativa con `hidden md:block`
// que conectaba los 3 steps en desktop (violaba Regla 4 del founder:
// switches hidden/block). El layout md:grid-cols-3 ya comunica
// secuencia sin necesidad del decorativo.
// ═════════════════════════════════════════════════════════════
export function StepsSection() {
  const t = useTranslations('steps')
  useScrollToHashOnMount('como')
  const steps = [
    { n: 1, Icon: Search,     cls: 'from-blue to-blue-dark' },
    { n: 2, Icon: BarChart3,  cls: 'from-green to-green-dark' },
    { n: 3, Icon: Send,       cls: 'from-[#F97316] to-[#EA580C]' },
  ]
  return (
    <section
      className="pt-[50px] pb-[90px] bg-gradient-to-b from-g50 to-white scroll-mt-[72px]"
      id="como"
    >
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">
            {t('tag')}
          </span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">
            {t('title')}
          </h2>
          <p className="text-ink-2 text-[17px]">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map(({ n, Icon, cls }) => (
            <div key={n} className="relative text-center px-5">
              <div className="relative w-12 h-12 mx-auto mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${cls} rounded-full flex items-center justify-center text-white shadow-[0_6px_14px_-4px_rgba(10,79,229,.3)]`}
                >
                  <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-g200 rounded-full flex items-center justify-center text-[11px] font-heading font-black text-ink shadow-sm">
                  {n}
                </span>
              </div>
              <h3 className="font-heading text-xl font-extrabold mb-2.5">{t(`step${n}`)}</h3>
              <p className="text-ink-2 text-[15px]">{t(`step${n}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// CTA SECTION — scroll al comparador
// Decorative circles contenidos por overflow-hidden del parent.
// ═════════════════════════════════════════════════════════════
export function CTASection() {
  const t = useTranslations('cta')
  // Scrolls to the hero calculator accounting for the fixed 48px header (+ 8px aire).
  // Works on home and on country pages (/honduras, /guatemala...) because both
  // render <Comparador /> which has id="calculadora" on the hero section.
  function scrollToCalculator() {
    const el =
      document.getElementById('calculadora') ||
      document.querySelector<HTMLElement>('[data-section="calculadora"]')
    if (!el) return
    const headerHeight = 56
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
  return (
    <section className="py-[70px]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue to-blue-dark rounded-[32px] py-14 px-5 sm:px-8 md:py-16 md:px-12 text-center text-white relative overflow-hidden">
          <div className="absolute w-[400px] h-[400px] -top-[150px] -right-[100px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <div className="absolute w-[300px] h-[300px] -bottom-[120px] -left-[60px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <h2 className="font-heading text-[clamp(24px,3.5vw,42px)] font-black mb-3.5 relative leading-[1.15] px-1">
            {t('title')}
          </h2>
          <p className="text-[15px] sm:text-[17px] opacity-90 max-w-[540px] mx-auto mb-7 relative px-2">
            {t('subtitle')}
          </p>
          <button
            type="button"
            onClick={scrollToCalculator}
            className="inline-flex items-center justify-center gap-1.5 bg-white text-blue py-4 px-7 sm:px-8 rounded-full font-extrabold text-[15px] whitespace-nowrap relative transition-transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            <span>{t('button')}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// FAQ SECTION — shadcn Accordion (Radix)
// Reemplaza <details>/<summary> nativos con Accordion que incluye:
// - Animacion suave de apertura/cierre (data-open:animate-accordion-down)
// - Chevron que alterna automatico via aria-expanded
// - Keyboard navigation completa (↑↓ enter space home end)
// - ARIA completo (aria-controls, aria-labelledby, role="region")
// ═════════════════════════════════════════════════════════════
export function FAQSection() {
  const t = useTranslations('faq')
  useScrollToHashOnMount('faq')
  const keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const
  return (
    <section className="py-[90px] bg-g50 scroll-mt-[72px]" id="faq">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">
            {t('tag')}
          </span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1]">
            {t('title')}
          </h2>
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="q1"
          className="max-w-[760px] mx-auto flex flex-col gap-3"
        >
          {keys.map(k => (
            <AccordionItem
              key={k}
              value={k}
              className="bg-white border border-g200 rounded-[14px] overflow-hidden transition-colors hover:border-blue-soft data-[state=open]:border-blue-soft"
            >
              <AccordionTrigger className="px-6 py-5 font-bold text-base text-ink hover:no-underline [&>svg]:size-5 [&>svg]:text-blue">
                {t(k)}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-ink-2 text-[15px]">
                {t(`a${k.slice(1)}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// FOOTER — 5 columnas grid desktop, stacks mobile
// Migracion: <a href> internos → <Link> de next/link para prefetch
// automatico de rutas y navegacion client-side sin full reload.
// ═════════════════════════════════════════════════════════════
export function Footer() {
  const t = useTranslations('footer')
  const td = useTranslations('disclaimers')
  const tn = useTranslations('nav')
  const locale = useLocale()
  const en = locale === 'en'
  return (
    <footer className="bg-ink text-g400 pt-[70px] pb-8">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight mb-3.5">
              <svg
                className="w-[26px] h-[26px] shrink-0"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <rect width="40" height="40" rx="10" fill="#00D957" />
                <path
                  d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z"
                  fill="#fff"
                />
              </svg>
              <span>
                <span className="text-green">pre</span>
                <span className="text-white">envios</span>
                <span className="text-g400">.com</span>
              </span>
            </div>
            <p className="text-sm max-w-[300px] mb-5">{t('desc')}</p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">
              {t('product')}
            </h4>
            <Link
              href={`/${locale}/#calculadora`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {tn('corridors')}
            </Link>
            <Link
              href={`/${locale}/#como`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {tn('howItWorks')}
            </Link>
            <Link
              href={`/${locale}/#faq`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {tn('faq')}
            </Link>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">
              {t('resources')}
            </h4>
            <Link
              href={`/${locale}/wiki`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {t('wiki')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href={`/${locale}/calculadora-inversa`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {en ? 'Reverse calculator' : 'Calculadora inversa'}
            </Link>
            <Link
              href={`/${locale}/operadores/remitly`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {t('operators')}
            </Link>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">
              {t('company')}
            </h4>
            <Link
              href={`/${locale}/nosotros`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {en ? 'About us' : 'Nosotros'}
            </Link>
            {/* Contacto: mailto directo mientras se rehace el form.
                No usar <Link> porque el Next.js Link normaliza mailto a
                href absoluto sin issue pero el prefetch intenta parsear
                la URL; usar <a> plano es mas limpio para mailto. */}
            <a
              href="mailto:contact@preenvios.com"
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {tn('contact')}
            </a>
            <Link
              href={`/${locale}/como-ganamos-dinero`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {en ? 'How we earn' : 'Cómo ganamos dinero'}
            </Link>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">
              {t('legal')}
            </h4>
            <Link
              href={`/${locale}/terminos`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href={`/${locale}/privacidad`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/disclaimers`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {td('footerLink')}
            </Link>
            <Link
              href={`/${locale}/uso-de-marcas`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {en ? 'Trademarks' : 'Uso de marcas'}
            </Link>
            <Link
              href={`/${locale}/metodologia`}
              className="block py-1.5 text-sm hover:text-white transition-colors"
            >
              {en ? 'Methodology' : 'Metodología'}
            </Link>
          </div>
        </div>
        <div className="border-t border-ink-2 py-5 text-xs text-g400 leading-relaxed max-w-[900px]">
          <p className="mb-2">
            <b className="text-white">{td('d2')}</b>
          </p>
          <p>{t('disclaimerText')}</p>
        </div>
        <div className="border-t border-ink-2 pt-5 flex justify-between flex-wrap gap-3.5 text-[13px] text-g400">
          <div>{t('copyright')}</div>
          <div>{t('route')}</div>
        </div>
      </div>
    </footer>
  )
}
