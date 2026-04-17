# Troubleshooting 02 — Todos los scrapers fallan al mismo tiempo

## Síntomas
- Panel admin muestra TODOS los operadores en rojo
- `/api/admin/dashboard` reporta `healthy: false` con 7 operadores en `staleOperators`
- El cron no parece estar ejecutando

## Causas comunes

### Causa 1: Cron job de Vercel no está ejecutando
**Diagnóstico:**
1. Vercel dashboard → proyecto → Settings → Cron Jobs → verificar que `/api/scrape` aparece con schedule `0 */2 * * *`
2. Si no aparece: `vercel.json` no se deployó correctamente

**Solución:**
1. Verificar que `vercel.json` existe en la raíz con el cron config
2. Re-deployar: push un commit a main

### Causa 2: CRON_SECRET mal configurado
**Diagnóstico:**
1. Llamar manualmente: `curl https://preenvios.vercel.app/api/scrape`
2. Si devuelve 401 → el CRON_SECRET no coincide
3. Vercel inyecta automáticamente el header `authorization` con el CRON_SECRET de sus env vars

**Solución:**
1. Vercel → Settings → Environment Variables → verificar que `CRON_SECRET` existe
2. Si no existe: agregar con cualquier valor seguro

### Causa 3: Supabase caído o credenciales expiradas
**Diagnóstico:**
1. Probar: `curl https://dlblmquoasgoxnzclgyb.supabase.co/rest/v1/corredores -H "apikey: [ANON_KEY]"`
2. Si devuelve error → Supabase está caído o las keys cambiaron
3. Verificar en supabase.com/dashboard que el proyecto está activo

**Solución:**
1. Si keys cambiaron: actualizar en Vercel env vars + .env.local
2. Si Supabase caído: esperar — revisa status.supabase.com

### Causa 4: Problema de red en Vercel
**Diagnóstico:**
1. Vercel Functions logs muestran timeout o connection refused en TODOS los scrapers
2. No es un operador específico, es todo

**Solución:**
1. Esperar — Vercel tiene SLA alto, raramente cae
2. Si persiste: re-deployar, verificar region del deploy

## Proceso paso a paso
```
1. Panel admin → ¿todos rojos?
2. Vercel dashboard → Deployments → ¿último deploy exitoso?
3. Vercel → Settings → Cron Jobs → ¿configurado?
4. curl /api/scrape manualmente → ¿401 o error?
5. curl Supabase directamente → ¿responde?
6. Si Supabase OK y Vercel OK → re-deployar
7. Si Supabase caído → esperar
8. Mientras tanto: actualizar precios manualmente en admin → Tasas
```
