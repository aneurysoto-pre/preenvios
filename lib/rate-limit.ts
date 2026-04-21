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
 * - Admin login: 5 intentos / 15 min / IP (fixed window)
 * - Contacto form: 3 envíos / 1 hora / IP (fixed window)
 *
 * Sobre el bucketing de @upstash/ratelimit: el library almacena keys
 * como `{prefix}:{identifier}:{bucket_id}` donde bucket_id =
 * floor(now_ms / window_ms). Para window=15min, bucket_id cambia cada
 * 15 minutos. Un solo key por (identifier, ventana) — NO una clave por
 * request. Si ves multiples keys con bucket_ids distintos, es porque
 * los tests cruzaron >=1 frontera de 15 min.
 *
 * Para agregar rate limit a otros endpoints (forms publicos futuros):
 * crear un limiter adicional con su propio prefix y tuning.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let _adminLoginLimiter: Ratelimit | null = null
let _contactoLimiter: Ratelimit | null = null

function getAdminLoginLimiter(): Ratelimit {
  if (_adminLoginLimiter) return _adminLoginLimiter
  _adminLoginLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(5, '15 m'),
    analytics: true,
    prefix: 'rl:admin-login',
  })
  return _adminLoginLimiter
}

function getContactoLimiter(): Ratelimit {
  if (_contactoLimiter) return _contactoLimiter
  _contactoLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(3, '1 h'),
    analytics: true,
    prefix: 'rl:contacto',
  })
  return _contactoLimiter
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
    const res = await limiter.limit(ip)
    console.log('[rate-limit] admin-login', {
      ip,
      success: res.success,
      limit: res.limit,
      remaining: res.remaining,
      resetInSeconds: Math.max(0, Math.ceil((res.reset - Date.now()) / 1000)),
    })
    if (res.success) {
      return { allowed: true, retryAfterSeconds: 0, remaining: res.remaining }
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000))
    return { allowed: false, retryAfterSeconds, remaining: 0 }
  } catch (err) {
    console.error('[rate-limit] upstash error:', err)
    return { allowed: true, retryAfterSeconds: 0, remaining: 5 }
  }
}

export async function checkContactoRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const limiter = getContactoLimiter()
    const res = await limiter.limit(ip)
    console.log('[rate-limit] contacto', {
      ip,
      success: res.success,
      limit: res.limit,
      remaining: res.remaining,
      resetInSeconds: Math.max(0, Math.ceil((res.reset - Date.now()) / 1000)),
    })
    if (res.success) {
      return { allowed: true, retryAfterSeconds: 0, remaining: res.remaining }
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000))
    return { allowed: false, retryAfterSeconds, remaining: 0 }
  } catch (err) {
    console.error('[rate-limit] upstash error:', err)
    return { allowed: true, retryAfterSeconds: 0, remaining: 3 }
  }
}
