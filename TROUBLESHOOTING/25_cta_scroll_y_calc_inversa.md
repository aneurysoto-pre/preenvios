# 25 — CTA "Comparar ahora" no hace scroll o calculadora inversa muestra >4 países

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-15 min

## Síntoma
Dos problemas relacionados introducidos/arreglados el 2026-04-18:
- Click en botón "Comparar ahora →" del bloque "Listo para enviar más por menos?" no hace nada visible, o scrollea a un lugar vacío, o el header fixed tapa el destino
- El click funciona en desktop pero no en mobile (o viceversa)
- En páginas de país (/honduras, /guatemala, etc.) el mismo botón no funciona
- La página `/es/calculadora-inversa` muestra tabs de Colombia / México / Nicaragua / Haití (no son MVP)
- La calculadora inversa NO muestra El Salvador (debería estar en los 4 MVP)

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Falta `id="calculadora"` en la sección del hero
Contexto: el handler `scrollToCalculator` en CTASection busca el elemento por id. Si alguien edita `components/Comparador.tsx` y quita el id, el click del botón no hace nada (el handler hace early return si no encuentra el elemento).

Arreglo:
1. Verificar:
   ```bash
   grep -n 'id="calculadora"\|id=\"calculadora\"' components/Comparador.tsx
   ```
2. Debe aparecer 1 match en la `<section>` del hero al inicio del return
3. Como fallback el handler también intenta `document.querySelector('[data-section="calculadora"]')` — si ambos faltan, agregar el id. El atributo `data-section` existe para permitir renombrar el id sin romper refs

### 🎯 Causa 2 — El botón volvió a ser `<a href="#calculadora">` en lugar de `<button onClick>`
Contexto: con `<a href="#...">` el browser scrollea al top del elemento, quedando oculto por el Nav fixed de 72px. El fix canónico es `<button>` con `scrollToCalculator` handler que aplica offset -80px.

Arreglo:
1. Abrir `components/Sections.tsx` en CTASection
2. Debe ser `<button type="button" onClick={scrollToCalculator}>` — NO `<a href="#calculadora">`
3. El handler debe existir:
   ```ts
   function scrollToCalculator() {
     const el = document.getElementById('calculadora') || document.querySelector<HTMLElement>('[data-section="calculadora"]')
     if (!el) return
     const y = el.getBoundingClientRect().top + window.pageYOffset - 80
     window.scrollTo({ top: y, behavior: 'smooth' })
   }
   ```

### 🎯 Causa 3 — Header height cambió y los 80px de offset ya no ajustan
Contexto: el Nav mide 72px (`h-[72px]` en `components/Nav.tsx` línea ~95). El offset del scroll es 80px (72 + 8 de aire). Si alguien redimensionó el Nav, ajustar el offset en `scrollToCalculator`.

Arreglo:
1. Verificar altura actual del Nav:
   ```bash
   grep -E "h-\[72px\]|h-\[\d+px\]" components/Nav.tsx
   ```
2. Si cambió: actualizar el 80 en `scrollToCalculator` a `altura_nav + 8`
3. Si hay diseño mobile-first con nav más chico en mobile, considerar `window.matchMedia('(max-width: 640px)').matches ? 64 : 80`

### 🎯 Causa 4 — Footer link "Destinos" apunta a `#comparar` en vez de `#calculadora`
Contexto: `#comparar` es la sección de resultados que solo existe cuando `montoNum > 0`. Desde otra página, click en "Destinos" del footer iba a `/es/#comparar` y scrolleaba a nada.

Arreglo:
1. Verificar:
   ```bash
   grep -n "#comparar\|#calculadora" components/Sections.tsx
   ```
2. El link del footer debe ser `/${locale}/#calculadora`. El id `#comparar` puede quedarse en la sección de resultados por compatibilidad, pero NADIE debería linkear a él

### 🎯 Causa 5 — Calculadora inversa muestra países no-MVP
Contexto: el array `CORREDORES` en `app/[locale]/calculadora-inversa/content.tsx` debe tener exactamente 4 entradas: dominican_republic, honduras, guatemala, el_salvador.

Arreglo:
1. Verificar:
   ```bash
   grep -c "id: '" app/[locale]/calculadora-inversa/content.tsx
   ```
   Debe dar exactamente 4 (una línea por corredor MVP)
2. Si aparecen colombia/mexico/nicaragua/haiti: eliminar esas líneas. Son corredores válidos en Supabase pero sin scraper ni página editorial — no se exponen en UI hasta que estén listos
3. Si falta `el_salvador`: agregarlo con `{ id: 'el_salvador', moneda: 'USD', simbolo: '$', bandera: '🇸🇻' }`

### 🎯 Causa 6 — En páginas de país el botón no scrollea
Contexto: /honduras, /guatemala, etc. renderizan el mismo `<Comparador />` que expone `id="calculadora"` en el hero. Si el botón no funciona ahí pero sí en home, algo raro pasa.

Arreglo:
1. DevTools → Elements → buscar `id="calculadora"` en el DOM de `/es/honduras`. Debe aparecer 1 vez
2. Si no aparece: `pais-content.tsx` probablemente no está usando `<Comparador />` sino un fork — revisar imports
3. Si aparece pero el botón sigue sin hacer nada: abrir Console, click el botón, debería loguearse el error o el scroll. El handler es `scrollToCalculator` — buscar en devtools si hay un throw

### 🎯 Causa 7 — JavaScript del botón no se hidrata
Contexto: `CTASection` se monta via `dynamic(... LazyBelow ...)` en `app/[locale]/page.tsx`. Si el bundle falla en runtime, el `<button>` sin JS no hace nada.

Arreglo:
1. DevTools → Console → buscar errores en el mount
2. DevTools → Network → verificar que el chunk de `LazyBelow` carga con status 200
3. Si el JS no se hidrata, el fallback sería usar `<a href="/${locale}/#calculadora">` que funciona sin JS. Pero requiere CSS scroll-padding-top para compensar el header fixed — agregar a `app/globals.css`:
   ```css
   html { scroll-padding-top: 80px; }
   ```

## Workaround mientras arreglas
- Si el botón no scrollea: el usuario siempre puede subir manualmente a la calculadora en el hero. No bloquea conversión, solo empeora UX
- Si la calculadora inversa muestra países de más: el usuario puede seguir usándola para los 4 del MVP ignorando los demás. Datos son seed estáticos así que no inducen a error grave

## Relacionados
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](../LOGICA_DE_NEGOCIO/04_componentes_react.md) — sección 3quater sobre scrollToCalculator
- [LOGICA_DE_NEGOCIO/10_calculadora_inversa.md](../LOGICA_DE_NEGOCIO/10_calculadora_inversa.md) — calculadora inversa MVP a 4 países
- [20_comparador_ui_roto.md](20_comparador_ui_roto.md) — si el Comparador en sí se rompió (incluyendo el hero que contiene el id)
- [23_ui_polish_regresiones.md](23_ui_polish_regresiones.md) — otras regresiones cosméticas del pulido
