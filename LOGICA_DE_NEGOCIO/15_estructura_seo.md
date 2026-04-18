# Proceso 15 — Estructura SEO técnica (Fase 4.1)

## Descripción

Estructura completa de contenido SEO: blog, páginas de tasa histórica por corredor, páginas por operador, y wiki educativa. Todo bilingüe es/en, con Schema.org, sitemap dinámico, y placeholders para contenido editorial que el fundador escribe después.

Completado el 2026-04-17 como Fase 4.1 del roadmap.

## Estructura de URLs

### Blog
- `/[locale]/blog` — índice con 3 artículos placeholder
- `/[locale]/blog/[slug]` — artículo individual con Schema.org Article

### Tasas históricas (8 corredores)
- `/[locale]/tasa/usd-dop` — Rep. Dominicana
- `/[locale]/tasa/usd-hnl` — Honduras
- `/[locale]/tasa/usd-gtq` — Guatemala
- `/[locale]/tasa/usd-svc` — El Salvador
- `/[locale]/tasa/usd-cop` — Colombia
- `/[locale]/tasa/usd-mxn` — México
- `/[locale]/tasa/usd-nio` — Nicaragua
- `/[locale]/tasa/usd-htg` — Haití

Cada página incluye: tasa actual del mejor operador, gráfica Recharts de 30 días, tabla comparativa de 7 operadores, CTA al comparador, Schema.org ExchangeRateSpecification.

### Operadores (7 páginas)
- `/[locale]/operadores/remitly`
- `/[locale]/operadores/wise`
- `/[locale]/operadores/xoom`
- `/[locale]/operadores/ria`
- `/[locale]/operadores/worldremit`
- `/[locale]/operadores/western-union`
- `/[locale]/operadores/moneygram`

Cada página: descripción editorial, corredores soportados, CTA, Schema.org Organization.

### Wiki (índice + 10 artículos)
- `/[locale]/wiki` — índice con 3 categorías
- `/[locale]/wiki/[slug]` — artículo con Schema.org Article

Categorías: Fundamentos (5), Guías por corredor (3), Educación financiera (2).

## Flujo de datos

### Páginas de tasa histórica
1. Página se carga → fetch `/api/precios?corredor=X&metodo=bank` para tabla actual
2. Fetch `/api/historial-tasas?corredor=X` para gráfica de 30 días
3. Si aún no hay registros en `historial_tasas_publico`: muestra mensaje "disponible cuando scrapers llenen la tabla"
4. Recharts renderiza LineChart con datos

Tabla `historial_tasas_publico` está **activa en Supabase desde 2026-04-17** con índices y RLS. `/api/historial-tasas` la consulta sin errores; solo falta que los scrapers escriban snapshots diarios para poblar las gráficas.

### Sitemap dinámico
`app/sitemap.ts` genera todas las URLs con alternates es/en:
- 2 homes, 10 legales, 16 tasas históricas, 14 operadores, 8 blog, 22 wiki, 2 calculadora inversa
- Total: ~74 URLs indexables

## Archivos creados

| Ruta | Archivos |
|------|----------|
| Blog | `app/[locale]/blog/page.tsx`, `index-content.tsx`, `[slug]/page.tsx`, `article.tsx` |
| Tasas | `app/[locale]/tasa/[pair]/page.tsx`, `tasa-content.tsx` |
| Operadores | `app/[locale]/operadores/[slug]/page.tsx`, `operador-content.tsx` |
| Wiki | `app/[locale]/wiki/page.tsx`, `wiki-index.tsx`, `[slug]/page.tsx`, `wiki-article.tsx` |
| API | `app/api/historial-tasas/route.ts` |
| Datos | `lib/corredores.ts` (datos compartidos) |
| Sitemap | `app/sitemap.ts` (actualizado) |

## Esquema de `historial_tasas_publico` (activa desde 2026-04-17)

```sql
CREATE TABLE IF NOT EXISTS historial_tasas_publico (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  corredor TEXT NOT NULL,
  fecha DATE NOT NULL,
  tasa_promedio NUMERIC(12,4) NOT NULL,
  tasa_mejor NUMERIC(12,4),
  tasa_peor NUMERIC(12,4),
  UNIQUE(corredor, fecha)
);

CREATE INDEX idx_historial_tasas_corredor_fecha
  ON historial_tasas_publico(corredor, fecha DESC);

ALTER TABLE historial_tasas_publico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "historial_public_read" ON historial_tasas_publico FOR SELECT USING (true);
```

Los scrapers deben insertar un registro diario por corredor (aún pendiente de implementar la escritura en el flujo `/api/scrape`). La gráfica muestra "datos disponibles cuando scrapers llenen la tabla" hasta que se acumulen filas.

## Pendiente de acción del usuario
- Verificar propiedad en Google Search Console
- Optimizar Core Web Vitals (post-deploy)
- Escribir contenido editorial real de blog y wiki (los placeholders están listos)
- ✅ ~~Ejecutar SQL de historial_tasas_publico en Supabase~~ (completado 2026-04-17)
- Navegación lateral de wiki (se implementa cuando haya contenido real)
