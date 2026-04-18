# 08 — Tasas banco central vacías

## Gravedad · Tiempo al fix
🟢 Menor
⏱ Fix típico: 5-10 min

## Síntoma
Sección "Tasas de referencia" en el landing desaparece por completo, o muestra menos de 4 tarjetas, o dice "—" en la tasa.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Tabla `tasas_bancos_centrales` vacía en Supabase
Contexto: `components/TasasReferencia.tsx:60` hace `if (visibles.length === 0) return null` → sección entera desaparece sin error visible.

Arreglo:
1. Query:
   ```sql
   SELECT count(*) FROM tasas_bancos_centrales;
   ```
2. Si `count = 0`: cargar seeds. Ejecutar en Supabase SQL Editor los INSERTs documentados en `supabase/migrations/002_tasas_bancos_centrales.sql` o `scripts/seed-bancos-centrales.mjs`
3. Verificación: recargar landing, debe aparecer la sección

### 🎯 Causa 2 — Fetch a `/api/tasas-banco-central` falla
Contexto: `TasasReferencia.tsx:52-56` no tiene try/catch. Si la API devuelve 500, `setTasas` nunca se llama y la sección desaparece.

Arreglo:
1. `curl -i https://preenvios.vercel.app/api/tasas-banco-central`
2. Si 500: revisar error en Vercel Functions logs
3. Si RLS bloquea: ver [06_supabase_errores.md](06_supabase_errores.md) Causa 3
4. Si la tabla no existe: ver causa 4 de 06

### 🎯 Causa 3 — `codigo_pais` en DB no coincide con el esperado
Contexto: `TasasReferencia.tsx:29-33` tiene mapa `COUNTRY_FLAGS` y `COUNTRY_NAMES` con códigos `hn, do, gt, sv, co, mx, ni, ht`. Si la DB tiene `HN` (mayúsculas) o valores distintos, la tarjeta renderiza sin bandera/nombre.

Arreglo:
1. Query:
   ```sql
   SELECT DISTINCT codigo_pais FROM tasas_bancos_centrales;
   ```
2. Deben ser exactamente: `hn, do, gt, sv, co, mx, ni, ht` (minúsculas)
3. Si hay mismatch: `UPDATE tasas_bancos_centrales SET codigo_pais = lower(codigo_pais);`

### 🎯 Causa 4 — En página de país: `filterCodigoPais` no matchea
Contexto: en `/es/guatemala` se pasa `filterCodigoPais='gt'` (ver `lib/paises.ts`). Si no hay fila con `codigo_pais='gt'` la sección desaparece en esa página.

Arreglo:
1. Verificar que la fila de Guatemala existe en Supabase
2. Si no: insertar manualmente:
   ```sql
   INSERT INTO tasas_bancos_centrales (codigo_pais, moneda, nombre_banco, nombre_banco_en, siglas, tasa)
   VALUES ('gt', 'GTQ', 'Banco de Guatemala', 'Bank of Guatemala', 'BG', 7.75);
   ```

### 🎯 Causa 5 — Cache edge sirviendo `[]`
Contexto: `/api/tasas-banco-central` tiene `s-maxage=3600`. Si la API cacheó un `[]` por algún error transitorio, la sección queda vacía por 1 hora.

Arreglo:
1. Redesplegar: Vercel → Deployments → último Ready → `...` → Redeploy
2. O esperar 1 hora

## Workaround mientras arreglas
La sección desaparece limpiamente (no hay visual roto). El comparador sigue funcionando perfectamente. No hay acción urgente.

## Relacionados
- [06_supabase_errores.md](06_supabase_errores.md) — si la tabla tiene errores
- [LOGICA_DE_NEGOCIO/14_tasas_bancos_centrales.md](../LOGICA_DE_NEGOCIO/14_tasas_bancos_centrales.md) — flujo completo
