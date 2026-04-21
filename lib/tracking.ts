/**
 * Tracking helper — single source of truth para eventos GA4.
 *
 * Reemplaza los 4 patrones distintos que conviven en el codebase actual:
 *   - `trackEvent()` local con `declare function gtag` en Comparador.tsx
 *   - `window.gtag` con cast `as any` en AlertaForm.tsx y Nav.tsx
 *   - `window.gtag` con cast `as unknown as { gtag: ... }` en contacto/content.tsx
 *
 * Los componentes deben importar `trackEvent` desde aqui y reemplazar sus
 * implementaciones locales cuando se refactoricen (Fase 1). El tipado de
 * window.gtag vive en types/global.d.ts.
 *
 * Eventos que actualmente usa el proyecto (inventario de Fase 0.3 audit):
 *   - cambio_corredor, cambio_metodo_entrega, inicio_uso, comparar_click,
 *     click_operador (Comparador)
 *   - suscripcion_free (AlertaForm)
 *   - cambio_idioma (Nav)
 *   - contacto_enviado (contacto/content.tsx)
 *
 * Al refactorizar cada componente, PRESERVAR el nombre exacto y params
 * del evento — son contratos con GA4 property que rompen los dashboards
 * si cambian.
 */

export type GTagParams = Record<string, unknown>

export function trackEvent(name: string, params: GTagParams = {}): void {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, params)
}
