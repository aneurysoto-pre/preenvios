-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 008: Agente 3 DB health cron schedule
-- Fase 7 defense-in-depth · 2026-04-23
-- ═══════════════════════════════════════════════════════════════════════
-- Registra un pg_cron job que cada 30 min hace POST via pg_net al endpoint
-- /api/agents/db-health. El endpoint ejecuta checkDbHealth(), envia issues
-- a Sentry con fingerprint por (table, metric) y retorna JSON resumen.
--
-- Esta migracion es IDEMPOTENTE: unschedule si el job ya existe antes de
-- volver a registrarlo. Safe de re-ejecutar.
--
-- ⚠️ IMPORTANTE — ESTA VERSIÓN ES PARA PREVIEW (preenvios-preview).
-- Diferencias con prod (ver Proceso 29 para SQL adaptado):
-- 1. URL apunta al preview deploy de branch test/agent-db-health.
--    Post-merge a main y borrado de la branch, cambiar a
--    https://preenvios.vercel.app
-- 2. Bypass header x-vercel-protection-bypass solo necesario porque el
--    preview tiene Deployment Protection activa. En prod NO incluir —
--    preenvios.vercel.app (alias de prod) no tiene proteccion.
--
-- 🚨 ESTADO AL COMMITEAR: el cron schedule (bloque 3) esta COMENTADO.
--    Solo el smoke test manual (bloque 2) esta activo. Asi el SQL se
--    puede correr en preview sin activar el cron permanente todavia.
--    El cron scheduled se activa solo post-merge a main + edicion de
--    URL + remocion de bypass header.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Habilitar extensiones (idempotente)
-- ───────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


-- ───────────────────────────────────────────────────────────────────────
-- 2. Smoke test manual (UN solo disparo, NO scheduled)
--    Valida que pg_net alcanza el endpoint con auth + bypass correctos.
-- ───────────────────────────────────────────────────────────────────────

SELECT net.http_post(
  url := 'https://preenvios-git-test-agent-db-health-aneurysoto-pres-projects.vercel.app/api/agents/db-health',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
    'x-vercel-protection-bypass', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'vercel_bypass_token')
  ),
  body := '{}'::jsonb
) AS request_id;

-- Post-run: el request es async. Esperar 5-10 segundos y consultar:
--
--   SELECT
--     id,
--     status_code,
--     content_type,
--     timed_out,
--     error_msg,
--     content::jsonb AS response_body
--   FROM net._http_response
--   ORDER BY created DESC
--   LIMIT 1;
--
-- Esperado: status_code=200, timed_out=false, error_msg=null,
-- content con el JSON del Agente 3 (ok, issues, counts, timing_ms).


-- ───────────────────────────────────────────────────────────────────────
-- 3. Activar cron scheduled (COMENTADO — solo activar post-merge a main)
--
--    Pre-requisitos para descomentar y ejecutar este bloque:
--    a. Branch test/agent-db-health mergeada a main.
--    b. Actualizar URL a 'https://preenvios.vercel.app/api/agents/db-health'.
--    c. REMOVER la linea del header 'x-vercel-protection-bypass'
--       (prod no tiene Deployment Protection).
--    d. Reemplazar la lectura de 'vercel_bypass_token' del Vault por nada.
-- ───────────────────────────────────────────────────────────────────────

-- DO $$
-- BEGIN
--   IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'agent-db-health') THEN
--     PERFORM cron.unschedule('agent-db-health');
--   END IF;
--
--   PERFORM cron.schedule(
--     'agent-db-health',
--     '*/30 * * * *',
--     $cmd$
--     SELECT net.http_post(
--       url := 'https://preenvios-git-test-agent-db-health-aneurysoto-pres-projects.vercel.app/api/agents/db-health',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
--         'x-vercel-protection-bypass', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'vercel_bypass_token')
--       ),
--       body := '{}'::jsonb
--     );
--     $cmd$
--   );
-- END $$;


-- ───────────────────────────────────────────────────────────────────────
-- 4. Queries de verificación (copy-paste individual)
-- ───────────────────────────────────────────────────────────────────────
-- Ver cron job registrado (solo aplica si descomentaste bloque 3):
--
--   SELECT jobid, jobname, schedule, active
--   FROM cron.job
--   WHERE jobname = 'agent-db-health';
--
-- Ver últimas 5 corridas del cron:
--
--   SELECT jobid, start_time, end_time, status, return_message
--   FROM cron.job_run_details
--   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'agent-db-health')
--   ORDER BY start_time DESC LIMIT 5;
--
-- Ver últimas 5 responses HTTP (incluye el smoke test manual):
--
--   SELECT id, status_code, timed_out, error_msg, created
--   FROM net._http_response
--   ORDER BY created DESC LIMIT 5;
--
-- Desregistrar cron (ej. al migrar a prod o desactivar temporalmente):
--
--   SELECT cron.unschedule('agent-db-health');
