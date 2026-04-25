/**
 * Cross-linking data for SEO — maps blog/wiki slugs to related corredores
 * y operadores. Source of truth de los slugs: lib/corredores.ts
 * (WIKI_ARTICLES, BLOG_ARTICLES). Si un slug se renombra ahí, hay que
 * sincronizar acá. Última sincronización: 2026-04-25 (paridad 100%).
 */

import { PAISES_MVP } from '@/lib/paises'

// ─────────────────────────────────────────────────────────────────────
// BLOG LINKS — 21 entries, una por cada artículo de BLOG_ARTICLES
// ─────────────────────────────────────────────────────────────────────
export const BLOG_LINKS: Record<string, { corredores: string[]; operadores: string[] }> = {
  // Guías por país
  'mejor-remesadora-republica-dominicana-2026':         { corredores: ['dominican_republic'], operadores: ['remitly', 'wise', 'western-union'] },
  'enviar-dinero-colombia-opciones-costos':             { corredores: ['colombia'],           operadores: ['wise', 'remitly', 'xoom'] },
  'remesadora-mas-barata-mexico':                       { corredores: ['mexico'],             operadores: ['remitly', 'wise', 'xoom'] },
  'enviar-dinero-latinoamerica-sin-comisiones-altas':   { corredores: [],                     operadores: ['wise', 'remitly', 'ria'] },
  'cuanto-dinero-se-pierde-comisiones-remesas':         { corredores: [],                     operadores: ['wise'] },
  'cuanto-cobra-western-union-honduras':                { corredores: ['honduras'],           operadores: ['western-union', 'remitly', 'wise'] },
  'forma-mas-barata-enviar-guatemala':                  { corredores: ['guatemala'],          operadores: ['wise', 'remitly', 'ria'] },
  // Comparativas
  'remitly-vs-western-union-dominicana':                { corredores: ['dominican_republic'], operadores: ['remitly', 'western-union', 'wise'] },
  'remitly-vs-ria-money-transfer-cual-conviene':        { corredores: [],                     operadores: ['remitly', 'ria'] },
  'western-union-vs-moneygram-comparacion-completa':    { corredores: [],                     operadores: ['western-union', 'moneygram'] },
  'wise-vs-remitly-cual-conviene':                      { corredores: [],                     operadores: ['wise', 'remitly'] },
  'ria-money-transfer-vs-moneygram-rapido-barato':      { corredores: [],                     operadores: ['ria', 'moneygram'] },
  'xoom-vs-remitly-cual-conviene-mas':                  { corredores: [],                     operadores: ['xoom', 'remitly'] },
  // Tendencias
  'enviar-dinero-whatsapp-como-funciona':               { corredores: [],                     operadores: ['remitly'] },
  'nuevas-remesadoras-digitales-latam-2026':            { corredores: [],                     operadores: ['wise', 'remitly', 'worldremit'] },
  'alternativas-western-union-mas-baratas-2026':        { corredores: [],                     operadores: ['wise', 'remitly', 'ria', 'xoom'] },
  'como-saber-cuanto-dinero-recibe-realmente-persona':  { corredores: [],                     operadores: ['wise'] },
  // Guías prácticas
  'enviar-dinero-republica-dominicana-whatsapp-guia':   { corredores: ['dominican_republic'], operadores: ['remitly'] },
  'mejores-apps-enviar-dinero-latinoamerica':           { corredores: [],                     operadores: ['remitly', 'wise', 'xoom', 'worldremit'] },
  'como-enviar-dinero-rapido-emergencias':              { corredores: [],                     operadores: ['remitly', 'xoom', 'western-union'] },
  'que-remesadora-usar-segun-monto-envias':             { corredores: [],                     operadores: ['wise', 'remitly', 'xoom'] },
}

// ─────────────────────────────────────────────────────────────────────
// WIKI LINKS — 14 entries, una por cada artículo de WIKI_ARTICLES
// ─────────────────────────────────────────────────────────────────────
export const WIKI_LINKS: Record<string, { corredores: string[]; operadores: string[] }> = {
  // Fundamentos
  'que-es-tasa-cambio-mid-market-por-que-importa':                { corredores: [], operadores: ['wise'] },
  'diferencia-tasa-fee-cual-cuesta-mas-realmente':                { corredores: [], operadores: ['wise', 'remitly'] },
  'como-elegir-mejor-remesadora-segun-monto':                     { corredores: [], operadores: ['wise', 'remitly', 'xoom'] },
  'documentos-necesarios-enviar-dinero-eeuu':                     { corredores: [], operadores: [] },
  // Métodos
  'cash-pickup-vs-deposito-bancario':                             { corredores: [], operadores: ['western-union', 'moneygram', 'ria'] },
  // Educativos
  'que-es-remesadora-como-gana-dinero':                           { corredores: [], operadores: ['wise', 'remitly'] },
  'tipo-cambio-afecta-mas-que-comision':                          { corredores: [], operadores: ['wise'] },
  'cuanto-tarda-envio-internacional-realmente':                   { corredores: [], operadores: ['wise', 'remitly', 'xoom'] },
  'que-metodo-es-mejor-efectivo-banco-billetera-digital':         { corredores: [], operadores: ['western-union', 'remitly'] },
  // Por corredor
  'como-recibir-dinero-republica-dominicana-paso-paso':           { corredores: ['dominican_republic'], operadores: [] },
  'bancos-honduras-convenio-remesadoras':                         { corredores: ['honduras'],           operadores: [] },
  'cuanto-tarda-transferencia-guatemala-realmente':               { corredores: ['guatemala'],          operadores: [] },
  // Educación financiera
  'impuestos-remesas-eeuu-pais-receptor':                         { corredores: [], operadores: [] },
  'alertas-tipo-cambio-para-que-sirven-como-usarlas':             { corredores: [], operadores: [] },
}

// ─────────────────────────────────────────────────────────────────────
// CORRIDOR → BLOGS (slugs nuevos)
// ─────────────────────────────────────────────────────────────────────
export const CORRIDOR_BLOGS: Record<string, string[]> = {
  honduras:           ['cuanto-cobra-western-union-honduras'],
  dominican_republic: ['mejor-remesadora-republica-dominicana-2026', 'remitly-vs-western-union-dominicana', 'enviar-dinero-republica-dominicana-whatsapp-guia'],
  guatemala:          ['forma-mas-barata-enviar-guatemala'],
  el_salvador:        [],
  colombia:           ['enviar-dinero-colombia-opciones-costos'],
  mexico:             ['remesadora-mas-barata-mexico'],
}

// ─────────────────────────────────────────────────────────────────────
// CORRIDOR → WIKIS (slugs nuevos)
// ─────────────────────────────────────────────────────────────────────
export const CORRIDOR_WIKIS: Record<string, string[]> = {
  honduras:           ['bancos-honduras-convenio-remesadoras', 'cash-pickup-vs-deposito-bancario', 'documentos-necesarios-enviar-dinero-eeuu'],
  dominican_republic: ['como-recibir-dinero-republica-dominicana-paso-paso', 'que-es-tasa-cambio-mid-market-por-que-importa', 'diferencia-tasa-fee-cual-cuesta-mas-realmente'],
  guatemala:          ['cuanto-tarda-transferencia-guatemala-realmente', 'como-elegir-mejor-remesadora-segun-monto', 'cash-pickup-vs-deposito-bancario'],
  el_salvador:        ['documentos-necesarios-enviar-dinero-eeuu', 'como-elegir-mejor-remesadora-segun-monto', 'diferencia-tasa-fee-cual-cuesta-mas-realmente'],
}

/** Top operators per corridor (most commonly used) */
export const CORRIDOR_TOP_OPERATORS: Record<string, string[]> = {
  honduras:           ['remitly', 'western-union', 'ria', 'xoom'],
  dominican_republic: ['remitly', 'wise', 'western-union', 'xoom'],
  guatemala:          ['wise', 'remitly', 'ria', 'western-union'],
  el_salvador:        ['remitly', 'wise', 'xoom', 'western-union'],
}

/** Operator competitors for vs-style links */
export const OPERATOR_COMPETITORS: Record<string, string[]> = {
  remitly:        ['wise', 'western-union', 'xoom'],
  wise:           ['remitly', 'ria', 'xoom'],
  xoom:           ['remitly', 'wise', 'ria'],
  ria:            ['wise', 'remitly', 'moneygram'],
  worldremit:     ['remitly', 'wise', 'western-union'],
  'western-union': ['remitly', 'moneygram', 'ria'],
  moneygram:      ['western-union', 'ria', 'remitly'],
}

/** Get the pais slug for a given locale and corridor ID */
export function getPaisSlug(corredorId: string, locale: string): string | null {
  const pais = PAISES_MVP.find(p => p.corredorId === corredorId)
  if (!pais) return null
  return locale === 'en' ? pais.slugEn : pais.slugEs
}

/** Get tasa page slug for a corridor ID */
export function getTasaSlug(corredorId: string): string | null {
  const map: Record<string, string> = {
    honduras: 'usd-hnl',
    dominican_republic: 'usd-dop',
    guatemala: 'usd-gtq',
    el_salvador: 'usd-svc',
    colombia: 'usd-cop',
    mexico: 'usd-mxn',
  }
  return map[corredorId] || null
}
