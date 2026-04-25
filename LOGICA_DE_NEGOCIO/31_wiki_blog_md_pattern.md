# Proceso 31 — Patrón de contenido editorial (wiki + blog) con `.md`

**Decidido 2026-04-25.** Patrón genérico para publicar artículos en
`/wiki` y `/blog` desde archivos markdown.

## Por qué

El patrón anterior (componente client `wiki-article.tsx` /
`blog-article.tsx` con placeholder hardcoded) requería tocar código TS
para publicar cada artículo. Migración a markdown:

- **Velocidad de publicación** — el founder escribe `.md` con
  frontmatter; cero código.
- **SEO** — `description` del frontmatter alimenta `<meta>`,
  `<title>` se deriva del frontmatter.
- **Rollback simple** — quitar el `.md` y vuelve a placeholder
  "Próximamente" sin tocar nada más.
- **Idéntico para wiki y blog** — un solo helper genérico
  `lib/markdown-content.ts` cubre ambas secciones.

## Arquitectura

```
content/
  wiki/
    <slug>.md      ← frontmatter + body markdown
  blog/
    <slug>.md

lib/
  markdown-content.ts
    ├── loadMarkdownContent('wiki' | 'blog', slug) → MarkdownContent | null
    └── listPublishedSlugs('wiki' | 'blog') → string[]

  corredores.ts
    ├── WIKI_ARTICLES  ← registry [{ slug, cat, titulo, titulo_en }]
    └── BLOG_ARTICLES  ← registry idéntico shape para blog

app/[locale]/
  wiki/
    page.tsx              (Server) lee publishedSlugs → pasa a WikiIndex
    wiki-index.tsx        (Client) agrupa por CATS, badge "Leer →" si publicado
    [slug]/
      page.tsx            (Server) loadMarkdownContent('wiki', slug) → bodyHtml
      wiki-article.tsx    (Client) recibe bodyHtml, renderiza o cae a placeholder

  blog/
    page.tsx              (Server) idéntico shape, listPublishedSlugs('blog')
    index-content.tsx     (Client) agrupa por CATS específicas de blog
    [slug]/
      page.tsx            (Server) loadMarkdownContent('blog', slug)
      article.tsx         (Client) recibe bodyHtml o cae a placeholder
```

### Frontmatter requerido

```yaml
---
title: "Título completo del artículo"
slug: "slug-en-kebab-case"
section: "wiki"  # o "blog"
category: "fundamentos"  # debe matchear una key del CATS del componente
description: "Meta description SEO — sale en <meta>"
---
```

`title` y `description` son source of truth en runtime — sobrescriben
cualquier valor del registry. `slug` debe matchear el nombre del
archivo (el path es `content/<section>/<slug>.md`).

### Categorías (CATS)

**Wiki** (`app/[locale]/wiki/wiki-index.tsx`):
- `fundamentos` — Fundamentos / Fundamentals 📚
- `educativos` — Conceptos básicos / Core concepts 📖 *(nueva 2026-04-25)*
- `metodos` — Métodos de envío / Sending methods 💸 *(nueva 2026-04-25)*
- `corredor` — Guías por corredor / Corridor guides 🌎
- `educacion` — Educación financiera / Financial education 💡

**Blog** (`app/[locale]/blog/index-content.tsx`):
- `guias-pais` — Guías por país / Country guides 🌎 *(nueva 2026-04-25)*
- `comparaciones` — Comparativas / Head-to-head ⚖️ *(nueva 2026-04-25)*
- `tendencias` — Tendencias / Trends 🚀 *(nueva 2026-04-25)*
- `practicas` — Guías prácticas / Practical guides 💡 *(nueva 2026-04-25)*

**Regla para futuras categorías**:
- Si una categoría aplica a 3+ artículos del lote → agregar al `CATS`
- Si aplica a 1-2 artículos → mapear a la categoría existente más cercana

## Flujo de publicación

1. **Escribir el `.md`** con frontmatter completo.
2. **Colocar en** `content/wiki/<slug>.md` o `content/blog/<slug>.md`.
3. **Registrar en** `lib/corredores.ts`:
   - `WIKI_ARTICLES` o `BLOG_ARTICLES` con `{ slug, cat, titulo, titulo_en }`
   - El `slug` debe matchear el del frontmatter y el filename.
4. **Cross-links** opcionalmente en `lib/cross-links.ts`:
   - `WIKI_LINKS[slug]` o `BLOG_LINKS[slug]` con corredores/operadores
     relacionados.
   - `CORRIDOR_WIKIS` / `CORRIDOR_BLOGS` si el artículo es relevante a
     un corredor específico.
5. **Sitemap** se actualiza automático — itera `WIKI_ARTICLES` /
   `BLOG_ARTICLES` sin cambios manuales.

## Estado 2026-04-25

- 14 wiki entries en registry · 14 con `.md` publicado · 0 placeholders
- 21 blog entries en registry · 15 con `.md` publicado · 6 placeholders
  - Los 6 placeholders son intencionales: contenido por escribir.

## Caveats

- **Locale**: hoy los `.md` son **ES-only**. EN siempre cae al
  placeholder. Cuando se traduzca, `page.tsx` puede pasar el `bodyHtml`
  específico por locale (separar en `content/wiki/<slug>.<locale>.md`
  o agregar `bodyHtmlEn` al frontmatter).
- **Slug renames**: si un slug del registry cambia, hay que sincronizar
  `WIKI_LINKS` / `BLOG_LINKS` / `CORRIDOR_WIKIS` / `CORRIDOR_BLOGS`. El
  TypeScript NO catchea estos mismatches (los maps son
  `Record<string, …>`).
- **Sanitización**: `marked` está configurado con `breaks: false, gfm:
  true` — sin extensiones de scripting. Los `.md` los escribe el
  founder (no son user-generated), riesgo XSS bajo. Igual el
  `dangerouslySetInnerHTML` está en wrapper con clase `prose-legal` que
  no permite estilos arbitrarios.
- **Build time**: la lectura del `.md` ocurre en `generateMetadata` y
  `page.tsx` (Server Components). El bundle del cliente NO recibe
  `fs/path`, solo el HTML resultante.

## Archivos relacionados

- [lib/markdown-content.ts](../lib/markdown-content.ts) — helper
- [lib/corredores.ts](../lib/corredores.ts) — `WIKI_ARTICLES`,
  `BLOG_ARTICLES`
- [lib/cross-links.ts](../lib/cross-links.ts) — links/maps
- [app/sitemap.ts](../app/sitemap.ts) — itera ambos registries
- [app/globals.css](../app/globals.css) — clase `prose-legal` que
  estiliza el HTML renderizado (h2/h3/p/ul/ol/blockquote/code/em/hr)
