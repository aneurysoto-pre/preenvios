# Proceso 30 — Landing editorial por país (modelo A Magazine)

## Descripción

Desde el 2026-04-24 las páginas `/[locale]/[pais]` y `/[locale]/[pais]/[monto]`
pueden mostrar un **landing editorial extendido** debajo del disclaimer del
Comparador — título editorial, stats macroeconómicos con fuentes, grid de
ciudades destacadas, warning cards de errores comunes, FAQ especializado por
país y un bloque de fuentes citadas.

El primer país con landing editorial es **Honduras** (port del HTML prototipo
en `C:\Users\ethan\prototipo-honduras\modelo-A-magazine.html`, validado con el
founder vía iteraciones visuales). Los 5 países MVP restantes
(`dominican_republic`, `guatemala`, `el_salvador`, `colombia`, `mexico`) siguen
renderizando el layout legacy (`TasasReferencia + LazyBelow`) hasta que cada
uno se porte por separado.

Commits del port inicial (branch `feat/landing-editorial-honduras`, mergeable
a main cuando el founder apruebe visualmente en preview URL):

| # | Hash | Alcance |
|---|------|---------|
| 1 | `7955b1e` | `feat(fonts)`: Fraunces serif → clase Tailwind `font-editorial` |
| 2 | `c24ad43` | `feat(db)`: migration 011 agrega `corredor` + `idioma` a `alertas_email` |
| — | `b1febfc` | `docs(proceso 27)`: checklist migraciones + incidente 2026-04-24 |
| 3 | `2d915f8` | `feat(api)`: `/api/alertas` acepta `corredor` + `idioma` |
| 4 | `92bf8a4` | `docs(tracking)`: contrato de `suscripcion_alertas` extendido |
| 5 | `5101b08` | `feat(lib)`: `getTasaBancoCentral` server helper |
| 6 | `4d9c92b` | `feat(data)`: `data/corredores/honduras.ts` + types + registry |
| 7 | `ba2bf9c` | `feat(i18n)`: `landing.editorial.honduras.*` ES + `comingSoon` EN |
| 8 | `7e0c53e` | `feat(components)`: `landing-editorial/` (AlertaInlineForm + LandingEditorial + EnglishComingSoon) |
| 9 | `b500446` | `feat(pais)`: integración feature-flag en `pais-content.tsx` |
| 10 | (este) | `docs`: este documento + update CONTEXTO_FINAL |

## Arquitectura

### Feature flag "por datos"

La decisión de renderizar landing editorial vs legacy se toma a runtime en
[pais-content.tsx:55](../app/%5Blocale%5D/%5Bpais%5D/pais-content.tsx#L55) con
la función [`getCorredorContent(corredorId)`](../data/corredores/index.ts) del
registry.

```tsx
const editorialData = getCorredorContent(pais.corredorId)

{editorialData ? (
  <LandingEditorial data={editorialData} tasa={initialTasa} locale={...} slugEs={...} />
) : (
  <>
    <TasasReferencia />
    <LazyBelow />
  </>
)}
```

**Ventaja:** ningún país existente se rompe con el deploy del port. El
"upgrade" a editorial es gradual, país por país, con un único cambio (agregar
entry al registry) que Next.js detecta sin config adicional.

**Desventaja:** inconsistencia visual temporal mientras solo algunos países
tienen editorial (6 países MVP, 1 con editorial al cierre del port inicial =
17% coverage). Se cierra cuando los 5 restantes completen su port.

### Patrón híbrido de contenido

Decidido con founder 2026-04-24 (ver `project_country_page_structure.md` en
memoria):

| Tipo de contenido | Vive en | Ejemplo |
|---|---|---|
| IDs, slugs, nombres propios, números pre-formateados, emojis, gradientes CSS | `data/corredores/<pais>.ts` | `corredorId: 'honduras'`, `emoji: '🏝️'`, `stats.remesasAnuales: '$8.5B'`, `nombre: 'Tegucigalpa'` |
| Textos narrativos traducibles, labels de stats, FAQ, CTAs, descripciones | `messages/{locale}.json` → `landing.editorial.<pais>.*` | H2, párrafos editoriales, preguntas del FAQ, texto de los errores |

El data file **no** tiene estructura `{ es: ..., en: ... }`. Los textos
traducibles viven en `messages/*.json` por coherencia con el resto del sitio
(next-intl sigue siendo la única source of truth para i18n).

### Capas

```
┌─────────────────────────────────────────────────────────┐
│  page.tsx (Server Component)                            │
│  - setRequestLocale(locale)                             │
│  - await getTasaBancoCentral(pais.codigoPais)  ◄─ Commit 5
│  - <PaisContent initialTasa={tasa} />                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  pais-content.tsx (Client Component)                    │
│  - getCorredorContent(corredorId)  ◄─ Commit 6 feature-flag
│  - if hasEditorial → <LandingEditorial />               │
│  - else → <TasasReferencia/> + <LazyBelow/>             │
└────────────────────┬────────────────────────────────────┘
                     │ (solo si hasEditorial)
┌────────────────────▼────────────────────────────────────┐
│  components/landing-editorial/LandingEditorial.tsx      │
│  - Componente único bilingüe (8 secciones)              │
│  - localeBcp47 = `${locale}-${codigoPais.toUpperCase()}`│
│    (ej. 'es-HN', 'en-MX' — para Intl.DateTimeFormat)    │
│                                                          │
│  Secciones 0+6 incluyen <AlertaInlineForm idioma={locale}/>│
│  Todos los textos via useTranslations('landing.editorial.<pais>') │
│  Bilingüe activado 2026-04-25 (Fase 11.1):              │
│  EnglishComingSoon.tsx eliminado, locale propagado.     │
└─────────────────────────────────────────────────────────┘
```

## Cómo agregar un país nuevo al editorial

Checklist de 5 items por país. Tiempo estimado: 1-3 horas (principalmente
escritura de copy editorial, no código).

### 1. Crear `data/corredores/<pais>.ts`

Copiar la estructura de [honduras.ts](../data/corredores/honduras.ts) y
reemplazar los valores estructurales. Campos:

- `corredorId` — matches `PAISES_MVP.corredorId`
- `banderaEmoji`, `codigoPais`, `monedaCodigo`, `monedaSimbolo`
- `lastEditorialUpdate` — fecha ISO del día en que se finaliza el copy
- `stats` — 4 KPI macro (remesas anuales, % PIB, diáspora USA, ranking regional)
- `ciudades` — array de 6 ciudades destacadas con slug, nombre propio,
  departamento, `tipoKey`, población, gradient CSS, emoji, flag `esPrincipal`
- `fuentes` — array de strings con las fuentes citadas (BCH, INE, US Census,
  CEPAL, etc.)

### 2. Agregar al registry en `data/corredores/index.ts`

```ts
import { miPais } from './mi-pais'

const CORREDORES_CONTENT: Record<string, CorredorContent> = {
  honduras,
  mi_pais: miPais,  // ← agregar aquí
}
```

### 3. Agregar textos i18n en `messages/es.json`

Copiar el subtree `landing.editorial.honduras.*` y renombrar a
`landing.editorial.<corredorId>.*`. Reemplazar los textos. Claves esperadas:

- `seccion0.*` — labels del card tasa + form alertas
- `stats.*` — tag, title, lede + 4 pares (label + subtitle)
- `editorial.*` — tag, 3 líneas de H3, p1, p2 (con rich text `<strong>` + `<highlight>`)
- `ciudades.*` — tag, title, lede, `principalBadge`, 6 `tipo.<tipoKey>`
- `errores.items` — array de 6 `{ titulo, texto }`
- `faq.items` — array de 7 preguntas. La que corresponde a tiempos de entrega
  usa formato especial `{ q, aIntro, aBullets: string[] }`, las demás
  `{ q, a }`
- `cta.*` — tag, 2 líneas de H2, lede, `ctaPrimary`, `checklistHeading`,
  `checklist[6]`
- `fuentes.*` — label + text con placeholder `{fechaActualizacion}`

### 4. Validar JSON

```bash
node -e "JSON.parse(require('fs').readFileSync('messages/es.json','utf8'))"
```

Cualquier trailing comma o comilla mal escapada rompe next-intl para **todos
los locales** — no solo el país nuevo.

### 5. Smoke test visual en preview URL

Push a feature branch → abrir
`preenvios-git-<branch>-aneurysoto-pres-projects.vercel.app/es/<pais>` →
validar:

- Sección 0 muestra tasa del banco central del país
- Form alertas submit exitoso (revisar `alertas_email` en Supabase preview
  con `corredor='<pais>'`)
- GA4 Real-Time muestra `suscripcion_alertas` con `location='hero'` o
  `'cta_final'`
- FAQ accordion abre/cierra
- Links de ciudades scrollean al `#calculadora` (id real del hero del
  Comparador). El offset del Nav fixed lo absorbe `scroll-mt-14` aplicado
  al `<section id="calculadora">` en `Comparador.tsx` (Tailwind
  `scroll-margin-top: 3.5rem` = 56px = altura exacta del Nav)
- Botón "Ver comparador" de Sección 6 CTA scrollea al `#calculadora`
  vía `<button onClick={scrollToCalculator}>` (handler local en
  `LandingEditorial.tsx`, espejo del patrón canónico de
  `components/Sections.tsx::CTASection`)

## Tech debts documentados

Items que **no** se arreglan en este port pero quedan identificados para
sesiones futuras:

1. **Duplicación del tipo `TasaBancoCentral`** — existe en
   [lib/tasas-banco-central.ts](../lib/tasas-banco-central.ts) y en
   [components/TasasReferencia.tsx](../components/TasasReferencia.tsx) (copia
   local). Unificar: importar desde `lib/` en TasasReferencia. 5 min.

2. **Cast `as CorredorId`** — en
   [LandingEditorial.tsx](../components/landing-editorial/LandingEditorial.tsx)
   `data.corredorId` (declarado `string` en `CorredorContent`) se castea a
   `CorredorId` en el call site de `AlertaInlineForm`. Mejor: cambiar
   `CorredorContent.corredorId` a `CorredorId` (tipo fuerte). Requiere
   importar `CorredorId` desde `lib/schemas/alerta` en
   `data/corredores/types.ts` o mover el tipo a `lib/paises.ts` (más limpio
   conceptualmente, pero refactor mayor). 15-30 min.

3. **Inglés (EN) — RESUELTO 2026-04-25 (Fase 11.1).** Los 6 corredores
   tienen traducción completa en `messages/en.json` (300 strings, 50 × 6).
   `EnglishComingSoon.tsx` fue eliminado; `LandingEditorial.tsx` es ahora
   un componente único bilingüe con `locale` propagado. Si en el futuro
   se agrega un corredor nuevo, hay que escribir copy ES + EN paralelo
   en messages — no hay fallback automático que cubra la falta de EN.

4. **Links de ciudades apuntan a `#calculadora`** — decidido 2026-04-25
   (decisión N3a-bridge-B). Los 6 tiles de ciudades linkean al hero del
   Comparador como bridge hasta que las páginas
   `/es/<pais>/<ciudad>` existan en el roadmap. Se mantienen como
   `<a href>` (no `<button>`) precisamente porque van a navegar a otras
   URLs cuando existan; convertirlos a `<button onClick>` ahora forzaría
   un doble refactor. Bridge implementado:
   - `href="#calculadora"` (id real, antes era typo `#comparador` que no
     existía y rompía el scroll silenciosamente)
   - Offset del Nav fixed absorbido por `scroll-mt-14` (Tailwind
     `scroll-margin-top: 3.5rem` = 56px) aplicado al `<section
     id="calculadora">` en
     [Comparador.tsx](../components/Comparador.tsx). Es CSS puro, no
     estorba a otros casos.

   **Cuando existan las páginas individuales**: swap a
   `href={\`/\${locale}/\${slugPais}/\${ciudad.slug}\`}` en
   [LandingEditorial.tsx:ciudades.map](../components/landing-editorial/LandingEditorial.tsx).
   El `scroll-mt-14` se queda en el Comparador (no estorba) y sigue
   sirviendo si algún otro link interno apunta al `#calculadora`.

   **Por qué Section 6 CTA sí usa `<button onClick>` y no `<a href>`**:
   ese CTA NO va a navegar a otra página — su única función es scrollear
   internamente al hero del Comparador. Patrón canónico documentado en
   [04_arquitectura_comparador.md](./04_arquitectura_comparador.md) y
   [TROUBLESHOOTING/25](../TROUBLESHOOTING/25_anchor_links_intra_pagina_y_nav_fixed.md).

5. **Helper `getTasaBancoCentral` usa `React.cache()` sin TTL
   cross-request** — si el landing se renderiza con SSG (no ISR), cada
   build queda fijo con la tasa de ese momento hasta el próximo build. Si
   se quiere actualización automática, agregar `export const revalidate =
   3600` a las pages o envolver con `unstable_cache` en el helper.

## Regla arquitectónica reforzada durante el port

### Incidente 2026-04-24 — scroll horizontal en /es/honduras

Post-deploy inicial a la preview URL, el founder reportó scroll horizontal
**solo** en `/es/honduras`. El bug NO aparecía en main (sin landing editorial)
ni en los otros 5 países MVP (tampoco tenían landing editorial).

**Intento de fix fallido** (commit `155680a`): agregar `relative` al `<form>`
para anclar el honeypot `absolute` al form y no al viewport. **NO resolvió el
bug** — era el sospechoso equivocado.

**Diagnóstico correcto** vía bisect sistemático (commits `9bed277`, `fc3401a`,
`9ca5596`):

1. Bisect externo de secciones del `LandingEditorial`: solo Sección 0 activa
   → bug persiste → Sección 0 es el culprit (descarta las otras 7 secciones).
2. Sub-bisect dentro de Sección 0: `BISECT_SUB = 'tasa-only'` (solo card tasa,
   sin `AlertaInlineForm`) → bug desaparece → el `AlertaInlineForm` es el
   culprit.
3. Sub-bisect interno del `AlertaInlineForm`: `BISECT_FORM_OMIT = 'button'`
   (form sin el `<button>` submit) → bug desaparece → el `<button>` en modo
   compact es el culprit específico.

**Causa raíz real**: el `formLayoutClass` del compact mode era `'flex gap-2'`
(row en mobile), combinando:

- `<input type="email" className="flex-1 min-w-0 ...">` — teóricamente debería
  colapsar al 0, pero Mobile Safari mantiene un `min-content` intrínseco en
  inputs email con autocomplete + placeholder.
- `<button className="... shrink-0 whitespace-nowrap px-4 py-2 ...">` — no
  puede ceder ancho (shrink-0 explícito) ni wrappear el texto.

En mobile estrecho el container `<form>` se expande más allá del viewport
porque ni input ni button pueden ceder suficiente ancho.

### Fix arquitectónico aplicado

Cambiar `formLayoutClass` en [`AlertaInlineForm.tsx`](../components/landing-editorial/AlertaInlineForm.tsx):

```ts
// Antes:
const formLayoutClass = isLarge ? 'flex flex-col sm:flex-row gap-2' : 'flex gap-2'

// Después (fix):
const formLayoutClass = 'flex flex-col sm:flex-row gap-2'
```

Mobile → stacked (input encima, button debajo), sin conflicto de widths.
Desktop (≥640px) → side-by-side como siempre. El form grande (`isLarge`, usado
en Sección 6) ya usaba este patrón desde el inicio — aquí lo propagamos al
compact para consistencia.

**Regla consolidada** — ver CONTEXTO_FINAL § Reglas arquitectónicas de CSS/DOM:

- **Regla 13**: PROHIBIDO `overflow-x: hidden` en cualquier scope (global,
  section, card). Si algo causa scroll horizontal, el fix correcto es
  encontrarlo y corregirlo en su raíz — nunca taparlo.
- **Regla 14**: Forms inline con `<input>` + `<button>` van SIEMPRE stacked
  en mobile (`flex flex-col sm:flex-row gap-2`), NUNCA `flex gap-2` (row en
  mobile). Regla nacida de este mismo incidente.

## Replicación del template a los 5 corredores faltantes

**Decidido 2026-04-25** — Honduras es el template canónico. Los 5
corredores restantes (Dominican Republic, Guatemala, El Salvador,
Colombia, México) replican al 100% sin tocar código del componente. La
arquitectura está pensada para esto desde el día 1.

### Pasos por cada corredor nuevo

Para activar `<corredor>` (ej. `guatemala`):

1. **Crear `data/corredores/<corredor>.ts`** con el shape `CorredorContent`
   (stats, ciudades, gradientes, fuentes, banderaEmoji, codigoPais ISO-2,
   monedaCodigo, monedaSimbolo, lastEditorialUpdate). Copiar
   `honduras.ts` como base y reemplazar valores.

2. **Registrar en `data/corredores/index.ts`** el import + entry en
   `CORREDORES_CONTENT`. Esto activa el feature flag — sin esta línea,
   `getCorredorContent()` devuelve `null` y la página cae al fallback
   `TasasReferencia + LazyBelow`.

3. **Agregar bloque `landing.editorial.<corredor>.*`** en
   `messages/es.json` siguiendo el shape exacto de `honduras` (~150
   strings: 7 FAQs, 6 errores, 6 ciudades types, párrafos editoriales,
   stats labels, CTAs, fuentes).

4. **Sembrar tasa banco central** en Supabase tabla
   `tasas_banco_central` (1 row con `codigo_pais` matching el de
   `data.codigoPais`). Sin row, Sección 0 muestra "—" y sigla "BCH"
   hardcoded como fallback. Aplicar en **prod + preview**.

5. **Smoke test** en preview URL: tasa correcta, form alertas funciona,
   FAQ accordion abre/cierra, tiles de ciudad scrollean al
   `#calculadora`, schema.org JSON-LD presente.

### Lo que NO hay que tocar al replicar

- `LandingEditorial.tsx` (componente reusable con prop `data`)
- `AlertaInlineForm.tsx` (parametrizado por `corredor`)
- `Comparador.tsx` (ya soporta los 6 corredores via `pais` URL)
- Schemas, RLS policies, GA4 events (todos parametrizados)

### Por qué `Intl.DateTimeFormat` ahora es dinámico

Originalmente `LandingEditorial.tsx:52` tenía `'es-HN'` hardcoded. Para
que la fecha "Actualizado al 25 de abril de 2026" use el locale BCP 47
correcto del país (`es-HN`/`es-DO`/`es-GT`/`es-SV`/`es-CO`/`es-MX`), se
deriva ahora de `data.codigoPais`:

```ts
const localeBcp47 = `es-${data.codigoPais.toUpperCase()}`
const dateFormatter = new Intl.DateTimeFormat(localeBcp47, { ... })
```

Fix 2026-04-25, antes de replicar a los otros 5 corredores. Sin este
cambio, todos los países mostrarían fecha en formato hondureño (en
español la diferencia es mínima, pero la práctica correcta es alinear
locale con país).

### Trade-off real al replicar

El código replica al 100%. **El trabajo real está en el contenido
editorial**: ~150 strings × 5 corredores = ~750 strings de copy
narrativo (FAQs específicos del país, errores comunes locales, ciudades
destacadas con sus gradientes/emojis, fuentes oficiales). Eso lo escribe
el founder o IA con prompt curated — no es trabajo de Claude Code
solo.

## Relacionados

- Proceso 02 — `paises.ts` — schema base de `PaisData`
- Proceso 03 — Supabase tablas (`tasas_bancos_centrales`, `alertas_email`)
- Proceso 27 — DB preview vs producción (relevante para migration 011 del
  Commit 2 de este port)
- Memoria `feedback_feature_branch_no_main.md` — regla que forzó el rollback
  de los 4 primeros commits del port (pusheados a main por error) + reseteo
  del trabajo a feature branch
- Memoria `project_country_page_structure.md` — regla de "construir desde el
  disclaimer hacia abajo" que guió toda la arquitectura del port
