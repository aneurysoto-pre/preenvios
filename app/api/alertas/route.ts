import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { alertaSchema } from '@/lib/schemas/alerta'
import { checkAlertaRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/alertas
 *
 * Recibe suscripcion a alertas diarias. Flujo:
 * 1. Rate limit por IP (3 / 1h) — Upstash Redis, fail-OPEN.
 * 2. Parse con zod (mismo schema que el cliente usa via react-hook-form).
 * 3. Honeypot `website` — si viene con valor, responde 200 fake.
 * 4. Insert a Supabase `alertas_email` con service_role (bypass RLS).
 *    Si duplicate key (code 23505 en Postgres, email ya suscrito),
 *    responde 200 OK silencioso — no revela si el email ya existia
 *    (no-enumeration).
 *
 * Reemplaza al endpoint /api/suscripcion-free eliminado en 5b8a2ed.
 * Nota: mes 1 NO se envian emails automaticos. El founder revisa
 * la tabla en Supabase manualmente para armar su lista de envio.
 */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  const rl = await checkAlertaRateLimit(ip)
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

  const parsed = alertaSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { website, email } = parsed.data

  if (website && website.length > 0) {
    console.warn('[api/alertas] honeypot triggered', { ip, email })
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const { error } = await supabaseAdmin.from('alertas_email').insert({ email })

  if (error) {
    // Postgres 23505 = unique violation (email ya suscrito).
    // Respondemos 200 silent — no-enumeration, no revelamos si existia.
    if (error.code === '23505') {
      console.log('[api/alertas] duplicate email (silent 200)', { ip, email })
      return NextResponse.json({ ok: true }, { status: 200 })
    }
    console.error('[api/alertas] supabase insert error:', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  console.log('[api/alertas] subscribed', { ip, email })
  return NextResponse.json({ ok: true }, { status: 200 })
}
