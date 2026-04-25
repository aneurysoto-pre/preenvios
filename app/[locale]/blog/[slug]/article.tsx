'use client'
import { useLocale } from 'next-intl'
import { OPERADORES_DATA, BLOG_ARTICLES } from '@/lib/corredores'
import { PAISES_MVP } from '@/lib/paises'
import { BLOG_LINKS } from '@/lib/cross-links'
import LegalPage from '@/components/LegalPage'

type Props = {
  slug: string
  /**
   * HTML pre-renderizado del .md correspondiente, leído en build time
   * por el Server Component (page.tsx → loadMarkdownContent). Si está
   * presente, reemplaza el placeholder "Próximamente".
   */
  bodyHtml?: string
  /** Title del frontmatter del .md — sobreescribe el `titulo` del registry */
  mdTitle?: string
}

export default function BlogArticle({ slug, bodyHtml, mdTitle }: Props) {
  const locale = useLocale()
  const en = locale === 'en'
  const article = BLOG_ARTICLES.find(a => a.slug === slug)

  // Fallback al estilo viejo (capitalize del slug) si el slug no está en
  // el registry — minimiza disrupción si alguien linkea a un slug ad-hoc.
  const fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const title = mdTitle || (article ? (en ? article.titulo_en : article.titulo) : fallbackTitle)

  const links = BLOG_LINKS[slug]
  const relatedCorredores = (links?.corredores || []).map(id => PAISES_MVP.find(p => p.corredorId === id)).filter(Boolean)
  const relatedOperadores = (links?.operadores || []).map(s => OPERADORES_DATA.find(o => o.slug === s)).filter(Boolean)

  // Hoy los .md están en español. Si la página es EN, ignoramos el .md y
  // caemos al placeholder. Cuando se traduzcan, page.tsx pasará el
  // bodyHtml correspondiente al locale.
  const hasContent = !en && typeof bodyHtml === 'string' && bodyHtml.length > 0

  return (
    <LegalPage tag="Blog" title={title} updatedLabel={en ? 'Last updated' : 'Última actualización'}>
      {hasContent ? (
        <article
          className="wiki-md-content"
          dangerouslySetInnerHTML={{ __html: bodyHtml as string }}
        />
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="font-extrabold text-xl mb-3">{en ? 'Coming soon' : 'Próximamente'}</h2>
          <p className="text-[var(--color-ink-2)]">{en ? 'We are preparing this in-depth guide. Check back soon.' : 'Estamos preparando esta guía detallada. Vuelve pronto.'}</p>
          <a href={`/${locale}`} className="inline-block mt-6 bg-[var(--color-blue)] text-white px-6 py-3 rounded-full font-bold text-sm">{en ? 'Compare now' : 'Comparar ahora'} →</a>
        </div>
      )}

      {/* Cross-links */}
      {(relatedCorredores.length > 0 || relatedOperadores.length > 0) && (
        <div className="bg-[var(--color-g50)] rounded-[18px] p-6 border border-[var(--color-g200)] mt-8">
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: title, datePublished: '2026-04-17',
        publisher: { '@type': 'Organization', name: 'PreEnvios.com', url: 'https://preenvios.com' },
        mainEntityOfPage: `https://preenvios.com/${locale}/blog/${slug}`,
      })}} />
    </LegalPage>
  )
}
