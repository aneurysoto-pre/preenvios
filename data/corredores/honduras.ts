import type { CorredorContent } from './types'

/**
 * Datos estructurales de Honduras para el landing editorial modelo A.
 *
 * Source of truth: HTML prototipo en C:\Users\ethan\prototipo-honduras\
 * (validado con el founder 2026-04-24). Los numeros (stats) son datos
 * macroeconomicos con fuentes (BCH 2025, US Census 2020, CEPAL 2024);
 * actualizar manualmente cuando esas fuentes publiquen data nueva y
 * subir `lastEditorialUpdate` de fecha.
 *
 * IDs, slugs, codigos y emojis son estructurales — no cambian. Los
 * gradientes se alinean con la estetica del mosaico del HTML prototipo
 * (tonos por ciudad: Tegucigalpa slate oscuro, Roatan cyan→arena, etc.).
 */
export const honduras: CorredorContent = {
  corredorId: 'honduras',
  banderaEmoji: '🇭🇳',
  codigoPais: 'hn',
  monedaCodigo: 'HNL',
  monedaSimbolo: 'L',

  lastEditorialUpdate: '2026-04-24',

  stats: {
    // $8.5B remesas anuales USA → Honduras (BCH 2025).
    remesasAnuales: '$8.5B',
    // 26% del PIB viene de remesas (CEPAL 2024, uno de los % mas altos
    // de Centroamerica).
    pibPorcentaje: '26%',
    // 800K+ hondureños en Estados Unidos (US Census Bureau 2020,
    // corregido desde el estimado previo de 1M+ del prototipo inicial).
    diasporaUsa: '800K+',
    // Top 3 receptor de remesas en Centroamerica (detras de Guatemala
    // y El Salvador en volumen absoluto segun CEPAL 2024).
    ranking: 'Top 3',
  },

  ciudades: [
    {
      slug: 'tegucigalpa',
      nombre: 'Tegucigalpa',
      departamento: 'Francisco Morazán',
      tipoKey: 'capital',
      poblacion: '1.3M hab.',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'san-pedro-sula',
      nombre: 'San Pedro Sula',
      departamento: 'Cortés',
      tipoKey: 'industrial',
      poblacion: '750K hab.',
      gradient: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
      emoji: '🏢',
    },
    {
      slug: 'roatan',
      nombre: 'Roatán',
      departamento: 'Islas de la Bahía',
      tipoKey: 'turismo',
      poblacion: '100K hab.',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #67e8f9 80%, #fef3c7 100%)',
      emoji: '🏝️',
    },
    {
      slug: 'copan-ruinas',
      nombre: 'Copán Ruinas',
      departamento: 'Copán',
      tipoKey: 'patrimonio_maya',
      poblacion: '40K hab.',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
      emoji: '🏛️',
    },
    {
      slug: 'la-ceiba',
      nombre: 'La Ceiba',
      departamento: 'Atlántida',
      tipoKey: 'puerto_caribe',
      poblacion: '210K hab.',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 60%, #a7f3d0 100%)',
      emoji: '🌴',
    },
    {
      slug: 'choluteca',
      nombre: 'Choluteca',
      departamento: 'Choluteca',
      tipoKey: 'agricola',
      poblacion: '160K hab.',
      gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
      emoji: '☀️',
    },
  ],

  fuentes: [
    'Banco Central de Honduras (BCH)',
    'INE Honduras',
    'US Census Bureau 2020',
    'CEPAL 2024',
  ],
}
