'use client'
import { useLocale } from 'next-intl'
import { BLOG_ARTICLES } from '@/lib/corredores'
import LegalPage from '@/components/LegalPage'

// Categorías agrupadas (paridad 100% con el lote 2026-04-25). Orden de
// display = orden de aparición en este objeto.
const CATS: Record<string, { es: string; en: string; icon: string }> = {
  'guias-pais':    { es: 'Guías por país',    en: 'Country guides',     icon: '🌎' },
  comparaciones:   { es: 'Comparativas',      en: 'Head-to-head',       icon: '⚖️' },
  tendencias:      { es: 'Tendencias',        en: 'Trends',             icon: '🚀' },
  practicas:       { es: 'Guías prácticas',   en: 'Practical guides',   icon: '💡' },
}

type Props = {
  /**
   * Slugs con .md publicado en `content/blog/`. Calculado server-side
   * en `page.tsx`. Los slugs presentes acá NO muestran "Próximamente".
   */
  publishedSlugs?: string[]
}

export default function BlogIndex({ publishedSlugs = [] }: Props) {
  const locale = useLocale()
  const en = locale === 'en'
  const published = new Set(publishedSlugs)

  return (
    <LegalPage
      tag="Blog"
      title={en ? 'Remittance guides and comparisons' : 'Guías y comparaciones de remesas'}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      <p>{en
        ? 'In-depth guides and head-to-head comparisons for sending money to Latin America. Real analysis, no fluff.'
        : 'Guías detalladas y comparativas para enviar dinero a Latinoamérica. Análisis reales, sin relleno.'}</p>

      {Object.entries(CATS).map(([catKey, cat]) => {
        const articles = BLOG_ARTICLES.filter(a => a.cat === catKey)
        if (articles.length === 0) return null
        return (
          <div key={catKey} className="mt-8">
            <h2>{cat.icon} {en ? cat.en : cat.es}</h2>
            <div className="flex flex-col gap-3 mt-3">
              {articles.map(a => {
                const isPublished = published.has(a.slug)
                // En EN sin .md: linkeamos directo a /es/blog/<slug> en vez de
                // /en/blog/<slug> (que mostraría el placeholder). El badge
                // avisa que el artículo está en español.
                const href = en && !isPublished
                  ? `/es/blog/${a.slug}`
                  : `/${locale}/blog/${a.slug}`
                return (
                  <a
                    key={a.slug}
                    href={href}
                    className="bg-[var(--color-g50)] border-[1.5px] border-[var(--color-g200)] rounded-[14px] p-4 hover:border-[var(--color-blue)] hover:shadow-md transition-all block"
                  >
                    <h3 className="font-extrabold text-[15px] mb-1">{en ? a.titulo_en : a.titulo}</h3>
                    {isPublished ? (
                      <span className="text-[11px] font-semibold text-[var(--color-blue)]">{en ? 'Read article →' : 'Leer artículo →'}</span>
                    ) : (
                      <span className="text-[11px] text-[var(--color-g500)]">{en ? 'This article is available in Spanish' : 'Próximamente'}</span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        )
      })}
    </LegalPage>
  )
}
