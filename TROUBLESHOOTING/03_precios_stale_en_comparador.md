# 03 — Precios stale en el comparador

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-15 min

## Síntoma
El precio en PreEnvios no coincide con el de la web del operador. Admin dice verde pero los datos están viejos.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Cache del API sirviendo datos viejos
Contexto: `/api/precios` tiene `Cache-Control: s-maxage=300` (5 min). Tras actualizar Supabase, el cache edge puede servir datos cacheados hasta 5 min más.

Arreglo:
1. Esperar 5 min
2. Bypass cache: navegar a `https://preenvios.vercel.app/api/precios?corredor=dominican_republic&metodo=bank&t=[timestamp]`
3. Para purgar cache global: Vercel → Deployments → "Redeploy" (sin rebuild)
4. Verificación: página de comparador muestra precios nuevos

### 🎯 Causa 2 — Scrapers no corrieron desde ayer
Contexto: `vercel.json` tiene `"schedule": "0 7 * * *"` (una vez al día en plan Hobby). Si la tasa cambió a las 10 AM UTC, el siguiente update es al día siguiente 7 AM.

Arreglo:
1. `/es/admin` → Dashboard → "Ejecutar scrapers ahora" (fuerza un run manual)
2. Esperar 60-90 segundos a que termine
3. Refrescar comparador
4. Verificación: `actualizado_en` en Supabase cambió a `now()`
5. Upgrade a Vercel Pro permite cron cada 2h (`0 */2 * * *`)

### 🎯 Causa 3 — Scraper extrae dato incorrecto (parse silencioso)
Contexto: `lib/scrapers/[operador].ts` asume `data?.rate || data?.exchangeRate`. Si el operador renombró el campo a `quotedRate`, el scraper guarda `null` y el API lo filtra.

Arreglo:
1. `curl -s https://preenvios.vercel.app/api/precios?corredor=[X]&metodo=bank | jq .`
2. Si falta un operador que debería estar: su `tasa` es `null` en DB
3. Query en Supabase: `SELECT * FROM precios WHERE operador='[X]' AND tasa IS NULL;`
4. Ir a [01_scraper_individual_falla.md](01_scraper_individual_falla.md) Causa 1

### 🎯 Causa 4 — Operador muestra tasa distinta según monto
Contexto: el scraper simula envío de $200. Si el usuario busca $1000, puede ver una tasa distinta a la que el operador ofrece a esa cantidad.

Arreglo:
1. Abrir la web del operador, simular envío del monto que el usuario consultó
2. Si difiere de lo mostrado en PreEnvios: es comportamiento correcto (disclaimer #1 cubre esto)
3. Si quieres scraping por tiers de monto: modificar scraper para consultar múltiples amounts y guardar por tier

### 🎯 Causa 5 — Dato correcto en Supabase pero ranking lo baja
Contexto: `lib/ranking.ts` pondera 5 criterios. A veces la mejor tasa NO sale primero porque el algoritmo premia velocidad o afiliado.

Arreglo:
1. `/es/admin` → Ingresos → revisar qué operador está primero y por qué
2. Si quieres cambiar pesos: `lib/ranking.ts` líneas con `WEIGHTS = {...}`
3. Explicar al usuario vía `/metodologia`: 5 criterios documentados

## Workaround mientras arreglas
Disclaimer #1 en cada tarjeta ya dice "las tasas son aproximadas". No hay acción urgente — usuario tiene la expectativa correcta.

## Relacionados
- [01_scraper_individual_falla.md](01_scraper_individual_falla.md) — si el scraper trae dato incorrecto
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si ningún scraper corre
