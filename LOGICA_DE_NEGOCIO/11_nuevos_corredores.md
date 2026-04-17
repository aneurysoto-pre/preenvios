# Proceso 11 — Nuevos corredores (Fase 4.2)

## Descripción

Expansión de 4 a 8 corredores: se agregan Colombia (COP), México (MXN), Nicaragua (NIO) y Haití (HTG). Cada corredor incluye 7 operadores con tasas estimadas iniciales, links de afiliado, y soporte completo en el comparador, calculadora inversa, scrapers y bot WhatsApp.

Completado el 2026-04-16 como Fase 4.2 del roadmap.

## Pasos del flujo

### 1. Datos en Supabase
- 4 registros nuevos en tabla `corredores` con moneda, símbolo, bandera, código país, tasa banco central
- 28 registros nuevos en tabla `precios` (4 corredores × 7 operadores) con tasas estimadas, fees, velocidades y links
- Total en Supabase: 8 corredores, 56 precios

### 2. Componentes actualizados

| Componente | Cambio |
|------------|--------|
| `Comparador.tsx` | Array CORREDORES ampliado a 8 con aliases para búsqueda (paisa, nica, ayiti, etc.) |
| Calculadora inversa | 7 corredores (excluye El Salvador por ser USD→USD) |
| 7 scrapers | Cada uno ampliado de 4 a 8 corredores con country codes y links correctos |
| WhatsApp bot | CORREDOR_MAP ampliado con COP, MXN, NIO, HTG, CO, MX, NI, HT + nombres |

### 3. Los 8 corredores activos

| Corredor | Moneda | Prioridad | Estado |
|----------|--------|-----------|--------|
| 🇭🇳 Honduras | HNL | 1 | MVP original |
| 🇩🇴 Rep. Dominicana | DOP | 2 | MVP original |
| 🇬🇹 Guatemala | GTQ | 3 | MVP original |
| 🇸🇻 El Salvador | USD | 4 | MVP original |
| 🇨🇴 Colombia | COP | 5 | Nuevo — Fase 4.2 |
| 🇲🇽 México | MXN | 6 | Nuevo — Fase 4.2 |
| 🇳🇮 Nicaragua | NIO | 7 | Nuevo — Fase 4.2 |
| 🇭🇹 Haití | HTG | 8 | Nuevo — Fase 4.2 |

### 4. Tasas iniciales
Las tasas de los 4 corredores nuevos son estimaciones basadas en Wise mid-market rate al momento del seed. Se reemplazan automáticamente cuando los scrapers estén activos con datos en tiempo real.

### 5. Pendiente
- Contenido SEO específico por corredor (Fase 4.1)
- Verificar tasas manualmente el primer lunes después del lanzamiento

## Archivos modificados
- `scripts/seed-new-corridors.mjs` — seed para los 4 corredores nuevos
- `components/Comparador.tsx` — 8 corredores en el selector
- `app/[locale]/calculadora-inversa/content.tsx` — 7 corredores
- `lib/scrapers/wise.ts`, `ria.ts`, `remitly.ts`, `xoom.ts`, `worldremit.ts`, `westernunion.ts`, `moneygram.ts` — 8 corredores cada uno
- `app/api/whatsapp/webhook/route.ts` — 8 corredores en el mapa de aliases
