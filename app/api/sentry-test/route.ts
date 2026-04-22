import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * GET /api/sentry-test
 *
 * Endpoint TEMPORAL para smoke test de activación de Sentry (2026-04-22).
 * Valida dos integraciones críticas:
 *
 * 1. Sentry.captureMessage() manual con tag `scraper_anomaly` — usado por
 *    el Agente 1 (Fase 7 defense-in-depth) en lib/scrapers/validator.ts.
 *    Si este evento no llega al dashboard con los tags correctos, la
 *    alerta #3 recomendada ("scraper anomaly burst") nunca disparará
 *    cuando un scraper real devuelva data basura en producción.
 *
 * 2. Captura automática de excepciones no-handleadas en API routes
 *    (Node runtime). Si falla, ningún error de endpoint quedará
 *    trackeado en Sentry — el founder se entera solo via BetterStack
 *    (que ve HTTP 500 pero sin contexto).
 *
 * Este archivo se ELIMINA en un commit separado inmediatamente después
 * del smoke test exitoso. NO debe quedar en producción.
 *
 * Ver plan completo en SERVICIOS_EXTERNOS_DETALLE.md § 17 "Pasos de
 * activación".
 */
export async function GET() {
  const timestamp = new Date().toISOString()

  // 1. captureMessage con tag scraper_anomaly — verifica el patrón exacto
  // que usa lib/scrapers/validator.ts → logAnomaly()
  Sentry.captureMessage('scraper_anomaly', {
    level: 'warning',
    tags: {
      scraper_anomaly: 'true',
      operador: 'sentry-test',
      corredor: 'sentry-test',
    },
    extra: {
      smoke_test: true,
      timestamp,
      source: '/api/sentry-test',
    },
  })

  // 2. throw para verificar captura automática de excepciones no-handleadas
  // en el Node runtime de Next.js. El browser verá HTTP 500 — esperado.
  throw new Error(`[sentry-test-${timestamp}] smoke test server-side`)

  // Esta línea nunca se ejecuta — pero deja la firma del handler limpia.
  // eslint-disable-next-line no-unreachable
  return NextResponse.json({ ok: true })
}
