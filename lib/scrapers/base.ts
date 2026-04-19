/**
 * Base scraper utilities — rate limiting, User-Agent, error handling
 *
 * Cada scraper usa estas utilidades para:
 * - Identificarse como PreenviosBot/1.0
 * - Respetar rate limiting (mínimo 2s entre requests al mismo operador)
 * - Reportar fallos al sistema de fallback
 */

import { createClient } from '@supabase/supabase-js'

const USER_AGENT = 'PreenviosBot/1.0 contact@preenvios.com'
const MIN_DELAY_MS = 2000

// Supabase con service role para escritura
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// IMPORTANTE: los campos afiliado y link son metadata de negocio (configurada
// via admin panel / SQL migrations), NO datos scraped. El scraper debe pasarlos
// con los valores actuales del operador — hoy todos los operadores MVP tienen
// afiliado=true. Si se agrega un operador nuevo, asegurar que su scraper tenga
// los valores correctos aqui para que el upsert no los sobreescriba con false/''.
// Ver TROUBLESHOOTING/24 y 26 para el patron.
export type ScrapedPrice = {
  operador: string
  corredor: string
  metodo_entrega: string
  tasa: number
  fee: number
  velocidad: string
  nombre_operador: string
  rating: number
  reviews: number
  afiliado: boolean
  link: string
  confiabilidad: number
  metodos_disponibles: number
}

// Rate limiting: tracks last request time per operator
const lastRequestTime: Record<string, number> = {}

export async function rateLimitDelay(operador: string): Promise<void> {
  const now = Date.now()
  const last = lastRequestTime[operador] || 0
  const elapsed = now - last
  if (elapsed < MIN_DELAY_MS) {
    await new Promise((r) => setTimeout(r, MIN_DELAY_MS - elapsed))
  }
  lastRequestTime[operador] = Date.now()
}

export function getHeaders(): Record<string, string> {
  return {
    'User-Agent': USER_AGENT,
    Accept: 'application/json, text/html',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
  }
}

/**
 * Guarda precios scraped en Supabase via upsert
 */
export async function savePrices(prices: ScrapedPrice[]): Promise<{
  saved: number
  errors: string[]
}> {
  const errors: string[] = []
  let saved = 0

  for (const price of prices) {
    const { error } = await supabaseAdmin
      .from('precios')
      .upsert(
        {
          ...price,
          actualizado_en: new Date().toISOString(),
          activo: true,
        },
        { onConflict: 'operador,corredor,metodo_entrega' }
      )

    if (error) {
      errors.push(`${price.operador}/${price.corredor}: ${error.message}`)
    } else {
      saved++
    }
  }

  return { saved, errors }
}

/**
 * Marca precios como desactualizados si un scraper falla 3+ veces
 */
const failCounts: Record<string, number> = {}

export async function reportScraperFailure(
  operador: string,
  error: string
): Promise<{ markedStale: boolean }> {
  const key = operador
  failCounts[key] = (failCounts[key] || 0) + 1

  if (failCounts[key] >= 3) {
    // Mark all prices for this operator as stale by setting actualizado_en to old date
    await supabaseAdmin
      .from('precios')
      .update({ actualizado_en: '2000-01-01T00:00:00Z' })
      .eq('operador', operador)

    failCounts[key] = 0
    return { markedStale: true }
  }

  return { markedStale: false }
}

export function resetFailCount(operador: string): void {
  failCounts[operador] = 0
}

export { supabaseAdmin }
