/**
 * Email alert logic — daily + weekly digest
 * Called from the cron endpoint after scrapers run
 */

import { createClient } from '@supabase/supabase-js'
import { sendDailyAlert, sendWeeklyDigest } from '@/lib/resend'
import { CORREDORES_DATA } from '@/lib/corredores'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type AlertResult = {
  dailySent: number
  weeklySent: number
  errors: string[]
}

/**
 * Send daily alerts to all confirmed+active subscribers.
 * On Mondays, also send the weekly digest.
 */
export async function sendAlertEmails(): Promise<AlertResult> {
  const result: AlertResult = { dailySent: 0, weeklySent: 0, errors: [] }

  // Get all confirmed active subscribers
  const { data: subs, error: subsError } = await supabaseAdmin
    .from('suscriptores_free')
    .select('*')
    .eq('confirmado', true)
    .eq('activo', true)

  if (subsError || !subs || subs.length === 0) {
    if (subsError) result.errors.push(`Fetch subscribers: ${subsError.message}`)
    return result
  }

  // Get best prices per corridor (bank method, sorted by tasa desc)
  const corredorIds = [...new Set(subs.map(s => s.corredor_favorito))]
  const bestByCorr: Record<string, { operador: string; nombre_operador: string; tasa: number; fee: number; link: string }> = {}

  for (const corrId of corredorIds) {
    const { data: prices } = await supabaseAdmin
      .from('precios')
      .select('operador, nombre_operador, tasa, fee, link')
      .eq('corredor', corrId)
      .eq('metodo_entrega', 'bank')
      .eq('activo', true)
      .order('tasa', { ascending: false })
      .limit(1)

    if (prices && prices.length > 0) {
      bestByCorr[corrId] = prices[0]
    }
  }

  // ── Daily alerts ──
  for (const sub of subs) {
    const best = bestByCorr[sub.corredor_favorito]
    if (!best) continue

    const corredor = CORREDORES_DATA.find(c => c.id === sub.corredor_favorito)
    if (!corredor) continue

    const idioma = sub.idioma === 'en' ? 'en' as const : 'es' as const

    try {
      await sendDailyAlert(sub.email, {
        corredor: corredor.id,
        corredorNombre: idioma === 'en' ? corredor.nombre_en : corredor.nombre,
        moneda: corredor.moneda,
        mejorOperador: best.nombre_operador,
        mejorTasa: best.tasa,
        fee: best.fee,
        linkAfiliado: best.link || '',
        tokenBaja: sub.token_baja,
        idioma,
      })
      result.dailySent++
    } catch (e: any) {
      result.errors.push(`Daily to ${sub.email}: ${e?.message || 'unknown'}`)
    }

    // Small delay to avoid Resend rate limits
    await new Promise(r => setTimeout(r, 200))
  }

  // ── Weekly digest (Mondays only) ──
  const dayOfWeek = new Date().getUTCDay() // 0=Sun, 1=Mon
  if (dayOfWeek === 1) {
    // Build summary for all corridors
    const allBest: { corredor: string; corredorNombre: string; moneda: string; mejorOperador: string; mejorTasa: number }[] = []
    for (const c of CORREDORES_DATA) {
      const { data: prices } = await supabaseAdmin
        .from('precios')
        .select('nombre_operador, tasa')
        .eq('corredor', c.id)
        .eq('metodo_entrega', 'bank')
        .eq('activo', true)
        .order('tasa', { ascending: false })
        .limit(1)

      if (prices && prices.length > 0) {
        allBest.push({
          corredor: c.id,
          corredorNombre: c.nombre,
          moneda: c.moneda,
          mejorOperador: prices[0].nombre_operador,
          mejorTasa: prices[0].tasa,
        })
      }
    }

    // Deduplicate subscribers by email (one weekly per email, not per corridor)
    const seen = new Set<string>()
    for (const sub of subs) {
      if (seen.has(sub.email)) continue
      seen.add(sub.email)

      const idioma = sub.idioma === 'en' ? 'en' as const : 'es' as const
      const resumen = allBest.map(b => ({
        ...b,
        corredorNombre: idioma === 'en'
          ? (CORREDORES_DATA.find(c => c.id === b.corredor)?.nombre_en || b.corredorNombre)
          : b.corredorNombre,
      }))

      try {
        await sendWeeklyDigest(sub.email, {
          resumen,
          tokenBaja: sub.token_baja,
          idioma,
        })
        result.weeklySent++
      } catch (e: any) {
        result.errors.push(`Weekly to ${sub.email}: ${e?.message || 'unknown'}`)
      }

      await new Promise(r => setTimeout(r, 200))
    }
  }

  return result
}
