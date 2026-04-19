import { NextRequest, NextResponse } from 'next/server'
import { validateAdminLogin, createAdminSession, clearAdminSession } from '@/lib/admin-auth'
import { getClientIp, checkAdminLoginRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  const { allowed, retryAfterSeconds } = await checkAdminLoginRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá unos minutos antes de reintentar.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      },
    )
  }

  const { email, password } = await request.json()

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (await validateAdminLogin(email, password)) {
    await createAdminSession()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
