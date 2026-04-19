-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 006: admin_login_attempts
-- Fase 4.x · 2026-04-19 · Auditoría #01 · H-07.1
-- ═══════════════════════════════════════════════════════
-- Rate limit del login admin: 5 intentos fallidos por IP en
-- ventana de 15 minutos. Cierra el hallazgo 🔴 CRITICAL H-07.1
-- (brute force ilimitado en /api/admin/auth).
--
-- Privacidad: se guarda ip_hash (SHA-256) en vez de la IP cruda.
-- Email en claro porque ayuda al forense admin y no es sensible
-- en este contexto (1 solo admin, sin PII de terceros).
--
-- Registra intentos exitosos tambien para tener audit trail
-- (bonus parcial al hallazgo H-09.2).
--
-- Solo la service_role (API routes server-side) puede leer/insertar.
-- RLS activo + politicas explicitas deny-all para anon.
--
-- COPY-PASTE READY para Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indice principal: lookup por IP + ventana de tiempo (caso rate limit)
CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_time_idx
  ON admin_login_attempts (ip_hash, attempted_at DESC);

-- Indice secundario: audit queries por fecha
CREATE INDEX IF NOT EXISTS admin_login_attempts_time_idx
  ON admin_login_attempts (attempted_at DESC);

-- RLS: nadie via anon key. service_role bypasea RLS igualmente
-- (la usan /api/admin/auth/route.ts server-side).
ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_login_attempts_deny_anon_select" ON admin_login_attempts;
CREATE POLICY "admin_login_attempts_deny_anon_select" ON admin_login_attempts
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "admin_login_attempts_deny_anon_insert" ON admin_login_attempts;
CREATE POLICY "admin_login_attempts_deny_anon_insert" ON admin_login_attempts
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "admin_login_attempts_deny_anon_update" ON admin_login_attempts;
CREATE POLICY "admin_login_attempts_deny_anon_update" ON admin_login_attempts
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "admin_login_attempts_deny_anon_delete" ON admin_login_attempts;
CREATE POLICY "admin_login_attempts_deny_anon_delete" ON admin_login_attempts
  FOR DELETE TO anon USING (false);
