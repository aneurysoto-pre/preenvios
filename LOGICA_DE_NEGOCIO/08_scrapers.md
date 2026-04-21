# Proceso 08 — Scrapers automáticos de tasas

## Descripción

Sistema de 7 scrapers que obtienen tasas de cambio y comisiones de cada remesadora para los 4 corredores. Ejecutan una vez al día a las 7:00 AM UTC via Vercel Cron Job. Incluyen rate limiting, User-Agent identificable, y sistema de fallback cuando un scraper falla.

Completado el 2026-04-16 como parte de Fase 2.

## Pasos del flujo

### 1. Ejecución automática
1. Vercel Cron Job ejecuta `GET /api/scrape` una vez al día a las 7:00 AM UTC (TEMPORAL — Vercel Hobby plan solo permite 1 cron/día. Al activar Vercel Pro se volverá a cada 2 horas según el diseño original)
2. El endpoint está protegido por `CRON_SECRET` — solo Vercel puede invocarlo
3. El orquestador (`lib/scrapers/index.ts`) ejecuta los 7 scrapers en secuencia
4. El admin también puede ejecutar scrapers manualmente desde el panel admin → "Ejecutar scrapers ahora"

### 2. Orden de ejecución
1. Wise (API semi-pública — más confiable)
2. Ria
3. Xoom
4. WorldRemit
5. Remitly (protección alta)
6. MoneyGram (protección media)
7. Western Union (protección alta)

### 3. Rate limiting por operador
- Mínimo 2 segundos entre requests al mismo operador
- `rateLimitDelay(operador)` espera si el último request fue hace menos de 2s
- Timestamps trackeados en `lastRequestTime` por operador

### 4. User-Agent identificable
Todos los scrapers envían: `PreenviosBot/1.0 contact@preenvios.com`

### 5. Flujo de cada scraper
1. Para cada corredor (HN, DO, GT, SV):
   a. Espera rate limit delay
   b. Hace fetch al endpoint de pricing del operador
   c. Extrae tasa, fee del JSON de respuesta
   d. Si éxito: acumula el precio
   e. Si falla: llama `reportScraperFailure(operador, error)` y retorna
2. Si todos los corredores fueron exitosos: llama `savePrices(prices)` → upsert en Supabase
3. Reset del contador de fallos para ese operador

### 6. Sistema de fallback (3 strikes)
- Cada fallo incrementa contador por operador
- Al 3er fallo consecutivo: marca TODOS los precios del operador como "desactualizados" (actualizado_en = 2000-01-01)
- El dashboard `/api/admin/dashboard` reporta operadores con datos desactualizados
- El sitio nunca muestra datos rotos — solo datos viejos marcados

### 6bis. Regla: el scraper NO debe sobreescribir metadata de afiliado (2026-04-18)

`savePrices()` hace `upsert` pasando TODAS las columnas del objeto `ScrapedPrice`, incluyendo `afiliado`, `link`, `rating`, `reviews`, `confiabilidad`, `metodos_disponibles`. Si un scraper hardcodea valores obsoletos (ej. `afiliado: false, link: ''`), cada corrida del cron REVIERTE cualquier cambio manual hecho via admin o SQL migration.

**Bug real de 2026-04-18:** `lib/scrapers/moneygram.ts` y `westernunion.ts` tenían `afiliado: false, link: ''` hardcoded. Tras ejecutar SQL 005 que flipeó `afiliado=true`, el próximo cron lo revirtió. El botón de MG volvió a mostrar "Ver en sitio" gris.

**Regla del proyecto:** los valores de `afiliado`, `link` y demás metadata en cada scraper deben coincidir con lo que admin espera. Cuando cambie el estado de afiliado de un operador:
1. Actualizar la SQL (o admin panel)
2. Actualizar el valor hardcoded en `lib/scrapers/<operador>.ts`
3. Si no se actualizan ambos, el scraper revierte en la siguiente corrida

**Safety net — normalizeAffiliate en /api/precios** (2026-04-18): el endpoint normaliza la respuesta antes de devolverla. Para operadores en `PENDING_AFFILIATES` (actualmente WU y MG) se fuerza `afiliado=true` y `link=<dominio público>` si la DB los tiene vacíos. Esto asegura que la UI nunca muestre un botón gris por bug de scraper o cache stale.

Ver detalles completos en [TROUBLESHOOTING/26_scraper_revierte_afiliado.md](../TROUBLESHOOTING/26_scraper_revierte_afiliado.md).

### 6ter. Estrategia de 4 tiers de data sourcing (industria) — BLOQUEANTE PRE-LANZAMIENTO

El scraping NO es el estándar de la industria para comparadores de remesas. Los grandes (Monito) usan mezcla. La ruta de madurez correcta, en orden de preferencia:

| Tier | Fuente | Estado PreEnvios hoy | Cost | Quién lo usa en la industria |
|------|--------|---------------------|------|-----------------------------|
| 1 | **APIs oficiales** de cada remesadora (B2B partnership) | ❌ No disponible — requiere volumen | Free con contrato | Monito core |
| 2 | **Feeds de redes de afiliados** (Impact, CJ, Partnerize, FlexOffers) | 🟡 En pipeline — Payoneer pendiente, luego CJ/Impact/Partnerize | Free (aprobado como publisher) | Todos los comparadores serios |
| 3 | **Scraping + proxies rotativos** | ✅ Implementado (Tier 3a — sin proxy todavía, usando rotación natural de IPs de Vercel) | $3-30/mes (Webshare/ScraperAPI) | Comparadores chicos/medianos |
| 4 | **Wise API pública gratuita** | ❌ No integrado (pero es gratis, no requiere aprobación) | $0 | Cualquiera |

**Estado actual por operador (2026-04-21):**
- Wise → Tier 3 (scraper). Debería migrar a Tier 4 (API pública `api.wise.com/v1/rates`) antes del cutover
- Xoom, Ria, WorldRemit → Tier 3 (scraper). Migran a Tier 2 cuando CJ Affiliate esté aprobado (requiere Payoneer primero)
- Remitly → Tier 3 (scraper, protección alta). Migra a Tier 2 cuando Impact.com esté aprobado
- Western Union, MoneyGram → Tier 3 (scraper, protección alta). Migra a Tier 2 cuando CJ + FlexOffers estén aprobados

**Ruta de madurez esperada:**

```
Hoy (pre-lanzamiento):
  7/7 operadores dependen de scraping Tier 3
  Riesgo: bloqueo de WU/Remitly → landing rota

Mes 1-3 post-lanzamiento (con CJ + Impact + Partnerize aprobados):
  4-5/7 via Tier 2 (affiliate feeds)
  2-3/7 via Tier 3 (con Webshare $3/mes como fallback)
  1/7 (Wise) via Tier 4 (API pública)
  Riesgo: bajo

Mes 6-12 (con volumen demostrable):
  Negociación B2B con Remitly/WU → Tier 1 parcial
  Tier 3 reducido a operadores edge-case
```

**Criterio bloqueante pre-lanzamiento (ver CHECKLIST § 7.4):** los 7 operadores deben estar en estado verificable:
- (a) Scraper funciona consistentemente tras 3-5 días de cron corriendo, o
- (b) Scraper falla pero hay affiliate feed listo, o
- (c) Scraper falla sin workaround → operador se oculta del sitio hasta resolver

**Proxies rotativos — cuándo contratar:**
- El detector `reportScraperFailure` en [lib/scrapers/base.ts:101](../lib/scrapers/base.ts#L101) marca stale tras 3 fallos seguidos. Si algún operador MVP pasa a stale en producción, activar Webshare ($3/mes) y configurar `PROXY_URL` env var.
- Ver sección 18 en [SERVICIOS_EXTERNOS_DETALLE.md](../SERVICIOS_EXTERNOS_DETALLE.md) para comparación de proveedores.

### 7. Dashboard admin
`GET /api/admin/dashboard` (protegido por CRON_SECRET):
- Total de precios activos
- Último update por operador
- Lista de operadores con datos stale (más de 2 horas sin actualizar)
- Flag `healthy: true/false`

## Archivos

| Archivo | Qué hace |
|---------|----------|
| `lib/scrapers/base.ts` | Rate limiting, User-Agent, savePrices, fallback |
| `lib/scrapers/wise.ts` | Scraper Wise (API semi-pública) |
| `lib/scrapers/ria.ts` | Scraper Ria |
| `lib/scrapers/remitly.ts` | Scraper Remitly |
| `lib/scrapers/xoom.ts` | Scraper Xoom |
| `lib/scrapers/worldremit.ts` | Scraper WorldRemit |
| `lib/scrapers/westernunion.ts` | Scraper Western Union |
| `lib/scrapers/moneygram.ts` | Scraper MoneyGram |
| `lib/scrapers/bossmoney.ts` | Placeholder Fase 4 |
| `lib/scrapers/index.ts` | Orquestador |
| `app/api/scrape/route.ts` | Cron endpoint |
| `app/api/admin/dashboard/route.ts` | Dashboard admin |
| `vercel.json` | Cron schedule una vez al día a las 7:00 AM UTC |

## Pendiente de acción del usuario
- Upstash Redis (crear cuenta, proveer keys)
- Proxies rotativos (si WU/Remitly bloquean)
- Backups Supabase (crear cuenta Backblaze B2)
- UptimeRobot (crear cuenta gratuita)

## Relacionado
- Ver flujo end-to-end de precios: [LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md](13_flujo_precios_end_to_end.md)
- Resolución de problemas de un scraper: [TROUBLESHOOTING/01_scraper_individual_falla.md](../TROUBLESHOOTING/01_scraper_individual_falla.md)
- Resolución cuando todos fallan: [TROUBLESHOOTING/02_todos_scrapers_fallan.md](../TROUBLESHOOTING/02_todos_scrapers_fallan.md)
