# Proceso 06 — Deploy en Vercel e infraestructura

## Descripción

El proyecto Next.js se despliega automáticamente en Vercel desde la rama main del repositorio GitHub. Cada push a main genera un deploy de producción. Cada push a una rama diferente genera un preview deployment con URL única. Las credenciales se almacenan en Vercel Environment Variables y GitHub Secrets.

Completado el 2026-04-16 como Bloque 5 de la Fase 1.

## Pasos del flujo

### 1. Deploy automático de producción
1. Se hace push a la rama `main` del repo `aneurysoto-pre/preenvios`
2. Vercel detecta el push via webhook de GitHub
3. Vercel ejecuta `npm install` + `next build`
4. Si el build es exitoso, el deploy se publica en `preenvios.vercel.app` (alias canónico de prod) y, post-cutover, en `preenvios.com`
5. Build time típico: 25-35 segundos

**Importante:** `preenvios.vercel.app` NO es una URL de preview — es el
alias permanente del último deploy de `main`. Cualquier smoke test en esa
URL toca producción, no staging. Para testear contra preview hay que usar
una URL de branch específica (ver sección 2).

### 2. Preview deployments
1. Se hace push a cualquier rama que no sea `main` (ej: `feature/nueva-funcionalidad`, `test/db-separation`)
2. Vercel genera un deploy con URL única (ej: `preenvios-git-feature-xyz-aneurysoto-pre.vercel.app` o `preenvios-<hash>.vercel.app`)
3. Ese deploy usa las env vars scope **Preview** (Supabase apunta a DB `preenvios-preview`, ver Proceso 27)
4. Se puede revisar la rama en un entorno aislado sin afectar producción ni los clientes reales
5. Verificado con rama `test/verify-preview` (deploy ID BBviLHHJY) en 2026-04-16 y con rama `test/preview-db-separation` en 2026-04-23 para validar separación de DB

### 3. Variables de entorno

Configuradas en Vercel Project Settings → Environment Variables. Desde
2026-04-23 (FASE 10 BLOQUE K.1) las 3 variables de Supabase están
**separadas por scope** — Production y Preview/Development apuntan a
proyectos Supabase distintos:

| Variable | Scope "Production" | Scope "Preview + Development" |
|----------|--------------------|-------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto `preenvios` (prod) | URL del proyecto `preenvios-preview` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key del prod | anon key del preview |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key del prod | service_role key del preview |

Las demás variables siguen compartidas entre los 3 scopes:

| Variable | Qué es | Scopes |
|----------|--------|--------|
| `NEXT_PUBLIC_GA_ID` | ID de Google Analytics GA4 | Production + Preview + Development |
| `CRON_SECRET` | Auth de `/api/scrape` (Vercel Cron) | Production + Preview + Development |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Rate-limit en endpoints públicos | Production + Preview + Development |
| `SENTRY_DSN` | Error tracking | Production + Preview + Development |
| `ADMIN_PASSWORD` | Auth del admin panel | Production + Preview + Development |

Detalle completo y razón por la que solo Supabase está separada: Proceso 27.

Las variables están duplicadas en GitHub Secrets (Settings → Secrets → Actions)
como redundancia para GitHub Actions futuro.

### 4. Seguridad de credenciales
- `.env.local` existe solo en la máquina del desarrollador — está en `.gitignore`
- `.env.example` está commiteado con los nombres de las variables sin valores
- Las keys nunca aparecen en el código ni en commits
- Vercel inyecta las variables en build time y runtime automáticamente

### 5. DNS y dominio (diferido)
- **Producción actual:** `preenvios.vercel.app` (Next.js)
- **MVP activo:** `preenvios.com` sigue en GitHub Pages (index.html estático)
- **Migración DNS:** diferida hasta después de Fase 1.5 (legal) y pruebas de Fase 2 (scrapers)
- Cuando se haga: cambiar registros A y CNAME en Namecheap para apuntar a Vercel

### 6. Dependabot
- `.github/dependabot.yml` escanea dependencias npm cada lunes
- Abre PRs automáticamente cuando detecta vulnerabilidades
- Review manual antes de merge — no auto-merge

## Estado de Fase 1

**35 de 36 checkboxes completados.** El único pendiente (diferido) es la migración DNS de preenvios.com de GitHub Pages a Vercel.

| Bloque | Qué incluye | Estado |
|--------|-------------|--------|
| 1 — Scaffolding | Next.js, Tailwind, i18n, Supabase client | Completado 2026-04-16 |
| 2 — Base de datos | Tablas, API, ranking, seed | Completado 2026-04-16 |
| 3 — Componentes | Nav, Comparador, secciones, country search, delivery method | Completado 2026-04-16 |
| 4 — SEO/i18n | Cookie NEXT_LOCALE, hreflang, sitemap, robots, GA4 | Completado 2026-04-16 |
| 5 — Deploy | Vercel conectado, env vars, GitHub Secrets, preview verified | Completado 2026-04-16 |
