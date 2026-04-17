# Proceso 08 — Scrapers automáticos de tasas

## Descripción

Sistema de 7 scrapers que obtienen tasas de cambio y comisiones de cada remesadora para los 4 corredores. Ejecutan cada 2 horas via Vercel Cron Job. Incluyen rate limiting, User-Agent identificable, y sistema de fallback cuando un scraper falla.

Completado el 2026-04-16 como parte de Fase 2.

## Pasos del flujo

### 1. Ejecución automática
1. Vercel Cron Job ejecuta `GET /api/scrape` cada 2 horas (config en `vercel.json`)
2. El endpoint está protegido por `CRON_SECRET` — solo Vercel puede invocarlo
3. El orquestador (`lib/scrapers/index.ts`) ejecuta los 7 scrapers en secuencia

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
| `vercel.json` | Cron schedule cada 2 horas |

## Pendiente de acción del usuario
- Upstash Redis (crear cuenta, proveer keys)
- Proxies rotativos (si WU/Remitly bloquean)
- Backups Supabase (crear cuenta Backblaze B2)
- UptimeRobot (crear cuenta gratuita)

## Relacionado
- Ver flujo end-to-end de precios: [LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md](13_flujo_precios_end_to_end.md)
- Resolución de problemas de un scraper: [TROUBLESHOOTING/01_scraper_individual_falla.md](../TROUBLESHOOTING/01_scraper_individual_falla.md)
- Resolución cuando todos fallan: [TROUBLESHOOTING/02_todos_scrapers_fallan.md](../TROUBLESHOOTING/02_todos_scrapers_fallan.md)
