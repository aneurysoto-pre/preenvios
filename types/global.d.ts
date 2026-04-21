/**
 * Global type augmentations.
 *
 * Agrega typings para APIs del browser inyectadas en runtime que no tienen
 * declaraciones nativas:
 * - Window.gtag: Google Analytics 4 via gtag.js (se carga en layout.tsx
 *   desde <Script src="...googletagmanager.com/gtag/js?id=...">). Sin esta
 *   declaracion TypeScript marca error al llamar window.gtag() en los
 *   componentes que trackean eventos (Comparador, Nav,
 *   contacto/content.tsx).
 * - Window.dataLayer: array que gtag usa internamente para eventos. No se
 *   usa directamente en el codigo del proyecto pero se declara por
 *   completitud — si en el futuro queremos push eventos custom al
 *   dataLayer, no hara falta retype.
 *
 * El helper tipado vive en lib/tracking.ts — los componentes deben usar
 * ese helper, no window.gtag directo. Esta declaracion global existe para
 * que el helper pueda usar window.gtag sin `as any`.
 */

export {}

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}
