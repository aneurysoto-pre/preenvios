# 23 — Regresiones del pulido UI (iconos, footer 4 cols, timestamp, /nosotros anónimo)

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 5-15 min

## Síntoma
Regresiones visuales o de contenido introducidas en la fase de pulido del 2026-04-18:
- Vuelven a aparecer los emojis 💰 ⚡ 🔒 en la sección "Por qué PreEnvios" (deberían ser iconos SVG de lucide-react)
- Los círculos 1-2-3 de "Cómo funciona" son simples (solo número, sin gradiente ni icono) — se rompió el rediseño
- El footer aparece con 3 columnas de contenido en lugar de 4, o falta la columna "Recursos"
- El selector de idioma muestra solo "EN"/"ES" sin bandera
- No aparece el badge verde "Tasas actualizadas hace X min" arriba de los resultados del Comparador
- Vuelve a aparecer el nombre "Aneury Soto" o la sección "El fundador" en `/nosotros`
- Una página como `/es/blog` no tiene `<title>` ni `<meta description>` específico (hereda el global)
- El CTA "Comparar ahora →" se ve roto en mobile (botón muy ancho, texto envuelto, flecha separada del texto)

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `lucide-react` no instalado o versión incompatible
Contexto: los iconos de WhySection y StepsSection importan de `lucide-react`. La versión fijada es `^0.542.0`. Si alguien hizo `npm install lucide-react` sin versión, npm puede resolver a `^1.x.x` (API antigua incompatible).

Arreglo:
1. Verificar versión en package.json:
   ```bash
   grep "lucide-react" package.json
   ```
2. Debe aparecer `"lucide-react": "^0.542.0"` (o superior `^0.x.x`). Si aparece `^1.x.x` o `^2.x.x`:
   ```bash
   npm install lucide-react@^0.542.0
   ```
3. Verificar que `components/Sections.tsx` importe con named imports: `import { DollarSign, Zap, ShieldCheck, Search, BarChart3, Send } from 'lucide-react'`

### 🎯 Causa 2 — Emojis restaurados accidentalmente en WhySection
Contexto: alguien editó `components/Sections.tsx` y revirtió los iconos a emojis strings.

Arreglo:
1. Verificar:
   ```bash
   grep -c "DollarSign\|ShieldCheck\|Zap" components/Sections.tsx
   ```
   Debe dar >=3 (los 3 iconos importados)
2. En `WhySection` la lista `items` debe tener `Icon: DollarSign`, `Icon: Zap`, `Icon: ShieldCheck` — NO `icon: '💰'` como string

### 🎯 Causa 2bis — Círculos de Steps demasiado grandes
Contexto: el diseño final del 2026-04-18 es `w-12 h-12` (48px) para los círculos, `size={20}` para el icono lucide interno, y badge numérico `w-5 h-5 text-[11px]`. El diseño anterior usaba `w-24 h-24` (96px) que dominaba visualmente.

Arreglo:
1. Verificar en `components/Sections.tsx` StepsSection:
   ```bash
   grep -E "w-12 h-12|w-24 h-24" components/Sections.tsx
   ```
2. Debe aparecer solo `w-12 h-12` (NO `w-24 h-24`)
3. Línea punteada horizontal en `top-6` (24px = centro del círculo de 48px). Si está en `top-11` es el valor viejo — actualizar

### 🎯 Causa 3 — Timestamp "hace X min" no se muestra
Contexto: el label depende de `lastFetch` (set cuando `/api/precios` responde). Si el fetch falla silenciosamente, `lastFetch` queda null y el label no aparece.

Arreglo:
1. DevTools → Network → confirmar que `/api/precios` devuelve 200
2. Ver en `components/Comparador.tsx` que hay `setLastFetch(Date.now())` DENTRO del try del fetch, solo si `Array.isArray(data)`
3. Verificar que el `setInterval` de `setNowTick` existe (30s). Sin él, el label se congela al primer render
4. Si persiste: verificar claves `search.updatedJustNow`, `updatedMinutes`, `updatedHour`, `updatedHours` en messages/es.json y en.json (4 claves)

### 🎯 Causa 4 — Footer quedó en 3 columnas (falta Recursos)
Contexto: la regla del proyecto (CONTEXTO_FINAL regla #12) es 4 columnas de contenido + brand. Si alguien edita `components/Sections.tsx` Footer y quita la columna Recursos:

Arreglo:
1. Verificar:
   ```bash
   grep -c "t('resources')\|Recursos" components/Sections.tsx
   ```
   Debe dar >=1
2. El grid debe ser `lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]` (5 tracks: brand + 4 columnas)
3. Verificar las claves `footer.resources`, `footer.wiki`, `footer.blog`, `footer.operators`, `footer.rateHistory` en ambos messages/*.json

### 🎯 Causa 5 — Aparece de nuevo "Aneury Soto" o la sección del fundador en /nosotros
Contexto: la regla del proyecto (CONTEXTO_FINAL regla #10) es que `/nosotros` es anónimo — solo marca Preenvíos. NO debe haber foto/avatar/bio del fundador.

Arreglo:
1. Grep repo:
   ```bash
   grep -r "Aneury\|founderName\|founderBio\|founderTitle" components/ app/ messages/
   ```
2. Si aparecen matches en `messages/*.json` o en `app/[locale]/nosotros/content.tsx`: eliminar. La única mención aceptable es en CONTEXTO_FINAL.md donde se documenta la regla (y posiblemente en troubleshooting archivado)
3. El componente `NosotrosContent` NO debe renderizar ninguna sección con `<h2>` de "Fundador"/"Founder"

### 🎯 Causa 6 — Meta description falta o es genérica en una ruta
Contexto: desde 2026-04-18 cada page.tsx top-level debe exportar `generateMetadata` bilingüe. Si falta, Next cae al `layout.tsx` global.

Arreglo:
1. Verificar presencia en las páginas top-level:
   ```bash
   grep -l "generateMetadata" app/[locale]/page.tsx app/[locale]/nosotros/page.tsx app/[locale]/contacto/page.tsx app/[locale]/wiki/page.tsx app/[locale]/blog/page.tsx app/[locale]/operadores/[slug]/page.tsx app/[locale]/[pais]/page.tsx
   ```
2. Deben devolver los 7 paths. Si falta alguno: agregarlo siguiendo el patrón:
   ```ts
   export async function generateMetadata({ params }): Promise<Metadata> {
     const { locale } = await params
     const en = locale === 'en'
     return { title: en ? '...' : '...', description: en ? '...' : '...', alternates: { canonical: ..., languages: { es, en } } }
   }
   ```

### 🎯 Causa 7 — Banderas emoji aparecen como "us", "do", "hn", "gt", "sv" en texto pequeño
Contexto: Windows NO renderiza flag emojis (🇺🇸 🇪🇸 🇩🇴 🇭🇳 🇬🇹 🇸🇻 🇨🇴 🇲🇽 🇳🇮 🇭🇹). Los muestra como las dos letras Regional Indicator ("US", "DO", "HN"...) en texto pequeño que parece un bug del sitio. Afecta el selector de idioma Y los dropdowns/tabs de corredores.

**Opciones aprobadas del proyecto** (NO usar emoji flags en UI):
1. **SVG inline** — para selector de idioma. Componentes `<FlagUS />` y `<FlagES />` definidos al inicio de `components/Nav.tsx`
2. **PNG de flagcdn.com** — para listas de corredores. Patrón: `<img src={\`https://flagcdn.com/w40/${codigoPais}.png\`} className="w-[22px] h-[15px] rounded-[2px]" />`

Arreglo (selector de idioma):
1. `grep -E "FlagUS|FlagES" components/Nav.tsx` — deben aparecer >=4 matches
2. Si aparece 🇺🇸 o 🇪🇸 literal: regresión → volver a `<FlagUS />` / `<FlagES />`

Arreglo (dropdowns de corredores, Nav + calculadora inversa + cualquier sitio futuro):
1. `grep -rn "bandera\b" app/ components/` — buscar usos restantes
2. Si algún lugar renderiza `{p.bandera}` o `{c.bandera}` como JSX: reemplazar por `<img src={\`https://flagcdn.com/w40/${p.codigoPais}.png\`} />`. El campo `bandera` sigue en las constantes JS pero como dato histórico — no renderizar directamente
3. Si el CSP bloquea `flagcdn.com`: agregar `img-src https://flagcdn.com` al `Content-Security-Policy` en `next.config.ts`. Alternativa: copiar los 8 PNGs a `public/flags/` y servirlos localmente

### 🎯 Causa 8 — CTA mobile roto (flecha separada o wrap feo)
Contexto: la flecha → debe estar pegada al texto "Comparar ahora" vía `gap-1.5` en un `inline-flex`. Si alguien vuelve a usar `{t('button')} →` con la flecha como texto, en mobile puede salir en otra línea.

Arreglo:
1. Verificar en `components/Sections.tsx` CTASection:
   ```bash
   grep -A 2 "cta" components/Sections.tsx | grep -A 1 "inline-flex"
   ```
2. El `<a>` debe ser `inline-flex items-center justify-center gap-1.5` y el → debe ser un `<svg>` separado, NO texto concatenado
3. El contenedor debe tener `whitespace-nowrap` para que el botón no se parta en dos líneas

## Workaround mientras arreglas
Ninguna de estas regresiones rompe funcionalidad — son todas cosméticas o de metadata. El sitio sigue comprando y enviando usuarios a afiliados. Si el deploy nuevo introduce una regresión grave: revert al commit anterior al pulido UI con `git revert <hash>` y redesplegar.

## Relacionados
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](../LOGICA_DE_NEGOCIO/04_componentes_react.md) — spec de WhySection, StepsSection, Footer, Nav
- [22_nav_footer_contacto_roto.md](22_nav_footer_contacto_roto.md) — si Nav o Footer faltan por completo en una página
- [20_comparador_ui_roto.md](20_comparador_ui_roto.md) — si el Comparador en sí pierde paridad con el diseño original
- [05_vercel_deploy_falla.md](05_vercel_deploy_falla.md) — si el deploy del pulido no termina
