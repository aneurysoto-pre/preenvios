import { NextRequest, NextResponse } from 'next/server'
import { runAllScrapers } from '@/lib/scrapers'

/**
 * GET /api/scrape
 *
 * Cron diario (7 AM UTC) — ejecuta scrapers para actualizar precios en
 * Supabase. El envio de emails a suscriptores fue removido con la
 * limpieza total del sistema de alertas (commit chore(alertas) —
 * bug de scroll horizontal heredado del componente original). Si se
 * rehace alertas desde cero en una Parte 2, re-agregar el step de
 * envio de emails aqui.
 */
export async function GET(request: NextRequest) {
  // Auth del endpoint cron. Hard-fail si CRON_SECRET no esta seteada — sin
  // este check, si alguien borra la env var por error, el endpoint queda
  // publico al mundo y cualquiera dispara los 7 scrapers.
  // Ref: TROUBLESHOOTING/14 Causa 1, FASE 10 BLOQUE A.1.
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await runAllScrapers()

  const totalSaved = results.reduce((sum, r) => sum + r.saved, 0)
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
  const totalDuration = results.reduce((sum, r) => sum + r.duration_ms, 0)

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    scrapers: { totalSaved, totalErrors, totalDuration_ms: totalDuration, results },
  })
}

export const maxDuration = 300 // 5 min: scrapers
