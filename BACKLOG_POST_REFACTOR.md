# Backlog Post-Refactor — PreEnvios.com

Tareas técnicas identificadas en [AUDIT_COMPLETO.md](AUDIT_COMPLETO.md) que quedan **fuera del scope** del refactor arquitectural mobile-first de Fase 1 (componentes Comparador, Nav, Sections, TasasReferencia, BannersPatrocinados, AlertaForm).

Cada tarea se ejecuta como **mandato separado** post-Fase 1, con su propio commit único, typecheck + build + validación.

**NO incluir en este backlog:**
- Decisiones de producto/estrategia (van en `LOGICA_DE_NEGOCIO/`)
- Features nuevos (van en `CONTEXTO_FINAL.md` Fase N)
- Bugs activos bloqueantes (se arreglan en sprint del refactor Fase 1)

---

## Índice

1. [Server components en 8 páginas legales](#1-server-components-en-8-páginas-legales)
2. [Metadata + JSON-LD en 12 páginas](#2-metadata--json-ld-en-12-páginas)
3. [Remover overflow-x: hidden global](#3-remover-overflow-x-hidden-global)

---

## 1. Server components en 8 páginas legales

**Fecha identificación:** 2026-04-21
**Severidad:** ⚠️ Importante (bundle size, performance)
**Hallazgo en AUDIT_COMPLETO.md:** §6.1

### Contexto

27 archivos usan `'use client'` en el codebase. 8 de ellos son páginas legales que solo renderizan prose + `useTranslations` — NO tienen state, handlers, effects ni interactividad. Son candidatos perfectos para server components.

`useTranslations` de next-intl tiene versión server: `getTranslations()` desde `next-intl/server`. Convertir reduce el JS bundle enviado al cliente por página (~10-15KB estimado por archivo = ~80-120KB total en el primer load de navegación entre pages).

### Archivos afectados

- `app/[locale]/terminos/content.tsx`
- `app/[locale]/privacidad/content.tsx`
- `app/[locale]/metodologia/content.tsx`
- `app/[locale]/uso-de-marcas/content.tsx`
- `app/[locale]/disclaimers/content.tsx`
- `app/[locale]/como-ganamos-dinero/content.tsx`
- `app/[locale]/nosotros/content.tsx`
- `components/LegalPage.tsx` (wrapper compartido)

### Propuesta fix

Para cada archivo `content.tsx`:
1. Remover directiva `'use client'` del top
2. Convertir componente en `async function`
3. Cambiar `useTranslations()` por `await getTranslations()` del módulo `next-intl/server`
4. Convertir `useLocale()` por `await getLocale()` equivalente server

Para `LegalPage.tsx`:
- Evaluar si es convertible a server (probable que sí — solo renderiza `<Nav />` + children + `<Footer />` sin hooks client). Si sí, convertir. Si tiene dependencia client, mantener client pero asegurar que los children pasen como prop sin forzar re-render.

### Criterio de activación

- Después de Fase 1 completa y validada (todos los 6 componentes refactorizados + removed overflow-x:hidden)
- Antes del lanzamiento SEO (DNS cutover) — impacta TTI/TBT que Google considera en ranking

### Estimación

**3-4 horas** de trabajo enfocado. Commit único `refactor(legal): migrar content.tsx a server components`.

### Riesgo

Bajo. `getTranslations()` de next-intl es stable. El único riesgo es que algún hook cliente sea requerido (ej. `useParams()`) — se detecta en el typecheck y se mantiene el archivo como client si es necesario.

---

## 2. Metadata + JSON-LD en 12 páginas — ✅ RESUELTO 2026-04-22

**Fecha identificación:** 2026-04-21
**Fecha resolución:** 2026-04-22
**Commits:** `80990fb` (metadata 7 estáticas + home desc), `367b3b3` (metadata dinámicas /tasa/[pair], /wiki/[slug], /blog/[slug]), `8523e85` (JSON-LD en 6 páginas), `6bdce58` (fix /disclaimers descubierto en smoke test).
**Severidad original:** ⚠️ Importante (SEO, ranking, CTR de resultados Google)
**Hallazgo en AUDIT_COMPLETO.md:** §11.1 + §11.3

### Contexto

**Metadata:** 12 páginas NO declaran `export const metadata` ni `generateMetadata`. Heredan `title` + `description` del root layout (`app/[locale]/layout.tsx`) — Google muestra la MISMA info en todas las URLs indexadas, perdiendo potencial de ranking específico por página y CTR bajo en SERPs.

**JSON-LD (structured data):** falta en páginas donde rendiría bien:
- Landing (`app/[locale]/page.tsx`) → debería tener `WebSite` schema con `potentialAction: SearchAction`
- `nosotros/content.tsx` → `Organization` schema
- `contacto/content.tsx` → `ContactPage` schema
- `FAQSection` dentro de `components/Sections.tsx` → `FAQPage` schema (rich snippets en Google)

### Páginas sin metadata específica

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
- `app/[locale]/admin/page.tsx` (último = noindex, no prioritario)

### Propuesta fix

Por página:
1. Agregar `export const metadata: Metadata` estático donde el título/descripción no dependan de data dinámica
2. Para páginas con parámetros (tasa/[pair], wiki/[slug], blog/[slug]) usar `generateMetadata({ params })` async que lee el param y genera title/description/og:image/twitter específicos
3. Para cada página incluir: `title`, `description`, `alternates.canonical`, `alternates.languages` (hreflang)
4. Para `openGraph` + `twitter`: usar una plantilla con datos del producto + el título específico

Por JSON-LD:
1. `app/[locale]/page.tsx` — añadir `<script type="application/ld+json">` con WebSite + SearchAction
2. `nosotros/content.tsx` — añadir Organization schema (ya hay en operador-content.tsx como referencia)
3. `contacto/content.tsx` — añadir ContactPage schema
4. `Sections.tsx` FAQSection — añadir FAQPage schema con las preguntas/respuestas de `t('faq.qN')`

### Criterio de activación

- **Antes del lanzamiento público (DNS cutover)** — impacta SEO desde día 1 de indexación por Google
- Prioridad alta si el plan de marketing mes 1 depende de tráfico orgánico (hoy minoritario, pero cada % cuenta)

### Estimación

**2-3 horas** de trabajo enfocado. Commit único `feat(seo): metadata per-page + JSON-LD structured data`.

### Riesgo

Bajo. Next.js metadata API es declarativa, typecheck garantiza formato correcto. Validar con Google Rich Results Test y el Structured Data Testing Tool post-deploy.

### Resumen de lo entregado (2026-04-22)

- **19 páginas con `generateMetadata` bilingüe** (ES/EN) — 6 legales + 6 corredores + 10 wiki + 3 blog + home + alertas + contacto + nosotros + disclaimers + operadores + calculadora. `/admin` marcado `noindex,nofollow` intencional.
- **11 páginas con JSON-LD Schema.org inline** — home tiene `@graph` con `WebSite + SearchAction + Organization + FAQPage`; nosotros `AboutPage + Organization`; contacto `ContactPage`; calculadora `WebApplication`; blog y wiki tienen `Blog` y `CollectionPage` con `ItemList` respectivamente; más las 5 páginas dinámicas que ya tenían (tasa, operadores, pais, wiki-article, blog-article).
- **Organization entity canonical** con `@id` `https://preenvios.com/#organization` reutilizado en 4 páginas → Google consolida la marca.
- **Home descripción actualizada a 6 corredores MVP** (agregó Colombia + México que faltaban).
- **Tech debt no abordado (scope separado):** `/blog/[slug]` sigue siendo `ƒ Dynamic` por faltarle `generateStaticParams()` — una línea para convertirlo a SSG como las otras dinámicas.

---

## 3. Remover overflow-x: hidden global

**Fecha identificación:** 2026-04-21
**Severidad:** 🚨 Crítico (viola Regla 4 del founder)
**Hallazgo en AUDIT_COMPLETO.md:** §2.2

### Contexto

`app/globals.css:35-36` tiene:

```css
html { scroll-behavior: smooth; overflow-x: hidden; }
body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
```

Esto es **parche que oculta síntomas** de scroll horizontal en lugar de arreglar causas raíz — explícitamente prohibido por la **Regla 4 del mandato del founder** (manual `components/COMO_USAR_CLAUDE_CODE.md`).

Los commits de Fase 1.1-1.5 van arreglando las causas raíz estructurales:
- **Fase 1.1** (Comparador): removidos gradient decorative cards del search hero con `inset-[28px_-28px_-28px_28px]` + `rotate-[4deg]` que escapaban del `overflow-hidden` del parent positioned en iOS Safari (bug conocido)
- **Fase 1.2** (Nav): remplazado mobile menu custom `fixed top-[48px]` con Drawer vaul que no genera overflow
- **Fase 1.3-1.5** (Sections, TasasReferencia, BannersPatrocinados): se verificará durante cada refactor

Al completar Fase 1 completa, todas las causas estructurales conocidas deberían estar arregladas. El parche global deja de ser necesario.

### Propuesta fix

1. Al completar Fase 1.6 (commit final AlertaForm refactor), modificar `app/globals.css`:

```css
/* ANTES */
html { scroll-behavior: smooth; overflow-x: hidden; }
body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* DESPUÉS */
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; }
```

2. Commit único `chore(css): remover overflow-x:hidden parche global tras refactor Fase 1`

3. Push + validación IMMEDIATA en iPhone real:
   - Landing completa carga sin scroll horizontal
   - Tocar cada sección (Comparador, banners, tasas, why, steps, FAQ, CTA, footer)
   - Abrir/cerrar country picker en Comparador — verificar cero leak de scroll horizontal
   - Abrir/cerrar mobile menu Nav — mismo check
   - Rotate a landscape y back a portrait — mismo check

4. **Si el scroll horizontal vuelve:** identificar con Safari Web Inspector (remote debugging desde Mac) qué elemento tiene `offsetWidth > documentElement.clientWidth`, arreglar ESA causa raíz específica (NO re-añadir el parche global).

### Criterio de activación

- **Último commit de Fase 1** (después de refactor AlertaForm aprobado por founder)
- Requiere validación obligatoria en iPhone real ANTES de mergear — es el único criterio de éxito real del refactor arquitectural completo

### Estimación

**10 minutos** de cambio en código (2 líneas de CSS) + **15-30 min** de validación en dispositivo + **30 min-2h** de debug si aparece regresión (varía según causa).

### Riesgo

**Medio-alto.** Es el commit que revela si el refactor de Fase 1 arregló las causas raíz o si hay todavía elementos con overflow que quedaban ocultos. Si vuelve el scroll horizontal:

- **Escenario A** (deseable): identificamos un componente específico que quedó sin arreglar → fix puntual, nuevo commit con causa raíz, scroll horizontal queda arreglado para siempre
- **Escenario B** (no deseable): la causa es arquitectural profunda (ej. alguna imagen dinámica de flagcdn con dimensiones inesperadas) → escalar al founder con evidencia concreta y proponer solución

### Dependencia

⚠️ **Este backlog item NO se ejecuta hasta que Fase 1 esté 100% completa y validada.** Ejecutarlo antes es prematuro y esconde causas todavía no arregladas.

---

*Última actualización: 2026-04-21. Archivo gestionado por Claude durante refactor Fase 1. Se cierra (se archiva o se vacía) cuando las 3 tareas están ejecutadas y validadas.*
