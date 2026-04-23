# LOGICA_DE_NEGOCIO/

Documentación paso a paso de cómo funciona cada pieza del proyecto PreEnvios.com.

---

## Qué es esta carpeta

Aquí se documenta la **lógica de negocio** de cada funcionalidad del proyecto en español claro. No es código — es la explicación de qué hace cada pieza y cómo funciona internamente para que alguien que llegue nuevo al proyecto entienda todo sin tener que leer el código fuente.

El código vive en los archivos `.ts/.tsx` del proyecto. Aquí vive la explicación.

---

## Cómo se usa

- Cada archivo tiene un prefijo numérico y nombre descriptivo: `01_flujo_comparador.md`, `02_algoritmo_ranking.md`, etc.
- Se crea o actualiza cada vez que se termina una funcionalidad o sub-fase del roadmap
- Cada archivo sigue la misma estructura:

```
# Proceso X — Nombre descriptivo

## Descripción
Qué hace esta pieza y por qué existe.

## Pasos del flujo
1. Paso uno...
2. Paso dos...
3. ...
```

---

## Índice de documentos

| # | Archivo | Qué documenta | Fase |
|---|---------|---------------|------|
| 01 | [01_scaffolding_nextjs.md](01_scaffolding_nextjs.md) | Estructura base del proyecto Next.js, Tailwind, i18n, Supabase | Fase 1 — Bloque 1 |
| 02 | [02_algoritmo_ranking.md](02_algoritmo_ranking.md) | Preenvíos Score — 5 criterios ponderados para ordenar operadores | Fase 1 — Bloque 2 |
| 03 | [03_base_de_datos.md](03_base_de_datos.md) | Tablas Supabase, API de precios/corredores, seed de datos | Fase 1 — Bloque 2 |
| 04 | [04_componentes_react.md](04_componentes_react.md) | Nav, Comparador, secciones estáticas, country search, delivery method | Fase 1 — Bloque 3 |
| 05 | [05_i18n_seo.md](05_i18n_seo.md) | Cookie NEXT_LOCALE, hreflang, sitemap, robots, evento cambio_idioma, ofertas ocultas | Fase 1 — Bloque 4 |
| 06 | [06_deploy_vercel.md](06_deploy_vercel.md) | Deploy Vercel, env vars, GitHub Secrets, preview deployments, DNS diferido | Fase 1 — Bloque 5 |

| 07 | [07_paginas_legales_disclaimers.md](07_paginas_legales_disclaimers.md) | 6 disclaimers, 5 páginas legales, FTC, CCPA/GDPR, footer links | Fase 1.5 + Fase 16 |

| 08 | [08_scrapers.md](08_scrapers.md) | 7 scrapers, rate limiting, fallback 3 strikes, cron job, dashboard admin | Fase 2 |
| 09 | [09_whatsapp_bot.md](09_whatsapp_bot.md) | Bot WhatsApp vía Twilio, detección idioma, tasa del día + link afiliado | Fase 2 |
| 10 | [10_calculadora_inversa.md](10_calculadora_inversa.md) | Calculadora inversa + compartir WhatsApp | Fase 2 |

### Fase 1 — cerrada 2026-04-16 (35/36 checkboxes, DNS diferido)
### Fase 1.5 + Fase 16 — cerrada 2026-04-16 (19/23 checkboxes código, 4 pendientes acción usuario)
| 11 | [11_nuevos_corredores.md](11_nuevos_corredores.md) | Guía genérica para incorporar nuevos corredores al MVP | Transversal |

| 12 | [12_panel_admin.md](12_panel_admin.md) | Panel admin: login, monitor scrapers, editor tasas, alertas, ingresos | Fase 4.5 |
| 13 | [13_flujo_precios_end_to_end.md](13_flujo_precios_end_to_end.md) | Flujo completo: operador → scraper → Supabase → API → ranking → usuario | Transversal |
| 14 | [14_tasas_bancos_centrales.md](14_tasas_bancos_centrales.md) | Tasas de referencia de bancos centrales — tabla, API, componente visual | Fase 1 |
| 15 | [15_estructura_seo.md](15_estructura_seo.md) | Blog, tasas históricas, páginas operador, wiki, sitemap dinámico, Schema.org | Fase 4.1 |

| 16 | [16_alertas_gratis.md](16_alertas_gratis.md) | Alertas gratis por email: double opt-in, diario, semanal, CAN-SPAM | Fase 4.4.A |
| 17 | [17_paginas_por_corredor.md](17_paginas_por_corredor.md) | Páginas editoriales por país: HN, DO, GT, SV con comparador, FAQ, SEO | Fase 4.1.2 |
| 18 | [18_core_web_vitals.md](18_core_web_vitals.md) | Core Web Vitals + cross-links internos SEO | Fase 4.1 |
| 19 | [19_banners_patrocinados.md](19_banners_patrocinados.md) | Banners mock (Banreservas, Banco Popular, Viamericas, Boss Money) entre hero y resultados. Slot `<Comparador>{children}</Comparador>` | Fase 4.3 — preparación |

| 24 | [24_agente_validador_ingress.md](24_agente_validador_ingress.md) | Agente 1 del stack defense-in-depth: validatePrice() en el write boundary entre scrapers y Supabase | Fase 7 |
| 25 | [25_urls_pais_monto.md](25_urls_pais_monto.md) | URLs dinámicas /{locale}/{pais}/{monto}: 48 SSG + validación server-side + push URL solo en click Comparar | Fase 10 |
| 26 | [26_cookies_consent.md](26_cookies_consent.md) | Cookie consent banner CCPA + GDPR con Google Consent Mode v2: 3 categorías, qué cookies usamos y por qué, flujo del usuario | CHECKLIST §15.1 |
| 27 | [27_db_preview_vs_produccion.md](27_db_preview_vs_produccion.md) | Separación DB Supabase preview vs producción: por qué, arquitectura, env vars por scope, cómo aplicar migraciones nuevas sin romper prod | FASE 10 BLOQUE K.1 |
| 28 | [28_scrapers_plan_diferido.md](28_scrapers_plan_diferido.md) | ⚠️ Scrapers rotos desde 2026-04-17. Decisión: diferir arreglo hasta post-LLC + APIs de partners. 7 opciones evaluadas, plan de reactivación R1/R2/R3, criterios de urgencia | Post-LLC |

### Fase 2 — cerrada 2026-04-16 (22/28 checkboxes código, 6 pendientes acción usuario)
### Fase 4.2 — cerrada 2026-04-16 (4/5 checkboxes, 1 pendiente contenido SEO)
### Fase 4.5 — cerrada 2026-04-16 (6/6 checkboxes completados)
### Fase 4.4.A — cerrada 2026-04-17 (9/9 checkboxes completados)

Este índice se actualiza cada vez que se agrega un nuevo documento.
