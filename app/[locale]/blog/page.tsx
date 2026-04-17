import { setRequestLocale } from 'next-intl/server'
import BlogIndex from './index-content'

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <BlogIndex />
}
