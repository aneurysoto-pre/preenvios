# 28 — GA4 smoke test end-to-end (tabla de check)

**Propósito:** verificar que todos los eventos custom de GA4 disparan correctamente en producción. Se corre:

- Después de cambios en `lib/tracking.ts` o en cualquier archivo que llame `trackEvent()`
- Después de cambios en env vars de Vercel (`NEXT_PUBLIC_GA_ID`)
- Después de cambios en `app/[locale]/layout.tsx` donde viven los `<Script>` de gtag
- Post-DNS cutover (por si el dominio nuevo rompió algo)
- Cada 30-60 días como rutina preventiva

**Status al 2026-04-22:** 8 señales de GA4 confirmadas en el stack (6 custom + 2 automáticas).

---

## Pre-requisitos

- Env var `NEXT_PUBLIC_GA_ID=G-6RBFS2812S` seteada en Vercel (Production + Preview + Development)
- Chrome o Firefox **sin ad blocker / sin "Prevent Cross-Site Tracking" activo** (iOS Safari por default bloquea gtag)
- Acceso al dashboard GA4 (el founder tiene login)

## Setup (antes de empezar)

1. Abrir https://analytics.google.com → propiedad PreEnvios → sidebar **Reports → Realtime**
2. En el panel de Realtime, buscar el widget **"Event count by Event name"** (típicamente 2do o 3er widget hacia abajo)
3. En otra pestaña: abrir **https://preenvios.vercel.app/es** (o `preenvios.com/es` post-DNS cutover)
4. Tener DevTools abierto en la pestaña del sitio → Network tab → filtro `collect` — permite ver cada request a Google Analytics cuando dispara un evento (confirmación a nivel de red)

---

## Las 8 acciones — tabla de check

**Delay esperado:** cada evento aparece en Realtime en **10-30 segundos** después de la acción. No es instantáneo. Si no aparece en 60 seg → problema.

| # | Acción en el sitio | Evento esperado | Dónde vive en código | Notas |
|---|---|---|---|---|
| 1 | Entrar a `/es` (o `/en`) | `page_view` | Automático (layout.tsx `send_page_view: true`) | Si este NO aparece, **nada** va a aparecer — env var GA vacía o Script no carga |
| 2 | Comparador → cambiar país destino (ej. Honduras → México) | `cambio_corredor` | [components/Comparador.tsx:152](../components/Comparador.tsx#L152) | Params: `corredor`, `segundos` |
| 3 | Comparador → escribir monto en input (ej. "500") | `inicio_uso` | [components/Comparador.tsx:159](../components/Comparador.tsx#L159) | **Solo primera vez** por sesión — si ya escribiste antes, no dispara de nuevo. Para re-disparar, ventana incógnito |
| 4 | Comparador → click botón "Comparar" | `comparar_click` | [components/Comparador.tsx:168](../components/Comparador.tsx#L168) | Params: `monto`, `corredor`, `metodo`, `segundos_hasta_comparar` |
| 5 | En resultados, click "Enviar ahora" en cualquier operador | `click_operador` | [components/Comparador.tsx:196](../components/Comparador.tsx#L196) | Params: `event_label` (nombre operador), `corredor`, `monto`, `posicion` |
| 6 | Nav → click toggle idioma (ES → EN) | `cambio_idioma` | [components/Nav.tsx:101](../components/Nav.tsx#L101) | Params: `idioma_anterior`, `idioma_nuevo` |
| 7 | Ir a `/es/alertas` → escribir email + click "Suscribirme" | `suscripcion_alertas` | [app/[locale]/alertas/content.tsx](../app/%5Blocale%5D/alertas/content.tsx) | Dispara solo si el POST al `/api/alertas` devuelve 200. Params form legacy: `idioma`. Desde el landing editorial por país (Honduras+, Commit 8+ del port 2026-04-24), el evento incluye además `corredor` + `location` ('hero' \| 'cta_final') para segmentar qué form duplicado convierte mejor |
| 8 | Ir a `/es/contacto` → llenar form + click "Enviar mensaje" | `contacto_enviado` | [app/[locale]/contacto/content.tsx](../app/%5Blocale%5D/contacto/content.tsx) | Dispara solo si el POST a `/api/contactos` devuelve 200. Params: `asunto`, `idioma` |

**Automáticos extra que también deberías ver** (sin acción específica):
- `session_start` (una vez al entrar)
- `first_visit` (solo si es primera vez desde ese device/browser)
- `scroll` (tras hacer scroll del 90% de la página)

## Resultado esperado en el widget "Event count by Event name"

Después de ejecutar las 8 acciones en orden (≈3-4 min total), deberías ver algo así:

```
Event name             Events
page_view              3+
click_operador         1
comparar_click         1
cambio_corredor        1
cambio_idioma          1
contacto_enviado       1
suscripcion_alertas    1
inicio_uso             1
session_start          1
first_visit            1
scroll                 1+
```

**Los 6 custom + `page_view` deben aparecer.** Si falta alguno, ir a la sección Troubleshooting.

---

## Troubleshooting

### 🎯 Síntoma 1 — Nada aparece (ni siquiera `page_view`)

**Causas más probables:**

1. **`NEXT_PUBLIC_GA_ID` vacía o mal seteada en Vercel.**
   - Verificar en Vercel → Project Settings → Environment Variables que existe en los 3 entornos (Production, Preview, Development).
   - Valor correcto: `G-6RBFS2812S` (confirmado 2026-04-22).
   - Si la cambiaste recientemente, **redeploy** — env vars nuevas NO toman efecto hasta el próximo build.

2. **Ad blocker activo.**
   - uBlock Origin, AdBlock Plus, Brave Shield, Firefox Enhanced Tracking Protection (strict mode) → bloquean `googletagmanager.com`.
   - Probar en Chrome Incógnito sin extensiones.

3. **iOS Safari "Prevent Cross-Site Tracking".**
   - Safari iPhone → Settings → Safari → "Prevent Cross-Site Tracking" ON = bloquea gtag.
   - Para testear desde iPhone: temporalmente desactivar, o usar otro browser (Chrome iOS respeta esta config también).

4. **`<Script>` de gtag no carga por error de red.**
   - DevTools → Network tab → buscar request a `googletagmanager.com/gtag/js`. Si status 0 / cancelled / 404 → problema.

### 🎯 Síntoma 2 — `page_view` aparece pero algún evento custom no

**Causas más probables por evento:**

- **`cambio_corredor` no aparece:** refactor reciente de `Comparador.tsx` rompió el import de `trackEvent` desde `@/lib/tracking`. Verificar import al tope del archivo.

- **`inicio_uso` no aparece:** es **solo primera vez por sesión** — abrir ventana incógnito, entrar a `/es`, escribir el monto de cero. Si ahí tampoco aparece, hay bug.

- **`comparar_click` no aparece:** el botón puede estar llamando otra función. Verificar `onClick` del botón Comparar en `components/Comparador.tsx`.

- **`click_operador` no aparece:** el handler está en los `<a target="_blank">` de los cards de resultados. Si no dispara, revisar [components/Comparador.tsx:196-204](../components/Comparador.tsx#L196-204) — `onClick={() => onOperadorClick(p, i)}` debe existir en el `<a>`.

- **`cambio_idioma` no aparece:** el toggle ES/EN está en `Nav.tsx`. Verificar que `switchLocale()` llama a `trackEvent('cambio_idioma', ...)` antes del `router.push(...)`.

- **`suscripcion_alertas` no aparece:**
  - El evento dispara solo si `res.status === 200`. Si el backend devuelve 429 (rate limit) o 500 (db error), NO dispara.
  - Usar emails distintos cada vez (constraint UNIQUE en tabla alertas_email — segundo submit con mismo email devuelve 200 silent pero el evento SÍ se emite, es el primero el que deduplica).
  - Si rate limit (3 suscripciones / 1h / IP): esperar 1h o cambiar IP (VPN / móvil).

- **`contacto_enviado` no aparece:**
  - Mismo patrón: solo si status 200 del POST. Rate limit 3/h/IP también aplica.
  - Si hay error de validación zod (ej. mensaje < 10 chars) el POST devuelve 400, evento NO dispara.

### 🎯 Síntoma 3 — Eventos aparecen pero los params están vacíos

- GA4 tiene custom dimensions que requieren registrarse en Admin → Custom Definitions. Si ves el evento con params `(not set)` → el param no está mapeado como Custom Dimension.
- Solución: ir a GA4 → Admin → Custom Definitions → Create custom dimension → scope "Event" → event parameter name exacto (ej. `corredor`, `monto`, `asunto`). Tarda 24-48h en empezar a mostrar data.

### 🎯 Síntoma 4 — Eventos aparecen en Realtime pero no en los reportes estándar

- **Normal.** Los reportes estándar de GA4 tienen delay de 24-48h. Realtime es el único que ve en segundos.
- Si después de 48h el evento todavía no aparece en Reports → Engagement → Events, entonces sí hay problema.

---

## Qué cambiar si este doc queda obsoleto

- Si **se agrega** un evento nuevo: agregar fila a la tabla + su archivo/línea
- Si **se renombra** un evento: preservar el nombre viejo en un row separado marcado "legacy" por 30 días para que GA4 dashboards viejos no se rompan
- Si **se elimina** un evento: mover a sección "Históricos removidos" con fecha y razón

**Última actualización:** 2026-04-24 (contrato de `suscripcion_alertas` extendido — desde el landing editorial por país el evento incluye `corredor` + `location`. El form legacy de `/es/alertas` sigue enviando solo `idioma`, sin cambios). 2026-04-22 (agregado `suscripcion_alertas` + `contacto_enviado` en el commit `6bdce58`).
