# Proceso 17 — Páginas editoriales por corredor (Fase 4.1.2)

## Descripción

Páginas SEO editoriales para los 4 corredores del MVP: Honduras, República Dominicana, Guatemala y El Salvador. Cada página funciona como landing page editorial completa con comparador integrado, tasa actual, FAQ, bancos populares y Schema.org. Coexiste con las páginas técnicas de `/tasa/[pair]` que muestran gráficas históricas.

Completado el 2026-04-17 como Fase 4.1.2 del roadmap.

## Estructura de URLs

| País | Español | Inglés |
|------|---------|--------|
| Honduras | `/es/honduras` | `/en/honduras` |
| Rep. Dominicana | `/es/republica-dominicana` | `/en/dominican-republic` |
| Guatemala | `/es/guatemala` | `/en/guatemala` |
| El Salvador | `/es/el-salvador` | `/en/el-salvador` |

## Diferencia vs /tasa/[pair]

| Aspecto | `/[locale]/[pais]` | `/[locale]/tasa/[pair]` |
|---------|-------------------|----------------------|
| Propósito | Editorial — guía completa | Técnico — datos de tasa |
| Contenido | Hero, comparador, FAQ, bancos | Gráfica histórica, tabla operadores |
| Target SEO | "enviar dinero a [país]" | "tasa USD a [moneda] hoy" |
| Schema.org | WebPage + FAQPage + Breadcrumb | ExchangeRateSpecification |
| Cross-link | Link a /tasa para gráfica | — |

## Secciones de cada página

1. **Hero**: bandera grande + "Enviar dinero a [País]" + subtítulo descriptivo
2. **Tasa actual**: bloque con tasa de referencia del banco central (fetch /api/tasas-banco-central). El Salvador muestra "usa USD — sin conversión"
3. **Comparador**: componente Comparador reutilizado con `defaultCorredor` preset al corredor del país. **Regla (desde 2026-04-18):** cuando `defaultCorredor` está presente, el prop gana sobre la cookie `preenvios_corredor`. Antes el efecto de cookie sobreescribía el prop al montar y siempre volvía a la última selección del usuario; ahora el prop se respeta siempre en páginas de país
4. **Formulario de alertas**: AlertaForm integrado
5. **Cómo recibir dinero**: placeholder "Próximamente: guía completa"
6. **Bancos y billeteras**: lista de los 5 bancos/billeteras más populares del país
7. **FAQ**: 3 preguntas frecuentes específicas del corredor (bilingüe)
8. **Cross-link**: enlace a la página técnica de tasa histórica
9. **CTA**: botón al comparador principal
10. **Footer**: global con disclaimers

## Datos estáticos

`lib/paises.ts` define PAISES_MVP con:
- `slugEs` / `slugEn`: slugs por idioma (ej. "republica-dominicana" / "dominican-republic")
- `corredorId`: ID para Supabase/Comparador
- `bancosEs` / `bancosEn`: lista de bancos/billeteras populares
- `findPaisBySlug()`: busca por cualquier slug (es o en)

## Navegación

Nav actualizado con menú "Corredores":
- **Desktop**: dropdown con bandera + nombre de cada país, se cierra al hacer clic fuera
- **Mobile**: lista expandida dentro del menú hamburguesa

## SEO

- **Title**: "Enviar dinero a [País] — PreEnvios | Compara las mejores tasas"
- **Description**: "Compara Remitly, Wise, Xoom, Ria y más para enviar dinero a [País]..."
- **H1**: "Enviar dinero a [País]"
- **Schema.org**: WebPage + BreadcrumbList (Home → País) + FAQPage con 3 preguntas
- **Sitemap**: 8 URLs nuevas con hreflang alternates es↔en
- **Priority**: 0.9 (alta — son landing pages de alto valor SEO)

## Archivos creados/modificados

| Archivo | Qué hace |
|---------|----------|
| `lib/paises.ts` | Datos estáticos de los 4 países MVP |
| `app/[locale]/[pais]/page.tsx` | Ruta dinámica con generateStaticParams + generateMetadata |
| `app/[locale]/[pais]/pais-content.tsx` | Componente client con todo el contenido |
| `components/Comparador.tsx` | Modificado: acepta `defaultCorredor` prop |
| `components/Nav.tsx` | Modificado: dropdown "Corredores" desktop + mobile |
| `app/sitemap.ts` | Actualizado con 8 URLs de países |
| `messages/es.json` | Claves nav.corridors y nav.sendTo |
| `messages/en.json` | Claves nav.corridors y nav.sendTo |
