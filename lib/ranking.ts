/**
 * Algoritmo de ranking expandido — Preenvíos Score
 *
 * 5 criterios con pesos:
 *   tasa:          35% — cuánto recibe el receptor
 *   afiliado:      25% — si genera comisión para Preenvíos
 *   velocidad:     20% — qué tan rápido llega
 *   confiabilidad: 10% — años del operador + licencia en EE.UU.
 *   métodos:       10% — cantidad de métodos de entrega disponibles
 */

export type Precio = {
  id: number
  operador: string
  corredor: string
  metodo_entrega: string
  tasa: number
  fee: number
  velocidad: string
  nombre_operador: string
  rating: number
  reviews: number
  afiliado: boolean
  link: string
  confiabilidad: number
  metodos_disponibles: number
}

export type PrecioRanked = Precio & {
  score: number
  recibe: number
}

const PESOS = {
  tasa: 0.35,
  afiliado: 0.25,
  velocidad: 0.20,
  confiabilidad: 0.10,
  metodos: 0.10,
}

const VELOCIDAD_SCORE: Record<string, number> = {
  Segundos: 1.0,
  Minutos: 0.8,
  Horas: 0.4,
  Días: 0.0,
}

const MAX_METODOS = 4 // bank, cash, delivery, mobile

export function rankProviders(
  precios: Precio[],
  montoUsd: number
): PrecioRanked[] {
  if (precios.length === 0) return []

  const tasas = precios.map((p) => p.tasa)
  const maxTasa = Math.max(...tasas)
  const minTasa = Math.min(...tasas)
  const span = maxTasa - minTasa || 1

  return precios
    .map((p) => {
      const neto = Math.max(0, montoUsd - p.fee)
      const recibe = neto * p.tasa

      // Normalizar cada criterio a 0-1
      const tasaScore = (p.tasa - minTasa) / span
      const afiliadoScore = p.afiliado ? 1 : 0
      const velocidadScore = VELOCIDAD_SCORE[p.velocidad] ?? 0
      const confiabilidadScore = (p.confiabilidad || 50) / 100
      const metodosScore = Math.min((p.metodos_disponibles || 1) / MAX_METODOS, 1)

      // Score ponderado (0-100)
      const score = Math.round(
        (tasaScore * PESOS.tasa +
          afiliadoScore * PESOS.afiliado +
          velocidadScore * PESOS.velocidad +
          confiabilidadScore * PESOS.confiabilidad +
          metodosScore * PESOS.metodos) *
          100
      )

      return { ...p, score, recibe }
    })
    .sort((a, b) => b.score - a.score)
}
