/**
 * Admin auth — autenticación básica temporal con env vars
 * Se reemplaza por Supabase Auth en Fase 4.4.B
 */

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const ADMIN_COOKIE = 'preenvios_admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas

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
  const { randomBytes } = await import('node:crypto')
  const token = randomBytes(32).toString('base64url')
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
  return token
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  return !!session?.value
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
