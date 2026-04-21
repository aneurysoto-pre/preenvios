import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { contactoSchema } from '@/lib/schemas/contacto'
import { checkContactoRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/contactos
 *
 * Recibe mensaje del form /contacto. Flujo:
 * 1. Rate limit por IP (3 / 1h) — Upstash Redis, fail-OPEN.
 * 2. Parse con zod (mismo schema que el cliente usa via react-hook-form).
 * 3. Honeypot `website` — si viene con valor, responde 200 fake.
 * 4. Insert a Supabase `contactos` con service_role (bypass RLS).
 *
 * El form sale a prod con esta ruta reemplazando a la eliminada en 078dff3
 * (que tenía bug de scroll horizontal en iOS por CSS del front, no del API).
 */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = await checkContactoRateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limit', retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    )
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = contactoSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { website, nombre, email, asunto, mensaje, idioma } = parsed.data

  if (website && website.length > 0) {
    console.warn('[api/contactos] honeypot triggered', { ip, email })
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const { error } = await supabaseAdmin.from('contactos').insert({
    nombre,
    email,
    asunto,
    mensaje,
    idioma,
  })

  if (error) {
    console.error('[api/contactos] supabase insert error:', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  console.log('[api/contactos] received', { ip, email, asunto, idioma })
  return NextResponse.json({ ok: true }, { status: 200 })
}
