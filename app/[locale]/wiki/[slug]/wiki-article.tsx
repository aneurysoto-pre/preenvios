'use client'

import { useLocale } from 'next-intl'
import { WIKI_ARTICLES, OPERADORES_DATA } from '@/lib/corredores'
import { PAISES_MVP } from '@/lib/paises'
import { WIKI_LINKS } from '@/lib/cross-links'
import LegalPage from '@/components/LegalPage'

export default function WikiArticle({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const article = WIKI_ARTICLES.find(a => a.slug === slug)

  if (!article) return <div className="min-h-screen flex items-center justify-center">404</div>

  const title = en ? article.titulo_en : article.titulo
  const links = WIKI_LINKS[slug]
  const relatedCorredores = (links?.corredores || []).map(id => PAISES_MVP.find(p => p.corredorId === id)).filter(Boolean)
  const relatedOperadores = (links?.operadores || []).map(s => OPERADORES_DATA.find(o => o.slug === s)).filter(Boolean)

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

      {/* Cross-links */}
      {(relatedCorredores.length > 0 || relatedOperadores.length > 0) && (
        <div className="bg-[var(--color-g50)] rounded-[18px] p-6 border border-[var(--color-g200)] mt-4">
          <h3 className="font-bold text-sm mb-3">{en ? 'Related pages' : 'Páginas relacionadas'}</h3>
          <div className="flex flex-wrap gap-3">
            {relatedCorredores.map(p => p && (
              <a key={p.corredorId} href={`/${locale}/${en ? p.slugEn : p.slugEs}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline">
                {p.bandera} {en ? `Send to ${p.nombreEn}` : `Enviar a ${p.nombre}`}
              </a>
            ))}
            {relatedOperadores.map(op => op && (
              <a key={op.slug} href={`/${locale}/operadores/${op.slug}`} className="text-sm text-[var(--color-blue)] font-semibold hover:underline">
                {op.nombre}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Alert subscription CTA */}
      <div className="bg-[var(--color-blue-soft)] rounded-[18px] p-6 mt-6 text-center">
        <p className="font-bold text-sm mb-2">{en ? 'Get daily rate alerts' : 'Recibe alertas diarias de tasas'}</p>
        <p className="text-xs text-[var(--color-g600)] mb-3">{en ? 'Free daily email with the best rate for your corridor.' : 'Email gratis diario con la mejor tasa para tu corredor.'}</p>
        {PAISES_MVP.length > 0 && (
          <a href={`/${locale}/${en ? PAISES_MVP[0].slugEn : PAISES_MVP[0].slugEs}`} className="inline-block bg-[var(--color-blue)] text-white px-5 py-2 rounded-full font-bold text-xs">
            {en ? 'Subscribe free →' : 'Suscribirme gratis →'}
          </a>
        )}
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
