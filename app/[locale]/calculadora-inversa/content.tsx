'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Nav from '@/components/Nav'
import { Footer } from '@/components/Sections'

// 6 corredores activos (HN, DR, GT, SV, CO, MX). Nicaragua y Haiti existen en
// Supabase (precios seed) pero NO se exponen hasta tener scraper validado.
// codigo_pais: ISO 3166-1 alpha-2 para flagcdn.com (PNG flags, funcionan en Windows
// donde los emoji flags 🇩🇴🇭🇳🇬🇹🇸🇻🇨🇴🇲🇽 renderizan como las letras "do","hn","gt"...).
const CORREDORES = [
  { id: 'honduras',           nombre: 'Honduras',        nombre_en: 'Honduras',           moneda: 'HNL', simbolo: 'L',    codigo_pais: 'hn' },
  { id: 'dominican_republic', nombre: 'Rep. Dominicana', nombre_en: 'Dominican Republic', moneda: 'DOP', simbolo: 'RD$', codigo_pais: 'do' },
  { id: 'guatemala',          nombre: 'Guatemala',        nombre_en: 'Guatemala',          moneda: 'GTQ', simbolo: 'Q',    codigo_pais: 'gt' },
  { id: 'el_salvador',        nombre: 'El Salvador',      nombre_en: 'El Salvador',        moneda: 'USD', simbolo: '$',    codigo_pais: 'sv' },
  { id: 'colombia',           nombre: 'Colombia',         nombre_en: 'Colombia',           moneda: 'COP', simbolo: '$',    codigo_pais: 'co' },
  { id: 'mexico',             nombre: 'México',           nombre_en: 'Mexico',             moneda: 'MXN', simbolo: '$',    codigo_pais: 'mx' },
]

type Precio = { operador: string; nombre_operador: string; tasa: number; fee: number }

export default function CalculadoraInversaContent() {
  const locale = useLocale()
  const en = locale === 'en'
  const [corredor, setCorredor] = useState('honduras')
  const [monto, setMonto] = useState('')
  const [precios, setPrecios] = useState<Precio[]>([])

  const corredorData = CORREDORES.find(c => c.id === corredor)!
  const montoNum = parseFloat(monto) || 0

  useEffect(() => {
    fetch(`/api/precios?corredor=${corredor}&metodo=bank`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPrecios(data) })
  }, [corredor])

  const results = montoNum > 0
    ? precios
        .filter(p => p.tasa > 0)
        .map(p => ({
          ...p,
          usdSent: (montoNum / p.tasa) + p.fee,
        }))
        .sort((a, b) => a.usdSent - b.usdSent)
    : []

  const shareText = en
    ? `I received ${montoNum.toLocaleString()} ${corredorData.moneda}. Check how much was actually sent: preenvios.com/en/calculadora-inversa`
    : `Me llegaron ${montoNum.toLocaleString()} ${corredorData.moneda}. Mira cuánto realmente enviaron: preenvios.com/es/calculadora-inversa`

  return (
    <main>
      <Nav />
      <section className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-white to-g50">
        <div className="max-w-[720px] mx-auto px-6">
          <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">
            {en ? 'Reverse Calculator' : 'Calculadora inversa'}
          </span>
          <h1 className="font-heading text-[clamp(28px,4vw,42px)] font-black leading-[1.1] mb-4">
            {en ? 'How much did they send in dollars?' : '¿Cuánto enviaron en dólares?'}
          </h1>
          <p className="text-ink-2 text-[17px] mb-8">
            {en
              ? 'Enter the amount you received in local currency and see how much USD was sent through each provider.'
              : 'Escribe cuánto recibiste en moneda local y ve cuánto USD se envió por cada remesadora.'}
          </p>

          {/* Corridor selector */}
          <div className="bg-white rounded-[22px] p-5 shadow-lg border border-g200 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {CORREDORES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCorredor(c.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    corredor === c.id ? 'bg-ink text-white border-ink' : 'bg-white text-g600 border-g200 hover:border-blue'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${c.codigo_pais}.png`}
                    alt=""
                    width={24}
                    height={16}
                    loading="lazy"
                    decoding="async"
                    className="w-[22px] h-[15px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,.1)]"
                  />
                  {en ? c.nombre_en : c.nombre}
                </button>
              ))}
            </div>

            <label className="block text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">
              {en ? 'Amount received' : 'Monto recibido'} ({corredorData.moneda})
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-g500">{corredorData.simbolo}</span>
              <input
                type="number"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent border-none outline-none font-heading text-2xl font-extrabold text-ink min-w-0"
              />
              <span className="text-sm font-bold text-g500">{corredorData.moneda}</span>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              {results.map((r, i) => (
                <div key={r.operador} className={`bg-white rounded-[14px] p-4 border-[1.5px] ${i === 0 ? 'border-green bg-gradient-to-r from-white to-[#F0FDF4]' : 'border-g200'} flex justify-between items-center`}>
                  <div>
                    <div className="font-extrabold text-[15px]">{r.nombre_operador}</div>
                    <div className="text-xs text-g500">
                      {en ? 'Rate' : 'Tasa'}: {r.tasa} · {en ? 'Fee' : 'Comisión'}: {r.fee === 0 ? (en ? 'Free' : 'Gratis') : `$${r.fee}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-xl font-black text-ink">${r.usdSent.toFixed(2)}</div>
                    <div className="text-[10px] text-g500">{en ? 'USD sent' : 'USD enviados'}</div>
                  </div>
                </div>
              ))}

              {/* WhatsApp share button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-full font-extrabold text-sm mt-2 hover:-translate-y-0.5 transition-transform"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.12-1.27C8.57 21.54 10.23 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.12c-.23.65-1.36 1.22-1.87 1.3-.51.08-1 .12-3.23-.68-2.68-1-4.37-3.73-4.5-3.9-.13-.17-1.07-1.43-1.07-2.73 0-1.3.68-1.94.92-2.2.24-.27.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.59.45.22.53.74 1.82.8 1.95.07.13.12.28.02.45-.1.17-.14.27-.28.42-.14.14-.29.32-.42.43-.14.12-.28.25-.12.49.16.24.72 1.18 1.54 1.91 1.05.94 1.94 1.23 2.22 1.37.27.14.43.12.59-.07.16-.19.68-.8.86-1.07.18-.27.36-.23.61-.14.25.1 1.58.74 1.85.88.27.14.45.2.52.32.06.11.06.65-.17 1.3z" /></svg>
                {en ? 'Share on WhatsApp' : 'Compartir por WhatsApp'}
              </a>
            </div>
          )}

          {montoNum <= 0 && (
            <div className="text-center py-12 text-g500">
              {en ? 'Enter the amount you received to see results' : 'Escribe el monto que recibiste para ver resultados'}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
