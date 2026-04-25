import type { CorredorContent } from './types'

/**
 * Datos estructurales de Republica Dominicana para el landing editorial.
 *
 * Source of truth de stats: BCRD 2025 (~$10.3B remesas anuales),
 * US Census Bureau 2020 (2.4M dominicanos en USA), CEPAL 2024 (~9-10%
 * del PIB). Subir `lastEditorialUpdate` cuando esas fuentes publiquen
 * data nueva.
 *
 * Diaspora concentrada en NYC/NJ/Boston/Miami — corredor con presencia
 * tradicional de operadoras locales (Quisqueyana, Caribe Express) pero
 * el comparador agrupa solo los 7 globales (Remitly, Wise, Xoom,
 * WorldRemit, WU, MoneyGram, Ria).
 */
export const dominican_republic: CorredorContent = {
  corredorId: 'dominican_republic',
  banderaEmoji: '🇩🇴',
  codigoPais: 'do',
  monedaCodigo: 'DOP',
  monedaSimbolo: 'RD$',

  lastEditorialUpdate: '2026-04-25',

  stats: {
    // $10.3B remesas anuales USA → RD (BCRD 2024).
    remesasAnuales: '$10.3B',
    // ~9-10% del PIB depende de remesas (CEPAL 2024).
    pibPorcentaje: '9.5%',
    // 2.4M dominicanos en USA (US Census 2020 — alpha en NYC/NJ).
    diasporaUsa: '2.4M',
    // #1 receptor de remesas del Caribe (BID 2024).
    ranking: '#1 Caribe',
  },

  ciudades: [
    {
      slug: 'santo-domingo',
      nombre: 'Santo Domingo',
      departamento: 'Distrito Nacional',
      tipoKey: 'capital',
      poblacion: '3.5M hab.',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'santiago-de-los-caballeros',
      nombre: 'Santiago',
      departamento: 'Santiago',
      tipoKey: 'cibao',
      poblacion: '700K hab.',
      gradient: 'linear-gradient(135deg, #047857 0%, #059669 50%, #34d399 100%)',
      emoji: '⛰️',
    },
    {
      slug: 'punta-cana',
      nombre: 'Punta Cana',
      departamento: 'La Altagracia',
      tipoKey: 'turismo',
      poblacion: '270K hab.',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #67e8f9 80%, #fef3c7 100%)',
      emoji: '🏝️',
    },
    {
      slug: 'la-romana',
      nombre: 'La Romana',
      departamento: 'La Romana',
      tipoKey: 'zona_franca',
      poblacion: '250K hab.',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)',
      emoji: '🏭',
    },
    {
      slug: 'puerto-plata',
      nombre: 'Puerto Plata',
      departamento: 'Puerto Plata',
      tipoKey: 'puerto_norte',
      poblacion: '150K hab.',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 60%, #a7f3d0 100%)',
      emoji: '🌴',
    },
    {
      slug: 'san-pedro-de-macoris',
      nombre: 'San Pedro de Macorís',
      departamento: 'San Pedro de Macorís',
      tipoKey: 'beisbol',
      poblacion: '200K hab.',
      gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #fbbf24 100%)',
      emoji: '⚾',
    },
  ],

  fuentes: [
    'Banco Central de la República Dominicana (BCRD)',
    'Oficina Nacional de Estadística (ONE)',
    'US Census Bureau 2020',
    'Banco Interamericano de Desarrollo (BID) 2024',
  ],
}
