import type { CorredorContent } from './types'

/**
 * Datos estructurales de Guatemala para el landing editorial.
 *
 * Source of truth de stats: Banguat 2024 ($21.5B remesas anuales — el
 * mayor receptor de Centroamerica), US Census 2020 (~1.8M
 * guatemaltecos en USA), CEPAL 2024 (~19% del PIB depende de remesas).
 * Subir `lastEditorialUpdate` cuando esas fuentes publiquen data nueva.
 *
 * Diaspora concentrada en Los Angeles, Houston, Phoenix, Chicago. Cobertura
 * por departamento es heterogenea — bancos pequeños regionales (Banrural)
 * dominan zonas rurales del altiplano.
 */
export const guatemala: CorredorContent = {
  corredorId: 'guatemala',
  banderaEmoji: '🇬🇹',
  codigoPais: 'gt',
  monedaCodigo: 'GTQ',
  monedaSimbolo: 'Q',

  lastEditorialUpdate: '2026-04-25',

  stats: {
    // $21.5B remesas anuales USA → Guatemala (Banguat 2024).
    remesasAnuales: '$21.5B',
    // ~19% del PIB depende de remesas (CEPAL 2024).
    pibPorcentaje: '19%',
    // 1.8M guatemaltecos en USA (US Census 2020).
    diasporaUsa: '1.8M',
    // #1 receptor de Centroamerica en volumen absoluto (CEPAL 2024).
    ranking: '#1 CA',
  },

  ciudades: [
    {
      slug: 'ciudad-de-guatemala',
      nombre: 'Ciudad de Guatemala',
      departamento: 'Guatemala',
      tipoKey: 'capital',
      poblacion: '3M hab.',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'quetzaltenango',
      nombre: 'Quetzaltenango',
      departamento: 'Quetzaltenango',
      tipoKey: 'altiplano',
      poblacion: '180K hab.',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)',
      emoji: '⛰️',
    },
    {
      slug: 'antigua-guatemala',
      nombre: 'Antigua Guatemala',
      departamento: 'Sacatepéquez',
      tipoKey: 'patrimonio_colonial',
      poblacion: '50K hab.',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
      emoji: '🏛️',
    },
    {
      slug: 'huehuetenango',
      nombre: 'Huehuetenango',
      departamento: 'Huehuetenango',
      tipoKey: 'frontera_norte',
      poblacion: '180K hab.',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #a78bfa 100%)',
      emoji: '🌾',
    },
    {
      slug: 'coban',
      nombre: 'Cobán',
      departamento: 'Alta Verapaz',
      tipoKey: 'cafetalero',
      poblacion: '220K hab.',
      gradient: 'linear-gradient(135deg, #422006 0%, #92400e 50%, #d97706 100%)',
      emoji: '☕',
    },
    {
      slug: 'mixco',
      nombre: 'Mixco',
      departamento: 'Guatemala',
      tipoKey: 'metropolitana',
      poblacion: '480K hab.',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)',
      emoji: '🏢',
    },
  ],

  fuentes: [
    'Banco de Guatemala (Banguat)',
    'Instituto Nacional de Estadística (INE)',
    'US Census Bureau 2020',
    'CEPAL 2024',
  ],
}
