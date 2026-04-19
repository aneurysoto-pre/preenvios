import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/admin-auth'

/**
 * GET /api/admin/dashboard
 *
 * Dashboard interno: estado de scrapers, precios desactualizados,
 * último update por operador.
 */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get latest update per operator
  const { data: precios } = await supabase
    .from('precios')
    .select('operador, corredor, tasa, fee, actualizado_en')
    .eq('activo', true)
    .order('actualizado_en', { ascending: false })

  if (!precios) {
    return NextResponse.json({ error: 'No data' }, { status: 500 })
  }

  // Group by operator, find stalest
  const byOperator: Record<string, { lastUpdate: string; stale: boolean; count: number }> = {}
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  for (const p of precios) {
    if (!byOperator[p.operador]) {
      byOperator[p.operador] = {
        lastUpdate: p.actualizado_en,
        stale: p.actualizado_en < twoHoursAgo,
        count: 0,
      }
    }
    byOperator[p.operador].count++
    // Track oldest update
    if (p.actualizado_en < byOperator[p.operador].lastUpdate) {
      byOperator[p.operador].lastUpdate = p.actualizado_en
      byOperator[p.operador].stale = p.actualizado_en < twoHoursAgo
    }
  }

  const staleOperators = Object.entries(byOperator)
    .filter(([, v]) => v.stale)
    .map(([k]) => k)

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalPrices: precios.length,
    operators: byOperator,
    staleOperators,
    healthy: staleOperators.length === 0,
  })
}
