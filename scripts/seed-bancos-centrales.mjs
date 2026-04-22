/**
 * Seed — tasas de bancos centrales
 * Ejecutar: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-bancos-centrales.mjs
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

const tasas = [
  { id: 'honduras',           codigo_pais: 'hn', moneda: 'HNL', nombre_banco: 'Banco Central de Honduras',              nombre_banco_en: 'Central Bank of Honduras',              siglas: 'BCH',  tasa: 26.58, nota: '', nota_en: '' },
  { id: 'dominican_republic', codigo_pais: 'do', moneda: 'DOP', nombre_banco: 'Banco Central de la Rep. Dominicana',    nombre_banco_en: 'Central Bank of the Dominican Republic', siglas: 'BCRD', tasa: 60.41, nota: '', nota_en: '' },
  { id: 'guatemala',          codigo_pais: 'gt', moneda: 'GTQ', nombre_banco: 'Banco de Guatemala',                     nombre_banco_en: 'Bank of Guatemala',                      siglas: 'BG',   tasa: 7.64,  nota: '', nota_en: '' },
  { id: 'el_salvador',        codigo_pais: 'sv', moneda: 'USD', nombre_banco: 'Banco Central de Reserva',               nombre_banco_en: 'Central Reserve Bank',                   siglas: 'BCR',  tasa: 1.00,  nota: 'USD oficial', nota_en: 'Official USD' },
  { id: 'colombia',           codigo_pais: 'co', moneda: 'COP', nombre_banco: 'Banco de la República',                  nombre_banco_en: 'Bank of the Republic',                   siglas: 'BR',   tasa: 4150.00, nota: '', nota_en: '' },
  { id: 'mexico',             codigo_pais: 'mx', moneda: 'MXN', nombre_banco: 'Banco de México',                        nombre_banco_en: 'Bank of Mexico',                         siglas: 'BM',   tasa: 17.15, nota: '', nota_en: '' },
]

async function seed() {
  console.log('🏦 Insertando tasas de bancos centrales...')
  const { error } = await supabase.from('tasas_bancos_centrales').upsert(tasas, { onConflict: 'id' })
  if (error) { console.error('❌ Error:', error.message); process.exit(1) }
  console.log(`   ✅ ${tasas.length} bancos centrales`)
  console.log('\n🎉 Seed completado.')
}

seed()
