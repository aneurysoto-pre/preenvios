import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * PUT /api/admin/precios
 * Actualiza tasa y fee de un operador/corredor específico
 * Body: { operador, corredor, metodo_entrega, tasa, fee }
 */
export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { operador, corredor, metodo_entrega, tasa, fee } = await request.json()

  if (!operador || !corredor) {
    return NextResponse.json({ error: 'operador and corredor required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('precios')
    .update({
      tasa: Number(tasa),
      fee: Number(fee),
      actualizado_en: new Date().toISOString(),
    })
    .eq('operador', operador)
    .eq('corredor', corredor)
    .eq('metodo_entrega', metodo_entrega || 'bank')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, operador, corredor, tasa, fee })
}

/**
 * PATCH /api/admin/precios
 * Bulk update de metadata de afiliado de un operador (todas sus filas)
 * Body: { operador, comision_usd, cookie_dias, trafico_calificable }
 */
export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { operador, comision_usd, cookie_dias, trafico_calificable } = await request.json()

  if (!operador) {
    return NextResponse.json({ error: 'operador required' }, { status: 400 })
  }

  const update: Record<string, number> = {}
  if (comision_usd !== undefined) update.comision_usd = Number(comision_usd)
  if (cookie_dias !== undefined) update.cookie_dias = Number(cookie_dias)
  if (trafico_calificable !== undefined) update.trafico_calificable = Number(trafico_calificable)

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'no fields to update' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('precios')
    .update(update)
    .eq('operador', operador)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, operador, updated: update })
}

/**
 * GET /api/admin/precios — lista todos los precios para edición
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('precios')
    .select('*')
    .eq('activo', true)
    .order('corredor')
    .order('operador')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
