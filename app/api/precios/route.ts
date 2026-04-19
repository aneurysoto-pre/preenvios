import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Precio = {
  operador: string
  afiliado: boolean
  link: string
  [key: string]: unknown
}

// Operadores cuya cuenta afiliado esta pendiente de aprobacion. Hasta que se
// apruebe y tengamos tracking URL, se usa el dominio publico. Esta normalizacion
// garantiza que el boton se muestre activo en UI aunque la DB todavia tenga
// afiliado=false (ej. scraper revertio el flag, cache stale). Ver CONTEXTO_FINAL 4.2.6.
const PENDING_AFFILIATES: Record<string, string> = {
  westernunion: 'https://www.westernunion.com',
  moneygram: 'https://www.moneygram.com',
}

function normalizeAffiliate(p: Precio): Precio {
  const publicUrl = PENDING_AFFILIATES[p.operador]
  if (!publicUrl) return p
  if (p.afiliado && p.link) return p
  return { ...p, afiliado: true, link: p.link || publicUrl }
}

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

  const normalized = (data as Precio[] | null)?.map(normalizeAffiliate) ?? []

  return NextResponse.json(normalized, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
