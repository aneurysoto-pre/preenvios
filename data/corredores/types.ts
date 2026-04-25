/**
 * Types del data layer "landing editorial por pais".
 *
 * Patron hibrido decidido por el founder (2026-04-24):
 * - Datos estructurales no traducibles (nombres propios, IDs, slugs,
 *   numeros pre-formateados, gradientes, emojis) viven en TS data
 *   files: `data/corredores/<pais>.ts`.
 * - Textos narrativos traducibles (H2, parrafos, FAQ, labels de
 *   stats, descripciones de ciudades como "Capital" / "Industrial")
 *   viven en `messages/{locale}.json` via next-intl.
 *
 * El data file no tiene estructura `{ es: ..., en: ... }` — los
 * textos traducibles no estan aqui.
 */

/**
 * Contenido de una ciudad destacada del pais (seccion 3 del landing).
 *
 * Ejemplo: Tegucigalpa.
 * - `nombre` = "Tegucigalpa" (nombre propio, mismo ES/EN)
 * - `departamento` = "Francisco Morazán" (nombre propio)
 * - `tipoKey` = "capital" (key → messages.ciudades.tipo.capital devuelve
 *   "Capital" en ES, "Capital" en EN — en otros paises puede ser
 *   "industrial", "turismo", "patrimonio_maya", etc.)
 * - `poblacion` = "1.3M hab." (numero pre-formateado en ES; cuando se
 *   agregue EN se refactoriza a separar numero + unidad traducible)
 */
export type CityContent = {
  /** URL slug para /{locale}/{pais}/{slug} */
  slug: string
  /** Nombre propio de la ciudad */
  nombre: string
  /** Departamento / estado / provincia donde vive */
  departamento: string
  /** Key de traduccion en messages — ej. 'capital' → t('cities.tipo.capital') */
  tipoKey: string
  /** Poblacion pre-formateada (ej. "1.3M hab.") */
  poblacion: string
  /** CSS background gradient inline (ej. "linear-gradient(135deg, #1e293b 0%, ...)") */
  gradient: string
  /** Emoji decorativo de fondo del tile */
  emoji: string
  /** Si true, renderiza badge "#1 destino" (label traducible via messages) */
  esPrincipal?: boolean
}

/**
 * Contenido editorial estructural de un pais corredor.
 *
 * La existencia de este objeto (vs null) es el feature flag que
 * activa el landing editorial en pais-content.tsx. Si
 * getCorredorContent(pais.corredorId) devuelve null, se renderiza
 * el fallback (TasasReferencia + LazyBelow). Esto permite rollout
 * progresivo pais por pais.
 */
export type CorredorContent = {
  /** Matches PAISES_MVP.corredorId — source of truth para join */
  corredorId: string

  /** Bandera emoji (complementa la bandera SVG del nav via PAISES_MVP.bandera) */
  banderaEmoji: string

  /** ISO 3166-1 alpha-2 lowercase — para getTasaBancoCentral() */
  codigoPais: string

  /** Ej. "HNL", "DOP", "GTQ" */
  monedaCodigo: string

  /** Ej. "L", "RD$", "Q" */
  monedaSimbolo: string

  /**
   * Fecha ISO 8601 de ultima actualizacion del contenido editorial.
   * Se muestra en el bloque "Fuentes" al final del landing.
   */
  lastEditorialUpdate: string

  /**
   * 4 stats destacados del corredor (seccion 1).
   * Los valores son pre-formateados en ES ("$8.5B", "26%", "800K+",
   * "Top 3"). Los labels ("Remesas anuales", "Del PIB", etc.) viven
   * en messages y se componen en el componente.
   */
  stats: {
    remesasAnuales: string
    pibPorcentaje: string
    diasporaUsa: string
    ranking: string
  }

  /** 6 ciudades destacadas del pais (seccion 3 del landing) */
  ciudades: CityContent[]

  /**
   * Fuentes de datos citadas al final del landing (bloque "Fuentes:").
   * Nombres propios de instituciones — no traducibles.
   * Ej. ["Banco Central de Honduras (BCH)", "INE Honduras", ...]
   */
  fuentes: string[]
}
