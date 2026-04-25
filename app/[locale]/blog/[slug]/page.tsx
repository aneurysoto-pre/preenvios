import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BLOG_ARTICLES } from '@/lib/corredores'
import { loadMarkdownContent } from '@/lib/markdown-content'
import BlogArticle from './article'

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const en = locale === 'en'
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)

  // Fallback genérico si el slug no existe — evita crash en páginas 404.
  if (!article) {
    return {
      title: en ? 'Post not found — PreEnvios.com' : 'Post no encontrado — PreEnvios.com',
      robots: { index: false, follow: false },
    }
  }

  // Si hay `.md` en `content/blog/<slug>.md`, su frontmatter
  // (title + description) tiene prioridad sobre el registry. Los .md
  // son ES-only por ahora; EN cae al fallback derivado del título.
  const md = en ? null : loadMarkdownContent('blog', slug)
  const title = md?.title || (en ? article.titulo_en : article.titulo)
  const description = md?.description
    ? md.description
    : en
    ? `${article.titulo_en}. Practical guide for the Latino diaspora in the US on how to send money home with informed decisions. Part of PreEnvios.com Blog.`
    : `${article.titulo}. Guía práctica para la diáspora latina en EE.UU. sobre cómo enviar dinero a casa con decisiones informadas. Blog de PreEnvios.com.`

  return {
    title: en
      ? `${title} — PreEnvios.com Blog`
      : `${title} — Blog de PreEnvios.com`,
    description,
    alternates: {
      canonical: `https://preenvios.com/${locale}/blog/${slug}`,
      languages: {
        es: `https://preenvios.com/es/blog/${slug}`,
        en: `https://preenvios.com/en/blog/${slug}`,
      },
    },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Lectura del .md en build time. Si no hay .md, bodyHtml queda
  // undefined y el componente cae al placeholder "Próximamente".
  // ES-only por ahora.
  const md = locale === 'en' ? null : loadMarkdownContent('blog', slug)

  return <BlogArticle slug={slug} bodyHtml={md?.bodyHtml} mdTitle={md?.title} />
}
