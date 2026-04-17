import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmationEmail } from '@/lib/resend'
import { CORREDORES_DATA } from '@/lib/corredores'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/suscripcion-free
 * Body: { email, corredor_favorito, idioma }
 * Creates subscription + sends double opt-in email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, corredor_favorito, idioma } = body

    if (!email || !corredor_favorito) {
      return NextResponse.json({ error: 'email y corredor_favorito requeridos' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Validate corridor exists
    const corredor = CORREDORES_DATA.find(c => c.id === corredor_favorito)
    if (!corredor) {
      return NextResponse.json({ error: 'Corredor no válido' }, { status: 400 })
    }

    const lang = idioma === 'en' ? 'en' : 'es'

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('suscriptores_free')
      .select('id, confirmado, activo')
      .eq('email', email.toLowerCase())
      .eq('corredor_favorito', corredor_favorito)
      .single()

    if (existing) {
      if (existing.confirmado && existing.activo) {
        return NextResponse.json({
          message: lang === 'en' ? 'You are already subscribed' : 'Ya estás suscrito',
          status: 'already_subscribed'
        })
      }
      // Re-activate if previously unsubscribed, or resend confirmation
      const newToken = crypto.randomUUID()
      await supabaseAdmin
        .from('suscriptores_free')
        .update({
          activo: true,
          confirmado: false,
          token_confirmacion: newToken,
          idioma: lang,
        })
        .eq('id', existing.id)

      await sendConfirmationEmail(email.toLowerCase(), {
        token: newToken,
        corredor: lang === 'en' ? corredor.nombre_en : corredor.nombre,
        idioma: lang,
      })

      return NextResponse.json({
        message: lang === 'en' ? 'Confirmation email resent' : 'Email de confirmación reenviado',
        status: 'confirmation_resent'
      })
    }

    // Create new subscription
    const { data: newSub, error } = await supabaseAdmin
      .from('suscriptores_free')
      .insert({
        email: email.toLowerCase(),
        corredor_favorito,
        idioma: lang,
      })
      .select('token_confirmacion')
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }

    // Send confirmation email
    await sendConfirmationEmail(email.toLowerCase(), {
      token: newSub.token_confirmacion,
      corredor: lang === 'en' ? corredor.nombre_en : corredor.nombre,
      idioma: lang,
    })

    return NextResponse.json({
      message: lang === 'en'
        ? 'Check your email to confirm your subscription'
        : 'Revisa tu email para confirmar tu suscripción',
      status: 'confirmation_sent'
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

/**
 * GET /api/suscripcion-free?action=confirm&token=xxx
 * GET /api/suscripcion-free?action=unsubscribe&token=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
  }

  if (action === 'confirm') {
    const { data, error } = await supabaseAdmin
      .from('suscriptores_free')
      .update({ confirmado: true, fecha_confirmacion: new Date().toISOString() })
      .eq('token_confirmacion', token)
      .eq('confirmado', false)
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Token inválido o ya confirmado' }, { status: 400 })
    }

    return NextResponse.json({ status: 'confirmed' })
  }

  if (action === 'unsubscribe') {
    const { data, error } = await supabaseAdmin
      .from('suscriptores_free')
      .update({ activo: false })
      .eq('token_baja', token)
      .eq('activo', true)
      .select('id, idioma')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Token inválido o ya dado de baja' }, { status: 400 })
    }

    return NextResponse.json({ status: 'unsubscribed', idioma: data.idioma })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
