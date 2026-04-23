/**
 * POST /api/agents/db-health — Agente 3 Fase 7 defense-in-depth.
 *
 * Invocado por Supabase pg_cron + pg_net cada 30 minutos (schedule se
 * registra en migracion 008). Auth igual que /api/scrape (FASE 10 A.1):
 * header Authorization: Bearer ${CRON_SECRET}, hard-fail 500 si env var
 * undefined, 401 si Bearer no matchea.
 *
 * Cada issue detectado → Sentry.captureMessage con tag 'db_health' para
 * agrupacion en Sentry UI. Retorna JSON con resumen timing + counts +
 * issues para inspeccion manual / logs Vercel.
 *
 * Ref: Proceso 29, CONTEXTO_FINAL Fase 7 Agente 3.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { checkDbHealth } from '@/lib/agents/db-health'

export async function POST(request: NextRequest) {
  // Auth — mismo patron que /api/scrape post-FASE 10 A.1.
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Service role key — bypassa RLS para contar contactos (tabla con
  // policies deny-anon).
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const result = await checkDbHealth(supabase)

  // 1 Sentry event por issue con fingerprint custom — sin esto Sentry
  // agrupa todo bajo 1 issue porque el stack trace de captureMessage es
  // identico (mismo for loop, mismo archivo). Con fingerprint
  // [agent, table, metric] cada combinacion tabla+metrica es un issue
  // separado en Sentry UI, con su propia escalacion, alertas e historial.
  for (const issue of result.issues) {
    Sentry.captureMessage(`db_health: ${issue.table}.${issue.metric}`, {
      level: 'warning',
      tags: {
        agent: 'db_health',
        table: issue.table,
        metric: issue.metric,
      },
      extra: {
        threshold_type: issue.threshold_type,
        threshold_value: issue.threshold_value,
        observed_value: issue.observed_value,
        message: issue.message,
      },
      fingerprint: ['db_health', issue.table, issue.metric],
    })
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    ...result,
  })
}

// 30s es suficiente — el health check son 6 queries COUNT() simples.
// El limite duro de pg_net que nos llama es 5000ms (ver Proceso 29), este
// maxDuration es el cap del handler Next.js (mas generoso para permitir
// runs manuales via curl sin cortarse).
export const maxDuration = 30
