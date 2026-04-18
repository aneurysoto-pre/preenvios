# 09 — Gráficas históricas vacías

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
`/es/tasa/usd-dop` (o cualquier corredor) muestra gráfica Recharts vacía con mensaje "datos disponibles cuando scrapers estén activos". O peor: título muestra `"1 USD = -Infinity HNL"`.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Tabla `historial_tasas_publico` vacía (scraper no escribe)
Contexto: la tabla existe desde 2026-04-17 (SQL ejecutado) pero el cron `/api/scrape` NO escribe snapshots diarios. La tabla existe vacía porque el código aún no implementó la escritura.

Arreglo:
1. Query:
   ```sql
   SELECT count(*) FROM historial_tasas_publico;
   ```
2. Si `count = 0`: implementar escritura en el cron. Editar `app/api/scrape/route.ts` tras `runAllScrapers()`:
   ```ts
   import { createClient } from '@supabase/supabase-js'
   const supabaseAdmin = createClient(/* ... service_role */)
   const today = new Date().toISOString().slice(0, 10)

   for (const corredor of ['dominican_republic','honduras','guatemala','el_salvador','colombia','mexico','nicaragua','haiti']) {
     const { data } = await supabaseAdmin.from('precios').select('tasa').eq('corredor', corredor).eq('metodo_entrega', 'bank').eq('activo', true)
     if (!data || data.length === 0) continue
     const tasas = data.map(d => d.tasa).filter(Boolean)
     const promedio = tasas.reduce((a,b) => a+b, 0) / tasas.length
     await supabaseAdmin.from('historial_tasas_publico').upsert({
       corredor, fecha: today, tasa_promedio: promedio,
       tasa_mejor: Math.max(...tasas), tasa_peor: Math.min(...tasas),
     }, { onConflict: 'corredor,fecha' })
   }
   ```
3. Commit + push. Esperar siguiente cron o ejecutar manualmente desde admin
4. Verificación: query retorna count > 0

### 🎯 Causa 2 — Header muestra `"-Infinity"`
Contexto: `app/[locale]/tasa/[pair]/tasa-content.tsx:31` hace `Math.max(...precios.map(p=>p.tasa))`. Si `precios=[]`, devuelve `-Infinity`.

Arreglo:
1. Editar `tasa-content.tsx:30-34`:
   ```ts
   const bestRate = precios.length > 0 ? Math.max(...precios.map(p => p.tasa)) : 0
   ```
   ya existe esa guardia ✓
2. Pero si `precios` fetchea OK con data vacía, `bestRate=0` y el título muestra "1 USD = 0.00 HNL". Mejor mostrar "—":
   ```ts
   const bestRateDisplay = bestRate > 0 ? bestRate.toFixed(2) : '—'
   ```
3. Commit + push

### 🎯 Causa 3 — Fetch a `/api/historial-tasas` silencia error
Contexto: `app/api/historial-tasas/route.ts:24` retorna `[]` si hay error de Supabase. Útil para no romper la página pero oculta problemas reales.

Arreglo:
1. Vercel → Functions → `/api/historial-tasas` → logs
2. Si hay errores silenciados: quitar el fallback y loguear el error:
   ```ts
   if (error) { console.error('historial-tasas:', error); return NextResponse.json([]) }
   ```
3. Si la tabla no existe: ver causa 1 (aunque ya debería existir desde 2026-04-17)

### 🎯 Causa 4 — Gráfica Recharts con data pero mal formateada
Arreglo:
1. DevTools Network → `/api/historial-tasas?corredor=X` — ¿devuelve array?
2. Cada item debe tener `fecha` (string YYYY-MM-DD) y `tasa_promedio` (number)
3. Si formato correcto pero no renderiza: revisar que Recharts recibe el array en la prop `data` del `LineChart`

### 🎯 Causa 5 — Menos de 30 días de datos
Contexto: la gráfica dice "últimos 30 días" pero si la tabla tiene solo 3 días de snapshots, la gráfica renderiza esos 3 puntos. No es bug, es la realidad del tiempo.

Arreglo:
1. Esperar a que el cron acumule 30 días
2. O backfill manual en SQL con estimaciones:
   ```sql
   INSERT INTO historial_tasas_publico (corredor, fecha, tasa_promedio)
   SELECT 'dominican_republic', d, 60.12
   FROM generate_series(current_date - 29, current_date, '1 day') d
   ON CONFLICT DO NOTHING;
   ```

## Workaround mientras arreglas
El UI muestra "datos disponibles cuando scrapers estén activos" — es un mensaje limpio. Usuario entiende que es una feature en construcción.

## Relacionados
- [06_supabase_errores.md](06_supabase_errores.md) — errores de la tabla
- [LOGICA_DE_NEGOCIO/15_estructura_seo.md](../LOGICA_DE_NEGOCIO/15_estructura_seo.md) — flujo SEO completo
