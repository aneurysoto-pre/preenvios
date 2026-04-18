# 06 — Supabase errores generales

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-20 min

## Síntoma
APIs devuelven 500 con `{"error": "..."}`, comparador no carga, panel admin no puede leer/escribir precios.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Proyecto Supabase pausado (plan gratuito)
Contexto: Supabase pausa proyectos sin actividad por 7 días en el plan Free. Todas las APIs empiezan a fallar simultáneamente.

Arreglo:
1. Supabase dashboard → proyecto — ¿banner "paused"?
2. Click "Restore project" — tarda 1-2 min en volver
3. Verificación: `curl https://dlblmquoasgoxnzclgyb.supabase.co/rest/v1/corredores -H "apikey: [ANON_KEY]"` devuelve 200
4. Considerar upgrade a Pro ($25/mes) cuando haya tráfico real

### 🎯 Causa 2 — API key expirada o incorrecta
Arreglo:
1. Supabase → Settings → API → verificar URL y keys actuales
2. Comparar con Vercel → Settings → Environment Variables
3. Si difieren: actualizar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Actualizar también `.env.local` local
5. Redesplegar Vercel

### 🎯 Causa 3 — RLS bloqueando escritura
Contexto: las tablas tienen policy `SELECT USING (true)` pero sin policy de INSERT/UPDATE/DELETE. Las writes requieren `SUPABASE_SERVICE_ROLE_KEY` que bypasea RLS.

Arreglo:
1. Error típico: `new row violates row-level security policy for table "precios"`
2. Verificar que el código use `supabaseAdmin` (con `SERVICE_ROLE_KEY`), NO `supabase` (con `ANON_KEY`)
3. Archivos que escriben:
   - `lib/scrapers/base.ts:16-18` → `supabaseAdmin` ✓
   - `app/api/suscripcion-free/route.ts:6-9` → `supabaseAdmin` ✓
   - `app/api/admin/precios/route.ts` → `supabaseAdmin` ✓
4. Si algún archivo nuevo escribe con `supabase` (anon), cambiarlo a `supabaseAdmin`

### 🎯 Causa 4 — Tabla no existe o columna faltante
Arreglo:
1. Error típico: `relation "X" does not exist` o `column "Y" does not exist`
2. Supabase → Table Editor → verificar que la tabla existe
3. Si falta: ejecutar el SQL de la migración correspondiente:
   - `supabase/migrations/001_create_tables.sql` (corredores, precios)
   - `supabase/migrations/002_tasas_bancos_centrales.sql`
   - SQL de `suscriptores_free` e `historial_tasas_publico` (documentado en `LOGICA_DE_NEGOCIO/16_alertas_gratis.md` y `15_estructura_seo.md`)

### 🎯 Causa 5 — Rate limit excedido (429)
Arreglo:
1. Error: HTTP 429 en logs de Vercel
2. Workaround: verificar que endpoints tienen `Cache-Control` agresivo (`s-maxage=300+`)
3. Solución: activar Upstash Redis como cache entre Vercel y Supabase (diferido Fase 2)
4. O upgrade a Supabase Pro

## Hardening recomendado (no es bug, es diseño)

Las policies RLS actuales tienen solo `SELECT USING (true)` y dependen de que `SERVICE_ROLE_KEY` no se filtre jamás. Si se filtra → full access a DB. Para endurecer:

```sql
-- Para tablas donde nadie debería escribir desde el cliente (precios, corredores):
CREATE POLICY "no_writes" ON precios FOR ALL USING (false) WITH CHECK (false);
```

Con esto aunque `SERVICE_ROLE_KEY` se filtre, la policy bloquea writes desde queries normales. El backend sigue funcionando porque `service_role` bypasea policies `FOR ALL`.

## Workaround mientras arreglas
Si Supabase está caído: `/es/admin` → Tasas permite ver lo que estaba en la última cache del API. El comparador sigue funcionando con datos del cache de 5 min.

## Relacionados
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si Supabase caído tumba los scrapers
- [07_alertas_email_no_llegan.md](07_alertas_email_no_llegan.md) — errores específicos de `suscriptores_free`
- [09_graficas_historicas_vacias.md](09_graficas_historicas_vacias.md) — errores específicos de `historial_tasas_publico`
