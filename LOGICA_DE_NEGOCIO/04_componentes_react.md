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

**Selector de método de entrega (estilo Monito):**
1. 4 botones horizontales: Cuenta bancaria, Retiro en efectivo, Domicilio, Billetera móvil
2. Default: "Cuenta bancaria" preseleccionado
3. Badge "POPULAR" en Cuenta bancaria
4. Al cambiar método, se re-fetch precios filtrados por ese método desde la API
5. Evento GA4 `cambio_metodo_entrega` al cambiar

**Cálculo y resultados:**
1. El usuario escribe monto en USD
2. Se hace fetch a `/api/precios?corredor=X&metodo=Y`
3. Los precios pasan por `rankProviders()` que devuelve la lista rankeada con Preenvíos Score
4. Se renderizan las tarjetas de resultado
5. Tarjeta #1: badge "MEJOR OPCIÓN" (verde)
6. Tarjeta #2: badge "SEGUNDA OPCIÓN" (azul)
7. Cada tarjeta muestra: logo, nombre, rating, Preenvíos Score, tasa, fee, velocidad, monto que recibe el destinatario
8. Operadores con afiliado: botón "Enviar ahora" (link con `data-affiliate-slot`)
9. Operadores sin afiliado: botón "Ver en sitio" (gris)

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
