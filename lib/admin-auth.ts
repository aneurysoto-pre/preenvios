/**
 * Admin auth — autenticación básica temporal con env vars
 * Se reemplaza por Supabase Auth en Fase 4.4.B
 *
 * Token de sesión: HMAC-signed stateless.
 * Formato: <random-32bytes-base64url>.<expires-at-unix-ms>.<hmac-sha256-base64url>
 * HMAC calculado con ADMIN_SESSION_SECRET (32+ bytes, server-only).
 * Verificación con timingSafeEqual para prevenir timing attacks.
 * Rotar ADMIN_SESSION_SECRET invalida todas las sesiones vivas.
 */

import { cookies } from 'next/headers'
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'

const ADMIN_COOKIE = 'preenvios_admin_session'
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 horas (A07 checklist)

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET not configured')
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function verifySignature(payload: string, signature: string): boolean {
  let expected: string
  try {
    expected = sign(payload)
  } catch {
    return false
  }
  const a = Buffer.from(signature, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function validateAdminLogin(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL
  const expectedHash = process.env.ADMIN_PASSWORD_HASH
  if (!expectedEmail || !expectedHash) return false
  if (email !== expectedEmail) return false
  try {
    return bcrypt.compareSync(password, expectedHash)
  } catch {
    return false
  }
}

export async function createAdminSession(): Promise<string> {
  const random = randomBytes(32).toString('base64url')
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const payload = `${random}.${expiresAt}`
  const signature = sign(payload)
  const token = `${payload}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  })
  return token
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  if (!session?.value) return false

  const parts = session.value.split('.')
  if (parts.length !== 3) return false
  const [random, expiresAtStr, signature] = parts
  if (!random || !expiresAtStr || !signature) return false

  if (!verifySignature(`${random}.${expiresAtStr}`, signature)) return false

  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
