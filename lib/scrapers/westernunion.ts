/**
 * Scraper Western Union — protección alta, probablemente requiere proxy
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'HN', link: '' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'DO', link: '' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'GT', link: '' },
  { id: 'el_salvador',        moneda: 'USD', country: 'SV', link: '' },
  { id: 'colombia',           moneda: 'COP', country: 'CO', link: '' },
  { id: 'mexico',             moneda: 'MXN', country: 'MX', link: '' },
  { id: 'nicaragua',          moneda: 'NIO', country: 'NI', link: '' },
  { id: 'haiti',              moneda: 'HTG', country: 'HT', link: '' },
]

export async function scrapeWesternUnion(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('westernunion')

    try {
      const url = `https://www.westernunion.com/wuconnect/prices/catalog/USD/${corredor.moneda}/200?country=${corredor.country}`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status} — likely needs proxy`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.fxRate
      const fee = data?.fee || data?.transferFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'westernunion',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Minutos',
        nombre_operador: 'Western Union',
        rating: 4.5,
        reviews: 15820,
        afiliado: false,
        link: '',
        confiabilidad: 95,
        metodos_disponibles: 3,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('westernunion', msg)
      return { saved: 0, errors: [`westernunion: ${msg}`] }
    }
  }

  resetFailCount('westernunion')
  return savePrices(prices)
}
