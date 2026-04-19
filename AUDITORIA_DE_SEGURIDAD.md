# AUDITORIA DE SEGURIDAD — PreEnvios.com

Registro de auditorías OWASP del sitio. Incluye metodología, cadencia obligatoria, checklist por categoría Top 10, y bitácora de auditorías pasadas y programadas.

---

## Por qué existe este documento

PreEnvios no mueve dinero directamente pero sí:
- Maneja emails de usuarios (tabla `suscriptores_free`)
- Guarda mensajes del formulario de contacto (tabla `contactos`)
- Tiene panel admin con login y operaciones sobre la DB
- Expone API routes públicas (`/api/precios`, `/api/tasas-banco-central`, `/api/contactos`, `/api/suscripcion-free`)
- Recibe webhooks de terceros (Twilio WhatsApp, Vercel Cron)
- Procesa clicks que generan comisión de afiliados (incentivo económico para atacantes que intenten cookie stuffing o fraude de atribución)

Una vulnerabilidad abierta aquí no pierde dinero directo, pero puede filtrar emails, manipular rankings, envenenar cookies de afiliado, o usar la infraestructura como relay de spam/phishing. Todas esas rupturas dañan reputación y cortan el camino hacia la Fase 4.3 (publicidad directa con bancos — ellos auditan antes de firmar).

---

## Cadencia obligatoria

| Trigger | Qué se audita | Responsable |
|---------|---------------|-------------|
| **Pre-lanzamiento** | Full OWASP Top 10 + pentest manual de rutas admin | Claude Code + revisión del fundador |
| **Cada 90 días** post-lanzamiento | Full OWASP Top 10 + dep-check (npm audit) | Automatizable; registrar en este archivo |
| **Tras cada cambio de dependencia mayor** (Next, Supabase, Resend, Twilio) | Diff de cambios de seguridad del vendor + test de rutas afectadas | Claude Code |
| **Tras cualquier incidente reportado** | Post-mortem + auditoría enfocada en la categoría del incidente | Mismo día del incidente |
| **Antes de activar Fase 4.3** (publicidad directa bancos) | Full OWASP + revisión de handling de datos de partners | Contratar auditor externo ~$500-1500 |

**Regla dura:** no se aprueba deploy a producción (dominio preenvios.com) si la última auditoría tiene hallazgos 🔴 críticos abiertos.

---

## Metodología — checklist OWASP Top 10 (2021)

Cada categoría se revisa con grep del código, test manual de endpoints, y verificación de config en Supabase/Vercel.

### A01 — Broken Access Control
- [ ] Todas las rutas admin (`/api/admin/*`) verifican sesión activa con `isAdminAuthenticated()`
- [ ] Cookies de sesión admin tienen `HttpOnly`, `Secure`, `SameSite=Strict`
- [ ] `/api/scrape` protegido por `CRON_SECRET` — NO exposición en client bundle
- [ ] Supabase RLS activo en todas las tablas con datos de usuario (`suscriptores_free`, `contactos`, futuras tablas premium)
- [ ] Service role key NUNCA expuesta en código cliente — solo en API routes server-side
- [ ] Slugs de operadores/corredores validados contra whitelist en `generateStaticParams`

### A02 — Cryptographic Failures
- [ ] Tokens de confirmación email generados con `crypto.randomBytes(32)` (NO `Math.random()`)
- [ ] HTTPS enforced en Vercel (redirect HTTP → HTTPS activo)
- [ ] Passwords admin (si existen en el futuro) hasheados con bcrypt rounds ≥ 12
- [ ] Secretos en `.env.local` jamás comiteados — verificar `.gitignore`
- [ ] Vercel env vars marcadas como "encrypted" para producción

### A03 — Injection
- [ ] Queries a Supabase siempre via `supabase-js` builder (NO concatenación SQL)
- [ ] Validación server-side en `/api/contactos` y `/api/suscripcion-free` (length, regex, whitelist)
- [ ] Sanitización de input antes de renderizar (React escapa por default, verificar `dangerouslySetInnerHTML` no usa user input)
- [ ] WhatsApp webhook de Twilio valida firma HMAC antes de procesar
- [ ] Headers de scraping identifican `PreenviosBot/1.0` — no suplantar otros user agents

### A04 — Insecure Design
- [ ] Rate limiting en endpoints públicos (`/api/suscripcion-free`, `/api/contactos`) — mínimo 5 req/min por IP
- [ ] Double opt-in obligatorio para alertas email (ya implementado)
- [ ] CAPTCHA o similar en formularios de alta volumen si aparece spam
- [ ] Separación clara admin / público / scraper en routes
- [ ] Flujo de envío dinero: PreEnvios NUNCA procesa pagos directamente (modelo comparador, no MoneyTransmitter)

### A05 — Security Misconfiguration
- [ ] Headers de seguridad globales en `next.config.ts`:
  - [ ] `Content-Security-Policy` restrictivo (allowlist flagcdn, brandfetch, Google Analytics)
  - [ ] `X-Frame-Options: DENY`
  - [ ] `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Error pages (404, 500) NO revelan stack traces en producción
- [ ] `NODE_ENV=production` en Vercel
- [ ] Supabase: RLS forzado en cada tabla (no olvidar ALTER TABLE ENABLE ROW LEVEL SECURITY)
- [ ] Admin dashboard NO accesible vía ruta predecible sin auth

### A06 — Vulnerable and Outdated Components
- [ ] `npm audit` con 0 vulnerabilidades HIGH/CRITICAL
- [ ] Dependabot activo en GitHub — revisar alerts pendientes
- [ ] Lockfile commiteado (`package-lock.json`) para builds reproducibles
- [ ] Next.js, React, @supabase/supabase-js actualizados a última minor estable
- [ ] Auditar plugins/dependencias transitivas con > 1M weekly downloads (menos riesgo de supply chain)

### A07 — Identification and Authentication Failures
- [ ] Admin login con rate limiting (bloquear tras 5 intentos fallidos en 15 min)
- [ ] Timeout de sesión admin ≤ 4 horas
- [ ] NO "remember me" en admin sin 2FA
- [ ] Logout invalida sesión server-side
- [ ] Cookies `NEXT_LOCALE` sin datos sensibles (solo preferencia idioma)

### A08 — Software and Data Integrity Failures
- [ ] Deploys firmados via GitHub Actions o Vercel integration oficial
- [ ] NO ejecutar scripts npm con flags tipo `--ignore-scripts=false` sin revisar
- [ ] SQL migrations en `supabase/migrations/` revisadas línea por línea antes de ejecutar en prod
- [ ] Scraper upsert NO sobrescribe columnas de metadata admin (afiliado, link, rating) con valores obsoletos — regla documentada en TROUBLESHOOTING/26

### A09 — Security Logging and Monitoring Failures
- [ ] Vercel Functions logs activos y accesibles
- [ ] Supabase logs de escritura habilitados
- [ ] Alertas en Sentry (pendiente) para 500s de rutas admin y API críticas
- [ ] GA4 eventos de comportamiento sospechoso (ej. `suscripcion_free` > 20 veces/min desde una IP)
- [ ] Panel admin muestra últimas 100 acciones con timestamp + operador

### A10 — Server-Side Request Forgery (SSRF)
- [ ] Scrapers solo hacen fetch a URLs hardcoded (no aceptan user input como URL)
- [ ] `/api/tasas-banco-central` no acepta parámetros de URL arbitrarios
- [ ] Imágenes server-side (OG images, banderas) pre-validadas — no proxies abiertos

---

## Bitácora de auditorías

### Auditoría #1 — 2026-04-19 (pre-lanzamiento inicial)
**Fecha:** 2026-04-19
**Auditor:** Claude Code (automatizada) + fundador (revisión)
**Alcance:** Full OWASP Top 10
**Rama auditada:** `main` commit más reciente al momento
**Estado:** 🟡 En progreso — resultados detallados pendientes

**Hallazgos conocidos antes de iniciar (ya registrados en TROUBLESHOOTING):**
- [TROUBLESHOOTING/14](TROUBLESHOOTING/14_endpoint_cron_expuesto.md) — endpoint `/api/scrape` requiere CRON_SECRET (🔴 validar que no esté en client bundle como `NEXT_PUBLIC_*`)
- [TROUBLESHOOTING/15](TROUBLESHOOTING/15_admin_login_vulnerable.md) — admin login vulnerable a brute force (🔴 falta rate limiting)
- [TROUBLESHOOTING/16](TROUBLESHOOTING/16_webhook_twilio_sin_firma.md) — webhook Twilio no valida firma HMAC (🔴)
- [TROUBLESHOOTING/17](TROUBLESHOOTING/17_suscripcion_free_spam.md) — `/api/suscripcion-free` sin rate limiting (🟡)
- [TROUBLESHOOTING/18](TROUBLESHOOTING/18_headers_seguridad_globales.md) — faltan headers CSP, HSTS, X-Frame-Options globales (🟡)

**Acción inmediata:** remediar los 3 hallazgos 🔴 antes de considerar esta auditoría cerrada.

**Resultado resumido:** (a completar al cerrar)
- Hallazgos 🔴 críticos encontrados: _pendiente_
- Hallazgos 🟡 importantes: _pendiente_
- Hallazgos 🟢 menores: _pendiente_
- Fecha de cierre: _pendiente_

---

### Auditoría #2 — PROGRAMADA: antes del lanzamiento en preenvios.com
**Fecha estimada:** antes del primer deploy a dominio `preenvios.com` (no a `*.vercel.app`)
**Auditor:** Claude Code + fundador
**Alcance:** Full OWASP Top 10 + verificación de que los 3 hallazgos 🔴 de la auditoría #1 estén cerrados
**Requisito de aprobación:** cero 🔴 abiertos + plan de mitigación escrito para cada 🟡 abierto
**Bloqueante para:** activación DNS del dominio preenvios.com en Vercel

---

### Auditorías futuras (plantilla para llenar)

Cada auditoría sigue la plantilla:

```markdown
### Auditoría #N — YYYY-MM-DD (motivo)
**Fecha:** YYYY-MM-DD
**Auditor:** [quien]
**Alcance:** [Full OWASP | categoría específica | post-incidente]
**Rama auditada:** `main` @ commit `<hash>`
**Estado:** [🟢 Cerrada | 🟡 Abierta con seguimiento | 🔴 Bloqueante]

**Hallazgos:**
| # | Categoría OWASP | Severidad | Descripción | Mitigación | Cerrado |
|---|-----------------|-----------|-------------|------------|---------|
| 1 | AXX | 🔴/🟡/🟢 | ... | commit `<hash>` / TROUBLESHOOTING/N | YYYY-MM-DD |

**Resumen:** X críticos, Y importantes, Z menores. Todos cerrados en YYYY-MM-DD.
```

---

## Clasificación de severidad

| Icono | Nivel | Significado | Tiempo máximo al fix |
|-------|-------|-------------|----------------------|
| 🔴 | Crítico | Vulnerabilidad explotable con impacto directo (data leak, RCE, auth bypass) | 24-48h. Bloquea deploy a prod. |
| 🟡 | Importante | Vulnerabilidad no trivial pero mitigable o con barrera de explotación | 7 días. No bloquea pero se registra plan. |
| 🟢 | Menor | Defense in depth, best practice no aplicada, sin impacto directo | 30 días. Seguimiento en bitácora. |

---

## Herramientas de apoyo

**Análisis estático del código:**
```bash
# Dependencias con vulnerabilidades conocidas
npm audit --audit-level=moderate

# Secretos en commits (instalar una vez)
# npx gitleaks detect --source . --verbose
```

**Escaneo manual:**
- DevTools → Application → Cookies: verificar flags `HttpOnly`, `Secure`, `SameSite`
- DevTools → Network → Headers: verificar response headers de seguridad
- Burp Suite Community (opcional): proxy + fuzz de rutas admin
- `curl -I https://preenvios.com` — verificar headers en producción

**Dashboards:**
- Vercel → Logs → filtrar por status 500 en últimos 7 días
- Supabase → Logs → queries lentas y errores
- GitHub → Security → Dependabot alerts
- Google Search Console (cuando se active) → Manual Actions, Security Issues

---

## Referencias externas

- [OWASP Top 10 — 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel Security Headers](https://vercel.com/guides/how-can-i-set-security-headers-on-my-nextjs-application)
- FTC Safeguards Rule (aplicable si en Fase 4.4.B se procesan datos financieros)

---

## Relacionados internos

- [CONTEXTO_FINAL.md](CONTEXTO_FINAL.md) — roadmap general del proyecto
- [TROUBLESHOOTING/14-18](TROUBLESHOOTING/) — hallazgos de seguridad específicos ya documentados
- [LOGICA_DE_NEGOCIO/03_base_de_datos.md](LOGICA_DE_NEGOCIO/03_base_de_datos.md) — RLS policies de Supabase
- [LOGICA_DE_NEGOCIO/08_scrapers.md](LOGICA_DE_NEGOCIO/08_scrapers.md) — regla sobre metadata afiliado (A08)

---

_Última actualización: 2026-04-19. Próxima revisión obligatoria: antes del lanzamiento en preenvios.com._
