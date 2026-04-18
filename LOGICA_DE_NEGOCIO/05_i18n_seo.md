# Proceso 05 — Multi-idioma (i18n) y SEO

## Descripción

El sitio soporta español e inglés desde Fase 1. La detección de idioma es automática y la preferencia se persiste en cookie. Los meta tags hreflang y sitemaps por idioma están configurados para SEO.

Completado el 2026-04-16 como Bloque 4 de la Fase 1.

## Pasos del flujo

### 1. Detección de idioma en primera visita (2026-04-18 — simplificado)
**Regla: el idioma por defecto del sitio siempre es español.** El header `Accept-Language` del navegador NO se usa. El usuario solo ve inglés si lo elige explícitamente.

1. El usuario llega a preenvios.com
2. El middleware de next-intl intercepta la request
3. Si existe cookie `NEXT_LOCALE=en` (puesta por una elección previa del usuario) → redirige a `/en`
4. Si existe cookie `NEXT_LOCALE=es` o no hay cookie → redirige a `/es`
5. Configurado en `i18n/routing.ts` con `localeDetection: false` — esto desactiva la lectura de Accept-Language

Motivación: el público objetivo es diáspora latina en EE.UU. Muchos tienen el Android/iPhone en inglés de fábrica pero consumen contenido en español. Dejar que Accept-Language decida producía que usuarios hispanohablantes viesen el sitio en inglés por defecto. Español como default hard-codeado elimina esa fricción.

### 2. Cookie NEXT_LOCALE
- Se guarda automáticamente por next-intl cuando el usuario cambia manualmente de idioma via el botón EN/ES
- Duración: 365 días
- Configurada en `i18n/routing.ts` con `localeCookie.maxAge`
- Es la única señal que hace que un visitante vea `/en` en lugar de `/es`

### 3. Cambio manual de idioma
1. El usuario hace clic en botón EN/ES en el nav
2. Se dispara evento GA4 `cambio_idioma` con idioma anterior y nuevo
3. `router.push()` navega a la misma ruta en el otro locale (ej: `/es` → `/en`)
4. next-intl actualiza la cookie `NEXT_LOCALE` automáticamente para próximas visitas

### 4. Meta tags hreflang
En `app/[locale]/layout.tsx` se incluyen 3 tags `<link rel="alternate">`:
- `hreflang="es"` → `https://preenvios.com/es`
- `hreflang="en"` → `https://preenvios.com/en`
- `hreflang="x-default"` → `https://preenvios.com/es` (español como default)

Esto le dice a Google que existen 2 versiones del sitio y cuál mostrar según el idioma del usuario.

### 5. Sitemap.xml
- Generado automáticamente por Next.js via `app/sitemap.ts`
- Incluye `/es` y `/en` con `alternates.languages` para cada URL
- `changeFrequency: 'daily'` y `priority: 1.0` para las páginas principales
- `robots.txt` generado via `app/robots.ts` apunta a `/sitemap.xml`

### 6. Ofertas destacadas (componente oculto)
- `components/OfertasDestacadas.tsx` — carrusel horizontal estilo trivago
- Prop `hidden={true}` por default — no se renderiza
- Estructura HTML lista con 5 tarjetas placeholder (Remitly, Wise, Xoom, Ria, WorldRemit)
- Cada tarjeta tiene badge "Patrocinado" visible
- Se activa cambiando `hidden={false}` cuando haya sponsors reales aprobados

## Archivos modificados/creados
| Archivo | Cambio |
|---------|--------|
| `i18n/routing.ts` | Cookie NEXT_LOCALE con maxAge 365 días + `localeDetection: false` (siempre ES por defecto desde 2026-04-18) |
| `app/[locale]/layout.tsx` | Meta tags hreflang es/en/x-default |
| `components/Nav.tsx` | Evento GA4 `cambio_idioma` en switchLocale |
| `app/sitemap.ts` | Sitemap con alternates por idioma |
| `app/robots.ts` | robots.txt apuntando a sitemap.xml |
| `components/OfertasDestacadas.tsx` | Sección oculta lista para sponsors |
| `app/[locale]/page.tsx` | Incluye OfertasDestacadas hidden |
