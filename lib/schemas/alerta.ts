import { z } from 'zod'

/**
 * Schema de validacion del form /alertas.
 *
 * Shared entre cliente (react-hook-form + zodResolver) y servidor
 * (/api/alertas parsea con el mismo schema). La tabla supabase
 * `alertas_email` acepta email + opcionalmente corredor/idioma para
 * fidelizacion por pais (migracion 011, 2026-04-24).
 *
 * `website` es honeypot anti-bot: campo invisible para humanos, los
 * bots lo rellenan. Si llega con valor, el endpoint rechaza 200 OK
 * silencioso (no 4xx, para no revelar el mecanismo).
 *
 * `corredor` y `idioma` son opcionales — el form legacy de /alertas
 * (sin contexto pais) no los envia, se guardan como NULL. El landing
 * editorial por pais (Honduras y demas MVP) si los envia: `corredor`
 * desde PAISES_MVP.corredorId, `idioma` desde useLocale().
 */

/**
 * Lista de corredorIds validos. Debe mantenerse en sync con
 * PAISES_MVP de lib/paises.ts. Hardcodeado aqui porque z.enum()
 * requiere un tuple de string literals para type narrowing —
 * derivarlo dinamicamente de PAISES_MVP pierde el tipo exacto.
 *
 * Si se agrega un corredor nuevo a PAISES_MVP, agregarlo aqui tambien.
 */
const CORREDOR_IDS = [
  'honduras',
  'dominican_republic',
  'guatemala',
  'el_salvador',
  'colombia',
  'mexico',
] as const

export const alertaSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(200, 'Email demasiado largo'),
  website: z.string().max(0, 'invalid').optional().default(''),
  corredor: z.enum(CORREDOR_IDS).optional(),
  idioma: z.enum(['es', 'en']).optional(),
})

// z.input = tipo que acepta el form en `defaultValues` (website opcional).
// z.output = tipo post-parse (website siempre string por el .default('')).
export type AlertaFormInput = z.input<typeof alertaSchema>
export type AlertaFormOutput = z.output<typeof alertaSchema>
