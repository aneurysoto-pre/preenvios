# Monitoring — cierre progresivo de H-09.1

Este archivo documenta la infraestructura de observabilidad de PreEnvios. Es parte del cierre del hallazgo **H-09.1 (A09 Security Logging & Monitoring)** de la [Auditoría #01](01_auditoria_2026_04_19.md).

La implementación está dividida en 2 fases complementarias — cada una cubre una categoría distinta de problema:

| Fase | Herramienta | Cubre | Estado al 2026-04-20 |
|------|-------------|-------|----------------------|
| 1 | BetterStack | Uptime — "¿el sitio está arriba?" | 🔴 **PAUSADA** — signup hecho + team configurado. Monitores eliminados porque `preenvios.com` apunta a GitHub Pages del MVP viejo. Se recrean el día del DNS cutover a Vercel |
| 2 | Sentry (`@sentry/nextjs`) | App errors — "arriba pero lanza excepciones" | 🟡 Código instalado, pendiente DSN en Vercel |

**Con Fase 1 + Fase 2 H-09.1 queda cerrado.** H-09.2 (audit trail de cambios admin) sigue siendo hallazgo separado.

---

## Fase 1 — BetterStack (uptime + status page)

### Proveedor y plan

- **Proveedor:** [BetterStack](https://betterstack.com/)
- **Producto:** Better Uptime (anteriormente betteruptime.com)
- **Plan:** Free
- **Límites relevantes del free tier:**
  - 10 monitores simultáneos
  - Chequeos cada 30 segundos
  - Email alerts ilimitadas
  - SSL cert monitor incluido
  - Status page pública gratuita con subdominio propio (CNAME)
  - Incident timeline + historial
- **Costo mensual:** $0

### Histórico — qué pasó con los monitores iniciales

- **2026-04-19:** se creó el signup + team + 4 monitores apuntando a `preenvios.com`.
- **2026-04-19/20:** se detectó que los monitores de `/api/precios` y `/api/tasas-banco-central` devolvían 404 porque `preenvios.com` todavía apunta a GitHub Pages (IPs `185.199.x.x`) del MVP viejo — endpoints de Next.js no existen ahí. Los monitores de `/` y `/es/admin` también eran problemáticos porque respondían con contenido del MVP viejo, no con el Next.js esperado.
- **2026-04-20:** se intentó cambiar las URLs a `preenvios.vercel.app` pero BetterStack mantuvo internamente las URLs antiguas causando falsos positivos. Decisión: **los 4 monitores se eliminaron** del dashboard para no ensuciar el canal de alertas.
- **Estado actual:** signup activo + team de 2 emails configurado. Cero monitores activos. La Fase 1 está formalmente **pausada hasta el DNS cutover**.

### Monitores a recrear el día del DNS cutover

**Acción requerida post-DNS** (cuando `preenvios.com` apunte a Vercel y HTTPS esté activo — típicamente 10-60 min tras el cambio en Namecheap): **crear los 4 monitores desde cero** (no editar, crear nuevos) con estas URLs finales:

| # | Nombre | URL final de producción | Tipo de chequeo |
|---|--------|------------------------|-----------------|
| 1 | Home | `https://preenvios.com/` | HTTP status 2xx/3xx + SSL verify |
| 2 | Admin | `https://preenvios.com/es/admin` | HTTP status 200 (login form) + SSL verify |
| 3 | API precios | `https://preenvios.com/api/precios?corredor=honduras&metodo=bank` | Keyword match: `"operador"` + SSL verify |
| 4 | API tasas banco central | `https://preenvios.com/api/tasas-banco-central` | Keyword match: `"tasa"` + SSL verify |

**Frecuencia de chequeo:** 30 segundos (default del plan Free).

El checklist paso-a-paso completo está en [CHECKLIST_PRE_LANZAMIENTO.md § 11.1](../CHECKLIST_PRE_LANZAMIENTO.md) — "TAREA POST-DNS".

### Destinatarios de alertas

- **Email — `aneurysoto@gmail.com`** (personal del founder): alertas directo a inbox personal
- **Email — `contact@preenvios.com`** (Zoho Mail): inbox compartido de negocio
- **Por qué dos:** redundancia básica sin complicación. Si uno se va a spam o se pierde, el otro llega. No se usa Slack ni SMS.
- **Escalación:** ninguna — ambos destinatarios reciben simultáneamente
- **Umbral:** 2 fallos consecutivos antes de alertar (BetterStack default, evita falsos positivos por glitches de red)

### Status page pública

- **Subdominio:** `status.preenvios.com`
- **Configuración DNS:** CNAME de `status.preenvios.com` → valor que BetterStack provee en su dashboard (formato típico: `statuspage.betteruptime.com` o similar)
- **Utilidad:** artefacto público de confianza, útil para partners (bancos, redes de afiliados) al negociar acuerdos

### Por qué email-only en esta etapa (sin webhook ni UI en admin panel)

Decisión tomada el **2026-04-20**. Justificación:

1. **Un solo operador humano** (founder único). Agregar canales internos (Slack, Discord, panel admin) no aporta redundancia — la alerta llega al mismo cerebro igual
2. **Reducir superficie de mantenimiento.** Webhook + tabla Supabase + UI en `/admin` agregaría ~1.5-2h de trabajo + código a mantener para cero beneficio operativo en esta etapa
3. **Email + status page pública ya son el estándar de la industria** para proyectos pre-lanzamiento de este tamaño
4. **La integración custom queda documentada como Fase 3 futura** si alguna de estas condiciones cambia:
   - El equipo crece a 2+ operadores (necesario distribuir alertas)
   - Tráfico justifica on-call rotativo
   - Se quiere dashboard interno con estado agregado (BetterStack + Sentry + analytics en un solo lugar)

### Progreso y acciones pendientes

**✅ Completado 2026-04-19/20:**
- Signup en [betterstack.com](https://betterstack.com) con plan free
- Team Members configurados: `aneurysoto@gmail.com` (personal) + `contact@preenvios.com`
- Canal email (sin Slack, sin SMS, sin webhook — decisión consciente)

**🔴 Pausado por problema DNS:**
- 4 monitores fueron creados y luego eliminados porque `preenvios.com` apunta a GitHub Pages del MVP viejo (ver histórico arriba). Decisión: no mantener monitores con URLs temporales de Vercel staging porque BetterStack arrastró URLs antiguas internamente y porque habría que recrearlos igual al hacer el cutover.

**🟡 Pendiente el día del DNS cutover:**
1. **Recrear los 4 monitores desde cero** con URLs finales de `preenvios.com` (ver tabla de la sección anterior)
2. **Asignar los 2 team members como destinatarios** de cada monitor
3. **SSL/TLS verification activado** en los 4 (toggle por-monitor en BetterStack)
4. **Smoke test:** pausar un monitor → esperar 2-3 min → verificar que llega email a `aneurysoto@gmail.com` Y `contact@preenvios.com`
5. **Crear Status Page pública:**
   - BetterStack dashboard → Status Pages → New
   - Agregar los 4 monitores recién creados
   - Subdominio: `status.preenvios.com`
   - BetterStack provee un valor CNAME (típicamente `statuspage.betteruptime.com` o similar)
6. **Configurar CNAME en Namecheap:**
   - Namecheap → dominio preenvios.com → Advanced DNS
   - Add new record: tipo `CNAME`, host `status`, value = el que BetterStack proveyó
7. **Verificar** que `https://status.preenvios.com` carga la página pública (5-30 min de propagación)

Tiempo total estimado del día-del-cutover: **15-20 min** activos + espera pasiva de propagación DNS.

### Timing — por qué no monitoreamos ahora

Intentamos tener BetterStack activo ANTES del DNS cutover apuntando a staging. No funcionó en la práctica:
- `preenvios.com` va a GitHub Pages (MVP viejo) → los endpoints Next.js no existen ahí
- `preenvios.vercel.app` SÍ tiene los endpoints, pero BetterStack arrastró las URLs viejas internamente

Conclusión: esperar al cutover. El costo de oportunidad (0 monitoring durante ~10 días antes del lanzamiento) es bajo porque el staging tiene tráfico mínimo y bugs de producción aún no aplican.

---

## Fase 2 — Sentry (application errors)

### Proveedor y plan

- **Proveedor:** [Sentry](https://sentry.io/)
- **Producto:** Sentry for Next.js (`@sentry/nextjs`)
- **Plan:** Developer (Free)
- **Límites relevantes del free tier:**
  - 5,000 eventos (errors + transactions)/mes
  - 1 usuario en la org
  - 50 replays/mes
  - 30 días de retención de datos
- **Costo mensual:** $0

### Instalación en el proyecto (completada 2026-04-20)

Código instalado, pendiente que user configure `SENTRY_DSN` en Vercel para activar el envío real.

**Archivos creados/modificados:**
- `instrumentation.ts` — carga Sentry en runtime Node.js o Edge según corresponda
- `instrumentation-client.ts` — init del SDK client-side
- `sentry.server.config.ts` — config server (Node runtime)
- `sentry.edge.config.ts` — config edge runtime
- `next.config.ts` — wrapped con `withSentryConfig` (sin source map upload hasta que se configure `SENTRY_AUTH_TOKEN`)
- `.env.example` — agregadas `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`

**Behavior sin DSN configurado:**
- El SDK inicializa con `enabled: !!process.env.SENTRY_DSN` (o su equivalente `NEXT_PUBLIC_`)
- Si el DSN está vacío → no-op, no envía nada, no lanza errores
- El build funciona sin problemas aunque las env vars de Sentry falten

### Acción manual pendiente del user

1. Signup free en [sentry.io](https://sentry.io)
2. Create project → `Next.js` → copiar el DSN que se genera
3. Settings → Auth Tokens → crear token con scope de source map upload (opcional, habilita stack traces con código fuente original)
4. Vercel → Project Settings → Environment Variables (los 3 entornos):
   - `NEXT_PUBLIC_SENTRY_DSN` = `<dsn completo, ej. https://...@o123456.ingest.sentry.io/7890>`
   - `SENTRY_DSN` = el mismo DSN (para server-side init)
   - `SENTRY_ORG` = slug de la org en Sentry
   - `SENTRY_PROJECT` = slug del proyecto en Sentry
   - `SENTRY_AUTH_TOKEN` = (opcional, habilita source map upload)
5. Redeploy — Sentry empieza a capturar errores automáticamente
6. Smoke test: crear un error intencional en producción (ej. visitar `/api/test-sentry` con un throw) y verificar que aparece en el dashboard de Sentry

### Qué captura Sentry automáticamente

- **Server-side:** excepciones en API routes, errores en Server Components, errores en middleware
- **Client-side:** errores en Client Components, unhandled promise rejections, errores en event handlers
- **Edge runtime:** errores en middleware edge
- **Performance (samplerate 10%):** traces de requests lentos, queries lentos a Supabase, etc.

### Por qué Sentry complementa BetterStack

| Aspecto | BetterStack | Sentry |
|---------|-------------|--------|
| Detecta sitio caído (5xx masivo) | ✅ | ⚠️ solo si llega la exception |
| Detecta sitio arriba pero rompiendo (ej. `/api/precios` 200 pero array vacío) | ⚠️ solo con keyword match simple | ✅ stack trace completo |
| Excepciones específicas de React (hidration errors, etc.) | ❌ | ✅ |
| Errores que afectan a 1% de users | ❌ (no lo ve) | ✅ agrupado |
| Performance profiling | ❌ | ✅ |
| Rate de alertas | Agresivo (cualquier fallo) | Inteligente (agrupación + deduplicación) |

BetterStack contesta *"¿está prendido?"*. Sentry contesta *"¿funciona bien?"*. Son complementarios, no redundantes.

---

## Cierre de H-09.1

La auditoría #01 pide Sentry o Logtail. Con **Fase 1 (BetterStack) + Fase 2 (Sentry)** se cumple y se supera:

- ✅ Uptime monitoring con alertas
- ✅ Error tracking con stack traces
- ✅ Performance monitoring básico (traces)
- ✅ Status page pública (valor agregado para partners)
- ✅ SSL cert monitor

H-09.1 pasa de 🟡 FAIL → 🟢 PASS cuando:
1. User completa signup BetterStack y confirma los 5 monitores activos + email smoke test
2. User completa signup Sentry, agrega `SENTRY_DSN` en Vercel, y un error de prueba aparece en el dashboard

Hasta ambos pasos, el estado es **🟡 en proceso — Fase 1/2 pendiente de setup manual por el user**.

---

## Fase 3 (futura, no prioritaria)

Si el equipo crece o el tráfico justifica observabilidad más profunda:

- **Logtail / BetterStack Logs** — log aggregation estructurado (complementa los console.log que hoy ven Vercel Functions logs)
- **Webhook BetterStack → tabla Supabase → admin panel UI** — dashboard interno consolidado (requiere ~1.5-2h trabajo)
- **Sentry Alerts avanzadas** — Slack/Discord webhook de Sentry para errores nuevos (free tier Sentry soporta)
- **Sentry Replay** — grabación de sesiones con errores (free tier tiene cupo de 50/mes)

No se implementan hoy. Documentados aquí para que no se olviden.

---

## Relacionados

- [01_auditoria_2026_04_19.md § A09](01_auditoria_2026_04_19.md) — hallazgos H-09.1 y H-09.2 originales
- [../SERVICIOS_EXTERNOS.md](../SERVICIOS_EXTERNOS.md) — BetterStack y Sentry como servicios del stack
- [../CONTEXTO_FINAL.md](../CONTEXTO_FINAL.md) — visión de producto
