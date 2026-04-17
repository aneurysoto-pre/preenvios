import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/tasas-banco-central
 * Devuelve tasas de referencia de bancos centrales
 */
export async function GET() {
  const { data, error } = await supabase
    .from('tasas_bancos_centrales')
    .select('*')
    .order('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
