# 12 — i18n / locale / rutas rotas

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
Usuario entra a `preenvios.com` y el navegador entra en loop redirigiendo. O: botones muestran texto literal tipo `"[search.button]"` en vez de "Comparar". O: cambiar EN/ES pierde la página actual y lleva al home.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Clave faltante en `messages/es.json` o `messages/en.json`
Contexto: componentes usan `t('nav.corridors')`. Si la key no existe en el JSON del locale actual, next-intl renderiza el literal `[nav.corridors]`.

Arreglo:
1. Ver en el UI qué key está fallando (texto entre corchetes)
2. Abrir `messages/es.json` y `messages/en.json` — agregar la key con el valor traducido
3. Ambos archivos deben tener la misma estructura de keys
4. Hot reload en dev: `npm run dev`. En prod: commit + push
5. Verificación: la key se reemplaza por el texto correcto

### 🎯 Causa 2 — Redirect loop `/` → `/es` → `/`
Contexto: `middleware.ts` con matcher `['/', '/(es|en)/:path*']`. next-intl redirige `/` a `/es` o `/en` según `Accept-Language`. Si la cookie `NEXT_LOCALE` está corrupta, puede loopear.

Arreglo:
1. DevTools → Application → Cookies → borrar cookie `NEXT_LOCALE`
2. Refrescar — debe entrar limpio
3. Si persiste: revisar `i18n/routing.ts` — `defaultLocale` debe ser `'es'` y el array `locales = ['es', 'en']`
4. Verificar `middleware.ts` no tenga matcher que capture recursivamente

### 🎯 Causa 3 — Botón EN/ES pierde la ruta actual
Contexto: `components/Nav.tsx:21-32` hace `pathname.replace('/${locale}', '/${next}')`. Si la ruta actual es `/` (sin prefijo), el replace no matchea y redirige mal.

Arreglo:
1. Ir a una ruta con prefijo: `/es/tasa/usd-dop` → botón EN debe ir a `/en/tasa/usd-dop`
2. Si falla: debug en `Nav.tsx:23` con `console.log(pathname, locale, next)`
3. Fix típico: agregar fallback:
   ```ts
   const path = pathname === '/'
     ? `/${next}`
     : pathname.replace(`/${locale}`, `/${next}`)
   ```

### 🎯 Causa 4 — Slug de país en un locale no existe en el otro
Contexto: `lib/paises.ts` tiene `slugEs: 'republica-dominicana'` y `slugEn: 'dominican-republic'`. Si el usuario está en `/es/republica-dominicana` y cambia a EN, debería ir a `/en/dominican-republic` pero el naive replace va a `/en/republica-dominicana` (404).

Arreglo:
1. Verificar que al cambiar idioma en una página `/[pais]` llegue al slug correcto del otro locale
2. Si no: agregar lógica en `Nav.tsx switchLocale()`:
   ```ts
   import { PAISES_MVP } from '@/lib/paises'
   const match = PAISES_MVP.find(p => pathname.includes(p.slugEs) || pathname.includes(p.slugEn))
   if (match) {
     const targetSlug = next === 'en' ? match.slugEn : match.slugEs
     const sourceSlug = locale === 'en' ? match.slugEn : match.slugEs
     path = pathname.replace(sourceSlug, targetSlug).replace(`/${locale}`, `/${next}`)
   }
   ```

### 🎯 Causa 5 — `setRequestLocale` faltante en una página nueva
Contexto: Next.js 16 + next-intl requiere que cada page llame `setRequestLocale(locale)` para static generation bilingüe.

Arreglo:
1. Build logs → `Error: Unable to find 'next-intl' locale`
2. En la page.tsx afectada agregar:
   ```ts
   import { setRequestLocale } from 'next-intl/server'
   // dentro del componente, tras await params:
   setRequestLocale(locale)
   ```

## Workaround mientras arreglas
Compartir link directo con locale explícito: `preenvios.com/es/...` o `preenvios.com/en/...`. Evitar el root `/` hasta arreglar el redirect.

## Relacionados
- [LOGICA_DE_NEGOCIO/05_i18n_seo.md](../LOGICA_DE_NEGOCIO/05_i18n_seo.md) — implementación i18n completa
