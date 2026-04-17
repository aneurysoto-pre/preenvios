import { setRequestLocale } from 'next-intl/server'
import { WIKI_ARTICLES } from '@/lib/corredores'
import WikiArticle from './wiki-article'

export function generateStaticParams() {
  return WIKI_ARTICLES.map(a => ({ slug: a.slug }))
}

export default async function WikiArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  return <WikiArticle slug={slug} />
}
