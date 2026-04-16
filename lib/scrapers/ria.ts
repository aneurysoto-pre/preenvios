/**
 * Scraper Ria Money Transfer
 * Usa fetch a la página de envío para extraer tasa del HTML/JSON
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'honduras',            link: 'https://www.riamoneytransfer.com/us/en/send-money-to/honduras' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'dominican-republic',  link: 'https://www.riamoneytransfer.com/us/en/send-money-to/dominican-republic' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'guatemala',           link: 'https://www.riamoneytransfer.com/us/en/send-money-to/guatemala' },
  { id: 'el_salvador',        moneda: 'USD', country: 'el-salvador',         link: 'https://www.riamoneytransfer.com' },
]

export async function scrapeRia(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('ria')

    try {
      // Ria pricing API endpoint
      const url = `https://www.riamoneytransfer.com/api/pricing?from=US&to=${corredor.country}&amount=200&currency=${corredor.moneda}`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.rate
      const fee = data?.fee || data?.transferFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'ria',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Minutos',
        nombre_operador: 'Ria',
        rating: 4.6,
        reviews: 5200,
        afiliado: true,
        link: corredor.link,
        confiabilidad: 85,
        metodos_disponibles: 4,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('ria', msg)
      return { saved: 0, errors: [`ria: ${msg}`] }
    }
  }

  resetFailCount('ria')
  return savePrices(prices)
}
