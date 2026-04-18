# 11 — Logos o banderas rotas en el UI

## Gravedad · Tiempo al fix
🟢 Menor
⏱ Fix típico: 5 min

## Síntoma
Strip de operadores muestra cuadros vacíos donde deberían estar los 7 logos. O el dropdown de países del comparador no muestra banderas. O la página de país carga sin la bandera grande del hero.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — CDN de `cdn.brandfetch.io` caído
Contexto: 7 logos dependen de este CDN externo:
- `components/Sections.tsx:22` (LogoStrip)
- `components/Comparador.tsx:29-35` (result cards)

Arreglo:
1. Verificar CDN directo: `curl -I https://cdn.brandfetch.io/remitly.com/w/120/h/120`
2. Si 5xx: CDN caído. Esperar recovery. `onError` en el código oculta las imágenes pero queda espacio vacío.
3. Hardening futuro: descargar los 7 logos, ponerlos en `public/logos/` y servirlos localmente. Cambiar URLs a `/logos/remitly.png` etc.

### 🎯 Causa 2 — CDN de `flagcdn.com` caído
Contexto: banderas en:
- `components/Comparador.tsx:234` y `:255` (selector y dropdown)
- `app/[locale]/[pais]/pais-content.tsx` (hero, cross-links)

Arreglo:
1. Verificar: `curl -I https://flagcdn.com/w40/do.png`
2. Si 5xx: CDN caído. Mismo hardening: descargar banderas a `public/flags/` y servir localmente.

### 🎯 Causa 3 — `codigo_pais` inválido en dropdown
Contexto: si algún corredor en `CORREDORES` (Comparador.tsx:11-18) tiene un `codigo_pais` que no existe en flagcdn (ej. típo como `rd` en lugar de `do`), la URL retorna 404.

Arreglo:
1. Abrir el selector del comparador → ¿qué bandera está rota?
2. Revisar `components/Comparador.tsx:11-18` — cada entrada tiene `codigo_pais` correcto
3. Los válidos son ISO 3166-1 alpha-2 minúsculas: `do`, `hn`, `gt`, `sv`, `co`, `mx`, `ni`, `ht`
4. Verificar que `lib/paises.ts` usa los mismos códigos en `codigoPais`

### 🎯 Causa 4 — Loading `lazy` tarda en renderizar
Contexto: los logos tienen `loading="lazy"`. Si el usuario hace scroll rápido, puede ver el placeholder unos ms.

Arreglo:
1. Es comportamiento correcto (Core Web Vitals optimization)
2. Si quieres priorizar algunos logos: quitar `loading="lazy"` y agregar `priority` (pero impacta LCP)

### 🎯 Causa 5 — `onError` ocultó imagen pero el layout queda roto
Contexto: `Sections.tsx:22` hace `onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}`. La imagen se oculta pero el span del nombre queda.

Arreglo:
1. Esto es diseño — si CDN falla, se ve el texto del brand sin logo. Es aceptable.
2. Si quieres ocultar toda la tarjeta: envolver en `<span class="logo-card">` y ocultar si el `<img>` falla.

## Workaround mientras arreglas
El sitio sigue funcionando. Solo es un problema visual. Ningún dato se pierde.

## Relacionados
- Ninguno — esto es puramente presentacional
