'use client'

import { useLocale } from 'next-intl'
import { WIKI_ARTICLES } from '@/lib/corredores'
import LegalPage from '@/components/LegalPage'

// Orden de display = orden de aparición en este objeto. Categoría 'metodos'
// agregada 2026-04-25 para los .md de wiki publicados (cash-pickup vs banco).
const CATS: Record<string, { es: string; en: string; icon: string }> = {
  fundamentos: { es: 'Fundamentos', en: 'Fundamentals', icon: '📚' },
  metodos:     { es: 'Métodos de envío', en: 'Sending methods', icon: '💸' },
  corredor:    { es: 'Guías por corredor', en: 'Corridor guides', icon: '🌎' },
  educacion:   { es: 'Educación financiera', en: 'Financial education', icon: '💡' },
}

type Props = {
  /**
   * Slugs con .md publicado en `content/wiki/`. Calculado server-side
   * en `page.tsx` y pasado como prop. Los slugs presentes acá NO
   * muestran el badge "Próximamente" en el listado.
   */
  publishedSlugs?: string[]
}

export default function WikiIndex({ publishedSlugs = [] }: Props) {
  const locale = useLocale()
  const en = locale === 'en'
  const published = new Set(publishedSlugs)

  return (
    <LegalPage
      tag="Wiki"
      title={en ? 'Remittance education center' : 'Centro educativo de remesas'}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      <p>{en
        ? 'Free guides to help you understand how remittances work, save on every transfer, and make better decisions.'
        : 'Guías gratuitas para entender cómo funcionan las remesas, ahorrar en cada envío y tomar mejores decisiones.'}</p>

      {Object.entries(CATS).map(([catKey, cat]) => {
        const articles = WIKI_ARTICLES.filter(a => a.cat === catKey)
        if (articles.length === 0) return null
        return (
          <div key={catKey} className="mt-8">
            <h2>{cat.icon} {en ? cat.en : cat.es}</h2>
            <div className="flex flex-col gap-3 mt-3">
              {articles.map(a => {
                const isPublished = published.has(a.slug)
                return (
                  <a
                    key={a.slug}
                    href={`/${locale}/wiki/${a.slug}`}
                    className="bg-[var(--color-g50)] border-[1.5px] border-[var(--color-g200)] rounded-[14px] p-4 hover:border-[var(--color-blue)] hover:shadow-md transition-all block"
                  >
                    <h3 className="font-extrabold text-[15px] mb-1">{en ? a.titulo_en : a.titulo}</h3>
                    {isPublished ? (
                      <span className="text-[11px] font-semibold text-[var(--color-blue)]">{en ? 'Read article →' : 'Leer artículo →'}</span>
                    ) : (
                      <span className="text-[11px] text-[var(--color-g500)]">{en ? 'Coming soon' : 'Próximamente'}</span>
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
