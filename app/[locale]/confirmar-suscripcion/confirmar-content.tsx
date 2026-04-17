'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'

export default function ConfirmarContent() {
  const locale = useLocale()
  const en = locale === 'en'
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }
    fetch(`/api/suscripcion-free?action=confirm&token=${token}`)
      .then(r => r.json())
      .then(d => {
        setStatus(d.status === 'confirmed' ? 'success' : 'error')
        // GA4 event on successful confirmation
        if (d.status === 'confirmed' && typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'suscripcion_free', { action: 'confirmed' })
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <main>
      <Nav />
      <section className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          {status === 'loading' && (
            <p className="text-[var(--color-g500)] text-lg">{en ? 'Confirming...' : 'Confirmando...'}</p>
          )}
          {status === 'success' && (
            <>
              <div className="text-5xl mb-4">&#9989;</div>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'Subscription confirmed!' : 'Suscripción confirmada!'}
              </h1>
              <p className="text-[var(--color-g600)] mb-6">
                {en
                  ? 'You will receive daily rate alerts in your inbox every morning.'
                  : 'Recibirás alertas diarias de tasas en tu email cada mañana.'}
              </p>
              <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-8 py-3 rounded-full font-bold hover:-translate-y-0.5 transition-transform">
                {en ? 'Compare rates now' : 'Comparar tasas ahora'} →
              </a>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'Invalid or expired link' : 'Enlace inválido o expirado'}
              </h1>
              <p className="text-[var(--color-g600)]">
                {en
                  ? 'This confirmation link is no longer valid. It may have already been used.'
                  : 'Este enlace de confirmación ya no es válido. Es posible que ya se haya usado.'}
              </p>
            </>
          )}
          {status === 'no-token' && (
            <>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'Missing confirmation token' : 'Falta el token de confirmación'}
              </h1>
              <p className="text-[var(--color-g600)]">
                {en ? 'Use the link in your email to confirm.' : 'Usa el enlace en tu email para confirmar.'}
              </p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
