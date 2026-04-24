-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Script de setup completo para DB preview (NO prod)
-- Uso: copy-paste TODO este archivo en Supabase SQL Editor del proyecto
--      "preenvios-preview" (NUEVO, distinto del proyecto de producción).
-- Autor: Claude · 2026-04-23 · FASE 10 BLOQUE K.1
--
-- Qué hace:
--   1. Corre las 7 migraciones 001..007 en orden (idempotente).
--   2. Seedea los 4 corredores MVP originales (Honduras, Rep. Dominicana,
--      Guatemala, El Salvador) + sus tasas de banco central. Los otros 2
--      corredores MVP (México, Colombia) ya vienen en migración 006.
--
-- Resultado esperado post-ejecución:
--   - 8 tablas creadas: corredores, precios, tasas_bancos_centrales,
--     contactos, scraper_anomalies, + posible otras si agregaste futuras.
--   - 6 corredores activos en UI: HN, DO, GT, SV, CO, MX.
--   - 6 tasas banco central.
--   - 21 precios iniciales: 14 de MX/CO (migración 006) + 7 de HN
--     (migración 012, snapshot de prod 2026-04-24). DO/GT/SV aún arrancan
--     sin precios — se completarán cuando esos países se porten al
--     landing editorial (cero scope creep).
--
-- IMPORTANTE: este script NO inserta data sensible (emails de contactos,
-- suscriptores, anomalías) — todo queda vacío para preview.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- Migración 001: Tablas base (corredores + precios)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS corredores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nombre_en TEXT NOT NULL,
  moneda TEXT NOT NULL,
  simbolo TEXT NOT NULL,
  bandera TEXT NOT NULL,
  codigo_pais TEXT NOT NULL,
  tasa_banco_central NUMERIC(12,4) DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  prioridad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS precios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  operador TEXT NOT NULL,
  corredor TEXT NOT NULL REFERENCES corredores(id),
  metodo_entrega TEXT NOT NULL DEFAULT 'bank',
  tasa NUMERIC(12,4) NOT NULL DEFAULT 0,
  fee NUMERIC(8,2) NOT NULL DEFAULT 0,
  velocidad TEXT NOT NULL DEFAULT 'Minutos',
  nombre_operador TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  afiliado BOOLEAN DEFAULT FALSE,
  link TEXT DEFAULT '',
  confiabilidad INTEGER DEFAULT 50,
  metodos_disponibles INTEGER DEFAULT 1,
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(operador, corredor, metodo_entrega)
);

CREATE INDEX IF NOT EXISTS idx_precios_corredor ON precios(corredor);
CREATE INDEX IF NOT EXISTS idx_precios_operador_corredor ON precios(operador, corredor);
CREATE INDEX IF NOT EXISTS idx_precios_corredor_metodo ON precios(corredor, metodo_entrega);

ALTER TABLE corredores ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "corredores_public_read" ON corredores;
CREATE POLICY "corredores_public_read" ON corredores FOR SELECT USING (true);

DROP POLICY IF EXISTS "precios_public_read" ON precios;
CREATE POLICY "precios_public_read" ON precios FOR SELECT USING (true);


-- ───────────────────────────────────────────────────────────────────────
-- Migración 002: Tasas bancos centrales
-- ───────────────────────────────────────────────────────────────────────

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

DROP POLICY IF EXISTS "tasas_bc_public_read" ON tasas_bancos_centrales;
CREATE POLICY "tasas_bc_public_read" ON tasas_bancos_centrales FOR SELECT USING (true);


-- ───────────────────────────────────────────────────────────────────────
-- Migración 003: Factor valor_afiliado en ranking (columnas extra)
-- Nota: los UPDATEs son no-ops porque precios está vacía. OK para preview.
-- ───────────────────────────────────────────────────────────────────────

ALTER TABLE precios
  ADD COLUMN IF NOT EXISTS comision_usd NUMERIC(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cookie_dias INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS trafico_calificable NUMERIC(3,2) DEFAULT 1.0;

UPDATE precios SET comision_usd = 12, cookie_dias = 9999, trafico_calificable = 1.0  WHERE operador = 'wise';
UPDATE precios SET comision_usd = 12, cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'remitly';
UPDATE precios SET comision_usd = 30, cookie_dias = 45,   trafico_calificable = 1.0  WHERE operador = 'worldremit';
UPDATE precios SET comision_usd = 5,  cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'moneygram';
UPDATE precios SET comision_usd = 10, cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'westernunion';
UPDATE precios SET comision_usd = 8,  cookie_dias = 30,   trafico_calificable = 1.0  WHERE operador = 'ria';
UPDATE precios SET comision_usd = 10, cookie_dias = 30,   trafico_calificable = 0.4  WHERE operador = 'xoom';


-- ───────────────────────────────────────────────────────────────────────
-- Migración 004: Tabla contactos (formulario /contacto)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  asunto TEXT NOT NULL CHECK (asunto IN ('general', 'rate', 'partnership', 'other')),
  mensaje TEXT NOT NULL,
  idioma TEXT NOT NULL DEFAULT 'es' CHECK (idioma IN ('es', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  respondido BOOLEAN NOT NULL DEFAULT false,
  respondido_at TIMESTAMPTZ,
  notas_admin TEXT
);

CREATE INDEX IF NOT EXISTS contactos_created_at_idx ON contactos (created_at DESC);
CREATE INDEX IF NOT EXISTS contactos_email_idx ON contactos (email);
CREATE INDEX IF NOT EXISTS contactos_asunto_idx ON contactos (asunto);
CREATE INDEX IF NOT EXISTS contactos_respondido_idx ON contactos (respondido) WHERE respondido = false;

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contactos_deny_anon_select" ON contactos;
CREATE POLICY "contactos_deny_anon_select" ON contactos FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "contactos_deny_anon_insert" ON contactos;
CREATE POLICY "contactos_deny_anon_insert" ON contactos FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "contactos_deny_anon_update" ON contactos;
CREATE POLICY "contactos_deny_anon_update" ON contactos FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "contactos_deny_anon_delete" ON contactos;
CREATE POLICY "contactos_deny_anon_delete" ON contactos FOR DELETE TO anon USING (false);


-- ───────────────────────────────────────────────────────────────────────
-- Migración 005: Activar afiliado WU + MG (UPDATE no-op en preview vacío)
-- ───────────────────────────────────────────────────────────────────────

UPDATE precios SET afiliado = true, link = 'https://www.westernunion.com', actualizado_en = NOW() WHERE operador = 'westernunion';
UPDATE precios SET afiliado = true, link = 'https://www.moneygram.com',     actualizado_en = NOW() WHERE operador = 'moneygram';


-- ───────────────────────────────────────────────────────────────────────
-- Migración 006: México y Colombia (INSERT corredores + tasas + precios)
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO corredores (id, nombre, nombre_en, moneda, simbolo, bandera, codigo_pais, tasa_banco_central, activo, prioridad) VALUES
  ('colombia', 'Colombia', 'Colombia', 'COP', '$', '🇨🇴', 'co', 4150.00, TRUE, 5),
  ('mexico',   'México',   'Mexico',   'MXN', '$', '🇲🇽', 'mx', 17.1500,  TRUE, 6)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  nombre_en = EXCLUDED.nombre_en,
  moneda = EXCLUDED.moneda,
  simbolo = EXCLUDED.simbolo,
  codigo_pais = EXCLUDED.codigo_pais,
  tasa_banco_central = EXCLUDED.tasa_banco_central,
  activo = EXCLUDED.activo,
  prioridad = EXCLUDED.prioridad;

INSERT INTO tasas_bancos_centrales (id, codigo_pais, moneda, nombre_banco, nombre_banco_en, siglas, tasa, nota, nota_en) VALUES
  ('colombia', 'co', 'COP', 'Banco de la República', 'Bank of the Republic', 'BR', 4150.00, '', ''),
  ('mexico',   'mx', 'MXN', 'Banco de México',        'Bank of Mexico',       'BM', 17.1500,  '', '')
ON CONFLICT (id) DO UPDATE SET
  codigo_pais = EXCLUDED.codigo_pais,
  moneda = EXCLUDED.moneda,
  nombre_banco = EXCLUDED.nombre_banco,
  nombre_banco_en = EXCLUDED.nombre_banco_en,
  siglas = EXCLUDED.siglas,
  tasa = EXCLUDED.tasa,
  nota = EXCLUDED.nota,
  nota_en = EXCLUDED.nota_en,
  actualizado_en = NOW();

INSERT INTO precios (operador, corredor, metodo_entrega, tasa, fee, velocidad, nombre_operador, rating, reviews, afiliado, link, confiabilidad, metodos_disponibles) VALUES
  ('remitly',      'colombia', 'bank', 4180.0000, 2.99, 'Minutos',  'Remitly',       4.8, 8421,  TRUE, 'https://www.remitly.com/us/en/colombia',                            80, 3),
  ('wise',         'colombia', 'bank', 4150.0000, 2.50, 'Segundos', 'Wise',          4.9, 12043, TRUE, 'https://wise.com/us/send-money/send-money-to-colombia',             95, 2),
  ('xoom',         'colombia', 'bank', 4120.0000, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE, 'https://www.xoom.com/colombia/send-money',                          90, 3),
  ('ria',          'colombia', 'bank', 4130.0000, 0.00, 'Minutos',  'Ria',           4.6, 5200,  TRUE, 'https://www.riamoneytransfer.com/us/en/send-money-to/colombia',     85, 4),
  ('worldremit',   'colombia', 'bank', 4100.0000, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE, 'https://www.worldremit.com/en/send-money/united-states/colombia',   75, 4),
  ('westernunion', 'colombia', 'bank', 4090.0000, 0.00, 'Minutos',  'Western Union', 4.5, 15820, TRUE, 'https://www.westernunion.com',                                      95, 3),
  ('moneygram',    'colombia', 'bank', 4050.0000, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  TRUE, 'https://www.moneygram.com',                                         85, 3)
ON CONFLICT (operador, corredor, metodo_entrega) DO UPDATE SET
  tasa = EXCLUDED.tasa,
  fee = EXCLUDED.fee,
  velocidad = EXCLUDED.velocidad,
  nombre_operador = EXCLUDED.nombre_operador,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  afiliado = EXCLUDED.afiliado,
  link = EXCLUDED.link,
  confiabilidad = EXCLUDED.confiabilidad,
  metodos_disponibles = EXCLUDED.metodos_disponibles,
  activo = TRUE,
  actualizado_en = NOW();

INSERT INTO precios (operador, corredor, metodo_entrega, tasa, fee, velocidad, nombre_operador, rating, reviews, afiliado, link, confiabilidad, metodos_disponibles) VALUES
  ('remitly',      'mexico', 'bank', 17.2000, 2.99, 'Minutos',  'Remitly',       4.8, 8421,  TRUE, 'https://www.remitly.com/us/en/mexico',                            80, 3),
  ('wise',         'mexico', 'bank', 17.1500, 2.50, 'Segundos', 'Wise',          4.9, 12043, TRUE, 'https://wise.com/us/send-money/send-money-to-mexico',             95, 2),
  ('xoom',         'mexico', 'bank', 17.0000, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE, 'https://www.xoom.com/mexico/send-money',                          90, 3),
  ('ria',          'mexico', 'bank', 17.0500, 0.00, 'Minutos',  'Ria',           4.6, 5200,  TRUE, 'https://www.riamoneytransfer.com/us/en/send-money-to/mexico',     85, 4),
  ('worldremit',   'mexico', 'bank', 16.9500, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE, 'https://www.worldremit.com/en/send-money/united-states/mexico',   75, 4),
  ('westernunion', 'mexico', 'bank', 16.9000, 0.00, 'Minutos',  'Western Union', 4.5, 15820, TRUE, 'https://www.westernunion.com',                                    95, 3),
  ('moneygram',    'mexico', 'bank', 16.8000, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  TRUE, 'https://www.moneygram.com',                                       85, 3)
ON CONFLICT (operador, corredor, metodo_entrega) DO UPDATE SET
  tasa = EXCLUDED.tasa,
  fee = EXCLUDED.fee,
  velocidad = EXCLUDED.velocidad,
  nombre_operador = EXCLUDED.nombre_operador,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  afiliado = EXCLUDED.afiliado,
  link = EXCLUDED.link,
  confiabilidad = EXCLUDED.confiabilidad,
  metodos_disponibles = EXCLUDED.metodos_disponibles,
  activo = TRUE,
  actualizado_en = NOW();


-- ───────────────────────────────────────────────────────────────────────
-- Migración 007: Tabla scraper_anomalies (Agente 1 Fase 7)
-- ───────────────────────────────────────────────────────────────────────

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

CREATE INDEX IF NOT EXISTS scraper_anomalies_op_corr_created_idx
  ON scraper_anomalies (operador, corredor, created_at DESC);

CREATE INDEX IF NOT EXISTS scraper_anomalies_created_idx
  ON scraper_anomalies (created_at DESC);

ALTER TABLE scraper_anomalies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_select" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_select" ON scraper_anomalies FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_insert" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_insert" ON scraper_anomalies FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_update" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_update" ON scraper_anomalies FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "scraper_anomalies_deny_anon_delete" ON scraper_anomalies;
CREATE POLICY "scraper_anomalies_deny_anon_delete" ON scraper_anomalies FOR DELETE TO anon USING (false);


-- ───────────────────────────────────────────────────────────────────────
-- Migración 010: Tabla alertas_email (form público /alertas)
-- Replica migration 010_alertas_email.sql. Incluida aquí para que el
-- setup de preview desde cero quede sincronizado con prod (schema
-- creado ad-hoc el 2026-04-22, formalizado al repo el 2026-04-23).
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS alertas_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activo BOOLEAN NOT NULL DEFAULT true,
  desactivado_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS alertas_email_created_at_idx
  ON alertas_email (created_at DESC);

CREATE INDEX IF NOT EXISTS alertas_email_activo_idx
  ON alertas_email (activo) WHERE activo = true;

ALTER TABLE alertas_email ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alertas_email_deny_anon_select" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_select" ON alertas_email FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_insert" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_insert" ON alertas_email FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_update" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_update" ON alertas_email FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_delete" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_delete" ON alertas_email FOR DELETE TO anon USING (false);


-- ───────────────────────────────────────────────────────────────────────
-- Migración 011: alertas_email + corredor + idioma (landing editorial)
-- Replica migration 011_alertas_email_corredor_idioma.sql. El form de
-- alertas de cada página editorial (Sección 0 hero + Sección 6 CTA)
-- pasa a guardar contexto país + locale para fidelización por corredor.
-- ───────────────────────────────────────────────────────────────────────

ALTER TABLE alertas_email ADD COLUMN IF NOT EXISTS corredor TEXT;
ALTER TABLE alertas_email ADD COLUMN IF NOT EXISTS idioma TEXT;

CREATE INDEX IF NOT EXISTS alertas_email_corredor_idx
  ON alertas_email (corredor) WHERE corredor IS NOT NULL;

COMMENT ON COLUMN alertas_email.corredor IS 'CorredorId del país desde el que se suscribió (ej. honduras, mexico). NULL = suscripción genérica sin contexto país (form de /alertas) o registro previo a migración 011.';
COMMENT ON COLUMN alertas_email.idioma IS 'Locale activo cuando se suscribió (es | en). Determina idioma de emails futuros. NULL para registros previos a migración 011.';


-- ───────────────────────────────────────────────────────────────────────
-- Seed adicional: 4 corredores MVP originales (HN, DO, GT, SV)
-- Estos NO venían en ninguna migración (se crearon con scripts mjs antes).
-- Tasas de banco central: valores aproximados abril 2026 — ajustables.
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO corredores (id, nombre, nombre_en, moneda, simbolo, bandera, codigo_pais, tasa_banco_central, activo, prioridad) VALUES
  ('honduras',           'Honduras',             'Honduras',            'HNL', 'L',    '🇭🇳', 'hn', 25.0000,  TRUE, 1),
  ('dominican_republic', 'República Dominicana', 'Dominican Republic',  'DOP', 'RD$',  '🇩🇴', 'do', 62.0000,  TRUE, 2),
  ('guatemala',          'Guatemala',            'Guatemala',           'GTQ', 'Q',    '🇬🇹', 'gt', 7.7500,   TRUE, 3),
  ('el_salvador',        'El Salvador',          'El Salvador',         'USD', '$',    '🇸🇻', 'sv', 1.0000,   TRUE, 4)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  nombre_en = EXCLUDED.nombre_en,
  moneda = EXCLUDED.moneda,
  simbolo = EXCLUDED.simbolo,
  codigo_pais = EXCLUDED.codigo_pais,
  tasa_banco_central = EXCLUDED.tasa_banco_central,
  activo = EXCLUDED.activo,
  prioridad = EXCLUDED.prioridad;

INSERT INTO tasas_bancos_centrales (id, codigo_pais, moneda, nombre_banco, nombre_banco_en, siglas, tasa, nota, nota_en) VALUES
  ('honduras',           'hn', 'HNL', 'Banco Central de Honduras',       'Central Bank of Honduras',            'BCH',   25.0000, '', ''),
  ('dominican_republic', 'do', 'DOP', 'Banco Central Rep. Dominicana',   'Central Bank of Dominican Republic',  'BCRD',  62.0000, '', ''),
  ('guatemala',          'gt', 'GTQ', 'Banco de Guatemala',              'Bank of Guatemala',                   'BG',    7.7500,  '', ''),
  ('el_salvador',        'sv', 'USD', 'Banco Central de Reserva',        'Central Reserve Bank',                'BCR',   1.0000,  'Usa USD desde 2001', 'Uses USD since 2001')
ON CONFLICT (id) DO UPDATE SET
  codigo_pais = EXCLUDED.codigo_pais,
  moneda = EXCLUDED.moneda,
  nombre_banco = EXCLUDED.nombre_banco,
  nombre_banco_en = EXCLUDED.nombre_banco_en,
  siglas = EXCLUDED.siglas,
  tasa = EXCLUDED.tasa,
  nota = EXCLUDED.nota,
  nota_en = EXCLUDED.nota_en,
  actualizado_en = NOW();


-- ───────────────────────────────────────────────────────────────────────
-- Migración 012: Seed precios Honduras (SOLO PREVIEW)
-- Replica migration 012_seed_honduras_precios.sql. Snapshot de prod
-- 2026-04-24. Cierra gap de data histórico: el comentario del header
-- decía que los 4 países MVP originales "arrancan sin precios — el cron
-- de scrapers los llena", pero con los scrapers rotos desde 2026-04-17
-- nunca llegaron. Honduras se cierra aquí; DO/GT/SV siguen vacíos en
-- preview hasta que se porten al landing editorial.
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO precios (
  operador, corredor, metodo_entrega, tasa, fee, velocidad,
  nombre_operador, rating, reviews, afiliado, link,
  confiabilidad, metodos_disponibles,
  comision_usd, cookie_dias, trafico_calificable
) VALUES
  ('moneygram',    'honduras', 'bank', 25.9500, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  FALSE, '',                                                                85, 3, 5.00,  30,   1.00),
  ('remitly',      'honduras', 'bank', 26.4500, 2.99, 'Minutos',  'Remitly',       4.8, 8421,  TRUE,  'https://www.remitly.com/us/en/honduras',                          80, 3, 12.00, 30,   1.00),
  ('ria',          'honduras', 'bank', 26.2500, 0.00, 'Minutos',  'Ria',           4.6, 5200,  TRUE,  'https://www.riamoneytransfer.com/us/en/send-money-to/honduras',   85, 4, 8.00,  30,   1.00),
  ('westernunion', 'honduras', 'bank', 26.1000, 0.00, 'Minutos',  'Western Union', 4.5, 15820, FALSE, '',                                                                95, 3, 10.00, 30,   1.00),
  ('wise',         'honduras', 'bank', 26.5800, 2.50, 'Segundos', 'Wise',          4.9, 12043, TRUE,  'https://wise.com/us/send-money/send-money-to-honduras',           95, 2, 12.00, 9999, 1.00),
  ('worldremit',   'honduras', 'bank', 26.2000, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE,  'https://www.worldremit.com/en/send-money/united-states/honduras', 75, 4, 30.00, 45,   1.00),
  ('xoom',         'honduras', 'bank', 26.3000, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE,  'https://www.xoom.com/honduras/send-money',                        90, 3, 10.00, 30,   0.40)
ON CONFLICT (operador, corredor, metodo_entrega) DO UPDATE SET
  tasa = EXCLUDED.tasa,
  fee = EXCLUDED.fee,
  velocidad = EXCLUDED.velocidad,
  nombre_operador = EXCLUDED.nombre_operador,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  afiliado = EXCLUDED.afiliado,
  link = EXCLUDED.link,
  confiabilidad = EXCLUDED.confiabilidad,
  metodos_disponibles = EXCLUDED.metodos_disponibles,
  comision_usd = EXCLUDED.comision_usd,
  cookie_dias = EXCLUDED.cookie_dias,
  trafico_calificable = EXCLUDED.trafico_calificable,
  activo = TRUE,
  actualizado_en = NOW();


-- ═══════════════════════════════════════════════════════════════════════
-- Verificación final (correr DESPUÉS del script de arriba)
-- ═══════════════════════════════════════════════════════════════════════
-- Ejecutá esto en un SELECT separado y confirmá los números:
--
-- SELECT
--   (SELECT count(*) FROM corredores)                         AS corredores_count,      -- esperado: 6
--   (SELECT count(*) FROM tasas_bancos_centrales)             AS tasas_bc_count,        -- esperado: 6
--   (SELECT count(*) FROM precios)                            AS precios_count,         -- esperado: 21 (14 MX+CO + 7 HN)
--   (SELECT count(*) FROM contactos)                          AS contactos_count,       -- esperado: 0
--   (SELECT count(*) FROM alertas_email)                      AS alertas_email_count,   -- esperado: 0
--   (SELECT count(*) FROM scraper_anomalies)                  AS anomalies_count,       -- esperado: 0
--   (SELECT count(*) FROM pg_policies WHERE schemaname='public') AS policies_total;    -- esperado: 14+ (4 contactos + 4 alertas_email + 4 anomalies + 3 public reads)
