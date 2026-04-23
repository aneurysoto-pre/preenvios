# Proceso 25 — URLs dinámicas /{locale}/{pais}/{monto} (Fase 10 — SEO post-cutover)

## Descripción

Extensión de las páginas editoriales por país (Proceso 17) con un tercer segmento de URL que
captura el monto que el usuario quiere enviar. El objetivo es indexar en Google queries
transaccionales con intención clara ("enviar 200 dólares a Honduras", "send 500 USD to
Mexico") y aterrizar al usuario en una página con el Comparador pre-rellenado y los resultados
ya calculados debajo del hero.

Implementado el 2026-04-22 como parte de Fase 10 (mejoras SEO post-cutover DNS).

## Regla única

**La URL solo cambia cuando el usuario hace click en el botón "Comparar".** Nunca antes:

- Cambiar de país en el dropdown **NO** cambia URL.
- Escribir/editar el monto en el input **NO** cambia URL.
- Hacer foco en el input **NO** cambia URL.

Esto es intencional: la URL se mantiene estable mientras el usuario experimenta, y se
promueve a URL indexable solo cuando el usuario confirma que quiere comparar con ese monto.

## Estructura de URLs

Formato: `/{locale}/{pais}/{monto}` — `locale ∈ {es, en}`, `pais ∈ slugs de PAISES_MVP`,
`monto ∈ entero [10, 10000]`.

### URLs pre-renderizadas (SSG, indexables)

4 montos × 6 países × 2 locales = **48 URLs nuevas** en el sitemap con priority 0.7.

Montos canónicos indexables: **100, 200, 500, 1000** USD. Elegidos porque cubren los rangos
de búsqueda más frecuentes según volumen histórico de queries de remesas:

| Monto | Racional |
|-------|----------|
| 100   | piso típico ("mandar 100 dólares a...") |
| 200   | monto medio/frecuente — mayor volumen de queries |
| 500   | monto alto recurrente |
| 1000  | tope frecuente antes de flags AML |

Ejemplos de URLs SSG:

- `/es/honduras/100`, `/es/honduras/200`, `/es/honduras/500`, `/es/honduras/1000`
- `/en/honduras/100`, `/en/honduras/200`, …
- `/es/republica-dominicana/200`, `/en/dominican-republic/200`

### URLs on-demand (dynamicParams: true, **no** listadas en sitemap)

Enteros en [10, 10000] que no están en la lista SSG (ej. `/es/honduras/150`, `/es/guatemala/750`)
se renderizan on-demand cuando alguien las visita (usuario que compartió la URL, o que llegó
via click en el Comparador). Funcionan idénticamente a las SSG pero no están explícitamente
listadas en el sitemap — Google puede indexarlas si descubre el link, pero la prioridad SEO
está en las 48 canónicas.

## Validación del parámetro `monto` (server-side)

El handler en `app/[locale]/[pais]/[monto]/page.tsx` valida antes de renderizar:

| Input de URL | Acción |
|--------------|--------|
| `200` (entero válido en rango) | render directo |
| `200.5` (decimal) | redirect 308 → `/{locale}/{pais}/201` (Math.round) |
| `0200` (no canónico) | redirect 308 → `/{locale}/{pais}/200` |
| `5` (< 10) | redirect 308 → `/{locale}/{pais}` (sin monto) |
| `20000` (> 10000) | redirect 308 → `/{locale}/{pais}` (sin monto) |
| `abc` (no numérico) | redirect 308 → `/{locale}/{pais}` |
| `-200` (signo) | redirect 308 → `/{locale}/{pais}` |
| `/es/xyz/200` (país no existe) | `notFound()` → 404 |

El regex usado es `^\d+(\.\d+)?$` — solo dígitos o dígitos.decimales, sin signos ni texto.

## Metadata SEO

Cada URL `/{locale}/{pais}/{monto}` genera metadata propia con `generateMetadata`:

- **Title (ES)**: `Enviar $200 USD a Honduras — PreEnvios | Mejores tasas hoy`
- **Title (EN)**: `Send $200 USD to Honduras — PreEnvios | Best rates today`
- **Description**: menciona el monto explícito + el país + lista de operadores.
- **Canonical**: self (`https://preenvios.com/{locale}/{slug}/{monto}`) — consolida señales de
  ranking en la URL con monto entero canónico.
- **Alternates ES/EN**: apuntan al mismo monto en el slug correcto de cada locale (ej. ES →
  `republica-dominicana/200`, EN → `dominican-republic/200`).

No se expone OG image específica por monto (scope excluido por founder — evita fan-out de
imágenes dinámicas y complejidad de generación en edge).

## JSON-LD

El `pais-content.tsx` extiende el JSON-LD existente cuando `initialMonto` está presente:

- `WebPage.name` y `.url` reflejan la URL con monto.
- `BreadcrumbList` se extiende a 3 niveles: PreEnvios → País → `$200 USD`.

El breadcrumb **visual** (UI) no se agregó — scope excluido por founder. Solo vive en el
schema invisible para Google.

## Comportamiento del Comparador

### Al llegar por URL directa (ej. `/es/honduras/200`)

1. `PaisMontoPage` (server component) valida params y llama `<PaisContent slug initialMonto={200} />`.
2. `PaisContent` pasa `defaultMonto={200}` al `<Comparador />`.
3. Comparador inicializa `useState(monto)` con `"200"` — el input ya aparece con el valor.
4. `useEffect` inicial hace fetch `/api/precios?corredor=honduras&metodo=bank`.
5. Los resultados se calculan y renderizan **debajo del hero, en su posición natural**. El
   usuario scrollea manualmente si quiere verlos — **NO hay scroll automático** al llegar
   por URL directa. Esto es una regla intencional: la experiencia de "te llevamos al
   resultado" está reservada al click del botón Comparar, no al landing.

### Al hacer click en "Comparar"

1. `onCompararClick()` valida `montoNum > 0` (si no, foco al input y return).
2. Dispara evento `comparar_click` a GA4 (tracking existente, sin cambios).
3. **Push URL** (nuevo):
   - Resuelve `paisData = PAISES_MVP.find(p => p.corredorId === corredor)`.
   - Escoge slug correcto: `locale === 'en' ? paisData.slugEn : paisData.slugEs`.
   - Si `montoEntero ∈ [10, 10000]` y `montoEntero === montoNum` (sin decimales) →
     `newPath = /{locale}/{pais}/{monto}`. Si no → `newPath = /{locale}/{pais}` (sin monto).
   - Si `pathname !== newPath` → `router.push(newPath, { scroll: false })`. Si son iguales,
     no-op (evita replace inútil y parpadeos).
4. `{ scroll: false }` es crítico: sin esto, Next.js App Router haría scroll al top al hacer
   push, destruyendo el scroll suave a los banners que viene a continuación.
5. El resto del handler corre igual que antes: loading full-screen 1400ms + scroll suave a
   `#banners-patrocinados` con nudge de 30px bajo el nav.

## Sitemap

`app/sitemap.ts` añadió un bloque nuevo al final:

```ts
const MONTOS_SSG = [100, 200, 500, 1000]
for (const p of PAISES_MVP) {
  for (const m of MONTOS_SSG) {
    pages.push({
      url: `${BASE_URL}/es/${p.slugEs}/${m}`,
      priority: 0.7,
      changeFrequency: 'weekly',
      alternates: { languages: { es: ..., en: ... } }
    })
    pages.push({ url: `${BASE_URL}/en/${p.slugEn}/${m}`, ... })
  }
}
```

Total sitemap: ~74 URLs previas + 48 nuevas = **~122 URLs indexables**.

## Archivos creados/modificados

| Archivo | Qué hace |
|---------|----------|
| `app/[locale]/[pais]/[monto]/page.tsx` | **Nuevo** — ruta SSG con validación + redirect + metadata + JSON-LD handoff |
| `app/[locale]/[pais]/pais-content.tsx` | Acepta `initialMonto?: number`, ajusta JSON-LD WebPage + BreadcrumbList a 3 niveles |
| `components/Comparador.tsx` | Prop `defaultMonto?: number`; hooks `useRouter()` + `usePathname()`; push URL solo en `onCompararClick()` |
| `app/sitemap.ts` | +48 URLs bajo bloque `MONTOS_SSG` |

## Exclusiones de scope (intencionales, no bugs)

Decidido con el founder antes de implementar:

- **Sin OG image dinámica con monto** — evita fan-out de renderizado.
- **Dropdown no cambia URL** — solo click en botón.
- **Sin scroll auto al llegar por URL directa** — usuario scrollea natural.
- **Sin breadcrumb visual** — solo JSON-LD invisible.

## Smoke test post-deploy

1. `/es/honduras/200` — carga con monto pre-rellenado, resultados abajo, sin scroll auto.
2. Landing `/es` → escribir 200, Honduras, click "Comparar" → URL cambia a `/es/honduras/200`.
3. En `/es/honduras/200` → cambiar a Guatemala en dropdown → URL **no** cambia.
4. En `/es/honduras/200` → click "Comparar" otra vez con 200 → URL **no** cambia (no-op).
5. `/es/honduras/5` → redirect 308 → `/es/honduras`.
6. `/es/honduras/200.5` → redirect 308 → `/es/honduras/201`.
7. `/es/honduras/abc` → redirect 308 → `/es/honduras`.
8. `/sitemap.xml` → buscar `honduras/100` → presente (48 entradas nuevas con montos).
9. DevTools → Network → `/es/honduras/200` response headers → `x-vercel-cache: HIT` (SSG
   servida desde edge cache post-primer hit).

## Relacionados

- Proceso 15 — Estructura SEO técnica (sitemap dinámico, Schema.org)
- Proceso 17 — Páginas editoriales por corredor (ruta padre `/[locale]/[pais]`)
- Proceso 04 — Componentes React (Comparador)
- `CONTEXTO_FINAL.md` Fase 10 — Registro del backlog SEO post-cutover
