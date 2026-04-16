'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocale() {
    const next = locale === 'es' ? 'en' : 'es'
    const path = pathname.replace(`/${locale}`, `/${next}`)
    router.push(path)
  }

  function closeMenu() { setMenuOpen(false) }

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

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#comparar" className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('compare')}</a>
          <a href="#como" className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('howItWorks')}</a>
          <a href="#faq" className="text-sm font-semibold text-g600 hover:text-blue transition-colors">{t('faq')}</a>
          <button onClick={switchLocale} className="text-sm font-bold text-g600 hover:text-blue border border-g200 rounded-full px-3 py-1.5 transition-colors">
            {locale === 'es' ? 'EN' : 'ES'}
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
        <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-g200 shadow-lg z-[99] px-6 py-4 flex flex-col gap-1">
          <a href="#comparar" onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('compare')}</a>
          <a href="#como" onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('howItWorks')}</a>
          <a href="#faq" onClick={closeMenu} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100">{t('faq')}</a>
          <button onClick={() => { switchLocale(); closeMenu() }} className="py-3.5 px-1 text-base font-bold text-ink border-b border-g100 text-left">
            {locale === 'es' ? '🌐 English' : '🌐 Español'}
          </button>
        </div>
      )}
    </nav>
  )
}
