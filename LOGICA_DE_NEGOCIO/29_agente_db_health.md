# Proceso 29 — Agente 3: DB health monitor (Fase 7 defense-in-depth)

## Descripción

Segundo agente activo del stack defense-in-depth (después del Agente 1
validador de ingress). Corre cada 30 min como `pg_cron` en Supabase,
hace POST via `pg_net` al endpoint Next.js `/api/agents/db-health`, que
ejecuta 6 queries `COUNT()` sobre tablas críticas, compara contra
thresholds absolutos, y emite eventos a Sentry con fingerprints por
(tabla, métrica) para agrupación correcta.

Implementado el 2026-04-23 en branch `test/agent-db-health`:
- Commit `5ea5a9c` — lib + endpoint
- Commit `87cd5a8` — fix fingerprint Sentry
- Commit `e8e7c15` — migration SQL 008

## Por qué existe

El Agente 1 (validador de ingress) protege el boundary donde los
scrapers escriben en `precios`. Pero no ve data escrita por otras vías:
- Form `/contacto` inserta en `contactos` directamente desde anon users.
- Scrapers rechazados generan filas en `scraper_anomalies` que pueden
  acumularse sin control si todos los scrapers empiezan a fallar.
- Row counts totales de tablas fundacionales (`corredores`,
  `tasas_bancos_centrales`) son invariantes del producto — un cambio
  accidental rompe el comparador.

El Agente 3 observa el estado de la DB en vez de su flujo de escritura.
Es el "cámara de seguridad" del storage layer.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  Supabase preenvios (o preenvios-preview)                   │
│                                                             │
│  pg_cron schedule '*/30 * * * *'                            │
│     ↓                                                       │
│  pg_net.http_post                                           │
│     ├─ url: https://preenvios.vercel.app/api/agents/db-health│
│     ├─ Authorization: Bearer {vault.cron_secret}            │
│     └─ (preview only) x-vercel-protection-bypass:            │
│              {vault.vercel_bypass_token}                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Vercel — /api/agents/db-health (Next.js route handler)     │
│                                                             │
│  1. Valida Authorization Bearer matches CRON_SECRET env var │
│  2. Crea supabase client con SUPABASE_SERVICE_ROLE_KEY       │
│  3. Invoca checkDbHealth(supabase) de lib/agents/db-health.ts│
│  4. Por cada issue detectado → Sentry.captureMessage con    │
│     fingerprint ['db_health', issue.table, issue.metric]    │
│  5. Retorna JSON con { ok, issues, counts, timing_ms }      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Sentry (javascript-nextjs project)                         │
│                                                             │
│  Issues agrupados por fingerprint — 1 issue por              │
│  combinación (table, metric). Escalation y alertas           │
│  configurables por issue individualmente.                    │
└─────────────────────────────────────────────────────────────┘
```

## Qué monitorea y con qué thresholds

Thresholds v1 absolutos (no ratios) porque aún no hay baseline real.
Post-launch con 7 días de data se evalúa migrar a ratios "5x vs
baseline" como dice CONTEXTO_FINAL Fase 7 Agente 3.

| Tabla | Métrica | Threshold v1 | Razón |
|-------|---------|--------------|-------|
| `contactos` | inserts últimas 1h | `> 20` | Legítimo ~1-5/día. >20/h es bot/spam attack. |
| `contactos` | inserts últimas 24h | `> 100` | Ataque sostenido (no spike aislado). |
| `scraper_anomalies` | inserts últimas 1h | `> 50` | Validator rechaza sistemático — scrapers devuelven basura. |
| `precios` | total rows | `< 30` o `> 200` | Hoy ~42 filas (6×7). <30 = pérdida masiva. >200 = escritura descontrolada. |
| `corredores` | total rows | `≠ 6` | 6 MVP exactos. Desviación = alteración de referencia. |
| `tasas_bancos_centrales` | total rows | `≠ 6` | Idem. |

**Consideración con scrapers rotos (2026-04-17):** el threshold
`precios < 30` dispara falsamente mientras preview esté seedeado con
solo 14-15 filas (MX+CO de migration 006). En prod no dispara porque hay
~42 filas. Cuando se reactiven scrapers post-LLC (Proceso 28), validar
que este threshold sigue haciendo sentido.

## Archivos del agente

| Archivo | Rol |
|---------|-----|
| [lib/agents/db-health.ts](../lib/agents/db-health.ts) | Función pura `checkDbHealth(supabase) → { issues, counts, timing_ms }`. Patrón alineado con `lib/scrapers/validator.ts` — sin side effects, testeable en aislamiento. |
| [app/api/agents/db-health/route.ts](../app/api/agents/db-health/route.ts) | Endpoint POST con auth `CRON_SECRET`. Invoca la lib, envía Sentry events con fingerprint, retorna JSON. `maxDuration: 30` (cap Next.js, más generoso que cap duro de `pg_net` de 5s para permitir runs manuales via curl). |
| [supabase/migrations/008_agent_db_health_cron.sql](../supabase/migrations/008_agent_db_health_cron.sql) | SQL idempotente para habilitar extensiones + registrar cron. Tiene 2 bloques: (1) smoke test manual activo; (2) `cron.schedule` comentado hasta post-merge a main + edición para prod. |

## Auth y secrets

**CRON_SECRET** (Vercel env var, scope Production+Preview+Development):
- Valor único compartido entre `/api/scrape` y `/api/agents/db-health`.
- En Supabase Vault: secret `cron_secret` con el mismo valor.

**vercel_bypass_token** (solo preview):
- Protection Bypass for Automation token de Vercel.
- En Supabase Vault preview: secret `vercel_bypass_token`.
- NO existe en prod Vault — preenvios.vercel.app (alias de prod) no tiene
  Deployment Protection activa, entonces pg_net llama al endpoint prod
  directamente sin header de bypass.

Rotación: si cualquiera de los dos secrets rota, actualizar en los 3
lugares (Vercel env vars, Supabase Vault, endpoint test manual si aplica).

## Diferencias preview vs prod

| Aspecto | Preview | Prod |
|---------|---------|------|
| URL del endpoint | `https://preenvios-git-<branch>-aneurysoto-pres-projects.vercel.app/api/agents/db-health` | `https://preenvios.vercel.app/api/agents/db-health` |
| Bypass header | ✅ sí — `x-vercel-protection-bypass` leído de Vault | ❌ no — prod no tiene Deployment Protection |
| Supabase project | `preenvios-preview` (DB aislada) | `preenvios` (DB real) |
| Cron schedule | Comentado en migration 008. Solo smoke test manual activo. | Activar con schedule `*/30 * * * *` post-merge a main. |

El SQL del commit 2 (migration 008) tiene todo esto comentado explícito
para que quien lo lea en 6 meses sepa qué cambiar al activarlo en prod.

## Flujo de ejecución (en prod, post-activación)

1. Cada 30 min, pg_cron dispara el job `agent-db-health` en Supabase prod.
2. pg_net ejecuta el POST async al endpoint. La response queda en
   `net._http_response` hasta 6h.
3. El endpoint valida auth, corre `checkDbHealth()` (~500ms-2s con data
   real según mediciones), y retorna JSON.
4. Por cada issue detectado, emite Sentry event con level `warning`.
5. Sentry agrupa por fingerprint. Si hay un issue nuevo (primera vez),
   crea un issue. Si recurre, incrementa el count del issue existente.
6. La columna `cron.job_run_details.status` queda `succeeded` o `failed`.
   Si falla 3+ corridas consecutivas: alerta manual del founder al
   revisar Sentry (no hay auto-alert builtin aún).

## Performance observada en preview (2026-04-23)

Medición 10 runs del endpoint con curl (smoke test 2.3):

| Métrica | Valor |
|---------|-------|
| Min | 0.67s |
| p50 | ~1.2s |
| p95 | ~2.0s |
| Max | 2.05s |
| Cold start observado (tanda anterior) | 3.09s |

**Margen vs cap duro de pg_net (5s):** aprox 1.9s en cold start, 3s en
warm runs. Aceptable para v1.

**Trigger de re-evaluación:** si el endpoint empieza a tardar
consistentemente >3.5s, optimizar con Promise.all paralelizando los 6
queries `COUNT()` (son independientes). Fix de ~15 min que baja el worst
case a ~1.5s. Se puede hacer en Fase 10 bloque F si se necesita.

## Plan B — Migración a Edge Function Deno (si timeout 5s se vuelve problema)

El cap de 5s de pg_net es duro. Si en algún momento el endpoint
sistemáticamente pasa los 4s y no podemos optimizar más con Promise.all,
la migración de escape es mover la lógica a una Supabase Edge Function
(Deno runtime) que no tiene ese cap.

**Razón por la que NO lo hicimos de entrada (2026-04-23):**
- Agrega stack (Deno + Supabase CLI) al proyecto que solo tiene TS Next.
- Los tiempos actuales están bien por debajo del cap.
- Lock-in: más código Supabase-specific si eventualmente se migra de proveedor.

**Cómo migrar (si hace falta en el futuro):**

1. **Instalar Supabase CLI** local (`npm install -g supabase` o via brew).
2. **Crear directorio** `supabase/functions/agent-db-health/` con:
   - `index.ts` — handler Deno que replica la lógica de
     `app/api/agents/db-health/route.ts`. Importa de
     `https://esm.sh/@supabase/supabase-js` en lugar de npm.
3. **Portar** `lib/agents/db-health.ts` a Deno-compatible:
   - Cambiar imports a URL remotas (`esm.sh`).
   - Mantener el tipado y lógica idéntica.
4. **Deploy:** `supabase functions deploy agent-db-health --project-ref <ref>`.
5. **Actualizar SQL 008** — cambiar el `url` del `net.http_post` a:
   `https://<project-ref>.functions.supabase.co/agent-db-health`
   y el header `Authorization` usa el anon key de Supabase en lugar de
   CRON_SECRET (o mantener CRON_SECRET si se valida en el Deno handler).
6. **Beneficio:** Deno en Supabase no tiene el cap de 5s — timeout por
   default es 150s.
7. **Tradeoff:** tests unitarios necesitan adaptación (Vitest → Deno
   test runner). Mantener ambos stacks en paralelo es fricción.

**Trigger específico para ejecutar el plan B:**
- Promise.all ya aplicado y **aún así** el endpoint tarda sistemáticamente
  >3.5s sobre 7 días de mediciones (indicaría que las tablas crecieron
  mucho y COUNT() se volvió caro — aunque improbable con índices).
- **O** se agregan >3 tablas nuevas al monitor y el total supera 5s
  incluso paralelizado.

**Tiempo estimado de la migración:** ~4-6h (portar lógica + tests Deno +
deploy + actualizar SQL + validar).

## Cómo verificar que funciona (producción)

### Después de activar el cron en prod

1. **Cron registrado:**
   ```sql
   SELECT jobid, jobname, schedule, active
   FROM cron.job
   WHERE jobname = 'agent-db-health';
   ```
   Esperado: 1 fila con `schedule = '*/30 * * * *'`, `active = true`.

2. **Próxima ejecución en <30 min:**
   - Esperar a que el minuto 0 o 30 de la hora próxima pase.
   - Query `cron.job_run_details`:
   ```sql
   SELECT start_time, end_time, status, return_message
   FROM cron.job_run_details
   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'agent-db-health')
   ORDER BY start_time DESC LIMIT 5;
   ```
   Esperado: filas con `status = 'succeeded'`.

3. **Response HTTP del endpoint:**
   ```sql
   SELECT id, status_code, timed_out, error_msg
   FROM net._http_response
   ORDER BY created DESC LIMIT 5;
   ```
   Esperado: `status_code = 200`, `timed_out = false`.

4. **Sentry:**
   - En prod con DB sana (6 corredores, 6 tasas BC, ~42 precios,
     contactos normales) → **cero issues nuevos**.
   - Si aparece algún issue con tag `agent:db_health`: investigar qué
     threshold se cruzó y si es legítimo o falso positivo.

## Criterios de éxito del Agente 3 en prod

- 48 horas corriendo en prod con 0 falsos positivos.
- Log en `cron.job_run_details` consistentemente `succeeded` (sin fallas
  de auth, timeouts, o errores de red).
- Sentry captura correctamente los issues cuando se prueba con un test
  controlado (ej. inyectar 30 contactos y ver que dispara).

## Manual operacional — para founder y empleados

Esta sección está pensada para que cualquier persona (no developer) sepa
qué hace el agente, cómo se entera de un problema, y cómo responder.

### Qué protege en lenguaje simple

El Agente 3 es **la cámara de seguridad de la base de datos**. Cada
30 minutos cuenta cuántas filas hay en las tablas críticas y avisa si
algo se ve raro:

- ¿Llegaron 100 mensajes al form de contacto en 1 hora? → bot atacando
- ¿La tabla de precios tiene solo 5 filas cuando debería tener 42? →
  algo borró data
- ¿La tabla de corredores ya no tiene 6 países sino 5? → alguien
  modificó algo crítico
- ¿El validador del Agente 1 está rechazando 100 filas por hora? →
  algún scraper se rompió en serio

A diferencia del Agente 1 (que vigila lo que ENTRA), el Agente 3 vigila
**el estado total de la DB** — no le importa cómo llegó la data, solo
que los números estén dentro de lo esperado.

### Qué riesgos concretos cubre

| Riesgo | Impacto en el negocio | Cómo lo detecta |
|---|---|---|
| Bot llena form de contacto con spam (100+ mensajes/hora) | Inbox del founder colapsa, ruido bloquea mensajes reales, posible costo en Resend si se responden | `contactos.inserts_1h > 20` o `contactos.inserts_24h > 100` |
| Alguien borra accidentalmente filas de `precios` (`DELETE FROM precios`) | Comparador queda vacío para uno o varios corredores → UX rota | `precios.total_rows < 30` |
| Alguien modifica la tabla `corredores` (≠ 6 países activos) | Menú de país se rompe, country search deja de funcionar | `corredores.total_rows ≠ 6` |
| Cambio accidental de `tasas_bancos_centrales` | Agente 1 empieza a rechazar tasas correctas → cascada de falsos positivos | `tasas_bancos_centrales.total_rows ≠ 6` |
| Validador del Agente 1 rechaza muchas filas porque algún scraper se rompió | Comparador muestra precios stale (sin actualizar) | `scraper_anomalies.inserts_1h > 50` |
| Escritura descontrolada en `precios` (cron desbocado, bug, atacante) | DB se infla con basura | `precios.total_rows > 200` |

**Costo ahorrado por evento prevenido**: detectar un ataque de bot a
las 2 horas en vez de a las 24 = miles de mensajes spam menos. Detectar
una pérdida de data en 30 min en vez de descubrirla por queja de
usuario = posible recuperación de DB rápida.

### Cómo te llega el alert

Cada vez que un threshold se cruza, el agente dispara un evento a
Sentry con **fingerprint custom `[db_health, table, metric]`**. Eso
significa:

- 1 issue distinto por cada combinación de tabla + métrica
- Sin spam: si `precios.total_rows < 30` ocurre 50 veces en 24h, sigue
  siendo 1 solo issue (con 50 events adentro)
- Cada (tabla, métrica) tiene historial separado para análisis

El founder se entera por:

1. **Email de Sentry** (si alertas configuradas) — llega un mail
   "New issue: db_health: <tabla>.<métrica>"
2. **Dashboard de Sentry** — `preenvios.sentry.io` → proyecto
   `javascript-nextjs` → Issues. Buscar `db_health`.

### Cómo verificar Sentry — paso a paso

1. Entrar a `preenvios.sentry.io` con tu cuenta de founder
2. Menú izquierdo → **Issues** → **Errors & Outages**
3. Barra de búsqueda: `db_health`
4. Ver lista — un issue por cada (tabla, métrica) que se haya
   disparado al menos una vez. Ejemplo de issues posibles:
   - `db_health: contactos.inserts_1h`
   - `db_health: contactos.inserts_24h`
   - `db_health: scraper_anomalies.inserts_1h`
   - `db_health: precios.total_rows`
   - `db_health: corredores.total_rows`
   - `db_health: tasas_bancos_centrales.total_rows`
5. Clickear un issue para ver:
   - **Events** (cuántas veces se disparó este threshold)
   - **Last seen** (última vez)
   - **Highlights**: tabla, métrica, valor observado, threshold cruzado
   - **Trace ID** y `release` (commit del agente)

### Cómo distinguir falso positivo vs problema real

**Falso positivo común — `precios.total_rows < 30` en preview**:
- La DB de preview tiene scrapers rotos desde 2026-04-17 (Proceso 28).
  Solo CO+MX están seedeados (~14 filas). El threshold dispara siempre.
- **Cómo detectarlo**: el issue tiene tag `environment=preview`.
- **Acción**: ignorar o resolver en Sentry. NO indica problema en prod.

**Falso positivo — pico legítimo en `contactos`**:
- Caso real: lanzaste una campaña en Instagram y llegaron 30 mensajes
  en 1h. El threshold `>20` se dispara pero es legítimo.
- **Cómo detectarlo**: revisar la tabla `contactos` en Supabase.
  ¿Mensajes parecen reales (escritos por humanos)? ¿Vienen de IPs
  distintas? ¿Tienen patrón de spam?
- **Acción si es legítimo**: marcar resolved en Sentry + considerar
  subir el threshold en `lib/agents/db-health.ts` si ahora tu baseline
  es mayor.

**Problema real — `precios.total_rows < 30` en prod**:
- Prod normalmente tiene 42 filas (6 corredores × 7 operadores). Si baja
  a 5, alguien o algo borró ~37 filas.
- **Cómo detectarlo**: el issue tiene tag `environment=production`.
- **Acción**: investigar AHORA. Mirar Supabase logs, restaurar desde
  backup si necesario.

**Problema real — `contactos.inserts_1h > 20` con mensajes basura**:
- Bot atacando el form. Mensajes vacíos, repetidos, links de spam.
- **Acción**: activar rate limiting más agresivo en `/api/contactos`,
  agregar reCAPTCHA o honeypot, banear IP origen si Vercel lo permite.

### Playbook de respuesta — qué hacer cuando suena

| Issue | Severidad | Acción |
|---|---|---|
| `precios.total_rows < 30` (preview) | Falso positivo conocido | Resolved en Sentry, ignorar hasta reactivar scrapers |
| `precios.total_rows < 30` (prod) | 🚨 CRÍTICO | Revisar Supabase prod inmediatamente. Restaurar desde backup. |
| `precios.total_rows > 200` (cualquier env) | Investigar urgente | Algún cron desbocado o bug en upsert. Pausar `/api/scrape`. |
| `corredores.total_rows ≠ 6` | 🚨 CRÍTICO | Verificar manualmente la tabla. Restaurar las 6 filas si faltan. |
| `tasas_bancos_centrales.total_rows ≠ 6` | 🚨 CRÍTICO | Mismo procedimiento que corredores. |
| `contactos.inserts_1h > 20` | Investigar | Revisar últimos mensajes. Si spam → activar protección extra. Si legítimo → resolved + considerar ajustar threshold. |
| `contactos.inserts_24h > 100` | 🚨 Probable ataque sostenido | Pausar el form, rate limit agresivo, reCAPTCHA. |
| `scraper_anomalies.inserts_1h > 50` | Investigar | El validador está rechazando masivamente — algún scraper se rompió. Cruzar con dashboard del Agente 1. |

### Mantenimiento periódico

- **Semanal** (founder, ~3 min): abrir Sentry → filtrar `db_health`
  últimos 7 días → ver count de issues nuevos. <2 issues = sano.
- **Mensual** (founder o developer): revisar thresholds en
  `lib/agents/db-health.ts`. Si los baselines cambiaron (ej. ahora
  recibimos 50 contactos legítimos por día), ajustar hacia arriba.
- **Post-launch (semana 2 de tráfico real)**: re-evaluar todos los
  thresholds con data real. La doc Proceso 29 menciona migrar de
  thresholds absolutos a ratios "5x baseline" cuando haya data.

### Estado del cron en preview vs prod

| Ambiente | Cron del Agente 3 | Cómo se prueba |
|---|---|---|
| **Preview** (Supabase preenvios-preview) | Comentado en migration 008 — solo smoke test manual disparable | Correr el `SELECT net.http_post(...)` del bloque 2 de la migration |
| **Producción** (Supabase preenvios) | NO activado todavía — pendiente de descomentar bloque 3 + cambiar URL a `preenvios.vercel.app` + remover header de bypass | Post-merge a main |

**Cuando llegue el momento de activar prod**: editar la migración 008
con los cambios marcados en sus comentarios, correr el SQL en Supabase
prod SQL Editor. Después esperar el próximo minuto 0 o 30 de la hora
para ver el primer disparo del cron en `cron.job_run_details`.

### Cuándo escalar a Claude Code o developer

- Threshold se dispara >10 veces en 24h con el mismo valor (algo
  estructural cambió, no es ruido)
- El cron deja de aparecer en `cron.job_run_details` (puede haberse
  desregistrado solo)
- Las queries `COUNT()` empiezan a tardar >3.5s (Plan B en Proceso 29:
  migrar a Supabase Edge Function Deno)
- Querés agregar threshold para una tabla nueva (ej. `alertas_email`
  cuando esté seedeado con data real)

### Resumen para nuevos empleados

> El Agente 3 es la cámara de seguridad de la base de datos. Cada
> 30 minutos mira cuántas filas hay en las tablas que importan y avisa
> a Sentry si algo se ve raro: ya sea un crecimiento extraño (ej. bots
> en el form de contacto) o una pérdida (ej. `precios` baja). Cada
> tipo de anomalía es un issue separado en Sentry. Cuando llega un
> alert, mirá la tabla del playbook arriba — te dice qué tan grave
> es y qué hacer.

---

## Relacionados

- Proceso 24 — Agente 1 validador de ingress (primer agente de Fase 7).
- Proceso 26 — Cookie consent (infra seguridad previa).
- Proceso 27 — Separación DB preview vs prod (permite smoke tests sin
  tocar clientes reales).
- Proceso 28 — Scrapers diferidos (relevante: threshold `precios < 30`
  podría dispararse falso mientras scrapers estén rotos en preview).
- CONTEXTO_FINAL Fase 7 — Agentes 2, 4, 5 pendientes de construir.
