/**
 * Datos estáticos de páginas editoriales por país (MVP: 4 corredores)
 */

export type PaisData = {
  /** Slug en español */
  slugEs: string
  /** Slug en inglés */
  slugEn: string
  /** ID del corredor en Supabase/Comparador */
  corredorId: string
  /** ISO 3166-1 alpha-2 code (lowercase) — matches tasas_bancos_centrales.codigo_pais */
  codigoPais: string
  nombre: string
  nombreEn: string
  moneda: string
  bandera: string
  /** Hero gradient tailwind classes */
  heroGradient: string
  /** Bancos/billeteras populares placeholder */
  bancosEs: string[]
  bancosEn: string[]
}

export const PAISES_MVP: PaisData[] = [
  {
    slugEs: 'honduras',
    slugEn: 'honduras',
    corredorId: 'honduras',
    codigoPais: 'hn',
    nombre: 'Honduras',
    nombreEn: 'Honduras',
    moneda: 'HNL',
    bandera: '\u{1F1ED}\u{1F1F3}',
    heroGradient: 'from-blue-50 via-white to-blue-100',
    bancosEs: ['BAC Honduras', 'Banco Atlántida', 'Ficohsa', 'Banpaís', 'Tigo Money'],
    bancosEn: ['BAC Honduras', 'Banco Atlántida', 'Ficohsa', 'Banpaís', 'Tigo Money'],
  },
  {
    slugEs: 'republica-dominicana',
    slugEn: 'dominican-republic',
    corredorId: 'dominican_republic',
    codigoPais: 'do',
    nombre: 'República Dominicana',
    nombreEn: 'Dominican Republic',
    moneda: 'DOP',
    bandera: '\u{1F1E9}\u{1F1F4}',
    heroGradient: 'from-red-50 via-white to-blue-50',
    bancosEs: ['Banreservas', 'Banco Popular Dominicano', 'BHD León', 'Scotiabank RD', 'Banco Santa Cruz'],
    bancosEn: ['Banreservas', 'Banco Popular Dominicano', 'BHD León', 'Scotiabank RD', 'Banco Santa Cruz'],
  },
  {
    slugEs: 'guatemala',
    slugEn: 'guatemala',
    corredorId: 'guatemala',
    codigoPais: 'gt',
    nombre: 'Guatemala',
    nombreEn: 'Guatemala',
    moneda: 'GTQ',
    bandera: '\u{1F1EC}\u{1F1F9}',
    heroGradient: 'from-blue-50 via-white to-cyan-50',
    bancosEs: ['Banco Industrial', 'Banrural', 'BAM', 'G&T Continental', 'Banco Promerica'],
    bancosEn: ['Banco Industrial', 'Banrural', 'BAM', 'G&T Continental', 'Banco Promerica'],
  },
  {
    slugEs: 'el-salvador',
    slugEn: 'el-salvador',
    corredorId: 'el_salvador',
    codigoPais: 'sv',
    nombre: 'El Salvador',
    nombreEn: 'El Salvador',
    moneda: 'USD',
    bandera: '\u{1F1F8}\u{1F1FB}',
    heroGradient: 'from-blue-50 via-white to-slate-50',
    bancosEs: ['Banco Agrícola', 'Banco Davivienda', 'Banco Cuscatlán', 'BAC Credomatic', 'Chivo Wallet'],
    bancosEn: ['Banco Agrícola', 'Banco Davivienda', 'Banco Cuscatlán', 'BAC Credomatic', 'Chivo Wallet'],
  },
  {
    slugEs: 'colombia',
    slugEn: 'colombia',
    corredorId: 'colombia',
    codigoPais: 'co',
    nombre: 'Colombia',
    nombreEn: 'Colombia',
    moneda: 'COP',
    bandera: '\u{1F1E8}\u{1F1F4}',
    heroGradient: 'from-yellow-50 via-white to-blue-50',
    bancosEs: ['Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA Colombia', 'Nequi', 'Daviplata'],
    bancosEn: ['Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA Colombia', 'Nequi', 'Daviplata'],
  },
  {
    slugEs: 'mexico',
    slugEn: 'mexico',
    corredorId: 'mexico',
    codigoPais: 'mx',
    nombre: 'México',
    nombreEn: 'Mexico',
    moneda: 'MXN',
    bandera: '\u{1F1F2}\u{1F1FD}',
    heroGradient: 'from-green-50 via-white to-red-50',
    bancosEs: ['BBVA México', 'Banorte', 'Santander México', 'Citibanamex', 'HSBC México', 'Banco Azteca'],
    bancosEn: ['BBVA México', 'Banorte', 'Santander México', 'Citibanamex', 'HSBC México', 'Banco Azteca'],
  },
]

/** Find a country by any slug (es or en) */
export function findPaisBySlug(slug: string): PaisData | undefined {
  return PAISES_MVP.find(p => p.slugEs === slug || p.slugEn === slug)
}

/** Get all valid slugs for generateStaticParams */
export function getAllPaisSlugs(): string[] {
  const slugs = new Set<string>()
  for (const p of PAISES_MVP) {
    slugs.add(p.slugEs)
    slugs.add(p.slugEn)
  }
  return [...slugs]
}
