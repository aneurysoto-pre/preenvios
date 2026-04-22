/**
 * Agente 1 — Validador de ingress en scrapers
 *
 * Fase 7 defense-in-depth, capa arquitectónica (write-boundary validation).
 * Se ejecuta DENTRO de savePrices() ANTES de upsert a tabla `precios`.
 * Si una fila no pasa validación:
 *   - NO se guarda en `precios`
 *   - Se registra cada issue en tabla `scraper_anomalies`
 *   - Se captura evento en Sentry con tag `scraper_anomaly`
 *   - Si hay 3+ anomalías consecutivas del mismo par (operador, corredor)
 *     dentro de la última hora → se llama reportScraperFailure() existente
 *     para marcar todos los precios del operador como stale
 *
 * Decisión arquitectural: el "3 consecutivas" se implementa consultando
 * scraper_anomalies (robusto en Vercel serverless) en lugar del contador
 * in-memory que usa reportScraperFailure. Ver
 * TROUBLESHOOTING/27_contador_in_memory_serverless.md.
 *
 * Referencias:
 * - CONTEXTO_FINAL.md § Fase 7
 * - CHECKLIST_PRE_LANZAMIENTO.md § 7.5
 * - LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md
 */

import * as Sentry from '@sentry/nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ScrapedPrice } from './base'

// ───────────────────────────────────────────────────────────
// Constantes — whitelists y bounds
// ───────────────────────────────────────────────────────────

/** Operadores MVP aprobados (7). Cualquier otro valor se rechaza. */
const OPERADORES_WHITELIST = [
  'remitly',
  'wise',
  'xoom',
  'ria',
  'worldremit',
  'westernunion',
  'moneygram',
] as const

/**
 * Corredores MVP (6 países). Whitelist estricta — decisión del founder
 * 2026-04-22. Si se agrega un corredor nuevo, actualizar este array
 * + CORREDOR_TO_CODIGO_PAIS + TASA_BASE_FALLBACK. Ver guía de
 * incorporación en LOGICA_DE_NEGOCIO/11_nuevos_corredores.md paso 3.
 */
const CORREDORES_WHITELIST = [
  'honduras',
  'dominican_republic',
  'guatemala',
  'el_salvador',
  'colombia',
  'mexico',
] as const

/** Métodos de entrega canónicos (decisión 2026-04-22, ver migración 001). */
const METODOS_ENTREGA_WHITELIST = [
  'bank',
  'cash_pickup',
  'home_delivery',
  'mobile_wallet',
] as const

/** Velocidades canónicas (strings exactos, con tildes). */
const VELOCIDADES_WHITELIST = ['Segundos', 'Minutos', 'Horas', 'Días'] as const

const FEE_MIN_USD = 0
const FEE_MAX_USD = 50

/** Mapeo corredor (slug DB) → codigo_pais (ISO alpha-2 lowercase). */
const CORREDOR_TO_CODIGO_PAIS: Record<string, string> = {
  honduras: 'hn',
  dominican_republic: 'do',
  guatemala: 'gt',
  el_salvador: 'sv',
  colombia: 'co',
  mexico: 'mx',
}

/**
 * Tasas base + tolerancia por codigo_pais. Fallback si la tabla
 * tasas_bancos_centrales no tiene registro o el cache no se cargó.
 *
 * Tolerancia ±10% para monedas fluctuantes, 0 para El Salvador
 * (dolarizado desde 2001, USD → USD = exacto 1.00; SVC está
 * desmonetizado desde 2001 y NO se usa).
 *
 * Valores revisados 2026-04-22. Si una moneda cambia >10% en el
 * mundo real y el banco central no publica el nuevo valor a tiempo,
 * los scrapers empezarán a rechazar filas legítimas — actualizar
 * este array cuando suceda.
 */
const TASA_BASE_FALLBACK: Record<string, { base: number; tolerancia: number }> = {
  hn: { base: 24.85, tolerancia: 0.10 },
  do: { base: 60.50, tolerancia: 0.10 },
  gt: { base: 7.75, tolerancia: 0.10 },
  sv: { base: 1.00, tolerancia: 0 },
  co: { base: 4150.0, tolerancia: 0.10 },
  mx: { base: 17.15, tolerancia: 0.10 },
}

/** Ventana temporal para "anomalías consecutivas" (serverless-safe). */
const CONSECUTIVE_WINDOW_MINUTES = 60

/** Umbral de anomalías consecutivas para marcar scraper como stale. */
const CONSECUTIVE_THRESHOLD = 3

// ───────────────────────────────────────────────────────────
// Types públicos
// ───────────────────────────────────────────────────────────

/** Cache en memoria — se carga 1x al inicio del batch de savePrices(). */
export type BancoCentralCache = Map<string, number>

export type AnomalyDetail = {
  campo_invalido: string
  valor_recibido: unknown
  valor_esperado_min?: number
  valor_esperado_max?: number
  valor_esperado_enum?: string[]
  mensaje: string
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; issues: AnomalyDetail[] }

// ───────────────────────────────────────────────────────────
// API pública
// ───────────────────────────────────────────────────────────

/**
 * Carga las tasas del banco central de los 6 corredores MVP en memoria.
 * 1 query a Supabase al inicio del batch de savePrices() — todas las
 * validaciones subsecuentes usan este cache (O(1) lookup).
 *
 * Si la query falla (red, RLS, tabla vacía) retorna cache vacío y el
 * validador cae al fallback hardcoded TASA_BASE_FALLBACK. Fail-open
 * controlado: los scrapers siguen funcionando con la última tasa
 * conocida aunque tasas_bancos_centrales no responda.
 */
export async function loadBancoCentralCache(
  supabase: SupabaseClient,
): Promise<BancoCentralCache> {
  const cache: BancoCentralCache = new Map()
  try {
    const { data, error } = await supabase
      .from('tasas_bancos_centrales')
      .select('codigo_pais, tasa')
    if (error) {
      console.error('[validator] error cargando tasas_bancos_centrales:', error.message)
      return cache
    }
    for (const row of data || []) {
      if (
        row.codigo_pais &&
        typeof row.tasa === 'number' &&
        row.tasa > 0
      ) {
        cache.set(row.codigo_pais, row.tasa)
      }
    }
  } catch (err) {
    console.error('[validator] exception cargando tasas_bancos_centrales:', err)
  }
  return cache
}

/**
 * Valida una fila ScrapedPrice contra las reglas arquitectónicas.
 * Pure function — sin I/O. Retorna todas las issues encontradas en
 * una pasada (no short-circuit) para debugging completo.
 */
export function validatePrice(
  price: ScrapedPrice,
  cache: BancoCentralCache,
): ValidationResult {
  const issues: AnomalyDetail[] = []

  // 1. Operador en whitelist
  if (!(OPERADORES_WHITELIST as readonly string[]).includes(price.operador)) {
    issues.push({
      campo_invalido: 'operador',
      valor_recibido: price.operador,
      valor_esperado_enum: [...OPERADORES_WHITELIST],
      mensaje: `Operador '${price.operador}' no está en la whitelist MVP`,
    })
  }

  // 2. Corredor en whitelist MVP (6 países)
  if (!(CORREDORES_WHITELIST as readonly string[]).includes(price.corredor)) {
    issues.push({
      campo_invalido: 'corredor',
      valor_recibido: price.corredor,
      valor_esperado_enum: [...CORREDORES_WHITELIST],
      mensaje: `Corredor '${price.corredor}' no está en la whitelist MVP (6 países activos)`,
    })
  }

  // 3. Método de entrega en enum
  if (!(METODOS_ENTREGA_WHITELIST as readonly string[]).includes(price.metodo_entrega)) {
    issues.push({
      campo_invalido: 'metodo_entrega',
      valor_recibido: price.metodo_entrega,
      valor_esperado_enum: [...METODOS_ENTREGA_WHITELIST],
      mensaje: `Método de entrega '${price.metodo_entrega}' no está en el enum permitido`,
    })
  }

  // 4. Velocidad en enum
  if (!(VELOCIDADES_WHITELIST as readonly string[]).includes(price.velocidad)) {
    issues.push({
      campo_invalido: 'velocidad',
      valor_recibido: price.velocidad,
      valor_esperado_enum: [...VELOCIDADES_WHITELIST],
      mensaje: `Velocidad '${price.velocidad}' no está en el enum permitido`,
    })
  }

  // 5. Fee en rango [0, 50] USD
  if (typeof price.fee !== 'number' || price.fee < FEE_MIN_USD || price.fee > FEE_MAX_USD) {
    issues.push({
      campo_invalido: 'fee',
      valor_recibido: price.fee,
      valor_esperado_min: FEE_MIN_USD,
      valor_esperado_max: FEE_MAX_USD,
      mensaje: `Fee ${price.fee} fuera del rango [${FEE_MIN_USD}, ${FEE_MAX_USD}] USD`,
    })
  }

  // 6. Tasa > 0 (defensivo básico)
  if (typeof price.tasa !== 'number' || price.tasa <= 0) {
    issues.push({
      campo_invalido: 'tasa',
      valor_recibido: price.tasa,
      valor_esperado_min: 0,
      mensaje: `Tasa ${price.tasa} debe ser mayor a 0`,
    })
    // Sin tasa numérica no podemos validar rango banco central
    return { valid: false, issues }
  }

  // 7. Tasa dentro de ±10% del banco central (o fallback)
  const codigoPais = CORREDOR_TO_CODIGO_PAIS[price.corredor]
  if (codigoPais) {
    const fallback = TASA_BASE_FALLBACK[codigoPais]
    const tasaBase = cache.get(codigoPais) ?? fallback?.base
    const tolerancia = fallback?.tolerancia ?? 0.10
    if (tasaBase && tasaBase > 0) {
      const min = tasaBase * (1 - tolerancia)
      const max = tasaBase * (1 + tolerancia)
      if (price.tasa < min || price.tasa > max) {
        issues.push({
          campo_invalido: 'tasa',
          valor_recibido: price.tasa,
          valor_esperado_min: Number(min.toFixed(4)),
          valor_esperado_max: Number(max.toFixed(4)),
          mensaje: `Tasa ${price.tasa} fuera del rango [${min.toFixed(4)}, ${max.toFixed(4)}] para ${price.corredor} (base ${tasaBase})`,
        })
      }
    }
  }

  return issues.length > 0 ? { valid: false, issues } : { valid: true }
}

/**
 * Registra cada issue en tabla scraper_anomalies + captura evento Sentry.
 * Si hay N issues en una fila, crea N rows en scraper_anomalies (una por
 * campo_invalido). El raw_price JSONB permite reconstruir la fila rechazada.
 *
 * Fail-open: si la inserción falla (red, RLS), loguea a console pero NO
 * crashea el batch — el objetivo es que el scraper NO caiga por una
 * anomalía.
 */
export async function logAnomaly(
  supabase: SupabaseClient,
  price: ScrapedPrice,
  issues: AnomalyDetail[],
): Promise<void> {
  try {
    const rows = issues.map((issue) => ({
      operador: price.operador,
      corredor: price.corredor,
      metodo_entrega: price.metodo_entrega,
      campo_invalido: issue.campo_invalido,
      valor_recibido:
        issue.valor_recibido !== undefined ? JSON.stringify(issue.valor_recibido) : null,
      valor_esperado_min: issue.valor_esperado_min ?? null,
      valor_esperado_max: issue.valor_esperado_max ?? null,
      valor_esperado_enum: issue.valor_esperado_enum
        ? JSON.stringify(issue.valor_esperado_enum)
        : null,
      mensaje: issue.mensaje,
      raw_price: price,
    }))
    const { error } = await supabase.from('scraper_anomalies').insert(rows)
    if (error) {
      console.error('[validator] no se pudo insertar scraper_anomaly:', error.message)
    } else {
      console.warn(
        `[validator] ${issues.length} anomalías registradas para ${price.operador}/${price.corredor}`,
      )
    }
  } catch (err) {
    console.error('[validator] exception insertando scraper_anomaly:', err)
  }

  // Sentry capture — tag dedicado permite filtrar en el dashboard.
  try {
    Sentry.captureMessage('scraper_anomaly', {
      level: 'warning',
      tags: {
        scraper_anomaly: 'true',
        operador: price.operador,
        corredor: price.corredor,
      },
      extra: {
        price,
        issues,
      },
    })
  } catch (err) {
    console.warn('[validator] Sentry capture falló (opcional):', err)
  }
}

/**
 * Consulta scraper_anomalies para el par (operador, corredor) dentro
 * de la ventana temporal. Si hay >= CONSECUTIVE_THRESHOLD entries,
 * consideramos que el scraper está consistentemente fallando y el
 * caller debe marcar precios stale.
 *
 * Serverless-safe: no usa memoria del proceso. Tolera cold starts
 * de Vercel. Ver TROUBLESHOOTING/27_contador_in_memory_serverless.md.
 */
export async function checkConsecutiveAnomalies(
  supabase: SupabaseClient,
  operador: string,
  corredor: string,
): Promise<boolean> {
  try {
    const since = new Date(
      Date.now() - CONSECUTIVE_WINDOW_MINUTES * 60 * 1000,
    ).toISOString()
    const { data, error } = await supabase
      .from('scraper_anomalies')
      .select('id')
      .eq('operador', operador)
      .eq('corredor', corredor)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(CONSECUTIVE_THRESHOLD)
    if (error) {
      console.error('[validator] error leyendo scraper_anomalies:', error.message)
      return false
    }
    return (data?.length || 0) >= CONSECUTIVE_THRESHOLD
  } catch (err) {
    console.error('[validator] exception en checkConsecutiveAnomalies:', err)
    return false
  }
}
