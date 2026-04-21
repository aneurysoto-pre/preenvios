import { z } from 'zod'

/**
 * Schema de validacion del form /contacto.
 *
 * Shared entre cliente (react-hook-form + zodResolver) y servidor
 * (/api/contactos parsea con el mismo schema). La tabla supabase
 * `contactos` espera los mismos campos — los CHECK constraints en
 * migrations/004_contactos.sql coinciden con los enums de abajo.
 *
 * `website` es honeypot anti-bot: campo invisible para humanos, los
 * bots lo rellenan. Si llega con valor, el endpoint rechaza 200 OK
 * silencioso (no 4xx, para no revelar el mecanismo).
 */

export const ASUNTO_VALUES = ['general', 'rate', 'partnership', 'other'] as const
export const IDIOMA_VALUES = ['es', 'en'] as const

export const contactoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Mínimo 2 caracteres')
    .max(80, 'Máximo 80 caracteres'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(200, 'Email demasiado largo'),
  asunto: z.enum(ASUNTO_VALUES),
  mensaje: z
    .string()
    .trim()
    .min(10, 'Mínimo 10 caracteres')
    .max(2000, 'Máximo 2000 caracteres'),
  idioma: z.enum(IDIOMA_VALUES),
  website: z.string().max(0, 'invalid').optional().default(''),
})

export type ContactoInput = z.infer<typeof contactoSchema>
