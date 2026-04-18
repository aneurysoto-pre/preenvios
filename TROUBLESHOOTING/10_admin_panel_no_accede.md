# 10 — Admin panel no accede

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 5-15 min

## Síntoma
`/es/admin` muestra login. Escribes credenciales y: no te deja entrar, o entra pero tab Dashboard devuelve 401, o sesión se cae después de poco tiempo.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `ADMIN_EMAIL` o `ADMIN_PASSWORD` no configuradas
Arreglo:
1. Vercel → Settings → Environment Variables → verificar `ADMIN_EMAIL` y `ADMIN_PASSWORD` en Production
2. Valor local: revisar `.env.local`
3. Si cambias, redesplegar
4. Verificación: login en `/es/admin` con credenciales exactas (email case-sensitive)

### 🎯 Causa 2 — Tab Dashboard devuelve 401 pero otros tabs funcionan
Contexto: `app/api/admin/dashboard/route.ts` valida con `CRON_SECRET` mientras que `/api/admin/precios` y `/api/admin/alertas` validan con sesión admin. Inconsistencia.

Arreglo:
1. `app/[locale]/admin/panel.tsx:54` pasa `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}` al fetch
2. `NEXT_PUBLIC_CRON_SECRET` puede no estar configurada o ser distinta al `CRON_SECRET` real del server
3. **FIX PROPIO (recomendado)**: cambiar `dashboard/route.ts` a validar con `isAdminAuthenticated(request)` como hacen los demás admin endpoints
4. Editar `app/api/admin/dashboard/route.ts`:
   ```ts
   import { isAdminAuthenticated } from '@/lib/admin-auth'
   export async function GET(request: NextRequest) {
     if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     // ... resto igual
   }
   ```
5. Quitar el envío de Bearer header en `panel.tsx:54` (ya no hace falta — la cookie va automática)
6. Ver también [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — el mismo `NEXT_PUBLIC_CRON_SECRET` es un leak

### 🎯 Causa 3 — Cookie de sesión no se setea (HTTP vs HTTPS en dev)
Contexto: `lib/admin-auth.ts` setea cookie con `secure: process.env.NODE_ENV === 'production'`. En localhost con HTTP funciona. En preview Vercel con HTTPS también. Problema típico: usuario bloquea cookies third-party.

Arreglo:
1. DevTools → Application → Cookies → `preenvios.vercel.app` → ¿hay cookie `admin_session`?
2. Si no: browser bloqueó cookies, probar en incógnito sin extensiones
3. Safari iOS a veces bloquea — probar Chrome

### 🎯 Causa 4 — Sesión expira antes de 24h
Contexto: cookie tiene `maxAge: 60 * 60 * 24` (24h). Si la sesión cae antes, es porque Vercel redesplegó y los `failCounts`/tokens en memoria se perdieron.

Arreglo:
1. Solo ocurre si el admin token se validara contra estado en memoria (actualmente solo valida existencia de cookie)
2. Si persiste: revisar `lib/admin-auth.ts:isAdminAuthenticated()` — debe solo chequear que `cookies().get('admin_session')` existe y no vencida por `maxAge`
3. Re-login cuando expire

### 🎯 Causa 5 — Token admin es débil (vulnerable a brute force)
Esto no causa "no accede" sino "cualquiera puede acceder". Ver [15_admin_login_vulnerable.md](15_admin_login_vulnerable.md).

### 🎯 Causa 6 — Redirect a locale incorrecto tras login
Contexto: si el usuario va a `/admin` sin locale, middleware redirige a `/es/admin` pero puede perder el path. Setear `NEXT_LOCALE` cookie o ir directo a `/es/admin`.

Arreglo:
1. Acceder siempre como `/es/admin` o `/en/admin`
2. Si persiste: revisar `middleware.ts` matcher

## Workaround mientras arreglas
Editar tasas directamente en Supabase Table Editor → `precios` → row → edit. Evita el admin panel hasta que esté arreglado.

## Relacionados
- [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — `NEXT_PUBLIC_CRON_SECRET` es un leak
- [15_admin_login_vulnerable.md](15_admin_login_vulnerable.md) — hardening de la sesión admin
- [LOGICA_DE_NEGOCIO/12_panel_admin.md](../LOGICA_DE_NEGOCIO/12_panel_admin.md) — flujo completo del admin
