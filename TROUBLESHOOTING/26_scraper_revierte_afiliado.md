# 26 — Scraper revierte afiliado/link de un operador tras SQL manual

## Gravedad · Tiempo al fix
🔴 Crítico (afecta atribución de afiliado en producción)
⏱ Fix típico: 5 min

## Síntoma
- Ejecutaste una SQL manual para flipear `afiliado=true` (ej: SQL 005 para Western Union y MoneyGram) y verificaste que quedó bien
- Horas o días después el botón del operador vuelve a estar gris ("Ver en sitio") en producción
- Inspeccionando Supabase, la fila tiene `afiliado=false` y `link=''` de nuevo
- Coincide temporalmente con la ejecución del cron de scrapers (cada 2h)

## Causa raíz
`savePrices()` en `lib/scrapers/base.ts` hace `upsert(...)` con `onConflict: 'operador,corredor,metodo_entrega'`. Cuando la fila ya existe, el upsert hace UPDATE pasando TODOS los campos del objeto `ScrapedPrice`, incluyendo `afiliado` y `link`.

Si el scraper hardcodea `afiliado: false` y `link: ''` (como era el caso de `lib/scrapers/moneygram.ts` y `westernunion.ts` hasta 2026-04-18), cada corrida de cron revierte la configuración admin/SQL.

## Arreglo

### Paso 1 — Fix el scraper (ya aplicado para WU y MG en 2026-04-18)
Abrir `lib/scrapers/<operador>.ts` y asegurar que el payload tenga los valores CORRECTOS:

```ts
prices.push({
  operador: 'moneygram',
  // ...
  afiliado: true,                              // ← NO dejar false
  link: 'https://www.moneygram.com',           // ← NO dejar ''
  // ...
})
```

Cuando haya tracking URL de afiliado (tras aprobación de cuenta CJ/FlexOffers), actualizar ambos:
1. El link en Supabase (via admin o SQL)
2. El link hardcoded en `lib/scrapers/<operador>.ts`

Si los dos no coinciden, el próximo scrape revierte.

### Paso 2 — Restaurar el estado en DB tras el bug
Ejecutar en Supabase SQL Editor:

```sql
-- Western Union
UPDATE precios
SET afiliado = true, link = 'https://www.westernunion.com', actualizado_en = NOW()
WHERE operador = 'westernunion';

-- MoneyGram
UPDATE precios
SET afiliado = true, link = 'https://www.moneygram.com', actualizado_en = NOW()
WHERE operador = 'moneygram';
```

O ejecutar de nuevo `supabase/migrations/005_activate_wu_mg_affiliate.sql` — es idempotente.

### Paso 3 — Verificar
```sql
SELECT operador, COUNT(*) FILTER (WHERE afiliado = true) AS activos, COUNT(*) AS total
FROM precios
WHERE operador IN ('westernunion', 'moneygram')
GROUP BY operador;
```

Debe mostrar `activos = total` para ambos.

### Paso 4 — Esperar cache edge
La API `/api/precios` tiene `s-maxage=300` (5 min). Si el usuario ve botón gris inmediatamente tras el UPDATE, esperar 5 min o redesplegar para purgar cache.

## Prevención futura (regla del proyecto)
Cuando se agregue un operador nuevo con afiliado:
1. Setear `afiliado: true` y `link: '<url>'` en `lib/scrapers/<operador>.ts`
2. Ejecutar la SQL de inicialización
3. Si se obtiene tracking URL posterior: actualizar AMBOS (DB + scraper)

**Regla general:** el scraper es la fuente de verdad para tasa/fee/velocidad/actualizado_en. Para `afiliado`, `link`, `rating`, `reviews`, `confiabilidad` y `metodos_disponibles`, los valores hardcoded en el scraper deben coincidir con lo que admin espera. Hay un comentario recordatorio en `lib/scrapers/base.ts` encima del tipo `ScrapedPrice`.

## Relacionados
- [24_afiliado_wu_mg_links.md](24_afiliado_wu_mg_links.md) — gestión del estado pendiente de aprobación
- [19_ranking_orden_inesperado.md](19_ranking_orden_inesperado.md) — afiliado=false en filas del operador como causa #4
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si múltiples scrapers fallan hay otro issue
- [CONTEXTO_FINAL.md sección 4.2.6](../CONTEXTO_FINAL.md) — activación WU/MG con afiliado pendiente
