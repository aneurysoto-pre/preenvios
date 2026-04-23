-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 009: Limpieza residuos Nicaragua + Haití (PROD)
-- 2026-04-23 · ejecutada en prod antes de commitear (ver historia abajo)
-- ═══════════════════════════════════════════════════════════════════════
-- Contexto: los commits de limpieza del 2026-04-22 (12bbc6e, 8ae146e,
-- 5b32854, 9eaae25) removieron referencias a Nicaragua y Haití del código,
-- scripts y docs — pero NO ejecutaron DELETE en Supabase prod. Esta
-- migración cierra el gap.
--
-- Detectado 2026-04-23 durante smoke test B.3 del Agente 3 (DB health
-- monitor): prod tenía 8 corredores + 8 tasas_bancos_centrales en vez de
-- los 6 MVP esperados, causando 2 falsos positivos en el endpoint.
--
-- Filas borradas (confirmadas con queries diagnósticas 2026-04-23):
--   - corredores:              2 filas (nicaragua, haiti)
--   - tasas_bancos_centrales:  2 filas (nicaragua, haiti)
--   - precios:                14 filas (7 nicaragua + 7 haiti)
--   - scraper_anomalies:       0 filas (scrapers rotos desde 2026-04-17)
--   Total: 18 filas
--
-- Historia de ejecución:
--   1. SQL compartido en chat con founder para revisión (2026-04-23).
--   2. Founder ejecutó en Supabase prod SQL Editor.
--   3. Verificación 2a/2b/2c pasaron — 18 filas backed up, 6 MVP intactos.
--   4. Smoke test B.3 post-cleanup retornó issues: [] (prod sana).
--   5. Archivo commiteado al repo para auditoría + eventual recreación.
--
-- Diseño:
--   - Atómica (BEGIN/COMMIT): si algún paso falla, nada se borra.
--   - Backup persistente (no TEMP): tabla dedicada para auditoría y
--     eventual rollback manual. Se conserva indefinidamente.
--   - Idempotente: safe de re-ejecutar. CREATE TABLE IF NOT EXISTS +
--     INSERT desde fuentes (que quedan vacías post-primera corrida) +
--     DELETE con WHERE (que matchea 0 filas post-primera corrida).
--   - Orden de DELETE respeta FK: precios → tasas_bancos_centrales →
--     corredores. Si invertimos, FK constraint viola en precios.
--
-- NOTA IMPORTANTE: este archivo vive en supabase/migrations/ pero NO se
-- incluye automáticamente en el script `preview_setup_all.sql` que inicia
-- una DB preview desde cero, porque el problema que resuelve es específico
-- del drift histórico de prod (preview nunca tuvo nicaragua/haiti — el
-- seed de preview ya seedea solo los 6 MVP). Correr este SQL en preview
-- no rompe nada (idempotente, DELETE matchea 0 filas) pero es innecesario.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- Paso 1 — Crear tabla backup persistente (IF NOT EXISTS = idempotente)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS backup_nicaragua_haiti_cleanup_2026_04_23 (
  backup_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tabla_origen TEXT NOT NULL,
  row_data JSONB NOT NULL,
  backed_up_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE backup_nicaragua_haiti_cleanup_2026_04_23 IS
  'Snapshot de 18 filas residuales Nicaragua/Haití borradas en migración 009 (2026-04-23). Conservar indefinidamente para auditoría. Restaurar con INSERT ... SELECT row_data->>campo... si hace falta.';

-- RLS: deny anon — solo service_role puede leer esta tabla.
ALTER TABLE backup_nicaragua_haiti_cleanup_2026_04_23 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "backup_cleanup_deny_anon_select" ON backup_nicaragua_haiti_cleanup_2026_04_23;
CREATE POLICY "backup_cleanup_deny_anon_select"
  ON backup_nicaragua_haiti_cleanup_2026_04_23
  FOR SELECT TO anon USING (false);

-- ───────────────────────────────────────────────────────────────────────
-- Paso 2 — Snapshot de las 18 filas antes de borrar
--   Idempotente: si el script ya corrió antes, las fuentes están vacías
--   de nicaragua/haiti y el INSERT no agrega filas nuevas.
-- ───────────────────────────────────────────────────────────────────────

-- 2a. Backup precios (14 filas esperadas)
INSERT INTO backup_nicaragua_haiti_cleanup_2026_04_23 (tabla_origen, row_data)
SELECT 'precios', to_jsonb(p.*)
FROM precios p
WHERE corredor IN ('nicaragua', 'haiti');

-- 2b. Backup tasas_bancos_centrales (2 filas esperadas)
INSERT INTO backup_nicaragua_haiti_cleanup_2026_04_23 (tabla_origen, row_data)
SELECT 'tasas_bancos_centrales', to_jsonb(t.*)
FROM tasas_bancos_centrales t
WHERE id IN ('nicaragua', 'haiti');

-- 2c. Backup corredores (2 filas esperadas)
INSERT INTO backup_nicaragua_haiti_cleanup_2026_04_23 (tabla_origen, row_data)
SELECT 'corredores', to_jsonb(c.*)
FROM corredores c
WHERE id IN ('nicaragua', 'haiti');

-- ───────────────────────────────────────────────────────────────────────
-- Paso 3 — DELETE respetando FK (precios → tasas_bc → corredores)
-- ───────────────────────────────────────────────────────────────────────

-- 3a. Borrar precios FIRST (tiene FK a corredores.id)
DELETE FROM precios
WHERE corredor IN ('nicaragua', 'haiti');

-- 3b. Borrar tasas_bancos_centrales (no tiene FK pero conceptualmente va aquí)
DELETE FROM tasas_bancos_centrales
WHERE id IN ('nicaragua', 'haiti');

-- 3c. Borrar corredores LAST (ahora sin referrers)
DELETE FROM corredores
WHERE id IN ('nicaragua', 'haiti');

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- Verificación post-run (correr en queries separadas, no dentro del BEGIN)
-- ═══════════════════════════════════════════════════════════════════════

-- SELECT
--   (SELECT COUNT(*) FROM corredores)                                             AS corredores_total,
--   (SELECT COUNT(*) FROM tasas_bancos_centrales)                                 AS tasas_bc_total,
--   (SELECT COUNT(*) FROM precios WHERE corredor IN ('nicaragua', 'haiti'))       AS precios_residuales,
--   (SELECT COUNT(*) FROM backup_nicaragua_haiti_cleanup_2026_04_23)              AS backup_rows;
--
-- Esperado: 6, 6, 0, 18

-- SELECT tabla_origen, COUNT(*) AS filas_backed_up
-- FROM backup_nicaragua_haiti_cleanup_2026_04_23
-- GROUP BY tabla_origen
-- ORDER BY tabla_origen;
--
-- Esperado: corredores=2, precios=14, tasas_bancos_centrales=2
