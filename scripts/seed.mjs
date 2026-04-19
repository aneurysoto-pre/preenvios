/**
 * Seed script — inserta los datos iniciales del MVP en Supabase
 * Ejecutar: node scripts/seed.mjs
 * Requiere: tablas creadas previamente (ver supabase/migrations/001_create_tables.sql)
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dlblmquoasgoxnzclgyb.supabase.co',
  // service role key para bypass de RLS en inserción
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno')
  console.error('   Ejecuta: SUPABASE_SERVICE_ROLE_KEY=tu_key node scripts/seed.mjs')
  process.exit(1)
}

// ═══════════════════════════════════════
// CORREDORES
// ═══════════════════════════════════════
const corredores = [
  { id: 'honduras',            nombre: 'Honduras',          nombre_en: 'Honduras',            moneda: 'HNL', simbolo: 'L',    bandera: '🇭🇳', codigo_pais: 'hn', tasa_banco_central: 26.58, prioridad: 1 },
  { id: 'dominican_republic',  nombre: 'Rep. Dominicana',   nombre_en: 'Dominican Republic',  moneda: 'DOP', simbolo: 'RD$',  bandera: '🇩🇴', codigo_pais: 'do', tasa_banco_central: 60.41, prioridad: 2 },
  { id: 'guatemala',           nombre: 'Guatemala',         nombre_en: 'Guatemala',           moneda: 'GTQ', simbolo: 'Q',    bandera: '🇬🇹', codigo_pais: 'gt', tasa_banco_central: 7.64,  prioridad: 3 },
  { id: 'el_salvador',         nombre: 'El Salvador',       nombre_en: 'El Salvador',         moneda: 'USD', simbolo: '$',    bandera: '🇸🇻', codigo_pais: 'sv', tasa_banco_central: 1.00,  prioridad: 4 },
]

// ═══════════════════════════════════════
// OPERADORES — metadata fija
// ═══════════════════════════════════════
const operadores = {
  remitly:      { nombre: 'Remitly',        rating: 4.8, reviews: 8421,  afiliado: true,  confiabilidad: 80, metodos_disponibles: 3 },
  wise:         { nombre: 'Wise',           rating: 4.9, reviews: 12043, afiliado: true,  confiabilidad: 95, metodos_disponibles: 2 },
  xoom:         { nombre: 'Xoom',           rating: 4.7, reviews: 6120,  afiliado: true,  confiabilidad: 90, metodos_disponibles: 3 },
  ria:          { nombre: 'Ria',            rating: 4.6, reviews: 5200,  afiliado: true,  confiabilidad: 85, metodos_disponibles: 4 },
  worldremit:   { nombre: 'WorldRemit',     rating: 4.6, reviews: 4800,  afiliado: true,  confiabilidad: 75, metodos_disponibles: 4 },
  // Western Union (CJ Affiliate) y MoneyGram (FlexOffers + CJ) pendientes de
  // aprobacion: boton activo con link directo a dominio publico (sin tracking ID).
  westernunion: { nombre: 'Western Union',  rating: 4.5, reviews: 15820, afiliado: true, confiabilidad: 95, metodos_disponibles: 3 },
  moneygram:    { nombre: 'MoneyGram',      rating: 4.4, reviews: 7541,  afiliado: true, confiabilidad: 85, metodos_disponibles: 3 },
}

// ═══════════════════════════════════════
// PRECIOS — migrados del index.html del MVP
// Método de entrega: bank (default)
// ═══════════════════════════════════════
const precios = [
  // HONDURAS
  { operador: 'remitly',      corredor: 'honduras',           tasa: 26.45, fee: 2.99, velocidad: 'Minutos',  link: 'https://www.remitly.com/us/en/honduras' },
  { operador: 'wise',         corredor: 'honduras',           tasa: 26.58, fee: 2.50, velocidad: 'Segundos', link: 'https://wise.com/us/send-money/send-money-to-honduras' },
  { operador: 'xoom',         corredor: 'honduras',           tasa: 26.30, fee: 4.99, velocidad: 'Minutos',  link: 'https://www.xoom.com/honduras/send-money' },
  { operador: 'ria',          corredor: 'honduras',           tasa: 26.25, fee: 0,    velocidad: 'Minutos',  link: 'https://www.riamoneytransfer.com/us/en/send-money-to/honduras' },
  { operador: 'worldremit',   corredor: 'honduras',           tasa: 26.20, fee: 1.99, velocidad: 'Minutos',  link: 'https://www.worldremit.com/en/send-money/united-states/honduras' },
  { operador: 'westernunion', corredor: 'honduras',           tasa: 26.10, fee: 0,    velocidad: 'Minutos',  link: 'https://www.westernunion.com' },
  { operador: 'moneygram',    corredor: 'honduras',           tasa: 25.95, fee: 1.99, velocidad: 'Horas',    link: 'https://www.moneygram.com' },
  // DOMINICAN REPUBLIC
  { operador: 'remitly',      corredor: 'dominican_republic', tasa: 59.64, fee: 0,    velocidad: 'Minutos',  link: 'https://www.remitly.com/us/en/dominican-republic' },
  { operador: 'wise',         corredor: 'dominican_republic', tasa: 58.02, fee: 4.50, velocidad: 'Segundos', link: 'https://wise.com/us/send-money/send-money-to-dominican-republic' },
  { operador: 'xoom',         corredor: 'dominican_republic', tasa: 58.70, fee: 4.99, velocidad: 'Minutos',  link: 'https://www.xoom.com/dominican-republic/send-money' },
  { operador: 'ria',          corredor: 'dominican_republic', tasa: 58.80, fee: 1.99, velocidad: 'Minutos',  link: 'https://www.riamoneytransfer.com/us/en/send-money-to/dominican-republic' },
  { operador: 'worldremit',   corredor: 'dominican_republic', tasa: 58.50, fee: 1.99, velocidad: 'Minutos',  link: 'https://www.worldremit.com/en/send-money/united-states/dominican-republic' },
  { operador: 'westernunion', corredor: 'dominican_republic', tasa: 59.20, fee: 0,    velocidad: 'Minutos',  link: 'https://www.westernunion.com' },
  { operador: 'moneygram',    corredor: 'dominican_republic', tasa: 58.50, fee: 1.99, velocidad: 'Horas',    link: 'https://www.moneygram.com' },
  // GUATEMALA
  { operador: 'remitly',      corredor: 'guatemala',          tasa: 7.77,  fee: 2.99, velocidad: 'Minutos',  link: 'https://www.remitly.com/us/en/guatemala' },
  { operador: 'wise',         corredor: 'guatemala',          tasa: 7.64,  fee: 2.50, velocidad: 'Segundos', link: 'https://wise.com/us/send-money/send-money-to-guatemala' },
  { operador: 'xoom',         corredor: 'guatemala',          tasa: 7.58,  fee: 4.99, velocidad: 'Minutos',  link: 'https://www.xoom.com/guatemala/send-money' },
  { operador: 'ria',          corredor: 'guatemala',          tasa: 7.56,  fee: 0,    velocidad: 'Minutos',  link: 'https://www.riamoneytransfer.com/us/en/send-money-to/guatemala' },
  { operador: 'worldremit',   corredor: 'guatemala',          tasa: 7.55,  fee: 1.99, velocidad: 'Minutos',  link: 'https://www.worldremit.com/en/send-money/united-states/guatemala' },
  { operador: 'westernunion', corredor: 'guatemala',          tasa: 7.52,  fee: 0,    velocidad: 'Minutos',  link: 'https://www.westernunion.com' },
  { operador: 'moneygram',    corredor: 'guatemala',          tasa: 7.48,  fee: 1.99, velocidad: 'Horas',    link: 'https://www.moneygram.com' },
  // EL SALVADOR (USD — tasa fija 1)
  { operador: 'remitly',      corredor: 'el_salvador',        tasa: 1,     fee: 0,    velocidad: 'Minutos',  link: 'https://www.remitly.com' },
  { operador: 'wise',         corredor: 'el_salvador',        tasa: 1,     fee: 2.50, velocidad: 'Segundos', link: 'https://wise.com/send' },
  { operador: 'xoom',         corredor: 'el_salvador',        tasa: 1,     fee: 4.99, velocidad: 'Minutos',  link: 'https://www.xoom.com' },
  { operador: 'ria',          corredor: 'el_salvador',        tasa: 1,     fee: 1.99, velocidad: 'Minutos',  link: 'https://www.riamoneytransfer.com' },
  { operador: 'worldremit',   corredor: 'el_salvador',        tasa: 1,     fee: 1.99, velocidad: 'Minutos',  link: 'https://www.worldremit.com' },
  { operador: 'westernunion', corredor: 'el_salvador',        tasa: 1,     fee: 5.00, velocidad: 'Minutos',  link: 'https://www.westernunion.com' },
  { operador: 'moneygram',    corredor: 'el_salvador',        tasa: 1,     fee: 1.99, velocidad: 'Horas',    link: 'https://www.moneygram.com' },
]

async function seed() {
  console.log('🌱 Insertando corredores...')
  const { error: e1 } = await supabase.from('corredores').upsert(corredores, { onConflict: 'id' })
  if (e1) { console.error('❌ Error corredores:', e1.message); process.exit(1) }
  console.log(`   ✅ ${corredores.length} corredores`)

  console.log('🌱 Insertando precios...')
  const rows = precios.map(p => ({
    ...p,
    metodo_entrega: 'bank',
    nombre_operador: operadores[p.operador].nombre,
    rating: operadores[p.operador].rating,
    reviews: operadores[p.operador].reviews,
    afiliado: operadores[p.operador].afiliado,
    confiabilidad: operadores[p.operador].confiabilidad,
    metodos_disponibles: operadores[p.operador].metodos_disponibles,
    actualizado_en: new Date().toISOString(),
  }))
  const { error: e2 } = await supabase.from('precios').upsert(rows, { onConflict: 'operador,corredor,metodo_entrega' })
  if (e2) { console.error('❌ Error precios:', e2.message); process.exit(1) }
  console.log(`   ✅ ${rows.length} precios (${rows.length / 7} corredores × 7 operadores)`)

  console.log('\n🎉 Seed completado. Datos disponibles en Supabase.')
}

seed()
