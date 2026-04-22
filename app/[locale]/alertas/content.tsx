'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Check } from 'lucide-react'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  alertaSchema,
  type AlertaFormInput,
  type AlertaFormOutput,
} from '@/lib/schemas/alerta'
import { trackEvent } from '@/lib/tracking'
import { useLocale } from 'next-intl'

/**
 * /alertas rebuilt con shadcn Form — commit 2 del rebuild post-cleanup
 * de 5b8a2ed. Reemplaza AlertaForm eliminado por bug de scroll
 * horizontal en iOS Safari.
 *
 * Patrón IDÉNTICO a /contacto (commit d98d81f):
 * - Wrapper con focus-within:* envolviendo inputs con
 *   `bg-transparent border-0 outline-none focus-visible:ring-0`.
 * - font-size MÍNIMO `text-[16px]` en todos los inputs — regla
 *   obligatoria iOS Safari (ver feedback_ios_input_autozoom_16px.md).
 * - Honeypot `website` oculto.
 * - Feedback inline success/error sin redirect.
 *
 * Schema minimalista: solo email (decisión founder 2026-04-22).
 * Sin país, sin frecuencia, sin umbral. Mes 1 el founder revisa
 * la tabla alertas_email en Supabase manualmente.
 */

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error-rate-limit'; retryAfterSeconds: number }
  | { kind: 'error-generic' }

export default function AlertasContent() {
  const t = useTranslations('alertas')
  const locale = useLocale()
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  const form = useForm<AlertaFormInput, unknown, AlertaFormOutput>({
    resolver: zodResolver(alertaSchema),
    defaultValues: {
      email: '',
      website: '',
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
        trackEvent('suscripcion_alertas', { idioma: locale === 'en' ? 'en' : 'es' })
        setState({ kind: 'success' })
        form.reset({ email: '', website: '' })
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

  // font-size 16px obligatorio en el input — iOS Safari auto-zoom bug
  // si es < 16px (ver memoria feedback_ios_input_autozoom_16px.md).
  const inputWrapper =
    'bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 transition-colors focus-within:border-green focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,217,87,.12)]'
  const innerField =
    'w-full bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-ink text-[16px] placeholder:text-ink-3'

  const benefits = [t('benefit1'), t('benefit2'), t('benefit3')]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-[112px] pb-10 bg-gradient-to-b from-white to-[#F0FDF4]">
          <div className="max-w-[720px] mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-green-dark uppercase tracking-[2px] mb-4 px-3.5 py-1.5 bg-green-soft rounded-full">
              <Bell className="size-3.5" aria-hidden="true" />
              {t('heroTag')}
            </span>
            <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-black leading-[1.15] mb-4 text-ink">
              {t('heroTitle')}
            </h1>
            <p className="text-ink-2 text-[16px] max-w-[560px] mx-auto">{t('heroLede')}</p>
          </div>
        </section>

        {/* Form / Success */}
        <section className="py-10 bg-white">
          <div className="max-w-[520px] mx-auto px-6">
            {state.kind === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-green-soft border-[1.5px] border-green rounded-[18px] p-6 md:p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green text-white mx-auto mb-4 flex items-center justify-center">
                  <Check className="size-6" aria-hidden="true" />
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-black mb-2 text-ink">
                  {t('successTitle')}
                </h2>
                <p className="text-ink-2 text-[15px] leading-relaxed mb-5">
                  {t('successText')}
                </p>
                <Button
                  type="button"
                  onClick={() => setState({ kind: 'idle' })}
                  className="bg-green hover:bg-green-dark text-white"
                >
                  {t('successNew')}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  className="bg-white border border-g200 rounded-[20px] p-5 md:p-7 shadow-sm"
                >
                  <h2 className="font-heading text-lg md:text-xl font-extrabold mb-5 text-ink">
                    {t('formTitle')}
                  </h2>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className="text-ink-2 text-[13px] font-semibold">
                            {t('email')}
                          </FormLabel>
                          <div className={inputWrapper}>
                            <FormControl>
                              <input
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder={t('emailPlaceholder')}
                                className={innerField}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-[13px]" />
                        </FormItem>
                      )}
                    />

                    {/* Honeypot — oculto a usuarios, rellenado por bots */}
                    <div
                      aria-hidden="true"
                      className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
                    >
                      <label>
                        Website
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          {...form.register('website')}
                        />
                      </label>
                    </div>

                    {state.kind === 'error-rate-limit' && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[12px] px-4 py-3 text-[14px] text-[#92400E]"
                      >
                        {t('errorRateLimit', {
                          minutes: Math.max(1, Math.ceil(state.retryAfterSeconds / 60)),
                        })}
                      </div>
                    )}

                    {state.kind === 'error-generic' && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="bg-[#FEE2E2] border border-[#EF4444] rounded-[12px] px-4 py-3 text-[14px] text-[#991B1B]"
                      >
                        {t('errorGeneric')}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={state.kind === 'submitting'}
                      className="w-full bg-green hover:bg-green-dark text-white py-6 rounded-[14px] font-extrabold text-[15px] disabled:opacity-60"
                    >
                      {state.kind === 'submitting' ? t('submitting') : t('submit')}
                    </Button>

                    <p className="text-ink-3 text-[12px] text-center leading-relaxed">
                      {t('privacyNote')}
                    </p>
                  </div>
                </form>
              </Form>
            )}

            {/* Beneficios */}
            <ul className="mt-8 space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-ink-2 text-[14px]">
                  <span className="flex-shrink-0 size-5 rounded-full bg-green-soft text-green-dark flex items-center justify-center mt-0.5">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
