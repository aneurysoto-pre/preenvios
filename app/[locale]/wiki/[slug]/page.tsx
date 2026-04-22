import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { WIKI_ARTICLES } from '@/lib/corredores'
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

  const title = en ? article.titulo_en : article.titulo

  return {
    title: en
      ? `${title} — PreEnvios.com Wiki`
      : `${title} — Wiki de PreEnvios.com`,
    description: en
      ? `${title}. Educational guide for the Latino diaspora in the US on how to send money home with informed decisions. Part of PreEnvios.com Wiki.`
      : `${title}. Guía educativa para la diáspora latina en EE.UU. sobre cómo enviar dinero a casa con decisiones informadas. Wiki de PreEnvios.com.`,
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
  return <WikiArticle slug={slug} />
}
