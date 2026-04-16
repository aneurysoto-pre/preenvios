import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/corredores
 *
 * Devuelve todos los corredores activos ordenados por prioridad.
 */
export async function GET() {
  const { data, error } = await supabase
    .from('corredores')
    .select('*')
    .eq('activo', true)
    .order('prioridad', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
