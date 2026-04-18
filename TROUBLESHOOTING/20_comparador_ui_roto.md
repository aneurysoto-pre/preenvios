# 20 — Comparador UI no replica el HTML original

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
La regla del proyecto (CONTEXTO_FINAL 4.2.3) es que el Comparador debe verse idéntico al HTML original de preenvios.com — solo se permite agregar el Preenvíos Score como línea pequeña debajo del rating. Síntomas que indican regresión:
- La tarjeta se ve en 2 filas (logo+nombre arriba, Tasa/Fee/Receive/botón abajo) en lugar del grid horizontal de 5 columnas del HTML
- Falta el badge esquina superior derecha "★ MEJOR OPCIÓN" / "SEGUNDA OPCIÓN" / "⚡ MÁS RÁPIDO" / "💰 MENOR COMISIÓN"
- Los 3 tabs de ordenamiento (Mejor tasa / Más rápido / Menor comisión) no aparecen, o aparecen pero no cambian el orden
- El botón "Enviar ahora" no es azul con hover translateX(3px) sino verde/compacto
- El Preenvíos Score aparece como badge grande coloreado (verde/amarillo/rojo) en lugar de una línea pequeña azul discreta
- El número "Reciben" no es 22px verde-oscuro sino otro tamaño/color
- La caja amarilla inferior no tiene el icono SVG circular ni el texto largo "Importante: ..."
- En <980px la tarjeta no colapsa a 2 columnas con el botón full-width

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — CSS del Comparador falta en globals.css
Contexto: las clases `.cmp-card`, `.cmp-brand`, `.cmp-col`, `.cmp-btn`, `.cmp-sort`, `.cmp-badge`, `.cmp-disclaimer` fueron portadas del index.html a `app/globals.css` con prefijo `.cmp-*`. Si alguien las borra, la tarjeta queda sin estilos.

Arreglo:
1. Verificar bloque CSS presente:
   ```bash
   grep -c "cmp-card" app/globals.css
   ```
   Debe dar >=3 apariciones (.cmp-card base + variantes + responsive)
2. Si falta: restaurar del commit de paridad con HTML original
3. Los colores base (`--color-blue`, `--color-green`, `--color-orange`, `--color-yellow`, `--color-ink-2`) deben existir en `@theme` de globals.css

### 🎯 Causa 2 — Tarjeta pintada con Tailwind en lugar de clases `.cmp-*`
Contexto: alguien editó `components/Comparador.tsx` y reemplazó `className="cmp-card"` por classes Tailwind (`bg-white rounded-[22px] grid ...`). Los estilos aplicados quedan desalineados con el HTML original.

Arreglo:
1. Confirmar en `components/Comparador.tsx` que la `<article>` principal de ResultCard usa la clase `cmp-card` (no Tailwind):
   ```bash
   grep -c "cmp-card" components/Comparador.tsx
   ```
2. Si da 0: revertir a la versión de paridad con HTML original
3. Regla del proyecto: NO reimplementar la card con Tailwind. El diseño vive en globals.css para conservar paridad con index.html

### 🎯 Causa 3 — Sort tabs no cambian el orden
Contexto: los 3 tabs actualizan `sortKey` via `setSortKey('best'|'fastest'|'cheapest')`. El `useMemo` que calcula `ranked` debe depender de `sortKey`.

Arreglo:
1. Verificar en `components/Comparador.tsx`:
   ```bash
   grep -n "sortKey" components/Comparador.tsx
   ```
2. Deben aparecer al menos 5 referencias: definición del state, dependencia del useMemo, y 3 onClick en los botones
3. Si el sort `fastest` no funciona: verificar que `VELOCIDAD_RANK` tiene las keys que devuelve la columna `velocidad` de Supabase (Segundos/Minutos/Horas/Días en es + Seconds/Minutes/Hours/Days en en)

### 🎯 Causa 4 — Preenvíos Score aparece como badge grande (regresión del diseño trivago)
Contexto: el Score debe ser una línea pequeña 11px color azul, NO un badge pill con fondo verde/amarillo/rojo. Esa fue la versión trivago que el usuario rechazó.

Arreglo:
1. Verificar en `components/Comparador.tsx` que el Score se renderiza como `<div className="score">` dentro de `.cmp-brand-info`:
   ```bash
   grep -A 1 'className="score"' components/Comparador.tsx
   ```
2. Debe ser texto plano "Preenvíos Score <b>N/100</b>", no un span con background color
3. En globals.css la regla `.cmp-brand-info .score` debe usar `font-size: 11px; color: var(--color-blue)` — sin `background-color`

### 🎯 Causa 5 — Badges aparecen como pseudo-elemento ::before con contenido hardcoded en español
Contexto: una versión anterior usaba `.cmp-card.best::before { content: "★ MEJOR OPCIÓN" }`. Eso rompe i18n porque los usuarios en /en verían el texto en español. El fix fue usar un `<span className="cmp-badge best">` con texto de traducción.

Arreglo:
1. Verificar que no hay `::before` con content hardcoded:
   ```bash
   grep -n "::before" app/globals.css | grep -i "content"
   ```
2. No debería haber matches en `.cmp-card.*::before`. Si aparecen, reemplazar por `.cmp-badge` styles
3. El componente debe renderizar `{badgeLabel && <span className={\`cmp-badge ${badgeClass}\`}>{badgeLabel}</span>}`

### 🎯 Causa 6 — Layout roto solo en mobile (<640px o <980px)
Contexto: el CSS tiene media queries específicas que reconfiguran el grid. Si alguien las borra, la card se ve amontonada en mobile.

Arreglo:
1. Verificar en globals.css presencia de ambas media queries:
   ```bash
   grep -nE "max-width:\s*(640|980)px" app/globals.css
   ```
2. Deben aparecer 2 bloques: `@media (max-width: 980px)` y `@media (max-width: 640px)`
3. Dentro del 980px: `.cmp-card { grid-template-columns: 1fr 1fr; }`, `.cmp-brand { grid-column: 1 / 3; }`, `.cmp-btn { grid-column: 1 / 3; width: 100%; }`
4. Dentro del 640px: `.cmp-logo { width: 42px; height: 42px; }`, `.cmp-brand-info .name` con ellipsis

### 🎯 Causa 7 — Link "Disclaimers" del footer apunta a 404
Contexto: la página `app/[locale]/disclaimers/` debe existir. Es net-new sobre el HTML original pero se mantiene porque centraliza los 6 disclaimers FTC.

Arreglo:
1. `ls app/[locale]/disclaimers/` — debe listar `page.tsx` y `content.tsx`
2. Si falta: restaurar del commit que creó la página

## Workaround mientras arreglas
Si el usuario reporta la tarjeta rota visualmente pero el fetch y ranking funcionan, no hay workaround — es 100% visual. Revertir al último commit estable con paridad al HTML original.

## Relacionados
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](../LOGICA_DE_NEGOCIO/04_componentes_react.md) — estructura final del Comparador
- [LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md](../LOGICA_DE_NEGOCIO/02_algoritmo_ranking.md) — lógica del Preenvíos Score que se muestra discreto
- [19_ranking_orden_inesperado.md](19_ranking_orden_inesperado.md) — si el sort cambia el orden de forma incorrecta
- [05_vercel_deploy_falla.md](05_vercel_deploy_falla.md) — si el deploy nuevo nunca termina
