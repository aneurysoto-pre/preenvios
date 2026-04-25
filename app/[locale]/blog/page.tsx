import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BLOG_ARTICLES } from '@/lib/corredores'
import { listPublishedSlugs } from '@/lib/markdown-content'
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
      canonical: `https://preenvios.vercel.app/${locale}/blog`,
      languages: { es: 'https://preenvios.vercel.app/es/blog', en: 'https://preenvios.vercel.app/en/blog' },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `https://preenvios.vercel.app/${locale}/blog#blog`,
    url: `https://preenvios.vercel.app/${locale}/blog`,
    inLanguage: locale,
    name: en ? 'PreEnvios Blog' : 'Blog de PreEnvios',
    description: en
      ? 'News, comparisons and tips on sending money to Latin America. Real analysis of Remitly, Wise, Western Union and more.'
      : 'Noticias, comparativas y tips sobre enviar dinero a Latinoamérica. Análisis reales de Remitly, Wise, Western Union y más.',
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
    blogPost: BLOG_ARTICLES.map((post) => ({
      '@type': 'BlogPosting',
      headline: en ? post.titulo_en : post.titulo,
      url: `https://preenvios.vercel.app/${locale}/blog/${post.slug}`,
      inLanguage: locale,
    })),
  }

  // Lista de slugs con .md publicado — solo aplica para ES (los .md son
  // ES-only por ahora). En EN todos siguen como "Coming soon".
  const publishedSlugs = locale === 'en' ? [] : listPublishedSlugs('blog')

  return (
    <>
      <BlogIndex publishedSlugs={publishedSlugs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
