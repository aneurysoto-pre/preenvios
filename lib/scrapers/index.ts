/**
 * Orquestador de scrapers — ejecuta todos los scrapers en secuencia
 * Respeta rate limiting entre operadores
 */

import { scrapeWise } from './wise'
import { scrapeRia } from './ria'
import { scrapeRemitly } from './remitly'
import { scrapeXoom } from './xoom'
import { scrapeWorldRemit } from './worldremit'
import { scrapeWesternUnion } from './westernunion'
import { scrapeMoneyGram } from './moneygram'

export type ScraperResult = {
  operador: string
  saved: number
  errors: string[]
  duration_ms: number
}

export async function runAllScrapers(): Promise<ScraperResult[]> {
  const scrapers = [
    { name: 'wise', fn: scrapeWise },
    { name: 'ria', fn: scrapeRia },
    { name: 'xoom', fn: scrapeXoom },
    { name: 'worldremit', fn: scrapeWorldRemit },
    { name: 'remitly', fn: scrapeRemitly },
    { name: 'moneygram', fn: scrapeMoneyGram },
    { name: 'westernunion', fn: scrapeWesternUnion },
  ]

  const results: ScraperResult[] = []

  for (const scraper of scrapers) {
    const start = Date.now()
    try {
      const { saved, errors } = await scraper.fn()
      results.push({
        operador: scraper.name,
        saved,
        errors,
        duration_ms: Date.now() - start,
      })
    } catch (err) {
      results.push({
        operador: scraper.name,
        saved: 0,
        errors: [err instanceof Error ? err.message : String(err)],
        duration_ms: Date.now() - start,
      })
    }
  }

  return results
}
