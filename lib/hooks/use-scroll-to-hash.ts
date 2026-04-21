'use client'

import { useEffect } from 'react'

/**
 * Re-scrollea a un elemento con `id` dado cuando el componente se monta
 * Y la URL tiene el hash correspondiente (#id).
 *
 * Necesario cuando el componente consumidor está dentro de un dynamic
 * import / lazy bundle: el browser intenta hacer jump al anchor ANTES
 * de que el componente monte en el DOM, y el scroll queda pegado donde
 * estaba en la página previa.
 *
 * Consumidores actuales:
 * - components/Sections.tsx → StepsSection (#como) y FAQSection (#faq)
 *
 * Posibles consumidores futuros:
 * - cualquier sección lazy-loaded que tenga `id` y reciba scroll via hash
 *
 * El setTimeout 100ms da tiempo a que el layout se estabilice post-mount
 * antes de scrollear — evita scrolleo a posición intermedia que luego
 * "salta" cuando el contenido lazy se expande.
 */
export function useScrollToHashOnMount(targetId: string): void {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== '#' + targetId) return
    const el = document.getElementById(targetId)
    if (!el) return
    const timeoutId = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [targetId])
}
