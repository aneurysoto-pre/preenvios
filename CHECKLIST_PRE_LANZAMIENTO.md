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
- [ ] Dropdown muestra los 6 corredores MVP (HN, DO, GT, SV, CO, MX)
- [ ] Buscar por código de moneda funciona (DOP → República Dominicana)
- [ ] Buscar por código de país funciona (HN → Honduras)
- [ ] Buscar por aliases funciona (paisa → Colombia, catracho → Honduras)
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

> **⚠️ ESTADO AL 2026-04-23 — LOS 7 SCRAPERS ESTÁN ROTOS.**
> Confirmado con run manual el 2026-04-23: todos fallan al primer byte (2× HTTP 401, 4× HTTP 404, 1× HTTP 403). Decisión tomada: diferir arreglo hasta post-LLC + aprobación programas de afiliados. Detalle completo en [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md) y resumen upfront en [SCRAPERS_IMPORTANTE.md](SCRAPERS_IMPORTANTE.md) en la raíz. Los checkboxes de esta sección 7.4 QUEDAN pendientes, pero su ruta de completado cambió — no se intenta arreglar con proxies antes del cutover, se completa con partner APIs post-LLC.

**Sin resolver esto el producto es inviable:** si los scrapers de Remitly y/o Western Union fallan en producción y no tenemos fallback, la landing muestra resultados incompletos o tasas viejas → pérdida inmediata de credibilidad con la diáspora.

**Contexto (histórico, pre-2026-04-17):** los 7 scrapers corrían via Vercel Cron con fetch directo sin proxies. Los operadores con mayor riesgo de bloqueo (Remitly, Western Union) ya estaban marcados en el código. Ver [LOGICA_DE_NEGOCIO/08_scrapers.md](LOGICA_DE_NEGOCIO/08_scrapers.md) para la estrategia de 4 tiers original. **Desde el 2026-04-17 ninguno funciona en prod — ver Proceso 28.**

**Checklist obligatorio antes del DNS cutover (actualizado 2026-04-23):**

- [ ] **BLOQUEANTE NUEVO:** revisar el estado de scrapers documentado en [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md). No avanzar con el cutover sin decidir el escenario A/B/C del siguiente item.
- [ ] **Validar supuestos del plan de reactivación (~1h de lectura web, sin código):** confirmar con la documentación oficial de Impact.com, CJ Affiliate, Partnerize y FlexOffers qué tipo de data entrega cada programa para los 7 operadores MVP (Remitly, Wise, Xoom, Ria, WorldRemit, Western Union, MoneyGram). Responder por programa: (a) ¿entregan deep links solos / feeds de productos / pricing API / combos?; (b) ¿cuál es el criterio mínimo de aprobación — tráfico, dominio activo, contenido relevante, tiempo en el nicho? Documentar resultados en la sección "Validación de supuestos" del Proceso 28. Esto cierra el agujero de "el plan R2 asume que partner APIs dan pricing — puede que solo den trackers, en cuyo caso hay que replanear".
- [ ] **Decisión explícita de go/no-go el día del cutover — 3 escenarios posibles:**
  - **Escenario A (deseable):** Fase R1 ejecutada (Wise API oficial, 1/7 operador funcional) + Fase R2 parcial (al menos 2 partners más aprobados y con API integrada) → lanzar con 3/7 operadores reales + 4/7 con banner "tasa manual, actualizada diariamente". Catálogo visible reducido si es necesario.
  - **Escenario B (pausar cutover):** menos de 3/7 operadores con data real + sin plan inminente de obtener más → NO activar DNS. Re-agendar cutover. Enfocar esfuerzo en conseguir afiliaciones o ejecutar Fase R3 (reverse-engineer + proxy) como puente.
  - **Escenario C (lanzar con banner):** decisión estratégica del founder de lanzar igual con data manual + banner de transparencia "tasas actualizadas diariamente por el equipo editorial". Requiere commit con banner visible y proceso claro de actualización manual.
- [ ] Si se elige Escenario A o C: banner/disclaimer visible en landing indicando frequency de actualización
- [ ] Correr los 7 scrapers manualmente vía `/api/scrape` **el día antes del cutover** para confirmar el estado real (puede haber cambiado desde la última revisión documentada)
- [ ] Revisar tabla `precios` en Supabase: cada operador × cada corredor MVP debe tener filas con `actualizado_en` reciente y `tasa > 0`, o estar explícitamente removido del comparador
- [ ] Wise API pública integrada — es el único que puede activarse sin LLC ni afiliación (ver Proceso 28 Fase R1)

**Criterio de NO-GO (revisado 2026-04-23):** si ninguno de los escenarios A/B/C se cumple claramente el día previsto del cutover, **pausar el cutover** hasta que la situación sea clara. No lanzar con data rota ni con `saved=0` silencioso.

### 7.5 🚨 Validador de ingress en scrapers — BLOQUEANTE PARA LANZAMIENTO

**Sin esto el producto es inviable:** si un scraper empieza a devolver data basura en producción (ej. tasa 50 DOP cuando debería ser 60.50), los usuarios la ven inmediatamente en el comparador. Confianza perdida en segundos.

**Es falla de arquitectura, no de monitoreo.** La solución no es detectarlo después, sino que data inválida **nunca entre a la DB**. Parte de la Fase 7 — Sistema de defensa en profundidad (ver [CONTEXTO_FINAL.md](CONTEXTO_FINAL.md)).

**Checklist obligatorio antes del DNS cutover:**

- [x] Implementar función `validatePrice(price)` en `lib/scrapers/validator.ts`, integrada en `savePrices()` dentro de `lib/scrapers/base.ts` (completado 2026-04-22)
- [x] Validaciones (7 reglas):
  - [x] Tasa dentro de ±10% de la tasa del banco central (fuente: tabla `tasas_bancos_centrales` cacheada por batch + fallbacks hardcoded; tolerancia 0 para El Salvador USD)
  - [x] Fee en rango [0, 50] USD
  - [x] Velocidad en enum permitido (`Segundos`, `Minutos`, `Horas`, `Días`)
  - [x] Operador en whitelist de 7 MVP
  - [x] Corredor en whitelist de 6 MVP (HN, DO, GT, SV, CO, MX)
  - [x] Método de entrega en enum (`bank`, `cash_pickup`, `home_delivery`, `mobile_wallet`)
  - [x] Tasa > 0 (defensivo)
- [x] Si falla validación → no guardar + Sentry capture con tag `scraper_anomaly` + log en nueva tabla `scraper_anomalies` (migración 007 — completada 2026-04-22)
- [x] Si mismo (operador, corredor) acumula 3 anomalías consecutivas en la última hora → `reportScraperFailure` marca precios stale (patrón serverless-safe vía query a `scraper_anomalies`, no contador in-memory)
- [ ] **Pendiente acción usuario:** ejecutar `supabase/migrations/007_scraper_anomalies.sql` en Supabase SQL Editor
- [ ] **Pendiente smoke test:** introducir manualmente una tasa fuera de rango en un scraper, verificar que se rechaza y se loguea (ver procedimiento en `LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md` § "Smoke test manual")
- [ ] **Pendiente ventana observación:** el validador debe correr en producción ≥48 hrs antes del cutover confirmando que no genera falsos positivos con data real

**Criterio de NO-GO:** sin el validador implementado y testeado, **no se activa el DNS**. Cualquier scraper bajo condiciones adversas puede envenenar el comparador público.

**Implementación estimada:** 2-4 hrs de trabajo (Claude Code + supervisión founder). No es trabajo arquitectónico pesado — es una función de validación con tabla de bounds, rejection + logging.

**Referencia completa:**
- Arquitectura: [CONTEXTO_FINAL.md § Fase 7 — Agente 1](CONTEXTO_FINAL.md)
- Contexto de scrapers: [LOGICA_DE_NEGOCIO/08_scrapers.md](LOGICA_DE_NEGOCIO/08_scrapers.md)

---

## 8. SEO y meta tags

**Completado 2026-04-22 (commits `80990fb`, `367b3b3`, `8523e85`, `6bdce58`):**

- [x] `/es` tiene `hreflang="es"` y `alternate hreflang="en"` — configurado via `generateMetadata.alternates.languages` en cada page.tsx
- [x] `/en` tiene `hreflang="en"` y `alternate hreflang="es"`
- [x] `/sitemap.xml` genera URLs en ambos idiomas (ver `app/sitemap.ts`)
- [x] `/sitemap.xml` incluye las 6 páginas legales (terminos, privacidad, como-ganamos-dinero, metodologia, uso-de-marcas, disclaimers)
- [x] `/robots.txt` referencia sitemap.xml
- [x] Title tags bilingües por página — 19/19 páginas con `generateMetadata` (home + 6 legales + 6 corredores + 10 wiki + 3 blog + alertas + contacto + nosotros + operadores + calculadora). `/admin` marcado `noindex, nofollow` intencional.
- [x] Meta description presente en todas las páginas (155-175 chars cada una, bilingüe)
- [x] JSON-LD Schema.org inline en 11 páginas — home tiene `@graph` con `WebSite + SearchAction + Organization + FAQPage`; resto tiene schemas específicos (AboutPage, ContactPage, WebApplication, Blog, CollectionPage, Article, etc.)
- [x] `Organization` entity canonical con `@id` único reutilizado en 4 páginas → Google consolida la marca
- [x] Favicon pack completo (`favicon.ico`, 16x16, 32x32, 180x180 apple-touch-icon, 192x192 + 512x512 Android) — diseño con Montserrat, commit `316a6ef`. Reemplaza al generado dinámicamente con system-ui.
- [x] `app/manifest.ts` apunta a los iconos estáticos
- [x] Cookie `NEXT_LOCALE` persiste idioma por 365 días (ya estaba desde refactor Fase 1)

**Pendiente post-DNS cutover:**
- [ ] Validar con Google Rich Results Test (https://search.google.com/test/rich-results) — debería mostrar WebSite + Organization + FAQPage válidos sin warnings
- [ ] Submit sitemap en Google Search Console tras DNS cutover

**Tech debt no bloqueante:**
- `/blog/[slug]` sigue como ruta `ƒ Dynamic` por faltarle `generateStaticParams()`. Conversión a SSG es 1 línea pero fuera de scope del bullet SEO. Ver BACKLOG_POST_REFACTOR § 2.

---

## 9. Google Analytics GA4

Inventario de eventos custom (actualizado 2026-04-22 — ver `lib/tracking.ts` + `TROUBLESHOOTING/28_ga4_smoke_test.md` para tabla de smoke test).

- [x] Script de GA4 carga sin errores de consola (next/script afterInteractive) — confirmado en producción
- [x] Evento `click_operador` se dispara al hacer clic en "Enviar ahora" (validado con screenshot del dashboard, 2026-04-21)
- [x] Evento `inicio_uso` se dispara al empezar a escribir monto (validado 2026-04-22)
- [x] Evento `comparar_click` se dispara al hacer clic en Comparar (validado 2026-04-22)
- [x] Evento `cambio_corredor` se dispara al cambiar país (validado 2026-04-22)
- [x] Evento `cambio_idioma` se dispara al cambiar EN/ES (validado 2026-04-22)
- [x] Evento `contacto_enviado` (NUEVO 2026-04-22 commit `6bdce58`) se dispara al submit exitoso del form de contacto (validado 2026-04-22)
- [x] Evento `suscripcion_alertas` (NUEVO 2026-04-22 commit `6bdce58`) se dispara al submit exitoso del form de alertas (validado 2026-04-22)
- [x] GA4 Real-Time muestra actividad cuando navegas el sitio — smoke test de `TROUBLESHOOTING/28_ga4_smoke_test.md` ejecutado y los 8 eventos aparecen en el widget "Event count by Event name" (validado 2026-04-22 por founder)

**Removido del checklist (evento obsoleto):** `cambio_metodo_entrega` nunca se implementó en producto porque todos los scrapers producen `metodo_entrega: 'bank'` — no hay selector en UI, no hay evento.

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

**Activación completada 2026-04-22:**
- [x] Signup en sentry.io (plan Developer Free) — proyecto `javascript-nextjs`
- [x] Crear proyecto Next.js en Sentry, copiar DSN
- [x] Auth Token generado para source map upload (scope `project:releases`)
- [x] Configurar en Vercel → Environment Variables (los 3 entornos):
  - [x] `NEXT_PUBLIC_SENTRY_DSN`
  - [x] `SENTRY_DSN`
  - [x] `SENTRY_ORG`
  - [x] `SENTRY_PROJECT`
  - [x] `SENTRY_AUTH_TOKEN`
- [x] Redeploy con las env vars seteadas (status Ready)
- [x] Smoke test end-to-end 2026-04-22 17:33 UTC — endpoint temporal `/api/sentry-test` disparó 2 eventos (Error Unhandled + `scraper_anomaly` tag) que aparecieron en el dashboard Sentry en <30s. Endpoint eliminado después (commits `be65b1a` + `7e3beac`).

### 11.3 Cierre de H-09.1
H-09.1 pasa de 🟡 EN PROCESO a 🟢 CERRADO cuando:
- [ ] BetterStack: los 4 monitores activos apuntan a `preenvios.com`, status page pública activa, smoke test confirmado
- [x] Sentry: DSN configurado en Vercel, build en producción, error de prueba visible en dashboard (completado 2026-04-22)

---

## 12. Expansión de catálogo (Fase 8 del CONTEXTO_FINAL)

Detalle completo en [CONTEXTO_FINAL.md § Fase 8](CONTEXTO_FINAL.md). Trabajo pre-lanzamiento aprovechando que la fecha es flexible:

### 12.1 México y Colombia al catálogo MVP
- [x] Scrapers Remitly/Wise/Xoom/Ria/WorldRemit/WU/MG ya incluyen `corredor=mexico` y `corredor=colombia` en su array CORREDORES (completado 2026-04-21 — validación de data real se hace en § 12.1.smoke tras primer cron)
- [x] Agregado al array `CORREDORES` de `components/Comparador.tsx` con aliases (paisa, chilango, azteca) (completado 2026-04-21)
- [x] Agregado a `PAISES_MVP` en `lib/paises.ts` — propaga auto a Nav dropdown, TasasReferencia, páginas editoriales dinámicas, sitemap, operadores (completado 2026-04-21)
- [x] Agregado a calculadora inversa (completado 2026-04-21)
- [x] Página editorial `/es/mexico` + `/en/mexico` — generada automáticamente vía `app/[locale]/[pais]/page.tsx` + `generateStaticParams` con PAISES_MVP (completado 2026-04-21)
- [x] Página editorial `/es/colombia` + `/en/colombia` — mismo mecanismo (completado 2026-04-21)
- [x] TasasReferencia grid ajustado de 4 a 3 columnas lg (2 filas de 3 para las 6 tarjetas) (completado 2026-04-21)
- [x] Traducciones ES/EN de FAQ q3, q5 y misión (completado 2026-04-21)
- [ ] **Acción manual del usuario**: ejecutar migración SQL 006 en Supabase SQL Editor → `supabase/migrations/006_mexico_colombia_mvp.sql`. Agrega los 2 corredores a `corredores`, las tasas Banxico/Banrep a `tasas_bancos_centrales` y 14 filas de precios iniciales. Idempotente. Si ya se corrieron los seeds `seed-new-corridors.mjs` y `seed-bancos-centrales.mjs` sigue siendo seguro ejecutarlo
- [ ] Bounds de MX/CO en validador ingress (Agente 1) — COP ±10% de 4150, MXN ±10% de 17.15. Se agrega cuando el Agente 1 esté implementado
- [ ] Smoke test del flujo completo en ambos corredores (§ 13 abajo)

### 12.2 Wise API pública (Tier 4 data source)
- [ ] Integrar `api.wise.com/v1/rates` como fuente primaria para operador Wise (gratis, sin aprobación)
- [ ] Mantener scraper Wise como fallback si API falla

### 12.3 Email deliverability
- [ ] Verificar dominio `preenvios.com` en Resend (TXT, DKIM, SPF en Namecheap)
- [ ] Configurar DMARC `p=none` inicial (elevar a `p=quarantine` tras 2 semanas)
- [ ] Smoke test: suscribirse con email propio → confirmar llega desde `alertas@preenvios.com` y NO cae en spam

---

## 13. Smoke test formal pre-cutover (30-45 min)

Protocolo obligatorio antes de activar el DNS. Correr desde desktop + mobile real, en navegador incógnito.

### 13.1 Landing principal (10 min)
- [ ] `preenvios.vercel.app/es` carga en <3 seg
- [ ] Default Honduras preseleccionado en calculadora del hero
- [ ] Escribir $400 → click "Comparar" → aparecen 7 remesadoras con tasas reales
- [ ] Click "Enviar ahora" del primer resultado → abre link afiliado en nueva pestaña
- [ ] Cambiar país Honduras → RD → Guatemala → El Salvador → Colombia → México → resultados cambian sin errores
- [ ] Click "English" → toda la página se traduce → click "Español" → vuelve

### 13.2 Páginas de país (5 min)
- [ ] `/es/honduras` carga completo
- [ ] `/es/republica-dominicana` carga completo
- [ ] `/es/guatemala` carga completo
- [ ] `/es/el-salvador` carga completo
- [ ] `/es/mexico` carga con default corredor México preseleccionado y 7 remesadoras en resultados
- [ ] `/es/colombia` carga con default corredor Colombia preseleccionado y 7 remesadoras en resultados

### 13.3 Calculadora inversa y operadores (5 min)
- [ ] `/es/calculadora-inversa` — escribir 12000 DOP → ver resultados → botón WhatsApp abre wa.me con mensaje correcto
- [ ] `/es/operadores/remitly` — carga, botón azul CTA final muestra texto visible
- [ ] `/es/tasa/usd-hnl` — gráfica de 30 días carga con datos

### 13.4 Formularios (10 min)
- [ ] `/es/contacto` — llenar y enviar mensaje de prueba → "¡Recibimos tu mensaje!"
- [ ] Suscribite a alertas con email propio → recibís email en <2 min → click link → "Suscripción confirmada"
- [ ] Chequear inbox Zoho (`contact@preenvios.com`) → ves el mensaje del formulario
- [ ] Si Fase 8 hecha: email de confirmación viene de `alertas@preenvios.com` (no de `resend.dev`)

### 13.5 Admin panel (5 min)
- [ ] `/es/admin` login correcto → entra al dashboard
- [ ] 6 intentos con password mala desde misma IP → el 6to muestra "Demasiados intentos" con countdown (rate limit)
- [ ] Logout → vuelve a pedir login

### 13.6 Legal y navegación (3 min)
- [ ] `/es/terminos`, `/es/privacidad`, `/es/disclaimers` cargan
- [ ] Footer → click "Preguntas" → scrollea al FAQ
- [ ] Footer → click "Cómo funciona" → scrollea a la sección
- [ ] Nav superior en mobile (hamburguesa) funciona

### 13.7 Mobile real (5 min en tu celular)
- [ ] Landing en iPhone/Android: hero, calc, banners, footer todos visibles y legibles
- [ ] Comparador funciona: escribir monto, click Comparar, ver resultados
- [ ] Primer resultado visible después del scroll automático

### 13.8 404 y edge cases (1 min)
- [ ] `/es/pagina-que-no-existe` muestra 404 decente, no error técnico
- [ ] `/es/admin/sin-login-directo` redirige o muestra login

### 13.9 Validador ingress (Agente 1) funcionando (pre-launch blocker)
- [ ] Agente 1 implementado y testeado (ver § 7.5)
- [ ] Corriendo en producción sin falsos positivos por 48 hrs antes del cutover

---

## 14. Pre-DNS checklist final

- [ ] Todas las secciones anteriores marcadas con [x]
- [ ] No hay errores en la consola del navegador
- [ ] Vercel deploy muestra "Ready" en verde
- [ ] Supabase proyecto activo (no pausado)
- [ ] El MVP en preenvios.com sigue funcionando en GitHub Pages (rollback de emergencia)
- [ ] Se tiene acceso al panel DNS de Namecheap
- [ ] Se conocen los registros DNS que se van a cambiar (A record + CNAME www)
- [ ] Todos los agentes de Fase 7 (defense-in-depth) construidos: validador ingress + data quality + DB health + E2E smoke + business metrics

---

## 15. Compliance legal (BLOQUEANTE pre-cutover)

Esta sección asegura que el sitio cumple requisitos legales antes de recibir tráfico real — especialmente de California (CCPA) y la UE (GDPR). Violar estas leyes después del cutover puede generar multas de $2,500 a €20M según jurisdicción. Todos los items son implementables sin LLC (son compliance técnico, no societario).

### 15.1 🍪 Cookie consent banner (CCPA + GDPR) — el item más crítico

**Problema:** hoy PreEnvios carga Google Analytics GA4 (`G-6RBFS2812S`) automáticamente en cada pageview sin pedir consentimiento al usuario. Bajo CCPA, un usuario californiano tiene derecho a opt-out de "venta de datos" (GA4 en modo default cuenta como eso). Bajo GDPR, un usuario europeo debe dar consentimiento ACTIVO antes de que se carguen cookies de analytics. Sin banner, estás en violación desde el minuto 1 de tráfico pagado.

**Solución mínima aceptable:**

- [x] Instalar librería **`vanilla-cookieconsent`** v3 (completado 2026-04-23)
- [x] Integrar en `app/[locale]/layout.tsx` — implementado con **Google Consent Mode v2**: gtag carga siempre pero con `default: all denied`, y CookieConsent.tsx dispara `gtag('consent','update',...)` según la elección del usuario. Más robusto que disparo condicional porque captura conversions anónimas pre-consent (recomendación oficial de Google desde 2024).
- [x] Textos del banner bilingües ES/EN, tono PreEnvios directo (no legalés). Link a `/privacidad` editable desde preferences modal.
- [x] Opciones del banner: "Aceptar todas" / "Rechazar todas" / "Personalizar".
- [x] Granularidad: **3 categorías** — "Necesarias" (bloqueada), "Analíticas" (GA4), "Marketing" (pre-declarada para futuro Meta Pixel/Google Ads).
- [x] Testear en Chrome incógnito: primera visita muestra banner, Accept → GA4 dispara `collect`, Reject → `collect` no aparece.
- [x] Validar con Chrome DevTools Network tab filtro `collect` — confirmado solo aparece post-consent.
- [x] Banner NO bloquea el contenido crítico — bottom-bar fullwidth, no modal fullscreen.

**Completado 2026-04-23 — commit `d064dcc`.** No requirió backend nuevo ni tabla DB.

### 15.2 Privacy policy — revisión de fondo

- [x] Página `/privacidad` existe con derecho a borrado CCPA/GDPR (ya hecho en Fase 1.5)
- [ ] Revisar que menciona explícitamente:
  - Cookies de analytics (GA4) — sí se usan, sí se pide consentimiento
  - Que NO se venden datos personales a terceros
  - Email de contacto para solicitudes de borrado (actual: `contact@preenvios.com`)
  - Plazo de respuesta (actual: 30 días, compatible con CCPA y GDPR)
- [ ] Si el banner del 15.1 introduce nuevas tecnologías (ej. categoría "Marketing" para futuro Meta Pixel), actualizar la privacy policy consistentemente

### 15.3 FTC disclosure en links afiliados

- [x] Disclaimer #4 cerca de botones "Enviar ahora" en el comparador (ya hecho en Fase 1.5)
- [x] Página `/como-ganamos-dinero` con detalle (ya hecho)
- [ ] Verificar visualmente que el disclaimer no se oculta en mobile (audit post-refactor)

### 15.4 Footer global con links legales visibles

- [x] Links a `/terminos`, `/privacidad`, `/como-ganamos-dinero`, `/uso-de-marcas`, `/metodologia`, `/disclaimers` en footer (ya hecho 2026-04-18 + 2026-04-22)
- [ ] Verificar que el footer es visible en todas las páginas (incluyendo rutas anidadas como `/blog/[slug]` y `/tasa/[pair]`)

---

## 16. Después del cambio de DNS

### 16.1 Verificación inmediata (primera hora)
- [ ] `preenvios.com` carga el sitio Next.js (no el MVP viejo)
- [ ] HTTPS funciona correctamente (certificado válido)
- [ ] Redirect de www a sin-www funciona (o viceversa según config)
- [ ] GA4 sigue midiendo en el nuevo dominio (verificar Real-Time con 1 visita)
- [ ] Todos los links de afiliado siguen funcionando
- [ ] Recrear los 4 monitores BetterStack con URLs de `preenvios.com` (ver § 11.1)
- [ ] Configurar `SENTRY_DSN` en Vercel + redeploy (ver § 11.2)
- [ ] Cambiar URL target del Agente 4 (E2E) de `preenvios.vercel.app` a `preenvios.com`

### 16.2 Limpieza y cleanup (primera semana)
- [ ] MVP viejo (`index.html` en GH Pages) se archiva o elimina del repo
- [ ] Crear Status Page pública en `status.preenvios.com` con BetterStack

---

## 17. Cadencias institucionales post-lanzamiento

Tareas recurrentes que se institucionalizan después del cutover. Todas son blockers de calidad del producto, no opcionales.

| Cadencia | Tarea | Doc referencia |
|----------|-------|----------------|
| **Semanal** | Revisión de 30 min: Sentry errors, BetterStack incidents, anomalías scraper, agentes alertas, GA4 top pages | — |
| **Semanal** | Usar el sitio como usuario real en 3 dispositivos distintos (iPhone + Android + desktop) para detectar UX bugs que los agentes no ven | — |
| **Bimensual (cada 60-90 días)** | Auditoría interna OWASP Top 10 (template: `AUDITORIA_DE_SEGURIDAD/01_auditoria_2026_04_19.md`). Ejecuta auditoría #02, #03, etc. | `AUDITORIA_DE_SEGURIDAD/README.md` |
| **Bimensual** | `npm audit` + review Dependabot alerts + actualizar dependencias seguras | — |
| **Mensual (meses 1-3 post-launch)** | Tuning de thresholds de agentes 2, 3, 5 con data real acumulada | Fase 7 del CONTEXTO_FINAL |
| **Mensual** | Revisión del estado de hiring triggers (ver `EQUIPO_Y_ESCALA.md`). ¿Se cumplió >5K users/mes + >2hrs/día en bugs? ¿Se contrata ya? | `EQUIPO_Y_ESCALA.md` |
| **Trimestral** | Actualizar `SERVICIOS_EXTERNOS.md` con costos reales del trimestre + revisar necesidad de upgrades (Vercel Pro, Supabase Pro, etc.) | `SERVICIOS_EXTERNOS.md` |
| **Anual** | Auditoría de seguridad externa profesional (~$1K-1.5K). Requisito para Fase 4.3 (publicidad directa bancos) | `AUDITORIA_DE_SEGURIDAD/README.md` |

**Regla institucional:** cada cadencia tiene un dueño (founder o empleado post-hire) y un calendario visible (Google Calendar recurrente o similar). Cadencia sin dueño = cadencia que nunca se ejecuta.
