/**
 * Agente 3 — DB health monitor (Fase 7 defense-in-depth).
 *
 * Función pura que ejecuta row count checks sobre las tablas críticas de
 * Supabase y devuelve una lista de issues si alguna métrica cruza su
 * threshold. El endpoint /api/agents/db-health invoca esto, envía cada
 * issue a Sentry, y retorna JSON.
 *
 * Patrón alineado con lib/scrapers/validator.ts (función pura, testeable
 * en aislamiento, sin side effects propios — el caller decide qué hacer
 * con los issues).
 *
 * Thresholds v1 (absolutos, no ratios — post-launch se activan ratios con
 * 7 días de baseline real acumulado):
 *   contactos:               > 20/hora, > 100/24h  (anti-spam/bot)
 *   scraper_anomalies:       > 50/hora             (scrapers sistemáticos mal)
 *   precios total:           < 30 o > 200          (pérdida masiva / escritura descontrolada)
 *   corredores total:        ≠ 6                   (6 MVP exactos)
 *   tasas_bancos_centrales:  ≠ 6                   (6 MVP exactos)
 *
 * Ref: CONTEXTO_FINAL Fase 7 Agente 3, Proceso 29.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export type DbHealthIssue = {
  table: string
  metric: string
  threshold_type: 'gt' | 'lt' | 'neq'
  threshold_value: number
  observed_value: number
  message: string
  severity: 'warning'
}

export type DbHealthResult = {
  ok: boolean
  issues: DbHealthIssue[]
  counts: Record<string, number>
  timing_ms: {
    total: number
    per_check: Record<string, number>
  }
}

const THRESHOLDS = {
  contactos_1h: 20,
  contactos_24h: 100,
  scraper_anomalies_1h: 50,
  precios_min: 30,
  precios_max: 200,
  corredores_expected: 6,
  tasas_bancos_centrales_expected: 6,
} as const

async function countRows(
  supabase: SupabaseClient,
  table: string,
  filter?: { column: string; op: 'gte'; value: string },
): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) {
    query = query.gte(filter.column, filter.value)
  }
  const { count, error } = await query
  if (error) throw new Error(`${table} count query failed: ${error.message}`)
  return count ?? 0
}

export async function checkDbHealth(supabase: SupabaseClient): Promise<DbHealthResult> {
  const start = Date.now()
  const issues: DbHealthIssue[] = []
  const counts: Record<string, number> = {}
  const perCheck: Record<string, number> = {}

  const now = Date.now()
  const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString()
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()

  // contactos — inserts últimas 1h
  let t = Date.now()
  const contactos1h = await countRows(supabase, 'contactos', {
    column: 'created_at',
    op: 'gte',
    value: oneHourAgo,
  })
  perCheck.contactos_1h = Date.now() - t
  counts.contactos_1h = contactos1h
  if (contactos1h > THRESHOLDS.contactos_1h) {
    issues.push({
      table: 'contactos',
      metric: 'inserts_1h',
      threshold_type: 'gt',
      threshold_value: THRESHOLDS.contactos_1h,
      observed_value: contactos1h,
      message: `Contactos insertados en ultima hora: ${contactos1h} (threshold: >${THRESHOLDS.contactos_1h} = posible spam/bot attack)`,
      severity: 'warning',
    })
  }

  // contactos — inserts últimas 24h
  t = Date.now()
  const contactos24h = await countRows(supabase, 'contactos', {
    column: 'created_at',
    op: 'gte',
    value: twentyFourHoursAgo,
  })
  perCheck.contactos_24h = Date.now() - t
  counts.contactos_24h = contactos24h
  if (contactos24h > THRESHOLDS.contactos_24h) {
    issues.push({
      table: 'contactos',
      metric: 'inserts_24h',
      threshold_type: 'gt',
      threshold_value: THRESHOLDS.contactos_24h,
      observed_value: contactos24h,
      message: `Contactos insertados en ultimas 24h: ${contactos24h} (threshold: >${THRESHOLDS.contactos_24h} = attack sostenido)`,
      severity: 'warning',
    })
  }

  // scraper_anomalies — inserts últimas 1h
  t = Date.now()
  const anomalies1h = await countRows(supabase, 'scraper_anomalies', {
    column: 'created_at',
    op: 'gte',
    value: oneHourAgo,
  })
  perCheck.scraper_anomalies_1h = Date.now() - t
  counts.scraper_anomalies_1h = anomalies1h
  if (anomalies1h > THRESHOLDS.scraper_anomalies_1h) {
    issues.push({
      table: 'scraper_anomalies',
      metric: 'inserts_1h',
      threshold_type: 'gt',
      threshold_value: THRESHOLDS.scraper_anomalies_1h,
      observed_value: anomalies1h,
      message: `Anomalias registradas en ultima hora: ${anomalies1h} (threshold: >${THRESHOLDS.scraper_anomalies_1h} = scrapers devuelven basura sistematica)`,
      severity: 'warning',
    })
  }

  // precios — total rows
  t = Date.now()
  const preciosTotal = await countRows(supabase, 'precios')
  perCheck.precios_total = Date.now() - t
  counts.precios_total = preciosTotal
  if (preciosTotal < THRESHOLDS.precios_min) {
    issues.push({
      table: 'precios',
      metric: 'total_rows',
      threshold_type: 'lt',
      threshold_value: THRESHOLDS.precios_min,
      observed_value: preciosTotal,
      message: `Precios total: ${preciosTotal} (threshold: <${THRESHOLDS.precios_min} = posible perdida masiva de data)`,
      severity: 'warning',
    })
  } else if (preciosTotal > THRESHOLDS.precios_max) {
    issues.push({
      table: 'precios',
      metric: 'total_rows',
      threshold_type: 'gt',
      threshold_value: THRESHOLDS.precios_max,
      observed_value: preciosTotal,
      message: `Precios total: ${preciosTotal} (threshold: >${THRESHOLDS.precios_max} = escritura descontrolada)`,
      severity: 'warning',
    })
  }

  // corredores — total rows
  t = Date.now()
  const corredoresTotal = await countRows(supabase, 'corredores')
  perCheck.corredores_total = Date.now() - t
  counts.corredores_total = corredoresTotal
  if (corredoresTotal !== THRESHOLDS.corredores_expected) {
    issues.push({
      table: 'corredores',
      metric: 'total_rows',
      threshold_type: 'neq',
      threshold_value: THRESHOLDS.corredores_expected,
      observed_value: corredoresTotal,
      message: `Corredores total: ${corredoresTotal} (esperado: ${THRESHOLDS.corredores_expected} MVP exactos)`,
      severity: 'warning',
    })
  }

  // tasas_bancos_centrales — total rows
  t = Date.now()
  const tasasTotal = await countRows(supabase, 'tasas_bancos_centrales')
  perCheck.tasas_bancos_centrales_total = Date.now() - t
  counts.tasas_bancos_centrales_total = tasasTotal
  if (tasasTotal !== THRESHOLDS.tasas_bancos_centrales_expected) {
    issues.push({
      table: 'tasas_bancos_centrales',
      metric: 'total_rows',
      threshold_type: 'neq',
      threshold_value: THRESHOLDS.tasas_bancos_centrales_expected,
      observed_value: tasasTotal,
      message: `Tasas BC total: ${tasasTotal} (esperado: ${THRESHOLDS.tasas_bancos_centrales_expected} MVP exactos)`,
      severity: 'warning',
    })
  }

  return {
    ok: issues.length === 0,
    issues,
    counts,
    timing_ms: {
      total: Date.now() - start,
      per_check: perCheck,
    },
  }
}
