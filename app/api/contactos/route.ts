import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_ASUNTOS = new Set(['general', 'rate', 'partnership', 'other'])

/**
 * POST /api/contactos
 * Body: { nombre, email, asunto, mensaje, idioma }
 * Inserts a contact message into Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const nombre = String(body.nombre ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const asunto = String(body.asunto ?? '').trim()
    const mensaje = String(body.mensaje ?? '').trim()
    const idioma = body.idioma === 'en' ? 'en' : 'es'

    if (!nombre || nombre.length < 2 || nombre.length > 120) {
      return NextResponse.json({ error: 'Nombre invalido' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 160) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 })
    }
    if (!VALID_ASUNTOS.has(asunto)) {
      return NextResponse.json({ error: 'Asunto invalido' }, { status: 400 })
    }
    if (!mensaje || mensaje.length < 10 || mensaje.length > 4000) {
      return NextResponse.json({ error: 'Mensaje invalido' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('contactos')
      .insert({ nombre, email, asunto, mensaje, idioma })

    if (error) {
      return NextResponse.json({ error: 'No se pudo guardar el mensaje' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Solicitud invalida' }, { status: 400 })
  }
}
