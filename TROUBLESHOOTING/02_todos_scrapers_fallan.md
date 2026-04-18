# 02 — Todos los scrapers fallan al mismo tiempo

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 10-20 min

## Síntoma
`/es/admin` → Dashboard muestra los 7 operadores en **rojo**. Ningún precio se actualiza.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `SUPABASE_SERVICE_ROLE_KEY` faltante o inválida
Contexto: `lib/scrapers/base.ts:16-18` crea el cliente con esa key. Sin ella, `savePrices()` falla silenciosamente — el cron reporta `saved: 0` sin error explícito.

Arreglo:
1. Vercel → Settings → Environment Variables → verificar `SUPABASE_SERVICE_ROLE_KEY` en los 3 entornos (Production, Preview, Development)
2. Si falta o es inválida: Supabase → Settings → API → copiar `service_role` key (la que dice `secret`, NO la `anon`)
3. Pegar en Vercel, redesplegar (Vercel auto-redeploya al cambiar env vars)
4. `/es/admin` → "Ejecutar scrapers ahora"
5. Verificación: operadores vuelven a verde

### 🎯 Causa 2 — Cron de Vercel no está corriendo
Arreglo:
1. Vercel → Project → Settings → Cron Jobs → debe aparecer `/api/scrape` con schedule `0 7 * * *`
2. Si no aparece: `vercel.json` no se deployó — revisar que está en root del repo y tiene sintaxis válida
3. `cat vercel.json` local — debe ser:
   ```json
   { "crons": [{ "path": "/api/scrape", "schedule": "0 7 * * *" }] }
   ```
4. Git push commit vacío para forzar redeploy: `git commit --allow-empty -m "redeploy"` + `git push`
5. Verificación: Vercel dashboard → Cron Jobs → aparece la próxima ejecución

### 🎯 Causa 3 — `CRON_SECRET` faltante o mal configurado
Arreglo:
1. Ejecutar: `curl https://preenvios.vercel.app/api/scrape` (sin header)
2. Si responde `200` → **PROBLEMA CRÍTICO DE SEGURIDAD** — ver [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md)
3. Si responde `401` → normal, Vercel inyecta el header correcto en el cron real
4. Vercel → Settings → Environment Variables → verificar `CRON_SECRET` existe en Production
5. Si falta: generar uno fuerte (`openssl rand -hex 32`) y pegar en Vercel

### 🎯 Causa 4 — Supabase pausado o caído
Arreglo:
1. `curl https://dlblmquoasgoxnzclgyb.supabase.co/rest/v1/corredores -H "apikey: [ANON_KEY]"`
2. Si responde error: Supabase dashboard → ¿proyecto pausado? Click "Restore project"
3. Si dashboard dice "service unavailable": revisar https://status.supabase.com
4. Si keys cambiaron: rotar en Vercel + `.env.local`

### 🎯 Causa 5 — Cron timeout (maxDuration=300s excedido)
Contexto: `app/api/scrape/route.ts:36` tiene `maxDuration = 300`. 8 scrapers + envío de emails pueden exceder si la red está lenta.

Arreglo:
1. Vercel → Functions → `/api/scrape` → revisar last run duration
2. Si duración > 280s: considerar reducir cantidad de corredores por scraper o paralelizar
3. Workaround temporal: en `lib/scrapers/index.ts` correr scrapers en paralelo con `Promise.all` en vez de secuencial

## Workaround mientras arreglas
`/es/admin` → Tasas → actualizar manualmente los 7 operadores con tasas aproximadas del día. Los usuarios siguen viendo datos plausibles.

## Relacionados
- [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — si `/api/scrape` responde sin auth
- [06_supabase_errores.md](06_supabase_errores.md) — si Supabase no responde
- [05_vercel_deploy_falla.md](05_vercel_deploy_falla.md) — si el deploy falló
