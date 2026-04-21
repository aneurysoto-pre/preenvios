# Proceso 11 — Nuevos corredores (Fase 4.2 + Fase 8)

## Descripción

Expansión del catálogo en dos etapas:

1. **2026-04-16 (Fase 4.2)** — De 4 a 8 corredores en Supabase. Se agregaron Colombia (COP), México (MXN), Nicaragua (NIO) y Haití (HTG) con 7 operadores cada uno en tabla `precios`. La UI pública se mantuvo en los 4 MVP (HN, RD, GT, SV) porque no había data validada ni páginas editoriales específicas.

2. **2026-04-21 (Fase 8)** — De 4 a 6 corredores en la UI pública. Colombia y México pasan del estado "en DB pero oculto" a "visible en todas las superficies" (Comparador, calculadora inversa, Nav, TasasReferencia, páginas editoriales `/es/mexico` y `/es/colombia`). Nicaragua y Haití siguen ocultos en UI hasta tener scraper validado + página editorial propia.

## Pasos del flujo

### 1. Datos en Supabase
- 4 registros en tabla `corredores` (CO, MX, NI, HT) con moneda, símbolo, bandera, código país, tasa banco central
- 28 registros en tabla `precios` (4 corredores × 7 operadores) con tasas estimadas, fees, velocidades y links
- Total en Supabase: 8 corredores, 56 precios
- Migración idempotente `supabase/migrations/006_mexico_colombia_mvp.sql` reafirma CO/MX en caso de ejecución desde cero o de regresión

### 2. Componentes actualizados

| Componente | Cambio |
|------------|--------|
| `Comparador.tsx` | Array CORREDORES = 6 visibles en UI (HN, RD, GT, SV, CO, MX). NI/HT siguen en `/api/precios` pero sin entry en UI |
| Calculadora inversa | 6 corredores (coinciden con Comparador) |
| 7 scrapers | Cada uno incluye los 8 corredores con country codes y links — lista no se recorta |
| WhatsApp bot | CORREDOR_MAP tiene los 8 con aliases (paisa, chilango, nica, ayiti, etc.) |
| `lib/paises.ts` | `PAISES_MVP` = 6 entries. Propaga a Nav, TasasReferencia, sitemap, páginas editoriales dinámicas |
| `components/TasasReferencia.tsx` | Grid `lg:grid-cols-3` (2 filas de 3) para las 6 tarjetas. BR color gold oscuro para contraste |

### 3. Estado por corredor

| Corredor | Moneda | Prioridad | En UI pública | Notas |
|----------|--------|-----------|---------------|-------|
| 🇭🇳 Honduras | HNL | 1 | ✅ Sí | MVP original, target #1 de marketing mes 1 |
| 🇩🇴 Rep. Dominicana | DOP | 2 | ✅ Sí | MVP original |
| 🇬🇹 Guatemala | GTQ | 3 | ✅ Sí | MVP original |
| 🇸🇻 El Salvador | USD | 4 | ✅ Sí | MVP original, dolarizado |
| 🇨🇴 Colombia | COP | 5 | ✅ Sí (desde 2026-04-21) | Fase 8 — pre-launch |
| 🇲🇽 México | MXN | 6 | ✅ Sí (desde 2026-04-21) | Fase 8 — pre-launch |
| 🇳🇮 Nicaragua | NIO | 7 | ❌ Oculto | Data en DB, sin scraper validado ni editorial |
| 🇭🇹 Haití | HTG | 8 | ❌ Oculto | Data en DB, sin scraper validado ni editorial |

### 4. Tasas iniciales
Las tasas de los 4 corredores nuevos son estimaciones basadas en Wise mid-market rate al momento del seed. Se reemplazan automáticamente cuando los scrapers estén activos con datos en tiempo real.

### 5. Pendiente para CO/MX (Fase 8)
- Bounds MX/CO en validador de ingress (Agente 1, Fase 7) — COP ±10% de 4150, MXN ±10% de 17.15
- Smoke test formal del flujo completo en ambos corredores (`CHECKLIST § 13`)
- Contenido SEO específico (blog posts por corredor) — post-launch progresivo
- Acción manual del usuario: ejecutar `supabase/migrations/006_mexico_colombia_mvp.sql` en Supabase SQL Editor

### 6. Decisión de marketing
La inclusión de MX y CO en el catálogo no cambia el plan de marketing del mes 1 post-launch. Honduras sigue siendo el único corredor con ad spend en el mes 1. MX y CO se apoyan en tráfico orgánico (SEO) y se evalúan para ad sets del mes 2-3 con data real de conversión. Referencia: `PLAN_MARKETING_MES_1.md` permanece intacto.

## Archivos modificados
- `scripts/seed-new-corridors.mjs` — seed para los 4 corredores nuevos (Fase 4.2)
- `scripts/seed-bancos-centrales.mjs` — incluye MX y CO
- `supabase/migrations/006_mexico_colombia_mvp.sql` — migración idempotente (Fase 8)
- `components/Comparador.tsx` — 6 corredores en el selector público
- `app/[locale]/calculadora-inversa/content.tsx` — 6 corredores
- `components/TasasReferencia.tsx` — grid 3-col para 6 tarjetas, color BR oscuro
- `lib/paises.ts` — PAISES_MVP = 6 entries (propaga a Nav, sitemap, páginas editoriales, operadores)
- `lib/scrapers/*.ts` — 7 scrapers, cada uno con los 8 corredores
- `app/api/whatsapp/webhook/route.ts` — 8 corredores en el mapa de aliases
- `messages/es.json` + `en.json` — FAQ q3, q5 y misión actualizadas
