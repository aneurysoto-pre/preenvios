/**
 * Scraper Xoom (PayPal)
 */

import { rateLimitDelay, getHeaders, savePrices, reportScraperFailure, resetFailCount, type ScrapedPrice } from './base'

const CORREDORES = [
  { id: 'honduras',           moneda: 'HNL', country: 'HN', link: 'https://www.xoom.com/honduras/send-money' },
  { id: 'dominican_republic', moneda: 'DOP', country: 'DO', link: 'https://www.xoom.com/dominican-republic/send-money' },
  { id: 'guatemala',          moneda: 'GTQ', country: 'GT', link: 'https://www.xoom.com/guatemala/send-money' },
  { id: 'el_salvador',        moneda: 'USD', country: 'SV', link: 'https://www.xoom.com' },
  { id: 'colombia',           moneda: 'COP', country: 'CO', link: 'https://www.xoom.com/colombia/send-money' },
  { id: 'mexico',             moneda: 'MXN', country: 'MX', link: 'https://www.xoom.com/mexico/send-money' },
  { id: 'nicaragua',          moneda: 'NIO', country: 'NI', link: 'https://www.xoom.com/nicaragua/send-money' },
  { id: 'haiti',              moneda: 'HTG', country: 'HT', link: 'https://www.xoom.com/haiti/send-money' },
]

export async function scrapeXoom(): Promise<{ saved: number; errors: string[] }> {
  const prices: ScrapedPrice[] = []

  for (const corredor of CORREDORES) {
    await rateLimitDelay('xoom')

    try {
      const url = `https://www.xoom.com/api/calculator?sendAmount=200&sendCurrency=USD&receiveCurrency=${corredor.moneda}&receiveCountry=${corredor.country}`
      const res = await fetch(url, { headers: getHeaders() })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const rate = data?.exchangeRate || data?.rate
      const fee = data?.fee || data?.sendFee || 0

      if (!rate && corredor.moneda !== 'USD') {
        throw new Error('No rate in response')
      }

      prices.push({
        operador: 'xoom',
        corredor: corredor.id,
        metodo_entrega: 'bank',
        tasa: corredor.moneda === 'USD' ? 1 : Number(Number(rate).toFixed(4)),
        fee: Number(Number(fee).toFixed(2)),
        velocidad: 'Minutos',
        nombre_operador: 'Xoom',
        rating: 4.7,
        reviews: 6120,
        afiliado: true,
        link: corredor.link,
        confiabilidad: 90,
        metodos_disponibles: 3,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await reportScraperFailure('xoom', msg)
      return { saved: 0, errors: [`xoom: ${msg}`] }
    }
  }

  resetFailCount('xoom')
  return savePrices(prices)
}
