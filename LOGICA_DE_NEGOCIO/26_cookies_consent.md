# Proceso 26 — Cookie consent banner CCPA + GDPR (CHECKLIST §15.1)

## Descripción

PreEnvios.com usa cookies propias y de terceros (Google Analytics 4) para medir
cómo los usuarios interactúan con el comparador y mejorarlo. Este documento explica
**qué cookies usamos, por qué, y cómo se gestiona el consentimiento del usuario**
cumpliendo con CCPA (California) y GDPR (Unión Europea).

Implementado el **2026-04-23** como pre-requisito BLOQUEANTE del DNS cutover —
commit `d064dcc` (código) + commit de docs actual. Referencia legal:
`CHECKLIST_PRE_LANZAMIENTO.md §15.1`.

## Por qué existe

Antes de este banner, GA4 se cargaba automáticamente en cada pageview sin pedir
consentimiento. Esto viola:

- **CCPA (California Consumer Privacy Act):** un usuario californiano tiene
  derecho a opt-out de "venta de datos" — GA4 en modo default cuenta como eso.
  Multas: $2,500 por violación no intencional, $7,500 si es intencional.
- **GDPR (Regulación UE):** un usuario europeo debe dar consentimiento **activo**
  antes de que se carguen cookies de analytics. Multas: hasta €20M o 4% del
  revenue anual global.

Sin banner, PreEnvios estaba en violación desde el minuto 1 de tráfico. Ahora
cumple ambas regulaciones.

## Cookies que el sitio usa

### Categoría 1 — Necesarias (siempre activas, no desactivables)

| Cookie | Propósito | Duración |
|--------|-----------|----------|
| `NEXT_LOCALE` | Recuerda el idioma elegido (ES/EN) para que no tengas que volver a elegirlo al volver. | Sesión |
| `preenvios_corredor` | Recuerda el último país de destino que seleccionaste en el Comparador. | 30 días |
| `cc_cookie` | Guarda tu elección del banner de cookies (qué categorías aceptaste). | 6 meses |
| `admin_session` | Solo para el founder al iniciar sesión en `/admin`. NO la recibe un visitante normal. | 24h (al login) |

**Por qué no se pueden desactivar:** el sitio deja de funcionar correctamente sin
ellas (no recuerda idioma, muestra banner cada vez, admin no puede entrar). Son
funcionales, no de tracking.

### Categoría 2 — Analíticas (Google Analytics 4)

Si el usuario acepta esta categoría, GA4 escribe:

| Cookie | Propósito | Duración |
|--------|-----------|----------|
| `_ga` | Identificador de usuario anónimo (hash aleatorio, no PII). | 2 años |
| `_ga_<GA_ID>` | Estado de sesión actual (cuándo empezó, cuántas páginas vio). | 2 años |
| `_gid` | Identificador de sesión corto. | 24 horas |

**Para qué las usamos:** saber cuántas personas usan el comparador, qué páginas
ven, desde qué país, qué remesadoras hacen click, si encuentran lo que buscan.
**Todo agregado y anónimo** — Google no nos da nombres, emails, ni IPs completas.

**Si el usuario rechaza esta categoría:** GA4 se queda en "Consent Mode v2 denied"
— hace un ping sin cookies ni datos personales, contando solo el pageview como
número anónimo. Google usa eso para estimar tráfico total sin saber quién sos.

### Categoría 3 — Marketing (futuro, no activa hoy)

Pre-declarada en el banner pero **hoy no se escribe ninguna cookie de marketing**.
Está ahí para cuando PreEnvios active en el futuro:

- **Meta Pixel** — medir conversions de ads de Facebook/Instagram.
- **Google Ads conversion tracking** — saber qué clicks de Google Ads terminaron
  en click a remesadora afiliada.
- **Remarketing** — mostrar al usuario anuncios de PreEnvios en otros sitios si
  él ya visitó el comparador.

Cuando PreEnvios active algo de esto (probable en mes 2-3 post-lanzamiento), solo
los usuarios que aceptaron "Marketing" en el banner recibirán esas cookies. Los
demás verán la web igual pero sin tracking de ads.

## Cómo funciona técnicamente — Google Consent Mode v2

PreEnvios usa la **opción "Consent Mode v2"** (recomendación oficial de Google
desde 2024) en lugar de la opción simple "cargar o no cargar gtag". Diferencia:

### Opción B descartada (carga condicional)

```
Usuario llega → ¿aceptó GA? → SI: cargar gtag ahora.
                              NO: no cargar gtag nunca, cero medición.
```

**Problema:** perdés el 100% del tráfico que rechaza o nunca elige. Pre-cutover
esto puede ser 30-70% de usuarios — ceguera total para el founder.

### Opción A implementada (Consent Mode v2)

```
Usuario llega → gtag carga siempre con default: all denied (modo pingback)
           → banner aparece
           → ¿aceptó analytics? SI: gtag('consent','update',{analytics_storage:'granted'})
                                NO: se queda en denied (pingback sigue activo)
```

**Beneficio:** incluso si el usuario rechaza todo, GA4 sigue contando la visita
como número agregado anónimo (sin cookies, sin IP, sin personal data). Google
llama a esto "conversion modeling" — se infiere conversions con ML sobre datos
incompletos. El founder ve métricas aproximadas sin violar privacidad.

### Detalle técnico del layout

En `app/[locale]/layout.tsx`:

1. `<Script id="gtag-consent-default" strategy="beforeInteractive">` — **antes
   de que gtag/js cargue**, setea `gtag('consent','default',{ all denied,
   wait_for_update: 500 })`. El `wait_for_update` le dice a Google "espera
   500ms antes de enviar el primer ping — el banner puede cambiar el estado".

2. `<Script src="googletagmanager.com/gtag/js" strategy="afterInteractive">`
   — carga la librería de GA4.

3. `<Script id="gtag-init" strategy="afterInteractive">` — `gtag('config',
   GA_ID, { send_page_view: true })`.

4. `<CookieConsent />` (client component) — se monta dentro del
   `NextIntlClientProvider` y decide mostrar/no mostrar el banner según la
   cookie `cc_cookie`. Al elegir, llama `gtag('consent','update',...)` con
   las 4 signals de Google:

   | Signal | Categoría PreEnvios que lo controla |
   |--------|-------------------------------------|
   | `analytics_storage` | Analíticas |
   | `ad_storage` | Marketing |
   | `ad_user_data` | Marketing |
   | `ad_personalization` | Marketing |

## Flujo del usuario

### Primera visita (cookie `cc_cookie` no existe)

1. Usuario llega a `preenvios.com/es` (o cualquier ruta).
2. GA4 carga con consent default denied — hace pingback sin cookies.
3. Banner aparece **abajo fullwidth** con título *"Usamos cookies para mejorar
   tu experiencia"* y tres botones:
   - **"Aceptar todas"** — acepta las 3 categorías.
   - **"Rechazar todas"** — solo Necesarias activas; Analytics y Marketing rechazadas.
   - **"Personalizar"** — abre modal con 3 toggles independientes.
4. Usuario elige. La elección se guarda en `cc_cookie` por 6 meses.
5. GA4 recibe `consent.update` según la elección.
6. Banner desaparece.

### Visitas siguientes (cookie `cc_cookie` existe)

1. Usuario llega → banner **NO aparece** (ya eligió).
2. GA4 carga con consent según la elección guardada.
3. Todo funciona normal.

### Cambiar de opinión

Si el usuario quiere cambiar su elección (ej. aceptó todo y quiere rechazar),
tiene que:

- **Opción 1 (manual):** borrar la cookie `cc_cookie` de su browser → próxima
  visita muestra el banner de nuevo.
- **Opción 2 (TODO futuro):** link en el footer "Preferencias de cookies" que
  abra el modal de preferencias directamente. Hoy no está — se agrega como
  post-lanzamiento si hay demanda real.

## Bilingüe ES/EN

Textos definidos en:

- `messages/es.json` → clave `cookies.*`
- `messages/en.json` → clave `cookies.*`

Tono elegido: **directo, no legalés**. Ejemplo descripción:

> *Usamos cookies para mejorar tu experiencia. PreEnvios usa cookies propias y
> de Google Analytics para medir cómo se usa el comparador y mejorarlo. No
> vendemos tus datos a nadie. Tú eliges qué aceptar.*

Razón: público objetivo es mercado latino +35 que prefiere explicaciones claras
a jerga legal. Cumple igual GDPR/CCPA (no exigen wording específico, exigen
información clara y opción real de rechazo).

## Privacy policy consistency

La privacy policy (`/privacidad`) debe mencionar explícitamente:

- Cookies usadas (las 4 necesarias + las 3 analíticas + marketing a futuro).
- Que se pide consentimiento antes de cargar analytics.
- Email para request de borrado: `contact@preenvios.com`.
- Plazo de respuesta: 30 días (compatible con CCPA + GDPR).

Si en el futuro se agregan categorías nuevas (ej. Meta Pixel), actualizar
simultáneamente:

1. `components/CookieConsent.tsx` — agregar la category en `categories` + en
   `pushConsentUpdate` el mapeo a gtag signals si aplica.
2. `messages/*.json` — agregar textos descriptivos de la categoría nueva.
3. `/privacidad/content.tsx` — mencionar la cookie nueva.
4. Este documento — agregar la categoría en la tabla correspondiente.

## Cómo el founder puede ver el estado

### Ver si GA4 está disparando correctamente

1. **Chrome incógnito** → ir a `preenvios.vercel.app/es` (o producción
   post-cutover).
2. F12 → **Network** → filtro `collect`.
3. **Antes de aceptar:** ningún request `collect` aparece.
4. **Click "Aceptar todas":** inmediatamente aparece un request POST a
   `google-analytics.com/g/collect?...` — eso es el `page_view` + consent
   update.
5. **Click "Rechazar todas":** ningún request collect (modo denied).

### Ver estado de consent en vivo

En DevTools Console:

```js
dataLayer.filter(e => e[0] === 'consent')
```

Te devuelve los eventos de consent registrados — el primero es `default`
(denied todo), los siguientes son `update` con la elección del usuario.

### Ver qué cookies están escritas

DevTools → **Application** → **Cookies** → seleccionar `preenvios.vercel.app`.
Debe aparecer solo `cc_cookie` + `NEXT_LOCALE` + `preenvios_corredor` si el
usuario rechazó analytics. Si aceptó, además `_ga`, `_ga_G-6RBFS2812S`, `_gid`.

## Archivos relacionados

| Archivo | Qué hace |
|---------|----------|
| `components/CookieConsent.tsx` | Client component que inicializa vanilla-cookieconsent y dispara gtag consent updates |
| `app/[locale]/layout.tsx` | Scripts de Consent Mode v2 + monta `<CookieConsent />` dentro del NextIntlClientProvider |
| `messages/es.json`, `messages/en.json` | Textos bilingües bajo clave `cookies.*` |
| `types/global.d.ts` | Tipo `Window.gtag` permisivo para soportar los distintos signatures (event/config/consent/js) |
| `package.json` | Dependencia `vanilla-cookieconsent ^3.1.0` |

## Relacionados

- Proceso 05 — i18n SEO (cookie `NEXT_LOCALE`)
- Proceso 07 — Páginas legales (privacy policy `/privacidad`)
- `CHECKLIST_PRE_LANZAMIENTO.md §15` — Compliance legal bloqueante
- `CONTEXTO_FINAL.md` Fase 10 Bloque A — Endurecimiento seguridad
