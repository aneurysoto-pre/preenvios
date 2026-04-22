# SERVICIOS EXTERNOS — DETALLE

Referencia completa de cada servicio externo del proyecto con env vars, dashboards, límites del plan actual, uso estimado y umbrales de upgrade. Archivo de consulta.

**Para ver solo el resumen de costo mensual** → [SERVICIOS_EXTERNOS.md](SERVICIOS_EXTERNOS.md)

**Última actualización de este detalle:** 2026-04-20 (post adición BetterStack + Sentry)

---

## Resumen — tabla maestra

| # | Servicio | Plan actual | Costo/mes | Estado |
|---|----------|-------------|-----------|--------|
| 1 | GitHub (repo) | Free | $0 | ✅ Operativo |
| 2 | Vercel (hosting + cron) | Hobby (Free) | $0 | ✅ Operativo · ⚠️ migrar a Pro antes de monetizar |
| 3 | Supabase (DB) | Free | $0 | ✅ Operativo |
| 4 | Upstash Redis (rate limit) | Free | $0 | ✅ Operativo |
| 5 | Twilio (WhatsApp) | Trial / Sandbox | $0 | 🟡 Sandbox — pendiente business verification |
| 6 | Resend (emails) | Free | $0 | ✅ Operativo (con subdominio de Resend) · 🟡 pendiente verificar dominio propio |
| 7 | Zoho Mail (contact@preenvios.com) | Free (5 users) | $0 | ✅ Operativo |
| 8 | Namecheap (dominio) | Paid anual | ~$1.25 | ✅ Operativo |
| 9 | Google Analytics 4 | Free | $0 | ✅ Operativo |
| 10 | Google Search Console | Free | $0 | ✅ Operativo (verificar al activar DNS) |
| 11 | FlexOffers (afiliados) | Free | $0 | 🟡 Aplicado — pendiente aprobación |
| 12 | Partnerize (afiliados) | Free | $0 | 🟡 Pendiente de aplicar |
| 13 | Impact.com (afiliados) | Free | $0 | 🔴 Rechazado — reaplicar 30-60 días |
| 14 | CJ Affiliate (afiliados) | Free | $0 | 🔴 Bloqueado — requiere Payoneer primero |
| 15 | Payoneer (cobros) | Free | $0 | 🟡 Pendiente de abrir |
| 16 | BetterStack (uptime + status page) | Free | $0 | 🟡 Pendiente signup (Fase 1 monitoring) |
| 17 | Sentry (error tracking + scraper anomalies) | Developer (Free) | $0 | 🟡 Código instalado + integrado con Agente 1 (tag `scraper_anomaly`) — pendiente DSN en Vercel |
| **TOTAL GASTO MENSUAL ACTUAL** | | | **~$1.25** | |

**Leyenda:**
- ✅ Operativo: funciona end-to-end en producción
- 🟡 Parcial / pendiente: configurado pero requiere acción adicional
- 🔴 Bloqueado / no configurado: no está activo, bloquea alguna fase

**Regla:** este archivo se actualiza en el mismo commit donde se agrega/quita un servicio o se cambia de plan. No dejar que la realidad de cuentas se desincronice con este doc.

---

## 1. GitHub

| Campo | Valor |
|-------|-------|
| **Propósito** | Repositorio del código fuente. Base para Vercel auto-deploy, Dependabot, backups |
| **Plan** | Free (cuenta personal) |
| **Repo** | `aneurysoto-pre/preenvios` |
| **Dashboard** | https://github.com/aneurysoto-pre/preenvios |
| **Costo mensual** | $0 |
| **Variables de entorno** | Ninguna (solo autenticación Git por SSH/HTTPS) |

### Límites del plan Free (relevantes)
- Repos privados ilimitados para cuentas personales
- GitHub Actions: 2,000 minutos/mes
- GitHub Packages: 500 MB storage
- Dependabot: gratis (alertas de vulnerabilidades + PRs automáticas)
- Issues + Projects básicos

### Uso estimado actual vs límite
- Actions: ~0 min/mes (no hay CI/CD configurado actualmente, Vercel hace build)
- Dependabot: activo desde Fase 1

### Umbral para upgrade
- No hay razón de upgrade a Pro/Team hoy. Upgrade ($4/mes personal, $4/user/mes team) se justifica solo si:
  - Se arma un equipo y se necesitan roles
  - Se implementa CI/CD pesado que supere los 2,000 min/mes
  - Se quieren protected branches y code owners obligatorios

---

## 2. Vercel

| Campo | Valor |
|-------|-------|
| **Propósito** | Hosting del Next.js + Serverless Functions + Vercel Cron para scraper + CDN global |
| **Plan** | Hobby (Free) |
| **Dashboard** | https://vercel.com/aneurysoto-pres-projects/preenvios |
| **Costo mensual** | $0 |

### Variables de entorno (gestionadas en Vercel → Project Settings → Environment Variables, los 3 entornos Production/Preview/Development)
Todas las del `.env.example` del repo:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_GA_ID`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `CRON_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`

### Límites del plan Hobby (relevantes)
- **Bandwidth:** 100 GB/mes
- **Serverless Function compute:** 100 GB-hours/mes
- **Build minutes:** 6,000/mes
- **Cron Jobs:** **1 por día máximo** ← limitación clave
- **Deployments:** 100/día
- **Comercial:** ⚠️ Vercel Hobby es estrictamente **no-comercial** en sus términos. Al empezar a monetizar vía afiliados, técnicamente debe migrar a Pro.

### Uso estimado actual vs límite
- Bandwidth: probablemente < 5 GB/mes pre-lanzamiento
- Cron: 1/día (scrape de precios, 7 AM UTC) — en el límite exacto del plan
- Deploys: pocos/día en uso real

### Umbral para upgrade a Pro ($20/mes)
Cualquiera de estos 3 dispara el upgrade:
1. **Activar DNS de preenvios.com y empezar a generar revenue de afiliados** (término de uso comercial)
2. **Necesitar más cron jobs** (ej. scrape cada 2h en vez de 1×/día, o crons separados para newsletter semanal)
3. **Superar los 100 GB/mes de bandwidth** (probable al tener tráfico orgánico real)

**Recomendación:** presupuestar el upgrade a Pro ($20/mes) en el mes del lanzamiento. Es pre-requisito práctico para monetización.

---

## 3. Supabase

| Campo | Valor |
|-------|-------|
| **Propósito** | Base de datos PostgreSQL (tablas: `precios`, `corredores`, `tasas_bancos_centrales`, `historial_tasas_publico`, `suscriptores_free`, `contactos`, `admin_login_attempts`). En Fase 4.4.B también asume auth |
| **Plan** | Free |
| **Dashboard** | https://supabase.com/dashboard |
| **Costo mensual** | $0 |

### Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto (OK expuesta en cliente)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key respetando RLS (OK expuesta)
- `SUPABASE_SERVICE_ROLE_KEY` — bypasea RLS, SOLO server-side (nunca en cliente)

### Límites del plan Free (relevantes)
- **Database:** 500 MB
- **File storage:** 1 GB
- **Auth users activos:** 50,000 MAUs/mes
- **Edge Function invocations:** 500,000/mes
- **API requests:** 5,000/hora a PostgREST
- **Backups:** NO hay backups automáticos en Free (solo en Pro)
- **Pausing:** el proyecto se pausa tras 1 semana sin actividad (auto-resume al recibir tráfico)
- **2 proyectos máximo**

### Uso estimado actual vs límite
- DB size: < 50 MB (datos pequeños, tablas pequeñas)
- MAUs: 0 (Supabase Auth no se usa todavía — admin va con env vars hasta Fase 4.4.B)
- API requests: bajo (/api/precios con cache de 5min, resto con poco tráfico)

### Umbral para upgrade a Pro ($25/mes)
- **Backups obligatorios antes de activar DNS** — Pro da point-in-time recovery + backups diarios 7 días. Es higiene mínima con usuarios reales.
- DB > 500 MB (histórico de precios crecerá — la tabla `historial_tasas_publico` es la que más crece)
- Fase 4.4.B Supabase Auth con > 50K MAUs (lejos)
- Necesidad de branching (preview environments de DB)

**Recomendación:** upgrade a Pro ($25/mes) **el mismo día del lanzamiento** — los backups no son negociables con usuarios reales.

---

## 4. Upstash Redis

| Campo | Valor |
|-------|-------|
| **Propósito** | Rate limit de `/api/admin/auth` (5 intentos / 15 min / IP) via `@upstash/ratelimit`. En el futuro: rate limit de `/api/contactos` y `/api/suscripcion-free` (H-04.1 auditoría) |
| **Plan** | Free |
| **Dashboard** | https://console.upstash.com |
| **Costo mensual** | $0 |

### Variables de entorno
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Límites del plan Free (relevantes)
- **Commands/día:** 10,000
- **Max data size:** 256 MB
- **1 database**
- **TLS obligatorio**, todas las regiones

### Uso estimado actual vs límite
- Admin login: ~5-20 intentos/día (solo admin real) → ~20-100 comandos/día
- **Holgura enorme** bajo el límite (< 1% del plan free)

### Umbral para upgrade
- Free alcanza incluso si se agregan rate limits públicos (H-04.1): 5 req/min a `/api/suscripcion-free` × tráfico esperado pre-lanzamiento = 1-5K comandos/día = aún dentro.
- Upgrade Pay-as-you-go ($0.20 por 100K comandos) solo tiene sentido si:
  - Tráfico orgánico alto hace que `/api/precios` también se rate-limite
  - Se agrega cache de `/api/precios` usando Redis (en vez de CDN HTTP)

---

## 5. Twilio (WhatsApp)

| Campo | Valor |
|-------|-------|
| **Propósito** | Bot de WhatsApp que responde con tasa del día al recibir un mensaje. En Fase premium también envía alertas push |
| **Plan** | Trial / Sandbox (no confirmado upgrade) |
| **Dashboard** | https://console.twilio.com |
| **Costo mensual** | $0 en sandbox |

### Variables de entorno
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN` — usado para validar webhook (pendiente implementar HMAC, H-03.4 auditoría)

### Límites / particularidades
- **Sandbox WhatsApp:** mensajes solo a números que hicieron `join <sandbox-code>` primero. Bueno para testing, no para producción real
- **Business verification:** para usar en producción con usuarios generales se requiere Meta Business Account verificado + número de WhatsApp Business aprobado + template messages aprobados
- **Per-message cost (producción):**
  - Conversación iniciada por usuario: free las primeras 1,000/mes, ~$0.005 después
  - Conversación iniciada por negocio (marketing): ~$0.04-0.08 dependiendo del país

### Uso estimado actual vs límite
- Sandbox: pocos mensajes de prueba
- Production: aún no

### Umbral para upgrade
- Registrar número WhatsApp Business formal cuando se quiera onboardear usuarios reales (Fase 4.4.B premium). Costo: ~$1/mes por número + per-message.
- Antes del upgrade: **cerrar H-03.4** (validación HMAC de firma Twilio) — la auditoría lo tiene como 🟡 pendiente

---

## 6. Resend

| Campo | Valor |
|-------|-------|
| **Propósito** | Emails transaccionales: confirmación de suscripción double opt-in, alertas diarias de tasa, newsletter semanal |
| **Plan** | Free |
| **Dashboard** | https://resend.com/dashboard |
| **Costo mensual** | $0 |

### Variables de entorno
- `RESEND_API_KEY`

### Límites del plan Free (relevantes)
- **Emails:** 3,000/mes total
- **Rate limit:** 100 emails/día
- **1 dominio propio verificable** (o usar subdomain de Resend `resend.dev`)
- Analytics básicos

### Uso estimado actual vs límite
- Suscriptores confirmados estimados hoy: < 10 (pre-lanzamiento)
- Envíos estimados/mes: confirmaciones + ~10 × 30 días = ~300 emails/mes
- **< 10% del plan free**

### Umbral para upgrade a Pro ($20/mes)
- **100 suscriptores confirmados** ya implica 100 × 30 = 3,000 emails/mes (alerta diaria solo), **justo en el límite**. A los 150 suscriptores ya está sobre el límite free.
- Pro ($20/mes) sube a 50,000 emails/mes, 3 dominios, soporte, analytics completos.
- También: se necesita verificar dominio propio `preenvios.com` en Resend para enviar desde `alertas@preenvios.com`. El free permite 1 dominio verificado → sirve para lanzamiento, pero Pro da más flexibilidad.

### Acción pendiente
- Verificar `preenvios.com` en Resend (TXT + DKIM + SPF records vía Namecheap) ANTES del DNS cutover. Hoy se envía desde `onboarding@resend.dev` que funciona pero no da trust de marca.

---

## 7. Zoho Mail

| Campo | Valor |
|-------|-------|
| **Propósito** | Mailbox de `contact@preenvios.com` — buzón para responder formulario de contacto y correspondencia general. No se usa para envío programático (eso es Resend) |
| **Plan** | Free (5 users, 5 GB/user) |
| **Dashboard** | https://mail.zoho.com |
| **Costo mensual** | $0 |

### Variables de entorno
- Ninguna (el proyecto no envía ni recibe emails vía Zoho programáticamente)

### Límites del plan Free (relevantes)
- **5 usuarios/emails** del dominio
- **5 GB/usuario**
- **Solo acceso web + apps móviles** (NO IMAP/POP en free — solo en Mail Lite $1/user/mes)
- 1 dominio
- Envío hasta 1,000 emails/día por cuenta

### Uso estimado actual vs límite
- 1 email activo (`contact@preenvios.com`)
- Volumen bajo pre-lanzamiento

### Umbral para upgrade a Mail Lite ($1/user/mes)
- Se necesita IMAP/POP (ej. conectar a Thunderbird, Outlook, móvil vía protocolo estándar)
- Se agregan aliases adicionales (`soporte@`, `partners@`, etc.)

---

## 8. Namecheap

| Campo | Valor |
|-------|-------|
| **Propósito** | Registro del dominio `preenvios.com` + gestión de DNS (apunta a Vercel) |
| **Plan** | Paid anual (renovación automática configurada) |
| **Dashboard** | https://ap.www.namecheap.com |
| **Costo** | ~$15/año = **~$1.25/mes** amortizado |

### Variables de entorno
- Ninguna (DNS se configura en el panel Namecheap, no en el código)

### Configuración DNS actual (referencia)
- Nameservers: apuntando a Vercel o Namecheap default + A/CNAME records a Vercel
- TXT records pendientes para:
  - Verificación Google Search Console
  - DKIM + SPF de Resend (al verificar dominio)
  - DMARC (`_dmarc.preenvios.com`, opcional pero recomendado)

### Umbral para cambio
- Ninguno relevante. Alternativas (Cloudflare Registrar, Porkbun) tienen precios similares o menores. Migración solo si hay razón fuerte (ej. Cloudflare ofrece CDN/WAF integrados, pero Vercel ya cumple ese rol).

### Acción pendiente
- Cuando se active DNS a preenvios.com (post-auditoría aprobada): apuntar los records a Vercel + verificar SSL issuance + migrar Resend a dominio propio.

---

## 9. Google Analytics 4

| Campo | Valor |
|-------|-------|
| **Propósito** | Tracking de comportamiento: click_operador, comparar_click, cambio_corredor, cambio_idioma, suscripcion_free, etc. Feeds decisiones de ranking y negocio |
| **Plan** | Free (Standard) |
| **Dashboard** | https://analytics.google.com |
| **Costo mensual** | $0 |
| **Property ID** | `G-6RBFS2812S` |

### Variables de entorno
- `NEXT_PUBLIC_GA_ID=G-6RBFS2812S` (expuesto en cliente — es correcto, el Measurement ID es público por diseño)

### Límites del plan Free (relevantes)
- **10 millones de eventos/mes** por property
- Retención de datos: 14 meses (configurable a 2 o 14)
- Reportes estándar + exploraciones

### Uso estimado actual vs límite
- Pre-lanzamiento: pocos eventos/día
- Incluso con 10,000 visitantes diarios × 10 eventos cada uno = 3M eventos/mes, 30% del límite

### Umbral para upgrade
- Google Analytics 360 ($50K+/año, enterprise) — **no relevante nunca** para PreEnvios en el horizonte visible

---

## 10. Google Search Console

| Campo | Valor |
|-------|-------|
| **Propósito** | Monitoreo de indexación y performance SEO orgánico. Alertas de errores de crawl, cobertura, problemas de core web vitals |
| **Plan** | Free |
| **Dashboard** | https://search.google.com/search-console |
| **Costo mensual** | $0 |

### Variables de entorno
- Ninguna (verificación vía TXT DNS record en Namecheap, una sola vez)

### Acción pendiente
- Activar property para `preenvios.com` al hacer el DNS cutover
- Subir sitemap.xml (ya generado automáticamente por Next.js)
- Monitorear "Manual Actions" y "Security Issues" semanalmente post-lanzamiento

---

## 11. FlexOffers

| Campo | Valor |
|-------|-------|
| **Propósito** | Red de afiliados. Programas relevantes: MoneyGram, potencialmente Western Union y otros |
| **Plan** | Free (todas las redes de afiliados son free-to-join) |
| **Dashboard** | https://publisher.flexoffers.com |
| **Costo mensual** | $0 |
| **Estado** | 🟡 Aplicado, pendiente aprobación |

### Variables de entorno
- Ninguna (los links de afiliado se pegan como URL en la tabla `precios.link` de Supabase al aprobarse cada programa)

### Notas
- Onboarding: aplicación gratuita, review 3-10 días hábiles, cada programa requiere aprobación individual después
- Cobro: depositan en cuenta bancaria USA o PayPal (umbral típico $50) — Payoneer también suele ser opción

---

## 12. Partnerize

| Campo | Valor |
|-------|-------|
| **Propósito** | Red de afiliados. Programa relevante: Wise |
| **Plan** | Free |
| **Dashboard** | https://id.partnerize.com |
| **Costo mensual** | $0 |
| **Estado** | 🟡 Pendiente de aplicar |

### Variables de entorno
- Ninguna

### Notas
- Partnerize opera con empresas más exclusivas; el onboarding suele requerir publisher ya con algo de tráfico verificable
- Dejar para post-lanzamiento cuando haya 1,000+ visitas/mes demostrables

---

## 13. Impact.com

| Campo | Valor |
|-------|-------|
| **Propósito** | Red de afiliados. Programas relevantes: Remitly, WorldRemit, varios |
| **Plan** | Free |
| **Dashboard** | https://app.impact.com |
| **Costo mensual** | $0 |
| **Estado** | 🔴 Rechazado — reaplicar en 30-60 días |

### Variables de entorno
- Ninguna

### Razón de rechazo inicial (según contexto del proyecto)
- Impact suele rechazar publishers sin tráfico demostrable o sin un sitio en producción claramente activo
- Reaplicar con:
  - Dominio propio activo (preenvios.com live, no el .vercel.app)
  - Analytics mostrando tráfico constante
  - Contenido editorial rico (blog + wiki + reviews)

### Plan
- Reintentar después de 30-60 días desde activación de DNS (necesita historial de tráfico)

---

## 14. CJ Affiliate

| Campo | Valor |
|-------|-------|
| **Propósito** | Red de afiliados. Programas relevantes: Xoom, Ria, WorldRemit, Western Union, MoneyGram |
| **Plan** | Free |
| **Dashboard** | https://members.cj.com |
| **Costo mensual** | $0 |
| **Estado** | 🔴 Bloqueado — requiere cuenta Payoneer activa primero |

### Variables de entorno
- Ninguna

### Bloqueo
- CJ requiere método de cobro internacional para publishers fuera de USA — Payoneer es la vía estándar
- Hasta no tener Payoneer operativa, CJ no permite finalizar onboarding

### Plan
- Primero completar Payoneer (paso 15), después aplicar a CJ, después aplicar a cada programa (Xoom/Ria/etc.) dentro de CJ

---

## 15. Payoneer

| Campo | Valor |
|-------|-------|
| **Propósito** | Recibir pagos internacionales de redes de afiliados (requerido explícitamente por CJ, útil para FlexOffers y otros) |
| **Plan** | Free (cuenta básica) |
| **Dashboard** | https://payouts.payoneer.com |
| **Costo mensual** | $0 mantenimiento |
| **Estado** | 🟡 Pendiente de abrir |

### Variables de entorno
- Ninguna

### Costos transaccionales (al mover dinero)
- Withdrawal a cuenta bancaria local: 1-3% dependiendo del método
- Card de Payoneer (opcional): $29.95/año
- Cambio de moneda (USD → moneda local): ~2% sobre el mid-market rate

### Plan
- Abrir cuenta Payoneer (onboarding ~1-2 semanas incluyendo verificación de identidad)
- Conectar con CJ como método de pago
- Usarla como primary payout para todas las redes de afiliados

---

## 16. BetterStack (uptime + status page)

| Campo | Valor |
|-------|-------|
| **Propósito** | Uptime monitoring externo: chequea endpoints cada 30s, alerta por email cuando algo falla. Status page pública como artefacto de confianza para partners |
| **Plan** | Free (better uptime) |
| **Dashboard** | https://uptime.betterstack.com |
| **Costo mensual** | $0 |
| **Estado** | 🟡 Pendiente signup manual — Fase 1 del plan monitoring (2026-04-20) |

### Variables de entorno
- Ninguna en el proyecto (BetterStack es externo 100% — no hay webhook ni tabla local)

### Límites del plan Free (relevantes)
- **10 monitores** simultáneos
- **Chequeos cada 30 segundos**
- **Email alerts:** ilimitadas
- **SSL cert monitor:** incluido
- **Status page pública:** gratuita con subdominio propio (CNAME)
- **Retención incidentes:** 3 meses

### Uso estimado actual vs límite
- 5 monitores planeados (home, `/api/precios`, `/api/tasas-banco-central`, `/es/admin`, SSL)
- 50% del límite free — holgura para agregar 5 más después del lanzamiento

### Umbral para upgrade a Team ($29/mes)
- Más de 10 monitores (probable cuando se agreguen endpoints premium Fase 4.4.B)
- Necesidad de SMS/voice calls (free solo da email)
- Necesidad de escalation policies (ej. alertar a on-call secundario si primary no reconoce)

### Referencia
- Plan completo en [AUDITORIA_DE_SEGURIDAD/monitoring.md § Fase 1](AUDITORIA_DE_SEGURIDAD/monitoring.md)

---

## 17. Sentry (error tracking + scraper anomaly observability)

| Campo | Valor |
|-------|-------|
| **Propósito** | Captura excepciones de aplicación (server + client + edge runtime) con stack traces, agrupación automática, breadcrumbs, context (user, URL, release, commit). Desde 2026-04-22 también captura eventos `scraper_anomaly` del Agente 1 (Fase 7 defense-in-depth). Complementa BetterStack: BetterStack detecta "el sitio se cayó"; Sentry detecta "el sitio responde 200 pero un error silencioso está corrompiendo data o la UX". |
| **Plan** | Developer (Free) |
| **Dashboard** | https://sentry.io |
| **Costo mensual** | $0 |
| **SDK** | `@sentry/nextjs ^10.49.0` (instalado 2026-04-20, commit `ba107e5`) |
| **Estado** | 🟡 Código instalado + configurado — **pendiente signup + DSN en Vercel** (bloquea captura en producción; sin DSN los eventos se descartan silenciosamente) |

### Variables de entorno (gestionadas en Vercel → Project Settings → Environment Variables)

| Env var | Expuesta cliente | Obligatoria | Propósito |
|---------|------------------|-------------|-----------|
| `SENTRY_DSN` | NO | Sí (server) | DSN server-side (Node runtime de Next.js). Si está vacía, SDK no-op. |
| `NEXT_PUBLIC_SENTRY_DSN` | SÍ | Sí (client) | Mismo DSN para el bundle client. OK exponerlo — es público por diseño como el GA Measurement ID. Sin él, errores en el browser no se reportan. |
| `SENTRY_ORG` | NO | Opcional | Slug de la org Sentry — habilita el Sentry Webpack plugin para upload de source maps en el build. Sin esto, los errores muestran código minificado. |
| `SENTRY_PROJECT` | NO | Opcional | Slug del proyecto — junto con `SENTRY_ORG` para source maps. |
| `SENTRY_AUTH_TOKEN` | NO | Opcional | Token con scope `project:releases` para que el CI suba source maps. Generarlo en sentry.io → User Auth Tokens. |

**Setear en los 3 entornos de Vercel:** Production, Preview, Development. Los valores son los mismos (Sentry diferencia por el tag `environment` que el SDK setea automáticamente desde `VERCEL_ENV || NODE_ENV`).

### Archivos de configuración en el proyecto

| Archivo | Runtime | Qué configura |
|---------|---------|---------------|
| `sentry.server.config.ts` | Node (API routes, server components, middleware en Node runtime) | `Sentry.init({ dsn, tracesSampleRate: 0.1 })`. `enabled: !!dsn` para ser no-op sin DSN. |
| `sentry.edge.config.ts` | Edge (middleware en edge runtime, si aplica) | Similar al server pero para el runtime edge de Next.js. |
| `instrumentation.ts` | Next 16 | Re-exporta `register()` de `@sentry/nextjs` — Next.js lo invoca al boot para inicializar el SDK en el runtime correcto. |
| `instrumentation-client.ts` | Browser | Inicialización client-side (replays, breadcrumbs DOM, Next Router integration). |
| `next.config.ts` | Build | `withSentryConfig()` wrapping del export — tunneling de eventos para bypass ad-blockers + upload de source maps en CI. |

**Regla:** cualquier cambio en las opciones de `Sentry.init()` (sample rates, integrations, beforeSend filters) se hace en los 2-3 archivos simultáneamente para que server y client se comporten igual.

### Integraciones en código del proyecto (dónde Sentry es invocado explícitamente)

| Archivo | Llamada | Tag / context | Cuándo dispara |
|---------|---------|---------------|----------------|
| `lib/scrapers/validator.ts` | `Sentry.captureMessage('scraper_anomaly', { level: 'warning', tags: { scraper_anomaly: 'true', operador, corredor }, extra: { price, issues } })` | `scraper_anomaly` | Cada fila rechazada por `validatePrice()`. Fase 7 Agente 1. |
| Errores automáticos en API routes | Captura default del SDK | `transaction` (ruta) + `request` (URL/método) | Cualquier excepción no-handleada en un endpoint. |
| Errores automáticos en componentes React | Next.js Error Boundary → Sentry | `transaction` (página) | Render errors del cliente. |
| Unhandled promise rejections | Captura default del SDK | — | Promesas rechazadas sin `.catch()`. |

**Tag strategy para filtrar en el dashboard:**

- `scraper_anomaly=true` — eventos del Agente 1 (Fase 7). Filtra con `tag:scraper_anomaly=true`.
- `operador=<slug>` — filtra anomalías por remesadora (ej. `tag:operador=remitly`).
- `corredor=<slug>` — filtra anomalías por país (ej. `tag:corredor=dominican_republic`).
- `environment=production|preview|development` — auto-seteado desde `VERCEL_ENV`.

### Límites del plan Developer Free (relevantes)

- **5,000 eventos/mes** combinados (errors + captureMessage + transactions)
- **1 usuario** en la org
- **50 Session Replays/mes** — útil para reproducir bugs de UX
- **30 días** de retención
- **1 proyecto**
- **Alerts ilimitadas por email**
- **Source maps** incluidos (requieren `SENTRY_AUTH_TOKEN`)

### Uso estimado actual vs límite

| Momento | Eventos/mes estimados | % del plan |
|---------|----------------------|------------|
| Pre-lanzamiento sin DSN activo | 0 | 0% |
| Post-activación, tráfico moderado (2-5K visitas/día) | 200-500 | 4-10% |
| Post-activación con scrapers estables | +30-60 (anomalías esporádicas) | +1% |
| Post-activación con scraper roto temporalmente | +100-300 en 1 día (burst) | spike dentro del plan |

Margen holgado para absorber picos. Si un scraper falla consistentemente genera ~3-10 anomalías por corrida de `/api/scrape`; aunque el cron corre cada 15 min, el Agente 1 marca stale a los 3+ consecutivos → auto-limita el ruido de ese operador.

### Umbral para upgrade a Team ($26/mes)

- **>5K eventos/mes sostenidos** (no picos puntuales) — síntoma de tasa alta de errores o de monitoreo excesivo.
- **Más de 1 persona** necesita acceso (equipo futuro, ver `EQUIPO_Y_ESCALA.md`).
- **Más proyectos** — cuando se agregue app mobile Fase 5 o un microservicio separado.
- **Retención >30 días** para análisis de trends históricos.

### Alertas recomendadas (configurar en sentry.io → Alerts)

Cuando se active el DSN, crear estas 4 rules (todas a `contact@preenvios.com` o a un webhook de Slack si se setea):

1. **Cualquier error nuevo en producción** — trigger: `event.environment:production AND is_first_seen:true`. Avisa cuando aparece un error que nunca se había visto. Nivel: inmediato.
2. **Ráfaga de errores** — trigger: `event.environment:production AND event.count > 10 in 5m`. Indica regresión o caída parcial. Nivel: inmediato.
3. **Scraper anomaly burst** — trigger: `event.tags.scraper_anomaly:true AND event.count > 20 in 1h`. Indica que un scraper está devolviendo data basura masivamente (Agente 1 ya marcó stale; la alerta es para investigar). Nivel: 1h delay, digest.
4. **Cron `/api/scrape` falló** — trigger: `transaction:"/api/scrape" AND level:error`. El cron se rompió, no va a haber actualizaciones hasta arreglar. Nivel: inmediato.

### Comportamiento sin DSN

El SDK usa `enabled: !!process.env.SENTRY_DSN` en los 3 configs — si no hay DSN:

- `Sentry.init()` es no-op
- `Sentry.captureException()` y `Sentry.captureMessage()` retornan sin enviar nada
- El build de Next.js funciona normalmente (no requiere DSN para compilar)
- Los eventos se loguean a `console.error` / `console.warn` en el server y `console.*` en el browser — visibles en Vercel logs y DevTools

Esto permite commitear todo el código de instrumentación ahora y activar el servicio cuando el founder complete el signup. No hay riesgo de "crashear por Sentry mal configurado".

### Pasos de activación (orden exacto cuando toque)

1. **Signup** en https://sentry.io con el email del founder. Plan Developer (Free).
2. Crear org `preenvios` (o similar — slug único).
3. Crear proyecto **Next.js** → nombre `preenvios-web` (o similar). Sentry ofrece el DSN al finalizar.
4. Copiar el DSN (formato `https://abc123@o456.ingest.sentry.io/789`).
5. En Vercel → Project Settings → Environment Variables, agregar **para Production, Preview, Development**:
   - `SENTRY_DSN=<DSN>`
   - `NEXT_PUBLIC_SENTRY_DSN=<DSN>` (mismo valor)
   - `SENTRY_ORG=preenvios` (o el slug real)
   - `SENTRY_PROJECT=preenvios-web` (o el slug real)
6. (Opcional) Generar `SENTRY_AUTH_TOKEN` en sentry.io → User Auth Tokens → scope `project:releases`. Agregarlo en Vercel para habilitar source maps.
7. **Redeploy** (Vercel → Deployments → Redeploy latest) para que las env vars lleguen al runtime.
8. **Smoke test:** visitar `https://preenvios.vercel.app/api/sentry-test` (si se crea endpoint de test) o forzar un error en DevTools. Verificar que aparece en el dashboard Sentry en <30 segundos.
9. **Configurar alertas** (ver sección "Alertas recomendadas" arriba).
10. Marcar completado en `CONTEXTO_FINAL.md` Fase 2 monitoring + `CHECKLIST_PRE_LANZAMIENTO.md § 11.2`.

### Troubleshooting rápido

| Síntoma | Causa probable | Fix |
|---------|----------------|-----|
| Errors no aparecen en dashboard | DSN faltante o incorrecto en Vercel | Verificar las 2 env vars (`SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN`) coinciden y apuntan al proyecto correcto. Redeploy. |
| Source maps ofuscados (no se ve el código fuente en el stack trace) | `SENTRY_AUTH_TOKEN` faltante o sin permisos | Generar token con scope `project:releases` y agregar a Vercel env vars. Redeploy. |
| Eventos cliente aparecen, server no | `SENTRY_DSN` setea solo en una env (ej. Production pero no Preview) | Setear en los 3 entornos. |
| Spike > 5K eventos/día | Loop infinito que captura + un ad-blocker bloquea tunneling | Revisar `beforeSend` en `sentry.client.config.ts` (si existe) para filtrar patrones repetidos. Considerar upgrade. |
| `Sentry.captureMessage` no dispara desde `validator.ts` | SDK no inicializó por DSN faltante | Ya es fail-open intencionalmente — verificar env vars como en primer síntoma. |

### Referencia interna

- Setup técnico inicial en [AUDITORIA_DE_SEGURIDAD/monitoring.md § Fase 2](AUDITORIA_DE_SEGURIDAD/monitoring.md)
- Integración con Agente 1 en [LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md](LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md) § "Decisiones de diseño" punto 5
- Plan Fase 7 defense-in-depth en [CONTEXTO_FINAL.md § Fase 7](CONTEXTO_FINAL.md)
- Ítem pendiente en el checklist: [CHECKLIST_PRE_LANZAMIENTO.md § 11.2](CHECKLIST_PRE_LANZAMIENTO.md)

---

## Checklist de acción pendiente — orden sugerido

1. [ ] Abrir cuenta Payoneer → desbloquea CJ Affiliate
2. [ ] Aplicar a CJ Affiliate → desbloquea programas de Xoom/Ria/WorldRemit/WU/MG
3. [ ] Verificar `preenvios.com` en Resend (TXT + DKIM + SPF) antes del DNS cutover
4. [ ] Verificar `preenvios.com` en Google Search Console al activar DNS
5. [ ] Upgrade Vercel Hobby → Pro el día del DNS cutover (términos comerciales)
6. [ ] Upgrade Supabase Free → Pro el día del DNS cutover (backups obligatorios)
7. [ ] Verificar business WhatsApp Twilio antes de productivizar el bot (Fase 4.4.B)
8. [ ] Aplicar a Partnerize después de 30 días de tráfico demostrable
9. [ ] Re-aplicar a Impact.com después de 30-60 días de tráfico demostrable
10. [ ] Aplicar a FlexOffers — ya aplicado, seguimiento de aprobación
11. [ ] Signup BetterStack + crear 5 monitores + status page `status.preenvios.com` (Fase 1 monitoring — ver monitoring.md)
12. [ ] Signup Sentry + agregar `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` en Vercel (Fase 2 monitoring — cierra H-09.1 auditoría)

---

## 18. Proxy rotativo para scrapers (fallback táctico, no contratado aún)

| Campo | Valor |
|-------|-------|
| **Propósito** | Fallback cuando scrapers de Remitly/WU/MG bloqueen fetch directo desde Vercel. NO es dependencia permanente — se activa solo cuando el detector `reportScraperFailure` marca un operador como stale por 3+ fallos consecutivos |
| **Plan** | Sin contratar. Candidato principal: **Webshare free-tier hasta $3/mes** (Starter con 10 datacenter IPs) |
| **Dashboard** | N/A hasta contratar |
| **Costo mensual** | $0 ahora, $3-30 cuando se active |
| **Estado** | 🟡 No contratado — trigger documentado en CHECKLIST § 7.4 y LOGICA_DE_NEGOCIO/08_scrapers.md § 6ter |

### Opciones de proveedor (ranking para el volumen de PreEnvios: ~60 requests/día)

| Proveedor | Plan mínimo | Tipo | Recomendación |
|-----------|-------------|------|---------------|
| **Webshare** | $2.99/mes (10 IPs datacenter) | Datacenter rotativo | ✅ Primera opción. Barato, alcanza de sobra |
| **ScraperAPI** | $49/mes (100K req/mes) | API wrapper + anti-bot | Usar si Webshare no bypassa Cloudflare de WU |
| **SmartProxy / DataImpulse** | $3-15/mes | Residencial | Solo si WU/Remitly detectan datacenter IPs |
| **Bright Data** | $500/mes mínimo | Enterprise | ❌ Overkill, no usar |

### Trigger para contratar

1. El cron diario de `/api/scrape` falla para un mismo operador MVP 3 veces consecutivas
2. `reportScraperFailure` marca los precios como stale (`actualizado_en = 2000-01-01`)
3. El dashboard admin `/es/admin` reporta el operador en rojo
4. Pasaron >48hrs y los fetchs directos siguen fallando → no es glitch de red, es bloqueo real

Cuando se active: crear cuenta Webshare, copiar URL de proxy (formato `http://user:pass@proxy.webshare.io:80`), agregar env var `PROXY_URL` en Vercel, modificar scrapers afectados para usar ese proxy con `fetch()` (agregar config de agent).

### Env vars que se agregarán

- `PROXY_URL` — URL completa del proxy con credenciales (solo server-side, NO `NEXT_PUBLIC_`)
- Opcional: `PROXY_OPERATORS` — lista separada por coma de qué operadores usan proxy (ej. `remitly,westernunion`). Si vacío, todos lo usan.

### Relación con afiliados (Tier 2)

Cada red de afiliados que apruebe PreEnvios = 1 operador que deja de depender de scraping + proxy. Roadmap:
- Payoneer (en curso) → desbloquea CJ → feeds de Xoom, Ria, WorldRemit, WU, MG vía Impact CJ
- Impact.com → feed de Remitly
- Partnerize → feed de Wise (o migrar a API pública `api.wise.com/v1/rates` que es gratis y no requiere aprobación)

Cuantos más feeds Tier 2 aprobados, menos necesidad de proxy. Meta: en mes 6 post-lanzamiento, solo 1-2 scrapers dependen de proxy.

---

## Proyección de costo mensual

| Fase | Servicios pagos | Costo/mes estimado |
|------|-----------------|---------------------|
| Hoy (pre-lanzamiento) | Solo Namecheap (amortizado) | **~$1.25** |
| Post-DNS cutover (Mes 1) | + Vercel Pro + Supabase Pro | **~$46** |
| Crecimiento (100+ suscriptores) | + Resend Pro | **~$66** |
| Premium activo (WhatsApp + Fase 5) | + Twilio per-message (~$10-30 estimado) + Zoho Mail Lite ($1-5) | **~$80-100** |

**Nota:** la mayoría de los servicios tiene amplio headroom en plan free. El costo real se dispara cuando se monetiza vía afiliados (requiere Vercel Pro) y se tienen usuarios reales (requiere Supabase Pro por backups).

---

## Relacionados

- [CONTEXTO_FINAL.md § Stack tecnológico](CONTEXTO_FINAL.md) — visión de producto final
- [CONTEXTO_FINAL.md § Infraestructura GitHub + Vercel](CONTEXTO_FINAL.md) — detalles de configuración
- [AUDITORIA_DE_SEGURIDAD/01_auditoria_2026_04_19.md](AUDITORIA_DE_SEGURIDAD/01_auditoria_2026_04_19.md) — hallazgos relacionados a Twilio (H-03.4) y monitoreo (H-09.*)
- [CHECKLIST_PRE_LANZAMIENTO.md](CHECKLIST_PRE_LANZAMIENTO.md) — qué hay que dejar listo antes del DNS cutover
- [LOGICA_DE_NEGOCIO/16_alertas_gratis.md](LOGICA_DE_NEGOCIO/16_alertas_gratis.md) — detalle de integración con Resend
- [LOGICA_DE_NEGOCIO/09_whatsapp_bot.md](LOGICA_DE_NEGOCIO/09_whatsapp_bot.md) — detalle de integración con Twilio
