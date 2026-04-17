'use client'

import { useTranslations, useLocale } from 'next-intl'
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

export function WhySection() {
  const t = useTranslations('why')
  const items = [
    { key: 'bestRate', icon: '💰', cls: 'bg-blue-soft text-blue' },
    { key: 'instant', icon: '⚡', cls: 'bg-green-soft text-green-dark' },
    { key: 'trusted', icon: '🔒', cls: 'bg-[#FEF3C7] text-[#B45309]' },
  ]
  return (
    <section className="py-[90px] bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('tag')}</span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">{t('title')}</h2>
          <p className="text-ink-2 text-[17px]">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(it => (
            <div key={it.key} className="bg-g50 border border-g200 rounded-[22px] p-8 transition-all hover:-translate-y-1.5 hover:bg-white hover:shadow-lg hover:border-blue-soft">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-[26px] ${it.cls}`}>{it.icon}</div>
              <h3 className="font-heading text-xl font-extrabold mb-2.5">{t(it.key)}</h3>
              <p className="text-ink-2 text-[15px]">{t(`${it.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StepsSection() {
  const t = useTranslations('steps')
  return (
    <section className="py-[90px] bg-gradient-to-b from-g50 to-white" id="como">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-[720px] mx-auto mb-14">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('tag')}</span>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] font-black leading-[1.1] mb-3.5">{t('title')}</h2>
          <p className="text-ink-2 text-[17px]">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-g300)_0_8px,transparent_8px_16px)]" />
          {[1, 2, 3].map(n => (
            <div key={n} className="relative text-center px-5">
              <div className="w-20 h-20 mx-auto mb-5 bg-white border-2 border-g200 rounded-full flex items-center justify-center text-3xl font-black text-blue font-heading shadow-[0_4px_14px_rgba(15,23,42,.08)] relative">{n}</div>
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
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="bg-gradient-to-br from-blue to-blue-dark rounded-[32px] py-16 px-6 md:px-12 text-center text-white relative overflow-hidden">
          <div className="absolute w-[400px] h-[400px] -top-[150px] -right-[100px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <div className="absolute w-[300px] h-[300px] -bottom-[120px] -left-[60px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
          <h2 className="font-heading text-[clamp(28px,3.5vw,42px)] font-black mb-3.5 relative">{t('title')}</h2>
          <p className="text-[17px] opacity-90 max-w-[540px] mx-auto mb-7 relative">{t('subtitle')}</p>
          <a href="#comparar" className="inline-block bg-white text-blue py-[15px] px-8 rounded-full font-extrabold text-[15px] relative transition-transform hover:-translate-y-0.5 hover:shadow-lg">{t('button')} →</a>
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
  const locale = useLocale()
  return (
    <footer className="bg-ink text-g400 pt-[70px] pb-8">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight mb-3.5">
              <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#00D957" />
                <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
              </svg>
              <span><span className="text-green">pre</span><span className="text-white">envios</span><span className="text-g400">.com</span></span>
            </div>
            <p className="text-sm max-w-[300px] mb-5">{t('desc')}</p>
          </div>
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('product')}</h4>
            <a href="#comparar" className="block py-1.5 text-sm hover:text-white transition-colors">{t('compare')}</a>
            {PAISES_MVP.map(p => (
              <a key={p.corredorId} href={`/${locale}/${locale === 'en' ? p.slugEn : p.slugEs}`} className="block py-1.5 text-sm hover:text-white transition-colors">
                {p.bandera} {locale === 'en' ? p.nombreEn : p.nombre}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('company')}</h4>
            <a href={`/${locale}/operadores/remitly`} className="block py-1.5 text-sm hover:text-white transition-colors">Remitly</a>
            <a href={`/${locale}/operadores/wise`} className="block py-1.5 text-sm hover:text-white transition-colors">Wise</a>
            <a href={`/${locale}/operadores/western-union`} className="block py-1.5 text-sm hover:text-white transition-colors">Western Union</a>
            <a href={`/${locale}/wiki`} className="block py-1.5 text-sm hover:text-white transition-colors">{locale === 'en' ? 'Guides' : 'Guías'}</a>
            <a href={`/${locale}/blog`} className="block py-1.5 text-sm hover:text-white transition-colors">Blog</a>
            <a href="mailto:contact@preenvios.com" className="block py-1.5 text-sm hover:text-white transition-colors">{t('contact')}</a>
          </div>
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-extrabold">{t('legal')}</h4>
            <a href={`/${locale}/privacidad`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('privacy')}</a>
            <a href={`/${locale}/terminos`} className="block py-1.5 text-sm hover:text-white transition-colors">{t('terms')}</a>
            <a href={`/${locale}/como-ganamos-dinero`} className="block py-1.5 text-sm hover:text-white transition-colors">{locale === 'en' ? 'How we earn' : 'Cómo ganamos dinero'}</a>
            <a href={`/${locale}/uso-de-marcas`} className="block py-1.5 text-sm hover:text-white transition-colors">{locale === 'en' ? 'Trademarks' : 'Uso de marcas'}</a>
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
