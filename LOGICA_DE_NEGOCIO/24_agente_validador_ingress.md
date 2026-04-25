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

## Manual operacional — para founder y empleados

Esta sección está pensada para que cualquier persona (no developer) sepa
qué hace el agente, cómo se entera de un problema, y cómo responder.

### Qué protege en lenguaje simple

El Agente 1 es **el portero de la tabla `precios`**. Antes de que un
scraper guarde un precio en la base de datos, este agente revisa que el
dato sea creíble:

- ¿La remesadora existe? (Remitly sí · "PayPal" no)
- ¿El país existe? (Honduras sí · Nicaragua no)
- ¿La comisión está en un rango razonable? (entre $0 y $50)
- ¿La tasa está cerca de la del banco central? (±10%)
- ¿El método de envío es uno de los 4 que reconocemos? (banco, efectivo,
  domicilio, billetera móvil)

Si algo no pasa, **el dato no entra a la DB**. Se anota en una tabla
aparte (`scraper_anomalies`) y se manda a Sentry para que sepamos.

### Qué riesgos concretos cubre

| Riesgo si NO existiera el agente | Impacto en el negocio |
|---|---|
| Scraper de Remitly devuelve `tasa=45` para Dominicana (real: ~60) | Usuario ve que Remitly da 45 DOP/USD, confía, va al sitio, recibe mucho menos → review negativo + ticket de soporte |
| Scraper devuelve `operador='paypal'` (typo o cambio de marca) | El Comparador no sabe qué hacer → card rota, posible crash de UI |
| Scraper devuelve `fee=200` en un envío de $200 | El ranking pone ese operador último cuando no debería → distorsiona el "Mejor opción" |
| Scraper devuelve `metodo_entrega='delivery'` (string libre) | El filtro de método de entrega del comparador deja de funcionar |
| Algún día un scraper malicioso intenta meter `corredor='nicaragua'` | Aparece data dormida en DB que el producto no expone → estado oculto |

**Costo ahorrado por evento prevenido**: variable, pero un solo precio
mal mostrado puede generar 1-3 tickets de soporte + posible review
negativo en Trustpilot. Mantener integridad de data es la base de la
confianza del comparador.

### Cómo te llega el alert

Cada vez que el agente rechaza un dato, dispara un evento a Sentry con
**tag `scraper_anomaly`**. El founder se entera por:

1. **Email de Sentry** (si tenés alertas configuradas) — llega un mail
   tipo "New issue: scraper_anomaly" con resumen del problema.
2. **Dashboard de Sentry** — `preenvios.sentry.io` → proyecto
   `javascript-nextjs` → Issues. Buscar/filtrar `scraper_anomaly`.

### Cómo verificar Sentry — paso a paso

1. Entrar a `preenvios.sentry.io` con tu cuenta de founder
2. En el menú izquierdo → **Issues** → **Errors & Outages**
3. En la barra de búsqueda escribir: `scraper_anomaly`
4. Ver la lista — cada fila es 1 tipo distinto de anomalía agrupada por
   `(operador, corredor, campo_invalido)`
5. Clickear cualquier issue para ver detalles:
   - Cuántas veces ocurrió (Events)
   - Cuándo fue la primera y última vez
   - El payload completo del scraper que falló (en la sección "Highlights")

### Cómo distinguir falso positivo vs problema real

**Falso positivo** (el agente alarmó pero el dato era correcto):
- El banco central movió su tasa real >10% y nuestro fallback quedó
  viejo. Ej: Colombia salta de 4150 a 4700 COP/USD por una crisis cambiaria.
  → El agente rechaza tasas correctas porque el rango se quedó atrás.
- **Cómo detectarlo**: si TODAS las anomalías de las últimas 24h son del
  mismo corredor + las tasas rechazadas son consistentes entre sí (ej.
  todas ~4700 COP), probablemente la tasa real cambió.
- **Cómo arreglar**: actualizar la fila de ese corredor en
  `tasas_bancos_centrales` (Supabase SQL Editor). El agente recoge el
  cambio en la próxima invocación, sin redeploy.

**Problema real** (el scraper realmente está roto):
- Anomalías esporádicas mezcladas (varios corredores, varios campos).
- Un solo operador con muchas anomalías (típicamente el sitio del
  operador cambió HTML y el scraper extrae basura).
- **Cómo detectarlo**: filtrar Sentry por `operador=<nombre>` — si solo
  uno está fallando, ese scraper específico necesita arreglo de código.

### Playbook de respuesta — qué hacer cuando suena

| Síntoma | Acción inmediata |
|---|---|
| 1-2 issues nuevos `scraper_anomaly` esta semana | Probablemente ruido. Marcá Resolved en Sentry y revisá el patrón en 7 días. |
| 3+ anomalías mismo (operador, corredor) en 1 hora | El agente automáticamente marca todos los precios de ese operador como stale (`actualizado_en='2000-01-01'`). El comparador deja de mostrarlo hasta que se arregle. **No requiere acción manual** — solo investigar la raíz cuando podás. |
| Decenas de issues nuevas el mismo día | Probable cambio masivo: tasa del banco central, refactor de scraper, cambio en sitio de operador. Revisar primero `tasas_bancos_centrales` por corredor afectado. |
| Issue nuevo con `operador` desconocido | Alguien introdujo un scraper nuevo o renombró uno. Verificar `lib/scrapers/validator.ts` whitelist. Escalar a developer. |

### Mantenimiento periódico

- **Semanal** (founder, ~5 min): abrir Sentry → filtrar
  `scraper_anomaly` últimos 7 días → contar issues nuevos. Si <5,
  pipeline sano. Si >20, revisar patrón.
- **Mensual** (founder o developer): revisar
  `TASA_BASE_FALLBACK` en `lib/scrapers/validator.ts` — comparar con
  tasas reales de los 6 bancos centrales. Actualizar si alguna se movió
  >5%.
- **Cuando se agrega corredor nuevo**: paso 3 del Proceso 11 documenta
  agregar el slug a la whitelist del validador.
- **Cuando se agrega operador nuevo**: agregar a whitelist en
  `validator.ts` línea de `OPERADORES_VALIDOS`.

### Cuándo escalar a Claude Code o developer

- El agente bloqueó >100 filas en 24h (algo está muy mal)
- Aparecieron campos `campo_invalido` que no reconocés (ej. uno nuevo
  que no estaba en el código)
- El cron `/api/scrape` empezó a tardar >5x lo normal después de
  activar el agente (poco probable, el cache lo previene — pero por si)
- Querés agregar una regla nueva al validador (ej. "tasa no puede ser
  más alta que el día anterior +X%")

### Resumen para nuevos empleados

> El Agente 1 es el portero de los precios. Si algún scraper te
> manda algo raro, lo bloquea antes de que entre a la base de datos
> y nos avisa por Sentry. No vas a verlo trabajando porque trabaja
> silenciosamente; solo aparece cuando hay problemas. Si llega un
> alert con tag `scraper_anomaly`, mirá si es 1-2 (ruido normal) o
> es una avalancha (algo se rompió). El playbook de arriba te dice
> qué hacer en cada caso.

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
