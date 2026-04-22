'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { PAISES_MVP } from '@/lib/paises'

type TasaBC = {
  id: string
  codigo_pais: string
  moneda: string
  nombre_banco: string
  nombre_banco_en: string
  siglas: string
  tasa: number
  nota: string
  nota_en: string
}

const SIGLAS_COLORS: Record<string, string> = {
  BCH:  'bg-gradient-to-br from-[#0054A3] to-[#00305C]',
  BCRD: 'bg-gradient-to-br from-[#C8102E] to-[#7A0A1C]',
  BG:   'bg-gradient-to-br from-[#1E4D9E] to-[#0D2C5E]',
  BCR:  'bg-gradient-to-br from-[#0033A0] to-[#001A52]',
  // Banco de la Republica (Colombia) — gold oscuro para que 'BR' en blanco se lea nitido
  BR:   'bg-gradient-to-br from-[#C28A00] to-[#7A5700]',
  BM:   'bg-gradient-to-br from-[#006341] to-[#003A24]',
  BCN:  'bg-gradient-to-br from-[#0066B3] to-[#003D6B]',
  BRH:  'bg-gradient-to-br from-[#00209F] to-[#001260]',
}

// Flag emojis were replaced with flagcdn PNGs (2026-04-18) because Windows
// renders flag emojis as the ISO-letter pair ("HN", "DO"...) instead of the flag glyph.
const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  hn: { es: 'Honduras', en: 'Honduras' },
  do: { es: 'República Dominicana', en: 'Dominican Republic' },
  gt: { es: 'Guatemala', en: 'Guatemala' },
  sv: { es: 'El Salvador', en: 'El Salvador' },
  co: { es: 'Colombia', en: 'Colombia' },
  mx: { es: 'México', en: 'Mexico' },
}

/** @param filterCodigoPais — if set, show only this country's rate card (e.g. 'gt') */
export default function TasasReferencia({ filterCodigoPais }: { filterCodigoPais?: string } = {}) {
  const t = useTranslations('banks')
  const locale = useLocale()
  const en = locale === 'en'
  const [tasas, setTasas] = useState<TasaBC[]>([])

  useEffect(() => {
    fetch('/api/tasas-banco-central')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTasas(data) })
  }, [])

  // If filtering by country, show only that one; otherwise mostrar los 6
  // corredores activos (HN, DR, GT, SV, CO, MX) en el orden definido en
  // PAISES_MVP. La API puede devolver paises adicionales que todavia no
  // estan en UI — se filtran aqui.
  const visibles = filterCodigoPais
    ? tasas.filter(t => t.codigo_pais === filterCodigoPais)
    : PAISES_MVP.map(p => tasas.find(t => t.codigo_pais === p.codigoPais)).filter(Boolean) as TasaBC[]

  if (visibles.length === 0) return null

  return (
    <section className="pt-10 pb-14 bg-gradient-to-b from-g50 to-white">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <h3 className="font-heading text-xl font-extrabold flex items-center gap-2.5">
            <span className="w-[9px] h-[9px] bg-green rounded-full animate-pulse shadow-[0_0_0_0_rgba(0,217,87,.6)]" />
            {t('title')}
          </h3>
          <span className="text-xs text-ink-2 font-semibold">{t('subtitle')}</span>
        </div>

        {/* Cards grid — 6 paises = 2 filas de 3 en desktop (lg), 2 col en tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visibles.map(bc => {
            const displayRate = bc.nota
              ? `${bc.tasa.toFixed(2)} ${en && bc.nota_en ? bc.nota_en : bc.nota}`
              : `${bc.tasa.toFixed(2)} ${bc.moneda}${t('perUsd')}`

            return (
              <div
                key={bc.id}
                className="bg-white border-[1.5px] border-g200 rounded-[14px] px-5 py-4 flex items-center gap-3.5 transition-all hover:border-blue hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(15,23,42,.08)]"
              >
                {/* Logo */}
                <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-white font-heading font-black text-sm shrink-0 ${SIGLAS_COLORS[bc.siglas] || 'bg-blue'}`}>
                  {bc.siglas}
                </div>

                {/* Info — todo en font-heading (Work Sans) para viveza y legibilidad */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading flex items-center gap-1.5 text-[11px] text-ink-2 font-medium mb-0.5">
                    <Image
                      src={`https://flagcdn.com/w40/${bc.codigo_pais}.png`}
                      alt=""
                      width={18}
                      height={12}
                      loading="lazy"
                      unoptimized
                      className="rounded-[1.5px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
                    />
                    <span>{COUNTRY_NAMES[bc.codigo_pais]?.[locale] || bc.codigo_pais.toUpperCase()}</span>
                  </div>
                  {/* line-clamp-2 permite hasta 2 lineas para nombres de bancos
                      largos (ej. "Banco Central de la Rep. Dominicana",
                      "Banque de la République d'Haïti"). Reemplaza el
                      whitespace-nowrap + overflow-hidden + text-ellipsis
                      previo que truncaba agresivamente en mobile con cards
                      de ancho reducido. */}
                  <div className="font-heading text-[13px] font-extrabold text-ink line-clamp-2 leading-tight">
                    {en ? bc.nombre_banco_en : bc.nombre_banco}
                  </div>
                  <div className="font-heading text-base font-black text-green-dark">
                    {displayRate}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div className="mt-4 text-xs text-ink-2 text-center">
          {t('note')}
        </div>
      </div>
    </section>
  )
}
