'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { CORREDORES_DATA } from '@/lib/corredores'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'
import AlertaForm from '@/components/AlertaForm'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Precio = { operador: string; nombre_operador: string; tasa: number; fee: number; velocidad: string; afiliado: boolean }
type HistorialEntry = { fecha: string; tasa_promedio: number }

export default function TasaHistorica({ pair }: { pair: string }) {
  const locale = useLocale()
  const en = locale === 'en'
  const corredor = CORREDORES_DATA.find(c => c.slug === pair)
  const [precios, setPrecios] = useState<Precio[]>([])
  const [historial, setHistorial] = useState<HistorialEntry[]>([])

  useEffect(() => {
    if (!corredor) return
    fetch(`/api/precios?corredor=${corredor.id}&metodo=bank`)
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setPrecios(d) })
    fetch(`/api/historial-tasas?corredor=${corredor.id}`)
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setHistorial(d) })
  }, [corredor])

  if (!corredor) return <div className="min-h-screen flex items-center justify-center">404</div>

  const bestRate = precios.length > 0 ? Math.max(...precios.map(p => p.tasa)) : 0
  const today = new Date().toLocaleDateString(en ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const title = en
    ? `US Dollar to ${corredor.moneda} exchange rate today — ${today}`
    : `Tasa del dólar en ${corredor.nombre} hoy — ${today}`

  return (
    <main>
      <Nav />
      <section className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-white to-[var(--color-g50)]">
        <div className="max-w-[920px] mx-auto px-6">
          <span className="inline-block text-xs font-extrabold text-[var(--color-blue)] uppercase tracking-[2px] mb-3 px-3.5 py-1.5 bg-[var(--color-blue-soft)] rounded-full">
            {corredor.bandera} {en ? corredor.nombre_en : corredor.nombre}
          </span>
          <h1 className="font-heading text-[clamp(26px,3.5vw,38px)] font-black leading-[1.1] mb-2">
            {en ? `USD to ${corredor.moneda} rate today` : `Tasa USD a ${corredor.moneda} hoy`}
          </h1>
          <p className="text-[var(--color-ink-2)] text-lg mb-8">
            {corredor.moneda === 'USD'
              ? (en ? 'El Salvador uses USD — no conversion needed' : 'El Salvador usa USD — no hay conversión')
              : (en ? `Best rate: 1 USD = ${bestRate.toFixed(2)} ${corredor.moneda}` : `Mejor tasa: 1 USD = ${bestRate.toFixed(2)} ${corredor.moneda}`)}
          </p>

          {/* Chart */}
          {corredor.moneda !== 'USD' && (
            <div className="bg-white rounded-[22px] p-6 border border-[var(--color-g200)] shadow-sm mb-8">
              <h2 className="font-heading font-extrabold text-lg mb-4">
                {en ? 'Rate fluctuation — last 30 days' : 'Fluctuación de la tasa — últimos 30 días'}
              </h2>
              {historial.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historial}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasa_promedio" stroke="#0A4FE5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-[var(--color-g500)]">
                  {en ? 'Historical data will be available when scrapers are active' : 'Los datos históricos estarán disponibles cuando los scrapers estén activos'}
                </div>
              )}
            </div>
          )}

          {/* Operators table */}
          <div className="bg-white rounded-[22px] p-6 border border-[var(--color-g200)] shadow-sm mb-8">
            <h2 className="font-heading font-extrabold text-lg mb-4">
              {en ? '7 providers compared' : '7 remesadoras comparadas'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-g200)]">
                    <th className="text-left py-3 px-2 font-bold text-[var(--color-g600)]">{en ? 'Provider' : 'Remesadora'}</th>
                    <th className="text-left py-3 px-2 font-bold text-[var(--color-g600)]">{en ? 'Rate' : 'Tasa'}</th>
                    <th className="text-left py-3 px-2 font-bold text-[var(--color-g600)]">{en ? 'Fee' : 'Comisión'}</th>
                    <th className="text-left py-3 px-2 font-bold text-[var(--color-g600)]">{en ? 'Speed' : 'Velocidad'}</th>
                  </tr>
                </thead>
                <tbody>
                  {precios.map(p => (
                    <tr key={p.operador} className="border-b border-[var(--color-g100)] hover:bg-[var(--color-g50)]">
                      <td className="py-3 px-2 font-bold">{p.nombre_operador}</td>
                      <td className="py-3 px-2 text-[var(--color-blue)] font-bold">{corredor.moneda === 'USD' ? '1.00' : p.tasa.toFixed(2)}</td>
                      <td className="py-3 px-2">{p.fee === 0 ? (en ? 'Free' : 'Gratis') : `$${p.fee}`}</td>
                      <td className="py-3 px-2">{p.velocidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription form */}
          <div className="mb-8">
            <AlertaForm corredorId={corredor.id} corredorNombre={en ? corredor.nombre_en : corredor.nombre} />
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href={`/${locale}`} className="inline-block bg-[var(--color-blue)] text-white px-8 py-4 rounded-full font-extrabold text-base hover:-translate-y-0.5 transition-transform shadow-lg">
              {en ? 'Compare all providers now' : 'Comparar todas las remesadoras ahora'} →
            </a>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ExchangeRateSpecification',
        currency: corredor.moneda,
        currentExchangeRate: {
          '@type': 'UnitPriceSpecification',
          price: bestRate,
          priceCurrency: 'USD',
        },
        name: title,
        url: `https://preenvios.com/${locale}/tasa/${pair}`,
      })}} />

      <Footer />
    </main>
  )
}
