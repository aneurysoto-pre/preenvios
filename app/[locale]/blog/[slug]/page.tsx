import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import BlogArticle from './article'

/**
 * Metadata por post (SEO foundation). Cuando se agregue un post nuevo
 * al blog, agregar entry acá + incluir el slug en `app/sitemap.ts`
 * (array BLOG_SLUGS).
 */
const BLOG_META: Record<string, { titleEs: string; titleEn: string; descEs: string; descEn: string }> = {
  'cuanto-cobra-western-union-honduras': {
    titleEs: '¿Cuánto cobra Western Union por enviar a Honduras? — PreEnvios.com',
    titleEn: 'How much does Western Union charge to send to Honduras? — PreEnvios.com',
    descEs: 'Análisis de tasas, comisiones y tiempo de entrega de Western Union en el corredor USA → Honduras. Comparación con las otras 6 remesadoras.',
    descEn: 'Analysis of Western Union rates, fees and delivery times for the USA → Honduras corridor. Comparison with the other 6 remittance providers.',
  },
  'remitly-vs-western-union-dominicana': {
    titleEs: 'Remitly vs Western Union: cuál rinde más enviando a Rep. Dominicana — PreEnvios.com',
    titleEn: 'Remitly vs Western Union: which pays more when sending to Dominican Republic — PreEnvios.com',
    descEs: 'Comparación directa entre Remitly y Western Union en el corredor USA → República Dominicana. Tasas, comisiones, velocidades y cuánto llega realmente a destino.',
    descEn: 'Head-to-head comparison between Remitly and Western Union for the USA → Dominican Republic corridor. Rates, fees, speeds and what actually arrives.',
  },
  'forma-mas-barata-enviar-guatemala': {
    titleEs: 'La forma más barata de enviar dinero a Guatemala en 2026 — PreEnvios.com',
    titleEn: 'The cheapest way to send money to Guatemala in 2026 — PreEnvios.com',
    descEs: 'Comparativa de Wise, Remitly y Ria para enviar a Guatemala. Qué combinación de tasa y comisión le rinde más a tu familia.',
    descEn: 'Comparison of Wise, Remitly and Ria for sending to Guatemala. Which combination of rate and fee makes more for your family.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const en = locale === 'en'
  const meta = BLOG_META[slug]

  // Fallback genérico si el slug no existe — evita crash en páginas 404.
  if (!meta) {
    return {
      title: en ? 'Post not found — PreEnvios.com' : 'Post no encontrado — PreEnvios.com',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: en ? meta.titleEn : meta.titleEs,
    description: en ? meta.descEn : meta.descEs,
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
  return <BlogArticle slug={slug} />
}
