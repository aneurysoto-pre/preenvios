import { z } from 'zod'

/**
 * Schema de validacion del form /alertas.
 *
 * Shared entre cliente (react-hook-form + zodResolver) y servidor
 * (/api/alertas parsea con el mismo schema). La tabla supabase
 * `alertas_email` acepta solo email — sin pais, sin idioma, sin
 * frecuencia. Schema minimalista decidido por el founder 2026-04-22.
 *
 * `website` es honeypot anti-bot: campo invisible para humanos, los
 * bots lo rellenan. Si llega con valor, el endpoint rechaza 200 OK
 * silencioso (no 4xx, para no revelar el mecanismo).
 */

export const alertaSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(200, 'Email demasiado largo'),
  website: z.string().max(0, 'invalid').optional().default(''),
})

// z.input = tipo que acepta el form en `defaultValues` (website opcional).
// z.output = tipo post-parse (website siempre string por el .default('')).
export type AlertaFormInput = z.input<typeof alertaSchema>
export type AlertaFormOutput = z.output<typeof alertaSchema>
