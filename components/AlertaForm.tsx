'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'

type Props = {
  corredorId: string
  corredorNombre: string
}

export default function AlertaForm({ corredorId, corredorNombre }: Props) {
  const locale = useLocale()
  const en = locale === 'en'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'already' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/suscripcion-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, corredor_favorito: corredorId, idioma: locale }),
      })
      const data = await res.json()

      if (data.status === 'already_subscribed') {
        setStatus('already')
      } else if (data.status === 'confirmation_sent' || data.status === 'confirmation_resent') {
        setStatus('sent')
        // GA4 event
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'suscripcion_free', {
            corredor: corredorId,
            idioma: locale,
          })
        }
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-[var(--color-green-soft)] border border-[var(--color-green)] rounded-[18px] p-6 text-center">
        <p className="font-bold text-[var(--color-green-dark)] text-lg">
          {en ? 'Check your email!' : 'Revisa tu email!'}
        </p>
        <p className="text-sm text-[var(--color-g600)] mt-1">
          {en
            ? 'Click the confirmation link to activate your daily alerts.'
            : 'Haz clic en el enlace de confirmación para activar tus alertas diarias.'}
        </p>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="bg-[var(--color-blue-soft)] border border-[var(--color-blue)] rounded-[18px] p-6 text-center">
        <p className="font-bold text-[var(--color-blue)] text-lg">
          {en ? 'You are already subscribed' : 'Ya estás suscrito'}
        </p>
        <p className="text-sm text-[var(--color-g600)] mt-1">
          {en
            ? `You'll receive daily rate alerts for ${corredorNombre}.`
            : `Recibirás alertas diarias de tasas para ${corredorNombre}.`}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-[var(--color-blue-soft)] to-white border border-[var(--color-g200)] rounded-[18px] p-6">
      <h3 className="font-heading font-extrabold text-lg mb-1">
        {en ? 'Get today\'s rate in your inbox' : 'Recibe la tasa de hoy en tu email'}
      </h3>
      <p className="text-sm text-[var(--color-g600)] mb-4">
        {en
          ? `Free daily alert for ${corredorNombre} — best rate + affiliate link.`
          : `Alerta diaria gratis para ${corredorNombre} — mejor tasa + enlace directo.`}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
        <input
          type="email"
          required
          placeholder={en ? 'your@email.com' : 'tu@email.com'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-g300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[var(--color-blue)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading'
            ? (en ? 'Sending...' : 'Enviando...')
            : (en ? 'Subscribe free' : 'Suscribirme gratis')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-[var(--color-red)] mt-2">
          {en ? 'Something went wrong. Try again.' : 'Algo salió mal. Intenta de nuevo.'}
        </p>
      )}
      <p className="text-[11px] text-[var(--color-g400)] mt-3">
        {en ? 'No spam. Unsubscribe anytime. CAN-SPAM compliant.' : 'Sin spam. Cancela cuando quieras. Cumple CAN-SPAM.'}
      </p>
    </div>
  )
}
