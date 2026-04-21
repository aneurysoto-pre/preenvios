# AUDIT MOBILE-FIRST — PreEnvios.com

**Fecha:** 2026-04-21
**Contexto:** Pre-Fase 1 del mandato de refactor arquitectural mobile-first sobre shadcn/ui foundation (Fase 0.1 completada en commit `679bd23`).
**Objetivo:** mapear estado mobile-first de todos los componentes UI, diagnosticar la causa raíz del scroll horizontal regresivo, proponer orden de refactor para aprobación del founder.

---

## 1. Diagnóstico del scroll horizontal regresivo

### Mi hipótesis original (descartada)

Propuse que `OfertasDestacadas.tsx` era el culpable por su uso de `overflow-x-auto scroll-snap-x-mandatory` en un carrusel horizontal. **Hipótesis errónea.**

**Verificación estática:**
- `OfertasDestacadas` se exporta con `{ hidden = true }` por default
- En `app/[locale]/page.tsx:60`: `<OfertasDestacadas hidden={true} />`
- En `app/[locale]/[pais]/pais-content.tsx:50`: `<OfertasDestacadas hidden={true} />`
- El componente hace `if (hidden) return null` antes de renderizar

**Conclusión:** OfertasDestacadas nunca se renderiza en producción. No puede ser la causa.

### Nueva hipótesis (fundamentada, pendiente validación DevTools)

**Causa probable #1: gradient decorative cards detrás del search card en Comparador.tsx líneas 344-345:**

```jsx
<div className="absolute inset-[28px_-28px_-28px_28px] bg-blue-soft rounded-[32px] rotate-[4deg] opacity-60" />
<div className="absolute inset-[14px_-14px_-14px_14px] bg-green-soft rounded-[32px] rotate-[2deg]" />
```

**Por qué sospecho de estos:**
- `inset-[28px_-28px_-28px_28px]` = `top:28px right:-28px bottom:-28px left:28px` — el **`right:-28px`** extiende el elemento 28px hacia afuera del wrapper padre por la derecha
- `rotate-[4deg]` + `rotate-[2deg]` — transforman el elemento; en iOS Safari **hay bug conocido** donde elementos con `transform` escapan del clipping de `overflow-hidden` del padre positioned (relevant: WebKit bug 160953, Stack Overflow issues documentados desde 2016)
- El section padre `#calculadora` sí tiene `overflow-hidden`, pero el bug de iOS Safari con transforms puede romper ese clipping

**Causa probable #2: `html { overflow-x: hidden }` + `body { overflow-x: hidden }` en `globals.css`:**

Este es **el parche que tu Regla 4 prohíbe explícitamente**:
> `overflow-x: hidden` como parche en `body` o `html` (si hay scroll horizontal, es que algo es más ancho de 100vw y hay que arreglarlo de raíz, no ocultarlo)

Está en `app/globals.css` líneas 35-36. Mientras estuvo en su lugar, los gradient cards rotados se clippeaban globalmente. Si algún cambio reciente (mío o de antes) rompió temporalmente el clipping del html/body, el scroll horizontal aflora.

**Opción:** que el `overflow-x: hidden` global se haya comportado inconsistente en Chrome iOS vs Safari iOS, exponiendo el bug solo en ciertos navegadores y no otros — consistente con reporte del founder de que "se arregló antes y volvió".

### Validación pendiente

El análisis estático es mi mejor pista sin acceso a DevTools en dispositivo real. **Antes del refactor del Comparador, recomiendo:**

1. Abrir el deployment en Safari iOS real del founder
2. Abrir Safari Developer → Web Inspector desde Mac (o Chrome DevTools remote debugging)
3. En el Elements tab, buscar qué elemento concreto cause `document.documentElement.scrollWidth > window.innerWidth`
4. Confirmar si son los gradient cards del Comparador o algo más

**Si resulta ser otro componente** no listado en este audit, actualizamos el orden.

### Fix arquitectural propuesto (no parche)

Cuando refactorice el Comparador sobre shadcn/ui:
- **Opción A:** wrapper del search card con `overflow-hidden` explícito + `isolate` para crear un nuevo stacking context que contenga los gradient decoratives independientemente del bug de iOS
- **Opción B:** reemplazar los decoratives rotados con `clip-path` (más confiable en iOS que `overflow-hidden` con transforms)
- **Opción C:** eliminar los decoratives rotados — el search card ya tiene suficiente visual weight con shadow y border

**Al final del refactor completo (después de componente #7), remover el `overflow-x: hidden` de `html` y `body` y validar que el scroll horizontal siga controlado sin ese parche.** Si vuelve, hay regresión nueva que localizar. Si no vuelve, el refactor tuvo éxito arquitectural.

---

## 2. Mapa de componentes

### Estados:
- 🚨 **CRÍTICO**: desktop-first con parches graves, causa bugs conocidos, bloquea refactor
- ⚠️ **DESKTOP-FIRST CON PARCHES**: estructura desktop con `md:`/`hidden` switches para mobile; hybrid feel
- ✅ **MOBILE-FIRST OK**: estructura limpia, no requiere refactor arquitectural (puede mejorar en detalles)
- 💤 **INACTIVO/OCULTO**: no se renderiza en producción; refactor aplazable

### Tabla de componentes

| Componente | Archivo | Estado | Bugs/Riesgos |
|---|---|---|---|
| Comparador | `components/Comparador.tsx` (658 L) | 🚨 **CRÍTICO** | Sospechoso #1 scroll horizontal (gradient cards rotate + inset negativo); 4 usos de `md:hidden`/`hidden md:block`; country picker mobile modal custom con `fixed inset-0 + 100dvh` (mis parches fallidos); grid desktop `lg:grid-cols-[1.1fr_.9fr]`; hero text amontonado en mobile |
| Nav | `components/Nav.tsx` (189 L) | ⚠️ **DESKTOP-FIRST CON PARCHES** | 3 usos de `md:hidden`/`hidden md:flex`; mobile menu = `fixed top-[48px] max-h-[calc(100vh-48px)]` custom; desktop dropdown del Destinos con `absolute` — funcional, pero paralelo a mobile con código duplicado |
| Sections | `components/Sections.tsx` (260 L) | ⚠️ **DESKTOP-FIRST CON PARCHES** | Contiene 5 sections (LogoStrip, WhySection, StepsSection, CTASection, FAQSection) + Footer; grids `md:grid-cols-3` puros sin mobile-first intent; Footer grid `lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]` complejo; 1 uso `hidden md:block`; decorative circles en CTASection `-top-[150px] -right-[100px]` contenidos por parent con `overflow-hidden` (OK) |
| TasasReferencia | `components/TasasReferencia.tsx` (129 L) | ⚠️ **DESKTOP-FIRST** | Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — ya es mobile-first a nivel de layout, pero las cards usan `whitespace-nowrap overflow-hidden text-ellipsis` que puede causar truncate agresivo en mobile; padding/tipografía pensados para desktop primero |
| BannersPatrocinados | `components/BannersPatrocinados.tsx` (132 L) | ⚠️ **DESKTOP-FIRST** | Grid `grid-cols-2 lg:grid-cols-4` — en mobile muestra 2 columnas apretadas con `h-[160px]` fijo; no hay carrusel; cards con iconos 32px pierden peso visual |
| OfertasDestacadas | `components/OfertasDestacadas.tsx` (56 L) | 💤 **INACTIVO** | `hidden={true}` por default; no se renderiza en landing ni pais pages; cuando se active, su carrusel horizontal tendría que ser revisado |
| AlertaForm | `components/AlertaForm.tsx` (111 L) | ✅ **MOBILE-FIRST OK** | `flex-col sm:flex-row` — único componente con estructura realmente mobile-first; `w-full`, `min-w-0` correctos; refactor arquitectural no requerido |
| LegalPage | `components/LegalPage.tsx` (37 L) | ✅ **OK** | Wrapper simple `max-w-[820px] w-full mx-auto`; usado por páginas legales; no requiere refactor |
| ui/button (shadcn) | `components/ui/button.tsx` | ✅ **RECIÉN AGREGADO** | Primitivo shadcn nuevo; base para botones del refactor |
| Admin panel | `app/[locale]/admin/panel.tsx` | ⚠️ **DESKTOP-ONLY** | Panel interno (solo founder accede); mobile no es prioridad; fuera del scope del refactor público |

### Páginas consumidoras

| Página | Usa | Nota |
|---|---|---|
| `app/[locale]/page.tsx` (landing) | Nav, Comparador, BannersPatrocinados, OfertasDestacadas (hidden), TasasReferencia, Sections, Footer | Entry principal |
| `app/[locale]/[pais]/pais-content.tsx` | Nav, Comparador (con `defaultCorredor`), BannersPatrocinados, TasasReferencia, Sections lazy, Footer | 12 rutas SSG (6 países × 2 locales); **CRÍTICO preservar API de `Comparador` durante refactor** |
| `app/[locale]/calculadora-inversa/content.tsx` | Nav, Footer, standalone | Simple, no bloquea refactor |
| `app/[locale]/tasa/[pair]/tasa-content.tsx` | Nav, Footer, AlertaForm, Recharts | Simple, no bloquea refactor |
| `app/[locale]/operadores/[slug]/operador-content.tsx` | LegalPage + prose | OK |
| `app/[locale]/{legal pages}/content.tsx` | LegalPage + prose | OK |
| `app/[locale]/nosotros/content.tsx`, `contacto/content.tsx` | Nav, Footer + contenido propio | Probablemente OK, no leídos exhaustivamente |

---

## 3. Orden de refactor propuesto

### Justificación del orden

Criterios aplicados (por prioridad descendente):
1. **Severidad de bugs conocidos** — scroll horizontal, country picker roto
2. **Reutilización de primitivas** — refactorizar primero lo que crea primitivas reutilizables (Sheet compartido)
3. **Impacto en superficies consumidoras** — Comparador se usa en 13 páginas; su refactor desbloquea validación del resto
4. **Desde el más complejo al más simple** — así el primer refactor establece patrones que los siguientes reusan

### Orden

| # | Componente | Razón | Primitivas shadcn clave | Estimación |
|---|---|---|---|---|
| 1 | **Comparador** | Causa #1 del scroll horizontal (gradient decorative fix); country picker mobile completamente roto; establece Sheet reutilizable; usado en 13 páginas | Sheet, Dialog, Command (search+list), Form, Button, Input | 5-7h |
| 2 | **Nav** | Burger menu reutiliza el Sheet del paso 1; drawer mobile + dropdown desktop bien separados | Sheet, NavigationMenu, DropdownMenu, Button | 2-3h |
| 3 | **Sections** | FAQ, Steps, CTA, Why, LogoStrip, Footer — todos mobile-first con Accordion shadcn para FAQ | Accordion (FAQ), Button, sin grid hacks | 3-4h |
| 4 | **TasasReferencia** | Grid mobile-first limpio; cards sin whitespace-nowrap (permitir wrap con balance) | Card (propio o custom) | 1-2h |
| 5 | **BannersPatrocinados** | Carousel mobile (Embla via shadcn Carousel) + grid desktop; evita el `h-[160px]` fijo de mobile | Carousel | 1-2h |
| 6 | **AlertaForm** | Ya mobile-first; revisar uso de Input/Button shadcn para consistencia visual; mejora menor | Input, Button, Alert (states) | 1h |

**Subtotal:** 13-19 horas de trabajo enfocado. En jornadas de 4h típicas = 4-5 sesiones.

### Lo que NO entra en este mandato

| Componente | Razón |
|---|---|
| **OfertasDestacadas** | Oculto (`hidden={true}`). Refactor cuando se active con sponsors reales. |
| **LegalPage** | Wrapper simple sin bugs ni hybrid feel. Funcional. |
| **Páginas legales (content.tsx)** | Prose estáticos; `prose-legal` CSS funciona bien. |
| **Admin panel** | Interno, solo founder, no se ve en producción pública. |
| **Calculadora inversa, tasa, blog, wiki, operadores, nosotros, contacto** | Páginas simples que consumen el Nav + Footer + componentes de los pasos 1-6. Se benefician del refactor automáticamente. Si aparece bug específico, se trata al final. |

---

## 4. Cambios transversales necesarios

Durante el refactor se tocarán estos archivos además de los componentes principales:

| Archivo | Propósito |
|---|---|
| `app/globals.css` | Remover `overflow-x: hidden` de `html`/`body` al final (validación de que el refactor arquitectural funcionó sin ese parche) |
| `lib/hooks/useMediaQuery.ts` (nuevo) | Hook compartido para detectar viewport cuando shadcn no lo resuelva con CSS solo (ej. render condicional Sheet vs Dropdown) |
| `lib/hooks/useComparador.ts` (nuevo) | Lógica compartida del Comparador (estado de corredor, monto, fetch de precios, cookie) separada de la UI |
| `components/ui/{sheet,dialog,dropdown-menu,command,accordion,carousel,form,input,card,alert}.tsx` | Primitivos shadcn agregados on-demand vía `npx shadcn add <component>` |

---

## 5. Reglas auto-impuestas para el refactor

Además de las del mandato del founder, me comprometo a:

1. **Validar cada commit en Chrome DevTools emulación mobile (iPhone 14 Pro 390px + iPad Mini 768px + Desktop 1440px)** antes de push
2. **Preservar la API pública del componente** (props que reciben páginas consumidoras) o actualizar consumidores en el mismo commit
3. **No usar `md:hidden` como switch** (Regla 4 del founder) — dos componentes separados con composition si los patterns UX difieren
4. **Typecheck + build + lint pasan** antes de cada commit
5. **Si detecto que un refactor requiere un parche temporal, paro y escalo** antes de committear — no entrego código con guardrails escondidos

---

## 6. Checkpoint

**Espero OK explícito del founder para:**
1. ✅ El orden propuesto (Comparador → Nav → Sections → TasasReferencia → BannersPatrocinados → AlertaForm)
2. ✅ El scope excluido (OfertasDestacadas, LegalPage, Admin, páginas simples)
3. ✅ La hipótesis del scroll horizontal (gradient decorative cards + bug iOS Safari con transforms bajo overflow-hidden)
4. ✅ La validación final (remover `overflow-x: hidden` de html/body al terminar todos los commits — si el scroll no vuelve, el refactor funcionó; si vuelve, hay regresión puntual)

**No toco Fase 1 (ningún refactor) hasta recibir OK explícito.**

Si hay algún punto que quieras ajustar (orden distinto, incluir/excluir algún componente, más validación antes de empezar, etc.), lo ajusto antes de arrancar.
