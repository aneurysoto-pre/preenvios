import type { CorredorContent } from './types'

/**
 * Datos estructurales de Mexico para el landing editorial.
 *
 * Mexico es el corredor de remesas mas grande del mundo: ~$66B anuales
 * desde USA en 2024 (Banxico). Diaspora masiva (~37M
 * mexicanos/mexicano-americanos segun US Census 2020). Por su tamaño,
 * incluso diferencias del 0.5% en tasa significan ahorros agregados
 * grandes — el comparador esta especialmente diseñado para resaltar
 * diferencias chicas que se acumulan en envios mensuales recurrentes.
 *
 * Source of truth: Banxico 2024, US Census 2020, INEGI 2024
 * (~4% del PIB depende de remesas).
 */
export const mexico: CorredorContent = {
  corredorId: 'mexico',
  banderaEmoji: '🇲🇽',
  codigoPais: 'mx',
  monedaCodigo: 'MXN',
  monedaSimbolo: '$',

  lastEditorialUpdate: '2026-04-25',

  stats: {
    // $66B remesas anuales USA → Mexico — el corredor mas grande del
    // mundo (Banxico 2024).
    remesasAnuales: '$66B',
    // ~4% del PIB depende de remesas (INEGI 2024).
    pibPorcentaje: '4%',
    // 37M mexicanos/mexicano-americanos en USA (US Census 2020).
    diasporaUsa: '37M',
    // #1 mundial en volumen absoluto de remesas (Banco Mundial 2024).
    ranking: '#1 mundial',
  },

  ciudades: [
    {
      slug: 'ciudad-de-mexico',
      nombre: 'Ciudad de México',
      departamento: 'CDMX',
      tipoKey: 'capital',
      poblacion: '9.2M hab.',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'guadalajara',
      nombre: 'Guadalajara',
      departamento: 'Jalisco',
      tipoKey: 'tequilera',
      poblacion: '1.4M hab.',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)',
      emoji: '🎺',
    },
    {
      slug: 'monterrey',
      nombre: 'Monterrey',
      departamento: 'Nuevo León',
      tipoKey: 'industrial',
      poblacion: '1.1M hab.',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)',
      emoji: '🏢',
    },
    {
      slug: 'puebla',
      nombre: 'Puebla',
      departamento: 'Puebla',
      tipoKey: 'colonial',
      poblacion: '1.6M hab.',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
      emoji: '🏛️',
    },
    {
      slug: 'tijuana',
      nombre: 'Tijuana',
      departamento: 'Baja California',
      tipoKey: 'frontera',
      poblacion: '1.9M hab.',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #a78bfa 100%)',
      emoji: '🌉',
    },
    {
      slug: 'merida',
      nombre: 'Mérida',
      departamento: 'Yucatán',
      tipoKey: 'patrimonio_maya',
      poblacion: '900K hab.',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 60%, #a7f3d0 100%)',
      emoji: '🏛️',
    },
  ],

  fuentes: [
    'Banco de México (Banxico)',
    'Instituto Nacional de Estadística y Geografía (INEGI)',
    'US Census Bureau 2020',
    'Banco Mundial 2024',
  ],
}
