/**
 * Scraper MoneyGram — protección media
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'HND', link: '' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'DOM', link: '' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'GTM', link: '' },
  { id: 'el_salvador',        moneda: 'USD', country: 'SLV', link: '' },
]

export async function scrapeMoneyGram(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('moneygram')

    try {
      const url = `https://www.moneygram.com/mgo/api/estimate?sendCountry=US&receiveCountry=${corredor.country}&sendCurrency=USD&receiveCurrency=${corredor.moneda}&amount=200`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.fxRate
      const fee = data?.fee || data?.totalFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'moneygram',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Horas',
        nombre_operador: 'MoneyGram',
        rating: 4.4,
        reviews: 7541,
        afiliado: false,
        link: '',
        confiabilidad: 85,
        metodos_disponibles: 3,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('moneygram', msg)
      return { saved: 0, errors: [`moneygram: ${msg}`] }
    }
  }

  resetFailCount('moneygram')
  return savePrices(prices)
}
