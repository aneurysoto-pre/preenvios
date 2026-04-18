# Proceso 07 — Páginas legales y disclaimers (Fase 1.5 + Fase 16)

## Descripción

Sistema completo de cumplimiento legal: 6 disclaimers numerados visibles en el comparador y footer, 5 páginas legales internas con soporte bilingüe es/en, y proceso documentado de eliminación de datos. Todo funciona con next-intl para mostrar contenido en el idioma del usuario.

Completado el 2026-04-16 (Fase 1.5 + Fase 16 del roadmap).

## Pasos del flujo

### 1. Los 6 disclaimers y dónde aparecen (actualizado 2026-04-18)

Tras el rediseño del 2026-04-18 orientado a simplicidad radical, los disclaimers por tarjeta fueron eliminados del comparador. Ahora hay una sola línea gris arriba del listado y una caja amarilla condensada al final, ambos con link a la página nueva `/disclaimers` donde viven los 6 textos FTC completos.

| # | Nombre | Dónde se muestra hoy | Componente |
|---|--------|------------------------|------------|
| #1 | Tasas aproximadas | Página /disclaimers (sección 1) + caja amarilla al final del comparador en versión acortada | app/[locale]/disclaimers/content.tsx + Comparador.tsx |
| #2 | Institución no financiera | Footer global como primer párrafo bold + página /disclaimers (sección 2) | Sections.tsx (Footer) + app/[locale]/disclaimers/content.tsx |
| #3 | Ranking influenciado | Arriba del listado en 1 línea gris pequeña con link a /como-ganamos-dinero + página /disclaimers (sección 3) | Comparador.tsx + app/[locale]/disclaimers/content.tsx |
| #4 | FTC afiliados | Highlight box en /como-ganamos-dinero + página /disclaimers (sección 4) | como-ganamos-dinero/content.tsx + disclaimers/content.tsx |
| #5 | Limitación de responsabilidad | Cláusula principal en /terminos + página /disclaimers (sección 5) | terminos/content.tsx + disclaimers/content.tsx |
| #6 | Marcas nominativas | Highlight box en /uso-de-marcas + página /disclaimers (sección 6) | uso-de-marcas/content.tsx + disclaimers/content.tsx |

Cambios clave del 2026-04-18:
- Eliminados de cada ResultCard: disclaimer d1 (tasas aproximadas) y disclaimer d4 (afiliado). Antes aparecían 14 veces (2 × 7 operadores); ahora 0
- Nueva página `/es/disclaimers` y `/en/disclaimers` con `noindex,nofollow` — es legal, no SEO
- Nuevas claves en `messages/*.json`: `disclaimers.topShort`, `topShortLink`, `bottomShort`, `bottomShortLink`, `footerLink`

### 2. Las 5 páginas legales

Todas usan el componente reutilizable `LegalPage.tsx` que proporciona: nav con logo + botón volver, layout con tag, título, fecha de actualización, y contenido con estilos prose-legal.

| URL | Contenido principal |
|-----|---------------------|
| `/[locale]/terminos` | Disclaimer #2 (highlight), qué es PreEnvios, Disclaimer #5 (limitación), tasas aproximadas, acuerdos comerciales, edad mínima 18 años, jurisdicción Delaware, uso de marcas |
| `/[locale]/privacidad` | Datos que recopilamos (GA4), datos que NO recopilamos, cómo los usamos, cookies (Analytics + NEXT_LOCALE + preenvios_corredor), derechos CCPA/GDPR, solicitud de borrado vía email con plazo 30 días |
| `/[locale]/como-ganamos-dinero` | Disclaimer #4 (highlight), modelo de afiliados, redes usadas (Impact, Partnerize, CJ), cómo afecta el ranking (es 1 de 5 criterios), link a metodología |
| `/[locale]/metodologia` | Preenvíos Score explicado: 5 criterios con pesos exactos (35/25/20/10/10), fuentes de datos, frecuencia de actualización, operadores comparados, referencia a lib/ranking.ts |
| `/[locale]/uso-de-marcas` | Disclaimer #6 (highlight), lista de las 7 marcas con dueño corporativo, propósito de uso nominativo, contacto para inquietudes |

### 3. Traducciones

Los 6 disclaimers están en `messages/es.json` y `messages/en.json` bajo la clave `disclaimers` (d1-d6). Las páginas legales usan `useLocale()` para renderizar contenido condicional en español o inglés.

### 4. Footer actualizado (2026-04-18)

El footer ahora tiene 5 links visibles en la columna "Legal":
- Privacidad → `/[locale]/privacidad`
- Términos → `/[locale]/terminos`
- Cómo ganamos dinero → `/[locale]/como-ganamos-dinero`
- Disclaimers → `/[locale]/disclaimers` (agregado 2026-04-18)
- Uso de marcas → `/[locale]/uso-de-marcas`

Disclaimer #2 aparece como primer párrafo bold antes del disclaimer genérico.

### 5. Sitemap actualizado

Las 5 páginas legales están incluidas en `app/sitemap.ts` con `changeFrequency: 'monthly'` y `priority: 0.3`, con alternates es/en para cada una.

### 6. Proceso de eliminación de datos

Documentado en la página /privacidad:
1. El usuario envía email a contact@preenvios.com solicitando eliminación
2. PreEnvios responde en máximo 30 días conforme a CCPA y GDPR
3. Se eliminan los datos asociados al email del usuario

## Archivos creados/modificados

| Archivo | Tipo |
|---------|------|
| `components/LegalPage.tsx` | Nuevo — componente reutilizable para páginas legales |
| `app/globals.css` | Modificado — estilos `.prose-legal` |
| `app/[locale]/terminos/page.tsx + content.tsx` | Nuevo |
| `app/[locale]/privacidad/page.tsx + content.tsx` | Nuevo |
| `app/[locale]/como-ganamos-dinero/page.tsx + content.tsx` | Nuevo |
| `app/[locale]/metodologia/page.tsx + content.tsx` | Nuevo |
| `app/[locale]/uso-de-marcas/page.tsx + content.tsx` | Nuevo |
| `messages/es.json` | Modificado — claves `disclaimers` y `legal` |
| `messages/en.json` | Modificado — claves `disclaimers` y `legal` |
| `components/Comparador.tsx` | Modificado — disclaimers #1, #3, #4 |
| `components/Sections.tsx` | Modificado — footer con disclaimer #2 y links legales |
| `app/sitemap.ts` | Modificado — incluye 5 páginas legales |

## Checkboxes pendientes de acción del usuario (no son código)

- Constituir LLC en Delaware o Florida
- Obtener EIN del IRS
- Abrir cuenta bancaria de negocio
- Contratar seguro E&O
