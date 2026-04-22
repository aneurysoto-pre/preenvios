/**
 * Tracking helper — single source of truth para eventos GA4.
 *
 * Reemplaza los 4 patrones distintos que conviven en el codebase actual:
 *   - `trackEvent()` local con `declare function gtag` en Comparador.tsx
 *   - `window.gtag` con cast `as any` en Nav.tsx
 *   - `window.gtag` con cast `as unknown as { gtag: ... }` en contacto/content.tsx
 *
 * Los componentes deben importar `trackEvent` desde aqui y reemplazar sus
 * implementaciones locales cuando se refactoricen (Fase 1). El tipado de
 * window.gtag vive en types/global.d.ts.
 *
 * Eventos que actualmente usa el proyecto (inventario actualizado 2026-04-22):
 *   - cambio_corredor, inicio_uso, comparar_click, click_operador (Comparador)
 *   - cambio_idioma (Nav)
 *   - contacto_enviado (app/[locale]/contacto/content.tsx — con params
 *     `asunto` + `idioma` para segmentar el embudo en GA4)
 *   - suscripcion_alertas (app/[locale]/alertas/content.tsx — con param
 *     `idioma` para comparar adopción ES vs EN)
 *   - scraper_anomaly (lib/scrapers/validator.ts → Sentry captureMessage,
 *     no gtag — ver LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md)
 *
 * PRESERVAR el nombre exacto y params de cada evento — son contratos
 * con GA4 property que rompen los dashboards si cambian.
 */

export type GTagParams = Record<string, unknown>

export function trackEvent(name: string, params: GTagParams = {}): void {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, params)
}
