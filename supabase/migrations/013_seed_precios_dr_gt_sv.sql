-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 013: Seed precios DR, GT, SV (SOLO PREVIEW)
-- 2026-04-25 — paridad 100% post-activación de los 5 corredores faltantes
-- ═══════════════════════════════════════════════════════════════════════
-- Contexto: la activación de los 5 corredores faltantes (commit c7a591f)
-- expuso que la DB preview tenía precios solo para HN/CO/MX. DR/GT/SV
-- estaban vacíos — el founder reportó "Tasas disponibles pronto" en
-- /es/guatemala/100. La causa raíz: cuando se hizo migración 012 para
-- Honduras se sembró aislado sabiendo que existían los otros 3
-- corredores MVP originales — gap de armonía. Esta migración cierra
-- ese gap de raíz para los 3 restantes.
--
-- Esta migración cierra el gap SOLO EN PREVIEW. Los valores son un
-- snapshot de prod al 2026-04-25 (fuente: GET /api/precios?corredor=X
-- contra preenvios.vercel.app, que es alias de Supabase prod).
--
-- IMPORTANTE: esta migración NO se aplica a prod — prod ya tiene estos
-- datos. Mismo patrón que migration 012 (preview-specific). En el
-- checklist del Proceso 27 se saltan los items 6 y 7 (correr en prod +
-- verificación prod) porque no aplican.
--
-- Idempotente: INSERT ... ON CONFLICT (operador, corredor, metodo_entrega)
-- DO UPDATE. Safe de re-ejecutar.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- República Dominicana (DOP) — 7 filas, tasas ~58-60 DOP/USD
-- ───────────────────────────────────────────────────────────────────────
INSERT INTO precios (
  operador, corredor, metodo_entrega, tasa, fee, velocidad,
  nombre_operador, rating, reviews, afiliado, link,
  confiabilidad, metodos_disponibles,
  comision_usd, cookie_dias, trafico_calificable
) VALUES
  ('moneygram',    'dominican_republic', 'bank', 58.5000, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  FALSE, '',                                                                            85, 3, 5.00,  30,   1.00),
  ('remitly',      'dominican_republic', 'bank', 59.6400, 0.00, 'Minutos',  'Remitly',       4.8, 8421,  TRUE,  'https://www.remitly.com/us/en/dominican-republic',                            80, 3, 12.00, 30,   1.00),
  ('ria',          'dominican_republic', 'bank', 58.8000, 1.99, 'Minutos',  'Ria',           4.6, 5200,  TRUE,  'https://www.riamoneytransfer.com/us/en/send-money-to/dominican-republic',     85, 4, 8.00,  30,   1.00),
  ('westernunion', 'dominican_republic', 'bank', 59.2000, 0.00, 'Minutos',  'Western Union', 4.5, 15820, FALSE, '',                                                                            95, 3, 10.00, 30,   1.00),
  ('wise',         'dominican_republic', 'bank', 58.0200, 4.50, 'Segundos', 'Wise',          4.9, 12043, TRUE,  'https://wise.com/us/send-money/send-money-to-dominican-republic',             95, 2, 12.00, 9999, 1.00),
  ('worldremit',   'dominican_republic', 'bank', 58.5000, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE,  'https://www.worldremit.com/en/send-money/united-states/dominican-republic',   75, 4, 30.00, 45,   1.00),
  ('xoom',         'dominican_republic', 'bank', 58.7000, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE,  'https://www.xoom.com/dominican-republic/send-money',                          90, 3, 10.00, 30,   0.40)
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

-- ───────────────────────────────────────────────────────────────────────
-- Guatemala (GTQ) — 7 filas, tasas ~7.5-7.8 GTQ/USD
-- ───────────────────────────────────────────────────────────────────────
INSERT INTO precios (
  operador, corredor, metodo_entrega, tasa, fee, velocidad,
  nombre_operador, rating, reviews, afiliado, link,
  confiabilidad, metodos_disponibles,
  comision_usd, cookie_dias, trafico_calificable
) VALUES
  ('moneygram',    'guatemala', 'bank', 7.4800, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  FALSE, '',                                                                 85, 3, 5.00,  30,   1.00),
  ('remitly',      'guatemala', 'bank', 7.7700, 2.99, 'Minutos',  'Remitly',       4.8, 8421,  TRUE,  'https://www.remitly.com/us/en/guatemala',                          80, 3, 12.00, 30,   1.00),
  ('ria',          'guatemala', 'bank', 7.5600, 0.00, 'Minutos',  'Ria',           4.6, 5200,  TRUE,  'https://www.riamoneytransfer.com/us/en/send-money-to/guatemala',   85, 4, 8.00,  30,   1.00),
  ('westernunion', 'guatemala', 'bank', 7.5200, 0.00, 'Minutos',  'Western Union', 4.5, 15820, FALSE, '',                                                                 95, 3, 10.00, 30,   1.00),
  ('wise',         'guatemala', 'bank', 7.6400, 2.50, 'Segundos', 'Wise',          4.9, 12043, TRUE,  'https://wise.com/us/send-money/send-money-to-guatemala',           95, 2, 12.00, 9999, 1.00),
  ('worldremit',   'guatemala', 'bank', 7.5500, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE,  'https://www.worldremit.com/en/send-money/united-states/guatemala', 75, 4, 30.00, 45,   1.00),
  ('xoom',         'guatemala', 'bank', 7.5800, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE,  'https://www.xoom.com/guatemala/send-money',                        90, 3, 10.00, 30,   0.40)
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

-- ───────────────────────────────────────────────────────────────────────
-- El Salvador (USD) — 7 filas, tasa = 1.00 (dolarizado desde 2001)
-- ───────────────────────────────────────────────────────────────────────
INSERT INTO precios (
  operador, corredor, metodo_entrega, tasa, fee, velocidad,
  nombre_operador, rating, reviews, afiliado, link,
  confiabilidad, metodos_disponibles,
  comision_usd, cookie_dias, trafico_calificable
) VALUES
  ('moneygram',    'el_salvador', 'bank', 1.0000, 1.99, 'Horas',    'MoneyGram',     4.4, 7541,  FALSE, '',                          85, 3, 5.00,  30,   1.00),
  ('remitly',      'el_salvador', 'bank', 1.0000, 0.00, 'Minutos',  'Remitly',       4.8, 8421,  TRUE,  'https://www.remitly.com',   80, 3, 12.00, 30,   1.00),
  ('ria',          'el_salvador', 'bank', 1.0000, 1.99, 'Minutos',  'Ria',           4.6, 5200,  TRUE,  'https://www.riamoneytransfer.com', 85, 4, 8.00,  30,   1.00),
  ('westernunion', 'el_salvador', 'bank', 1.0000, 5.00, 'Minutos',  'Western Union', 4.5, 15820, FALSE, '',                          95, 3, 10.00, 30,   1.00),
  ('wise',         'el_salvador', 'bank', 1.0000, 2.50, 'Segundos', 'Wise',          4.9, 12043, TRUE,  'https://wise.com/send',     95, 2, 12.00, 9999, 1.00),
  ('worldremit',   'el_salvador', 'bank', 1.0000, 1.99, 'Minutos',  'WorldRemit',    4.6, 4800,  TRUE,  'https://www.worldremit.com', 75, 4, 30.00, 45,   1.00),
  ('xoom',         'el_salvador', 'bank', 1.0000, 4.99, 'Minutos',  'Xoom',          4.7, 6120,  TRUE,  'https://www.xoom.com',      90, 3, 10.00, 30,   0.40)
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
-- Verificación post-run (correr en Supabase preview SQL Editor):
-- ═══════════════════════════════════════════════════════════════════════
--
-- 1. Esperado: 7 filas por corredor = 21 totales nuevas
--
--    SELECT corredor, count(*) AS n
--    FROM precios
--    WHERE corredor IN ('dominican_republic', 'guatemala', 'el_salvador')
--    GROUP BY corredor
--    ORDER BY corredor;
--
-- 2. Esperado total tabla: 42 filas (7 × 6 corredores) si los 6 MVP
--    están sembrados:
--
--    SELECT count(*) FROM precios;
--
-- 3. Smoke test funcional post-correr el SQL:
--    Abrir preview URL del feature branch, navegar a:
--      /es/republica-dominicana/100
--      /es/guatemala/100
--      /es/el-salvador/100
--    En las 3 deben aparecer las 7 remesadoras ordenadas por Preenvíos
--    Score con sus tasas, fees y CTAs.
