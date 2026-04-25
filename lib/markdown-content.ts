/**
 * Helper server-only para cargar contenido editorial de wikis y blog
 * desde archivos `.md` en `content/<section>/`.
 *
 * Patrón: el Server Component (page.tsx de wiki/blog) llama a
 * `loadMarkdownContent(section, slug)` en build time. El frontmatter se
 * parsea con gray-matter, el cuerpo se convierte a HTML con marked, y
 * el resultado viaja como prop al Client Component que lo renderiza con
 * `dangerouslySetInnerHTML`. Si no hay .md, devuelve null y el
 * componente cae al placeholder "Próximamente".
 *
 * SSG-safe: solo corre server-side (fs/path no existen en cliente). El
 * HTML resultante es un string que viaja por el wire al cliente.
 *
 * Seguridad: los .md los escribe el founder (no son user-generated). El
 * riesgo XSS es bajo. Igual configuramos marked con `breaks: false,
 * gfm: true` (sin extensiones de scripting). Renderizado en wrapper con
 * clase `prose-legal` (estilos en globals.css).
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

export type ContentSection = 'wiki' | 'blog'

export type MarkdownContent = {
  /** Title del frontmatter — anula el título hardcoded del registry si existe */
  title: string
  /** Description del frontmatter — usada para metadata SEO */
  description: string
  /** Category del frontmatter — debe matchear una key en CATS de wiki/blog index */
  category: string
  /** HTML resultante del markdown — safe para dangerouslySetInnerHTML */
  bodyHtml: string
}

function contentDir(section: ContentSection): string {
  return join(process.cwd(), 'content', section)
}

/**
 * Carga el contenido de un artículo desde `content/<section>/<slug>.md`.
 *
 * Sync porque corre en build time (generateStaticParams + page.tsx). Si
 * el archivo no existe, devuelve null sin throw.
 *
 * @param section — 'wiki' o 'blog'
 * @param slug — debe matchear el slug del frontmatter (no incluye .md)
 * @returns MarkdownContent si el .md existe y parsea OK, o null
 */
export function loadMarkdownContent(section: ContentSection, slug: string): MarkdownContent | null {
  // Sanitize slug — solo a-z, 0-9, guiones. Defensa contra path traversal.
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const filePath = join(contentDir(section), `${slug}.md`)
  if (!existsSync(filePath)) return null

  const raw = readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  // Fail-soft: si el frontmatter está incompleto, igual renderizamos lo
  // que tengamos. Un .md sin title cae al fallback del registry.
  const title = typeof data.title === 'string' ? data.title : ''
  const description = typeof data.description === 'string' ? data.description : ''
  const category = typeof data.category === 'string' ? data.category : 'fundamentos'

  const bodyHtml = marked.parse(content, {
    breaks: false,
    gfm: true,
  }) as string

  return { title, description, category, bodyHtml }
}

/**
 * Lista de slugs publicados en una sección — lee `content/<section>/` en
 * build time y devuelve los nombres de archivo .md (sin extensión).
 * Usado por los índices (wiki/blog) para distinguir cuáles artículos
 * tienen .md vs cuáles siguen como "Próximamente".
 *
 * Si el directorio no existe, devuelve array vacío sin throw.
 */
export function listPublishedSlugs(section: ContentSection): string[] {
  const dir = contentDir(section)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.slice(0, -3))
}

// ─────────────────────────────────────────────────────────────────────
// Compat aliases (para no tocar imports antiguos en wiki/page.tsx)
// ─────────────────────────────────────────────────────────────────────

/** @deprecated usa loadMarkdownContent('wiki', slug) */
export function loadWikiContent(slug: string): MarkdownContent | null {
  return loadMarkdownContent('wiki', slug)
}

/** @deprecated usa listPublishedSlugs('wiki') */
export function listPublishedWikiSlugs(): string[] {
  return listPublishedSlugs('wiki')
}
