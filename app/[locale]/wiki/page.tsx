import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { WIKI_ARTICLES } from '@/lib/corredores'
import WikiIndex from './wiki-index'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Remittance guides — PreEnvios Wiki' : 'Guías de remesas — Wiki PreEnvios',
    description: en
      ? 'Free educational guides: how remittances work, mid-market rate, fees vs rate, choosing the right provider and more.'
      : 'Guías educativas gratis: cómo funcionan las remesas, tasa mid-market, diferencia tasa/comisión, cómo elegir remesadora y más.',
    alternates: {
      canonical: `https://preenvios.com/${locale}/wiki`,
      languages: { es: 'https://preenvios.com/es/wiki', en: 'https://preenvios.com/en/wiki' },
    },
  }
}

export default async function WikiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://preenvios.com/${locale}/wiki#collection`,
    url: `https://preenvios.com/${locale}/wiki`,
    inLanguage: locale,
    name: en ? 'PreEnvios Wiki — remittance guides' : 'Wiki PreEnvios — guías de remesas',
    description: en
      ? 'Free educational guides for the Latino diaspora in the US: how remittances work, mid-market rate, choosing the right provider, and more.'
      : 'Guías educativas gratuitas para la diáspora latina en EE.UU.: cómo funcionan las remesas, tasa mid-market, cómo elegir remesadora, y más.',
    publisher: { '@id': 'https://preenvios.com/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: WIKI_ARTICLES.length,
      itemListElement: WIKI_ARTICLES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://preenvios.com/${locale}/wiki/${a.slug}`,
        name: en ? a.titulo_en : a.titulo,
      })),
    },
  }

  return (
    <>
      <WikiIndex />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
