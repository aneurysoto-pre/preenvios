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
