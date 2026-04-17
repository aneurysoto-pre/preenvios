import { setRequestLocale } from 'next-intl/server'
import BlogArticle from './article'

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  return <BlogArticle slug={slug} />
}
