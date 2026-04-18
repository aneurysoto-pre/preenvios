# Troubleshooting 06 — Errores de Supabase

## Síntomas
- El comparador no muestra resultados o muestra error
- Las APIs devuelven `{"error": "..."}` con status 500
- El panel admin no puede leer ni escribir precios

## Causas comunes

### Causa 1: API key expirada o incorrecta
**Diagnóstico:**
1. Probar: `curl https://dlblmquoasgoxnzclgyb.supabase.co/rest/v1/corredores -H "apikey: [TU_ANON_KEY]"`
2. Si devuelve 401 → key incorrecta o expirada

**Solución:**
1. Supabase dashboard → Settings → API → copiar nueva anon key
2. Actualizar en: `.env.local`, Vercel env vars, GitHub Secrets

### Causa 2: Row Level Security (RLS) bloqueando
**Diagnóstico:**
1. La lectura con anon key funciona pero la escritura falla
2. Error: "new row violates row-level security policy"

**Solución:**
1. Las tablas tienen política `public_read` — lectura siempre funciona con anon key
2. La escritura requiere service_role key — verificar que los scrapers y panel admin la usan
3. Si necesitas crear nueva política: Supabase dashboard → Authentication → Policies

### Causa 3: Tabla no existe o columna faltante
**Diagnóstico:**
1. Error: "relation 'precios' does not exist" o "column X does not exist"

**Solución:**
1. Supabase dashboard → SQL Editor → ejecutar la migración `supabase/migrations/001_create_tables.sql`
2. Si se agregó columna nueva: crear migración SQL y ejecutar

### Causa 4: Proyecto Supabase pausado (plan gratuito)
**Diagnóstico:**
1. Supabase pausa proyectos inactivos en el plan gratuito después de 7 días sin actividad
2. Todas las requests devuelven error

**Solución:**
1. Supabase dashboard → click en el proyecto → "Restore project"
2. Considerar plan Pro ($25/mes) cuando haya tráfico real

### Causa 5: Límite de requests excedido
**Diagnóstico:**
1. Error 429 (Too Many Requests) de Supabase
2. Plan gratuito tiene límites de requests por minuto

**Solución:**
1. Implementar Upstash Redis como cache (diferido — Fase 2)
2. Verificar que el API route tiene `Cache-Control: s-maxage=300`
3. Considerar plan Pro de Supabase

## Proceso paso a paso
```
1. ¿Qué error exacto devuelve? (revisar Network tab o Vercel logs)
2. curl directo a Supabase REST API → ¿responde?
3. Si 401 → keys incorrectas
4. Si 403 → RLS bloqueando (usa service_role para escritura)
5. Si 500 → tabla/columna no existe
6. Si todo falla → verificar que proyecto no está pausado
```

---

## Errores relacionados con tablas `suscriptores_free` e `historial_tasas_publico`

Ambas tablas se crearon el 2026-04-17 con índices y RLS habilitado. Si algo falla en el flujo de alertas gratis o en las gráficas de 30 días, este es el orden de verificación.

### Síntomas posibles
- El formulario de suscripción devuelve error 500 al enviar email
- El email de confirmación nunca llega al usuario
- La página `/[locale]/tasa/usd-dop` muestra gráfica vacía aunque el scraper corrió
- `/api/historial-tasas?corredor=X` devuelve array vacío
- `/api/suscripcion-free` devuelve "Error interno" al hacer POST
- El cron diario del scraper corre pero no se envían emails a suscriptores confirmados

### Causas posibles a revisar en orden

**1. Verificar que las tablas existen en Supabase Table Editor**
Ve a Supabase dashboard → Table Editor → busca `suscriptores_free` e `historial_tasas_publico` en la lista. Si alguna no aparece, volver a correr el SQL del README.

**2. Verificar que RLS está habilitado y la policy de SELECT pública existe**
Supabase dashboard → Authentication → Policies. Debe haber:
- `suscriptores_public_read` sobre `suscriptores_free` (FOR SELECT, USING true)
- `historial_public_read` sobre `historial_tasas_publico` (FOR SELECT, USING true)

**3. Verificar que el backend usa `SUPABASE_SERVICE_ROLE_KEY` (no la anon key) para escribir**
En `lib/email-alerts.ts` y `app/api/suscripcion-free/route.ts` el cliente se crea con `process.env.SUPABASE_SERVICE_ROLE_KEY`. Si faltara o estuviera mal, las writes fallan con error 403 "new row violates row-level security policy".

**4. Verificar que el cron de scrapers está escribiendo en `historial_tasas_publico`**
Actualmente `/api/scrape` actualiza la tabla `precios` pero NO escribe snapshots en `historial_tasas_publico` (pendiente de implementar). Sin eso, la gráfica de 30 días queda vacía aunque los precios actuales funcionen. Revisar logs de Vercel → Functions → `/api/scrape` para ver si hay error al escribir.

**5. Verificar que los índices existen**
Query en Supabase SQL Editor:
```sql
SELECT indexname FROM pg_indexes
WHERE tablename IN ('suscriptores_free', 'historial_tasas_publico');
```
Deben aparecer: `idx_suscriptores_free_token_confirmacion`, `idx_suscriptores_free_token_baja`, `idx_suscriptores_free_confirmado_activo`, `idx_suscriptores_free_corredor`, `idx_historial_tasas_corredor_fecha`.

**6. Confirmar que la variable `SUPABASE_SERVICE_ROLE_KEY` está en Vercel Environment Variables**
Vercel dashboard → Project → Settings → Environment Variables. Debe estar en los 3 entornos (Production, Preview, Development). Si se agregó después del último deploy, redesplegar para que tome efecto.

### Query de verificación rápida

Pegar en SQL Editor de Supabase:

```sql
-- Conteo de filas por tabla
SELECT count(*) FROM suscriptores_free;
SELECT count(*) FROM historial_tasas_publico;

-- Verificar policies activas
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('suscriptores_free', 'historial_tasas_publico');
```

Resultado esperado:
- Ambos counts pueden ser 0 si la tabla es nueva — eso es normal, no es error
- Deben aparecer 2 policies, una por cada tabla
