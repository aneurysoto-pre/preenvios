import { NextRequest, NextResponse } from 'next/server'
import { validateAdminLogin, createAdminSession, clearAdminSession } from '@/lib/admin-auth'
import {
  getClientIp,
  checkAdminLoginRateLimit,
  recordAdminLoginAttempt,
} from '@/lib/rate-limit'

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
    await recordAdminLoginAttempt(ip, String(email ?? ''), false)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await validateAdminLogin(email, password)
  await recordAdminLoginAttempt(ip, email, valid)

  if (valid) {
    await createAdminSession()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
