/**
 * Rate limit para endpoints sensibles — Upstash Redis (atomic INCR + TTL).
 *
 * Requiere env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Plan free de Upstash: 10.000 commands/día, suficiente para todo el
 * tráfico esperado de PreEnvios pre-lanzamiento.
 *
 * Fail-OPEN ante errores de Redis: el admin no debe quedar bloqueado
 * por fallos de infra. Los errores se loggean. Monitoreo futuro H-09.1.
 *
 * Política actual:
 * - Admin login: 5 intentos / 15 min / IP (sliding window)
 *
 * Para agregar rate limit a otros endpoints (H-04.1 en `/api/contactos`,
 * `/api/suscripcion-free`): crear un limiter adicional con su propio
 * prefix y tuning.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let _adminLoginLimiter: Ratelimit | null = null

function getAdminLoginLimiter(): Ratelimit {
  if (_adminLoginLimiter) return _adminLoginLimiter
  _adminLoginLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: false,
    prefix: 'rl:admin-login',
  })
  return _adminLoginLimiter
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
  remaining: number
}

export async function checkAdminLoginRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const limiter = getAdminLoginLimiter()
    const { success, reset, remaining } = await limiter.limit(ip)
    if (success) {
      return { allowed: true, retryAfterSeconds: 0, remaining }
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return { allowed: false, retryAfterSeconds, remaining: 0 }
  } catch (err) {
    console.error('[rate-limit] upstash error:', err)
    return { allowed: true, retryAfterSeconds: 0, remaining: 5 }
  }
}
