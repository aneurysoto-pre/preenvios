# 15 — Admin login vulnerable (🔒 seguridad)

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 30-60 min

## ✅ Estado: las 4 causas resueltas el 2026-04-19

- **Causa 1** (token de sesión no criptográficamente seguro): `lib/admin-auth.ts` ahora genera token como `<random32-base64url>.<expires-at>.<hmac-sha256>` firmado con `ADMIN_SESSION_SECRET`. `isAdminAuthenticated()` verifica HMAC con `timingSafeEqual` y valida expiración. Duración reducida de 24h → 4h.
  - **Vercel env vars (2026-04-19):** `ADMIN_SESSION_SECRET` agregada en los 3 entornos. Login admin probado en producción.
- **Causa 2** (sin rate limit en `/api/admin/auth`): implementado con Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`), sliding window 5 intentos / IP / 15 min → HTTP 429 con `Retry-After`. `lib/rate-limit.ts` reescrito. Cerrado en código.
  - **Historial:** primer intento fue Supabase-backed (tabla `admin_login_attempts`, migración 006). El user hizo 9 intentos fallidos sin recibir 429 porque la migración no se había ejecutado y el fail-open enmascaró el problema. Switch a Upstash (recomendación original del audit) — atómico y sin dependencia de migración manual.
  - **Acciones manuales pendientes:** crear Redis db free en upstash.com; pegar `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` en Vercel (3 entornos) y `.env.local`; redeploy; smoke test.
- **Causa 3** (`/api/admin/dashboard` no usa sesión admin): `app/api/admin/dashboard/route.ts` valida con `isAdminAuthenticated()`; `panel.tsx` ya no envía `Authorization` header. Cerrado.
- **Causa 4** (`ADMIN_PASSWORD` en texto plano): `lib/admin-auth.ts` usa `bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH)` con factor 12. `bcryptjs` + `@types/bcryptjs` instalados.
  - **Vercel env vars (2026-04-19):** `ADMIN_PASSWORD` eliminada, `ADMIN_PASSWORD_HASH` agregada en los 3 entornos. Login admin probado en producción.

Los 4 🔴 críticos de auditoría #01 quedan cerrados. Queda pendiente ejecutar la migración 006 en Supabase + smoke test en producción antes de activar DNS.

---

## Síntoma
Evidencia:
1. `lib/admin-auth.ts:16` genera tokens con `Buffer.from(\`${Date.now()}-${Math.random().toString(36)}\`).toString('base64')` — reversible y predecible
2. `app/api/admin/auth/route.ts` no tiene rate limit — permite 1000+ intentos/s
3. `app/api/admin/dashboard/route.ts` usa `CRON_SECRET` (no sesión admin) → inconsistente con el resto

Un atacante puede decodificar la cookie `admin_session` o hacer brute-force al login.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Token de sesión no criptográficamente seguro
Arreglo:
1. Editar `lib/admin-auth.ts`:
   ```ts
   import crypto from 'crypto'

   function generateToken(): string {
     return crypto.randomBytes(32).toString('hex')
   }
   ```
2. Reemplazar todas las llamadas actuales de `Buffer.from(...).toString('base64')` por `generateToken()`
3. Invalidar sesiones viejas: cambiar el nombre de la cookie temporalmente (`admin_session_v2`) para forzar re-login a todos
4. Commit + push
5. Verificación: `/es/admin` requiere login; la cookie nueva no es reversible

### 🎯 Causa 2 — Sin rate limit en `/api/admin/auth`
Contexto: atacante con lista de passwords comunes puede probar 1000/s hasta acertar.

Arreglo:
1. Instalar Upstash Redis (gratis hasta 10k req/día): https://upstash.com
2. Agregar env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
3. `npm install @upstash/ratelimit @upstash/redis`
4. Editar `app/api/admin/auth/route.ts`:
   ```ts
   import { Ratelimit } from '@upstash/ratelimit'
   import { Redis } from '@upstash/redis'

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(5, '15 m'),
   })

   export async function POST(request: NextRequest) {
     const ip = request.headers.get('x-forwarded-for') || 'unknown'
     const { success } = await ratelimit.limit(`admin-login:${ip}`)
     if (!success) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
     // resto del login
   }
   ```
5. Commit + push
6. Verificación: 6 intentos desde la misma IP en 15 min → 429

### 🎯 Causa 3 — `/api/admin/dashboard` no usa sesión admin
Contexto: usa `CRON_SECRET` en lugar de `isAdminAuthenticated`. Inconsistente con los otros endpoints admin. Crea el problema de `NEXT_PUBLIC_CRON_SECRET` (ver [14](14_endpoint_cron_expuesto.md)).

Arreglo:
1. Editar `app/api/admin/dashboard/route.ts`:
   ```ts
   import { isAdminAuthenticated } from '@/lib/admin-auth'
   export async function GET() {
     if (!await isAdminAuthenticated()) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
     // resto del código
   }
   ```
2. En `app/[locale]/admin/panel.tsx:54` quitar el `Authorization` header
3. Verificación: dashboard carga en admin logueado; devuelve 401 si no hay cookie

### 🎯 Causa 4 — `ADMIN_PASSWORD` en texto plano (no hasheado)
Contexto: `.env.local` y Vercel env vars tienen el password directo. Si alguien accede a un backup de env vars o un log mal configurado, tiene el password.

Arreglo (mediano plazo, no urgente):
1. Generar hash: `node -e "console.log(require('bcryptjs').hashSync('tu_password', 10))"`
2. Guardar `ADMIN_PASSWORD_HASH` en Vercel (no el password)
3. En `lib/admin-auth.ts` comparar con `bcrypt.compare(input, hash)`
4. `npm install bcryptjs @types/bcryptjs`

### 🎯 Causa 5 — Cookie sin flags apropiadas
Contexto: verificar que `lib/admin-auth.ts` setea:
- `httpOnly: true` (no accesible por JS)
- `secure: true` en prod (solo HTTPS)
- `sameSite: 'lax'` (previene CSRF)
- `maxAge: 60 * 60 * 24` (24h)

Arreglo:
1. Revisar código actual en `lib/admin-auth.ts`
2. Si falta algún flag, agregarlo

## Workaround mientras arreglas
Rotar `ADMIN_PASSWORD` HOY en Vercel con un password fuerte (32+ chars, aleatorio). Esto detiene el brute force básico mientras implementas rate limit.

## Relacionados
- [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — la fix de `/api/admin/dashboard` conecta con esto
- [10_admin_panel_no_accede.md](10_admin_panel_no_accede.md) — problemas operativos de login
