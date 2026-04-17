'use client'

import { useLocale } from 'next-intl'
import { WIKI_ARTICLES } from '@/lib/corredores'
import LegalPage from '@/components/LegalPage'

const CATS: Record<string, { es: string; en: string; icon: string }> = {
  fundamentos: { es: 'Fundamentos', en: 'Fundamentals', icon: '📚' },
  corredor:    { es: 'Guías por corredor', en: 'Corridor guides', icon: '🌎' },
  educacion:   { es: 'Educación financiera', en: 'Financial education', icon: '💡' },
}

export default function WikiIndex() {
  const locale = useLocale()
  const en = locale === 'en'

  return (
    <LegalPage
      tag="Wiki"
      title={en ? 'Remittance education center' : 'Centro educativo de remesas'}
      backLabel={en ? '← Back to home' : '← Volver al inicio'}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      <p>{en
        ? 'Free guides to help you understand how remittances work, save on every transfer, and make better decisions.'
        : 'Guías gratuitas para entender cómo funcionan las remesas, ahorrar en cada envío y tomar mejores decisiones.'}</p>

      {Object.entries(CATS).map(([catKey, cat]) => {
        const articles = WIKI_ARTICLES.filter(a => a.cat === catKey)
        return (
          <div key={catKey} className="mt-8">
            <h2>{cat.icon} {en ? cat.en : cat.es}</h2>
            <div className="flex flex-col gap-3 mt-3">
              {articles.map(a => (
                <a
                  key={a.slug}
                  href={`/${locale}/wiki/${a.slug}`}
                  className="bg-[var(--color-g50)] border-[1.5px] border-[var(--color-g200)] rounded-[14px] p-4 hover:border-[var(--color-blue)] hover:shadow-md transition-all block"
                >
                  <h3 className="font-extrabold text-[15px] mb-1">{en ? a.titulo_en : a.titulo}</h3>
                  <span className="text-[11px] text-[var(--color-g500)]">{en ? 'Coming soon' : 'Próximamente'}</span>
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </LegalPage>
  )
}
