-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 011: alertas_email + corredor + idioma
-- 2026-04-24 — extiende schema para suscripciones país-específicas
-- ═══════════════════════════════════════════════════════════════════════
-- Contexto: el landing editorial modelo A (Honduras y demás MVP cuando
-- se porten) tiene 2 formularios duplicados (Sección 0 hero + Sección 6
-- CTA final) que suscriben al email de alertas diarias. Para fidelizar
-- al cliente con alertas de SU corredor específico (ej. alertas diarias
-- de HNL/USD si se suscribió desde /es/honduras), necesitamos capturar:
--
--   1. `corredor` — el corredorId del país desde el que se suscribió
--      (matches `corredores.id`: 'honduras', 'dominican_republic',
--      'guatemala', 'el_salvador', 'colombia', 'mexico', o NULL para
--      suscripciones genéricas desde /alertas sin contexto país).
--
--   2. `idioma` — el locale activo cuando se suscribió ('es' o 'en').
--      Determina el idioma de los emails de alertas futuros. NULL para
--      registros anteriores a esta migración.
--
-- Requerido también por el tracking GA4 — el evento `suscripcion_alertas`
-- pasa a aceptar params `corredor` + `location` (hero | cta_final) para
-- medir qué form convierte mejor por país. La tabla refleja lo que el
-- endpoint /api/alertas va a empezar a persistir en el commit siguiente.
--
-- Idempotente: ADD COLUMN IF NOT EXISTS + CREATE INDEX IF NOT EXISTS.
-- Registros anteriores quedan con NULL en ambas columnas — sin pérdida
-- de data, sin migración backfill necesaria.
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE alertas_email ADD COLUMN IF NOT EXISTS corredor TEXT;
ALTER TABLE alertas_email ADD COLUMN IF NOT EXISTS idioma TEXT;

-- Index en corredor: habilita queries eficientes tipo "todos los
-- suscriptores del corredor X para una campaña de email" cuando el
-- volumen crezca. WHERE corredor IS NOT NULL (partial index) evita
-- indexar los registros pre-migración o suscripciones sin contexto.
CREATE INDEX IF NOT EXISTS alertas_email_corredor_idx
  ON alertas_email (corredor) WHERE corredor IS NOT NULL;

-- Comentarios de columna — documentación inline para futuros maintainers
-- que lean el schema desde Supabase Table Editor o pg_dump.
COMMENT ON COLUMN alertas_email.corredor IS 'CorredorId del país desde el que se suscribió (ej. honduras, mexico). NULL = suscripción genérica sin contexto país (form de /alertas) o registro previo a migración 011.';
COMMENT ON COLUMN alertas_email.idioma IS 'Locale activo cuando se suscribió (es | en). Determina idioma de emails futuros. NULL para registros previos a migración 011.';

-- ═══════════════════════════════════════════════════════════════════════
-- Verificación post-run (correr en queries separadas en Supabase):
-- ═══════════════════════════════════════════════════════════════════════
--
-- Schema (esperado: 7 columnas — las 5 originales + corredor + idioma):
--   SELECT column_name, data_type, is_nullable
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'alertas_email'
--   ORDER BY ordinal_position;
--
-- Índices (esperado: 5 — pkey, email_key, created_at_idx, activo_idx,
--                        corredor_idx):
--   SELECT indexname FROM pg_indexes WHERE tablename = 'alertas_email';
--
-- Verificar que registros viejos tienen NULL en las columnas nuevas:
--   SELECT COUNT(*) AS total,
--          COUNT(corredor) AS con_corredor,
--          COUNT(idioma) AS con_idioma
--   FROM alertas_email;
