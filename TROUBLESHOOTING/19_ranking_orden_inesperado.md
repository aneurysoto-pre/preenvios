# 19 — Ranking devuelve un orden inesperado

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
Un operador que esperabas arriba aparece abajo (o viceversa). Ejemplos:
- Wise con peor tasa aparece primero → comportamiento esperado por cookie lifetime, NO es bug
- Xoom con mejor tasa aparece último → comportamiento esperado por trafico_calificable=0.4
- Un operador sin afiliado aparece al fondo aunque tenga buena tasa → esperado (valor_afiliado=0)
- El ranking es exactamente el mismo antes y después de cambiar `comision_usd` en admin

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — SQL 003 no ejecutado (columnas no existen)
Contexto: `lib/ranking.ts:calcularValorAfiliado()` usa `comision_usd`, `cookie_dias`, `trafico_calificable`. Si las columnas no existen en Supabase, los campos llegan `undefined` y el código usa defaults (0, 30, 1.0) → todos los operadores con afiliado tienen `valor_bruto` parecido.

Arreglo:
1. En Supabase SQL Editor:
   ```sql
   SELECT column_name FROM information_schema.columns WHERE table_name = 'precios' AND column_name IN ('comision_usd','cookie_dias','trafico_calificable');
   ```
2. Si no aparecen las 3: ejecutar `supabase/migrations/003_valor_afiliado.sql` en Supabase SQL Editor
3. Verificación: refrescar el comparador, Wise/WorldRemit deberían subir

### 🎯 Causa 2 — Cache del API (5 min stale tras UPDATE)
Contexto: `/api/precios` tiene `s-maxage=300`. Si acabas de editar valores en admin, el comparador puede mostrar el ranking viejo hasta 5 min.

Arreglo:
1. Esperar 5 min
2. O redesplegar en Vercel para purgar cache edge
3. Bypass: agregar `?t=[timestamp]` al URL manual

### 🎯 Causa 3 — Admin `/api/admin/precios` PATCH devolvió 500
Arreglo:
1. DevTools → Network → `/api/admin/precios` PATCH → ¿status 500?
2. Vercel Functions logs → error exacto
3. Típico: `SUPABASE_SERVICE_ROLE_KEY` inválida → ver [06_supabase_errores.md](06_supabase_errores.md)

### 🎯 Causa 4 — `afiliado = false` en todos los precios del operador
Contexto: si `precios.afiliado` es false para el operador, su `valor_afiliado_score = 0` sin importar los otros campos. Western Union y MoneyGram están así por diseño (sin programa público).

Arreglo:
1. Query: `SELECT operador, corredor, afiliado FROM precios WHERE operador = '[X]';`
2. Si debería tener afiliado y está en false: `UPDATE precios SET afiliado = true WHERE operador = '[X]';`

### 🎯 Causa 5 — Defaults ocultan el problema
Contexto: si un operador nuevo se agrega a `precios` sin setear los 3 campos, hereda los defaults de SQL (0, 30, 1.0). Con `comision_usd=0`, `valor_bruto=0` → score 0 en afiliado.

Arreglo:
1. Para cada operador verificar:
   ```sql
   SELECT DISTINCT operador, comision_usd, cookie_dias, trafico_calificable
   FROM precios;
   ```
2. Si hay nulls o ceros donde no deberían: actualizar via admin o SQL directo

### 🎯 Causa 6 — Pesos alterados accidentalmente
Contexto: si alguien editó `lib/ranking.ts:PESOS` y los pesos no suman 1.0, los scores se desvían.

Arreglo:
1. Abrir `lib/ranking.ts`
2. Verificar: `0.35 + 0.25 + 0.15 + 0.15 + 0.10 === 1.00`
3. Si no, restaurar los valores originales

## Verificar el cálculo manualmente

Para depurar, correr este script local en la raíz del proyecto:
```bash
node -e "
const comision = 12, cookie = 9999, trafico = 1.0
const cookieMult = Math.min(cookie/30, 3)
console.log('valor_bruto =', comision * cookieMult * trafico)
"
```

Para Wise con datos seed: 12 × 3 × 1 = **36**

## Workaround mientras arreglas
Si el orden visible es muy incorrecto: `/es/admin` → Tasas → ajustar manualmente los valores de comision/cookie/trafico del operador afectado hasta obtener el ranking esperado.

## Relacionados
- [LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md](../LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md) — fórmula completa + valores por operador
- [03_precios_stale_en_comparador.md](03_precios_stale_en_comparador.md) — si el ranking no refresca tras cambios
- [06_supabase_errores.md](06_supabase_errores.md) — si las columnas no existen aún
