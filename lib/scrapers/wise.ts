/**
 * Scraper Wise — usa la API semi-pública de comparación de Wise
 * Wise expone un endpoint JSON público para tasas de cambio
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', link: 'https://wise.com/us/send-money/send-money-to-honduras' },
  { id: 'dominican_republic', moneda: 'DOP', link: 'https://wise.com/us/send-money/send-money-to-dominican-republic' },
  { id: 'guatemala',          moneda: 'GTQ', link: 'https://wise.com/us/send-money/send-money-to-guatemala' },
  { id: 'el_salvador',        moneda: 'USD', link: 'https://wise.com/send' },
  { id: 'colombia',           moneda: 'COP', link: 'https://wise.com/us/send-money/send-money-to-colombia' },
  { id: 'mexico',             moneda: 'MXN', link: 'https://wise.com/us/send-money/send-money-to-mexico' },
  { id: 'nicaragua',          moneda: 'NIO', link: 'https://wise.com/us/send-money/send-money-to-nicaragua' },
  { id: 'haiti',              moneda: 'HTG', link: 'https://wise.com/us/send-money/send-money-to-haiti' },
]

export async function scrapeWise(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('wise')

    try {
      // Wise semi-public rate API
      const url = `https://api.wise.com/v1/rates?source=USD&target=${corredor.moneda}`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const rate = Array.isArray(data) && data.length > 0 ? data[0].rate : null

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate returned')
      }

      prices.push({
        operador: 'wise',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(rate.toFixed(4)),
        fee: 2.50,
        velocidad: 'Segundos',
        nombre_operador: 'Wise',
        rating: 4.9,
        reviews: 12043,
        afiliado: true,
        link: corredor.link,
        confiabilidad: 95,
        metodos_disponibles: 2,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('wise', msg)
      return { saved: 0, errors: [`wise: ${msg}`] }
    }
  }

  resetFailCount('wise')
  return savePrices(prices)
}
