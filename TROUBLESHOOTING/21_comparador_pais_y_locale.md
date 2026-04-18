# 21 — País o idioma equivocados al cargar el sitio

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-15 min

## Síntoma
Tres síntomas posibles relacionados al estado inicial del comparador y al locale por defecto:
- El usuario entra a `/es/guatemala` (o cualquier página de país) y el comparador muestra Rep. Dominicana u Honduras en lugar de Guatemala
- El nav muestra "Corredores" (o "Countries") en lugar de "Destinos" / "Destinations"
- El usuario con navegador en inglés entra a `preenvios.com` y aterriza en `/en` en vez de `/es`

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Cookie `preenvios_corredor` sobreescribe `defaultCorredor`
Contexto: `components/Comparador.tsx` tiene dos efectos de cookie. El segundo lee `preenvios_corredor` al montar y llama `setCorredor(saved)`. Esto es correcto en la home (`/es`, `/en`) pero rompe las páginas de país. La regla es: si el componente recibe `defaultCorredor` como prop, el prop gana y la cookie no se lee.

Arreglo:
1. Verificar que el `useEffect` de cookie tiene el early return:
   ```bash
   grep -A 2 "COOKIE corredor" components/Comparador.tsx | head -8
   ```
2. Debe aparecer `if (defaultCorredor) return` como primera línea del effect
3. Si falta: restaurar del commit `feat(ui/i18n): ...` que introdujo el fix. Sin esa línea, cualquier visita previa a otra página de país graba la cookie y arruina la pre-selección en páginas de país siguientes.

### 🎯 Causa 2 — Página de país no pasa `defaultCorredor`
Contexto: `app/[locale]/[pais]/pais-content.tsx` debe llamar a `<Comparador defaultCorredor={pais.corredorId} ... />`. Si alguien remueve ese prop, la pre-selección falla porque `useState(defaultCorredor || 'dominican_republic')` cae al fallback.

Arreglo:
1. `grep -n "defaultCorredor" app/[locale]/[pais]/pais-content.tsx`
2. Debe haber al menos 1 match: `defaultCorredor={pais.corredorId}`
3. Si falta: restaurar. `pais.corredorId` viene de `lib/paises.ts` y mapea slugs → IDs (`honduras` → `honduras`, `republica-dominicana` → `dominican_republic`, etc.)

### 🎯 Causa 3 — Slug del país no encuentra match en `lib/paises.ts`
Contexto: `findPaisBySlug(slug)` devuelve `undefined` si el slug no matchea. El `!` en `findPaisBySlug(slug)!` deja pasar el undefined y rompe el comparador.

Arreglo:
1. Verificar `lib/paises.ts` tiene todos los slugs MVP: `honduras`, `republica-dominicana`, `dominican-republic`, `guatemala`, `el-salvador`
2. Si el síntoma es solo en inglés para RD (`/en/dominican-republic` no pre-selecciona): confirmar que `slugEn` está definido y que `findPaisBySlug` busca tanto en `slugEs` como `slugEn`

### 🎯 Causa 4 — Clave `nav.corridors` no actualizada en `messages/`
Contexto: el nav lee `nav.corridors` via `useTranslations('nav')`. Si solo se actualiza un archivo de los dos, hay divergencia entre ES y EN.

Arreglo:
1. Verificar ambos archivos:
   ```bash
   grep '"corridors"' messages/es.json messages/en.json
   ```
2. Debe ver: `es.json "corridors": "Destinos"` y `en.json "corridors": "Destinations"`
3. Si alguno dice "Corredores" o "Countries": editar. El componente no cambia — solo las traducciones.

### 🎯 Causa 5 — Middleware siguió detectando Accept-Language
Contexto: desde 2026-04-18 el locale default es siempre `es`. `i18n/routing.ts` debe incluir `localeDetection: false`. Si esa línea falta, next-intl lee Accept-Language y manda usuarios con navegador en inglés a `/en` automáticamente.

Arreglo:
1. Revisar `i18n/routing.ts`:
   ```bash
   grep -n "localeDetection" i18n/routing.ts
   ```
2. Debe aparecer `localeDetection: false` en el objeto passed a `defineRouting`
3. Si falta: agregar. Tras el cambio, redeploy o test local con navegador en inglés → debería aterrizar en `/es`

### 🎯 Causa 6 — Cookie `NEXT_LOCALE` vieja persiste
Contexto: un usuario que visitó el sitio con la detección activa y aterrizó en `/en` tiene `NEXT_LOCALE=en` en cookie. Con `localeDetection: false` eso sigue siendo válido — la cookie gana.

Arreglo:
1. Comportamiento correcto: la cookie persiste la elección del usuario (incluso una "elección" accidental por detección vieja)
2. Si el usuario quiere volver a español: click en botón EN/ES en el nav. Esto sobrescribe la cookie
3. Si hay queja masiva de que muchos usuarios quedaron atrapados en inglés: se puede expirar la cookie una sola vez cambiando su nombre (ej. `NEXT_LOCALE` → `NEXT_LOCALE_V2`) en `i18n/routing.ts`. Eso invalida las cookies viejas sin tocar las nuevas

### 🎯 Causa 7 — Middleware matcher no cubre la ruta
Contexto: `middleware.ts` tiene `matcher: ['/', '/(es|en)/:path*']`. Si alguien restringe el matcher, rutas como `/guatemala` (sin prefijo locale) se saltan el middleware y next-intl no resuelve el locale.

Arreglo:
1. Revisar `middleware.ts` y confirmar que `/` está en el matcher
2. El redirect `/` → `/es` depende del middleware. Sin ese match, `preenvios.com/` devolvería 404

## Workaround mientras arreglas
- País equivocado en comparador: el usuario puede seleccionar manualmente el país en el dropdown. La experiencia es peor pero sigue funcional
- Idioma equivocado: click en botón EN/ES del nav
- Texto "Corredores" viejo: es cosmético, no bloquea uso

## Relacionados
- [LOGICA_DE_NEGOCIO/05_i18n_seo.md](../LOGICA_DE_NEGOCIO/05_i18n_seo.md) — regla de idioma por defecto y flujo de detección
- [LOGICA_DE_NEGOCIO/17_paginas_por_corredor.md](../LOGICA_DE_NEGOCIO/17_paginas_por_corredor.md) — cómo defaultCorredor fluye del slug al componente
- [12_i18n_locale_rutas_rotas.md](12_i18n_locale_rutas_rotas.md) — si las rutas multi-idioma devuelven 404
- [20_comparador_ui_roto.md](20_comparador_ui_roto.md) — si el comparador pinta mal visualmente
