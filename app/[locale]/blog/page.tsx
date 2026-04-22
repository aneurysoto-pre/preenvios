import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import BlogIndex from './index-content'

// Posts listados — si se agrega uno nuevo, agregar entry acá +
// su metadata en app/[locale]/blog/[slug]/page.tsx + slug en sitemap.
const BLOG_POSTS = [
  { slug: 'cuanto-cobra-western-union-honduras', titleEs: '¿Cuánto cobra Western Union por enviar a Honduras?', titleEn: 'How much does Western Union charge to send to Honduras?' },
  { slug: 'remitly-vs-western-union-dominicana', titleEs: 'Remitly vs Western Union: cuál rinde más enviando a Rep. Dominicana', titleEn: 'Remitly vs Western Union: which pays more when sending to Dominican Republic' },
  { slug: 'forma-mas-barata-enviar-guatemala', titleEs: 'La forma más barata de enviar dinero a Guatemala en 2026', titleEn: 'The cheapest way to send money to Guatemala in 2026' },
]

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
  const en = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `https://preenvios.com/${locale}/blog#blog`,
    url: `https://preenvios.com/${locale}/blog`,
    inLanguage: locale,
    name: en ? 'PreEnvios Blog' : 'Blog de PreEnvios',
    description: en
      ? 'News, comparisons and tips on sending money to Latin America. Real analysis of Remitly, Wise, Western Union and more.'
      : 'Noticias, comparativas y tips sobre enviar dinero a Latinoamérica. Análisis reales de Remitly, Wise, Western Union y más.',
    publisher: { '@id': 'https://preenvios.com/#organization' },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: en ? post.titleEn : post.titleEs,
      url: `https://preenvios.com/${locale}/blog/${post.slug}`,
      inLanguage: locale,
    })),
  }

  return (
    <>
      <BlogIndex />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
