-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 006: México y Colombia al catálogo MVP
-- 2026-04-21
--
-- Agrega Colombia y México como corredores públicos activos (del antiguo
-- estado "en DB pero oculto en UI" a "visible en todas las superficies"):
--   1) UPSERT en `corredores` — metadata del país
--   2) UPSERT en `tasas_bancos_centrales` — tasa de referencia Banxico / Banrep
--   3) UPSERT en `precios` — 14 filas (2 corredores × 7 operadores) con
--      tasas estimadas. Se sobreescribirán automáticamente cuando los
--      scrapers corran, pero evita que la UI muestre vacío antes del
--      primer cron.
--
-- Idempotente: se puede re-ejecutar sin efectos secundarios.
-- Si ya corriste `scripts/seed-new-corridors.mjs` y
-- `scripts/seed-bancos-centrales.mjs` previamente, esta migración solo
-- reafirma los datos — es seguro volver a correrla.
-- ═══════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────
-- 1. Corredores (metadata país)
-- ───────────────────────────────────────────────────────
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

-- ───────────────────────────────────────────────────────
-- 2. Tasas de bancos centrales
-- ───────────────────────────────────────────────────────
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

-- ───────────────────────────────────────────────────────
-- 3. Precios iniciales — 14 filas (2 corredores × 7 operadores)
--    Tasas estimadas de arranque; el scraper las reemplaza con reales.
--    Fees, velocidades, ratings y links copiados de seed-new-corridors.mjs.
-- ───────────────────────────────────────────────────────

-- Colombia (COP)
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

-- México (MXN)
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

-- ───────────────────────────────────────────────────────
-- Verificación (copia-pega después del INSERT para confirmar)
-- ───────────────────────────────────────────────────────
-- SELECT id, nombre, moneda, prioridad, activo FROM corredores WHERE id IN ('mexico','colombia') ORDER BY prioridad;
-- SELECT id, nombre_banco, siglas, tasa FROM tasas_bancos_centrales WHERE id IN ('mexico','colombia');
-- SELECT corredor, operador, tasa, fee, afiliado FROM precios WHERE corredor IN ('mexico','colombia') ORDER BY corredor, operador;
-- Resultado esperado: 2 corredores, 2 bancos centrales, 14 precios.
