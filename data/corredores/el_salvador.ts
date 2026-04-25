import type { CorredorContent } from './types'

/**
 * Datos estructurales de El Salvador para el landing editorial.
 *
 * Caso especial: El Salvador esta dolarizado desde 2001 — la moneda
 * oficial es el USD (con Bitcoin como legal tender desde 2021, aunque
 * adopcion practica para remesas es marginal). NO hay tipo de cambio
 * USD/USD que comparar — la "tasa BCR" es 1.00. El comparador igual
 * sirve porque las comisiones varian entre operadoras y porque pagos
 * a billetera movil (Tigo Money, ChivoWallet) no cubren las mismas
 * remesadoras.
 *
 * Source of truth: BCR 2024 (~$8.5B remesas anuales — #2 Centroamerica
 * detras de Guatemala), US Census 2020 (~2.5M salvadoreños en USA),
 * CEPAL 2024 (~24% del PIB).
 */
export const el_salvador: CorredorContent = {
  corredorId: 'el_salvador',
  banderaEmoji: '🇸🇻',
  codigoPais: 'sv',
  monedaCodigo: 'USD',
  monedaSimbolo: '$',

  lastEditorialUpdate: '2026-04-25',

  stats: {
    // $8.5B remesas anuales USA → SV (BCR 2024).
    remesasAnuales: '$8.5B',
    // 24% del PIB — uno de los % mas altos de Latam (CEPAL 2024).
    pibPorcentaje: '24%',
    // 2.5M salvadoreños en USA — diaspora densa por habitante (US Census 2020).
    diasporaUsa: '2.5M',
    // #2 receptor de Centroamerica en volumen absoluto (CEPAL 2024).
    ranking: '#2 CA',
  },

  ciudades: [
    {
      slug: 'san-salvador',
      nombre: 'San Salvador',
      departamento: 'San Salvador',
      tipoKey: 'capital',
      poblacion: '1.8M hab.',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'santa-ana',
      nombre: 'Santa Ana',
      departamento: 'Santa Ana',
      tipoKey: 'cafetalero',
      poblacion: '275K hab.',
      gradient: 'linear-gradient(135deg, #422006 0%, #92400e 50%, #d97706 100%)',
      emoji: '☕',
    },
    {
      slug: 'san-miguel',
      nombre: 'San Miguel',
      departamento: 'San Miguel',
      tipoKey: 'oriental',
      poblacion: '240K hab.',
      gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f87171 100%)',
      emoji: '🌋',
    },
    {
      slug: 'soyapango',
      nombre: 'Soyapango',
      departamento: 'San Salvador',
      tipoKey: 'industrial',
      poblacion: '240K hab.',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)',
      emoji: '🏭',
    },
    {
      slug: 'la-libertad',
      nombre: 'La Libertad',
      departamento: 'La Libertad',
      tipoKey: 'costero',
      poblacion: '40K hab.',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 60%, #a7f3d0 100%)',
      emoji: '🏖️',
    },
    {
      slug: 'sonsonate',
      nombre: 'Sonsonate',
      departamento: 'Sonsonate',
      tipoKey: 'occidental',
      poblacion: '70K hab.',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
      emoji: '🌽',
    },
  ],

  fuentes: [
    'Banco Central de Reserva (BCR)',
    'Dirección General de Estadística y Censos (DIGESTYC)',
    'US Census Bureau 2020',
    'CEPAL 2024',
  ],
}
