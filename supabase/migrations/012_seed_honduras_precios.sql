-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 012: Seed precios Honduras (SOLO PREVIEW)
-- 2026-04-24 — cierra gap de data entre prod y preview
-- ═══════════════════════════════════════════════════════════════════════
-- Contexto: el `supabase/preview_setup_all.sql` original seedea precios
-- solo para MX/CO (via el bloque de migration 006). Los 4 corredores MVP
-- originales (HN, DO, GT, SV) se crean pero SIN precios — el comentario
-- original del script decía "arrancan sin precios — el cron de scrapers
-- los llena". Con los scrapers rotos desde 2026-04-17 (ver
-- SCRAPERS_IMPORTANTE.md), esos precios nunca llegaron a la DB preview.
--
-- Diagnóstico 2026-04-24: founder testeó /es/honduras en preview URL y el
-- Comparador solo mostraba Remitly (seedeado manualmente en algún momento
-- anterior, ajeno a este script). Faltaban 6 remesadoras. Prod tiene las
-- 7 completas con data actual.
--
-- Esta migración cierra ese gap SOLO EN PREVIEW. Los valores son un
-- snapshot de prod al 2026-04-24 (fuente: `SELECT ... FROM precios WHERE
-- corredor='honduras' ORDER BY operador` ejecutado en proyecto
-- `preenvios` el 2026-04-24).
--
-- IMPORTANTE: esta migración NO se aplica a prod — prod ya tiene estos
-- datos desde antes. Similar al caso de la migration 009 (cleanup
-- nicaragua/haiti) que fue prod-specific; esta es preview-specific. En el
-- checklist del Proceso 27 se saltan los items 6 y 7 (correr en prod +
-- verificación prod) porque no aplican.
--
-- Scope deliberadamente acotado a Honduras: los otros 3 países MVP
-- originales (DO, GT, SV) también están vacíos en preview pero NO se
-- seedean aquí. Se agregarán cuando esos países se porten al landing
-- editorial (cero scope creep).
--
-- Idempotente: INSERT ... ON CONFLICT (operador, corredor, metodo_entrega)
-- DO UPDATE. Safe de re-ejecutar — si una fila ya existe se actualiza con
-- los valores del snapshot, no crea duplicados. El Remitly ya presente en
-- preview queda sincronizado con los valores de prod.
-- ═══════════════════════════════════════════════════════════════════════

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
-- Verificación post-run (correr en Supabase preview SQL Editor):
-- ═══════════════════════════════════════════════════════════════════════
--
-- 1. Esperado: 7 filas con los 7 operadores, todas con tasa ~26 HNL/USD
--
--    SELECT operador, tasa, fee, velocidad, afiliado
--    FROM precios
--    WHERE corredor = 'honduras'
--    ORDER BY operador;
--
-- 2. Esperado: count = 7
--
--    SELECT count(*) FROM precios WHERE corredor = 'honduras';
--
-- 3. Smoke test funcional (post-correr el SQL):
--    Abrir la preview URL `preenvios-git-feat-landing-edit-*.vercel.app`,
--    ir a /es/honduras, escribir monto 200, click Comparar. Deberían
--    aparecer las 7 remesadoras ordenadas por Preenvíos Score con sus
--    tasas, fees y CTAs correspondientes.
