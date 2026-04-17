'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'

export default function BajaContent() {
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
    fetch(`/api/suscripcion-free?action=unsubscribe&token=${token}`)
      .then(r => r.json())
      .then(d => setStatus(d.status === 'unsubscribed' ? 'success' : 'error'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <main>
      <Nav />
      <section className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          {status === 'loading' && (
            <p className="text-[var(--color-g500)] text-lg">{en ? 'Processing...' : 'Procesando...'}</p>
          )}
          {status === 'success' && (
            <>
              <div className="text-5xl mb-4">&#10003;</div>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'You have been unsubscribed' : 'Te has dado de baja'}
              </h1>
              <p className="text-[var(--color-g600)] mb-6">
                {en
                  ? 'You will no longer receive rate alerts from PreEnvios. You can resubscribe anytime.'
                  : 'Ya no recibirás alertas de tasas de PreEnvios. Puedes volver a suscribirte cuando quieras.'}
              </p>
              <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-8 py-3 rounded-full font-bold hover:-translate-y-0.5 transition-transform">
                {en ? 'Back to PreEnvios' : 'Volver a PreEnvios'}
              </a>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'Invalid or expired link' : 'Enlace inválido o expirado'}
              </h1>
              <p className="text-[var(--color-g600)] mb-6">
                {en
                  ? 'This unsubscribe link is no longer valid. You may have already unsubscribed.'
                  : 'Este enlace de baja ya no es válido. Es posible que ya te hayas dado de baja.'}
              </p>
            </>
          )}
          {status === 'no-token' && (
            <>
              <h1 className="font-heading text-2xl font-black mb-3">
                {en ? 'Missing unsubscribe token' : 'Falta el token de baja'}
              </h1>
              <p className="text-[var(--color-g600)]">
                {en ? 'Use the link in your email to unsubscribe.' : 'Usa el enlace en tu email para darte de baja.'}
              </p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
