import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/precios?corredor=honduras&metodo=bank
 *
 * Devuelve los precios de un corredor filtrados por método de entrega.
 * Si no se pasa corredor, devuelve todos.
 * Si no se pasa metodo, devuelve solo 'bank' (default).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const corredor = searchParams.get('corredor')
  const metodo = searchParams.get('metodo') || 'bank'

  let query = supabase
    .from('precios')
    .select('*')
    .eq('activo', true)
    .eq('metodo_entrega', metodo)
    .order('tasa', { ascending: false })

  if (corredor) {
    query = query.eq('corredor', corredor)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
