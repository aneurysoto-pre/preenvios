/**
 * Admin auth — autenticación básica temporal con env vars
 * Se reemplaza por Supabase Auth en Fase 4.4.B
 */

import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'preenvios_admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export async function validateAdminLogin(email: string, password: string): Promise<boolean> {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
}

export async function createAdminSession(): Promise<string> {
  const token = Buffer.from(`${Date.now()}-${Math.random().toString(36)}`).toString('base64')
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
