-- ═══════════════════════════════════════════════════════════════════════
-- PreEnvios.com — Migración 010: Tabla alertas_email (formalización)
-- 2026-04-23 — commiteada POST-creación manual de la tabla en prod
-- ═══════════════════════════════════════════════════════════════════════
-- Contexto: la tabla `alertas_email` fue creada manualmente en Supabase
-- prod el 2026-04-22 cuando se rehízo el form /alertas (commits
-- 76b8970 → 66e0759 del rebuild con shadcn Form + zod). En ese momento
-- NO se commiteó una migration SQL al repo, entonces el schema real de
-- prod y el repo divergieron — deuda técnica.
--
-- Esta migración cierra ese gap: documenta el schema real para
-- auditoría + permite recreación consistente desde cero + habilita que
-- el script `preview_setup_all.sql` pueda incluir la tabla en futuras
-- actualizaciones del setup de preview.
--
-- Historia:
--   - Tabla creada ad-hoc en prod 2026-04-22 (schema desconocido en repo).
--   - 2026-04-23: diagnóstico del Agente 3 DB health expuso el drift
--     cuando se evaluó si el Agente 5 podía arrancar.
--   - Queries `information_schema.columns` + `pg_indexes` + `pg_policies`
--     en prod revelaron el schema real (5 columnas, 4 índices, 4 policies).
--   - Migración escrita para reflejar el estado observado.
--
-- Idempotente: safe de re-ejecutar. Si la tabla ya existe, CREATE TABLE
-- IF NOT EXISTS es no-op; CREATE INDEX IF NOT EXISTS también; policies
-- usan DROP IF EXISTS + CREATE.
--
-- Patrón alineado con migration 004 (contactos) — misma estrategia de
-- RLS deny-anon, insert via service_role desde API route.
--
-- Relación con código:
--   - `app/api/alertas/route.ts` inserta aquí con service_role key
--     (bypassa RLS).
--   - Maneja error 23505 (unique violation en email) como 200 OK silent
--     para no revelar si un email ya está suscrito (anti-enumeration).
--   - Desactivación/unsubscribe futuro usa `activo = false` +
--     `desactivado_at = now()`, NO DELETE.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS alertas_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activo BOOLEAN NOT NULL DEFAULT true,
  desactivado_at TIMESTAMPTZ
);

-- Índices secundarios. El UNIQUE(email) del CREATE TABLE ya genera
-- implicitamente el índice `alertas_email_email_key`, no hace falta
-- recrearlo aquí.

-- Consulta "últimas suscripciones" en admin panel (ordenadas DESC).
CREATE INDEX IF NOT EXISTS alertas_email_created_at_idx
  ON alertas_email (created_at DESC);

-- Partial index para listar solo suscriptores activos rápido (excluye
-- desactivados). Uso previsto: envío de alertas diarias mes 1+.
CREATE INDEX IF NOT EXISTS alertas_email_activo_idx
  ON alertas_email (activo) WHERE activo = true;

-- RLS: bloqueo total a anon. La API route `/api/alertas` usa
-- service_role key que bypassa RLS para insertar. Nadie (anon) puede
-- leer, insertar, actualizar ni borrar directo desde el cliente.
ALTER TABLE alertas_email ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alertas_email_deny_anon_select" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_select" ON alertas_email
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_insert" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_insert" ON alertas_email
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_update" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_update" ON alertas_email
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "alertas_email_deny_anon_delete" ON alertas_email;
CREATE POLICY "alertas_email_deny_anon_delete" ON alertas_email
  FOR DELETE TO anon USING (false);

-- ═══════════════════════════════════════════════════════════════════════
-- Verificación post-run (correr en queries separadas):
-- ═══════════════════════════════════════════════════════════════════════
--
-- Schema:
--   SELECT column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'alertas_email'
--   ORDER BY ordinal_position;
--
-- Índices (esperado: 4 — pkey, email_key, created_at_idx, activo_idx):
--   SELECT indexname FROM pg_indexes WHERE tablename = 'alertas_email';
--
-- Policies (esperado: 4 deny-anon — SELECT, INSERT, UPDATE, DELETE):
--   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'alertas_email';
