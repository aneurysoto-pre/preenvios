/**
 * Scraper WorldRemit
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'HN', link: 'https://www.worldremit.com/en/send-money/united-states/honduras' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'DO', link: 'https://www.worldremit.com/en/send-money/united-states/dominican-republic' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'GT', link: 'https://www.worldremit.com/en/send-money/united-states/guatemala' },
  { id: 'el_salvador',        moneda: 'USD', country: 'SV', link: 'https://www.worldremit.com' },
]

export async function scrapeWorldRemit(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('worldremit')

    try {
      const url = `https://www.worldremit.com/api/pricing?sendCountry=US&receiveCountry=${corredor.country}&sendCurrency=USD&receiveCurrency=${corredor.moneda}&sendAmount=200`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.rate
      const fee = data?.fee || data?.totalFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'worldremit',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Minutos',
        nombre_operador: 'WorldRemit',
        rating: 4.6,
        reviews: 4800,
        afiliado: true,
        link: corredor.link,
        confiabilidad: 75,
        metodos_disponibles: 4,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('worldremit', msg)
      return { saved: 0, errors: [`worldremit: ${msg}`] }
    }
  }

  resetFailCount('worldremit')
  return savePrices(prices)
}
