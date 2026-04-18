-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 003: Factor valor_afiliado en ranking
-- Fase 4.2 · 2026-04-18
-- ═══════════════════════════════════════════════════════
-- Agrega 3 columnas a la tabla precios para medir la calidad económica
-- del afiliado (no solo sí/no). Ver lib/ranking.ts calcularValorAfiliado().
--
-- comision_usd: comisión estimada por conversión en USD
-- cookie_dias: duración de cookie (9999 = lifetime)
-- trafico_calificable: fracción 0-1 del tráfico que califica (ej. Xoom solo US Android)

ALTER TABLE precios
  ADD COLUMN IF NOT EXISTS comision_usd NUMERIC(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cookie_dias INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS trafico_calificable NUMERIC(3,2) DEFAULT 1.0;

-- Valores iniciales por operador (aplicar a TODAS las filas de cada operador)
UPDATE precios SET comision_usd = 12, cookie_dias = 9999, trafico_calificable = 1.0  WHERE operador = 'wise';
UPDATE precios SET comision_usd = 12, cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'remitly';
UPDATE precios SET comision_usd = 30, cookie_dias = 45,   trafico_calificable = 1.0  WHERE operador = 'worldremit';
UPDATE precios SET comision_usd = 5,  cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'moneygram';
UPDATE precios SET comision_usd = 10, cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'westernunion';
UPDATE precios SET comision_usd = 8,  cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'ria';
UPDATE precios SET comision_usd = 10, cookie_dias = 30,   trafico_calificable = 0.4  WHERE operador = 'xoom';
