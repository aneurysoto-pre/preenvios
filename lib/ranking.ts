/**
 * Algoritmo de ranking expandido — Preenvíos Score
 *
 * 5 criterios con pesos:
 *   tasa:            35% — cuánto recibe el receptor (prioridad usuario)
 *   valor_afiliado:  25% — comisión × cookie × fracción de tráfico calificable
 *   velocidad:       15% — qué tan rápido llega
 *   confiabilidad:   15% — años del operador + licencia en EE.UU.
 *   métodos:         10% — cantidad de métodos de entrega disponibles
 *
 * El factor valor_afiliado reemplaza al antiguo binario "afiliado" (1 o 0)
 * por una medida económica: comisión esperada por click ponderada por
 * cookie lifetime y fracción de tráfico que califica al programa.
 * Ver SQL migración 003_valor_afiliado.sql.
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
  /** Comisión estimada por conversión en USD (default 0) */
  comision_usd?: number | null
  /** Duración de cookie en días (9999 = lifetime, default 30) */
  cookie_dias?: number | null
  /** Fracción 0-1 del tráfico que califica al programa (default 1.0) */
  trafico_calificable?: number | null
}

export type PrecioRanked = Precio & {
  score: number
  recibe: number
}

const PESOS = {
  tasa: 0.35,
  valor_afiliado: 0.25,
  velocidad: 0.15,
  confiabilidad: 0.15,
  metodos: 0.10,
}

const VELOCIDAD_SCORE: Record<string, number> = {
  Segundos: 1.0,
  Minutos: 0.8,
  Horas: 0.4,
  Días: 0.0,
}

const MAX_METODOS = 4 // bank, cash, delivery, mobile

/**
 * Valor económico bruto esperado por click del operador.
 * Combina comisión × multiplicador de cookie × fracción de tráfico calificable.
 * Cookie se cap a 3x para que un lifetime no domine completamente.
 * Si el operador no tiene afiliado, devuelve 0.
 */
export function calcularValorAfiliado(p: Pick<Precio, 'afiliado' | 'comision_usd' | 'cookie_dias' | 'trafico_calificable'>): number {
  if (!p.afiliado) return 0
  const comision = p.comision_usd ?? 0
  const cookieDias = p.cookie_dias ?? 30
  const trafico = p.trafico_calificable ?? 1.0
  const cookieMultiplicador = Math.min(cookieDias / 30, 3)
  return comision * cookieMultiplicador * trafico
}

export function rankProviders(
  precios: Precio[],
  montoUsd: number
): PrecioRanked[] {
  if (precios.length === 0) return []

  const tasas = precios.map((p) => p.tasa)
  const maxTasa = Math.max(...tasas)
  const minTasa = Math.min(...tasas)
  const tasaSpan = maxTasa - minTasa || 1

  // Normalización del valor_afiliado contra min/max de operadores con afiliado
  const valoresAfiliado = precios
    .filter((p) => p.afiliado)
    .map((p) => calcularValorAfiliado(p))
  const maxValor = valoresAfiliado.length > 0 ? Math.max(...valoresAfiliado) : 0
  const minValor = valoresAfiliado.length > 0 ? Math.min(...valoresAfiliado) : 0
  const valorSpan = maxValor - minValor || 1

  return precios
    .map((p) => {
      const neto = Math.max(0, montoUsd - p.fee)
      const recibe = neto * p.tasa

      // Normalizar cada criterio a 0-1
      const tasaScore = (p.tasa - minTasa) / tasaSpan
      const valorBruto = calcularValorAfiliado(p)
      const valorAfiliadoScore = p.afiliado && maxValor > 0
        ? (valorBruto - minValor) / valorSpan
        : 0
      const velocidadScore = VELOCIDAD_SCORE[p.velocidad] ?? 0
      const confiabilidadScore = (p.confiabilidad || 50) / 100
      const metodosScore = Math.min((p.metodos_disponibles || 1) / MAX_METODOS, 1)

      // Score ponderado (0-100)
      const score = Math.round(
        (tasaScore * PESOS.tasa +
          valorAfiliadoScore * PESOS.valor_afiliado +
          velocidadScore * PESOS.velocidad +
          confiabilidadScore * PESOS.confiabilidad +
          metodosScore * PESOS.metodos) *
          100
      )

      return { ...p, score, recibe }
    })
    .sort((a, b) => b.score - a.score)
}
