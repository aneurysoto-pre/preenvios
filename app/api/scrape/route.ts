import { NextRequest, NextResponse } from 'next/server'
import { runAllScrapers } from '@/lib/scrapers'

/**
 * GET /api/scrape
 *
 * Ejecuta todos los scrapers. Protegido por CRON_SECRET para que
 * solo Vercel Cron Jobs pueda invocarlo.
 *
 * Vercel Cron config en vercel.json: cada 2 horas
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
    totalSaved,
    totalErrors,
    totalDuration_ms: totalDuration,
    results,
  })
}

export const maxDuration = 120 // 2 min max para scrapers
