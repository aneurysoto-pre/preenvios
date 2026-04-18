# Proceso 04 — Componentes React (migración del MVP)

## Descripción

Migración completa del landing HTML estático (index.html) a componentes React en Next.js. Cada sección del MVP ahora es un componente independiente que consume traducciones via next-intl y datos de Supabase via API. El diseño visual es idéntico al MVP — mismos colores, tipografías, espaciados y estructura.

Completado el 2026-04-16 como Bloque 3 de la Fase 1.

## Pasos del flujo

### 1. Arquitectura de componentes

| Componente | Tipo | Archivo | Qué hace |
|------------|------|---------|----------|
| Nav | Client | `components/Nav.tsx` | Navbar fija con logo, links desktop, burger mobile, selector EN/ES |
| Comparador | Client | `components/Comparador.tsx` | Hero + search card + resultados — toda la lógica interactiva |
| LogoStrip | Client | `components/Sections.tsx` | Strip horizontal de logos de los 7 operadores |
| WhySection | Client | `components/Sections.tsx` | "Por qué PreEnvios" — 3 tarjetas de beneficios |
| StepsSection | Client | `components/Sections.tsx` | "Cómo funciona" — 3 pasos |
| CTASection | Client | `components/Sections.tsx` | Call to action con botón "Comparar ahora" |
| FAQSection | Client | `components/Sections.tsx` | 6 preguntas frecuentes con acordeón |
| Footer | Client | `components/Sections.tsx` | Footer completo con links, disclaimer legal, copyright |

### 2. Componente Comparador — flujo completo

El Comparador es el componente principal del sitio. Contiene:

**Búsqueda de país personalizada (reemplaza select nativo):**
1. Al hacer clic en el campo de país, se abre un dropdown con input de búsqueda
2. El usuario puede escribir nombre del país ("Honduras"), código de moneda ("DOP"), código de país ("DO") o alias ("catracho", "chapín")
3. Los resultados se filtran en tiempo real
4. Al seleccionar, se cierra el dropdown y se actualiza el corredor
5. Click fuera del dropdown lo cierra

**Selector de método de entrega (simplificado 2026-04-18):**
1. UI actual: solo se muestra una etiqueta gris informativa "Método: Cuenta bancaria" — los 4 botones fueron ocultos pre-lanzamiento porque solo `bank` tiene datos reales y los otros 3 generan un callejón sin salida ("Tasas disponibles pronto")
2. Infraestructura intacta: la constante `METODOS` de 4 elementos, el estado `metodo` con default `bank`, el campo `metodo_entrega` en Supabase y el parámetro `metodo` en `/api/precios` siguen todos activos
3. Para reactivar post-lanzamiento: descomentar el bloque de tabs en `components/Comparador.tsx` y volver a llamar `selectMetodo` desde los botones. Requisito: los scrapers deben capturar tasas reales por método para los 4 corredores MVP con al menos 3 operadores por método
4. Evento GA4 `cambio_metodo_entrega`: temporalmente no se dispara porque la UI no lo activa; el código en `selectMetodo()` se conserva

**Cálculo y resultados (diseño final 2026-04-18 — paridad con HTML original):**
1. El usuario escribe monto en USD
2. Se hace fetch a `/api/precios?corredor=X&metodo=bank` (método siempre bank hasta reactivar selector)
3. Los precios pasan por `rankProviders()` que devuelve la lista rankeada con Preenvíos Score
4. Un post-sort se aplica según el tab activo:
   - "Mejor tasa" (default): mantiene el orden de rankProviders (Preenvíos Score descendente)
   - "Más rápido": ordena por `VELOCIDAD_RANK` (Segundos 4 > Minutos 3 > Horas 2 > Días 1), tie-breaker por score
   - "Menor comisión": ordena por `fee` ascendente, tie-breaker por score
5. Tarjetas renderizadas con clases CSS portadas del HTML original (`.cmp-card`, `.cmp-brand`, `.cmp-col`, `.cmp-btn` viven en `app/globals.css`)
6. Badge contextual solo en posición 0 según sort: `best` → "★ MEJOR OPCIÓN" verde, `fast` → "⚡ MÁS RÁPIDO" naranja, `cheap` → "💰 MENOR COMISIÓN" verde-oscuro. Cuando sort=best, posición 1 también lleva "SEGUNDA OPCIÓN" azul
7. Estructura de la tarjeta replica 1:1 el HTML de preenvios.com: grid `1.4fr 1fr 1fr 1fr auto` con brand (logo + nombre + rating) | Tasa | Comisión | Reciben | botón
8. Única adición sobre el diseño original: el **Preenvíos Score** como línea pequeña 11px color azul, debajo del rating. Formato "Preenvíos Score N/100"
9. Operadores con afiliado: botón `.cmp-btn` "Enviar ahora →" con `rel="noopener sponsored"` y `data-affiliate-slot`
10. Operadores sin afiliado: botón gris `.cmp-btn-ref` "Ver en sitio" sin `sponsored`
11. Arriba del listado: línea gris `disclaimers.d3` con link "Saber más" a `/como-ganamos-dinero` (original del HTML)
12. Al final: caja amarilla `.cmp-disclaimer` con icono + "Importante: Las tasas mostradas son estimaciones..." + link "Ver disclaimers completos →" a `/disclaimers`
13. Responsive idéntico al HTML: a <980px el grid colapsa a 2 columnas (brand span 1/3, botón full-width); a <640px logo baja a 42×42 y nombre con ellipsis

**Analytics (GA4):**
- `inicio_uso`: cuando el usuario empieza a escribir el monto
- `comparar_click`: cuando hace clic en "Comparar"
- `cambio_corredor`: cuando cambia de país
- `cambio_metodo_entrega`: cuando cambia de método
- `click_operador`: cuando hace clic en "Enviar ahora" o "Ver en sitio"

**Cookie de corredor:**
- Al cargar, lee `preenvios_corredor` del cookie
- Al cambiar corredor, guarda en cookie con expiración 30 días

### 3. Nav — menú hamburguesa + selector de idioma

- Desktop: links Comparar, Cómo funciona, FAQ + botón EN/ES
- Mobile (< md): burger animado (3 líneas → X)
- Al abrir: panel fijo bajo el nav con links + opción de cambio de idioma
- Selector EN/ES usa `router.push()` para navegar a la misma ruta en el otro locale
- Sombra en el nav aparece al hacer scroll (> 10px)

### 4. Secciones estáticas

Todas las secciones usan `useTranslations()` para mostrar texto en el idioma activo. El contenido viene de `messages/es.json` y `messages/en.json`.

- **LogoStrip**: logos cargados de Brandfetch CDN con fallback si falla
- **FAQ**: acordeón nativo con `<details>` — primer item abierto por default
- **Footer**: disclaimer legal como primer párrafo bold, links a secciones internas

### 5. Página principal (page.tsx)

La página simplemente compone todos los componentes en orden:
```
Nav → Comparador (hero + resultados) → LogoStrip → Why → Steps → CTA → FAQ → Footer
```

Es un server component que llama a `setRequestLocale()` y renderiza los client components.
