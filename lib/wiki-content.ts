/**
 * Helper server-only para cargar contenido editorial de wikis desde
 * archivos `.md` en `content/wiki/`.
 *
 * Patron: el componente client-side `WikiArticle` recibe `bodyHtml`
 * como prop opcional. Si el `.md` existe en disk, este helper lo lee
 * en build time (Server Component / generateStaticParams), parsea el
 * frontmatter con gray-matter y convierte el cuerpo a HTML con marked.
 * Si no existe, devuelve null y el componente cae al placeholder
 * "Próximamente".
 *
 * SSG-safe: se llama en `app/[locale]/wiki/[slug]/page.tsx`, que es un
 * Server Component. fs/path solo viven en el servidor — el bundle del
 * cliente no los recibe. El HTML resultante viaja como string al
 * Client Component vía prop.
 *
 * Seguridad: los .md los escribe el founder (no son user-generated),
 * así que el riesgo XSS es bajo. Igual configuramos marked con
 * `breaks: false, gfm: true` (sin extensiones que metan JavaScript)
 * y los renderizamos con `dangerouslySetInnerHTML` en una sección
 * con clase `prose` de tailwind typography.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const WIKI_CONTENT_DIR = join(process.cwd(), 'content', 'wiki')

export type WikiContent = {
  /** Title del frontmatter — anula el `titulo` de WIKI_ARTICLES si existe */
  title: string
  /** Description del frontmatter — usada para metadata SEO */
  description: string
  /** Category del frontmatter — debe matchear una key en CATS de wiki-index */
  category: string
  /** HTML resultante del markdown — safe para dangerouslySetInnerHTML */
  bodyHtml: string
}

/**
 * Carga el contenido de un wiki article desde `content/wiki/<slug>.md`.
 *
 * Sync porque corre en build time (generateStaticParams + page.tsx)
 * y queremos evitar Promise overhead en cada SSG path. Si el archivo
 * no existe, devuelve null sin throw.
 *
 * @param slug — debe matchear el slug del frontmatter (no incluye .md)
 * @returns WikiContent si el .md existe + parsea OK, o null si no existe
 */
export function loadWikiContent(slug: string): WikiContent | null {
  // Sanitize slug — solo a-z, 0-9, guiones. Defensa contra path traversal
  // en caso de que algún día slug venga de input dinámico (hoy viene de
  // generateStaticParams sobre WIKI_ARTICLES, que es hardcoded).
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const filePath = join(WIKI_CONTENT_DIR, `${slug}.md`)
  if (!existsSync(filePath)) return null

  const raw = readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  // Fail-soft: si el frontmatter está incompleto, igual renderizamos lo
  // que tengamos. Un .md sin title cae al fallback de WIKI_ARTICLES.
  const title = typeof data.title === 'string' ? data.title : ''
  const description = typeof data.description === 'string' ? data.description : ''
  const category = typeof data.category === 'string' ? data.category : 'fundamentos'

  // marked.parse es sync por default cuando no se le pasan async extensions
  const bodyHtml = marked.parse(content, {
    breaks: false,
    gfm: true,
  }) as string

  return { title, description, category, bodyHtml }
}

/**
 * Lista de slugs publicados — lee el directorio `content/wiki/` en build
 * time y devuelve los nombres de archivo `.md` (sin extensión). Usado por
 * el índice (`wiki-index.tsx`) para distinguir cuáles artículos tienen
 * contenido vs cuáles siguen como "Próximamente".
 *
 * Sync por la misma razón que loadWikiContent (build time, sin overhead).
 * Si el directorio no existe, devuelve array vacío sin throw.
 */
export function listPublishedWikiSlugs(): string[] {
  if (!existsSync(WIKI_CONTENT_DIR)) return []
  return readdirSync(WIKI_CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.slice(0, -3))
}

