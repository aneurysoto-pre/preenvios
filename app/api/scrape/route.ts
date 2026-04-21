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
  // Verificar que viene de Vercel Cron o tiene el secret correcto
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
