import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import BlogIndex from './index-content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Blog — PreEnvios' : 'Blog — PreEnvios',
    description: en
      ? 'News, comparisons and tips on sending money to Latin America. Real analysis of Remitly, Wise, Western Union and more.'
      : 'Noticias, comparativas y tips sobre enviar dinero a Latinoamérica. Análisis reales de Remitly, Wise, Western Union y más.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/blog`,
      languages: { es: 'https://preenvios.com/es/blog', en: 'https://preenvios.com/en/blog' },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <BlogIndex />
}
