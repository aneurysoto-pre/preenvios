'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactoContent() {
  const t = useTranslations('contacto')
  const locale = useLocale()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState('general')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, asunto, mensaje, idioma: locale }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || t('errorGeneric'))
        setStatus('error')
        return
      }
      setStatus('success')
      if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag === 'function') {
        ;(window as unknown as { gtag: (...a: unknown[]) => void }).gtag('event', 'contacto_enviado', { asunto })
      }
    } catch {
      setErrorMsg(t('errorGeneric'))
      setStatus('error')
    }
  }

  function reset() {
    setNombre(''); setEmail(''); setAsunto('general'); setMensaje('')
    setStatus('idle'); setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-[112px] pb-10 bg-gradient-to-b from-white to-g50">
          <div className="max-w-[820px] mx-auto px-6 text-center">
            <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-4 px-3.5 py-1.5 bg-blue-soft rounded-full">{t('heroTag')}</span>
            <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.1] mb-3 text-ink">{t('heroTitle')}</h1>
            <p className="text-ink-2 text-[16px] max-w-[560px] mx-auto">{t('heroLede')}</p>
          </div>
        </section>

        {/* Body: form + sidebar */}
        <section className="py-10">
          <div className="max-w-[1040px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">

              {/* Form */}
              <div className="bg-white border border-g200 rounded-[22px] p-6 md:p-8 shadow-[0_4px_14px_rgba(15,23,42,.04)]">
                {status === 'success' ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-green-soft text-green-dark flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h2 className="font-heading text-2xl font-black mb-2">{t('successTitle')}</h2>
                    <p className="text-ink-2 text-[15px] mb-6">{t('successText')}</p>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-block bg-g50 border-[1.5px] border-g200 hover:bg-blue hover:text-white hover:border-blue text-ink py-2.5 px-5 rounded-full font-bold text-sm transition-colors"
                    >
                      {t('successAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-[13px] font-bold text-g600 mb-1.5">{t('formName')}</label>
                      <input
                        id="nombre"
                        type="text"
                        required
                        maxLength={120}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        className="w-full bg-g50 border-[1.5px] border-g200 rounded-[12px] px-4 py-3 text-[15px] outline-none focus:border-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(10,79,229,.08)] transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[13px] font-bold text-g600 mb-1.5">{t('formEmail')}</label>
                      <input
                        id="email"
                        type="email"
                        required
                        maxLength={160}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-g50 border-[1.5px] border-g200 rounded-[12px] px-4 py-3 text-[15px] outline-none focus:border-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(10,79,229,.08)] transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="asunto" className="block text-[13px] font-bold text-g600 mb-1.5">{t('formSubject')}</label>
                      <select
                        id="asunto"
                        required
                        value={asunto}
                        onChange={e => setAsunto(e.target.value)}
                        className="w-full bg-g50 border-[1.5px] border-g200 rounded-[12px] px-4 py-3 text-[15px] outline-none focus:border-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(10,79,229,.08)] transition-all appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22><path d=%22M3 4.5l3 3 3-3%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22/></svg>')] bg-no-repeat bg-[right_14px_center] pr-10"
                      >
                        <option value="general">{t('subjectGeneral')}</option>
                        <option value="rate">{t('subjectRate')}</option>
                        <option value="partnership">{t('subjectPartnership')}</option>
                        <option value="other">{t('subjectOther')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensaje" className="block text-[13px] font-bold text-g600 mb-1.5">{t('formMessage')}</label>
                      <textarea
                        id="mensaje"
                        required
                        rows={6}
                        minLength={10}
                        maxLength={4000}
                        value={mensaje}
                        onChange={e => setMensaje(e.target.value)}
                        className="w-full bg-g50 border-[1.5px] border-g200 rounded-[12px] px-4 py-3 text-[15px] outline-none focus:border-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(10,79,229,.08)] transition-all resize-y"
                      />
                    </div>

                    {status === 'error' && errorMsg && (
                      <p className="text-[13px] text-red bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3.5 py-2.5">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="bg-gradient-to-br from-blue to-blue-dark text-white py-3.5 px-6 rounded-[12px] font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-[0_10px_25px_-8px_rgba(10,79,229,.55)] hover:shadow-[0_18px_36px_-10px_rgba(10,79,229,.6)] disabled:opacity-60 disabled:translate-y-0"
                    >
                      {status === 'sending' ? t('formSending') : t('formSubmit')}
                      {status !== 'sending' && <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar */}
              <aside className="flex flex-col gap-4">
                <div className="bg-g50 border border-g200 rounded-[18px] p-6">
                  <h3 className="font-heading text-lg font-extrabold mb-4">{t('sidebarTitle')}</h3>
                  <div className="mb-4">
                    <p className="text-[12px] font-bold text-g500 uppercase tracking-wider mb-1">{t('sidebarGeneral')}</p>
                    <a href="mailto:contact@preenvios.com" className="text-blue font-bold text-[15px] hover:underline break-all">contact@preenvios.com</a>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-g500 uppercase tracking-wider mb-1">{t('sidebarPartnerships')}</p>
                    <a href="mailto:partnerships@preenvios.com" className="text-blue font-bold text-[15px] hover:underline break-all">partnerships@preenvios.com</a>
                  </div>
                </div>

                <div className="bg-green-soft border border-green-soft rounded-[18px] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    <h3 className="font-heading text-base font-extrabold text-green-dark">{t('sidebarResponseTitle')}</h3>
                  </div>
                  <p className="text-[14px] text-ink-2 leading-relaxed">{t('sidebarResponseText')}</p>
                </div>

                <div className="bg-white border border-g200 rounded-[18px] p-5">
                  <h3 className="font-heading text-base font-extrabold mb-2">{t('sidebarFaqTitle')}</h3>
                  <p className="text-[14px] text-ink-2 leading-relaxed">
                    {t('sidebarFaqText')}{' '}
                    <a href={`/${locale}/#faq`} className="text-blue font-bold hover:underline">{t('sidebarFaqLink')} →</a>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="py-10" />
      </main>

      <Footer />
    </div>
  )
}
