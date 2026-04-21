# Checklist pre-lanzamiento — Preenvíos.com

Este documento se ejecuta DESPUÉS de completar todas las fases del backend y ANTES del cambio de DNS de GitHub Pages a Vercel. Es la revisión final de QA. Cada item se marca con [x] cuando se verifica que funciona correctamente. Si algo falla se documenta en TROUBLESHOOTING y se corrige antes de continuar.

URL de staging para todas las pruebas: https://preenvios.vercel.app

---

## 1. Landing principal

### 1.1 Desktop
- [ ] Landing carga en menos de 3 segundos
- [ ] Hero muestra "Envías dinero a Latinoamérica?" en español
- [ ] Cambio a inglés con botón EN muestra "Sending money to Latin America?"
- [ ] Tasa de referencia visible (ej: 1 USD = 59.64 DOP)
- [ ] Calculadora de la derecha funciona — escribir monto actualiza preview
- [ ] Botón "Comparar las mejores remesadoras" navega a resultados
- [ ] Strip de 7 logos de operadores visible
- [ ] Secciones "Por qué Preenvíos", "Cómo funciona", "FAQ" cargan contenido
- [ ] Footer con disclaimer #2 (institución no financiera) visible
- [ ] Footer con links a /terminos, /privacidad, /como-ganamos-dinero, /uso-de-marcas

### 1.2 Mobile
- [ ] Landing se ve bien en pantalla de celular (375px)
- [ ] Menú hamburguesa funciona
- [ ] Botón EN/ES funciona en mobile
- [ ] Calculadora accesible sin scroll horizontal

---

## 2. Comparador

### 2.1 Selector de país destino
- [ ] Dropdown muestra los 8 corredores (HN, DO, GT, SV, CO, MX, NI, HT)
- [ ] Buscar por código de moneda funciona (DOP → República Dominicana)
- [ ] Buscar por código de país funciona (HN → Honduras)
- [ ] Buscar por aliases funciona (paisa → Colombia, nica → Nicaragua, ayiti → Haití)
- [ ] Bandera del país se muestra correctamente

### 2.2 Monto
- [ ] Escribir monto actualiza resultados en tiempo real
- [ ] Monto mínimo $10 aceptado
- [ ] Monto máximo $10,000 aceptado
- [ ] No acepta negativos ni caracteres especiales

### 2.3 Selector de método de entrega
- [ ] 4 opciones visibles: Cuenta bancaria, Retiro en efectivo, Domicilio, Billetera móvil
- [ ] Default preseleccionado: Cuenta bancaria
- [ ] Badge POPULAR en método más usado
- [ ] Al cambiar método los resultados se filtran correctamente

### 2.4 Resultados
- [ ] Muestra las 7 tarjetas de operadores ordenadas por Preenvíos Score
- [ ] Badge "MEJOR OPCIÓN" en la tarjeta #1
- [ ] Badge "SEGUNDA OPCIÓN" en la tarjeta #2
- [ ] Cada tarjeta muestra: logo, nombre, estrellas, opiniones, tasa, fee, velocidad, monto recibido, Preenvíos Score
- [ ] Disclaimer #1 (tasas aproximadas) visible en cada tarjeta
- [ ] Disclaimer #3 (ranking influenciado) visible encima del listado
- [ ] Disclaimer #4 (FTC afiliados) visible cerca del botón "Enviar ahora"
- [ ] Botón "Enviar ahora" abre el link del operador en nueva pestaña
- [ ] Tracking de clics en "Enviar ahora" llega a GA4

---

## 3. Páginas legales

### 3.1 /terminos
- [ ] Página carga en ambos idiomas
- [ ] Disclaimer #2 aparece como primer párrafo
- [ ] Disclaimer #5 aparece como cláusula principal
- [ ] Menciona edad mínima 18 años
- [ ] Menciona jurisdicción Delaware

### 3.2 /privacidad
- [ ] Página carga en ambos idiomas
- [ ] Explica datos recolectados
- [ ] Explica uso de cookies
- [ ] Menciona Google Analytics
- [ ] Explica derecho a borrado (CCPA/GDPR)

### 3.3 /como-ganamos-dinero
- [ ] Disclaimer #4 como primer párrafo
- [ ] Explica Impact.com, CJ Affiliate, Partnerize
- [ ] Explica criterios del ranking

### 3.4 /metodologia
- [ ] Explica los 5 criterios del ranking con pesos
- [ ] Explica fuentes de datos (scrapers)
- [ ] Explica frecuencia de actualización

### 3.5 /uso-de-marcas
- [ ] Disclaimer #6 como contenido principal

---

## 4. Calculadora inversa /calculadora-inversa

- [ ] Página carga en ambos idiomas
- [ ] Selector de 7 corredores funciona (sin SV)
- [ ] Escribir monto en moneda local calcula cuánto USD se envió por cada operador
- [ ] Muestra quién dio peor tasa
- [ ] Botón compartir por WhatsApp con mensaje pre-escrito funciona

---

## 5. Panel admin /es/admin

- [ ] Login con ADMIN_EMAIL + ADMIN_PASSWORD funciona
- [ ] Cookie de sesión válida por 24 horas
- [ ] Tab Dashboard muestra monitor de scrapers
- [ ] Tab Dashboard muestra precios activos (debe ser 56)
- [ ] Tab Dashboard muestra 7 operadores
- [ ] Tab Dashboard muestra 8 corredores
- [ ] Botón "Ejecutar scrapers ahora" dispara la ejecución
- [ ] Tab Tasas permite editar tasa y fee inline
- [ ] Edición de tasa se guarda en Supabase
- [ ] Tab Ingresos muestra estructura (datos reales en Fase 3)
- [ ] Botón "Cerrar sesión" funciona

---

## 6. WhatsApp bot

- [ ] Número de WhatsApp configurado y aprobado (diferido — requiere cuenta Twilio)
- [ ] Bot responde al primer mensaje
- [ ] Detecta idioma del primer mensaje (es/en)
- [ ] Mantiene idioma consistente en la conversación
- [ ] Escribir "DOP" devuelve tasa actual + link afiliado
- [ ] Escribir "HNL" funciona para Honduras
- [ ] Escribir "GTQ" funciona para Guatemala
- [ ] Escribir "COP" funciona para Colombia
- [ ] Escribir "MXN" funciona para México
- [ ] Escribir texto no reconocido devuelve mensaje de ayuda

---

## 7. APIs

### 7.1 Públicas
- [ ] GET /api/precios?corredor=dominican_republic&metodo=bank → devuelve 7 operadores
- [ ] GET /api/precios?corredor=colombia&metodo=bank → devuelve 7 operadores
- [ ] GET /api/corredores → devuelve 8 corredores ordenados por prioridad
- [ ] Cache-Control headers presentes en las respuestas

### 7.2 Admin (requieren autenticación)
- [ ] GET /api/admin/dashboard → devuelve estado de scrapers
- [ ] PUT /api/admin/precios → actualiza tasa/fee en Supabase
- [ ] POST /api/admin/alertas → registra alerta manual
- [ ] GET /api/admin/ingresos → devuelve reporte placeholder
- [ ] Todas devuelven 401 sin cookie de sesión

### 7.3 Cron
- [ ] GET /api/scrape → ejecuta scrapers (protegido por CRON_SECRET)
- [ ] vercel.json tiene schedule "0 7 * * *"

### 7.4 🚨 Data sourcing y scrapers — BLOQUEANTE PARA LANZAMIENTO

**Sin resolver esto el producto es inviable:** si los scrapers de Remitly y/o Western Union fallan en producción y no tenemos fallback, la landing muestra resultados incompletos o tasas viejas → pérdida inmediata de credibilidad con la diáspora.

**Contexto:** hoy los 7 scrapers corren via Vercel Cron con fetch directo sin proxies. Los operadores con mayor riesgo de bloqueo (Remitly, Western Union) ya están marcados en el código. Ver [LOGICA_DE_NEGOCIO/08_scrapers.md](LOGICA_DE_NEGOCIO/08_scrapers.md) para la estrategia de 4 tiers.

**Checklist obligatorio antes del DNS cutover:**

- [ ] Correr los 7 scrapers manualmente vía `/api/scrape` y verificar que los 7 guardan precios válidos en Supabase (no 500s, no tasas cero)
- [ ] Revisar tabla `precios` en Supabase: cada operador × cada corredor MVP (HN, DO, GT, SV) debe tener filas con `actualizado_en` reciente y `tasa > 0`
- [ ] Dejar correr el cron 3-5 días antes del cutover para identificar scrapers inestables (el detector `reportScraperFailure` marca stale tras 3 fallos seguidos — revisar el panel admin para este estado)
- [ ] **Decidir para cada operador una de estas 3 rutas:**
  - ✅ **Funciona sin proxy** → dejarlo como está
  - 🟡 **Falla intermitente** → contratar Webshare ($3/mes) + agregar env `PROXY_URL` al scraper afectado. Ver sección 18 en [SERVICIOS_EXTERNOS_DETALLE.md](SERVICIOS_EXTERNOS_DETALLE.md)
  - ❌ **Falla consistente y sin feed de afiliado aprobado** → removerlo del sitio hasta resolver. No puede aparecer en el comparador con tasa vieja o tasa hardcoded
- [ ] Pipeline de afiliados con feeds de datos: cada red aprobada = 1 operador que deja de depender de scraping (Tier 3 → Tier 2). Prioridad: CJ (Xoom, Ria, WorldRemit, WU, MG) vía Payoneer → Impact (Remitly) → Partnerize (Wise). Verificar cuántos están aprobados el día del cutover y qué porcentaje del catálogo pasa por scraping puro
- [ ] Wise API pública (gratis, sin aprobación) está integrada como primary source para Wise, o documentar por qué todavía no

**Criterio de NO-GO:** si hay 2+ operadores MVP en estado "falla consistente sin feed ni workaround" el día del cutover, **no se activa el DNS**. Se corrige o se reduce el catálogo visible.

---

## 8. SEO y meta tags

- [ ] /es tiene hreflang="es" y alternate hreflang="en"
- [ ] /en tiene hreflang="en" y alternate hreflang="es"
- [ ] /sitemap.xml genera URLs en ambos idiomas
- [ ] /sitemap.xml incluye 5 páginas legales
- [ ] /robots.txt referencia sitemap.xml
- [ ] Title tag correcto: "PreEnvios.com — Compara remesadoras..."
- [ ] Meta description presente
- [ ] Cookie NEXT_LOCALE persiste idioma por 365 días

---

## 9. Google Analytics GA4

- [ ] Script de GA4 carga sin errores de consola (next/script afterInteractive)
- [ ] Evento inicio_uso se dispara al empezar a escribir monto
- [ ] Evento comparar_click se dispara al hacer clic en Comparar
- [ ] Evento click_operador se dispara al hacer clic en "Enviar ahora"
- [ ] Evento cambio_corredor se dispara al cambiar país
- [ ] Evento cambio_metodo_entrega se dispara al cambiar método de entrega
- [ ] Evento cambio_idioma se dispara al cambiar EN/ES
- [ ] GA4 Real-Time muestra actividad cuando navegas el sitio

---

## 10. Variables de entorno en Vercel

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] NEXT_PUBLIC_GA_ID configurada (G-6RBFS2812S)
- [ ] ADMIN_EMAIL configurada
- [ ] ADMIN_PASSWORD configurada
- [ ] CRON_SECRET configurada

---

## 11. Monitoring y observabilidad (cierre H-09.1 auditoría #01)

Plan completo en [AUDITORIA_DE_SEGURIDAD/monitoring.md](AUDITORIA_DE_SEGURIDAD/monitoring.md).

### 11.1 BetterStack — Fase 1 uptime (PAUSADA 2026-04-20, pendiente DNS cutover)

#### Estado completado
- [x] Signup en betterstack.com (plan free)
- [x] Team Members configurados en BetterStack: `aneurysoto@gmail.com` (personal) + `contact@preenvios.com`

#### Por qué está pausada — contexto del problema detectado
Durante la configuración inicial (2026-04-19) se crearon 4 monitores apuntando a `preenvios.com` pero se detectó que **no podían funcionar** porque el dominio todavía apunta a GitHub Pages (IPs `185.199.x.x` del MVP viejo), donde las rutas `/api/precios` y `/api/tasas-banco-central` no existen. Se intentó cambiar las URLs a `preenvios.vercel.app` pero BetterStack mantuvo internamente las URLs antiguas causando falsas alertas. **Los 4 monitores fueron eliminados** para evitar ruido en el canal de alertas.

La Fase 1 queda formalmente pausada hasta que el DNS de `preenvios.com` apunte a Vercel. No tiene sentido recrear los monitores con URLs temporales de `preenvios.vercel.app` porque BetterStack arrastra el problema histórico y además habría que recrearlos de nuevo al hacer el cutover.

#### 🚨 TAREA POST-DNS — recrear monitores desde cero
**Cuándo:** inmediatamente después de que `preenvios.com` apunte a Vercel y el HTTPS esté activo (típicamente 10-60 min tras cambiar los DNS records en Namecheap).

**Pasos (15-20 min total):**

1. [ ] Sign in en BetterStack → Monitors → **crear desde cero los 4 monitores** (no editar los eliminados — crear nuevos):
   - [ ] **Home:** `https://preenvios.com/` · HTTP status 2xx/3xx · intervalo 30s · SSL/TLS verification ✅
   - [ ] **Admin:** `https://preenvios.com/es/admin` · espera HTTP 200 (login form) · intervalo 30s · SSL/TLS verification ✅
   - [ ] **API precios:** `https://preenvios.com/api/precios?corredor=honduras&metodo=bank` · keyword match `"operador"` · intervalo 30s · SSL/TLS verification ✅
   - [ ] **API tasas banco central:** `https://preenvios.com/api/tasas-banco-central` · keyword match `"tasa"` · intervalo 30s · SSL/TLS verification ✅
2. [ ] Asignar los 4 monitores a los 2 team members (`aneurysoto@gmail.com` + `contact@preenvios.com`) como destinatarios de alertas
3. [ ] Umbral: 2 fallos consecutivos antes de alertar (default BetterStack)
4. [ ] **Smoke test:** pausar un monitor desde el dashboard → esperar 2-3 min → verificar que llega email a ambos inboxes (`contact@preenvios.com` y `aneurysoto@gmail.com`) → reactivar el monitor
5. [ ] Status Page → crear página pública:
   - [ ] Agregar los 4 monitores
   - [ ] Subdominio deseado: `status.preenvios.com`
   - [ ] BetterStack genera un valor CNAME (típicamente `statuspage.betteruptime.com` o similar)
6. [ ] Namecheap → Advanced DNS → agregar record tipo `CNAME`, host `status`, value = el que BetterStack proveyó
7. [ ] Esperar propagación DNS (~5-30 min) → verificar que `https://status.preenvios.com` carga la página pública

Con esto la Fase 1 queda completada y H-09.1 avanza a "pendiente solo Fase 2 Sentry" para cierre definitivo.

### 11.2 Sentry — Fase 2 error tracking (código listo 2026-04-20)
- [x] `@sentry/nextjs` instalado (commit `ba107e5`)
- [x] Config files creados en raíz del proyecto:
  - [x] `instrumentation.ts` (server Node/edge runtime hook)
  - [x] `instrumentation-client.ts` (client-side init)
  - [x] `sentry.server.config.ts` + `sentry.edge.config.ts`
- [x] `next.config.ts` wrapped con `withSentryConfig`
- [x] `.env.example` documenta las 5 vars Sentry
- [x] Build verificado: pasa sin DSN (SDK en no-op) y pasa con DSN configurado

**Pendiente de completar:**
- [ ] Signup en sentry.io (plan Developer Free)
- [ ] Crear proyecto Next.js en Sentry, copiar DSN
- [ ] Auth Token opcional para source map upload (Settings → Auth Tokens, scope `project:releases`)
- [ ] Configurar en Vercel → Environment Variables (los 3 entornos):
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - [ ] `SENTRY_DSN`
  - [ ] `SENTRY_ORG`
  - [ ] `SENTRY_PROJECT`
  - [ ] `SENTRY_AUTH_TOKEN` (opcional)
- [ ] Redeploy y verificar que el build sigue OK con las env vars seteadas
- [ ] Smoke test: trigger intencional de un error (ej. 500 en una ruta de testing) y verificar que aparece en Sentry dashboard con stack trace

### 11.3 Cierre de H-09.1
H-09.1 pasa de 🟡 EN PROCESO a 🟢 CERRADO cuando:
- [ ] BetterStack: los 4 monitores activos apuntan a `preenvios.com`, status page pública activa, smoke test confirmado
- [ ] Sentry: DSN configurado en Vercel, build en producción, error de prueba visible en dashboard

---

## 12. Pre-DNS checklist final

- [ ] Todas las secciones anteriores marcadas con [x]
- [ ] No hay errores en la consola del navegador
- [ ] Vercel deploy muestra "Ready" en verde
- [ ] Supabase proyecto activo (no pausado)
- [ ] El MVP en preenvios.com sigue funcionando en GitHub Pages
- [ ] Se tiene acceso al panel DNS de Namecheap
- [ ] Se conocen los registros DNS que se van a cambiar (A record + CNAME www)

---

## Después del cambio de DNS

- [ ] preenvios.com carga el sitio Next.js (no el MVP viejo)
- [ ] HTTPS funciona correctamente
- [ ] Redirect de www a sin-www funciona (o viceversa)
- [ ] GA4 sigue midiendo en el nuevo dominio
- [ ] Todos los links de afiliado siguen funcionando
- [ ] El MVP viejo (index.html) se archiva o elimina del repo
