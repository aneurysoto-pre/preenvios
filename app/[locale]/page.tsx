import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <Landing />
}

function Landing() {
  const t = useTranslations()

  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-100 bg-white/90 backdrop-blur-sm border-b border-g200">
        <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight">
            <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#00D957" />
              <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
            </svg>
            <span><span className="text-green">pre</span><span className="text-ink">envios</span><span className="text-ink font-bold">.com</span></span>
          </a>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#comparar" className="text-sm font-semibold text-g600 hover:text-blue">{t('nav.compare')}</a>
            <a href="#como" className="text-sm font-semibold text-g600 hover:text-blue">{t('nav.howItWorks')}</a>
            <a href="#faq" className="text-sm font-semibold text-g600 hover:text-blue">{t('nav.faq')}</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-10 overflow-hidden bg-gradient-to-b from-white to-[#F5F9FF]">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-11 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-g200 px-3 py-1.5 rounded-full text-xs font-semibold text-g700 shadow-sm mb-4">
              <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
              {t('hero.badge')}
            </div>
            <h1 className="font-heading text-[clamp(32px,4.2vw,52px)] font-black leading-[1.05] mb-3.5">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-blue to-green bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-[17px] text-ink-2 max-w-[540px] mb-4">
              {t('hero.lede')}
            </p>
            <div className="flex gap-5 flex-wrap mt-4">
              <span className="flex items-center gap-2 text-[13px] text-ink-2 font-bold">
                <svg className="w-4 h-4 text-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t('hero.noSignup')}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-ink-2 font-bold">
                <svg className="w-4 h-4 text-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t('hero.free')}
              </span>
            </div>
          </div>

          {/* Search card placeholder */}
          <div className="relative">
            <div className="bg-white rounded-[32px] p-5 shadow-xl border border-g200 relative z-2">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-heading text-[17px] font-extrabold">{t('search.title')}</h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-dark bg-green-soft px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                  {t('search.live')}
                </span>
              </div>
              <p className="text-g500 text-sm text-center py-12">
                Calculadora interactiva — Bloque 3
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for remaining sections */}
      <section className="py-20 text-center text-g500">
        <p className="text-lg font-semibold">Bloque 3 — Componentes en construcción</p>
      </section>
    </main>
  )
}
