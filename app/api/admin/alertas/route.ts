import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

/**
 * POST /api/admin/alertas
 * Dispara alerta manual por corredor cuando un scraper falla.
 * En Fase 4.4.A se conecta a Resend para enviar emails reales.
 * Por ahora solo registra la intención.
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { corredor, mensaje } = await request.json()

  if (!corredor) {
    return NextResponse.json({ error: 'corredor required' }, { status: 400 })
  }

  // Placeholder: en Fase 4.4.A se envía via Resend a suscriptores del corredor
  console.log(`[ALERTA MANUAL] Corredor: ${corredor} — ${mensaje || 'Sin mensaje'}`)

  return NextResponse.json({
    ok: true,
    corredor,
    mensaje: mensaje || 'Alerta manual registrada',
    note: 'Se activará envío real cuando Resend esté configurado (Fase 4.4.A)',
  })
}
