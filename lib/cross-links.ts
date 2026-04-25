/**
 * Cross-linking data for SEO — maps corridors, operators, blog, and wiki.
 *
 * Paridad 100% entre los 6 corredores MVP (HN, DR, GT, SV, CO, MX):
 * cada corredor tiene 1 blog específico + 1 wiki cat:'corredor' + 2
 * wikis compartidos + lista de top operators. Los blogs y wikis son
 * placeholders "Coming soon" hoy — el contenido editorial real se
 * escribe gradualmente sin alterar este registry.
 */

import { PAISES_MVP } from '@/lib/paises'

/** Blog slugs mapped to related corridors and operators */
export const BLOG_LINKS: Record<string, { corredores: string[]; operadores: string[] }> = {
  'cuanto-cobra-western-union-honduras': {
    corredores: ['honduras'],
    operadores: ['western-union', 'remitly', 'wise'],
  },
  'remitly-vs-western-union-dominicana': {
    corredores: ['dominican_republic'],
    operadores: ['remitly', 'western-union', 'wise'],
  },
  'forma-mas-barata-enviar-guatemala': {
    corredores: ['guatemala'],
    operadores: ['wise', 'remitly', 'ria'],
  },
  'comision-cero-el-salvador-realmente-gratis': {
    corredores: ['el_salvador'],
    operadores: ['remitly', 'wise', 'ria'],
  },
  'wise-vs-remitly-colombia-mejor-tasa': {
    corredores: ['colombia'],
    operadores: ['wise', 'remitly', 'xoom'],
  },
  'mejor-remesadora-mexico-2026': {
    corredores: ['mexico'],
    operadores: ['remitly', 'wise', 'western-union'],
  },
}

/** Wiki slugs mapped to related corridors */
export const WIKI_LINKS: Record<string, { corredores: string[]; operadores: string[] }> = {
  // Fundamentos (compartidos)
  'tasa-cambio-mid-market': { corredores: [], operadores: ['wise'] },
  'diferencia-tasa-fee': { corredores: [], operadores: ['wise', 'remitly'] },
  'elegir-remesadora-segun-monto': { corredores: [], operadores: [] },
  'cash-pickup-vs-banco': { corredores: [], operadores: ['western-union', 'moneygram', 'ria'] },
  'documentos-enviar-dinero-usa': { corredores: [], operadores: [] },
  // Por corredor (1 wiki dedicado por corredor MVP)
  'recibir-dinero-republica-dominicana': { corredores: ['dominican_republic'], operadores: [] },
  'bancos-honduras-remesadoras': { corredores: ['honduras'], operadores: [] },
  'tiempo-transferencia-guatemala': { corredores: ['guatemala'], operadores: [] },
  'tigo-money-chivowallet-recibir-remesas-salvador': { corredores: ['el_salvador'], operadores: [] },
  'nequi-bre-b-recibir-remesas-colombia': { corredores: ['colombia'], operadores: [] },
  'clabe-interbancaria-mexico-remesas': { corredores: ['mexico'], operadores: [] },
  // Educación (compartidos)
  'impuestos-remesas': { corredores: [], operadores: [] },
  'alertas-tipo-cambio': { corredores: [], operadores: [] },
}

/** Map corridor IDs to related blog slugs — 1 blog dedicado por corredor */
export const CORRIDOR_BLOGS: Record<string, string[]> = {
  honduras: ['cuanto-cobra-western-union-honduras'],
  dominican_republic: ['remitly-vs-western-union-dominicana'],
  guatemala: ['forma-mas-barata-enviar-guatemala'],
  el_salvador: ['comision-cero-el-salvador-realmente-gratis'],
  colombia: ['wise-vs-remitly-colombia-mejor-tasa'],
  mexico: ['mejor-remesadora-mexico-2026'],
}

/** Map corridor IDs to related wiki slugs — 1 dedicado + 2 compartidos */
export const CORRIDOR_WIKIS: Record<string, string[]> = {
  honduras: ['bancos-honduras-remesadoras', 'cash-pickup-vs-banco', 'documentos-enviar-dinero-usa'],
  dominican_republic: ['recibir-dinero-republica-dominicana', 'tasa-cambio-mid-market', 'diferencia-tasa-fee'],
  guatemala: ['tiempo-transferencia-guatemala', 'elegir-remesadora-segun-monto', 'cash-pickup-vs-banco'],
  el_salvador: ['tigo-money-chivowallet-recibir-remesas-salvador', 'documentos-enviar-dinero-usa', 'elegir-remesadora-segun-monto'],
  colombia: ['nequi-bre-b-recibir-remesas-colombia', 'tasa-cambio-mid-market', 'cash-pickup-vs-banco'],
  mexico: ['clabe-interbancaria-mexico-remesas', 'diferencia-tasa-fee', 'impuestos-remesas'],
}

/** Top operators per corridor (most commonly used) */
export const CORRIDOR_TOP_OPERATORS: Record<string, string[]> = {
  honduras: ['remitly', 'western-union', 'ria', 'xoom'],
  dominican_republic: ['remitly', 'wise', 'western-union', 'xoom'],
  guatemala: ['wise', 'remitly', 'ria', 'western-union'],
  el_salvador: ['remitly', 'wise', 'xoom', 'western-union'],
  colombia: ['wise', 'remitly', 'xoom', 'ria'],
  mexico: ['remitly', 'wise', 'western-union', 'xoom'],
}

/** Operator competitors for vs-style links */
export const OPERATOR_COMPETITORS: Record<string, string[]> = {
  remitly: ['wise', 'western-union', 'xoom'],
  wise: ['remitly', 'ria', 'xoom'],
  xoom: ['remitly', 'wise', 'ria'],
  ria: ['wise', 'remitly', 'moneygram'],
  worldremit: ['remitly', 'wise', 'western-union'],
  'western-union': ['remitly', 'moneygram', 'ria'],
  moneygram: ['western-union', 'ria', 'remitly'],
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
