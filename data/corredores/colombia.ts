import type { CorredorContent } from './types'

/**
 * Datos estructurales de Colombia para el landing editorial.
 *
 * Source of truth: Banco de la Republica 2024 (~$12B remesas anuales),
 * US Census 2020 (~1.3M colombianos en USA, principalmente en FL/NJ/NY),
 * DANE 2024 (~3-4% del PIB depende de remesas). Subir
 * `lastEditorialUpdate` cuando esas fuentes publiquen data nueva.
 *
 * Caso particular: la tasa COP/USD esta en miles (~4150 hoy) — los
 * usuarios necesitan visualizar diferencias absolutas (100 pesos por
 * dolar = $0.024 USD, parece poco pero en 12 envios anuales es real).
 */
export const colombia: CorredorContent = {
  corredorId: 'colombia',
  banderaEmoji: '🇨🇴',
  codigoPais: 'co',
  monedaCodigo: 'COP',
  monedaSimbolo: '$',

  lastEditorialUpdate: '2026-04-25',

  stats: {
    // ~$12B remesas anuales USA → Colombia (BanRep 2024).
    remesasAnuales: '$12B',
    // ~3-4% del PIB depende de remesas (DANE 2024).
    pibPorcentaje: '3.6%',
    // 1.3M colombianos en USA (US Census 2020).
    diasporaUsa: '1.3M',
    // Top 5 receptor de Latinoamerica (CEPAL 2024).
    ranking: 'Top 5 Latam',
  },

  ciudades: [
    {
      slug: 'bogota',
      nombre: 'Bogotá',
      departamento: 'Cundinamarca',
      tipoKey: 'capital',
      poblacion: '8M hab.',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
      emoji: '🏙️',
      esPrincipal: true,
    },
    {
      slug: 'medellin',
      nombre: 'Medellín',
      departamento: 'Antioquia',
      tipoKey: 'innovacion',
      poblacion: '2.5M hab.',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)',
      emoji: '🌸',
    },
    {
      slug: 'cali',
      nombre: 'Cali',
      departamento: 'Valle del Cauca',
      tipoKey: 'salsa',
      poblacion: '2.2M hab.',
      gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f87171 100%)',
      emoji: '💃',
    },
    {
      slug: 'barranquilla',
      nombre: 'Barranquilla',
      departamento: 'Atlántico',
      tipoKey: 'caribe',
      poblacion: '1.3M hab.',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #67e8f9 80%, #fef3c7 100%)',
      emoji: '🎺',
    },
    {
      slug: 'cartagena',
      nombre: 'Cartagena',
      departamento: 'Bolívar',
      tipoKey: 'patrimonio_colonial',
      poblacion: '1M hab.',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)',
      emoji: '🏛️',
    },
    {
      slug: 'pereira',
      nombre: 'Pereira',
      departamento: 'Risaralda',
      tipoKey: 'cafetalero',
      poblacion: '475K hab.',
      gradient: 'linear-gradient(135deg, #422006 0%, #92400e 50%, #d97706 100%)',
      emoji: '☕',
    },
  ],

  fuentes: [
    'Banco de la República (BanRep)',
    'Departamento Administrativo Nacional de Estadística (DANE)',
    'US Census Bureau 2020',
    'CEPAL 2024',
  ],
}
