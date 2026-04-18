-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 004: Tabla contactos
-- Fase 4.x · 2026-04-18
-- ═══════════════════════════════════════════════════════
-- Guarda los mensajes enviados desde /contacto. El formulario publico
-- puede INSERTAR (via API route con service_role). La lectura solo
-- la permite la service_role (admin). El anon key NO puede leer ni
-- insertar directo — todo pasa por /api/contactos que valida.
--
-- Asuntos aceptados: general, rate, partnership, other (validados en API).
-- Idioma: es | en.
--
-- COPY-PASTE READY para Supabase SQL Editor.

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

-- RLS: bloquea lectura/escritura desde anon key. La API route usa
-- service_role_key que bypasea RLS para insertar.
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Policies explicitas para claridad (service_role bypasea igual, pero
-- esto documenta la intencion: nadie mas toca esta tabla).
DROP POLICY IF EXISTS "contactos_deny_anon_select" ON contactos;
CREATE POLICY "contactos_deny_anon_select" ON contactos
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "contactos_deny_anon_insert" ON contactos;
CREATE POLICY "contactos_deny_anon_insert" ON contactos
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "contactos_deny_anon_update" ON contactos;
CREATE POLICY "contactos_deny_anon_update" ON contactos
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "contactos_deny_anon_delete" ON contactos;
CREATE POLICY "contactos_deny_anon_delete" ON contactos
  FOR DELETE TO anon USING (false);
