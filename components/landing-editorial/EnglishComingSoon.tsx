'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

/**
 * Fallback que se muestra cuando locale='en' y el pais tiene editorial
 * content disponible solo en ES.
 *
 * Decidido con founder (pregunta 6 del plan, 2026-04-24): estructura
 * `{ es: {...completo...}, en: null }` — el componente detecta EN sin
 * traduccion y ofrece volver al ES. NO se intenta mostrar el contenido
 * ES en URL EN ni traduccion automatica.
 *
 * Cuando un editor traduzca el contenido ES→EN a messages/en.json
 * (landing.editorial.honduras.*), ese bloque desaparece naturalmente
 * porque LandingEditorial ya no renderiza este componente (condicion
 * en el orquestador).
 */
type Props = {
  slugEs: string
}

export default function EnglishComingSoon({ slugEs }: Props) {
  const t = useTranslations('landing.editorial.comingSoon')

  return (
    <section className="py-14 md:py-20 bg-g50 border-t border-g200">
      <div className="max-w-[640px] mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-g200 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-g600 uppercase tracking-widest mb-5">
          🌐 EN / ES
        </div>
        <h2 className="font-heading font-black text-2xl md:text-3xl text-ink mb-3">
          {t('title')}
        </h2>
        <p className="text-g600 text-base leading-relaxed mb-6 max-w-[480px] mx-auto">
          {t('message')}
        </p>
        <Link
          href={`/es/${slugEs}`}
          className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-extrabold text-sm shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          {t('ctaEs')}
        </Link>
      </div>
    </section>
  )
}
