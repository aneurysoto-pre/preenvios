'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { rankProviders, type Precio, type PrecioRanked } from '@/lib/ranking'

// ═══════════════════════════════════════
// DATOS ESTÁTICOS
// ═══════════════════════════════════════
const CORREDORES = [
  { id: 'dominican_republic', nombre: 'Rep. Dominicana', nombre_en: 'Dominican Republic', moneda: 'DOP', simbolo: 'RD$', bandera: '🇩🇴', codigo_pais: 'do', aliases: ['do','dop','dom','dominicana','dominican','rd','republica'] },
  { id: 'honduras',           nombre: 'Honduras',        nombre_en: 'Honduras',           moneda: 'HNL', simbolo: 'L',    bandera: '🇭🇳', codigo_pais: 'hn', aliases: ['hn','hnl','hon','hondur','catracho'] },
  { id: 'guatemala',          nombre: 'Guatemala',        nombre_en: 'Guatemala',          moneda: 'GTQ', simbolo: 'Q',    bandera: '🇬🇹', codigo_pais: 'gt', aliases: ['gt','gtq','guat','guate','chapín'] },
  { id: 'el_salvador',        nombre: 'El Salvador',      nombre_en: 'El Salvador',        moneda: 'USD', simbolo: '$',    bandera: '🇸🇻', codigo_pais: 'sv', aliases: ['sv','slv','salv','salvador','guanaco'] },
  { id: 'colombia',           nombre: 'Colombia',         nombre_en: 'Colombia',           moneda: 'COP', simbolo: '$',    bandera: '🇨🇴', codigo_pais: 'co', aliases: ['co','cop','col','colom','paisa'] },
  { id: 'mexico',             nombre: 'México',           nombre_en: 'Mexico',             moneda: 'MXN', simbolo: '$',    bandera: '🇲🇽', codigo_pais: 'mx', aliases: ['mx','mxn','mex','mexi','mexico'] },
  { id: 'nicaragua',          nombre: 'Nicaragua',        nombre_en: 'Nicaragua',          moneda: 'NIO', simbolo: 'C$',   bandera: '🇳🇮', codigo_pais: 'ni', aliases: ['ni','nio','nic','nicar','nica'] },
  { id: 'haiti',              nombre: 'Haití',            nombre_en: 'Haiti',              moneda: 'HTG', simbolo: 'G',    bandera: '🇭🇹', codigo_pais: 'ht', aliases: ['ht','htg','hai','haiti','ayiti'] },
]

const METODOS = [
  { id: 'bank',        icon: '🏦', es: 'Cuenta bancaria',   en: 'Bank account' },
  { id: 'cash_pickup', icon: '💵', es: 'Retiro en efectivo', en: 'Cash pickup' },
  { id: 'delivery',    icon: '🏠', es: 'Domicilio',          en: 'Home delivery' },
  { id: 'mobile',      icon: '📱', es: 'Billetera móvil',    en: 'Mobile wallet' },
]

const LOGOS: Record<string, string> = {
  remitly:      'https://cdn.brandfetch.io/remitly.com/w/120/h/120',
  wise:         'https://cdn.brandfetch.io/wise.com/w/120/h/120',
  xoom:         'https://cdn.brandfetch.io/xoom.com/w/120/h/120',
  ria:          'https://cdn.brandfetch.io/riamoneytransfer.com/w/120/h/120',
  worldremit:   'https://cdn.brandfetch.io/worldremit.com/w/120/h/120',
  westernunion: 'https://cdn.brandfetch.io/westernunion.com/w/120/h/120',
  moneygram:    'https://cdn.brandfetch.io/moneygram.com/w/120/h/120',
}

declare function gtag(...args: unknown[]): void

export default function Comparador({ defaultCorredor }: { defaultCorredor?: string } = {}) {
  const t = useTranslations()
  const locale = useLocale()
  const [corredor, setCorredor] = useState(defaultCorredor || 'dominican_republic')
  const [monto, setMonto] = useState('')
  const [metodo, setMetodo] = useState('bank')
  const [precios, setPrecios] = useState<Precio[]>([])
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t0 = useRef(Date.now())
  const inicioEnviado = useRef(false)

  const corredorData = CORREDORES.find(c => c.id === corredor)!
  const montoNum = parseFloat(monto) || 0

  // ═══════════════════════════════════════
  // FETCH PRECIOS
  // ═══════════════════════════════════════
  useEffect(() => {
    async function fetchPrecios() {
      setLoading(true)
      try {
        const res = await fetch(`/api/precios?corredor=${corredor}&metodo=${metodo}`)
        const data = await res.json()
        if (Array.isArray(data)) setPrecios(data)
      } catch { /* silent */ }
      setLoading(false)
    }
    fetchPrecios()
  }, [corredor, metodo])

  // ═══════════════════════════════════════
  // COOKIE corredor
  // ═══════════════════════════════════════
  useEffect(() => {
    const saved = document.cookie.match(/preenvios_corredor=([^;]*)/)?.[1]
    if (saved && CORREDORES.some(c => c.id === saved)) setCorredor(saved)
  }, [])

  useEffect(() => {
    const d = new Date(); d.setTime(d.getTime() + 30*24*60*60*1000)
    document.cookie = `preenvios_corredor=${corredor};expires=${d.toUTCString()};path=/;SameSite=Lax`
  }, [corredor])

  // ═══════════════════════════════════════
  // CLOSE SEARCH ON OUTSIDE CLICK
  // ═══════════════════════════════════════
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ═══════════════════════════════════════
  // RANKING
  // ═══════════════════════════════════════
  const ranked = useMemo(() => {
    if (montoNum <= 0 || precios.length === 0) return []
    return rankProviders(precios, montoNum)
  }, [precios, montoNum])

  // ═══════════════════════════════════════
  // SEARCH FILTER
  // ═══════════════════════════════════════
  const filteredCorredores = CORREDORES.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.nombre.toLowerCase().includes(q)
      || c.nombre_en.toLowerCase().includes(q)
      || c.moneda.toLowerCase().includes(q)
      || c.codigo_pais.includes(q)
      || c.aliases.some(a => a.includes(q))
  })

  // ═══════════════════════════════════════
  // GA4 HELPERS
  // ═══════════════════════════════════════
  function secs() { return Math.round((Date.now() - t0.current) / 1000) }

  function trackEvent(name: string, params: Record<string, unknown>) {
    if (typeof gtag === 'function') gtag('event', name, params)
  }

  // ═══════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════
  function selectCorredor(id: string) {
    setCorredor(id)
    setSearchOpen(false)
    setSearchQuery('')
    trackEvent('cambio_corredor', { corredor: id, segundos: secs() })
  }

  function selectMetodo(id: string) {
    setMetodo(id)
    trackEvent('cambio_metodo_entrega', { metodo: id, corredor, segundos: secs() })
  }

  function onMontoChange(val: string) {
    setMonto(val)
    if (!inicioEnviado.current && val.length > 0) {
      inicioEnviado.current = true
      trackEvent('inicio_uso', { corredor, segundos_hasta_escribir: secs() })
    }
  }

  function onCompararClick() {
    if (montoNum <= 0) {
      inputRef.current?.focus()
      return
    }
    trackEvent('comparar_click', { monto: montoNum, corredor, metodo, segundos_hasta_comparar: secs() })
    document.getElementById('comparar')?.scrollIntoView({ behavior: 'smooth' })
  }

  function onOperadorClick(p: PrecioRanked, pos: number) {
    trackEvent('click_operador', {
      event_category: 'afiliado',
      event_label: p.operador,
      corredor, monto: montoNum, posicion: pos + 1,
      segundos_hasta_click: secs(),
    })
  }

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  const esUSD = corredorData.moneda === 'USD'
  const bestRate = precios.length > 0 ? Math.max(...precios.map(p => p.tasa)) : 0
  const rateText = esUSD
    ? `1 USD = 1 USD (${t('search.noConversion')})`
    : bestRate > 0 ? `1 USD = ${bestRate.toFixed(2)} ${corredorData.moneda}` : '—'

  return (
    <>
      {/* ═════ HERO + SEARCH CARD ═════ */}
      <section className="relative pt-24 pb-10 overflow-hidden bg-gradient-to-b from-white to-[#F5F9FF]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(10,79,229,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(10,79,229,.05) 1px,transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage: 'radial-gradient(ellipse at center,#000 40%,transparent 75%)',
        }} />
        <div className="relative max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-11 items-center">
          {/* Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-g200 px-3 py-1.5 rounded-full text-xs font-semibold text-g700 shadow-sm mb-4">
              <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
              {t('hero.badge')}
            </div>
            <h1 className="font-heading text-[clamp(32px,4.2vw,52px)] font-black leading-[1.05] mb-3.5">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-blue to-green bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-[17px] text-ink-2 max-w-[540px] mb-4">{t('hero.lede')}</p>
            <div className="flex gap-5 flex-wrap mt-4">
              {['noSignup', 'free'].map(k => (
                <span key={k} className="flex items-center gap-2 text-[13px] text-ink-2 font-bold">
                  <svg className="w-4 h-4 text-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t(`hero.${k}`)}
                </span>
              ))}
              <span className="flex items-center gap-2 text-[13px] text-ink-2 font-bold">
                <svg className="w-4 h-4 text-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t('hero.updatedToday')}
              </span>
            </div>
          </div>

          {/* Search card */}
          <div className="relative">
            <div className="absolute inset-[28px_-28px_-28px_28px] bg-blue-soft rounded-[32px] rotate-[4deg] opacity-60" />
            <div className="absolute inset-[14px_-14px_-14px_14px] bg-green-soft rounded-[32px] rotate-[2deg]" />
            <div className="relative bg-white rounded-[32px] p-5 shadow-[0_30px_70px_-20px_rgba(10,79,229,.35)] border border-g200 z-[2]">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-heading text-[17px] font-extrabold">{t('search.title')}</h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-dark bg-green-soft px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                  {t('search.live')}
                </span>
              </div>

              {/* Country search */}
              <div className="relative mb-2.5" ref={searchRef}>
                <div
                  className="bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 cursor-pointer transition-colors hover:border-blue"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <label className="block text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">{t('search.destination')}</label>
                  <div className="flex items-center gap-2.5">
                    <img src={`https://flagcdn.com/w40/${corredorData.codigo_pais}.png`} alt="" className="w-[30px] h-[22px] rounded-[3px] object-cover shadow-[0_0_0_1px_var(--color-g200)]" />
                    <span className="font-heading text-lg font-extrabold text-ink">{locale === 'en' ? corredorData.nombre_en : corredorData.nombre}</span>
                    <svg className="w-3 h-3 text-g500 ml-auto" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </div>
                </div>
                {searchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-g200 rounded-[14px] shadow-lg z-10 overflow-hidden">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={locale === 'en' ? 'Search by country, DOP, HNL...' : 'Busca por país, DOP, HNL...'}
                      className="w-full px-4 py-3 text-sm border-b border-g100 outline-none font-medium"
                      autoFocus
                    />
                    {filteredCorredores.map(c => (
                      <button
                        key={c.id}
                        onClick={() => selectCorredor(c.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-g50 transition-colors ${c.id === corredor ? 'bg-blue-soft' : ''}`}
                      >
                        <img src={`https://flagcdn.com/w40/${c.codigo_pais}.png`} alt="" className="w-[28px] h-[20px] rounded-[2px] object-cover" />
                        <span className="font-bold text-sm">{locale === 'en' ? c.nombre_en : c.nombre}</span>
                        <span className="text-xs text-g500 ml-auto">{c.moneda}</span>
                      </button>
                    ))}
                    {filteredCorredores.length === 0 && (
                      <div className="px-4 py-3 text-sm text-g500">{locale === 'en' ? 'No results' : 'Sin resultados'}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount input */}
              <div className="bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 mb-2.5 transition-colors focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(10,79,229,.08)]">
                <label className="block text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">{t('search.sendFrom')}</label>
                <div className="flex items-center gap-2.5">
                  <input
                    ref={inputRef}
                    type="number"
                    value={monto}
                    onChange={e => onMontoChange(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="flex-1 bg-transparent border-none outline-none font-heading text-[20px] sm:text-2xl font-extrabold text-ink min-w-0"
                  />
                  <div className="flex items-center gap-2 font-bold text-g700 text-[13px] sm:text-[15px] shrink-0">
                    <div className="w-[26px] h-[26px] rounded-full overflow-hidden shadow-[0_0_0_2px_white,0_0_0_3px_var(--color-g200)]">
                      <svg viewBox="0 0 60 30"><rect width="60" height="30" fill="#fff" /><g fill="#B22234"><rect y="0" width="60" height="2.3" /><rect y="4.6" width="60" height="2.3" /><rect y="9.2" width="60" height="2.3" /><rect y="13.8" width="60" height="2.3" /><rect y="18.4" width="60" height="2.3" /><rect y="23" width="60" height="2.3" /><rect y="27.6" width="60" height="2.4" /></g><rect width="24" height="16" fill="#3C3B6E" /></svg>
                    </div>
                    USD
                  </div>
                </div>
              </div>

              {/* Rate reference */}
              <div className="flex justify-between items-center px-1 py-2.5 text-[13px] text-g600">
                <span>{t('search.refRate')}</span>
                <b className="text-ink font-bold">{rateText}</b>
              </div>

              {/* Compare button */}
              <button
                onClick={onCompararClick}
                className="w-full bg-gradient-to-br from-blue to-blue-dark text-white py-[15px] rounded-[14px] text-[15px] font-extrabold flex items-center justify-center gap-2.5 transition-transform hover:-translate-y-0.5 shadow-[0_10px_25px_-8px_rgba(10,79,229,.55)] hover:shadow-[0_18px_36px_-10px_rgba(10,79,229,.6)] mt-1"
              >
                {t('search.button')}
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ DELIVERY METHOD SELECTOR + RESULTS ═════ */}
      {montoNum > 0 && (
        <section className="py-20 bg-g50 animate-[fadeIn_.5s_ease]" id="comparar">
          <div className="max-w-[1240px] mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8">
              <div>
                <h2 className="font-heading text-[clamp(22px,3.5vw,40px)] font-black leading-[1.1]">
                  {t('results.title')} <span className="text-blue">${montoNum.toLocaleString()} USD → {locale === 'en' ? corredorData.nombre_en : corredorData.nombre}</span>
                </h2>
                <p className="text-ink-2 mt-1.5 text-[15px]">{t('results.subtitle')}</p>
                <p className="text-xs text-g500 mt-1.5">
                  {t('disclaimers.d3')} <a href={`/${locale}/como-ganamos-dinero`} className="text-blue">{t('disclaimers.d3Link')}</a>
                </p>
              </div>
            </div>

            {/* Delivery method tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {METODOS.map(m => (
                <button
                  key={m.id}
                  onClick={() => selectMetodo(m.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    metodo === m.id
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-g600 border-g200 hover:border-blue'
                  }`}
                >
                  <span>{m.icon}</span>
                  {locale === 'en' ? m.en : m.es}
                  {m.id === 'bank' && <span className="text-[10px] bg-green text-white px-1.5 py-0.5 rounded-full font-extrabold uppercase">{t('delivery.popular')}</span>}
                </button>
              ))}
            </div>

            {/* Results cards */}
            {loading ? (
              <div className="text-center py-16 text-g500">Loading...</div>
            ) : ranked.length === 0 ? (
              <div className="bg-white border-[1.5px] border-dashed border-g300 rounded-[22px] p-12 text-center">
                <div className="text-[40px] mb-3">🕑</div>
                <h3 className="font-heading text-xl font-extrabold mb-2">{locale === 'en' ? 'Rates coming soon' : 'Tasas disponibles pronto'}</h3>
                <p className="text-ink-2 text-[15px] max-w-[420px] mx-auto">
                  {locale === 'en'
                    ? `We're verifying rates for ${corredorData.nombre_en} with this delivery method.`
                    : `Estamos verificando las tasas para ${corredorData.nombre} con este método de entrega.`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {ranked.map((p, i) => (
                  <ResultCard key={p.operador} p={p} i={i} esUSD={esUSD} moneda={corredorData.moneda} locale={locale} t={t} onClick={() => onOperadorClick(p, i)} />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-7 flex gap-3 items-start bg-[#FFFBEB] border border-[#FDE68A] border-l-4 border-l-[#F59E0B] rounded-xl p-4">
              <svg className="w-[18px] h-[18px] text-[#B45309] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="M10 6v5" strokeLinecap="round" /><circle cx="10" cy="14" r=".8" fill="currentColor" /></svg>
              <p className="text-[13px] text-[#78350F] leading-relaxed">
                <b>{locale === 'en' ? 'Important:' : 'Importante:'}</b>{' '}
                {locale === 'en'
                  ? 'Rates shown are approximate estimates for comparison purposes. PreEnvios does not handle, receive or transfer money — we only compare public information from remittance providers. Always confirm the final amount directly with the provider before sending.'
                  : 'Las tasas mostradas son estimaciones aproximadas con fines comparativos. PreEnvios no maneja, recibe ni transfiere dinero — solo comparamos información pública de las remesadoras. Confirma siempre el monto final directamente con la remesadora antes de enviar.'}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// ═══════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════
function ResultCard({ p, i, esUSD, moneda, locale, t, onClick }: {
  p: PrecioRanked; i: number; esUSD: boolean; moneda: string; locale: string
  t: ReturnType<typeof useTranslations>; onClick: () => void
}) {
  const receiveFmt = esUSD
    ? `$${p.recibe.toFixed(2)}`
    : `${Math.round(p.recibe).toLocaleString()} ${moneda}`

  const tag = i === 0 ? 'best' : i === 1 ? 'second' : ''
  const tagLabel = i === 0 ? t('results.bestOption') : i === 1 ? t('results.secondOption') : ''
  const tagBg = i === 0 ? 'bg-green' : 'bg-blue'
  const cardBorder = i === 0 ? 'border-green' : i === 1 ? 'border-blue' : 'border-g200'
  const cardBg = i === 0 ? 'bg-gradient-to-br from-white to-[#F0FDF4]' : i === 1 ? 'bg-gradient-to-br from-white to-[#F0F6FF]' : 'bg-white'
  const btnBg = i === 0 ? 'bg-green hover:bg-green-dark' : 'bg-blue hover:bg-blue-dark'

  return (
    <article className={`${cardBg} rounded-[22px] p-5 md:p-[22px_26px] grid grid-cols-[1fr_1fr] md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 md:gap-6 items-center border-[1.5px] ${cardBorder} transition-all hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden`}>
      {tag && (
        <span className={`absolute top-0 right-0 ${tagBg} text-white text-[10px] font-black px-3.5 py-1.5 rounded-bl-xl tracking-wider`}>
          {i === 0 ? '★ ' : ''}{tagLabel}
        </span>
      )}

      {/* Brand */}
      <div className="flex items-center gap-3 md:gap-4 col-span-2 md:col-span-1 min-w-0">
        <div className="w-[42px] h-[42px] md:w-12 md:h-12 rounded-[10px] bg-g50 border border-g200 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={LOGOS[p.operador]} alt={p.nombre_operador} className="w-9 h-9 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-[15px] md:text-base text-ink truncate">{p.nombre_operador}</div>
          <div className="flex items-center gap-1.5 text-xs text-g500">
            <span className="text-yellow tracking-tight">{'★'.repeat(Math.round(p.rating))}</span>
            {p.rating} · {p.reviews.toLocaleString()} {t('results.reviews')}
          </div>
          <div className="text-[10px] font-bold text-blue mt-0.5">{t('results.score')}: {p.score}/100</div>
        </div>
      </div>

      {/* Rate */}
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">{t('results.rate')}</div>
        {esUSD ? (
          <>
            <div className="text-sm font-bold text-blue">{locale === 'en' ? 'No conversion' : 'Sin conversión'}</div>
            <div className="text-[11px] text-g500">USD → USD</div>
          </>
        ) : (
          <>
            <div className="text-sm font-bold text-blue">{p.tasa.toFixed(2)}</div>
            <div className="text-[11px] text-g500">{moneda} {t('results.perUsd')}</div>
          </>
        )}
      </div>

      {/* Fee */}
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">{t('results.fee')}</div>
        <div className="text-sm font-bold">{p.fee === 0 ? t('results.free') : `$${p.fee.toFixed(2)}`}</div>
        <div className="text-[11px] text-g500">{p.velocidad}</div>
      </div>

      {/* Receive */}
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">{t('results.theyReceive')}</div>
        <div className="font-heading text-lg md:text-[22px] font-black text-green-dark truncate">{receiveFmt}</div>
      </div>

      {/* CTA */}
      {/* CTA + Disclaimer #4 */}
      <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
        {p.afiliado ? (
          <>
            <a
              href={p.link}
              target="_blank"
              rel="noopener sponsored"
              onClick={onClick}
              className={`${btnBg} text-white py-3 px-5 rounded-[10px] font-extrabold text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:translate-x-0.5`}
              data-affiliate-slot={p.operador}
              data-corredor={p.corredor}
            >
              {t('results.sendNow')} <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <p className="text-[9px] text-g400 text-center leading-tight">{t('disclaimers.d4')}</p>
          </>
        ) : (
          <a
            href={p.link || `https://www.google.com/search?q=${encodeURIComponent(p.nombre_operador)}`}
            target="_blank"
            rel="noopener"
            onClick={onClick}
            className="bg-g200 text-g600 py-3 px-5 rounded-[10px] font-extrabold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {t('results.viewSite')} <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        )}
      </div>

      {/* Disclaimer #1 — tasas aproximadas */}
      <p className="col-span-2 md:col-span-5 text-[9px] text-g400 leading-tight mt-1">{t('disclaimers.d1')}</p>
    </article>
  )
}
