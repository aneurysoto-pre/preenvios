import { NextRequest, NextResponse } from 'next/server'
import { runAllScrapers } from '@/lib/scrapers'
import { sendAlertEmails } from '@/lib/email-alerts'

/**
 * GET /api/scrape
 *
 * Cron diario (7 AM UTC) — ejecuta scrapers + envía emails.
 * 1. Scrapers actualizan precios en Supabase
 * 2. Alertas diarias a suscriptores confirmados
 * 3. Newsletter semanal los lunes
 */
export async function GET(request: NextRequest) {
  // Verificar que viene de Vercel Cron o tiene el secret correcto
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Step 1: Run scrapers
  const results = await runAllScrapers()

  const totalSaved = results.reduce((sum, r) => sum + r.saved, 0)
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
  const totalDuration = results.reduce((sum, r) => sum + r.duration_ms, 0)

  // Step 2: Send email alerts (after prices are fresh)
  let emailResult = { dailySent: 0, weeklySent: 0, errors: [] as string[] }
  try {
    emailResult = await sendAlertEmails()
  } catch (e: any) {
    emailResult.errors.push(`sendAlertEmails crashed: ${e?.message || 'unknown'}`)
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    scrapers: { totalSaved, totalErrors, totalDuration_ms: totalDuration, results },
    emails: emailResult,
  })
}

export const maxDuration = 300 // 5 min: scrapers + emails
