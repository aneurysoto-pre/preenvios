import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/historial-tasas?corredor=dominican_republic
 * Devuelve historial de tasas promedio por día para los últimos 30 días.
 * Lee de tabla historial_tasas_publico (se llena cuando scrapers están activos).
 */
export async function GET(request: NextRequest) {
  const corredor = request.nextUrl.searchParams.get('corredor')
  if (!corredor) {
    return NextResponse.json({ error: 'corredor required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('historial_tasas_publico')
    .select('fecha, tasa_promedio')
    .eq('corredor', corredor)
    .order('fecha', { ascending: true })
    .limit(30)

  if (error) {
    // Table may not exist yet — return empty array
    return NextResponse.json([])
  }

  return NextResponse.json(data || [], {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  })
}
