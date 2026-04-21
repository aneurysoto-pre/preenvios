'use client'

/**
 * AlertaForm — formulario de suscripción a alertas diarias gratis.
 *
 * Consumers actuales:
 * - /alertas (landing dedicada, corredorId="honduras" default)
 * - /[locale]/[pais]/pais-content.tsx (inline en cada página de corredor)
 * - /[locale]/tasa/[pair]/tasa-content.tsx (inline en página histórica)
 * - /[locale] landing comparador resultados (inline bajo el ranking)
 *
 * Layout mobile-first:
 * - <640px: stack vertical completo. Header+subtitle arriba, label+input
 *   apilados, botón submit full-width abajo. Cada elemento cómodo de
 *   tap para persona Carlos/María (+35 años, dedos grandes).
 * - ≥640px: split layout. Header+subtitle izquierda, form (label+input+
 *   button side-by-side) derecha.
 *
 * A11y:
 * - <label htmlFor> asociado al input (resuelve hallazgo §1.1 del audit)
 * - type="email" + required para validación browser native
 * - Estados idle/loading/sent/already/error con mensajes claros
 *
 * Tracking:
 * - Evento GA4 `suscripcion_free` al submit exitoso (via trackEvent
 *   helper de @/lib/tracking). Params: corredor + idioma. Preservado
 *   del inventario del audit §13.2.
 *
 * Strings:
 * - Todos los textos via useTranslations('alertaForm') — namespace en
 *   messages/{es,en}.json alertaForm.* (migración completada Fase 1.6).
 * - Variables en mensajes: {pais} interpola corredorNombre prop.
 */

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/tracking'

type Props = {
  corredorId: string
  corredorNombre: string
}

export default function AlertaForm({ corredorId, corredorNombre }: Props) {
  const t = useTranslations('alertaForm')
  const locale = useLocale()
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
        trackEvent('suscripcion_free', {
          corredor: corredorId,
          idioma: locale,
        })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  // Estado sent: card verde con confirmación (reemplaza el form hasta
  // que el usuario navegue a otra pagina).
  if (status === 'sent') {
    return (
      <div
        className="border border-[var(--color-green)] bg-[var(--color-green-soft)]/40 rounded-[12px] px-4 py-3 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-[13px] font-bold text-[var(--color-green-dark)]">
          {t('sentConfirm')}
        </p>
      </div>
    )
  }

  // Estado already: indica que ya está suscrito — evita re-trigger de
  // email de confirmación (dedup server-side en /api/suscripcion-free).
  if (status === 'already') {
    return (
      <div
        className="border border-[var(--color-g200)] bg-white rounded-[12px] px-4 py-3 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-[13px] font-bold text-[var(--color-ink)]">
          {t('alreadySubscribed', { pais: corredorNombre })}
        </p>
      </div>
    )
  }

  return (
    <div className="border border-[var(--color-g200)] rounded-[12px] px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="shrink-0 sm:max-w-[280px] sm:pt-1">
          <h3 className="text-[14px] font-semibold text-[var(--color-ink)] leading-tight">
            {t('headerTitle')}
          </h3>
          <p className="text-[12px] text-[var(--color-g500)] leading-tight mt-0.5">
            {t('headerSubtitle', { pais: corredorNombre })}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 w-full">
          {/* Label asociado con htmlFor al input — resuelve a11y hallazgo
              §1.1 del AUDIT_COMPLETO.md (input sin label). */}
          <label
            htmlFor="alerta-email-input"
            className="block text-[12px] font-bold text-[var(--color-ink-2)] mb-1.5"
          >
            {t('emailLabel')}
          </label>
          {/* Mobile-first: stack vertical (input + button cada uno full-width,
              tap area amplia). Desktop (sm+): side-by-side. Cumple requisito
              del mandato "botón submit ancho completo" en mobile. */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              id="alerta-email-input"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-[8px] border-[1.5px] border-[var(--color-g400)] text-[14px] bg-white text-[var(--color-ink)] placeholder:text-[var(--color-g500)] focus:outline-none focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[var(--color-green)] hover:bg-[var(--color-green-dark)] text-white px-4 py-2.5 rounded-[8px] font-bold text-[14px] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 w-full sm:w-auto"
            >
              {status === 'loading' ? t('submitLoading') : t('submit')}
            </button>
          </div>
        </form>
      </div>
      {status === 'error' && (
        <p
          className="text-[11px] text-[var(--color-red)] mt-1.5"
          role="alert"
          aria-live="assertive"
        >
          {t('error')}
        </p>
      )}
      <p className="text-[10px] text-[var(--color-g400)] mt-2">{t('disclaimer')}</p>
    </div>
  )
}
