import type { CorredorContent } from './types'
import { honduras } from './honduras'

/**
 * Registry de contenido editorial por corredor.
 *
 * Un pais tiene landing editorial SOLO si aparece en este map. Es el
 * feature flag que permite rollout progresivo — agregamos paises al
 * map segun los portemos de a uno. Los que no estan aca caen al
 * fallback (TasasReferencia + LazyBelow) en pais-content.tsx.
 *
 * Orden de incorporacion esperado (post-Honduras):
 * 1. Honduras ← este commit
 * 2. dominican_republic (proximo prioritario)
 * 3. guatemala
 * 4. el_salvador
 * 5. colombia
 * 6. mexico
 */
const CORREDORES_CONTENT: Record<string, CorredorContent> = {
  honduras,
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
