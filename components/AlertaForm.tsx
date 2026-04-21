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
      <div className="border border-[var(--color-green)] bg-[var(--color-green-soft)]/40 rounded-[12px] px-4 py-3 text-center">
        <p className="text-[13px] font-bold text-[var(--color-green-dark)]">
          {en ? 'Check your email to confirm.' : 'Revisá tu email para confirmar.'}
        </p>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="border border-[var(--color-g200)] bg-white rounded-[12px] px-4 py-3 text-center">
        <p className="text-[13px] font-bold text-[var(--color-ink)]">
          {en ? `You're already subscribed for ${corredorNombre}.` : `Ya estás suscrito a ${corredorNombre}.`}
        </p>
      </div>
    )
  }

  return (
    <div className="border border-[var(--color-g200)] rounded-[12px] px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="shrink-0 sm:max-w-[280px] sm:pt-1">
          <h3 className="text-[14px] font-semibold text-[var(--color-ink)] leading-tight">
            {en ? "Get today's rate in your inbox" : 'Recibe la tasa de hoy en tu email'}
          </h3>
          <p className="text-[12px] text-[var(--color-g500)] leading-tight mt-0.5">
            {en
              ? `Free daily alert for ${corredorNombre}`
              : `Alerta diaria gratis para ${corredorNombre}`}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 w-full">
          {/* Label asociado con htmlFor al input — resuelve a11y hallazgo
              §1.1 del AUDIT_COMPLETO.md (input sin label). Visible arriba
              del input, legible (font-bold, text-ink). */}
          <label
            htmlFor="alerta-email-input"
            className="block text-[12px] font-bold text-[var(--color-ink-2)] mb-1.5"
          >
            {en ? 'Your email' : 'Tu correo electrónico'}
          </label>
          <div className="flex gap-2 w-full">
            <input
              id="alerta-email-input"
              type="email"
              required
              placeholder={en ? 'your@email.com' : 'tu@email.com'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-[8px] border-[1.5px] border-[var(--color-g400)] text-[14px] bg-white text-[var(--color-ink)] placeholder:text-[var(--color-g500)] focus:outline-none focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[var(--color-green)] hover:bg-[var(--color-green-dark)] text-white px-4 py-2.5 rounded-[8px] font-bold text-[14px] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              {status === 'loading'
                ? (en ? 'Sending…' : 'Enviando…')
                : (en ? 'Subscribe' : 'Suscribirme')}
            </button>
          </div>
        </form>
      </div>
      {status === 'error' && (
        <p className="text-[11px] text-[var(--color-red)] mt-1.5">
          {en ? 'Something went wrong. Try again.' : 'Algo salió mal. Intentá de nuevo.'}
        </p>
      )}
      <p className="text-[10px] text-[var(--color-g400)] mt-2">
        {en ? 'No spam. Unsubscribe anytime. CAN-SPAM compliant.' : 'Sin spam. Cancela cuando quieras. Cumple CAN-SPAM.'}
      </p>
    </div>
  )
}
