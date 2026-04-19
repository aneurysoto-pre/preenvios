'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { PAISES_MVP } from '@/lib/paises'

// Inline SVG flags — emoji flags (🇺🇸 🇪🇸) don't render as flags on Windows
// and fall back to the two-letter region code ("us"/"es") which looks like a bug.
function FlagUS({ className = 'w-5 h-[14px]' }: { className?: string }) {
  return (
    <svg className={`${className} rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(15,23,42,.08)]`} viewBox="0 0 60 30" aria-hidden="true">
      <rect width="60" height="30" fill="#fff" />
      <g fill="#B22234">
        <rect y="0" width="60" height="2.3" />
        <rect y="4.6" width="60" height="2.3" />
        <rect y="9.2" width="60" height="2.3" />
        <rect y="13.8" width="60" height="2.3" />
        <rect y="18.4" width="60" height="2.3" />
        <rect y="23" width="60" height="2.3" />
        <rect y="27.6" width="60" height="2.4" />
      </g>
      <rect width="24" height="16.2" fill="#3C3B6E" />
    </svg>
  )
}

function FlagES({ className = 'w-5 h-[14px]' }: { className?: string }) {
  return (
    <svg className={`${className} rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(15,23,42,.08)]`} viewBox="0 0 60 40" aria-hidden="true">
      <rect width="60" height="40" fill="#C60B1E" />
      <rect y="10" width="60" height="20" fill="#FFC400" />
    </svg>
  )
}

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [corridorOpen, setCorridorOpen] = useState(false)
  const corridorRef = useRef<HTMLDivElement>(null)

  const en = locale === 'en'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close corridor dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (corridorRef.current && !corridorRef.current.contains(e.target as Node)) {
        setCorridorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale() {
    const next = locale === 'es' ? 'en' : 'es'
    const path = pathname.replace(`/${locale}`, `/${next}`)
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'cambio_idioma', {
        event_category: 'i18n',
        idioma_anterior: locale,
        idioma_nuevo: next,
      })
    }
    router.push(path)
  }

  function closeMenu() { setMenuOpen(false) }

  // Anchors that only exist on the home. From any other page, prefix with /${locale}
  // so the browser navigates home and then scrolls.
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const homeAnchor = (hash: string) => (isHome ? hash : `/${locale}${hash}`)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-[14px] border-b border-g200 transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_14px_rgba(15,23,42,.08)]' : ''}`}>
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`} className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight">
          <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#00D957" />
            <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
          </svg>
          <span><span className="text-green">pre</span><span className="text-ink">envios</span><span className="text-ink font-bold">.com</span></span>
        </a>

        {/* Desktop links — order: Destinos, Como funciona, FAQ, Contacto, ES/EN */}
        <div className="hidden md:flex gap-8 items-center">
          {/* Destinos dropdown */}
          <div ref={corridorRef} className="relative">
            <button
              onClick={() => setCorridorOpen(!corridorOpen)}
              className="text-sm font-semibold text-g600 hover:text-blue transition-colors flex items-center gap-1"
            >
              {t('corridors')}
              <svg className={`w-3.5 h-3.5 transition-transform ${corridorOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {corridorOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-xl border border-[var(--color-g200)] shadow-lg py-2 min-w-[220px] z-50">
                {PAISES_MVP.map(p => (
                  <a
                    key={p.corredorId}
                    href={`/${locale}/${en ? p.slugEn : p.slugEs}`}
                    onClick={() => setCorridorOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-g50)] transition-colors"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                      alt=""
                      width={24}
                      height={16}
                      loading="lazy"
                      decoding="async"
                      className="w-[22px] h-[15px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
                    />
                    <span>{en ? p.nombreEn : p.nombre}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href={homeAnchor('#como')} className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('howItWorks')}</a>
          <a href={homeAnchor('#faq')} className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('faq')}</a>
          <a href={`/${locale}/contacto`} className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('contact')}</a>
          <button
            onClick={switchLocale}
            className="text-sm font-bold text-g700 hover:text-blue border border-g200 hover:border-blue rounded-full px-3 py-1.5 transition-colors inline-flex items-center gap-2"
            aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
          >
            {locale === 'es' ? <FlagUS /> : <FlagES />}
            <span>{locale === 'es' ? 'English' : 'Español'}</span>
          </button>
        </div>

        {/* Burger */}
        <button className="md:hidden p-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`block w-[22px] h-[2px] bg-ink rounded-sm transition-transform duration-250 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-[22px] h-[2px] bg-ink rounded-sm my-[5px] transition-opacity duration-250 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-[22px] h-[2px] bg-ink rounded-sm transition-transform duration-250 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-g200 shadow-lg z-[99] px-6 py-4 flex flex-col gap-1 max-h-[calc(100vh-72px)] overflow-y-auto">
          <p className="pt-1 pb-1 px-1 text-xs font-extrabold text-[var(--color-g500)] uppercase tracking-wider">{t('corridors')}</p>
          {PAISES_MVP.map(p => (
            <a
              key={p.corredorId}
              href={`/${locale}/${en ? p.slugEn : p.slugEs}`}
              onClick={closeMenu}
              className="py-3 px-1 text-base font-bold text-ink border-b border-g100 flex items-center gap-3"
            >
              <img
                src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                alt=""
                width={28}
                height={19}
                loading="lazy"
                decoding="async"
                className="w-[26px] h-[18px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
              />
              {en ? p.nombreEn : p.nombre}
            </a>
          ))}
          <a href={homeAnchor('#como')} onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('howItWorks')}</a>
          <a href={homeAnchor('#faq')} onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('faq')}</a>
          <a href={`/${locale}/contacto`} onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('contact')}</a>
          <button onClick={() => { switchLocale(); closeMenu() }} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100 text-left inline-flex items-center gap-2.5">
            {locale === 'es' ? <FlagUS className="w-6 h-[17px]" /> : <FlagES className="w-6 h-[17px]" />}
            <span>{locale === 'es' ? 'English' : 'Español'}</span>
          </button>
        </div>
      )}
    </nav>
  )
}
