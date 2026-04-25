import type { CorredorContent } from './types'
import { honduras } from './honduras'
import { dominican_republic } from './dominican_republic'
import { guatemala } from './guatemala'
import { el_salvador } from './el_salvador'
import { colombia } from './colombia'
import { mexico } from './mexico'

/**
 * Registry de contenido editorial por corredor.
 *
 * Un pais tiene landing editorial SOLO si aparece en este map. Es el
 * feature flag que permite rollout progresivo — agregamos paises al
 * map segun los portemos de a uno. Los que no estan aca caen al
 * fallback (TasasReferencia + LazyBelow) en pais-content.tsx.
 *
 * Status (2026-04-25):
 * 1. ✓ Honduras (port inicial)
 * 2. ✓ Dominican Republic
 * 3. ✓ Guatemala
 * 4. ✓ El Salvador (caso especial: dolarizado)
 * 5. ✓ Colombia
 * 6. ✓ Mexico
 *
 * Los 6 corredores MVP estan ahora con landing editorial completo.
 */
const CORREDORES_CONTENT: Record<string, CorredorContent> = {
  honduras,
  dominican_republic,
  guatemala,
  el_salvador,
  colombia,
  mexico,
}

/**
 * Feature flag "por datos": devuelve el contenido editorial del
 * corredor si existe, o null.
 *
 * Usado por `app/[locale]/[pais]/pais-content.tsx` para decidir si
 * renderiza el landing editorial o el fallback. Patron decidido con
 * founder 2026-04-24.
 *
 * @param corredorId - matches `PAISES_MVP.corredorId` (ej. 'honduras',
 *                     'dominican_republic', 'mexico')
 * @returns CorredorContent si el pais tiene editorial, o null
 */
export function getCorredorContent(corredorId: string): CorredorContent | null {
  return CORREDORES_CONTENT[corredorId] ?? null
}

export type { CorredorContent, CityContent } from './types'
