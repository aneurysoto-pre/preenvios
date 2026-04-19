-- ═══════════════════════════════════════════════════════
-- PreEnvios.com — Migración 005: Activar afiliado WU + MG
-- Fase 4.x · 2026-04-18
-- ═══════════════════════════════════════════════════════
-- Confirmado:
--   Western Union: CJ Affiliate (https://www.cj.com/advertiser/western-union)
--   MoneyGram: FlexOffers + CJ (https://www.flexoffers.com/affiliate-programs/moneygram-international-affiliate-program/)
--
-- Estado: pendiente aprobacion de la cuenta en cada red.
-- Por ahora los links apuntan al dominio oficial (sin tracking ID).
-- Cuando las cuentas sean aprobadas se reemplazan por el link del programa
-- con el tracking ID correspondiente via /es/admin o UPDATE SQL directo.
--
-- Efecto en UI: activa el boton verde "Enviar ahora" (antes gris "Ver en sitio").
-- Efecto en ranking: ambos operadores vuelven a puntuar en valor_afiliado
-- con las columnas ya cargadas en migracion 003 (comision_usd, cookie_dias, trafico_calificable).
--
-- COPY-PASTE READY para Supabase SQL Editor.

-- Western Union: todas las filas (todos los corredores y metodos de entrega)
UPDATE precios
SET afiliado = true,
    link = 'https://www.westernunion.com',
    actualizado_en = NOW()
WHERE operador = 'westernunion';

-- MoneyGram: todas las filas
UPDATE precios
SET afiliado = true,
    link = 'https://www.moneygram.com',
    actualizado_en = NOW()
WHERE operador = 'moneygram';

-- Verificar resultado esperado: 2 operadores x 8 corredores x 1 metodo = 16 filas activadas
-- SELECT operador, corredor, afiliado, link
-- FROM precios
-- WHERE operador IN ('westernunion', 'moneygram')
-- ORDER BY operador, corredor;
