import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { WIKI_ARTICLES } from '@/lib/corredores'
import { loadMarkdownContent } from '@/lib/markdown-content'
import WikiArticle from './wiki-article'

export function generateStaticParams() {
  return WIKI_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const en = locale === 'en'
  const article = WIKI_ARTICLES.find((a) => a.slug === slug)

  // Fallback genérico si el slug no existe — evita crash en páginas 404.
  if (!article) {
    return {
      title: en ? 'Wiki article not found — PreEnvios.com' : 'Artículo no encontrado — PreEnvios.com',
      robots: { index: false, follow: false },
    }
  }

  // Si hay `.md` publicado en `content/wiki/<slug>.md`, su frontmatter
  // (title + description) tiene prioridad sobre los strings hardcoded
  // en WIKI_ARTICLES — permite afinar SEO sin tocar código. Los .md
  // son ES-only por ahora; EN cae al fallback hasta que existan
  // versiones traducidas.
  const md = en ? null : loadMarkdownContent('wiki', slug)
  const title = md?.title || (en ? article.titulo_en : article.titulo)
  const description = md?.description
    ? md.description
    : en
    ? `${article.titulo_en}. Educational guide for the Latino diaspora in the US on how to send money home with informed decisions. Part of PreEnvios.com Wiki.`
    : `${article.titulo}. Guía educativa para la diáspora latina en EE.UU. sobre cómo enviar dinero a casa con decisiones informadas. Wiki de PreEnvios.com.`

  return {
    title: en
      ? `${title} — PreEnvios.com Wiki`
      : `${title} — Wiki de PreEnvios.com`,
    description,
    alternates: {
      canonical: `https://preenvios.com/${locale}/wiki/${slug}`,
      languages: {
        es: `https://preenvios.com/es/wiki/${slug}`,
        en: `https://preenvios.com/en/wiki/${slug}`,
      },
    },
  }
}

export default async function WikiArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Lectura del .md en build time (Server Component) — el HTML viaja al
  // Client Component vía prop. Si no hay .md, bodyHtml queda undefined
  // y el componente cae al placeholder "Próximamente". ES-only por ahora.
  const md = locale === 'en' ? null : loadMarkdownContent('wiki', slug)

  return <WikiArticle slug={slug} bodyHtml={md?.bodyHtml} mdTitle={md?.title} />
}
