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
  nombre: string
  nombreEn: string
  moneda: string
  bandera: string
  /** Bancos/billeteras populares placeholder */
  bancosEs: string[]
  bancosEn: string[]
}

export const PAISES_MVP: PaisData[] = [
  {
    slugEs: 'honduras',
    slugEn: 'honduras',
    corredorId: 'honduras',
    nombre: 'Honduras',
    nombreEn: 'Honduras',
    moneda: 'HNL',
    bandera: '\u{1F1ED}\u{1F1F3}',
    bancosEs: ['BAC Honduras', 'Banco Atlántida', 'Ficohsa', 'Banpaís', 'Tigo Money'],
    bancosEn: ['BAC Honduras', 'Banco Atlántida', 'Ficohsa', 'Banpaís', 'Tigo Money'],
  },
  {
    slugEs: 'republica-dominicana',
    slugEn: 'dominican-republic',
    corredorId: 'dominican_republic',
    nombre: 'República Dominicana',
    nombreEn: 'Dominican Republic',
    moneda: 'DOP',
    bandera: '\u{1F1E9}\u{1F1F4}',
    bancosEs: ['Banreservas', 'Banco Popular Dominicano', 'BHD León', 'Scotiabank RD', 'Banco Santa Cruz'],
    bancosEn: ['Banreservas', 'Banco Popular Dominicano', 'BHD León', 'Scotiabank RD', 'Banco Santa Cruz'],
  },
  {
    slugEs: 'guatemala',
    slugEn: 'guatemala',
    corredorId: 'guatemala',
    nombre: 'Guatemala',
    nombreEn: 'Guatemala',
    moneda: 'GTQ',
    bandera: '\u{1F1EC}\u{1F1F9}',
    bancosEs: ['Banco Industrial', 'Banrural', 'BAM', 'G&T Continental', 'Banco Promerica'],
    bancosEn: ['Banco Industrial', 'Banrural', 'BAM', 'G&T Continental', 'Banco Promerica'],
  },
  {
    slugEs: 'el-salvador',
    slugEn: 'el-salvador',
    corredorId: 'el_salvador',
    nombre: 'El Salvador',
    nombreEn: 'El Salvador',
    moneda: 'USD',
    bandera: '\u{1F1F8}\u{1F1FB}',
    bancosEs: ['Banco Agrícola', 'Banco Davivienda', 'Banco Cuscatlán', 'BAC Credomatic', 'Chivo Wallet'],
    bancosEn: ['Banco Agrícola', 'Banco Davivienda', 'Banco Cuscatlán', 'BAC Credomatic', 'Chivo Wallet'],
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
