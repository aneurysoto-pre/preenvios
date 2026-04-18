# 01 — Un scraper individual falla

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 15-30 min

## Síntoma
Un operador aparece **rojo** en `/es/admin` → Dashboard. Precios viejos en comparador para ese operador.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — HTML/API del operador cambió
Arreglo:
1. Abrir `https://www.[operador].com/us/en/[corredor]` en navegador → DevTools → Network → buscar requests de pricing
2. Comparar estructura de respuesta con el parser en `lib/scrapers/[operador].ts` (busca `data?.rate || data?.exchangeRate`)
3. Editar el parser: actualizar nombre de campos o URL del endpoint
4. Probar local: `curl [URL] -H "User-Agent: PreenviosBot/1.0 contact@preenvios.com"`
5. `git commit -m "fix: actualiza scraper [operador]"` + `git push`
6. Verificación: `/es/admin` → Dashboard → el operador vuelve a verde tras siguiente cron (7 AM UTC)

### 🎯 Causa 2 — 403/429 por anti-bot
Arreglo:
1. Ejecutar: `curl -v [URL] -H "User-Agent: PreenviosBot/1.0 contact@preenvios.com"`
2. Si responde 403/429 o HTML con captcha: protección activa
3. Contratar proxy (Bright Data o ScraperAPI, $10-30/mes)
4. Agregar `PROXY_URL` a Vercel env vars
5. Modificar `lib/scrapers/base.ts` para usar proxy en `fetch`
6. Verificación: re-ejecutar scraper desde `/es/admin` → "Ejecutar scrapers ahora"

### 🎯 Causa 3 — Web del operador caída
Arreglo:
1. Abrir la web en navegador — ¿carga?
2. `curl -s -o /dev/null -w "%{http_code}" [URL]` — ¿5xx?
3. Si está caída: esperar. El cron del día siguiente la reintenta
4. Verificación: siguiente cron marca el operador verde automáticamente

### 🎯 Causa 4 — Endpoint del API del operador mudó (404)
Arreglo:
1. DevTools → Network en la web del operador → buscar requests tipo `/api/pricing`, `/rates`, `/estimate`
2. Copiar nuevo endpoint
3. Actualizar URL en `lib/scrapers/[operador].ts`
4. Verificar formato nuevo de respuesta
5. `git commit` + `git push`

### 🎯 Causa 5 — `failCounts` no se resetea tras fix
Contexto: `lib/scrapers/base.ts:93-114` guarda contadores en memoria. Si el scraper falló 3 veces y lo marcaste `stale` con `actualizado_en = 2000-01-01`, tras arreglarlo hay que forzar un update.

Arreglo:
1. `/es/admin` → Dashboard → "Ejecutar scrapers ahora"
2. Si sigue rojo: en SQL Editor de Supabase:
   ```sql
   UPDATE precios SET actualizado_en = now()
   WHERE operador = '[slug]' AND corredor = '[corredor]';
   ```

## Workaround mientras arreglas
`/es/admin` → Tasas → editar tasa y fee a mano del operador roto. Los usuarios siguen viendo datos válidos.

## Relacionados
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si más de un operador cae simultáneamente
- [03_precios_stale_en_comparador.md](03_precios_stale_en_comparador.md) — si el scraper corre ok pero los datos se ven viejos
- [LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md](../LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md) — flujo completo
