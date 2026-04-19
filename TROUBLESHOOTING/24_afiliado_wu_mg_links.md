# 24 — Botones WU/MG grises o links sin tracking tras aprobación

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-15 min

## Síntoma
Tres síntomas relacionados al estado "pendiente aprobación" de Western Union y MoneyGram introducido el 2026-04-18:
- Los botones de WU y MG aparecen grises ("Ver en sitio") en lugar de verdes ("Enviar ahora")
- Los botones están verdes pero `GET /api/precios` devuelve `afiliado: false` para esos operadores
- La cuenta de CJ Affiliate (WU) o FlexOffers (MG) ya fue aprobada pero los clicks NO están atribuyéndose — el link sigue apuntando al dominio público sin tracking ID
- El ranking coloca a WU/MG al fondo como antes (score cercano a MoneyGram ~29) cuando debería ubicarlos mejor (~37-42) tras la activación

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — SQL 005 no ejecutado
Contexto: `supabase/migrations/005_activate_wu_mg_affiliate.sql` flipea `afiliado=true` y setea `link` al dominio público para ambos operadores. Sin ejecutar, la DB conserva los valores anteriores (`afiliado=false`, `link=''`) y el UI muestra botón gris.

Arreglo:
1. En Supabase SQL Editor:
   ```sql
   SELECT operador, COUNT(*) FILTER (WHERE afiliado = true) AS ok, COUNT(*) AS total
   FROM precios
   WHERE operador IN ('westernunion', 'moneygram')
   GROUP BY operador;
   ```
2. Si el conteo `ok` es 0 para alguno: ejecutar completo `supabase/migrations/005_activate_wu_mg_affiliate.sql`
3. Refrescar el comparador. El cache de `/api/precios` (s-maxage=300) puede hacer que tarde hasta 5 min en reflejarse — redeploy para purgar cache edge

### 🎯 Causa 2 — Cuenta afiliado aprobada pero link no actualizado
Contexto: el link temporal `https://www.westernunion.com` funciona pero NO genera comisión. Cuando CJ Affiliate apruebe el programa, se obtiene una URL con tracking ID tipo `https://www.dpbolvw.net/click-XXXXXXX-YYYYYYYY` o similar. Hay que actualizar los registros.

Arreglo (CJ Affiliate para Western Union):
1. Login en CJ → Advertisers → Western Union → "Get Links"
2. Copiar la URL de deep-link del corredor más relevante (o la homepage)
3. En `/es/admin` → Tasas → seleccionar operador `westernunion` en cada corredor y actualizar el campo `link`, O ejecutar en Supabase SQL Editor:
   ```sql
   UPDATE precios
   SET link = '<URL_CON_TRACKING>',
       actualizado_en = NOW()
   WHERE operador = 'westernunion';
   ```
4. Mismo proceso para MoneyGram (FlexOffers o CJ según la que apruebe primero)

### 🎯 Causa 3 — Deep link por corredor vs link genérico
Contexto: los otros operadores (Remitly, Wise, etc.) tienen links DISTINTOS por corredor (`/us/en/honduras`, `/us/en/dominican-republic`, etc.). Para WU y MG se usa el mismo link de dominio público en las 8 filas (una por corredor). Esto reduce CTR si el usuario esperaba una landing específica del país.

Arreglo cuando haya aprobación:
1. Obtener de CJ los deep-links por país (p.ej. `westernunion.com/us/en/send-money-to-honduras?AFFID=XXX`)
2. `UPDATE precios SET link = <url_corredor> WHERE operador = 'westernunion' AND corredor = 'honduras'`
3. Repetir para cada (operador, corredor). Son 16 filas (2 operadores × 8 corredores)

### 🎯 Causa 4 — Ranking sigue mostrando WU/MG al fondo como antes
Contexto: aunque `afiliado=true`, el score de valor_afiliado se normaliza contra min/max de los operadores del corredor. WU tiene `valor_bruto=10` y MG `valor_bruto=5` (seed SQL 003), que los coloca en el tercio bajo cuando operadores como WorldRemit ($30) y Wise ($36) están arriba. Esto es correcto — no es bug.

Arreglo:
1. Si se quiere ajustar (p.ej. tras aprobación real con términos mejores), editar los 3 campos en `/es/admin` → Tasas → sección "Configuración de afiliado por operador" (bulk update)
2. Ejemplo: si la aprobación de CJ muestra que WU paga $15 comisión con cookie de 60 días, actualizar ambos valores y el bulk update propaga a los 8 corredores
3. Ver formula completa en [LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md](../LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md)

### 🎯 Causa 5 — `/api/admin/precios` PATCH devuelve 500 al editar link
Arreglo:
1. DevTools → Network → `/api/admin/precios` PATCH → ver status
2. Si 401: sesión admin expiró, volver a login
3. Si 500: Vercel Functions logs → típicamente `SUPABASE_SERVICE_ROLE_KEY` inválida. Ver [06_supabase_errores.md](06_supabase_errores.md)

### 🎯 Causa 6 — Tabla `precios` no tiene las filas esperadas para WU/MG
Contexto: si alguien corrió seed-new-corridors.mjs con la versión vieja (antes del cambio 2026-04-18), puede quedar con filas viejas (`afiliado=false`). El upsert por `onConflict: 'operador,corredor,metodo_entrega'` debería re-escribir, pero si se ejecutó antes del 2026-04-18 y nunca más, los valores viejos persisten.

Arreglo:
1. Siempre preferir ejecutar el SQL 005 sobre correr seed scripts
2. El seed está actualizado pero re-ejecutarlo borra timestamps y datos de scrapers si aplica. Usar solo en setup inicial o recovery

## Workaround mientras arreglas
- Si SQL 005 aún no se ejecutó pero el deploy ya promete botones activos: el usuario verá botón gris temporalmente. No rompe nada — mejor el gris que un botón apuntando a un dominio caído
- Si el link con tracking aún no llega y los usuarios están haciendo clicks sin atribución: contactar CJ/FlexOffers para acelerar la aprobación. No revertir a botón gris — perjudica UX sin beneficio

## Relacionados
- [LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md](../LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md) — formula valor_afiliado y tabla de valores por operador
- [19_ranking_orden_inesperado.md](19_ranking_orden_inesperado.md) — si WU/MG aparecen en un orden que no esperabas tras la activación
- [03_precios_stale_en_comparador.md](03_precios_stale_en_comparador.md) — si los cambios de admin/SQL tardan >5 min en aparecer
- [CONTEXTO_FINAL.md sección 4.2.6](../CONTEXTO_FINAL.md) — contexto completo de la activación
