# Troubleshooting 03 — Precios desactualizados en el comparador

## Síntomas
- Usuario reporta que el precio que muestra PreEnvios no coincide con lo que ve en la web del operador
- Los precios no han cambiado en días
- El campo `actualizado_en` en Supabase tiene fecha vieja

## Causas comunes

### Causa 1: Scrapers no están corriendo
**Diagnóstico:**
1. Panel admin → Dashboard → ¿operadores en rojo?
2. `/api/admin/dashboard` → verificar `lastUpdate` de cada operador

**Solución:** Ver [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md)

### Causa 2: Cache del API no se refrescó
**Diagnóstico:**
1. El scraper actualizó Supabase, pero el API sigue sirviendo datos viejos
2. El cache `s-maxage=300` (5 min) puede estar sirviendo datos stale

**Solución:**
1. Esperar 5 minutos — el cache expira automáticamente
2. Si urgente: agregar `?t=[timestamp]` al URL para bypass cache
3. Vercel dashboard → deployar de nuevo para purgar cache global

### Causa 3: Tasa del operador cambió entre cron runs
**Diagnóstico:**
1. El scraper corrió hace 1 hora y la tasa era X
2. El operador cambió la tasa hace 30 minutos
3. El siguiente cron no ha corrido todavía

**Solución:**
1. Esperar al siguiente cron (máx 2 horas)
2. O ejecutar scrapers manualmente desde admin → "Ejecutar scrapers ahora"
3. O actualizar manualmente desde admin → Tasas → Editar

### Causa 4: Scraper extrae dato incorrecto
**Diagnóstico:**
1. El scraper corre sin error pero la tasa que guarda no coincide con lo que se ve en la web
2. El endpoint del operador devuelve tasa para un monto diferente al esperado ($200)

**Solución:**
1. Verificar manualmente: simular envío de $200 en la web del operador
2. Comparar con lo que devuelve el endpoint del scraper
3. Ajustar parámetros del scraper (amount, currency, etc.)

## Proceso paso a paso
```
1. ¿Cuál operador está desactualizado?
2. Admin → Dashboard → ¿está en rojo o verde?
3. Si rojo → scraper falló → ver 01 o 02
4. Si verde pero precio incorrecto → causa 3 o 4
5. Verificar en la web del operador: ¿cuánto da por $200 a ese corredor?
6. Comparar con lo que muestra PreEnvios
7. Si difiere: actualizar manualmente y revisar el scraper
```
