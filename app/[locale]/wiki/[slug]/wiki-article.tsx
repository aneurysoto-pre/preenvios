'use client'

import { useLocale } from 'next-intl'
import { WIKI_ARTICLES, OPERADORES_DATA } from '@/lib/corredores'
import { PAISES_MVP } from '@/lib/paises'
import { WIKI_LINKS } from '@/lib/cross-links'
import LegalPage from '@/components/LegalPage'

type Props = {
  slug: string
  /**
   * HTML pre-renderizado del .md correspondiente, leído en build time
   * por el Server Component (page.tsx → loadWikiContent). Si está
   * presente, reemplaza el placeholder "Próximamente". Si no, el
   * componente sigue mostrando el placeholder histórico.
   */
  bodyHtml?: string
  /**
   * Title del frontmatter del .md — sobreescribe el `titulo` hardcoded
   * en WIKI_ARTICLES cuando hay contenido publicado.
   */
  mdTitle?: string
}

export default function WikiArticle({ slug, bodyHtml, mdTitle }: Props) {
  const locale = useLocale()
  const en = locale === 'en'
  const article = WIKI_ARTICLES.find(a => a.slug === slug)

  if (!article) return <div className="min-h-screen flex items-center justify-center">404</div>

  const title = mdTitle || (en ? article.titulo_en : article.titulo)
  const links = WIKI_LINKS[slug]
  const relatedCorredores = (links?.corredores || []).map(id => PAISES_MVP.find(p => p.corredorId === id)).filter(Boolean)
  const relatedOperadores = (links?.operadores || []).map(s => OPERADORES_DATA.find(o => o.slug === s)).filter(Boolean)

  // Hoy los .md están en español. Si la página es EN, ignoramos el .md
  // y caemos al placeholder. Cuando se traduzcan, page.tsx pasará el
  // bodyHtml correspondiente al locale.
  const hasContent = !en && typeof bodyHtml === 'string' && bodyHtml.length > 0

  return (
    <LegalPage
      tag="Wiki"
      title={title}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      {hasContent ? (
        // El CSS de LegalPage ya estiliza h2/h3/p/ul/strong/em dentro de
        // `prose`-style. dangerouslySetInnerHTML es seguro: los .md los
        // escribe el founder (no son user-generated) y marked está
        // configurado sin extensiones de scripting.
        <article
          className="wiki-md-content"
          dangerouslySetInnerHTML={{ __html: bodyHtml as string }}
        />
      ) : en ? (
        // EN sin .md publicado: el contenido SÍ existe en español. En lugar de
        // "Coming soon" (que sugiere ausencia), redirigimos al usuario a la
        // versión ES y al índice EN del wiki.
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌎</div>
          <h2 className="font-extrabold text-xl mb-3">This article is available in Spanish</h2>
          <p className="text-[var(--color-ink-2)] max-w-[480px] mx-auto">Our wiki content is currently in Spanish, focused on the Latino diaspora in the US.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {/* `!text-white` (Tailwind important) — el wrapper LegalPage usa
                `.prose-legal` que define `a { color: var(--color-blue) }`
                global con specificity (0,1,1) que vence a `.text-white`.
                Sin el bang, el texto del botón queda azul sobre fondo azul. */}
            <a href={`/es/wiki/${slug}`} className="inline-block bg-[var(--color-blue)] !text-white px-6 py-3 rounded-full font-bold text-sm">Read in Spanish →</a>
            <a href="/en/wiki" className="inline-block bg-[var(--color-g200)] text-[var(--color-ink)] px-6 py-3 rounded-full font-bold text-sm">Back to wiki index</a>
          </div>
        </div>
      ) : (
        // ES sin .md publicado — placeholder histórico de "Próximamente".
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="font-extrabold text-xl mb-3">Próximamente — guía completa en preparación</h2>
          <p className="text-[var(--color-ink-2)] max-w-[480px] mx-auto">Estamos escribiendo este artículo con datos reales y consejos prácticos para la diáspora latinoamericana en EE.UU.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] !text-white px-6 py-3 rounded-full font-bold text-sm">Comparar ahora →</a>
            <a href={`/${locale}/wiki`} className="inline-block bg-[var(--color-g200)] text-[var(--color-ink)] px-6 py-3 rounded-full font-bold text-sm">Todos los artículos</a>
          </div>
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

      {/* Volver al inicio — reemplaza el CTA de alertas anterior (2026-04-25)
          que tenía un botón sin texto-aria visible y un mensaje inconsistente
          con la acción real (linkeaba al primer país, no a /alertas). */}
      <div className="text-center mt-8">
        <a
          href={`/${locale}`}
          className="inline-block bg-[var(--color-g100)] text-[var(--color-ink)] px-6 py-3 rounded-full font-bold text-sm hover:bg-[var(--color-g200)] transition-colors"
        >
          {en ? '← Back to home' : '← Volver al inicio'}
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: title,
        datePublished: '2026-04-17',
        publisher: { '@type': 'Organization', name: 'PreEnvios.com', url: 'https://preenvios.vercel.app' },
        mainEntityOfPage: `https://preenvios.vercel.app/${locale}/wiki/${slug}`,
      })}} />
    </LegalPage>
  )
}
