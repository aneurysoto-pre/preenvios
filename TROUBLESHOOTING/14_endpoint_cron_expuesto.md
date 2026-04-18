# 14 — Endpoint cron expuesto (🔒 seguridad)

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 10 min

## Síntoma
Dos formas de detectarlo:
1. `curl https://preenvios.vercel.app/api/scrape` (sin header `Authorization`) devuelve 200 y corre los scrapers
2. Abrir `/es/admin` en Chrome → DevTools → Network → filtrar `dashboard` → en el request ves el header `Authorization: Bearer [valor_visible]`

Cualquiera de los dos significa que tu `CRON_SECRET` no protege nada y/o está expuesto al mundo.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `CRON_SECRET` undefined en Vercel → check se salta
Contexto: `app/api/scrape/route.ts:15-19`:
```ts
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```
Si `cronSecret === undefined`, la condición `cronSecret && ...` es falsy → NO retorna 401 → endpoint abierto.

Arreglo:
1. Vercel → Settings → Environment Variables → verificar que `CRON_SECRET` existe en **los 3 entornos**
2. Si falta: generar uno fuerte:
   ```bash
   openssl rand -hex 32
   ```
3. Pegar en Vercel
4. **CRÍTICO**: cambiar la lógica para que falle hard si falta la var. Editar `app/api/scrape/route.ts:15-19`:
   ```ts
   const cronSecret = process.env.CRON_SECRET
   if (!cronSecret) {
     return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
   }
   if (authHeader !== `Bearer ${cronSecret}`) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }
   ```
5. Commit + push
6. Verificación: `curl -i https://preenvios.vercel.app/api/scrape` sin header → debe devolver `401` (o `500` si aún falta la env var)

### 🎯 Causa 2 — `NEXT_PUBLIC_CRON_SECRET` exponiendo el secret al cliente
Contexto: `app/[locale]/admin/panel.tsx:54` envía `Authorization: Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`. El prefijo `NEXT_PUBLIC_` significa que Next.js inyecta el valor en el bundle JavaScript → cualquier visitante lo ve en DevTools.

Arreglo:
1. DevTools en `/es/admin` (sin estar logueado) → View Source → buscar `NEXT_PUBLIC_CRON_SECRET` — si aparece el valor, está filtrado
2. **FIX (recomendado)**: cambiar `/api/admin/dashboard/route.ts` para validar con sesión admin (cookie) en vez de `CRON_SECRET`:
   ```ts
   import { isAdminAuthenticated } from '@/lib/admin-auth'
   export async function GET() {
     if (!await isAdminAuthenticated()) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
     // resto del código
   }
   ```
3. En `panel.tsx:54`: quitar el header `Authorization`. Sin `NEXT_PUBLIC_CRON_SECRET` → remover de Vercel env vars:
   ```tsx
   const res = await fetch('/api/admin/dashboard', { credentials: 'include' })
   ```
4. Rotar el `CRON_SECRET` (generar nuevo, actualizar solo en server, no en `NEXT_PUBLIC_*`)
5. Commit + push
6. Verificación: ver el bundle en `/_next/static/chunks/*.js` — grep del valor viejo no debe aparecer

### 🎯 Causa 3 — Alguien ejecutó `/api/scrape` manualmente varias veces
Si (1) y (2) estaban mal, un atacante puede haber triggereado el cron N veces:
- Consumo innecesario de scrapers
- Abuso de Resend (emails duplicados a suscriptores)
- Costos de Vercel Functions

Arreglo:
1. Vercel → Functions → `/api/scrape` → revisar invocaciones de últimos días
2. Si hay ejecuciones fuera del horario 7 AM UTC: posible abuso
3. Rotar `CRON_SECRET` YA
4. Agregar rate limit en `/api/scrape` (máx 1 ejecución/hora) usando Upstash Redis o Vercel KV

## Workaround mientras arreglas
Quitar temporalmente el endpoint de cron del `vercel.json` hasta rotar el secret. Los scrapers no corren en ese lapso — actualizar manualmente desde admin.

## Relacionados
- [15_admin_login_vulnerable.md](15_admin_login_vulnerable.md) — problema relacionado de auth admin
- [10_admin_panel_no_accede.md](10_admin_panel_no_accede.md) — el fix de sesión admin también afecta aquí
