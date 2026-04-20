# Monitoring — cierre progresivo de H-09.1

Este archivo documenta la infraestructura de observabilidad de PreEnvios. Es parte del cierre del hallazgo **H-09.1 (A09 Security Logging & Monitoring)** de la [Auditoría #01](01_auditoria_2026_04_19.md).

La implementación está dividida en 2 fases complementarias — cada una cubre una categoría distinta de problema:

| Fase | Herramienta | Cubre | Estado al 2026-04-20 |
|------|-------------|-------|----------------------|
| 1 | BetterStack | Uptime — "¿el sitio está arriba?" | 🟡 Pendiente setup manual user |
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

### Monitores configurados

| # | Nombre | URL | Tipo de chequeo | Frecuencia |
|---|--------|-----|-----------------|------------|
| 1 | Home | `https://preenvios.com/` | HTTP status 2xx/3xx | 30s |
| 2 | API precios | `https://preenvios.com/api/precios?corredor=honduras&metodo=bank` | Keyword match: `"operador"` | 30s |
| 3 | API tasas banco central | `https://preenvios.com/api/tasas-banco-central` | Keyword match: `"tasa"` | 30s |
| 4 | Admin panel | `https://preenvios.com/es/admin` | HTTP status 200 (debe mostrar login form) | 30s |
| 5 | SSL cert | `preenvios.com` | Expiry warning a 30, 14, 7 días | — |

### Destinatario de alertas

- **Email único:** `contact@preenvios.com` (Zoho Mail)
- **Escalación:** ninguna — solo email directo
- **Umbral:** 2 fallos consecutivos antes de alertar (BetterStack default, evita falsos positivos)

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

### Acción manual pendiente del user

1. Signup free en [betterstack.com](https://betterstack.com)
2. Team Members → agregar `contact@preenvios.com` como destinatario de alertas (único o primary)
3. Monitors → crear los 5 de la tabla de arriba
4. Status Page → crear página pública, agregar los monitores, configurar subdominio `status.preenvios.com`
5. Ir a Namecheap → Advanced DNS → agregar el CNAME que BetterStack provee
6. Smoke test: pausar un monitor manualmente y verificar que llega el email al inbox de Zoho

### Timing

Setup recomendado: **antes de activar DNS a preenvios.com**. Los monitores ya pueden apuntar al dominio aunque el DNS apunte a `preenvios-*.vercel.app` en desarrollo (BetterStack chequea por URL, no por DNS del origin).

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
