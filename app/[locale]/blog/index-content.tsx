'use client'
import { useLocale } from 'next-intl'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'
import LegalPage from '@/components/LegalPage'

const ARTICLES = [
  { slug: 'cuanto-cobra-western-union-honduras',       titulo: 'Cuánto cobra Western Union para enviar dinero a Honduras hoy',       titulo_en: 'How much does Western Union charge to send money to Honduras today' },
  { slug: 'remitly-vs-western-union-dominicana',        titulo: 'Remitly vs Western Union para enviar a República Dominicana',        titulo_en: 'Remitly vs Western Union for sending to the Dominican Republic' },
  { slug: 'forma-mas-barata-enviar-guatemala',          titulo: 'La forma más barata de mandar dinero a Guatemala en 2026',           titulo_en: 'The cheapest way to send money to Guatemala in 2026' },
]

export default function BlogIndex() {
  const locale = useLocale()
  const en = locale === 'en'
  return (
    <LegalPage tag="Blog" title={en ? 'Remittance guides and comparisons' : 'Guías y comparaciones de remesas'} backLabel={en ? '← Back to home' : '← Volver al inicio'} updatedLabel={en ? 'Last updated' : 'Última actualización'}>
      <p>{en ? 'Articles coming soon. We are preparing in-depth guides for each corridor.' : 'Artículos próximamente. Estamos preparando guías detalladas para cada corredor.'}</p>
      <div className="flex flex-col gap-4 mt-8">
        {ARTICLES.map(a => (
          <a key={a.slug} href={`/${locale}/blog/${a.slug}`} className="bg-[var(--color-g50)] border-[1.5px] border-[var(--color-g200)] rounded-[14px] p-5 hover:border-[var(--color-blue)] hover:shadow-md transition-all block">
            <h3 className="font-extrabold text-base mb-1">{en ? a.titulo_en : a.titulo}</h3>
            <span className="text-xs text-[var(--color-g500)]">{en ? 'Coming soon' : 'Próximamente'}</span>
          </a>
        ))}
      </div>
    </LegalPage>
  )
}
