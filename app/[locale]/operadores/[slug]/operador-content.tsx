'use client'

import { useLocale } from 'next-intl'
import { OPERADORES_DATA, CORREDORES_DATA } from '@/lib/corredores'
import LegalPage from '@/components/LegalPage'

export default function OperadorContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const op = OPERADORES_DATA.find(o => o.slug === slug)

  if (!op) return <div className="min-h-screen flex items-center justify-center">404</div>

  return (
    <LegalPage
      tag={en ? 'Provider review' : 'Review de remesadora'}
      title={op.nombre}
      backLabel={en ? '← Back to home' : '← Volver al inicio'}
      updatedLabel={en ? 'Last updated' : 'Última actualización'}
    >
      <p className="text-lg leading-relaxed">{en ? op.desc_en : op.desc_es}</p>

      <h2>{en ? 'Corridors supported' : 'Corredores soportados'}</h2>
      <ul>
        {CORREDORES_DATA.map(c => (
          <li key={c.id}>{c.bandera} {en ? c.nombre_en : c.nombre} ({c.moneda})</li>
        ))}
      </ul>

      <h2>{en ? 'Current rates' : 'Tasas actuales'}</h2>
      <p>{en
        ? `Check the current ${op.nombre} exchange rate for all corridors in our comparator.`
        : `Consulta la tasa actual de ${op.nombre} para todos los corredores en nuestro comparador.`}</p>

      <div className="text-center mt-8">
        <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-8 py-4 rounded-full font-extrabold text-base">
          {en ? `Compare ${op.nombre} now` : `Comparar ${op.nombre} ahora`} →
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization',
        name: op.nombre, description: en ? op.desc_en : op.desc_es,
        url: `https://preenvios.com/${locale}/operadores/${slug}`,
      })}} />
    </LegalPage>
  )
}
