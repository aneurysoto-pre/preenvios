/**
 * Rate limit para endpoints sensibles — Supabase-backed, sin Redis externo.
 *
 * Diseño:
 * - Tabla `admin_login_attempts` registra cada intento (IP hasheada + email + success)
 * - `checkAdminLoginRateLimit` cuenta intentos fallidos en la ventana
 * - Privacidad: IP se guarda como SHA-256 (no plaintext)
 * - Fail OPEN ante errores de Supabase: el admin no debe quedar bloqueado
 *   por fallos de infra. Los logs avisan y H-09.1 (Sentry) cubrirá monitoreo.
 *
 * Reemplazar por Upstash/Redis o capa edge si el volumen crece.
 */

import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const MAX_FAILED_ATTEMPTS = 5
const WINDOW_MINUTES = 15

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
  failedAttempts: number
}

export async function checkAdminLoginRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const supabase = getAdminSupabase()
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count, error } = await supabase
      .from('admin_login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', hashIp(ip))
      .eq('success', false)
      .gte('attempted_at', since)

    if (error) {
      console.error('[rate-limit] supabase count error:', error)
      return { allowed: true, retryAfterSeconds: 0, failedAttempts: 0 }
    }

    const failed = count ?? 0
    if (failed >= MAX_FAILED_ATTEMPTS) {
      return {
        allowed: false,
        retryAfterSeconds: WINDOW_MINUTES * 60,
        failedAttempts: failed,
      }
    }
    return { allowed: true, retryAfterSeconds: 0, failedAttempts: failed }
  } catch (err) {
    console.error('[rate-limit] check failed:', err)
    return { allowed: true, retryAfterSeconds: 0, failedAttempts: 0 }
  }
}

export async function recordAdminLoginAttempt(
  ip: string,
  email: string,
  success: boolean,
): Promise<void> {
  try {
    const supabase = getAdminSupabase()
    const { error } = await supabase.from('admin_login_attempts').insert({
      ip_hash: hashIp(ip),
      email: email.slice(0, 254),
      success,
    })
    if (error) console.error('[rate-limit] supabase insert error:', error)
  } catch (err) {
    console.error('[rate-limit] record failed:', err)
  }
}
