/**
 * Cross-linking data for SEO — maps corridors, operators, blog, and wiki
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
}

/** Wiki slugs mapped to related corridors */
export const WIKI_LINKS: Record<string, { corredores: string[]; operadores: string[] }> = {
  'tasa-cambio-mid-market': { corredores: [], operadores: ['wise'] },
  'diferencia-tasa-fee': { corredores: [], operadores: ['wise', 'remitly'] },
  // Slug renombrado 2026-04-25 (era 'elegir-remesadora-segun-monto') —
  // alineado al .md publicado en content/wiki/.
  'como-elegir-mejor-remesadora-segun-monto': { corredores: [], operadores: ['wise', 'remitly', 'xoom'] },
  // Slug renombrado 2026-04-25 (era 'cash-pickup-vs-banco') —
  // alineado al .md publicado en content/wiki/.
  'cash-pickup-vs-deposito-bancario': { corredores: [], operadores: ['western-union', 'moneygram', 'ria'] },
  'documentos-enviar-dinero-usa': { corredores: [], operadores: [] },
  'recibir-dinero-republica-dominicana': { corredores: ['dominican_republic'], operadores: [] },
  'bancos-honduras-remesadoras': { corredores: ['honduras'], operadores: [] },
  'tiempo-transferencia-guatemala': { corredores: ['guatemala'], operadores: [] },
  'impuestos-remesas': { corredores: [], operadores: [] },
  'alertas-tipo-cambio': { corredores: [], operadores: [] },
}

/** Map corridor IDs to related blog slugs */
export const CORRIDOR_BLOGS: Record<string, string[]> = {
  honduras: ['cuanto-cobra-western-union-honduras'],
  dominican_republic: ['remitly-vs-western-union-dominicana'],
  guatemala: ['forma-mas-barata-enviar-guatemala'],
  el_salvador: [],
}

/** Map corridor IDs to related wiki slugs */
export const CORRIDOR_WIKIS: Record<string, string[]> = {
  honduras: ['bancos-honduras-remesadoras', 'cash-pickup-vs-deposito-bancario', 'documentos-enviar-dinero-usa'],
  dominican_republic: ['recibir-dinero-republica-dominicana', 'tasa-cambio-mid-market', 'diferencia-tasa-fee'],
  guatemala: ['tiempo-transferencia-guatemala', 'como-elegir-mejor-remesadora-segun-monto', 'cash-pickup-vs-deposito-bancario'],
  el_salvador: ['documentos-enviar-dinero-usa', 'como-elegir-mejor-remesadora-segun-monto', 'diferencia-tasa-fee'],
}

/** Top operators per corridor (most commonly used) */
export const CORRIDOR_TOP_OPERATORS: Record<string, string[]> = {
  honduras: ['remitly', 'western-union', 'ria', 'xoom'],
  dominican_republic: ['remitly', 'wise', 'western-union', 'xoom'],
  guatemala: ['wise', 'remitly', 'ria', 'western-union'],
  el_salvador: ['remitly', 'wise', 'xoom', 'western-union'],
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
