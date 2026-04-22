/**
 * Scraper Remitly — protección alta, puede requerir proxy
 * Intenta fetch directo primero; si falla, marca para proxy
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'HND', link: 'https://www.remitly.com/us/en/honduras' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'DOM', link: 'https://www.remitly.com/us/en/dominican-republic' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'GTM', link: 'https://www.remitly.com/us/en/guatemala' },
  { id: 'el_salvador',        moneda: 'USD', country: 'SLV', link: 'https://www.remitly.com' },
  { id: 'colombia',           moneda: 'COP', country: 'COL', link: 'https://www.remitly.com/us/en/colombia' },
  { id: 'mexico',             moneda: 'MXN', country: 'MEX', link: 'https://www.remitly.com/us/en/mexico' },
]

export async function scrapeRemitly(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('remitly')

    try {
      // Remitly pricing estimate API
      const url = `https://www.remitly.com/api/pricing/estimate?amount=200&sourceCurrency=USD&destinationCurrency=${corredor.moneda}&destinationCountry=${corredor.country}&sourceCountry=USA`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status} — may need proxy`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.rate
      const fee = data?.fee || data?.totalFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'remitly',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Minutos',
        nombre_operador: 'Remitly',
        rating: 4.8,
        reviews: 8421,
        afiliado: true,
        link: corredor.link,
        confiabilidad: 80,
        metodos_disponibles: 3,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('remitly', msg)
      return { saved: 0, errors: [`remitly: ${msg}`] }
    }
  }

  resetFailCount('remitly')
  return savePrices(prices)
}
