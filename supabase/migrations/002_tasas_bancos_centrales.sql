-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 002: Tasas bancos centrales
-- 2026-04-17
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tasas_bancos_centrales (
  id TEXT PRIMARY KEY,
  codigo_pais TEXT NOT NULL,
  moneda TEXT NOT NULL,
  nombre_banco TEXT NOT NULL,
  nombre_banco_en TEXT NOT NULL,
  siglas TEXT NOT NULL,
  tasa NUMERIC(12,4) NOT NULL DEFAULT 0,
  nota TEXT DEFAULT '',
  nota_en TEXT DEFAULT '',
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasas_bancos_centrales ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "tasas_bc_public_read" ON tasas_bancos_centrales FOR SELECT USING (true);
