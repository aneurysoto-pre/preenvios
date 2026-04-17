'use client'

import { useLocale } from 'next-intl'
import { WIKI_ARTICLES } from '@/lib/corredores'
import LegalPage from '@/components/LegalPage'

export default function WikiArticle({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const article = WIKI_ARTICLES.find(a => a.slug === slug)

  if (!article) return <div className="min-h-screen flex items-center justify-center">404</div>

  const title = en ? article.titulo_en : article.titulo

  return (
    <LegalPage
      tag="Wiki"
      title={title}
      backLabel={en ? '← Back to wiki' : '← Volver a la wiki'}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="font-extrabold text-xl mb-3">{en ? 'Coming soon — full guide in preparation' : 'Próximamente — guía completa en preparación'}</h2>
        <p className="text-[var(--color-ink-2)] max-w-[480px] mx-auto">{en
          ? 'We are writing this article with real data and practical advice for the Latin American diaspora in the US.'
          : 'Estamos escribiendo este artículo con datos reales y consejos prácticos para la diáspora latinoamericana en EE.UU.'}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-6 py-3 rounded-full font-bold text-sm">{en ? 'Compare now' : 'Comparar ahora'} →</a>
          <a href={`/${locale}/wiki`} className="inline-block bg-[var(--color-g200)] text-[var(--color-ink)] px-6 py-3 rounded-full font-bold text-sm">{en ? 'All articles' : 'Todos los artículos'}</a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: title,
        datePublished: '2026-04-17',
        publisher: { '@type': 'Organization', name: 'PreEnvios.com', url: 'https://preenvios.com' },
        mainEntityOfPage: `https://preenvios.com/${locale}/wiki/${slug}`,
      })}} />
    </LegalPage>
  )
}
