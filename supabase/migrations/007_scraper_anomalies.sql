-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 007: Tabla scraper_anomalies
-- Agente 1 (Validador de ingress) · Fase 7 defense-in-depth
-- 2026-04-22
-- ═══════════════════════════════════════════════════════
-- Registra cada fila rechazada por validatePrice() antes de escribir
-- en tabla `precios`. Permite:
-- 1. Debugging post-mortem: qué scraper envió qué valor inválido.
-- 2. Counter serverless-safe: checkConsecutiveAnomalies() consulta
--    esta tabla para decidir si marcar scraper como stale (3+ anomalías
--    del mismo par operador+corredor en la última hora).
-- 3. Observabilidad: el founder puede ver dashboard "qué scraper falla"
--    directo desde Supabase Table Editor.
--
-- RLS: anon NO puede leer ni escribir. Solo service_role (vía
-- lib/scrapers/base.ts y lib/scrapers/validator.ts) escribe.
--
-- COPY-PASTE READY para Supabase SQL Editor. Idempotente.

CREATE TABLE IF NOT EXISTS scraper_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  operador TEXT NOT NULL,
  corredor TEXT NOT NULL,
  metodo_entrega TEXT NOT NULL DEFAULT 'bank',
  campo_invalido TEXT NOT NULL,
  valor_recibido TEXT,
  valor_esperado_min NUMERIC,
  valor_esperado_max NUMERIC,
  valor_esperado_enum TEXT,
  mensaje TEXT NOT NULL,
  raw_price JSONB
);

-- Index primario para checkConsecutiveAnomalies(): consulta por
-- (operador, corredor) ordenado por created_at DESC con limit 3.
CREATE INDEX IF NOT EXISTS scraper_anomalies_op_corr_created_idx
  ON scraper_anomalies (operador, corredor, created_at DESC);

-- Index secundario para dashboards/queries del founder (últimas 24h).
CREATE INDEX IF NOT EXISTS scraper_anomalies_created_idx
  ON scraper_anomalies (created_at DESC);

ALTER TABLE scraper_anomalies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_select" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_select" ON scraper_anomalies
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_insert" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_insert" ON scraper_anomalies
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_update" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_update" ON scraper_anomalies
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_delete" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_delete" ON scraper_anomalies
  FOR DELETE TO anon USING (false);

-- Verificación post-run:
-- SELECT
--   (SELECT count(*) FROM information_schema.tables WHERE table_name='scraper_anomalies') AS tabla_existe,
--   (SELECT count(*) FROM pg_policies WHERE tablename='scraper_anomalies') AS policies_count,
--   (SELECT count(*) FROM pg_indexes WHERE tablename='scraper_anomalies') AS indexes_count;
--
-- Esperado: tabla_existe=1, policies_count=4, indexes_count=3 (pk + 2 secundarios)
