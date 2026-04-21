'use client'

import { useLocale } from 'next-intl'
import { OPERADORES_DATA, CORREDORES_DATA } from '@/lib/corredores'
import { PAISES_MVP } from '@/lib/paises'
import { OPERATOR_COMPETITORS, BLOG_LINKS } from '@/lib/cross-links'
import LegalPage from '@/components/LegalPage'

export default function OperadorContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const op = OPERADORES_DATA.find(o => o.slug === slug)

  if (!op) return <div className="min-h-screen flex items-center justify-center">404</div>

  const competitors = (OPERATOR_COMPETITORS[slug] || []).map(s => OPERADORES_DATA.find(o => o.slug === s)).filter(Boolean)
  const relatedBlogs = Object.entries(BLOG_LINKS).filter(([, v]) => v.operadores.includes(slug)).map(([blogSlug]) => blogSlug)

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
        {PAISES_MVP.map(p => (
          <li key={p.corredorId}>
            <a href={`/${locale}/${en ? p.slugEn : p.slugEs}`} className="text-[var(--color-blue)] font-semibold hover:underline inline-flex items-center gap-1.5">
              <img
                src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                alt=""
                width={22}
                height={15}
                loading="lazy"
                decoding="async"
                className="w-[22px] h-[15px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
              />
              <span>{en ? p.nombreEn : p.nombre}</span>
            </a> ({CORREDORES_DATA.find(c => c.id === p.corredorId)?.moneda})
          </li>
        ))}
      </ul>

      <h2>{en ? 'Current rates' : 'Tasas actuales'}</h2>
      <p>{en
        ? `Check the current ${op.nombre} exchange rate for all corridors in our comparator.`
        : `Consulta la tasa actual de ${op.nombre} para todos los corredores en nuestro comparador.`}</p>

      {/* Compare with competitors */}
      {competitors.length > 0 && (
        <>
          <h2>{en ? `Compare ${op.nombre} with` : `Compara ${op.nombre} con`}</h2>
          <ul>
            {competitors.map(comp => comp && (
              <li key={comp.slug}>
                <a href={`/${locale}/operadores/${comp.slug}`} className="text-[var(--color-blue)] font-semibold hover:underline">
                  {op.nombre} vs {comp.nombre}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Related blog articles */}
      {relatedBlogs.length > 0 && (
        <>
          <h2>{en ? 'Related articles' : 'Artículos relacionados'}</h2>
          <ul>
            {relatedBlogs.map(blogSlug => (
              <li key={blogSlug}>
                <a href={`/${locale}/blog/${blogSlug}`} className="text-[var(--color-blue)] font-semibold hover:underline">
                  {blogSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="text-center mt-8">
        <a
          href={`/${locale}`}
          className="inline-block bg-[var(--color-blue)] px-8 py-4 rounded-full font-extrabold text-base hover:bg-[var(--color-blue-dark)] transition-colors"
          style={{ color: '#fff', borderBottom: 'none' }}
        >
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
