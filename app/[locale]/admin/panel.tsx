'use client'

import { useState, useEffect } from 'react'

type Precio = {
  id: number; operador: string; corredor: string; metodo_entrega: string
  tasa: number; fee: number; velocidad: string; nombre_operador: string
  actualizado_en: string; afiliado: boolean
  comision_usd?: number | null; cookie_dias?: number | null; trafico_calificable?: number | null
}
type DashboardData = {
  timestamp: string; totalPrices: number; healthy: boolean
  operators: Record<string, { lastUpdate: string; stale: boolean; count: number }>
  staleOperators: string[]
}
type IngresosData = {
  periodo: string; total_mes: number
  afiliados: Record<string, { operador?: string; operadores?: string[]; clics: number; conversiones: number; comision: number; status: string }>
  suscripciones: { free: number; premium: number; mrr: number }
}

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<'dashboard' | 'precios' | 'ingresos'>('dashboard')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [precios, setPrecios] = useState<Precio[]>([])
  const [ingresos, setIngresos] = useState<IngresosData | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTasa, setEditTasa] = useState('')
  const [editFee, setEditFee] = useState('')
  const [saving, setSaving] = useState(false)
  const [alertaCorredor, setAlertaCorredor] = useState('')
  const [alertaMsg, setAlertaMsg] = useState('')
  const [opEdit, setOpEdit] = useState('')
  const [opComision, setOpComision] = useState('')
  const [opCookie, setOpCookie] = useState('')
  const [opTrafico, setOpTrafico] = useState('')
  const [opSaving, setOpSaving] = useState(false)
  const [opSaveMsg, setOpSaveMsg] = useState('')

  async function login() {
    setLoginError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) { setLoggedIn(true); loadDashboard() }
    else setLoginError('Credenciales incorrectas')
  }

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setLoggedIn(false)
  }

  async function loadDashboard() {
    const res = await fetch('/api/admin/dashboard')
    if (res.ok) setDashboard(await res.json())
  }

  async function loadPrecios() {
    const res = await fetch('/api/admin/precios')
    if (res.ok) setPrecios(await res.json())
  }

  async function loadIngresos() {
    const res = await fetch('/api/admin/ingresos')
    if (res.ok) setIngresos(await res.json())
  }

  async function savePrice(p: Precio) {
    setSaving(true)
    await fetch('/api/admin/precios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operador: p.operador, corredor: p.corredor, metodo_entrega: p.metodo_entrega, tasa: editTasa, fee: editFee }),
    })
    setEditingId(null)
    setSaving(false)
    loadPrecios()
  }

  async function sendAlerta() {
    if (!alertaCorredor) return
    await fetch('/api/admin/alertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corredor: alertaCorredor, mensaje: alertaMsg }),
    })
    setAlertaCorredor('')
    setAlertaMsg('')
  }

  async function runScrapers() {
    await fetch('/api/scrape')
    loadDashboard()
  }

  function selectOperador(op: string) {
    setOpEdit(op)
    setOpSaveMsg('')
    const row = precios.find(p => p.operador === op)
    if (row) {
      setOpComision(row.comision_usd != null ? String(row.comision_usd) : '')
      setOpCookie(row.cookie_dias != null ? String(row.cookie_dias) : '')
      setOpTrafico(row.trafico_calificable != null ? String(row.trafico_calificable) : '')
    } else {
      setOpComision(''); setOpCookie(''); setOpTrafico('')
    }
  }

  async function saveOperadorMeta() {
    if (!opEdit) return
    setOpSaving(true)
    setOpSaveMsg('')
    const res = await fetch('/api/admin/precios', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operador: opEdit,
        comision_usd: opComision ? Number(opComision) : undefined,
        cookie_dias: opCookie ? Number(opCookie) : undefined,
        trafico_calificable: opTrafico ? Number(opTrafico) : undefined,
      }),
    })
    setOpSaving(false)
    if (res.ok) { setOpSaveMsg('Guardado en todas las filas del operador'); loadPrecios() }
    else setOpSaveMsg('Error al guardar')
  }

  useEffect(() => { if (tab === 'precios') loadPrecios() }, [tab])
  useEffect(() => { if (tab === 'ingresos') loadIngresos() }, [tab])

  // ═══════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="bg-white rounded-[22px] p-8 w-full max-w-[400px] shadow-xl">
          <div className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase mb-6">
            <svg className="w-[26px] h-[26px]" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#00D957" />
              <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
            </svg>
            <span><span className="text-green">pre</span><span className="text-ink">envios</span></span>
            <span className="text-g400 text-sm font-normal ml-2">Admin</span>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-g200 rounded-[10px] px-4 py-3 mb-3 text-sm outline-none focus:border-blue" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="w-full border border-g200 rounded-[10px] px-4 py-3 mb-3 text-sm outline-none focus:border-blue" />
          {loginError && <p className="text-red text-xs mb-3">{loginError}</p>}
          <button onClick={login} className="w-full bg-blue text-white py-3 rounded-[10px] font-bold text-sm hover:bg-blue-dark transition-colors">Ingresar</button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════
  const staleCount = dashboard?.staleOperators?.length || 0

  return (
    <div className="min-h-screen bg-g50">
      {/* Header */}
      <div className="bg-ink text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-lg">PreEnvios Admin</span>
          {dashboard && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${dashboard.healthy ? 'bg-green text-white' : 'bg-red text-white'}`}>
              {dashboard.healthy ? 'HEALTHY' : `${staleCount} STALE`}
            </span>
          )}
        </div>
        <button onClick={logout} className="text-sm text-g400 hover:text-white">Cerrar sesión</button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-g200 px-6 flex gap-1">
        {(['dashboard', 'precios', 'ingresos'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'dashboard') loadDashboard() }}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${tab === t ? 'border-blue text-blue' : 'border-transparent text-g500 hover:text-ink'}`}>
            {t === 'dashboard' ? '📊 Dashboard' : t === 'precios' ? '💱 Tasas' : '💰 Ingresos'}
          </button>
        ))}
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-8">
        {/* ═══ DASHBOARD TAB ═══ */}
        {tab === 'dashboard' && (
          <div>
            <div className="flex gap-3 mb-6">
              <button onClick={runScrapers} className="bg-blue text-white px-4 py-2 rounded-[10px] text-sm font-bold hover:bg-blue-dark">Ejecutar scrapers ahora</button>
              <button onClick={loadDashboard} className="bg-g200 text-ink px-4 py-2 rounded-[10px] text-sm font-bold hover:bg-g300">Refrescar</button>
            </div>

            {/* Scraper monitor */}
            <h3 className="font-heading font-extrabold text-lg mb-4">Monitor de scrapers</h3>
            {dashboard ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {Object.entries(dashboard.operators).map(([op, info]) => (
                  <div key={op} className={`bg-white rounded-[14px] p-4 border-[1.5px] ${info.stale ? 'border-red' : 'border-green'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${info.stale ? 'bg-red' : 'bg-green'}`} />
                      <span className="font-bold text-sm capitalize">{op}</span>
                    </div>
                    <div className="text-xs text-g500">{info.count} precios</div>
                    <div className="text-xs text-g500">Último: {new Date(info.lastUpdate).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-g500 mb-8">Cargando...</p>
            )}

            {/* Manual alert */}
            <h3 className="font-heading font-extrabold text-lg mb-4">Disparar alerta manual</h3>
            <div className="bg-white rounded-[14px] p-4 border border-g200 flex flex-col sm:flex-row gap-3 mb-8">
              <select value={alertaCorredor} onChange={e => setAlertaCorredor(e.target.value)} className="border border-g200 rounded-[10px] px-3 py-2 text-sm flex-1">
                <option value="">Seleccionar corredor</option>
                <option value="honduras">Honduras</option>
                <option value="dominican_republic">Rep. Dominicana</option>
                <option value="guatemala">Guatemala</option>
                <option value="el_salvador">El Salvador</option>
                <option value="colombia">Colombia</option>
                <option value="mexico">México</option>
                <option value="nicaragua">Nicaragua</option>
                <option value="haiti">Haití</option>
              </select>
              <input value={alertaMsg} onChange={e => setAlertaMsg(e.target.value)} placeholder="Mensaje (opcional)" className="border border-g200 rounded-[10px] px-3 py-2 text-sm flex-1" />
              <button onClick={sendAlerta} className="bg-orange text-white px-4 py-2 rounded-[10px] text-sm font-bold hover:bg-[#E86C06]">Enviar alerta</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-[14px] p-5 border border-g200 text-center">
                <div className="font-heading text-3xl font-black text-blue">{dashboard?.totalPrices || 0}</div>
                <div className="text-xs text-g500 mt-1">Precios activos</div>
              </div>
              <div className="bg-white rounded-[14px] p-5 border border-g200 text-center">
                <div className="font-heading text-3xl font-black text-green">{Object.keys(dashboard?.operators || {}).length}</div>
                <div className="text-xs text-g500 mt-1">Operadores</div>
              </div>
              <div className="bg-white rounded-[14px] p-5 border border-g200 text-center">
                <div className="font-heading text-3xl font-black text-ink">8</div>
                <div className="text-xs text-g500 mt-1">Corredores</div>
              </div>
              <div className="bg-white rounded-[14px] p-5 border border-g200 text-center">
                <div className={`font-heading text-3xl font-black ${staleCount > 0 ? 'text-red' : 'text-green'}`}>{staleCount}</div>
                <div className="text-xs text-g500 mt-1">Stale</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRECIOS TAB ═══ */}
        {tab === 'precios' && (
          <div>
            {/* Operator metadata editor (valor_afiliado) */}
            <h3 className="font-heading font-extrabold text-lg mb-4">Configuración de afiliado por operador</h3>
            <p className="text-xs text-g500 mb-3">comisión USD × (cookie_dias/30 cap 3x) × trafico_calificable — usado por el algoritmo de ranking</p>
            <div className="bg-white rounded-[14px] p-4 border border-g200 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-g500 uppercase mb-1">Operador</label>
                  <select value={opEdit} onChange={e => selectOperador(e.target.value)} className="w-full border border-g200 rounded-[10px] px-3 py-2 text-sm">
                    <option value="">Seleccionar</option>
                    {['remitly','wise','xoom','ria','worldremit','westernunion','moneygram'].map(o =>
                      <option key={o} value={o}>{o}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-g500 uppercase mb-1">Comisión USD</label>
                  <input type="number" step="0.5" value={opComision} onChange={e => setOpComision(e.target.value)} className="w-full border border-g200 rounded-[10px] px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-g500 uppercase mb-1">Cookie días</label>
                  <input type="number" value={opCookie} onChange={e => setOpCookie(e.target.value)} placeholder="9999 = lifetime" className="w-full border border-g200 rounded-[10px] px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-g500 uppercase mb-1">Tráfico calificable</label>
                  <input type="number" step="0.1" min="0" max="1" value={opTrafico} onChange={e => setOpTrafico(e.target.value)} placeholder="0.0 - 1.0" className="w-full border border-g200 rounded-[10px] px-3 py-2 text-sm" />
                </div>
                <button
                  onClick={saveOperadorMeta}
                  disabled={!opEdit || opSaving}
                  className="bg-blue text-white px-4 py-2 rounded-[10px] text-sm font-bold hover:bg-blue-dark disabled:opacity-60"
                >
                  {opSaving ? 'Guardando…' : 'Aplicar a todos los corredores'}
                </button>
              </div>
              {opSaveMsg && <p className="text-xs mt-2 text-green-dark font-bold">{opSaveMsg}</p>}
            </div>

            <h3 className="font-heading font-extrabold text-lg mb-4">Actualización manual de tasas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-[14px] border border-g200 overflow-hidden">
                <thead className="bg-g50">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-g600">Operador</th>
                    <th className="text-left px-4 py-3 font-bold text-g600">Corredor</th>
                    <th className="text-left px-4 py-3 font-bold text-g600">Tasa</th>
                    <th className="text-left px-4 py-3 font-bold text-g600">Fee</th>
                    <th className="text-left px-4 py-3 font-bold text-g600">Actualizado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {precios.map(p => (
                    <tr key={p.id} className="border-t border-g100 hover:bg-g50">
                      <td className="px-4 py-3 font-bold">{p.nombre_operador}</td>
                      <td className="px-4 py-3">{p.corredor}</td>
                      <td className="px-4 py-3">
                        {editingId === p.id
                          ? <input type="number" step="0.01" value={editTasa} onChange={e => setEditTasa(e.target.value)} className="border border-blue rounded px-2 py-1 w-24 text-sm" />
                          : <span className="text-blue font-bold">{p.tasa}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === p.id
                          ? <input type="number" step="0.01" value={editFee} onChange={e => setEditFee(e.target.value)} className="border border-blue rounded px-2 py-1 w-20 text-sm" />
                          : p.fee === 0 ? <span className="text-green font-bold">Gratis</span> : `$${p.fee}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-g500">{new Date(p.actualizado_en).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => savePrice(p)} disabled={saving} className="bg-green text-white px-3 py-1 rounded text-xs font-bold">Guardar</button>
                            <button onClick={() => setEditingId(null)} className="bg-g200 text-g600 px-3 py-1 rounded text-xs font-bold">Cancelar</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(p.id); setEditTasa(String(p.tasa)); setEditFee(String(p.fee)) }} className="bg-blue text-white px-3 py-1 rounded text-xs font-bold">Editar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ INGRESOS TAB ═══ */}
        {tab === 'ingresos' && (
          <div>
            <h3 className="font-heading font-extrabold text-lg mb-4">Reporte de ingresos — {ingresos?.periodo}</h3>
            {ingresos ? (
              <>
                <div className="bg-white rounded-[14px] p-6 border border-g200 mb-4">
                  <div className="font-heading text-4xl font-black text-green mb-1">${ingresos.total_mes}</div>
                  <div className="text-sm text-g500">Total del mes</div>
                </div>
                <h4 className="font-bold text-sm text-g600 mb-3">Comisiones por afiliado</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {Object.entries(ingresos.afiliados).map(([red, data]) => (
                    <div key={red} className="bg-white rounded-[14px] p-4 border border-g200">
                      <div className="font-bold text-sm capitalize mb-2">{red}</div>
                      <div className="text-xs text-g500">{data.operador || data.operadores?.join(', ')}</div>
                      <div className="text-xs text-g500">Clics: {data.clics} · Conv: {data.conversiones}</div>
                      <div className="text-sm font-bold text-green mt-1">${data.comision}</div>
                      <div className="text-[10px] text-orange mt-1">{data.status}</div>
                    </div>
                  ))}
                </div>
                <h4 className="font-bold text-sm text-g600 mb-3">Suscripciones</h4>
                <div className="bg-white rounded-[14px] p-4 border border-g200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><div className="font-heading text-2xl font-black">{ingresos.suscripciones.free}</div><div className="text-xs text-g500">Free</div></div>
                    <div><div className="font-heading text-2xl font-black">{ingresos.suscripciones.premium}</div><div className="text-xs text-g500">Premium</div></div>
                    <div><div className="font-heading text-2xl font-black text-green">${ingresos.suscripciones.mrr}</div><div className="text-xs text-g500">MRR</div></div>
                  </div>
                </div>
              </>
            ) : <p className="text-g500">Cargando...</p>}
          </div>
        )}
      </div>
    </div>
  )
}
