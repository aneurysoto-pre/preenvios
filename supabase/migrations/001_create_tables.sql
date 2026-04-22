-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 001: Tablas base
-- Fase 1 Bloque 2 · 2026-04-16
-- ═══════════════════════════════════════════════════════

-- Tabla de corredores activos
CREATE TABLE IF NOT EXISTS corredores (
  id TEXT PRIMARY KEY,                          -- 'honduras', 'dominican_republic', etc.
  nombre TEXT NOT NULL,                         -- 'Honduras', 'Rep. Dominicana'
  nombre_en TEXT NOT NULL,                      -- 'Honduras', 'Dominican Republic'
  moneda TEXT NOT NULL,                         -- 'HNL', 'DOP', 'GTQ', 'USD'
  simbolo TEXT NOT NULL,                        -- 'L', 'RD$', 'Q', '$'
  bandera TEXT NOT NULL,                        -- emoji flag
  codigo_pais TEXT NOT NULL,                    -- 'hn', 'do', 'gt', 'sv'
  tasa_banco_central NUMERIC(12,4) DEFAULT 0,  -- tasa de referencia del banco central
  activo BOOLEAN DEFAULT TRUE,
  prioridad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de precios por operador/corredor/método de entrega
CREATE TABLE IF NOT EXISTS precios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  operador TEXT NOT NULL,                       -- 'remitly', 'wise', etc.
  corredor TEXT NOT NULL REFERENCES corredores(id),
  metodo_entrega TEXT NOT NULL DEFAULT 'bank',  -- enum (2026-04-22): 'bank', 'cash_pickup', 'home_delivery', 'mobile_wallet' — enforced por Agente 1 (lib/scrapers/validator.ts)
  tasa NUMERIC(12,4) NOT NULL DEFAULT 0,
  fee NUMERIC(8,2) NOT NULL DEFAULT 0,
  velocidad TEXT NOT NULL DEFAULT 'Minutos',    -- 'Segundos', 'Minutos', 'Horas', 'Días'
  nombre_operador TEXT NOT NULL,                -- 'Remitly', 'Wise', etc.
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  afiliado BOOLEAN DEFAULT FALSE,
  link TEXT DEFAULT '',
  confiabilidad INTEGER DEFAULT 50,             -- 0-100, basado en años + licencia
  metodos_disponibles INTEGER DEFAULT 1,        -- cantidad de métodos que soporta
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(operador, corredor, metodo_entrega)
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_precios_corredor ON precios(corredor);
CREATE INDEX IF NOT EXISTS idx_precios_operador_corredor ON precios(operador, corredor);
CREATE INDEX IF NOT EXISTS idx_precios_corredor_metodo ON precios(corredor, metodo_entrega);

-- RLS: lectura pública (no requiere autenticación)
ALTER TABLE corredores ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "corredores_public_read" ON corredores FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "precios_public_read" ON precios FOR SELECT USING (true);
