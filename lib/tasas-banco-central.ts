import { cache } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Tipo de una fila de `tasas_bancos_centrales` en Supabase.
 *
 * Este archivo es la source of truth para el schema. Si se agrega
 * una columna nueva (ej. `moneda_simbolo`), se documenta aqui
 * primero. El componente legacy `components/TasasReferencia.tsx`
 * tiene una copia local de este tipo — en una futura sesion se
 * unifica importando desde aqui (fuera de scope del port actual).
 */
export type TasaBancoCentral = {
  id: string
  codigo_pais: string
  moneda: string
  nombre_banco: string
  nombre_banco_en: string
  siglas: string
  tasa: number
  nota: string
  nota_en: string
  actualizado_en: string
}

/**
 * Server-only helper — obtiene la tasa de un banco central por código
 * de país (ISO 3166-1 alpha-2). Los consumidores tipicos son los
 * Server Components de paginas de pais (`app/[locale]/[pais]/page.tsx`)
 * que necesitan la tasa en el HTML inicial para SEO + LCP — sin flash
 * "cargando tasa..." en el cliente como hace hoy `TasasReferencia.tsx`
 * (que fetchea via useEffect).
 *
 * `React.cache()` memoiza por-request — multiples llamadas en el mismo
 * render hacen 1 sola query a Supabase. Cross-request no hay cache
 * aqui; el TTL lo controla la page con `export const revalidate = N`
 * si rinde SSG/ISR, o es request-por-request si rinde dynamic.
 *
 * Usa el cliente Supabase con anon key (la tabla `tasas_bancos_centrales`
 * tiene policy `tasas_bc_public_read` que permite SELECT a anon — ver
 * migration 002). No necesita service_role.
 *
 * @param codigoPais - ISO 3166-1 alpha-2 lowercase (ej. 'hn', 'do', 'gt',
 *                     'sv', 'co', 'mx'). Matches `tasas_bancos_centrales.codigo_pais`.
 * @returns TasaBancoCentral o null si no se encontró (caller decide
 *          que mostrar — fallback a "—" o valor hardcoded de emergencia).
 */
export const getTasaBancoCentral = cache(
  async (codigoPais: string): Promise<TasaBancoCentral | null> => {
    const { data, error } = await supabase
      .from('tasas_bancos_centrales')
      .select('*')
      .eq('codigo_pais', codigoPais)
      .single()

    if (error || !data) {
      console.error('[getTasaBancoCentral]', { codigoPais, error: error?.message ?? 'no data' })
      return null
    }

    return data as TasaBancoCentral
  },
)

/**
 * Server-only helper — devuelve todas las tasas de bancos centrales
 * en un solo query. Util si una page necesita el grid completo de los
 * 6 corredores MVP (ej. si algun futuro layout muestra todas las tasas).
 *
 * No se usa en el landing editorial por pais (que solo necesita 1
 * tasa via `getTasaBancoCentral`), pero queda disponible por
 * simetria con el endpoint `/api/tasas-banco-central`.
 */
export const getAllTasasBancosCentrales = cache(
  async (): Promise<TasaBancoCentral[]> => {
    const { data, error } = await supabase
      .from('tasas_bancos_centrales')
      .select('*')
      .order('id')

    if (error || !data) {
      console.error('[getAllTasasBancosCentrales]', { error: error?.message ?? 'no data' })
      return []
    }

    return data as TasaBancoCentral[]
  },
)
