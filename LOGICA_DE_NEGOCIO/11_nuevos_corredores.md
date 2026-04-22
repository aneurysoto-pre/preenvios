# Proceso 11 — Nuevos corredores (guía genérica de incorporación)

## Descripción

Guía técnica para agregar un corredor nuevo al catálogo MVP de PreEnvios. El proceso se ejecuta como unidad lógica end-to-end: cada paso debe completarse antes de exponer el corredor en la UI pública. La decisión de qué país incorporar se toma fuera de este documento — ver `CONTEXTO_FINAL.md` sección "Integraciones futuras / alcance post-MVP".

**Estado actual (2026-04-22):** MVP vigente con 6 corredores — Honduras, República Dominicana, Guatemala, El Salvador, Colombia, México.

---

## Pasos del flujo

### 1. Datos en Supabase

- Insertar 1 registro en tabla `corredores` con: `id` (slug), `nombre`, `nombre_en`, `moneda` (código ISO 4217), `simbolo`, `bandera` (emoji), `codigo_pais` (ISO alpha-2 lowercase), `tasa_banco_central`, `prioridad`, `activo=true`
- Insertar 1 registro en tabla `tasas_bancos_centrales` con: `id` (mismo slug del corredor), `codigo_pais`, `moneda`, `nombre_banco`, `nombre_banco_en`, `siglas`, `tasa`, `actualizado_en`
- Insertar 7 registros en tabla `precios` (1 por operador MVP) con: `operador`, `corredor` (slug), `metodo_entrega='bank'`, `tasa` estimada inicial (se reemplaza por scraper), `fee`, `velocidad`, `nombre_operador`, `rating`, `reviews`, `afiliado`, `link`, `confiabilidad`, `metodos_disponibles`
- Crear migración idempotente en `supabase/migrations/NNN_<slug>_corredor.sql` (CREATE/UPSERT con `IF NOT EXISTS` + `ON CONFLICT DO UPDATE`)

### 2. Componentes que se actualizan

| Archivo | Cambio |
|---------|--------|
| `lib/paises.ts` | Agregar entry al array `PAISES_MVP` con `corredorId`, `nombre`, `nombreEn`, `codigoPais`, `slugEs`, `slugEn`, `moneda` |
| `lib/corredores.ts` | Agregar entry al array `CORREDORES_DATA` (slug, nombre, nombreEn, moneda, bandera, codigo) |
| `lib/cross-links.ts` | Agregar entry al map `getTasaSlug` para que `/tasa/usd-xxx` resuelva correctamente |
| `components/Comparador.tsx` | Agregar entry al array `CORREDORES` con `id`, `nombre`, `nombreEn`, `moneda`, `simbolo`, `codigoPais`, `aliases` (2-5 sinónimos populares del país para el buscador) |
| `app/[locale]/calculadora-inversa/content.tsx` | Agregar entry con los mismos campos que Comparador |
| `components/TasasReferencia.tsx` | Agregar entry al map `COUNTRY_NAMES` (key = codigoPais, values es/en) |
| 7 scrapers en `lib/scrapers/*.ts` | Agregar entry al array `CORREDORES` interno con `id`, `moneda`, `country`, `link` |
| `app/api/whatsapp/webhook/route.ts` | Agregar entries al `CORREDOR_MAP` (código moneda + código país + nombre) y al `CORREDOR_NAMES` |
| `messages/es.json` + `messages/en.json` | Actualizar FAQ si corresponde (sección "faq.*") |

### 3. Validador de ingress (Agente 1 — Fase 7)

Antes de que el scraper escriba en la tabla `precios`, el validador debe aceptar el corredor nuevo:

- Agregar el corredor a la whitelist del validador (`lib/scrapers/validator.ts`)
- Definir bounds de tasa del banco central ±10% como fallback si la tabla `tasas_bancos_centrales` no tiene registro
- Documentar los bounds en el comentario de la whitelist

### 4. Scrapers (validación de sourcing)

Por cada uno de los 7 operadores MVP, verificar que el corredor nuevo está disponible en su API o HTML:

- **Tier 3 (scraping directo):** confirmar que la URL del operador responde con la tasa del corredor
- **Tier 2 (affiliate feeds):** verificar que la red (CJ / Impact / Partnerize) lista el corredor en su feed
- **Tier 4 (Wise API pública):** confirmar que `api.wise.com/v1/rates` soporta el par USD→<MONEDA>

Si algún operador no soporta el corredor nuevo, decidir: (a) omitir ese operador para ese corredor específico, (b) usar tasa de referencia banco central como fallback, o (c) esperar hasta que lo soporte. No hacer "scraping fake" — mejor mostrar 6 operadores honestos que 7 con data inventada.

### 5. SEO y contenido editorial

- Página editorial `/[locale]/<slug-pais>` — se genera automáticamente vía `app/[locale]/[pais]/page.tsx` + `generateStaticParams` con `PAISES_MVP`. Copy adapta dinámicamente con `heroTitle: "Envías dinero a <País>?"`
- Página histórica de tasa `/[locale]/tasa/usd-<moneda>` — se genera via `app/[locale]/tasa/[pair]/page.tsx`
- Sitemap (`app/sitemap.ts`) lo recoge automáticamente si el corredor está en `PAISES_MVP` — no requiere edición manual
- Blog post específico por corredor (post-launch progresivo, no bloqueante)

### 6. Validación pre-merge

Antes de considerar el corredor "en MVP":

- `npm run typecheck` — sin errores
- `npm run build` — sin errores
- Smoke test en `/es/<slug>` y `/en/<slug>` — la página carga con contenido correcto
- Smoke test en Comparador — el corredor aparece en el dropdown y el monto se calcula correctamente
- Smoke test en calculadora inversa — el corredor aparece en los tabs
- Ejecutar `/api/scrape` manual y verificar que los 7 operadores guardan precios para el corredor nuevo sin errores
- Verificar en Supabase Table Editor que `precios` tiene 7 rows frescas (`actualizado_en` reciente) para el corredor

### 7. Decisión de marketing

Agregar un corredor al catálogo NO implica ad spend automático. El plan de marketing del mes 1 post-launch prioriza Honduras. Corredores nuevos se apoyan en tráfico orgánico (SEO) inicialmente y se evalúan para ad sets del mes 2-3 con data real de conversión. Referencia: `PLAN_MARKETING_MES_1.md` + `plan-marketing-mes1-v2.md`.

---

## UX de navegación al escalar (umbral de refactor)

**Regla a aplicar cuando `PAISES_MVP` supere 10 países activos:**

El dropdown "Destinos" (desktop) y la lista en el drawer mobile del Nav deben refactorizarse a un **submenu colapsable agrupado por región**. Hoy con 6 países listados directos = OK, la UX es clara y no requiere jerarquía. Con 10+ países la UX degrada por scroll largo en el drawer mobile y falta de jerarquía visual en el dropdown desktop — el usuario pierde tiempo escaneando una lista plana larga.

**Archivos que deberán refactorizarse cuando llegue la fase:**

- `components/Nav.tsx` — tanto DropdownMenu (desktop) como el Drawer mobile. Usar `DropdownMenuSub` de shadcn para submenus desktop y accordion o tabs agrupados en mobile
- `components/comparador/country-picker.tsx` — Command list con CommandGroup separators por región (cmdk soporta `<CommandGroup heading="...">` nativo)
- `lib/paises.ts` — agregar campo `region` a cada país para filtrado/agrupación

**Criterio de activación:** al agregar el país #10 a `PAISES_MVP`.

**Estimación del refactor futuro:** ~3-4h. No es urgente mientras el catálogo esté ≤10 países.

---

## Archivos típicos modificados en una incorporación

Lista de referencia (puede variar según la profundidad del país):

- `supabase/migrations/NNN_<slug>_corredor.sql`
- `lib/paises.ts`
- `lib/corredores.ts`
- `lib/cross-links.ts`
- `lib/scrapers/validator.ts` (bounds nuevo corredor)
- `lib/scrapers/{remitly,wise,xoom,ria,worldremit,westernunion,moneygram}.ts` (7 archivos)
- `components/Comparador.tsx`
- `components/TasasReferencia.tsx`
- `app/[locale]/calculadora-inversa/content.tsx`
- `app/api/whatsapp/webhook/route.ts`
- `messages/es.json` + `messages/en.json` (solo si toca copy de FAQ)
