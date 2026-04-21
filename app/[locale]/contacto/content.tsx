'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ASUNTO_VALUES,
  contactoSchema,
  type ContactoFormInput,
  type ContactoFormOutput,
} from '@/lib/schemas/contacto'

/**
 * /contacto rebuilt con shadcn Form (Commit 3 del plan post-limpieza
 * 078dff3). Reemplaza al form eliminado por bug de scroll horizontal
 * en iOS — ver memoria feedback_no_focus_shadow_input_direct.md.
 *
 * Patrón del styling: wrapper con `focus-within:*` envolviendo
 * `<input>/<textarea>` con `bg-transparent border-0 outline-none`.
 * El ring shadcn default usa `focus-visible:ring-*` que NO se dispara
 * con tap en iOS, pero igual lo neutralizamos con clase `focus-visible:ring-0`
 * para consistencia con Comparador.tsx (patrón probado sin bug).
 *
 * Submit → POST /api/contactos → insert Supabase `contactos`.
 * Feedback inline (success/error) — sin redirect.
 */

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error-rate-limit'; retryAfterSeconds: number }
  | { kind: 'error-generic' }

export default function ContactoContent() {
  const t = useTranslations('contacto')
  const locale = useLocale()
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  const form = useForm<ContactoFormInput, unknown, ContactoFormOutput>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      nombre: '',
      email: '',
      asunto: 'general',
      mensaje: '',
      idioma: locale === 'en' ? 'en' : 'es',
      website: '',
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: ContactoFormOutput) {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.status === 200) {
        setState({ kind: 'success' })
        form.reset({
          nombre: '',
          email: '',
          asunto: 'general',
          mensaje: '',
          idioma: locale === 'en' ? 'en' : 'es',
          website: '',
        })
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

  const asuntoLabels: Record<(typeof ASUNTO_VALUES)[number], string> = {
    general: t('asuntoGeneral'),
    rate: t('asuntoRate'),
    partnership: t('asuntoPartnership'),
    other: t('asuntoOther'),
  }

  const inputWrapper =
    'bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 transition-colors focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(10,79,229,.08)]'
  const innerField =
    'w-full bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-ink text-[15px] placeholder:text-ink-3'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-[112px] pb-10 bg-gradient-to-b from-white to-g50">
          <div className="max-w-[720px] mx-auto px-6 text-center">
            <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-4 px-3.5 py-1.5 bg-blue-soft rounded-full">
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
          <div className="max-w-[640px] mx-auto px-6">
            {state.kind === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-green-soft border-[1.5px] border-green rounded-[18px] p-6 md:p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green text-white mx-auto mb-4 flex items-center justify-center text-2xl">
                  ✓
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
                  className="bg-blue hover:bg-blue-dark text-white"
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
                      name="nombre"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className="text-ink-2 text-[13px] font-semibold">
                            {t('nombre')}
                          </FormLabel>
                          <div className={inputWrapper}>
                            <FormControl>
                              <input
                                type="text"
                                autoComplete="name"
                                inputMode="text"
                                placeholder={t('nombrePlaceholder')}
                                className={innerField}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-[13px]" />
                        </FormItem>
                      )}
                    />

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

                    <FormField
                      control={form.control}
                      name="asunto"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className="text-ink-2 text-[13px] font-semibold">
                            {t('asunto')}
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="w-full bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 h-auto text-[15px] text-ink data-placeholder:text-ink-3 focus-visible:border-blue focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(10,79,229,.08)] focus-visible:ring-0"
                              >
                                <SelectValue placeholder={t('asuntoPlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ASUNTO_VALUES.map((v) => (
                                <SelectItem key={v} value={v}>
                                  {asuntoLabels[v]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mensaje"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className="text-ink-2 text-[13px] font-semibold">
                            {t('mensaje')}
                          </FormLabel>
                          <div className={inputWrapper}>
                            <FormControl>
                              <textarea
                                rows={6}
                                placeholder={t('mensajePlaceholder')}
                                className={`${innerField} resize-y min-h-[120px] leading-relaxed`}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <p className="text-ink-3 text-[12px]">{t('mensajeHint')}</p>
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
                      className="w-full bg-blue hover:bg-blue-dark text-white py-6 rounded-[14px] font-extrabold text-[15px] disabled:opacity-60"
                    >
                      {state.kind === 'submitting' ? t('submitting') : t('submit')}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Alt email */}
            <p className="text-center text-ink-3 text-[14px] mt-6">
              {t('altEmailLabel')}{' '}
              <a
                href="mailto:contact@preenvios.com"
                className="text-blue font-semibold hover:underline"
              >
                {t('altEmail')}
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
