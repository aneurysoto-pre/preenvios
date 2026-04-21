'use client'

import { useTranslations, useLocale } from 'next-intl'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'

export default function NosotrosContent() {
  const t = useTranslations('nosotros')
  const locale = useLocale()

  const values = [
    { key: 'v1', icon: '👁️', cls: 'bg-blue-soft text-blue' },
    { key: 'v2', icon: '⚖️', cls: 'bg-green-soft text-green-dark' },
    { key: 'v3', icon: '⚡', cls: 'bg-[#FEF3C7] text-[#B45309]' },
    { key: 'v4', icon: '🆓', cls: 'bg-[#FCE7F3] text-[#BE185D]' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-[112px] pb-12 bg-gradient-to-b from-white to-g50">
          <div className="max-w-[820px] mx-auto px-6 text-center">
            <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-4 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('heroTag')}</span>
            <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.15] mb-4 text-ink">{t('heroTitle')}</h1>
            <p className="text-ink-2 text-[17px] max-w-[640px] mx-auto">{t('heroLede')}</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 bg-white">
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-5">{t('storyTitle')}</h2>
            <p className="text-ink-2 text-[16px] leading-relaxed mb-4">{t('storyP1')}</p>
            <p className="text-ink-2 text-[16px] leading-relaxed">{t('storyP2')}</p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 bg-g50">
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-5">{t('missionTitle')}</h2>
            <p className="text-ink-2 text-[16px] leading-relaxed">{t('missionText')}</p>
          </div>
        </section>

        {/* Values — 4 pillars */}
        <section className="py-14 bg-white">
          <div className="max-w-[1040px] mx-auto px-6">
            <div className="text-center max-w-[640px] mx-auto mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-black mb-2">{t('valuesTitle')}</h2>
              <p className="text-ink-2 text-[16px]">{t('valuesSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {values.map(v => (
                <div key={v.key} className="bg-g50 border border-g200 rounded-[18px] p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md hover:border-blue-soft">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl ${v.cls}`}>{v.icon}</div>
                  <h3 className="font-heading text-lg font-extrabold mb-2">{t(`${v.key}Title`)}</h3>
                  <p className="text-ink-2 text-[15px] leading-relaxed">{t(`${v.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue / how we earn */}
        <section className="py-12 bg-g50">
          <div className="max-w-[760px] mx-auto px-6">
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-5">{t('revenueTitle')}</h2>
            <p className="text-ink-2 text-[16px] leading-relaxed mb-4">{t('revenueText')}</p>
            <a href={`/${locale}/como-ganamos-dinero`} className="inline-block text-blue font-bold text-[15px] hover:underline">
              {t('revenueLink')}
            </a>
          </div>
        </section>

        {/* CTA — mailto directo mientras se rehace el form de contacto
            con shadcn/ui Form (commit siguiente pendiente). */}
        <section className="pt-10 pb-16 bg-white">
          <div className="max-w-[760px] mx-auto px-6">
            <div className="bg-gradient-to-br from-blue to-blue-dark rounded-[24px] py-10 px-6 md:px-10 text-center text-white relative overflow-hidden">
              <div className="absolute w-[300px] h-[300px] -top-[100px] -right-[80px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15),transparent_70%)]" />
              <h2 className="font-heading text-2xl md:text-3xl font-black mb-3 relative">{t('ctaTitle')}</h2>
              <p className="text-[16px] opacity-90 max-w-[480px] mx-auto mb-6 relative">{t('ctaText')}</p>
              <a
                href="mailto:contact@preenvios.com"
                className="inline-block bg-white text-blue py-3.5 px-7 rounded-full font-extrabold text-[15px] relative transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t('ctaButton')} →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
