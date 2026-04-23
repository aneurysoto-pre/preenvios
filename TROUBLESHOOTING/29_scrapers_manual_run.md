# 29 — Correr scrapers manualmente

## Gravedad · Tiempo al fix
🟢 Rutina, no es un problema — sirve para diagnosticar scrapers, forzar actualización de precios, o validar cambios post-deploy.
⏱ Tiempo típico: 5-10 min.

## ⚠️ Estado al 2026-04-23

Los 7 scrapers MVP están rotos desde 2026-04-17 (HTTP 401/403/404 por cambios en APIs internas de los operadores). El endpoint `/api/scrape` responde HTTP 200 pero devuelve `saved: 0` silenciosamente. **Este doc sirve para cuando los scrapers se reactiven** (post-LLC + partner APIs, ver [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](../LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md)). Mientras tanto es útil para diagnóstico (confirmar que los endpoints siguen rotos, medir timings, etc).

## Cuándo usar este doc

- Validar que un deploy nuevo no rompió el endpoint de scrapers.
- Forzar actualización inmediata de precios sin esperar al cron diario de las 7:00 AM UTC.
- Diagnosticar por qué un corredor o operador específico muestra data stale.
- Smoke test end-to-end del pipeline tras reactivar scrapers (post-LLC).

## Pre-requisitos

1. Tener acceso al valor de `CRON_SECRET` (Vercel → Settings → Environment Variables → `CRON_SECRET` → Reveal).
2. Tener acceso al SQL Editor de Supabase prod (proyecto `preenvios`) para verificaciones.
3. Tener acceso a Sentry (proyecto `javascript-nextjs`) para verificar anomalías.

## Paso 1 — Llamar al endpoint manualmente

```bash
# Reemplazá <CRON_SECRET> con el valor real (sin los <>).
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://preenvios.vercel.app/api/scrape
```

**Duración:** 1-3 minutos (7 scrapers × 6 corredores con rate limit 2s entre requests al mismo operador).

**Timeout máximo del endpoint:** 300s (5 min). Si tarda más, se corta con 504.

## Paso 2 — Leer el JSON de respuesta

**Esperado estructura:**

```json
{
  "timestamp": "2026-04-23T17:00:00.000Z",
  "scrapers": {
    "totalSaved": 42,
    "totalErrors": 0,
    "totalDuration_ms": 85000,
    "results": [
      { "operador": "wise", "saved": 6, "errors": [], "duration_ms": 12000 },
      { "operador": "ria", "saved": 6, "errors": [], "duration_ms": 14000 },
      ...
    ]
  }
}
```

**Interpretación:**

- `totalSaved` — precios guardados en tabla `precios` (esperado: ~42 = 7 operadores × 6 corredores).
- `totalErrors` — fallos técnicos (HTTP non-200, parsing errors).
- `results[i].saved` — por operador. Si es 0, ver `results[i].errors` para causa.
- `results[i].errors` — array de strings con el mensaje de error. Común:
  - `"wise: HTTP 401"` → auth cambió en el API del operador.
  - `"remitly: HTTP 404 — may need proxy"` → endpoint cambiado o IP bloqueada.
  - `"westernunion: HTTP 403 — likely needs proxy"` → Cloudflare bloqueando datacenter.
  - `"xoom: No rate in response"` → el JSON del operador cambió formato.

**Si `totalSaved=0` y `totalErrors=7`:** todos fallan. Ver [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md).

**Si `totalSaved=0` y `totalErrors=0`:** bug raro — scrapers devuelven arrays vacíos sin errores. Revisar código de cada scraper.

## Paso 3 — Verificar tabla `precios` en Supabase

Supabase Dashboard → proyecto `preenvios` (prod) → SQL Editor → New query:

```sql
-- Ver ultimas actualizaciones por corredor/operador
SELECT corredor, operador, tasa, fee, actualizado_en
FROM precios
WHERE activo = true AND metodo_entrega = 'bank'
ORDER BY actualizado_en DESC, corredor, operador
LIMIT 50;
```

**Esperado tras run exitoso:** las filas del operador que corrimos tienen `actualizado_en` con fecha de hoy (timestamp reciente).

**Si `actualizado_en` sigue siendo de fecha vieja post-run:** el scraper respondió `saved: 0` → no escribió. Ver Paso 2.

Query resumen por corredor:

```sql
SELECT corredor, COUNT(*) AS operadores, MAX(actualizado_en) AS ultima_actualizacion
FROM precios
WHERE activo = true AND metodo_entrega = 'bank'
GROUP BY corredor
ORDER BY ultima_actualizacion DESC;
```

**Esperado:** 6 filas (uno por corredor MVP), cada una con `operadores = 7` y `ultima_actualizacion` reciente.

## Paso 4 — Revisar anomalías rechazadas por el Agente 1

Si algún precio falló la validación del Agente 1 (ver [LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md](../LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md)), queda registrado en `scraper_anomalies`:

```sql
SELECT created_at, operador, corredor, campo_invalido, valor_recibido, mensaje
FROM scraper_anomalies
ORDER BY created_at DESC
LIMIT 20;
```

**Qué buscar:**

- Filas recientes (últimos 5 minutos del run) — el Agente 1 rechazó esas filas del scraper.
- `campo_invalido` típico: `tasa` (fuera de rango ±10% del banco central), `fee` (fuera de [0,50] USD), `metodo_entrega` (no está en enum bank/cash_pickup/home_delivery/mobile_wallet), etc.
- Si hay 3+ anomalías consecutivas del mismo par (operador, corredor) → el endpoint llama a `reportScraperFailure` que marca los precios del operador como stale (actualizado_en = '2000-01-01').

## Paso 5 — Revisar logs Vercel (últimos 30 min)

Vercel Dashboard → proyecto → **Functions** → filtrar `/api/scrape` → últimos 30 minutos.

**Qué buscar:**

- Status code del request manual (esperado: 200).
- Duración total (esperado: <300s).
- Console logs del runtime (los `console.error` aparecen ahí).

**Plan Hobby limitation:** solo muestra últimos 30 min. Si el run fue hace más, no hay log.

## Paso 6 — Revisar Sentry (opcional)

Sentry → proyecto `javascript-nextjs` → Issues → filtro Last 30 min + tag `scraper_anomaly` o similar.

**Qué buscar:**

- Eventos `scraper_anomaly` — cada uno corresponde a una fila rechazada por el Agente 1.
- Eventos `Error` (level error) — excepciones no capturadas en el runtime (raro).

## Workaround mientras arreglan los scrapers

Editar manualmente las tasas desde el panel admin (`/es/admin`) o vía SQL directo:

```sql
UPDATE precios
SET tasa = 25.10, actualizado_en = NOW()
WHERE operador = 'wise' AND corredor = 'honduras' AND metodo_entrega = 'bank';
```

Este workaround es el que se documenta como **Fase R0 (puente manual)** en el plan de reactivación de scrapers, ver [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](../LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md).

## Relacionados

- [01_scraper_individual_falla.md](01_scraper_individual_falla.md) — si solo 1 scraper falla, no todos.
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si totalSaved=0 en todos.
- [03_precios_stale_en_comparador.md](03_precios_stale_en_comparador.md) — síntoma visible al usuario.
- [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — si el endpoint responde 401 sin CRON_SECRET.
- [26_scraper_revierte_afiliado.md](26_scraper_revierte_afiliado.md) — bug conocido: scraper sobrescribe flag afiliado.
- `LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md` — decisión de diferir arreglo hasta post-LLC.
