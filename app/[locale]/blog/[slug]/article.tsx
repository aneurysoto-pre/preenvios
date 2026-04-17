'use client'
import { useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function BlogArticle({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <LegalPage tag="Blog" title={title} backLabel={en ? '← Back to blog' : '← Volver al blog'} updatedLabel={en ? 'Last updated' : 'Última actualización'}>
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="font-extrabold text-xl mb-3">{en ? 'Coming soon' : 'Próximamente'}</h2>
        <p className="text-[var(--color-ink-2)]">{en ? 'We are preparing this in-depth guide. Check back soon.' : 'Estamos preparando esta guía detallada. Vuelve pronto.'}</p>
        <a href={`/${locale}`} className="inline-block mt-6 bg-[var(--color-blue)] text-white px-6 py-3 rounded-full font-bold text-sm">{en ? 'Compare now' : 'Comparar ahora'} →</a>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: title, datePublished: '2026-04-17', publisher: { '@type': 'Organization', name: 'PreEnvios.com' }
      })}} />
    </LegalPage>
  )
}
