# Proceso 01 — Scaffolding del proyecto Next.js

## Descripción

Estructura base del proyecto que reemplazará el MVP estático (index.html en GitHub Pages) por una aplicación Next.js desplegada en Vercel. Este scaffolding se construyó el 2026-04-16 como Bloque 1 de la Fase 1 del roadmap.

El MVP en GitHub Pages sigue activo. Next.js se desarrolla en paralelo en el mismo repositorio. Cuando todo esté verificado, se cambia el DNS de Namecheap para apuntar a Vercel.

## Pasos del flujo

### 1. Inicialización del proyecto
- Se creó el proyecto Next.js 16 con TypeScript en la raíz del repositorio existente, conviviendo con `index.html`, `CNAME`, y los archivos CONTEXTO
- Se instalaron las dependencias: Next.js, React 19, Tailwind CSS 4, next-intl, @supabase/supabase-js
- Se configuró `package.json` con scripts estándar: `dev`, `build`, `start`, `lint`

### 2. Tailwind CSS con las variables del MVP
- Se migró el sistema de colores del MVP (--blue, --green, --ink, grays g50-g700) a la directiva `@theme` de Tailwind v4 en `app/globals.css`
- Se migaron las tipografías: Inter (body), Plus Jakarta Sans (headings), Quicksand (logo)
- Se definieron los border-radius del MVP: base (14px), lg (22px), xl (32px)
- Tailwind v4 usa `@tailwindcss/postcss` en `postcss.config.mjs` en lugar del plugin clásico

### 3. Supabase — conexión al backend
- Se creó `lib/supabase.ts` con el cliente configurado usando las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Las keys reales están en `.env.local` que está en `.gitignore` y nunca se commitea
- Se creó `.env.example` con los nombres de las variables sin valores para referencia

### 4. Multi-idioma español/inglés con next-intl
- Se configuró next-intl con 2 locales: `es` (default) y `en`
- Archivos de configuración en `i18n/routing.ts` (define locales) e `i18n/request.ts` (carga mensajes)
- `middleware.ts` intercepta cada request y redirige a `/es` o `/en` según el header Accept-Language del navegador
- Las traducciones completas están en `messages/es.json` y `messages/en.json` — cubren nav, hero, comparador, resultados, FAQ, footer, delivery methods, y textos comunes
- Los nombres de operadores (Remitly, Wise, etc.) y códigos de moneda (DOP, HNL) NO se traducen — quedan igual en ambos idiomas

### 5. Layout global con Google Analytics
- `app/[locale]/layout.tsx` es el layout raíz que:
  - Carga las Google Fonts (Inter, Plus Jakarta Sans, Quicksand)
  - Inyecta el script de Google Analytics GA4 (G-6RBFS2812S)
  - Envuelve todo en `NextIntlClientProvider` para que los componentes accedan a las traducciones
  - Establece el `lang` del HTML según el locale activo

### 6. Página principal — placeholder
- `app/[locale]/page.tsx` tiene el hero y nav migrados del MVP como componentes React
- La calculadora interactiva y el resto de secciones están marcadas como placeholder para el Bloque 3
- Next.js genera estáticamente ambas versiones (`/es` y `/en`) en build time via `generateStaticParams`

### 7. Seguridad y mantenimiento
- `.gitignore` excluye: node_modules, .next, .env.local, .vercel
- `.github/dependabot.yml` escanea dependencias npm cada lunes y abre PRs automáticamente
- `README.md` con instrucciones de setup local, scripts, estructura y convenciones

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts |
| `next.config.ts` | Config Next.js + next-intl plugin |
| `tsconfig.json` | TypeScript strict con paths @/* |
| `postcss.config.mjs` | Tailwind v4 via @tailwindcss/postcss |
| `app/globals.css` | Variables de diseño del MVP en Tailwind |
| `app/[locale]/layout.tsx` | Layout raíz con GA4, fonts, i18n |
| `app/[locale]/page.tsx` | Página principal con hero |
| `i18n/routing.ts` | Locales definidos (es, en) |
| `i18n/request.ts` | Carga de mensajes por locale |
| `middleware.ts` | Detección de idioma y redirect |
| `messages/es.json` | Traducciones español |
| `messages/en.json` | Traducciones inglés |
| `lib/supabase.ts` | Cliente Supabase |
| `.env.local` | Keys reales (NO commiteado) |
| `.env.example` | Nombres de variables sin valores |
| `.gitignore` | Exclusiones de git |
| `.github/dependabot.yml` | Scan semanal de npm |
| `README.md` | Instrucciones de setup |

## Qué sigue

- **Bloque 2:** Crear tablas en Supabase (precios, corredores), migrar tasas del HTML, crear API route /api/precios, implementar algoritmo de ranking expandido
- **Bloque 3:** Migrar todos los componentes visuales del MVP a React
