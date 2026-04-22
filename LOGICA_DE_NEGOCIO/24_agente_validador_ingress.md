# Proceso 24 — Agente 1: Validador de ingress en scrapers

## Descripción

Primera capa del stack defense-in-depth (Fase 7 del `CONTEXTO_FINAL.md`). Garantiza que ningún scraper pueda corromper la tabla `precios` con data inválida. La validación ocurre a nivel **arquitectónico** — en el *write boundary* entre los scrapers y Supabase — no como monitoreo posterior.

**Estado:** implementado 2026-04-22 (bloqueante pre-lanzamiento levantado).

**Archivos principales:**
- `lib/scrapers/validator.ts` — lógica pura + I/O aislado
- `lib/scrapers/base.ts` — integración en `savePrices()`
- `supabase/migrations/007_scraper_anomalies.sql` — tabla para registro + counter serverless-safe

---

## Reglas de validación

Cada fila (`ScrapedPrice`) producida por un scraper se evalúa contra 7 reglas antes del upsert a `precios`. **Fallar cualquier regla → fila rechazada, NO se escribe en DB.**

| # | Regla | Fuente | Ejemplo rechazo |
|---|-------|--------|-----------------|
| 1 | `operador` ∈ whitelist de 7 MVP (remitly, wise, xoom, ria, worldremit, westernunion, moneygram) | Hardcoded en `validator.ts` | `operador='paypal'` → rechazo |
| 2 | `corredor` ∈ whitelist de 6 MVP (honduras, dominican_republic, guatemala, el_salvador, colombia, mexico) | Hardcoded en `validator.ts` | `corredor='nicaragua'` → rechazo |
| 3 | `metodo_entrega` ∈ {bank, cash_pickup, home_delivery, mobile_wallet} | Hardcoded en `validator.ts` | `metodo_entrega='delivery'` → rechazo |
| 4 | `velocidad` ∈ {Segundos, Minutos, Horas, Días} (con tildes) | Hardcoded en `validator.ts` | `velocidad='Fast'` → rechazo |
| 5 | `fee` ∈ [0, 50] USD (fuera es outlier) | Hardcoded en `validator.ts` | `fee=200` → rechazo |
| 6 | `tasa` > 0 (defensivo básico) | Hardcoded en `validator.ts` | `tasa=0` o `tasa=null` → rechazo |
| 7 | `tasa` dentro de ±10% de la tasa banco central correspondiente | `tasas_bancos_centrales` (cache) + fallback hardcoded | `tasa=45` con DOP base 60.50 → rechazo (min=54.45) |

**Orden de evaluación:** las 7 reglas se corren en paralelo lógico (no short-circuit). Si una fila falla 3 reglas, se registran 3 filas en `scraper_anomalies` — una por `campo_invalido`. Esto facilita debugging.

### Bounds de tasa por corredor (fallback si `tasas_bancos_centrales` está vacía)

| Corredor | Moneda | Base | Tolerancia | Rango válido |
|----------|--------|------|------------|--------------|
| honduras | HNL | 24.85 | ±10% | 22.37 – 27.34 |
| dominican_republic | DOP | 60.50 | ±10% | 54.45 – 66.55 |
| guatemala | GTQ | 7.75 | ±10% | 6.98 – 8.53 |
| el_salvador | USD | 1.00 | **0** (dolarizado) | exactamente 1.00 |
| colombia | COP | 4150.00 | ±10% | 3735 – 4565 |
| mexico | MXN | 17.15 | ±10% | 15.44 – 18.87 |

El Salvador usa dólar americano desde 2001 — el sucre salvadoreño (SVC) está desmonetizado y NO figura en este documento ni en el código. La tolerancia 0 refleja que en USD→USD no hay conversión.

---

## Decisiones de diseño

### 1. Whitelist estricta de 6 corredores MVP

**Decisión del founder 2026-04-22:** el validador solo acepta los 6 corredores activos en UI pública. Cualquier otro (Nicaragua, Haití, Perú, Ecuador, etc.) se rechaza.

**Por qué:** los scrapers antiguos incluían `nicaragua` y `haiti` en sus arrays `CORREDORES`. Esos registros quedaron en DB como data dormida pero el producto no los expone. Permitir que el validador los acepte significa que el scraper los seguiría actualizando con data no verificada — creando "estado oculto" que viola el principio de que solo existan en DB los corredores del MVP.

**Cuándo actualizar:** cuando se agrega un corredor nuevo al MVP (proceso completo en `11_nuevos_corredores.md`), paso 3 del flujo es agregar el corredor a esta whitelist.

### 2. Cache de tasas banco central en memoria (por batch)

**Problema:** si consultamos `tasas_bancos_centrales` por cada fila validada (7 operadores × 6 corredores = 42 filas por batch → 42 queries), se degrada el rendimiento de `/api/scrape`.

**Solución:** `loadBancoCentralCache()` hace 1 query al inicio de cada invocación de `savePrices()` y devuelve un `Map<codigo_pais, tasa>`. Las 42 validaciones siguientes usan O(1) lookups sin red.

**Implicación:** si el banco central actualiza su tasa durante el batch (ventana de ~5 seg), los últimos precios validados pueden usar la tasa previa. Aceptable — la ventana es despreciable.

### 3. "3 anomalías consecutivas" via query a `scraper_anomalies`, no contador in-memory

**Problema:** el código existente en `base.ts` usa `const failCounts: Record<string, number>` — objeto en memoria del proceso. En Vercel serverless, cada invocación puede ser cold start → el contador resetea a 0 → el mecanismo "3 fallas consecutivas marca stale" **nunca dispara** en producción.

**Solución adoptada:** `checkConsecutiveAnomalies()` consulta `scraper_anomalies` por el par (operador, corredor) dentro de la última hora y cuenta filas. Si son ≥ 3, llama al existente `reportScraperFailure()` para marcar precios stale. La persistencia está en DB, no en memoria del proceso.

**Ventana de 60 min:** elegida porque `/api/scrape` corre vía cron (típicamente cada 15 min). 60 min = ~4 oportunidades de validar el par. Si 3 de 4 fallan, el scraper está consistentemente roto y hay que marcar stale. Ajustar si el cron cambia de frecuencia.

**Bug latente relacionado:** el contador in-memory en `reportScraperFailure()` sigue existiendo pero tiene el mismo defecto. Documentado en `TROUBLESHOOTING/27_contador_in_memory_serverless.md`. NO se arregló en este commit (scope separado por decisión del founder).

### 4. Firma pública de `savePrices()` inalterada

El validador se integra como capa interna sin cambiar el contrato exportado `Promise<{ saved: number; errors: string[] }>`. Los rechazos por validación NO cuentan como `errors` (son datos inválidos, no fallas técnicas) — se registran en `scraper_anomalies` + Sentry aparte.

**Motivación:** los 7 scrapers individuales (`lib/scrapers/*.ts`) llaman a `return savePrices(prices)` al final — si cambia la firma, hay que tocar 7 archivos. Evitamos ese scope.

### 5. Sentry captura con tag `scraper_anomaly`

Cada anomalía dispara `Sentry.captureMessage('scraper_anomaly', ...)` con level `warning`. Permite filtrar en el dashboard Sentry: `tag:scraper_anomaly=true` → ver solo estos eventos sin ruido de errores de app.

Si Sentry no está configurado (DSN vacío, common en dev), el capture es no-op silencioso — no bloquea el pipeline.

---

## Flujo de una anomalía detectada

```
Scraper produce ScrapedPrice con tasa=45 para DOP (debería ser ~60.5)
    ↓
savePrices() llama validatePrice()
    ↓
Regla 7 falla: tasa fuera de rango [54.45, 66.55]
    ↓
logAnomaly() inserta fila en scraper_anomalies con:
  - operador=remitly, corredor=dominican_republic
  - campo_invalido=tasa, valor_recibido=45
  - valor_esperado_min=54.45, valor_esperado_max=66.55
  - raw_price=JSONB del ScrapedPrice completo
    ↓
Sentry.captureMessage('scraper_anomaly', ...) con tag
    ↓
checkConsecutiveAnomalies() cuenta últimas 3 filas del par
(operador, corredor) dentro de la ventana de 60 min
    ↓
Si count ≥ 3 → reportScraperFailure() marca todos los precios
del operador con actualizado_en='2000-01-01' (stale)
    ↓
savePrices() continúa con la siguiente fila del batch
(NO se guarda la fila rechazada en tabla `precios`)
```

---

## Smoke test manual

### 1. Verificar que una fila inválida NO entra a `precios`

Editar temporalmente `lib/scrapers/remitly.ts` — forzar tasa fuera de rango para Dominican Republic:

```typescript
// línea ~44, cambiar temporalmente:
tasa: 45,  // era: Number(Number(rate).toFixed(4))
```

Correr `/api/scrape` (con header auth admin si aplica). En Supabase SQL Editor:

```sql
-- NO debe aparecer una fila con tasa=45
SELECT * FROM precios
WHERE operador='remitly' AND corredor='dominican_republic' AND tasa < 50;

-- SÍ debe aparecer una o más filas en scraper_anomalies
SELECT * FROM scraper_anomalies
WHERE operador='remitly' AND corredor='dominican_republic'
ORDER BY created_at DESC
LIMIT 5;
```

Rollback del test: revertir el cambio en `remitly.ts`.

### 2. Verificar que 3+ anomalías marcan stale

Correr `/api/scrape` tres veces consecutivas (dentro de 1 hora) con el valor inválido del paso 1. Después:

```sql
-- Tras la 3ra corrida, todas las filas de remitly deben tener
-- actualizado_en = '2000-01-01' (stale)
SELECT operador, corredor, actualizado_en FROM precios WHERE operador='remitly';
```

Rollback: `UPDATE precios SET actualizado_en=now() WHERE operador='remitly';` y `DELETE FROM scraper_anomalies WHERE operador='remitly' AND created_at > '2026-04-22';`

### 3. Sentry

Con DSN configurado en Vercel, abrir el dashboard Sentry → filtrar por `tag:scraper_anomaly=true`. Debe aparecer 1 evento por cada anomalía registrada.

Sin DSN configurado (dev local), el evento se loguea a `console.warn` sin errores.

---

## Cómo diagnosticar falsos positivos

Si el validador empieza a rechazar filas legítimas (ej. el peso colombiano se movió +12% y nuestro fallback de 4150 es viejo):

1. Query a `scraper_anomalies` filtrando por `campo_invalido='tasa'` las últimas 24h
2. Si todas las anomalías son del mismo corredor + valor "razonable" fuera de bounds → actualizar `TASA_BASE_FALLBACK` en `validator.ts` con la nueva tasa real
3. O, preferido: actualizar la fila correspondiente en tabla `tasas_bancos_centrales` — el cache de la próxima invocación la recoge sin redeploy

---

## Métricas que el validador habilita

- **Health del pipeline de scrapers:** filas rechazadas vs filas aceptadas por batch
- **Scrapers inestables:** qué operador tiene más anomalías en 7 días (dashboard futuro del admin)
- **Dérivas de banco central:** si todos los scrapers rechazan tasas del mismo corredor, la tasa base está desactualizada
- **Intentos maliciosos:** aunque los scrapers son internos, si aparecen `operador` fuera de whitelist en `scraper_anomalies`, es señal de que algún scraper se comprometió o un dev introdujo un bug

---

## Archivos modificados al implementar (2026-04-22)

- `supabase/migrations/007_scraper_anomalies.sql` — tabla nueva + RLS deny-anon
- `lib/scrapers/validator.ts` — módulo nuevo (~300 líneas, pure function + I/O aislado)
- `lib/scrapers/base.ts` — integración en `savePrices()` (firma pública sin cambios)
- `LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md` — este archivo
- `TROUBLESHOOTING/27_contador_in_memory_serverless.md` — bug latente documentado, no arreglado
- `CONTEXTO_FINAL.md` — Fase 7 Agente 1 marcado completado
- `CHECKLIST_PRE_LANZAMIENTO.md` — § 7.5 items marcados completados
- `supabase/migrations/001_create_tables.sql` — comentario de enum `metodo_entrega` actualizado al canon nuevo (bank, cash_pickup, home_delivery, mobile_wallet)
