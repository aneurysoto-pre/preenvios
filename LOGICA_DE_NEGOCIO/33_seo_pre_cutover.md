# Proceso 33 — SEO pre-cutover (canonical vercel.app + OG + cutover plan)

**Decidido 2026-04-25.** Plan de 3 fases para que Google indexe el
sitio nuevo HOY (en `preenvios.vercel.app`) en lugar de esperar al
cutover de DNS. Cuando el cutover ocurra, las señales de ranking se
transfieren via redirect 301 + GSC Change of Address tool.

## Por qué esta decisión

`preenvios.com` (dominio canonical comercial) hoy NO está apuntando al
sitio nuevo de Vercel — sirve un sitio viejo en GitHub Pages con
contenido distinto. El sitio nuevo vive en `preenvios.vercel.app`.

**Problema antes del fix**: el código tenía `https://preenvios.com`
hardcoded en:
- `app/sitemap.ts` (BASE_URL)
- `app/robots.ts` (sitemap reference)
- 18 page.tsx con `alternates.canonical`
- JSON-LD `@id` (Organization, WebSite, etc.)
- hreflang globales en root layout

Resultado: Google crawlea `preenvios.vercel.app`, lee el canonical
apuntando a `preenvios.com`, va a `preenvios.com`, encuentra el sitio
viejo de GitHub Pages, concluye "este es duplicado" y **no indexa el
sitio nuevo como propio**. Cero rankings acumulándose.

**Después del fix (commit `83122ad`)**: Google indexa
`preenvios.vercel.app` como entidad propia. Cuando el cutover ocurra,
los rankings se transfieren limpio.

## Plan de 3 fases

### Fase 1 — HOY (commit `83122ad`, 2026-04-25)

**Cambios aplicados** (28 archivos, 1 commit squash a main):

1. **Canonical host → `preenvios.vercel.app`**
   - `app/sitemap.ts`: `BASE_URL = 'https://preenvios.vercel.app'`
   - `app/robots.ts`: `Sitemap: https://preenvios.vercel.app/sitemap.xml`
   - 18 `page.tsx` con `alternates.canonical` actualizados (sed
     find/replace global)
   - hreflang globales en `app/[locale]/layout.tsx`
   - JSON-LD `@id` (`Organization #organization`, `WebSite #website`,
     `WebPage #webpage`) actualizados a vercel.app
   - **NO tocado**: `app/api/whatsapp/webhook/route.ts` — ese código
     envía mensajes de WhatsApp con `preenvios.com/es` y
     `preenvios.com/en` al usuario final. No es canonical SEO. Es la
     marca pública que se mantiene en mensajes.

2. **Canonical/hreflang en `/[locale]/[pais]/page.tsx`**
   Antes la página principal del corredor (la columna vertebral SEO)
   no declaraba `alternates`. Ahora declara canonical + hreflang
   es/en explícitos. Las 12 páginas de corredor (6 países × 2 locales)
   con SEO correcto.

3. **Open Graph + Twitter Cards**
   - `app/[locale]/layout.tsx`: agregado `openGraph` + `twitter`
     defaults en metadata. Heredado por TODAS las rutas dentro de
     `[locale]/*`.
   - `app/[locale]/opengraph-image.tsx`: nuevo. Next.js auto-genera
     1200×630 PNG dinámica usando `ImageResponse` de `next/og`.
     Incluye logo P verde brand (mismo SVG del favicon/Sections.tsx)
     + wordmark "preenvios.com" + tagline localizado.
   - `twitter:card = summary_large_image`
   - **Resultado**: compartir cualquier link en
     WhatsApp/Twitter/Facebook/Slack/iMessage/LinkedIn/Discord ahora
     muestra preview con marca + tagline. Antes mostraba preview
     genérico sin imagen.

4. **Schema.org WebPage en 6 legales**
   `terminos`, `privacidad`, `disclaimers`, `como-ganamos-dinero`,
   `metodologia`, `uso-de-marcas` ahora declaran JSON-LD `WebPage`
   con `isPartOf` y `publisher` apuntando a las entidades canónicas
   del home (`#website` y `#organization`).

5. **robots.txt defense-in-depth**
   Agregado `Disallow: /admin/, /api/`. Antes el sitio confiaba solo
   en meta tag `noindex` (admin). Ahora hay defensa en 2 capas para
   crawlers que ignoren meta tags.

6. **Verificación Google Search Console**
   Archivo `public/google1cb89151f74262c2.html` agregado al repo
   (commit `eed83ea`). Permite verificar la propiedad
   `preenvios.vercel.app` en GSC. **NO borrar** — Google requiere
   que se mantenga permanente.

### Fase 2 — Día del cutover de DNS

**Trigger**: founder mueve DNS de `preenvios.com` → Vercel.

**Pasos en código** (script reverso del cambio de Fase 1):

```bash
# Find/replace global preenvios.vercel.app → preenvios.com en app/
grep -rEln "preenvios\.vercel\.app" app/ --include="*.ts" --include="*.tsx" \
  | xargs -I{} sed -i 's|https://preenvios\.vercel\.app|https://preenvios.com|g' {}

# Verificar que el webhook NO se tocó (mantiene preenvios.com original)
grep "preenvios.com" app/api/whatsapp/webhook/route.ts  # debe seguir intacto
```

**Pasos de configuración** (fuera del código):
- Vercel: setup redirect 301 `preenvios.vercel.app/*` → `preenvios.com/*`
- GSC: verificar la propiedad `preenvios.com` (descargar otro archivo
  HTML similar al de vercel.app, agregarlo a `/public/`)
- GSC: usar **Change of Address tool** (Settings → Change of address)
  para transferir señales de `preenvios.vercel.app` →
  `preenvios.com`. Esto es CRÍTICO — sin este paso, los rankings no
  se transfieren limpio.
- Submit nuevo sitemap en GSC: `https://preenvios.com/sitemap.xml`

### Fase 3 — Post-cutover (semana 1-4)

- Monitorear **Coverage** en GSC: las URLs `preenvios.vercel.app/*`
  van a aparecer como "Redirected" después del 301 + Change of
  Address. Las nuevas `preenvios.com/*` van a aparecer como "Indexed".
- Tiempo esperado de consolidación: 2-4 semanas.
- Si después de 4 semanas las URLs viejas siguen apareciendo como
  "Indexed" en lugar de "Redirected", revisar redirect 301 y
  Change of Address.

## Estado del sitemap actual

Verificación curl 2026-04-25 sobre `preenvios.vercel.app`:
- 188 URLs totales
- Todas con `<loc>https://preenvios.vercel.app/...</loc>`
- Incluye: home (2), 6 legales (12), 6 corredores (12), 48 páginas
  corredor+monto SSG, 17 wikis (34), 21 blogs (42), 7 operadores (14),
  6 tasas (12), calculadora-inversa (2), institucionales (6),
  blog/wiki índices (4)

## Archivos modificados en Fase 1 (28)

```
app/[locale]/[pais]/[monto]/page.tsx
app/[locale]/[pais]/page.tsx                  ← canonical/hreflang nuevo
app/[locale]/[pais]/pais-content.tsx
app/[locale]/alertas/page.tsx
app/[locale]/blog/[slug]/article.tsx
app/[locale]/blog/[slug]/page.tsx
app/[locale]/blog/page.tsx
app/[locale]/calculadora-inversa/page.tsx
app/[locale]/como-ganamos-dinero/page.tsx     ← + WebPage schema
app/[locale]/contacto/page.tsx
app/[locale]/disclaimers/content.tsx
app/[locale]/disclaimers/page.tsx             ← + WebPage schema
app/[locale]/layout.tsx                       ← + OG + twitter + metadataBase
app/[locale]/metodologia/page.tsx             ← + WebPage schema
app/[locale]/nosotros/page.tsx
app/[locale]/operadores/[slug]/operador-content.tsx
app/[locale]/operadores/[slug]/page.tsx
app/[locale]/opengraph-image.tsx              ← NUEVO (1200×630 dynamic)
app/[locale]/page.tsx
app/[locale]/privacidad/content.tsx
app/[locale]/privacidad/page.tsx              ← + WebPage schema
app/[locale]/tasa/[pair]/page.tsx
app/[locale]/tasa/[pair]/tasa-content.tsx
app/[locale]/terminos/content.tsx
app/[locale]/terminos/page.tsx                ← + WebPage schema
app/[locale]/uso-de-marcas/content.tsx
app/[locale]/uso-de-marcas/page.tsx           ← + WebPage schema
app/[locale]/wiki/[slug]/page.tsx
app/[locale]/wiki/[slug]/wiki-article.tsx
app/[locale]/wiki/page.tsx
app/robots.ts                                 ← + Disallow + sitemap vercel.app
app/sitemap.ts                                ← BASE_URL vercel.app
```

Plus archivo de verificación GSC en `public/`:
```
public/google1cb89151f74262c2.html            ← NO BORRAR
```

## Caveats técnicos

- **`metadataBase`** declarado en root layout = `'https://preenvios.vercel.app'`.
  Cuando se haga el cutover, **HAY QUE CAMBIARLO TAMBIÉN**. Si no,
  Next.js construye URLs absolutas (og:image, og:url) usando ese base.
- **Open Graph image cache**: cuando se cambie el dominio, redes
  sociales (Facebook, LinkedIn) cachean la OG image por días/semanas.
  Forzar refresh con Facebook Sharing Debugger
  (`developers.facebook.com/tools/debug/`) y LinkedIn Post Inspector
  (`linkedin.com/post-inspector/`).
- **Twitter Card validator** ya no existe (deprecado 2023). Twitter
  ahora hace fetch automático en cada share.

## Relacionados

- Proceso 27 — DB preview vs prod (separación que permitió validar
  estos cambios sin tocar prod)
- CONTEXTO_FINAL § DNS cutover — bloqueante general del lanzamiento
- CHECKLIST_PRE_LANZAMIENTO § 16 — pasos del cutover de DNS, ahora
  expandido con verificación SEO post-cutover
