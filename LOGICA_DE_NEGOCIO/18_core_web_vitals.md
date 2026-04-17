# Proceso 18 — Core Web Vitals + Cross-links SEO

## Descripción

Optimización de rendimiento para PageSpeed Insights 90+ y estrategia de cross-linking interno para fortalecer el SEO del sitio.

Completado el 2026-04-17.

## Core Web Vitals — Optimizaciones

### 1. Font loading
- **Preconnect** a `fonts.googleapis.com` y `fonts.gstatic.com` (crossOrigin)
- **display=swap** ya incluido en Google Fonts URL (evita FOIT)
- **Reducción de font weights**: eliminados los pesos no utilizados (Inter 300, Plus Jakarta 400/500/600, Quicksand 500/600)
- Solo se cargan: Inter 400-700, Plus Jakarta Sans 700-900, Quicksand 700

### 2. Dynamic imports (code splitting)
- Below-fold components cargados con `next/dynamic`:
  - OfertasDestacadas, TasasReferencia
  - LogoStrip, WhySection, StepsSection, CTASection, FAQSection (agrupados en LazyBelow)
- Solo Nav, Comparador y Footer se cargan en el bundle inicial
- Reduce JavaScript initial load significativamente

### 3. Image optimization
- Todos los `<img>` tienen `width`, `height`, `loading="lazy"`, `decoding="async"`
- Logo strip de operadores: lazy loading
- Result cards de Comparador: lazy loading con dimensiones explícitas
- Previene CLS (Cumulative Layout Shift)

### 4. GA4 non-blocking
- Google Analytics cargado con `strategy="afterInteractive"` (ya estaba, verificado)
- No bloquea el render

## Cross-links SEO — Esquema

### Módulo de datos: `lib/cross-links.ts`
Mapeo centralizado de relaciones entre contenido:
- `BLOG_LINKS`: cada blog → corredores y operadores relacionados
- `WIKI_LINKS`: cada wiki → corredores y operadores relacionados
- `CORRIDOR_BLOGS`: cada corredor → artículos de blog
- `CORRIDOR_WIKIS`: cada corredor → artículos de wiki
- `CORRIDOR_TOP_OPERATORS`: cada corredor → operadores más usados
- `OPERATOR_COMPETITORS`: cada operador → competidores (para links "vs")

### Páginas de corredor (/[locale]/[pais])
Sección "Recursos relacionados" con grid:
- Link a página técnica de tasa (/tasa/[pair])
- Links a operadores populares del corredor
- Links a artículos de blog relacionados
- Links a guías wiki relacionadas
- Links a los otros 3 países del MVP

### Páginas de operador (/[locale]/operadores/[slug])
- Corredores soportados con links a páginas de país (MVP) o texto (otros)
- Sección "Compara con" — links a competidores (Remitly vs Wise, etc.)
- Links a artículos de blog que mencionan al operador

### Artículos de blog (/[locale]/blog/[slug])
- Bloque "Páginas relacionadas" con links a:
  - Países mencionados (con bandera)
  - Operadores mencionados

### Artículos de wiki (/[locale]/wiki/[slug])
- Bloque "Páginas relacionadas" con links a corredores y operadores
- CTA de suscripción a alertas gratuitas

### Footer global
- Columna "Producto" ahora muestra los 4 países del MVP con banderas
- Columna "Empresa" ahora tiene links a Remitly, Wise, Western Union, Guías, Blog
- Links a legal siguen igual

## Archivos creados/modificados

| Archivo | Cambio |
|---------|--------|
| `lib/cross-links.ts` | Nuevo — datos de cross-linking |
| `app/[locale]/layout.tsx` | Preconnect fonts.gstatic.com, font weights reducidos |
| `app/[locale]/page.tsx` | Dynamic imports para below-fold |
| `components/Sections.tsx` | Lazy loading imágenes, footer con cross-links |
| `components/Comparador.tsx` | Lazy loading logos operadores |
| `app/[locale]/[pais]/pais-content.tsx` | Sección cross-links completa |
| `app/[locale]/operadores/[slug]/operador-content.tsx` | Corredores linkados, competidores, blog |
| `app/[locale]/blog/[slug]/article.tsx` | Cross-links a países y operadores |
| `app/[locale]/wiki/[slug]/wiki-article.tsx` | Cross-links + CTA alertas |
