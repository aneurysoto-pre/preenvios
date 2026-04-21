# AUDIT COMPLETO — PreEnvios.com (UX + Next.js)

**Fecha:** 2026-04-21
**Contexto:** Pre-Fase 1 del refactor arquitectural mobile-first sobre shadcn/ui. Extensión del `AUDIT_MOBILE_FIRST.md` con 13 secciones de UX + Next.js, según mandato del founder.
**Alcance:** todo el codebase UI público (components/, app/[locale]/), excluye admin panel y scripts.
**Metodología:** análisis estático (grep, lectura exhaustiva). Sin ejecución en dispositivo real — pendiente validación manual del founder en iPhone.

> Este documento **REEMPLAZA** a `AUDIT_MOBILE_FIRST.md` como referencia pre-Fase 1. El anterior se preserva por historia.

---

## RESUMEN EJECUTIVO

### Hallazgos por severidad

| Severidad | Total | Bloquean Fase 1 | Se resuelven durante refactor | Tareas separadas |
|---|---|---|---|---|
| 🚨 Crítico | 6 | 2 (viewport + favicon) | 3 (dentro de Comparador/Nav/etc.) | 1 (safe-area en html) |
| ⚠️ Importante | 11 | 0 | 7 (durante refactor) | 4 (separadas post-refactor) |
| 💡 Mejora | 9 | 0 | 3 | 6 (backlog) |
| **Total** | **26** | **2** | **13** | **11** |

### Decisión recomendada

**Agregar un `Fase 0.4` (chore, ~30-45 min) antes de Fase 1** para resolver los 2 bloqueadores críticos:

1. **Agregar `export const viewport` en `app/[locale]/layout.tsx`** con `viewportFit: 'cover'` (necesario para que `env(safe-area-inset-*)` funcione en el Sheet modal del Comparador refactorizado)
2. **Agregar favicon, apple-touch-icon y manifest.webmanifest mínimo** (hoy `public/` está vacío — producción se ve como tab sin icono, mala primera impresión)

El resto de hallazgos críticos se resuelven DURANTE el refactor de cada componente:
- Scroll horizontal (gradient cards Comparador) → durante Comparador
- `html { overflow-x: hidden }` parche → removido al final del refactor
- Use client innecesarios en Comparador/Nav/Sections → durante cada refactor

**Los importantes y mejoras se abordan progresivamente DURANTE los 6 commits del refactor o quedan como backlog post-refactor.**

### Mi recomendación

**Hacer `Fase 0.4` como commit chore + Fase 1 Comparador en secuencia continua.** No bloquean entre sí, pero Fase 0.4 desbloquea que el Sheet del Comparador pueda usar `env(safe-area-inset-top)` correctamente desde el primer commit.

---

## SECCIÓN UX

### 1. Accesibilidad (a11y)

#### 1.1 🚨 CRÍTICO — Inputs sin `htmlFor` asociando label

**Archivos afectados:**
- `components/Comparador.tsx:418` (label search.destination para country picker) — usa `<span>`, no `<label>`
- `components/Comparador.tsx:488` (label search.sendFrom) — usa `<label>` pero sin `htmlFor`
- `components/AlertaForm.tsx:82-88` (input email) — sin `<label>` asociado, solo placeholder
- `app/[locale]/calculadora-inversa/content.tsx:94-108` (input monto) — label sin `htmlFor`

**Impacto a11y:** lectores de pantalla anuncian "textbox" sin contexto. WCAG 2.1 nivel A falla en criterio 1.3.1 (Info and Relationships).

**Nota positiva:** `app/[locale]/contacto/content.tsx:88-140` tiene `htmlFor` correcto en los 4 inputs (nombre, email, asunto, mensaje). Es el único form bien etiquetado.

**Se resuelve durante refactor:** SÍ — cuando uso `<Input>` + `<Label>` de shadcn, el `Form` de shadcn asocia automáticamente con `useFormField`. Lo arreglo en Comparador (commit 1), AlertaForm (commit 6).

#### 1.2 ⚠️ IMPORTANTE — Navegación por teclado en modales custom

**Archivo:** `components/Comparador.tsx:344-540` (modal mobile picker custom)

**Problema:** no hay focus trap, no devuelve foco al trigger al cerrar, Tab se escapa al fondo. Actualmente arreglado parcialmente con Escape handler (línea 142-151).

**Se resuelve durante refactor:** SÍ — `Sheet` de shadcn (Radix Dialog por debajo) incluye focus trap + auto-focus return + keyboard handlers nativos.

#### 1.3 ⚠️ IMPORTANTE — Contraste de color en labels `text-g500` sobre `bg-g50`

**Archivos afectados:**
- `components/Comparador.tsx:419` `text-g500` (#64748B) sobre `bg-g50` (#F8FAFC) — contrast ratio ~4.3:1, pasa WCAG AA para texto normal pero al borde.
- Múltiples lugares en `components/Sections.tsx` con `text-g400` sobre blanco (Footer) — contrast ~4.5:1 en el límite.

**Impacto:** usuarios con baja visión o en pantallas con brillo bajo (outdoor) pueden no leer.

**Se resuelve durante refactor:** PARCIAL — durante refactor de cada componente uso primitivas shadcn (usan `muted-foreground` con contrast ratio verificado). Los casos puntuales se mejoran on-demand.

#### 1.4 💡 MEJORA — Alt text en flags: correcto pero inconsistente

**Archivos:** `Nav.tsx:123`, `Comparador.tsx:405 425 443`, `TasasReferencia.tsx:104`, `calculadora-inversa/content.tsx:82`.

Todos usan `alt=""` (decorativo) porque el nombre del país aparece en texto al lado. **Semánticamente correcto** — cuando la imagen es 100% decorativa, `alt=""` es la best practice (evita redundancia con el texto adjacent).

**No se resuelve:** está correcto como está.

#### 1.5 💡 MEJORA — Semántica HTML (h1-h6 jerarquía)

**Landing (`app/[locale]/page.tsx` + children):**
- `<h1>` en Comparador.tsx:323 (hero title)
- `<h2>` en WhySection, StepsSection, CTASection, FAQSection
- `<h2>` en TasasReferencia (banks.title) — pero debería ser `<h3>` si la jerarquía considera el h1 del Comparador como padre
- `<h3>` en cards de Why/Steps, FAQ items

**Estado:** jerarquía razonable, sin h4-h6 anormales. `<h4>` solo aparece en Footer para section titles (Producto, Recursos, etc.) — correcto.

**No se resuelve:** aceptable. Si el refactor de Sections replantea headings, se revisa.

#### 1.6 💡 MEJORA — FAQ usa `<details>/<summary>` nativo en vez de Accordion

**Archivo:** `components/Sections.tsx:178-184`

**Estado actual:** `<details>` nativo funciona sin JS, accesible teclado por default. **Pero**:
- Sin animación de apertura/cierre
- Sin ARIA attributes custom (aria-expanded no se refleja)
- `group-open:rotate-45` funciona visualmente pero no es la mejor UX

**Se resuelve durante refactor Sections:** SÍ — usaré `Accordion` de shadcn que incluye animaciones suaves + todos los ARIA correctos.

---

### 2. Safe-area iOS

#### 2.1 🚨 CRÍTICO — Falta `viewport-fit=cover` en viewport meta

**Archivo:** `app/[locale]/layout.tsx` (no tiene `export const viewport`)

**Problema:** Next.js 16 agrega por default `<meta name="viewport" content="width=device-width, initial-scale=1">` pero **NO incluye `viewport-fit=cover`**. Sin eso, en iPhone con notch (X/11/12/13/14/15/16 Pro):
- `env(safe-area-inset-top)` devuelve 0
- `env(safe-area-inset-bottom)` devuelve 0
- El area bajo el notch queda inaccesible en modales fullscreen
- Mi uso de `paddingTop: 'max(12px, env(safe-area-inset-top))'` en el modal mobile del Comparador (commit a23c963) **nunca funcionó** porque el viewport-fit no está configurado

**Se resuelve en Fase 0.4 (nuevo commit chore):** agrego:
```tsx
// app/[locale]/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#00D957', // brand green para address bar mobile
}
```

#### 2.2 🚨 CRÍTICO — `html` y `body` con `overflow-x: hidden` (parche Regla 4)

**Archivo:** `app/globals.css:35-36`

Ya documentado en `AUDIT_MOBILE_FIRST.md`. **Parche explícitamente prohibido por la Regla 4 del founder.**

**Se resuelve al final del refactor:** se remueve cuando Comparador esté arreglado (gradient cards) y se valide que el scroll horizontal no vuelve sin el parche. Si vuelve, localizar regresión específica.

#### 2.3 ⚠️ IMPORTANTE — Shadcn Sheet maneja safe-area parcialmente

**Contexto:** la primitiva `Sheet` de shadcn/ui (cuando la instale con `npx shadcn add sheet`) NO aplica safe-area-inset por default en su template base.

**Acción durante refactor Comparador:** customizar el `SheetContent` para incluir:
```tsx
style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
```
O mejor, ponerlo en el `globals.css` como utility class custom para aplicar consistente en Sheet/Drawer usados en todo el proyecto.

---

### 3. Touch targets mobile

#### 3.1 ⚠️ IMPORTANTE — Algunos tap targets < 44×44px

**Archivos afectados:**
- `components/Comparador.tsx:368-373` (botón X del picker mobile) — `p-1` sobre icono 16px = ~24×24px total. **FALLA Apple HIG** (mínimo 44×44px).
- `components/Nav.tsx:147-151` (burger menu trigger) — `p-1.5` sobre contenido 22×22px = ~28×28px. Al límite.
- `components/Nav.tsx:138-144` (selector ES/EN) — text + flag con padding chico.
- `components/Sections.tsx:179` (`<summary>` del FAQ) — `px-6 py-5` da ~60px altura × ~300px ancho ✅ OK.
- `components/BannersPatrocinados.tsx:117-123` (CTA de cada banner) — `absolute bottom-3 right-3` con texto pequeño. Tap target chico.

**Se resuelve durante refactor:** los componentes shadcn Button con `size="icon"` = 40×40px (default) o `size="icon-lg"` = 48×48px. Voy con `icon-lg` para targets críticos (close button de Sheet, burger menu).

#### 3.2 💡 MEJORA — Espaciado entre botones apilados

**Archivo:** `components/Nav.tsx:102-135` (desktop nav con botones agrupados)

Desktop tiene `gap-8` entre links — amplio. Mobile en menú hamburguesa `py-3.5 px-1 border-b` — OK.

**No se resuelve:** aceptable.

---

### 4. Scroll behavior

#### 4.1 ⚠️ IMPORTANTE — `-webkit-overflow-scrolling: touch` ausente

**Archivos potenciales:** cualquier contenedor con `overflow-y-auto` que se scrollee en iOS.

**Problema:** sin `-webkit-overflow-scrolling: touch` (o la equivalente moderna `overflow: auto` que ahora hace momentum scroll nativo en iOS 13+), el scroll en iOS puede sentirse "frenético" en algunos webviews.

**Estado actual:** Safari iOS 13+ hace momentum scroll por default para `overflow: auto`. La propiedad legacy ya no es necesaria en Safari moderno. **En webviews (React Native, Cordova, etc.) sí puede ser necesaria** pero PreEnvios es web pura.

**No se resuelve:** OK para web pura. Si se construye webview/PWA, revisar.

#### 4.2 ⚠️ IMPORTANTE — Scroll lock en modal mobile

**Archivo:** `components/Comparador.tsx:153-163` (mi scroll lock con `document.body.style.overflow = 'hidden'` condicional a matchMedia mobile)

**Problema:** este approach tiene un bug conocido en iOS Safari — al abrir el modal, el body scroll queda freezeado en su posición actual, pero al cerrarlo, iOS puede hacer jump al top. Best practice: guardar `window.scrollY`, aplicar `position: fixed` + `top: -Ypx` al body, restaurar al cerrar.

**Se resuelve durante refactor Comparador:** el `Sheet` de shadcn (Radix Dialog) incluye `@radix-ui/react-dialog` con scroll lock battle-tested que maneja el iOS bug correctamente.

#### 4.3 💡 MEJORA — `scroll-behavior: smooth` global

**Archivo:** `app/globals.css:35`

`html { scroll-behavior: smooth }` aplica smooth scroll a TODOS los anchor links. Bien para UX pero puede causar issues con el `scroll` event de GA4 (muchos eventos de scroll durante la animación).

**No se resuelve:** es un trade-off aceptable.

---

### 5. Performance percibida mobile

#### 5.1 🚨 CRÍTICO — No favicon / touch-icon / manifest

**Directorio:** `public/` está vacío.

**Problema:**
- Sin `favicon.ico` — tab del browser muestra icono default (globo gris). Se ve amateur.
- Sin `apple-touch-icon.png` — al agregar "Add to Home Screen" en iOS, usa el screenshot del tab.
- Sin `manifest.webmanifest` — PWA features no funcionan (si se quiere instalable).
- Sin `theme-color` meta — address bar en mobile no se tinta con color brand.

**Se resuelve en Fase 0.4:** crear 4 archivos en `public/`:
- `favicon.ico` (32x32, múltiples tamaños)
- `icon.png` (512×512)
- `apple-icon.png` (180×180)
- `manifest.webmanifest` (nombre, short_name, theme_color, icons)

Los archivos puedo generarlos como SVG/PNG derivados del logo "P" verde del Nav. **NO bloqueo crítico** pero visible inmediatamente en producción.

#### 5.2 ⚠️ IMPORTANTE — Sin loading states en fetch de `/api/precios`

**Archivo:** `components/Comparador.tsx:93-107`

El loading de precios existe (`setLoading(true)` → `setLoading(false)`) y se muestra "Loading..." en línea 481. Pero es texto plano, no skeleton.

Mobile especialmente: usuario que escribe monto → ve "Loading..." → ve resultados. El delay entre ambos puede causar perception de lentitud.

**Se resuelve durante refactor Comparador:** agrego shadcn `Skeleton` primitivo para placeholder de cards de resultado durante el fetch.

#### 5.3 ⚠️ IMPORTANTE — CLS (layout shift) en carga inicial

**Causa 1:** Fonts desde Google Fonts CDN (no `next/font`) — FOUT (flash of unstyled text) hasta que Work Sans/Inter carguen. Cuando cargan, textos "saltan".

**Causa 2:** Imágenes sin `width`/`height` explícitos (algunos `<img>` en el código los tienen, otros no).

**Causa 3:** `OfertasDestacadas` se importa con `dynamic()` en `page.tsx:29` pero está `hidden={true}` — no genera CLS porque no renderiza nada.

**Se resuelve parcialmente durante refactor + en Fase 0.4:**
- Fonts → migrar a `next/font` en Fase 0.4 (fast win)
- Imágenes → agregar `width`/`height` durante cada refactor de componente

---

## SECCIÓN NEXT.JS

### 6. App Router correctness

#### 6.1 ⚠️ IMPORTANTE — 27 archivos con `'use client'`, muchos innecesarios

**Archivos que NO necesitan ser client components (solo prose + useTranslations):**
- `app/[locale]/terminos/content.tsx`
- `app/[locale]/privacidad/content.tsx`
- `app/[locale]/metodologia/content.tsx`
- `app/[locale]/uso-de-marcas/content.tsx`
- `app/[locale]/disclaimers/content.tsx`
- `app/[locale]/como-ganamos-dinero/content.tsx` (pendiente verificar)
- `app/[locale]/nosotros/content.tsx` (pendiente verificar)
- `components/LegalPage.tsx`

`useTranslations` en next-intl funciona en server components con `getTranslations()` del módulo `next-intl/server`. Migrar a server component baja el bundle JS ~10-15KB por página legal.

**Archivos que SÍ deben ser client components:**
- `Comparador.tsx` (state, handlers, useEffect, fetch)
- `Nav.tsx` (state de menu, scroll listener)
- `AlertaForm.tsx` (form state, fetch)
- `contacto/content.tsx` (form)
- `Sections.tsx` (StepsSection/FAQSection tienen useScrollToHashOnMount)
- `tasa-content.tsx` (recharts + fetch)
- `calculadora-inversa/content.tsx` (fetch)
- `operador-content.tsx` (uses useLocale) — revisar si se puede pasar a SSC

**Se resuelve:** FUERA DEL SCOPE del refactor de 6 componentes. Registro como **backlog post-refactor** porque tocar 8+ páginas legales está fuera del mandato. Propongo tarea separada: `refactor(legal): migrar content.tsx a server components`.

#### 6.2 💡 MEJORA — LazyBelow wrapper podría simplificarse

**Archivo:** `app/[locale]/page.tsx:32-44`

Actualmente hace un dynamic import de `@/components/Sections` envolviendo 5 componentes en un único `LazyBelow`. Funciona, pero un refactor más limpio sería dynamic import individual con Suspense boundaries para que el usuario vea skeletons progresivos.

**Se resuelve durante refactor Sections:** SÍ (opcional, solo si agrega valor real).

---

### 7. Internacionalización (next-intl)

#### 7.1 ✅ OK — Estructura es.json y en.json alineadas

**Verificado manualmente:** los top-level keys son idénticos:
```
nav, hero, search, results, delivery, strip, why, steps, cta, faq,
footer, common, banks, disclaimers, nosotros, contacto, legal
```

No hay keys en uno y no en el otro a nivel top. Los sub-keys también match en los que revisé (faq.q1-q6, search.*, results.*, etc.).

#### 7.2 ⚠️ IMPORTANTE — Hardcoded strings en componentes

**Archivos con strings hardcoded mezclados con t():**
- `components/Comparador.tsx:354-356` — placeholder "Search country, DOP, HNL..." / "Busca país, DOP, HNL..." hardcoded (inline ternary `locale === 'en' ? ... : ...`). Debería estar en messages.
- `components/Comparador.tsx:484-486` — texto "Rates coming soon" / "Tasas disponibles pronto" hardcoded
- `components/Comparador.tsx:504-507` — disclaimer largo hardcoded en inglés/español
- `components/Comparador.tsx:355 363 379` (varios) — labels del modal mobile hardcoded
- `components/BannersPatrocinados.tsx` — todo en `title_es/title_en/offer_es/offer_en` inline, no via t()
- `components/Sections.tsx:483` LogoStrip comment sobre brandfetch — no hay hardcoded públicos

**Impacto:** cambiar copy requiere tocar código, no el JSON. También rompe si algún día añades un 3er idioma (portugués para diáspora brasileña).

**Se resuelve durante refactor:** SÍ — durante refactor de Comparador (commit 1) y BannersPatrocinados (commit 5) migro todos los strings a `messages/{es,en}.json` con keys bien estructuradas.

#### 7.3 💡 MEJORA — `useTranslations()` sin namespace específico

**Archivo:** `app/[locale]/contacto/content.tsx:11`

Usa `useTranslations('contacto')` — correcto.

Pero `Sections.tsx` varios usan `useTranslations('faq')`, `useTranslations('steps')` etc. — también correcto.

**No se resuelve:** OK.

---

### 8. Routing y navegación

#### 8.1 ⚠️ IMPORTANTE — Links internos usan `<a href>` no `<Link>`

**Ocurrencias (24 en components/ + más en app/):**
- `components/Sections.tsx` — Footer links, disclaimer link
- `components/Nav.tsx` — todos los links del nav
- `components/Comparador.tsx` — link a `/como-ganamos-dinero`
- `components/BannersPatrocinados.tsx` — CTAs
- Múltiples en pages content

**Impacto:**
- Sin prefetch automático de rutas (Next.js prefetch es uno de sus mejores features)
- Navegación causa full page reload en SSG pages
- Más request HTTP, más tiempo de carga entre páginas
- Impacta métrica INP (Interaction to Next Paint) de Core Web Vitals

**Ejemplo concreto — Nav.tsx:84:**
```tsx
const homeAnchor = (hash: string) => (isHome ? hash : `/${locale}${hash}`)
// Usado en:
<a href={homeAnchor('#como')} className="...">{t('howItWorks')}</a>
```

Debería ser:
```tsx
import Link from 'next/link'
<Link href={homeAnchor('#como')} className="...">{t('howItWorks')}</Link>
```

**Se resuelve durante refactor:** SÍ — en cada componente que refactorizo, importo Link y reemplazo `<a>` internos. Externos (brandfetch, WhatsApp, mailto) quedan como `<a>`.

#### 8.2 💡 MEJORA — Hash anchors con smooth scroll y App Router

**Archivo:** `components/Nav.tsx:82-84` + varios

`<a href="/es/#faq">` funciona con App Router (browser navega a la página y el hash lleva al anchor). Pero con el React hydration, a veces el scroll sucede antes del hydrate.

Ya hay mitigación en `Sections.tsx:17-28` (`useScrollToHashOnMount('faq')`) — bien. Pero solo en FAQ y Steps.

**Se resuelve durante refactor Sections:** SÍ — centralizo el hook `useScrollToHashOnMount` en `lib/hooks/` compartido, lo aplico en todos los sections que tengan id.

#### 8.3 💡 MEJORA — Query params en URL afiliados

**Ejemplo:** el botón "Enviar ahora" abre `https://www.remitly.com/...` externo en nueva pestaña. Los tracking IDs de afiliado no están configurados hoy (links sin `?aff_id=` ni similar).

**No se resuelve:** es tarea de negocio (aprobaciones de afiliado), no del refactor UI.

---

### 9. Image optimization

#### 9.1 ⚠️ IMPORTANTE — Cero uso de `next/image`

**Evidencia:** `Grep next/image` → **0 archivos.**

**Todas las imágenes usan `<img>` directo:**
- Flags de flagcdn: `<img src="https://flagcdn.com/w40/hn.png">` en Nav, Comparador, TasasReferencia, operador-content, calculadora-inversa
- Logos de operadores: `<img src="https://cdn.brandfetch.io/remitly.com/w/120/h/120">` en Sections (LogoStrip) y Comparador (LOGOS dict)

**Impacto:**
- Sin optimización AVIF/WebP automática
- Sin lazy loading inteligente (algunos `<img>` tienen `loading="lazy"` manual, otros no)
- Sin `srcset` responsivo
- Peso total de imágenes más alto que necesario

**Problema específico con next/image + CDNs externos:**
Para usar `next/image` con CDNs externos (flagcdn, brandfetch), hay que declararlos en `next.config.ts`:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'flagcdn.com' },
    { protocol: 'https', hostname: 'cdn.brandfetch.io' },
  ],
}
```

**Se resuelve durante refactor:** PARCIAL. Durante cada refactor migro `<img>` a `<Image>` de `next/image` con `width`/`height` explícitos + `remotePatterns` en `next.config.ts`. Flags y logos ganan optimización automática.

#### 9.2 ⚠️ IMPORTANTE — Falta `width`/`height` en algunas `<img>`

Búsqueda puntual: la mayoría tiene `width={22} height={15}` o equivalente (flags). Pero brandfetch logos a veces sin dimensions.

**Se resuelve con #9.1:** migrar a `next/image` fuerza dimensions.

#### 9.3 💡 MEJORA — Preconnect a CDNs de imágenes

**Archivo:** `app/[locale]/layout.tsx:38-39`

Actualmente solo preconnect a `fonts.googleapis.com` y `fonts.gstatic.com`. Faltan:
- `<link rel="preconnect" href="https://flagcdn.com" />`
- `<link rel="preconnect" href="https://cdn.brandfetch.io" />`

**Se resuelve en Fase 0.4 o dentro del refactor de layout:** pequeño.

---

### 10. Fonts

#### 10.1 ⚠️ IMPORTANTE — Google Fonts via `<link>` en lugar de `next/font`

**Archivo:** `app/[locale]/layout.tsx:38-43`

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Quicksand:wght@700&display=swap"
  rel="stylesheet"
/>
```

**Problemas:**
- Request HTTP adicional a googleapis.com por fuente (lento)
- FOUT (Flash of Unstyled Text) hasta que carguen
- Fuentes se sirven desde Google CDN, no self-hosted (privacidad + GDPR)
- Peso del CSS descargado no optimizado para las weights usadas

**Solución con `next/font/google`:**
```tsx
// app/[locale]/layout.tsx
import { Inter, Work_Sans, Quicksand } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const quicksand = Quicksand({ subsets: ['latin'], weight: '700', variable: '--font-logo', display: 'swap' })

<html className={`${inter.variable} ${workSans.variable} ${quicksand.variable}`}>
```

Next.js self-hostea las fuentes automáticamente, elimina el request a Google.

**Se resuelve en Fase 0.4 (chore):** cambio mecánico de 15 líneas. Compatible con el `@theme` de Tailwind v4 (mapean a las CSS variables).

#### 10.2 💡 MEJORA — `font-display: swap` ya configurado

En el URL actual `...&display=swap` — correcto. Sin CLS extremo.

**No se resuelve:** OK.

---

### 11. SEO técnico

#### 11.1 ⚠️ IMPORTANTE — Metadata faltante en 12+ páginas

**Páginas SIN `export const metadata` o `generateMetadata`:**
- `app/[locale]/terminos/page.tsx`
- `app/[locale]/privacidad/page.tsx`
- `app/[locale]/como-ganamos-dinero/page.tsx`
- `app/[locale]/metodologia/page.tsx`
- `app/[locale]/uso-de-marcas/page.tsx`
- `app/[locale]/calculadora-inversa/page.tsx`
- `app/[locale]/tasa/[pair]/page.tsx`
- `app/[locale]/wiki/[slug]/page.tsx`
- `app/[locale]/blog/[slug]/page.tsx`
- `app/[locale]/baja/page.tsx`
- `app/[locale]/confirmar-suscripcion/page.tsx`
- `app/[locale]/admin/page.tsx`

Heredan del root layout — solo tienen title generic y description genérica. Google y OpenGraph muestran la misma info en todas.

**Se resuelve:** FUERA del scope del refactor de 6 componentes. Es tarea SEO separada. Sugiero `feat(seo): metadata per-page + JSON-LD` como segundo mandato post-refactor.

#### 11.2 💡 MEJORA — Sitemap completo y con hreflang

Ya verificado `app/sitemap.ts` — generation completa, hreflang alternates por página. **Bien hecho**.

**Contador de URLs generadas:**
- Home ES + EN = 2
- Legal pages (6) × 2 locales = 12
- Institutional (2) × 2 = 4
- Tasa × 8 corredores × 2 = 16
- Operadores × 7 × 2 = 14
- Blog + slugs (3) × 2 = 8 total
- Wiki + slugs (10) × 2 = 22 total
- Calculadora inversa × 2 = 2
- Páginas país (6) × 2 = 12
- Baja × 2 = 2

Total ~94 URLs indexables. Número saludable para un sitio tamaño MVP.

**No se resuelve:** está bien.

#### 11.3 💡 MEJORA — Structured Data (JSON-LD) falta en algunas páginas

**Tienen JSON-LD:**
- `operador-content.tsx` (Organization schema)
- `pais-content.tsx` (WebPage + BreadcrumbList)
- `wiki-article.tsx`
- `blog/[slug]/article.tsx`
- `tasa-content.tsx` (ExchangeRateSpecification)

**Faltan:**
- Landing `page.tsx` — debería tener `WebSite` schema con search action
- `nosotros/content.tsx` — podría tener `Organization`
- `contacto/content.tsx` — podría tener `ContactPage`
- FAQ section — sería bueno tener `FAQPage` schema (en Sections.tsx)

**No se resuelve en este refactor:** tarea SEO separada. Registro en backlog.

#### 11.4 💡 MEJORA — Canonical URLs

`app/[locale]/page.tsx:19-24` tiene `alternates.canonical + languages`. **Bien**.

Otras páginas probablemente usan el canonical default de Next.js (URL actual). Podría mejorar con canonical explícito por página.

**No se resuelve:** aceptable.

---

### 12. Tailwind v4 específico

#### 12.1 ✅ OK — Uso correcto de `@theme`

**Archivo:** `app/globals.css:7-33`

`@theme` directive con CSS custom properties — uso correcto de Tailwind v4. Colors, fonts, radii bien definidos.

#### 12.2 ✅ OK — PostCSS pipeline sin conflictos

**Archivo:** `postcss.config.mjs`

Solo `@tailwindcss/postcss`. Sin autoprefixer (Tailwind v4 lo incluye). Config mínimo y correcto.

#### 12.3 💡 MEJORA — shadcn `@theme inline` con tokens de shadcn

Ya resuelto en commit `679bd23`: removí las 4 líneas conflictivas (font-heading, font-sans, radius-lg, radius-xl) para preservar tokens brand.

**No se resuelve:** ya hecho.

#### 12.4 💡 MEJORA — Custom CSS en `globals.css` extensa

**Archivo:** `app/globals.css:38-124` (las clases `.cmp-*` y `.prose-legal`)

~90 líneas de CSS custom para Comparador results (`.cmp-card`, `.cmp-btn`, etc.) y prose legal. Durante el refactor de Comparador se debería evaluar:
- ¿Se puede mover a componentes React con Tailwind classes?
- ¿Es mejor dejarlo como CSS para preservar la "design parity with original HTML"?

**Mi opinión:** mantener como CSS tiene sentido para las clases `.cmp-*` que son complejas grids responsivos con media queries. Migrar a Tailwind inline sería verboso. Lo reviso durante refactor Comparador.

---

### 13. Tracking GA4

#### 13.1 ⚠️ IMPORTANTE — Inconsistencia entre helpers y gtag directos

**Archivo:** `components/Comparador.tsx:185-187`
```tsx
function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof gtag === 'function') gtag('event', name, params)
}
```
Helper local — usa `declare function gtag` (línea 43).

**Archivo:** `components/AlertaForm.tsx:34-39`
```tsx
if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
  ;(window as any).gtag('event', 'suscripcion_free', { corredor: corredorId, idioma: locale })
}
```
Inline con `any` cast. Inconsistente.

**Archivo:** `app/[locale]/contacto/content.tsx:37-39`
```tsx
if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: ...}).gtag === 'function') {
  (window as unknown as { gtag: ... }).gtag('event', 'contacto_enviado', { asunto })
}
```
Inline con unknown cast. Verboso.

**Archivo:** `components/Nav.tsx:67-73`
```tsx
if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
  (window as any).gtag('event', 'cambio_idioma', { ... })
}
```
Inline con any cast.

**Propuesta:** extraer a `lib/tracking.ts`:
```ts
export function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as Window & { gtag?: (...args: unknown[]) => void }
  w.gtag?.('event', name, params)
}
```

Luego `import { trackEvent } from '@/lib/tracking'` en todos lados. Elimina duplicación, single source of truth.

**Se resuelve durante refactor:** SÍ — creo `lib/tracking.ts` al refactorizar Comparador (commit 1), luego los otros componentes lo importan cuando los toquemos. Contacto/Nav pueden actualizarse en un commit chore al final.

#### 13.2 📋 Inventario de eventos GA4 que deben preservarse

**Eventos actuales en el código (para que refactor no rompa):**

| Evento | Archivo | Cuándo dispara |
|---|---|---|
| `cambio_corredor` | Comparador.tsx:197 | Usuario selecciona país |
| `cambio_metodo_entrega` | Comparador.tsx:202 | Usuario cambia bank/cash/delivery/mobile |
| `inicio_uso` | Comparador.tsx:208 | Primera vez que escribe monto |
| `comparar_click` | Comparador.tsx:218 | Click en botón "Comparar" |
| `click_operador` | Comparador.tsx:253 | Click en "Enviar ahora" de un operador |
| `suscripcion_free` | AlertaForm.tsx:35 | Email suscrito a alertas |
| `cambio_idioma` | Nav.tsx:70 | Click botón ES/EN |
| `contacto_enviado` | contacto/content.tsx:38 | Form contacto enviado |

**Durante refactor:** preservar TODOS estos eventos. Si refactorizo handlers, mantener el `trackEvent()` con el mismo name y params.

#### 13.3 💡 MEJORA — `gtag` tipado globalmente

Crear `types/global.d.ts`:
```ts
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
    dataLayer?: unknown[]
  }
}
export {}
```

Elimina casts `as any` / `as unknown as`.

**Se resuelve durante refactor:** SÍ, junto con `lib/tracking.ts` en commit 1.

---

## DECISIÓN Y ORDEN PROPUESTO (actualizado)

### Fase 0.4 — NUEVA (pre-Fase 1, ~45 min, 1 commit)

**Propósito:** resolver los 2 bloqueadores críticos antes del refactor.

**Contenido del commit `chore(platform): viewport + favicon + next/font`:**
1. Agregar `export const viewport` en `app/[locale]/layout.tsx` con `viewportFit: 'cover'` + `themeColor`
2. Crear `public/favicon.ico`, `public/icon.png`, `public/apple-icon.png`, `public/manifest.webmanifest` (del logo P verde)
3. Migrar fonts a `next/font/google` (Inter, Work Sans, Quicksand self-hosted)
4. Agregar preconnect a `flagcdn.com` y `cdn.brandfetch.io` en layout
5. Crear `types/global.d.ts` con `Window.gtag` tipado
6. Crear `lib/tracking.ts` con helper `trackEvent()`

**Verificaciones:** typecheck + build pasa. Vista previa de Chrome DevTools iPhone muestra el tab con favicon.

### Fase 1 — Refactor de 6 componentes (SIN CAMBIOS del orden previo)

1. **Comparador** → durante este commit: removerSpanish hardcoded strings a messages/, migrar `<img>` a `next/image`, `<a>` internos a `<Link>`, input labels con `htmlFor`, fix gradient cards scroll horizontal, Sheet shadcn con safe-area, scroll lock con Radix, reemplazar trackEvent local por `@/lib/tracking`
2. **Nav** → similar. Sheet para mobile menu.
3. **Sections** → Accordion de shadcn en FAQ. Links con `next/link`. FAQPage JSON-LD (opcional).
4. **TasasReferencia** → grid clean, `next/image` en flags.
5. **BannersPatrocinados** → Carousel shadcn, strings a messages, `next/link`.
6. **AlertaForm** → `Input` + `Label` shadcn con `htmlFor` automático, `trackEvent` del helper.

### Post-refactor (backlog, separado)

- `refactor(legal): migrar content.tsx a server components` — 8 páginas legales (~3-4h).
- `feat(seo): metadata per-page + JSON-LD` — metadata a 12 páginas (~2-3h).
- `chore: remover overflow-x: hidden de html/body y validar` — 10 min + testing.

---

## CHECKPOINTS FINALES (actualizados)

Espero OK explícito del founder para:

1. ✅ **Agregar Fase 0.4** como commit chore antes de Fase 1 (viewport + favicon + next/font + tipos gtag + helper trackEvent)
2. ✅ El **orden de Fase 1** tal cual (Comparador → Nav → Sections → TasasReferencia → BannersPatrocinados → AlertaForm)
3. ✅ **Scope de cambios durante refactor** ampliado vs. audit anterior: ahora cada commit incluye también (según componente): migración a `next/image`, `next/link`, `useFormField`, Sheet/Dialog safe-area, strings hardcoded a messages, uso de `@/lib/tracking` helper
4. ✅ **Scope EXCLUIDO** confirmado: OfertasDestacadas, LegalPage, Admin, páginas legales content.tsx (se hacen como tarea separada)
5. ✅ **Validación del scroll horizontal** en tu iPhone antes de refactor Comparador (o aceptas mi hipótesis y validamos AL FINAL cuando removamos overflow-x: hidden)
6. ✅ **Backlog post-refactor** aceptado como tareas separadas: legal content → server components, metadata per-page, SEO JSON-LD

---

## RESUMEN DE BLOQUEADORES CRÍTICOS

**Hay 6 hallazgos 🚨 críticos en total, pero solo 2 bloquean Fase 1:**

| # | Hallazgo | Bloquea Fase 1 | Resuelto en |
|---|---|---|---|
| 1 | Viewport sin `viewportFit: 'cover'` | **SÍ** | Fase 0.4 |
| 2 | No favicon / manifest | **SÍ** (prod look) | Fase 0.4 |
| 3 | Input sin htmlFor | No | Durante refactor Comparador, AlertaForm |
| 4 | Gradient cards scroll horizontal | No | Durante refactor Comparador |
| 5 | `html/body { overflow-x: hidden }` parche | No | Post-refactor (validación final) |
| 6 | Scroll lock mobile modal con bug iOS | No | Durante refactor Comparador (Sheet Radix) |

**Recomendación definitiva:** procedo con Fase 0.4 (30-45 min) → Fase 1 refactor secuencial. Espero tu OK explícito para arrancar Fase 0.4.
