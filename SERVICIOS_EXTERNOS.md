# SERVICIOS EXTERNOS — PreEnvios.com

Inventario completo de cuentas, credenciales y dependencias externas del proyecto. Se mantiene actualizado cada vez que se agrega, cambia de plan, o da de baja un servicio.

**Última actualización:** 2026-04-20 (post adición BetterStack + Sentry)

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
| 17 | Sentry (error tracking) | Developer (Free) | $0 | 🟡 Código instalado — pendiente DSN (Fase 2 monitoring) |
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

## 17. Sentry (error tracking)

| Campo | Valor |
|-------|-------|
| **Propósito** | Captura excepciones de aplicación (server + client + edge) con stack traces, agrupación automática, context (user, URL, release). Complementa BetterStack detectando errores con HTTP 200 en apariencia correcto |
| **Plan** | Developer (Free) |
| **Dashboard** | https://sentry.io |
| **Costo mensual** | $0 |
| **Estado** | 🟡 Código instalado + configurado 2026-04-20 — pendiente signup + DSN en Vercel (Fase 2 monitoring) |

### Variables de entorno
- `NEXT_PUBLIC_SENTRY_DSN` — DSN expuesto al cliente (OK, es público por diseño como el GA Measurement ID)
- `SENTRY_DSN` — mismo valor, para server-side init
- `SENTRY_ORG` — slug de la org Sentry
- `SENTRY_PROJECT` — slug del proyecto Sentry
- `SENTRY_AUTH_TOKEN` — opcional, habilita upload de source maps al build

### Límites del plan Developer Free (relevantes)
- **5,000 eventos/mes** (errors + transactions combinados)
- **1 usuario** en la org
- **50 Session Replays/mes**
- **30 días** de retención de datos
- 1 proyecto

### Uso estimado actual vs límite
- Pre-lanzamiento sin DSN activo: 0 eventos
- Estimación post-activación con tráfico moderado: < 500 eventos/mes (< 10% del plan)

### Umbral para upgrade a Team ($26/mes)
- > 5K eventos/mes (~alta tasa de errores en producción, o >100 transactions/día)
- Más usuarios en la org (equipo)
- Más proyectos (ej. mobile app futura en Fase 5)
- Retención > 30 días para análisis histórico

### Comportamiento sin DSN
El SDK está configurado con `enabled: !!process.env.SENTRY_DSN` — si no hay DSN, queda en no-op sin errores. El build de Next.js funciona igual. Esto permite commitear el código ahora y activar el servicio cuando el user complete el signup.

### Referencia
- Setup técnico completo en [AUDITORIA_DE_SEGURIDAD/monitoring.md § Fase 2](AUDITORIA_DE_SEGURIDAD/monitoring.md)

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
