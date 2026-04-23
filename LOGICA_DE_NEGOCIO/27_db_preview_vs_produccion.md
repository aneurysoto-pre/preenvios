# Proceso 27 — Separación DB preview vs producción (FASE 10 BLOQUE K.1)

## Descripción

Desde el 2026-04-23 PreEnvios usa **dos proyectos Supabase distintos** — uno para
producción y otro para preview/development. Antes las 3 env vars de Supabase
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) estaban compartidas entre los 3 scopes de Vercel
(Production + Preview + Development) — cualquier deploy de preview escribía
directo en la DB de prod.

Completado como FASE 10 BLOQUE K.1 — commit `edaa553` (script SQL) + commit
`5354386` (docs cierre).

## Resumen en 2 líneas (para el founder)

- **Preenvios como producto público** → vive en **producción** (DB vieja
  `preenvios`). Es el sitio que usan los clientes reales. Todo lo que se
  publica en `main` termina acá.
- **Branches de desarrollo** → viven en **preview** (DB nueva
  `preenvios-preview`). Solo vos y desarrolladores las ven. Lo que se prueba
  en una branch se escribe acá — nunca toca la DB de clientes reales.

## Por qué importa

**Riesgo real si no se separa:** si un dev (o Claude, o un PR de Dependabot)
ejecuta una migration destructiva (`DROP TABLE`, `TRUNCATE`, `DELETE` sin
WHERE) en una branch efímera y el preview apunta a la DB de prod, borra data
real de usuarios: contactos, suscriptores de alertas, historial de anomalías,
precios scrapeados acumulados.

**Regla universal de DevOps violada:** nunca una DB prod se comparte con staging.
No por miedo irracional — por historial: es el error #1 en post-mortems públicos
de outages reportados por startups que crecen rápido (ver Honeycomb, Github,
Coinbase, todos lo han hecho al menos una vez).

## Arquitectura final

```
┌─────────────────────────────────────────────────────┐
│               GitHub aneurysoto-pre/preenvios       │
│               push a main = prod deploy             │
│               push a otra branch = preview deploy   │
└──────────────────────┬──────────────────────────────┘
                       │ webhook
           ┌───────────┴────────────┐
           ▼                        ▼
    ┌──────────────┐         ┌──────────────┐
    │   Vercel     │         │   Vercel     │
    │  Production  │         │   Preview    │
    │  scope       │         │   + Dev      │
    └──────┬───────┘         └───────┬──────┘
           │                         │
           │ lee env vars            │ lee env vars
           │ NEXT_PUBLIC_SUPABASE_URL│ NEXT_PUBLIC_SUPABASE_URL
           │ (valor: prod)           │ (valor: preview)
           ▼                         ▼
    ┌──────────────┐         ┌──────────────┐
    │  Supabase    │         │  Supabase    │
    │  "preenvios" │         │  "preenvios- │
    │  (prod DB)   │         │   preview"   │
    │              │         │              │
    │  URL:        │         │  URL:        │
    │  preenvios.  │         │  preenvios.  │
    │  com +       │         │  com/git-*   │
    │  preenvios.  │         │  (hash       │
    │  vercel.app  │         │   unique)    │
    └──────────────┘         └──────────────┘
```

**`preenvios.vercel.app`** es el **alias canónico de production** — apunta
siempre al último deploy de `main`. NO es preview. Los previews son URLs tipo
`preenvios-git-<branch>-aneurysoto-pre.vercel.app` o
`preenvios-<hash>.vercel.app` — generadas automáticamente por Vercel en cada
push a branches que no sean `main`.

## Los 2 proyectos Supabase

### Proyecto 1 — `preenvios` (producción)

- **Plan:** Free tier actual (upgradea a Pro cuando haya data real).
- **Uso:** todo el tráfico real — `preenvios.com` post-cutover, `preenvios.vercel.app`
  (alias de prod), Vercel Cron diario que llama `/api/scrape`.
- **Quién escribe:** los 7 scrapers vía `/api/scrape` (con auth `CRON_SECRET`
  tras BLOQUE A.1), el form `/contacto`, el form `/alertas`, el admin.
- **Migraciones:** todas las 001..007 aplicadas manualmente por el founder vía
  Supabase SQL Editor a medida que se agregan features.

### Proyecto 2 — `preenvios-preview` (preview + development)

- **Plan:** Free tier (no va a crecer).
- **Uso:** deploys de branches ≠ main (PRs, tests, features WIP). Cada push a
  una branch dispara un preview deploy que escribe en esta DB.
- **Quién escribe:** nadie en régimen normal — solo cuando se hace smoke test
  explícito en un preview deploy.
- **Migraciones:** se inicializan con el script `supabase/preview_setup_all.sql`
  (concat de 001..007 + seed de 4 corredores MVP originales). Si se agregan
  migraciones futuras (008, 009...) **hay que aplicarlas MANUALMENTE aquí
  también**, o la DB preview queda desincronizada del schema de prod.

## Env vars en Vercel — configuración exacta

Cada una de las 3 envs de Supabase tiene **2 entries** en Vercel:

| Env var | Scope "Production" | Scope "Preview + Development" |
|---------|-------------------|-------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto prod | URL del proyecto preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key prod | anon key preview |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key prod | service_role key preview |

Total: **6 entries de Supabase en Vercel** (en lugar de 3 compartidas).

Las demás env vars (`NEXT_PUBLIC_GA_ID`, `CRON_SECRET`, `UPSTASH_*`,
`SENTRY_DSN`, etc.) siguen compartidas entre los 3 scopes — no tienen razón
técnica para estar separadas (GA4, Sentry, rate-limit son "servicios
compartidos" que el preview puede tocar sin romper prod).

## Cómo aplicar una migración nueva (flujo correcto)

Cuando en el futuro se cree una migración `008_xxx.sql`:

1. **Crear el archivo** en `supabase/migrations/008_xxx.sql` (idempotente con
   `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS` + `CREATE POLICY`).
2. **Correrlo en preview primero** (proyecto `preenvios-preview`) — probar
   que no rompe nada y que hace lo esperado.
3. **Si el smoke test pasa en preview, correr el mismo SQL en prod** (proyecto
   `preenvios`). Nunca al revés.
4. **Opcional pero recomendado:** actualizar el script
   `supabase/preview_setup_all.sql` para incluir la nueva migración — así si
   en el futuro hay que recrear el proyecto preview (Supabase Free tier se
   pausa tras 7 días sin actividad), el script se vuelve a ejecutar entero y
   queda listo sin olvidos.

Si se salta el paso 2 y se aplica directo en prod, se pierde la "red de
seguridad" de probar primero — el punto entero de tener el preview.

## Reinicializar preview desde cero (si Supabase pausa el proyecto)

Supabase Free tier pausa los proyectos inactivos a los 7 días. Si pasa eso con
`preenvios-preview`:

1. Ir al dashboard de Supabase → proyecto `preenvios-preview` → "Restore" (si
   está pausado sin borrar) o "New Project" (si se borró).
2. Correr `supabase/preview_setup_all.sql` completo en el SQL Editor.
3. Actualizar las 3 env vars scope "Preview + Development" en Vercel con los
   valores nuevos (URL + anon key + service_role key).
4. Redeployar cualquier preview activo.
5. Smoke test: insertar contacto en preview → verificar que NO aparece en prod.

## Cómo validar la separación en el futuro

Si querés re-verificar que sigue funcionando (ej. tras agregar envs nuevas o
hacer cambios en la config de Vercel):

1. Crear branch efímera: `git checkout -b test/db-sep && git commit --allow-empty -m "test" && git push -u origin test/db-sep`
2. Esperar ~2 min hasta que Vercel genere el preview deploy.
3. Ir a `<URL-preview>/es/contacto` (NO a preenvios.vercel.app) — la URL es
   tipo `preenvios-git-test-db-sep-aneurysoto-pre.vercel.app`.
4. Insertar contacto con nombre distintivo (ej. `TEST PREVIEW {fecha}`).
5. Query a preview DB: debe aparecer.
6. Query a prod DB: NO debe aparecer.
7. Cleanup: `git push origin --delete test/db-sep && git branch -D test/db-sep`
   + `DELETE FROM contactos WHERE nombre LIKE 'TEST PREVIEW%'` en preview.

Este procedimiento está validado. Se ejecutó el 2026-04-23 como smoke test
inicial de la separación — branch `test/preview-db-separation` (ya borrada).

## Qué pasa con las demás tablas

El script `preview_setup_all.sql` crea el schema de:

- `corredores` (6 MVP seedeados)
- `precios` (14 filas MX/CO via migration 006; HN/DO/GT/SV vacíos hasta
  primer cron de scrapers)
- `tasas_bancos_centrales` (6 filas MVP)
- `contactos` (vacía)
- `scraper_anomalies` (vacía)

**Lo que NO se seedea en preview** (y si hace falta, se agrega manualmente):

- Suscriptores de alertas (`suscriptores_free` si existe) — por privacidad.
- Historial de tasas (`historial_tasas_publico` si ya está activa) — se llena
  con el primer cron.
- Admin sessions — si se quiere probar el admin en preview, se logea con el
  mismo `ADMIN_PASSWORD` (env var compartida entre scopes).

## Archivos relacionados

| Archivo | Qué hace |
|---------|----------|
| `supabase/preview_setup_all.sql` | Script reejecutable que concatena las 7 migraciones + seed de 4 corredores base |
| `supabase/migrations/001..007_*.sql` | Migraciones individuales que se corren manualmente en **prod** (el script unificado es solo para preview) |
| `CONTEXTO_FINAL.md` Fase 10 BLOQUE K.1 | Tracking del item como `[x]` completado |
| `LOGICA_DE_NEGOCIO/06_deploy_vercel.md` | Referencia cruzada al flujo general Vercel |

## Relacionados

- Proceso 03 — Base de datos (schema Supabase)
- Proceso 06 — Deploy en Vercel
- Proceso 24 — Agente 1 validador (tabla `scraper_anomalies`)
- `SERVICIOS_EXTERNOS.md` — Supabase en la bitácora de servicios externos
