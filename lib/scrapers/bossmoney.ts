/**
 * Scraper Boss Money — operador pequeño, negociación directa futura
 * Placeholder: se activa cuando Boss Money esté incluido en el comparador
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

export async function scrapeBossMoney(): Promise<{ saved: number; errors: string[] }> {
  // Boss Money no está activo en el MVP — placeholder para Fase 4
  return { saved: 0, errors: ['Boss Money scraper not active yet — placeholder for Phase 4'] }
}
