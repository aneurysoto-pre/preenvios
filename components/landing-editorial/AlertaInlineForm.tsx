'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell } from 'lucide-react'
import {
  alertaSchema,
  type AlertaFormInput,
  type AlertaFormOutput,
  type CorredorId,
} from '@/lib/schemas/alerta'
import { trackEvent } from '@/lib/tracking'

/**
 * Form inline reusable en el landing editorial por pais.
 *
 * Aparece DUPLICADO en 2 secciones del landing:
 * - Seccion 0 (hero post-disclaimer) — location='hero', size='compact'
 * - Seccion 6 (CTA final) — location='cta_final', size='large'
 *
 * Ambos POSTean al mismo endpoint /api/alertas con {email, website,
 * corredor, idioma} — el endpoint ya acepta los 2 nuevos campos desde
 * Commit 3 (migration 011).
 *
 * GA4 tracking: trackEvent('suscripcion_alertas', {idioma, corredor,
 * location}) — permite segmentar cual form duplicado convierte mejor.
 *
 * iOS anti-zoom: input tiene font-size: 16px forzado (regla memoria
 * feedback_ios_input_autozoom_16px.md).
 */

type Location = 'hero' | 'cta_final'

type Props = {
  corredor: CorredorId
  idioma: 'es' | 'en'
  location: Location
  /** Titulo del form — ej. "Recibe alertas diarias" */
  titulo: string
  /** Subtitulo — ej. "Avisos cuando HNL/USD suba..." */
  subtitulo: string
  /** Placeholder del input */
  emailPlaceholder: string
  /** Texto del boton */
  ctaText: string
  /** Copy de success */
  successText?: string
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error-rate-limit'; retryAfterSeconds: number }
  | { kind: 'error-generic' }

export default function AlertaInlineForm({
  corredor,
  idioma,
  location,
  titulo,
  subtitulo,
  emailPlaceholder,
  ctaText,
  successText,
}: Props) {
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  const form = useForm<AlertaFormInput, unknown, AlertaFormOutput>({
    resolver: zodResolver(alertaSchema),
    defaultValues: {
      email: '',
      website: '',
      corredor,
      idioma,
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: AlertaFormOutput) {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.status === 200) {
        trackEvent('suscripcion_alertas', { idioma, corredor, location })
        setState({ kind: 'success' })
        form.reset({ email: '', website: '', corredor, idioma })
        return
      }
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}))
        const retryAfterSeconds = Number(body?.retryAfterSeconds ?? 3600)
        setState({ kind: 'error-rate-limit', retryAfterSeconds })
        return
      }
      setState({ kind: 'error-generic' })
    } catch {
      setState({ kind: 'error-generic' })
    }
  }

  // Styles diferenciados por location — hero es compact, cta_final es
  // grande con pill buttons (matchea peso visual del boton "Ver
  // comparador" del CTA seccion 6).
  const isLarge = location === 'cta_final'

  const cardClass = isLarge
    ? 'bg-gradient-to-br from-blue-soft to-white rounded-2xl p-5 border border-g200'
    : 'bg-gradient-to-br from-blue-soft to-white rounded-2xl p-4 border border-g200'

  const inputClass = isLarge
    ? 'flex-1 min-w-0 bg-white border border-g200 rounded-full px-5 py-4 font-medium text-ink outline-none focus:border-blue transition-colors'
    : 'flex-1 min-w-0 bg-white border border-g200 rounded-lg px-3 py-2 font-medium text-ink outline-none focus:border-blue transition-colors'

  const buttonClass = isLarge
    ? 'text-white px-8 py-4 rounded-full font-extrabold text-base shrink-0 whitespace-nowrap shadow-lg hover:-translate-y-0.5 transition-transform disabled:opacity-60 bg-blue'
    : 'text-white px-4 py-2 rounded-lg font-extrabold text-sm shrink-0 whitespace-nowrap hover:-translate-y-0.5 transition-transform disabled:opacity-60 bg-blue'

  const formLayoutClass = isLarge ? 'flex flex-col sm:flex-row gap-2' : 'flex gap-2'

  // Success state — compacto, replace del form
  if (state.kind === 'success') {
    return (
      <div
        className={cardClass}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-green">
            <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-extrabold text-sm leading-tight text-ink">
              {successText ?? '¡Suscrito!'}
            </h3>
            <p className="text-[11px] text-g600 mt-0.5">
              Te llegara la primera tasa manana.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue">
          <Bell className="w-[18px] h-[18px] text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-extrabold text-sm leading-tight text-ink">
            {titulo}
          </h3>
          <p className="text-[11px] text-g600 mt-0.5">{subtitulo}</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={formLayoutClass}>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={emailPlaceholder}
          className={inputClass}
          style={{ fontSize: '16px' }}
          aria-invalid={form.formState.errors.email ? 'true' : 'false'}
          {...form.register('email')}
        />

        {/* Honeypot — oculto a usuarios, bots lo rellenan */}
        <div
          aria-hidden="true"
          className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register('website')}
          />
        </div>

        <button
          type="submit"
          disabled={state.kind === 'submitting'}
          className={buttonClass}
        >
          {state.kind === 'submitting' ? '...' : ctaText}
        </button>
      </form>

      {form.formState.errors.email && (
        <p className="text-[11px] text-red mt-1.5" role="alert">
          {form.formState.errors.email.message}
        </p>
      )}

      {state.kind === 'error-rate-limit' && (
        <p className="text-[11px] text-amber-700 mt-1.5" role="alert">
          Demasiados intentos. Intenta de nuevo en {Math.max(1, Math.ceil(state.retryAfterSeconds / 60))} min.
        </p>
      )}

      {state.kind === 'error-generic' && (
        <p className="text-[11px] text-red mt-1.5" role="alert">
          Error al suscribir. Intenta de nuevo.
        </p>
      )}
    </div>
  )
}
