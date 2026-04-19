'use client'

import { useTranslations, useLocale } from 'next-intl'
import { DollarSign, Zap, ShieldCheck, Search, BarChart3, Send } from 'lucide-react'
import { PAISES_MVP } from '@/lib/paises'

const BRANDS = ['Remitly', 'Wise', 'Xoom', 'Ria', 'WorldRemit', 'Western Union', 'MoneyGram']
const BRAND_DOMAINS: Record<string, string> = {
  Remitly: 'remitly.com', Wise: 'wise.com', Xoom: 'xoom.com',
  Ria: 'riamoneytransfer.com', WorldRemit: 'worldremit.com',
  'Western Union': 'westernunion.com', MoneyGram: 'moneygram.com',
}

export function LogoStrip() {
  const t = useTranslations('strip')
  return (
    <section className="bg-white py-6">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center text-[11px] font-bold text-g500 tracking-[2px] uppercase mb-4">{t('title')}</div>
        <div className="flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
          {BRANDS.map(b => (
            <div key={b} className="flex items-center gap-2 h-9 transition-transform hover:-translate-y-0.5">
              <img src={`https://cdn.brandfetch.io/${BRAND_DOMAINS[b]}/w/120/h/120`} alt="" width={28} height={28} loading="lazy" decoding="async" className="h-7 w-7 object-contain rounded-md shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="font-heading font-extrabold text-[15px] text-ink whitespace-nowrap">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    ? t('subtitle').replace(locale === 'en' ? 'all providers' : 'todas las remesadoras', locale === 'en' ? `all providers to ${region}` : `todas las remesadoras a ${region}`)
    : t('subtitle')
  return (
    <section className="pt-[90px] pb-[50px] bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('tag')}</span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">{title}</h2>
          <p className="text-ink-2 text-[17px]">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ key, Icon, cls }) => (
            <div key={key} className="bg-g50 border border-g200 rounded-[22px] p-8 transition-all hover:-translate-y-1.5 hover:bg-white hover:shadow-lg hover:border-blue-soft">
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

export function StepsSection() {
  const t = useTranslations('steps')
  const steps = [
    { n: 1, Icon: Search,     cls: 'from-blue to-blue-dark' },
    { n: 2, Icon: BarChart3,  cls: 'from-green to-green-dark' },
    { n: 3, Icon: Send,       cls: 'from-[#F97316] to-[#EA580C]' },
  ]
  return (
    <section className="pt-[50px] pb-[90px] bg-gradient-to-b from-g50 to-white" id="como">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('tag')}</span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">{t('title')}</h2>
          <p className="text-ink-2 text-[17px]">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-11 left-[16%] right-[16%] h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-g300)_0_8px,transparent_8px_16px)]" />
          {steps.map(({ n, Icon, cls }) => (
            <div key={n} className="relative text-center px-5">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className={`w-24 h-24 bg-gradient-to-br ${cls} rounded-full flex items-center justify-center text-white shadow-[0_12px_30px_-8px_rgba(10,79,229,.35)]`}>
                  <Icon size={34} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <span className="absolute -top-1 -right-1 w-8 h-8 bg-white border-2 border-g200 rounded-full flex items-center justify-center text-sm font-heading font-black text-ink shadow-sm">{n}</span>
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

export function CTASection() {
  const t = useTranslations('cta')
  return (
    <section className="py-[70px]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue to-blue-dark rounded-[32px] py-14 px-5 sm:px-8 md:py-16 md:px-12 text-center text-white relative overflow-hidden">
          <div className="absolute w-[400px] h-[400px] -top-[150px] -right-[100px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <div className="absolute w-[300px] h-[300px] -bottom-[120px] -left-[60px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <h2 className="font-heading text-[clamp(24px,3.5vw,42px)] font-black mb-3.5 relative leading-[1.15] px-1">{t('title')}</h2>
          <p className="text-[15px] sm:text-[17px] opacity-90 max-w-[540px] mx-auto mb-7 relative px-2">{t('subtitle')}</p>
          <a
            href="#comparar"
            className="inline-flex items-center justify-center gap-1.5 bg-white text-blue py-4 px-7 sm:px-8 rounded-full font-extrabold text-[15px] whitespace-nowrap relative transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>{t('button')}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const t = useTranslations('faq')
  const keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const
  return (
    <section className="py-[90px] bg-g50" id="faq">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('tag')}</span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1]">{t('title')}</h2>
        </div>
        <div className="max-w-[760px] mx-auto flex flex-col gap-3">
          {keys.map((k, i) => (
            <details key={k} className="bg-white border border-g200 rounded-[14px] overflow-hidden transition-colors hover:border-blue-soft group" open={i === 0}>
              <summary className="px-6 py-5 font-bold text-base cursor-pointer list-none flex justify-between items-center text-ink [&::-webkit-details-marker]:hidden">
                {t(k)}
                <span className="text-2xl text-blue font-normal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-5 text-ink-2 text-[15px]">{t(`a${k.slice(1)}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

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
              <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#00D957" />
                <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
              </svg>
              <span><span className="text-green">pre</span><span className="text-white">envios</span><span className="text-g400">.com</span></span>
            </div>
            <p className="text-sm max-w-[300px] mb-5">{t('desc')}</p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('product')}</h4>
            <a href={`/${locale}/#comparar`} className="block py-1.5 text-sm hover:text-white transition-colors">{tn('corridors')}</a>
            <a href={`/${locale}/#como`} className="block py-1.5 text-sm hover:text-white transition-colors">{tn('howItWorks')}</a>
            <a href={`/${locale}/#faq`} className="block py-1.5 text-sm hover:text-white transition-colors">{tn('faq')}</a>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('resources')}</h4>
            <a href={`/${locale}/wiki`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('wiki')}</a>
            <a href={`/${locale}/blog`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('blog')}</a>
            <a href={`/${locale}/calculadora-inversa`} className="block py-1.5 text-sm hover:text-white transition-colors">{en ? 'Reverse calculator' : 'Calculadora inversa'}</a>
            <a href={`/${locale}/operadores/remitly`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('operators')}</a>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('company')}</h4>
            <a href={`/${locale}/nosotros`} className="block py-1.5 text-sm hover:text-white transition-colors">{en ? 'About us' : 'Nosotros'}</a>
            <a href={`/${locale}/contacto`} className="block py-1.5 text-sm hover:text-white transition-colors">{tn('contact')}</a>
            <a href={`/${locale}/como-ganamos-dinero`} className="block py-1.5 text-sm hover:text-white transition-colors">{en ? 'How we earn' : 'Cómo ganamos dinero'}</a>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('legal')}</h4>
            <a href={`/${locale}/terminos`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('terms')}</a>
            <a href={`/${locale}/privacidad`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('privacy')}</a>
            <a href={`/${locale}/disclaimers`} className="block py-1.5 text-sm hover:text-white transition-colors">{td('footerLink')}</a>
            <a href={`/${locale}/uso-de-marcas`} className="block py-1.5 text-sm hover:text-white transition-colors">{en ? 'Trademarks' : 'Uso de marcas'}</a>
            <a href={`/${locale}/metodologia`} className="block py-1.5 text-sm hover:text-white transition-colors">{en ? 'Methodology' : 'Metodología'}</a>
          </div>
        </div>
        <div className="border-t border-ink-2 py-5 text-xs text-g400 leading-relaxed max-w-[900px]">
          <p className="mb-2"><b className="text-white">{td('d2')}</b></p>
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
