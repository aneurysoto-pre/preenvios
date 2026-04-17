# Proceso 14 — Tasas de referencia de bancos centrales

## Descripción

Sección del landing que muestra las tasas de referencia publicadas por el banco central de cada país destino. Los datos se leen de Supabase (tabla `tasas_bancos_centrales`) y se muestran como tarjetas con logo del banco, nombre y tasa actual.

Completado el 2026-04-17.

## Pasos del flujo

### 1. Datos en Supabase
- Tabla `tasas_bancos_centrales` con columnas: id, codigo_pais, moneda, nombre_banco, nombre_banco_en, siglas, tasa, nota, nota_en, actualizado_en
- 8 registros (4 originales MVP + 4 Fase 4.2)
- RLS habilitado con política de lectura pública
- Se actualiza manualmente vía panel admin o SQL directo

### 2. API
- `GET /api/tasas-banco-central` devuelve todas las tasas
- Cache: 1 hora (s-maxage=3600)

### 3. Componente TasasReferencia.tsx
1. Al montar, hace fetch a `/api/tasas-banco-central`
2. Muestra las primeras 4 tarjetas (corredores MVP)
3. Cada tarjeta tiene:
   - Logo redondo con color del banco y siglas (BCH, BCRD, BG, BCR)
   - Bandera + nombre del país
   - Nombre completo del banco (en español o inglés según locale)
   - Tasa formateada: "26.58 HNL/USD" o "1.00 USD oficial"
4. Punto verde pulsante junto al título "Tasas de referencia"
5. Nota al pie sobre dolarización de El Salvador

### 4. Ubicación en el landing
Después del comparador (resultados), antes del strip de logos de operadores:
```
Nav → Comparador → Ofertas (oculta) → TasasReferencia → LogoStrip → Why → Steps → CTA → FAQ → Footer
```

### 5. Traducciones
- `messages/es.json` → `banks.title`, `banks.subtitle`, `banks.note`, `banks.perUsd`
- `messages/en.json` → versión en inglés
- Nombres de bancos en ambos idiomas via columnas `nombre_banco` y `nombre_banco_en`

## Archivos
| Archivo | Qué hace |
|---------|----------|
| `supabase/migrations/002_tasas_bancos_centrales.sql` | DDL de la tabla |
| `scripts/seed-bancos-centrales.mjs` | Seed con 8 bancos centrales |
| `app/api/tasas-banco-central/route.ts` | API pública con cache 1h |
| `components/TasasReferencia.tsx` | Componente visual con 4 tarjetas |
| `app/[locale]/page.tsx` | Integración en el landing |
| `messages/es.json` + `en.json` | Traducciones clave `banks` |
