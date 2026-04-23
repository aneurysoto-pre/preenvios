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

## Relacionados

- Proceso 24 — Agente 1 validador de ingress (primer agente de Fase 7).
- Proceso 26 — Cookie consent (infra seguridad previa).
- Proceso 27 — Separación DB preview vs prod (permite smoke tests sin
  tocar clientes reales).
- Proceso 28 — Scrapers diferidos (relevante: threshold `precios < 30`
  podría dispararse falso mientras scrapers estén rotos en preview).
- CONTEXTO_FINAL Fase 7 — Agentes 2, 4, 5 pendientes de construir.
