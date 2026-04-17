/**
 * Seed script — agrega 4 corredores nuevos (Colombia, México, Nicaragua, Haití)
 * Ejecutar: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-new-corridors.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dlblmquoasgoxnzclgyb.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const corredores = [
  { id: 'colombia',   nombre: 'Colombia',   nombre_en: 'Colombia',   moneda: 'COP', simbolo: '$',  bandera: '🇨🇴', codigo_pais: 'co', tasa_banco_central: 4150.00, prioridad: 5 },
  { id: 'mexico',     nombre: 'México',     nombre_en: 'Mexico',     moneda: 'MXN', simbolo: '$',  bandera: '🇲🇽', codigo_pais: 'mx', tasa_banco_central: 17.15,   prioridad: 6 },
  { id: 'nicaragua',  nombre: 'Nicaragua',  nombre_en: 'Nicaragua',  moneda: 'NIO', simbolo: 'C$', bandera: '🇳🇮', codigo_pais: 'ni', tasa_banco_central: 36.62,   prioridad: 7 },
  { id: 'haiti',      nombre: 'Haití',      nombre_en: 'Haiti',      moneda: 'HTG', simbolo: 'G',  bandera: '🇭🇹', codigo_pais: 'ht', tasa_banco_central: 131.50,  prioridad: 8 },
]

const operadores = {
  remitly:      { nombre: 'Remitly',       rating: 4.8, reviews: 8421,  afiliado: true,  confiabilidad: 80, metodos: 3 },
  wise:         { nombre: 'Wise',          rating: 4.9, reviews: 12043, afiliado: true,  confiabilidad: 95, metodos: 2 },
  xoom:         { nombre: 'Xoom',          rating: 4.7, reviews: 6120,  afiliado: true,  confiabilidad: 90, metodos: 3 },
  ria:          { nombre: 'Ria',           rating: 4.6, reviews: 5200,  afiliado: true,  confiabilidad: 85, metodos: 4 },
  worldremit:   { nombre: 'WorldRemit',    rating: 4.6, reviews: 4800,  afiliado: true,  confiabilidad: 75, metodos: 4 },
  westernunion: { nombre: 'Western Union', rating: 4.5, reviews: 15820, afiliado: false, confiabilidad: 95, metodos: 3 },
  moneygram:    { nombre: 'MoneyGram',     rating: 4.4, reviews: 7541,  afiliado: false, confiabilidad: 85, metodos: 3 },
}

// Tasas estimadas iniciales (se reemplazan con scrapers)
const tasasEstimadas = {
  colombia:  { remitly: 4180, wise: 4150, xoom: 4120, ria: 4130, worldremit: 4100, westernunion: 4090, moneygram: 4050 },
  mexico:    { remitly: 17.20, wise: 17.15, xoom: 17.00, ria: 17.05, worldremit: 16.95, westernunion: 16.90, moneygram: 16.80 },
  nicaragua: { remitly: 36.70, wise: 36.62, xoom: 36.40, ria: 36.35, worldremit: 36.30, westernunion: 36.20, moneygram: 36.00 },
  haiti:     { remitly: 132.50, wise: 131.50, xoom: 130.00, ria: 130.50, worldremit: 129.00, westernunion: 128.00, moneygram: 127.00 },
}

const fees = { remitly: 2.99, wise: 2.50, xoom: 4.99, ria: 0, worldremit: 1.99, westernunion: 0, moneygram: 1.99 }
const velocidades = { remitly: 'Minutos', wise: 'Segundos', xoom: 'Minutos', ria: 'Minutos', worldremit: 'Minutos', westernunion: 'Minutos', moneygram: 'Horas' }

const links = {
  colombia:  { remitly: 'https://www.remitly.com/us/en/colombia', wise: 'https://wise.com/us/send-money/send-money-to-colombia', xoom: 'https://www.xoom.com/colombia/send-money', ria: 'https://www.riamoneytransfer.com/us/en/send-money-to/colombia', worldremit: 'https://www.worldremit.com/en/send-money/united-states/colombia' },
  mexico:    { remitly: 'https://www.remitly.com/us/en/mexico', wise: 'https://wise.com/us/send-money/send-money-to-mexico', xoom: 'https://www.xoom.com/mexico/send-money', ria: 'https://www.riamoneytransfer.com/us/en/send-money-to/mexico', worldremit: 'https://www.worldremit.com/en/send-money/united-states/mexico' },
  nicaragua: { remitly: 'https://www.remitly.com/us/en/nicaragua', wise: 'https://wise.com/us/send-money/send-money-to-nicaragua', xoom: 'https://www.xoom.com/nicaragua/send-money', ria: 'https://www.riamoneytransfer.com/us/en/send-money-to/nicaragua', worldremit: 'https://www.worldremit.com/en/send-money/united-states/nicaragua' },
  haiti:     { remitly: 'https://www.remitly.com/us/en/haiti', wise: 'https://wise.com/us/send-money/send-money-to-haiti', xoom: 'https://www.xoom.com/haiti/send-money', ria: 'https://www.riamoneytransfer.com/us/en/send-money-to/haiti', worldremit: 'https://www.worldremit.com/en/send-money/united-states/haiti' },
}

async function seed() {
  console.log('🌱 Insertando 4 corredores nuevos...')
  const { error: e1 } = await supabase.from('corredores').upsert(corredores, { onConflict: 'id' })
  if (e1) { console.error('❌ Error corredores:', e1.message); process.exit(1) }
  console.log(`   ✅ ${corredores.length} corredores`)

  console.log('🌱 Insertando precios...')
  const rows = []
  for (const c of corredores) {
    for (const [opKey, op] of Object.entries(operadores)) {
      rows.push({
        operador: opKey,
        corredor: c.id,
        metodo_entrega: 'bank',
        tasa: tasasEstimadas[c.id][opKey],
        fee: fees[opKey],
        velocidad: velocidades[opKey],
        nombre_operador: op.nombre,
        rating: op.rating,
        reviews: op.reviews,
        afiliado: op.afiliado,
        link: links[c.id]?.[opKey] || '',
        confiabilidad: op.confiabilidad,
        metodos_disponibles: op.metodos,
        actualizado_en: new Date().toISOString(),
      })
    }
  }

  const { error: e2 } = await supabase.from('precios').upsert(rows, { onConflict: 'operador,corredor,metodo_entrega' })
  if (e2) { console.error('❌ Error precios:', e2.message); process.exit(1) }
  console.log(`   ✅ ${rows.length} precios (${corredores.length} corredores × 7 operadores)`)

  console.log('\n🎉 Seed completado. 4 nuevos corredores disponibles.')
}

seed()
