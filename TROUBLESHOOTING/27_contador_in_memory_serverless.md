# 27 — Contador `failCounts` in-memory de `reportScraperFailure` NO dispara en Vercel serverless

## Síntoma esperado (a investigar si ocurre)

Un scraper falla técnicamente (ej. HTTP 503 de la API del operador) en varias invocaciones consecutivas, pero `reportScraperFailure()` **nunca** llega al umbral de 3 fallos para marcar los precios como stale. El comparador sigue mostrando precios viejos y el usuario ve data desactualizada sin señal visible.

**Status:** bug latente conocido, **NO arreglado**. Documentado 2026-04-22.

## Causa raíz

`lib/scrapers/base.ts` implementa el contador así (líneas ~99-124):

```typescript
const failCounts: Record<string, number> = {}

export async function reportScraperFailure(
  operador: string,
  error: string
): Promise<{ markedStale: boolean }> {
  const key = operador
  failCounts[key] = (failCounts[key] || 0) + 1
  if (failCounts[key] >= 3) {
    // ... marcar stale
    failCounts[key] = 0
    return { markedStale: true }
  }
  return { markedStale: false }
}
```

**El problema:** `failCounts` vive en la memoria del proceso Node.js. En Vercel:

- Cada invocación de `/api/scrape` puede ser un **cold start** de una Lambda nueva → `failCounts` empieza en `{}` → contador nunca llega a 3.
- Aun sin cold start, Vercel corta processes tras ~15 min de inactividad → resetea el contador.
- Si el cron corre cada 15 min y cada corrida es cold → el contador **siempre** empieza en 0, nunca dispara.

## Por qué no se arregló en esta sesión

Decisión del founder (2026-04-22): scope separado del Agente 1 (Validador de ingress).

Para el Agente 1 sí necesitábamos un "3 anomalías consecutivas" robusto — se implementó mediante **consulta a la tabla `scraper_anomalies`** (`checkConsecutiveAnomalies()` en `lib/scrapers/validator.ts`). No se migró `reportScraperFailure` al mismo patrón porque:

1. No bloquea el lanzamiento — el Agente 1 cubre el caso crítico (data inválida en DB).
2. Cambiar `reportScraperFailure` requiere crear una tabla adicional (`scraper_failures`) o reusar `scraper_anomalies` con un `tipo` polimórfico — decisión arquitectural separada.
3. El caso de fallo técnico (HTTP 503, timeout) es menos frecuente que el caso de data inválida (fee outlier, tasa fuera de rango), y cuando ocurre lo captura Sentry si está configurado.

## Arreglo propuesto (cuando toque)

**Opción A — Reusar `scraper_anomalies` con un tipo:**

Agregar columna `tipo TEXT DEFAULT 'validation'` a `scraper_anomalies` y reescribir `reportScraperFailure` para que inserte filas con `tipo='scraper_failure'` y luego cuente via query (mismo patrón que `checkConsecutiveAnomalies`).

**Ventaja:** 1 solo lugar donde todos los problemas de ingreso de precios se registran.
**Desventaja:** acopla dos conceptos (validación vs falla técnica) en una tabla.

**Opción B — Tabla nueva `scraper_failures`:**

Separada de `scraper_anomalies`. Columnas: `id, created_at, operador, error_message`. La función `reportScraperFailure` inserta ahí y cuenta con `GROUP BY`.

**Ventaja:** separación de responsabilidades clara.
**Desventaja:** 2ª tabla relacionada con el mismo dominio.

**Opción C — Upstash Redis counter (serverless-native):**

Usar `INCR` en Redis (ya usado para rate-limits en `lib/rate-limit.ts`) con TTL. `INCR rl:scraper-fail:{operador}` + `EXPIRE 3600`. Si `>= 3`, marcar stale.

**Ventaja:** cero nueva tabla, patrón ya conocido en el proyecto.
**Desventaja:** dependencia de Redis — si cae, el contador no cuenta (fail-open aceptable).

**Recomendación:** Opción C por alinearse con el patrón existente de rate-limits y no inflar el schema de Supabase.

## Cómo verificar que el bug está presente

Con el proyecto en deploy Vercel, forzar fallos artificiales:

1. Editar temporalmente un scraper para que siempre lance un error (ej. `throw new Error('test 503')`).
2. Correr `/api/scrape` 5 veces con separación de 30+ min entre corridas (para forzar cold starts).
3. Verificar en Supabase: `SELECT actualizado_en FROM precios WHERE operador='<scraper-afectado>'`. Si las filas NO tienen `actualizado_en='2000-01-01'`, el contador no llegó a 3.

## Prioridad

**Baja** en el pre-lanzamiento — el Agente 1 (Validador de ingress) cubre el 90% de los casos que importan (data inválida). Los fallos técnicos (HTTP errors) ya se loguean en `errors[]` del retorno de `savePrices()` y se capturan en Sentry si está configurado.

**Media** después del lanzamiento — si los dashboards muestran scrapers "fallando técnicamente varias veces seguidas" sin marcarse stale, arreglar con Opción C.

## Archivos relacionados

- `lib/scrapers/base.ts` — donde vive el contador buggy
- `lib/scrapers/validator.ts` — donde vive la alternativa serverless-safe (`checkConsecutiveAnomalies`)
- `LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md` § "Decisiones de diseño" punto 3 — explicación del patrón correcto
- `lib/rate-limit.ts` — patrón Upstash Redis ya usado, referencia para Opción C
