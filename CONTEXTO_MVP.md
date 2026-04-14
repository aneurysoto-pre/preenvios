# CONTEXTO DEL PROYECTO — Preenvíos.com · MVP

---

## Qué es este documento
Contexto completo del MVP de Preenvíos.com — comparador de precios de remesas para
la diáspora latinoamericana en EE.UU. El MVP es un sitio web estático (HTML/CSS/JS)
alojado en GitHub Pages que compara precios públicos de operadores de remesas para
4 corredores desde EE.UU. No procesa pagos, no mueve dinero, no requiere licencias.

El MVP termina cuando Google Analytics confirma que el modelo es viable —
suficiente tráfico real, clics en operadores, y comportamiento de usuario que justifique
construir el producto final. En ese momento se detienen los anuncios y se construye
el producto completo con Next.js, Supabase, scrapers automáticos, y afiliados activos.

---

## URLs del proyecto
- Web live:       https://preenvios.com
- GitHub:         https://github.com/aneurysoto-pre/preenvios
- Google Analytics: G-6RBFS2812S
- Dominio inglés (futuro): remitbefore.com — comprar cuando se expanda al mercado angloparlante

---

## Stack tecnológico del MVP
- HTML + CSS + JavaScript puro — sin frameworks
- GitHub Pages — hosting gratuito
- Google Analytics GA4 — medición completa de comportamiento
- Google Search Console — indexación SEO por corredor
- Canva — creación de imágenes para anuncios

## Stack tecnológico del producto final (post-MVP)
- Next.js 14+ con TypeScript
- Tailwind CSS
- Supabase — base de datos y cache de precios
- Vercel — hosting con deploy automático desde GitHub
- Upstash Redis — cache de precios cada 2 horas
- Scrapers automáticos — Playwright/Puppeteer
- Impact.com — red de afiliados (Remitly)
- Partnerize — red de afiliados (Wise)
- CJ Affiliate — red de afiliados (Xoom, Ria, WorldRemit)
- Resend — emails y newsletter
- WhatsApp Business API — bot de tipo de cambio

---

## Corredores del MVP — los 4 desde el inicio
Atención primaria a Honduras — es el corredor de mayor prioridad para validación.

| Corredor | Moneda | Código | Prioridad |
|----------|--------|--------|-----------|
| USA → Honduras | Lempira | HNL | 🥇 Primera |
| USA → República Dominicana | Peso Dominicano | DOP | 🥈 Segunda |
| USA → Guatemala | Quetzal | GTQ | 🥉 Tercera |
| USA → El Salvador | Dólar Americano | USD | 4️⃣ Cuarta |

Nota El Salvador: usa dólar americano como moneda oficial desde 2001.
La comparación es por fee y velocidad únicamente — no hay tasa de cambio.

---

## Operadores comparados en el MVP

### Con afiliado — tienen botón "Enviar ahora" con link activo
| Operador | Red de afiliados | Comisión estimada | Corredor |
|----------|-----------------|-------------------|---------|
| Remitly | Impact.com | $20–$40/usuario nuevo | Todos |
| Wise | Partnerize | £10 personal / £50 business | Todos |
| Xoom (PayPal) | CJ Affiliate | $25–$50/usuario nuevo | Todos |
| Ria Money Transfer | CJ Affiliate | $15–$30/usuario nuevo | Todos |
| WorldRemit | CJ Affiliate | $15–$30/usuario nuevo | Todos |

### Sin afiliado — aparecen en la comparación sin botón de link
| Operador | Razón | Estado futuro |
|----------|-------|---------------|
| Western Union | No tiene programa público de afiliados | Negociar directo cuando haya volumen |
| MoneyGram | No tiene programa público activo | Negociar directo cuando haya volumen |

---

## Tasas manuales — actualización semanal
Las tasas se actualizan manualmente cada semana verificando en el sitio de cada operador.
La estructura del código está preparada para recibir tasas de API en el futuro —
solo se cambia la fuente de los datos, no cómo se muestran.

### Quién actualiza: el fundador
### Cuándo: todos los lunes en la mañana — máximo 30 minutos

### Proceso de actualización:
1. Abrir cada link de verificación (guardados en favoritos)
2. Simular enviar $200 a cada país
3. Anotar la tasa o fee que aparece
4. Abrir GitHub → index.html → buscar sección TASAS
5. Actualizar los números correspondientes
6. Commit y push — el sitio se actualiza en 2 minutos

### Links de verificación por operador:
```
Remitly:       https://www.remitly.com
Western Union: https://www.westernunion.com
Wise:          https://wise.com/send
MoneyGram:     https://www.moneygram.com
Ria:           https://www.riamoneytransfer.com
Xoom:          https://www.xoom.com
WorldRemit:    https://www.worldremit.com
```

### Tasas iniciales verificadas (semana de lanzamiento):
```javascript
// Estructura en el código — actualizar cada lunes
const TASAS = {
  honduras: {
    remitly:     { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' },
    wise:        { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Segundos' },
    xoom:        { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' },
    ria:         { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' },
    worldremit:  { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' },
    westernunion:{ tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' },
    moneygram:   { tasa: 0, fee: 0, moneda: 'HNL', velocidad: 'Minutos' }
  },
  dominican_republic: {
    remitly:     { tasa: 59.64, fee: 0,    moneda: 'DOP', velocidad: 'Minutos' },
    wise:        { tasa: 58.02, fee: 4.50, moneda: 'DOP', velocidad: 'Segundos' },
    xoom:        { tasa: 58.70, fee: 4.99, moneda: 'DOP', velocidad: 'Minutos' },
    ria:         { tasa: 58.80, fee: 1.99, moneda: 'DOP', velocidad: 'Minutos' },
    worldremit:  { tasa: 58.50, fee: 1.99, moneda: 'DOP', velocidad: 'Minutos' },
    westernunion:{ tasa: 59.20, fee: 0,    moneda: 'DOP', velocidad: 'Minutos' },
    moneygram:   { tasa: 58.50, fee: 1.99, moneda: 'DOP', velocidad: 'Minutos' }
  },
  guatemala: {
    remitly:     { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' },
    wise:        { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Segundos' },
    xoom:        { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' },
    ria:         { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' },
    worldremit:  { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' },
    westernunion:{ tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' },
    moneygram:   { tasa: 0, fee: 0, moneda: 'GTQ', velocidad: 'Minutos' }
  },
  el_salvador: {
    // El Salvador usa USD — no hay tasa de cambio, solo fee y velocidad
    remitly:     { tasa: 1, fee: 0,    moneda: 'USD', velocidad: 'Minutos' },
    wise:        { tasa: 1, fee: 2.50, moneda: 'USD', velocidad: 'Segundos' },
    xoom:        { tasa: 1, fee: 4.99, moneda: 'USD', velocidad: 'Minutos' },
    ria:         { tasa: 1, fee: 1.99, moneda: 'USD', velocidad: 'Minutos' },
    worldremit:  { tasa: 1, fee: 1.99, moneda: 'USD', velocidad: 'Minutos' },
    westernunion:{ tasa: 1, fee: 5.00, moneda: 'USD', velocidad: 'Minutos' },
    moneygram:   { tasa: 1, fee: 1.99, moneda: 'USD', velocidad: 'Minutos' }
  }
}
```

---

## Arquitectura del landing — construida para escalar sin rediseñar

### Paso 1 — Landing definitivo
Diseño estilo Trivago. Línea gráfica final — no se toca más.
Mobile-first. Estructura:
- Header: Logo PRE (verde) + ENVÍOS (negro) · botón EN · botón Contact
- Hero 2 columnas: título izquierda + espacio publicidad derecha (vacío, listo)
- Barra de búsqueda: Monto · Destino (4 corredores) · botón Comparar
- Strip de operadores con tipografías y colores de marca
- Trust bar: Gratis · Sin registro · Independiente · Actualizado hoy
- Resultados ordenados por algoritmo de ranking
- Sección Cómo funciona (3 pasos)
- FAQ con acordeón
- Footer completo: Empresa · Legal · Corredores · Copyright

### Paso 2 — Calculadoras por corredor
4 corredores en el selector desde el inicio.
El código está estructurado para que en el futuro las tasas vengan de una API
sin cambiar nada de cómo se muestran los resultados.

### Paso 3 — Slots de afiliado listos
Cada botón "Enviar ahora" tiene esta estructura:
```html
<a href="LINK_DIRECTO_HOY" 
   data-affiliate-slot="remitly" 
   data-corredor="honduras"
   class="btn-enviar"
   onclick="trackClick('remitly', 'honduras', monto, posicion)">
  Enviar ahora ›
</a>
```
Cuando Impact aprueba el afiliado — se cambia LINK_DIRECTO_HOY por el link
con tracking ID. Una línea por operador. Nada más.

### Paso 4 — Espacios de publicidad estructurados
Tres slots vacíos en el código desde el inicio:
- `id="ad-hero"` — hero lado derecho (hoy vacío, invisible)
- `id="ad-mid"` — entre resultados 3 y 4 (hoy vacío, invisible)
- `id="ad-footer"` — antes del footer (hoy vacío, invisible)
Cuando un operador paga por visibilidad — se inserta su banner en el slot.
Sin rediseñar nada.

### Paso 5 — Algoritmo de ranking
Pesos fijos definidos en el código:
```javascript
const PESOS = {
  tasa:     0.40,  // 40% — qué tanto da el operador
  afiliado: 0.35,  // 35% — si genera comisión para Preenvíos
  velocidad: 0.25  // 25% — qué tan rápido llega el dinero
}
const CON_AFILIADO = ['remitly', 'wise', 'xoom', 'ria', 'worldremit']
```
Para cambiar el ranking — se cambian tres números. La estructura no cambia.

### Paso 6 — SEO y personalización por corredor
URLs desde el inicio:
```
preenvios.com/                    → detecta y muestra corredor por defecto
preenvios.com/honduras            → corredor Honduras (prioridad 1)
preenvios.com/dominican-republic  → corredor República Dominicana
preenvios.com/guatemala           → corredor Guatemala
preenvios.com/el-salvador         → corredor El Salvador
```
Tres niveles de personalización:
1. Cookie — recuerda el corredor que el usuario eligió antes
2. Geolocalización IP — detecta el país de origen como fallback
3. Anuncio segmentado — cada anuncio apunta a la URL del corredor correcto

---

## Google Analytics — medición completa

### Eventos automáticos (GA4 los mide solo):
- Visitas únicas y sesiones
- País, ciudad, dispositivo
- Fuente de tráfico (TikTok, Instagram, Google, directo)
- Tiempo en página
- Bounce rate

### Eventos personalizados (implementados en el código):

| Evento | Qué mide |
|--------|----------|
| `inicio_uso` | Cuando el usuario empieza a escribir el monto |
| `comparar_click` | Clic en Comparar + monto + corredor + segundos hasta comparar |
| `resultados_vistos` | Cuando los resultados entran en el viewport |
| `click_operador` | Clic en Enviar + operador + corredor + monto + posición + segundos |
| `tiempo_en_pagina` | Cada 10, 20, 30, 45, 60, 90, 120, 180, 240, 300 segundos |
| `salida_pagina` | Al salir — duración exacta + si comparó + si hizo clic |

### La métrica que importa cada semana:
**Cuántas personas hicieron clic en "Enviar ahora"**
Ese número determina todo. Si crece — escala el presupuesto. Si no — cambia el canal.

---

## Estrategia de anuncios pagados

### Cuándo empieza: cuando el landing esté completo y las imágenes listas
### Presupuesto: $40–50/semana

### Orden de prioridad de plataformas:
1. **TikTok** — más barato por CPM para audiencia latina. Empezar aquí.
2. **Instagram** — segundo cuando TikTok valide
3. **Facebook** — tercero
4. **YouTube** — cuando haya video profesional
5. **Twitter/X** — solo si hay tracción orgánica

### Regla: una plataforma a la vez hasta validar, luego escalar

### Imágenes de anuncios — sin mencionar marcas:
- Imagen 1: "Estás perdiendo hasta RD$500 en envío... sin darte cuenta"
- Imagen 2: "¿Mandas dinero a Centroamérica o RD? Compara todas las remesadoras gratis"
- Una imagen por corredor — copy específico al país

### Segmentación:
- Cada anuncio apunta a la URL del corredor específico
- TikTok e Instagram usan comportamiento de búsqueda del usuario para distribuir
- No se mencionan marcas de operadores en ningún anuncio

---

## Contenido orgánico semanal

Un post por semana por corredor activo:
- "La tasa de hoy Honduras — semana del [fecha]"
- "La tasa de hoy República Dominicana — semana del [fecha]"
- Sin mencionar marcas. Solo el número y el corredor.
- Plataformas: TikTok, Instagram, Facebook Page

Objetivo: construir audiencia orgánica que reduce el costo de adquisición con el tiempo.

---

## Programas de afiliados — cuándo y cómo aplicar

### Cuándo aplicar: cuando tengas 30 días de tráfico demostrable en Google Analytics

### Dónde aplicar:
| Operador | Red | URL de aplicación |
|----------|-----|-------------------|
| Remitly | Impact.com | app.impact.com → buscar Remitly |
| Wise | Partnerize | partnerize.com → buscar Wise |
| Xoom | CJ Affiliate | cj.com → buscar Xoom |
| Ria | CJ Affiliate | cj.com → buscar Ria Money Transfer |
| WorldRemit | CJ Affiliate | cj.com → buscar WorldRemit |

### Después de aprobación:
- Impact, Partnerize, o CJ te dan un link único con tu ID de tracking
- Reemplazas el link directo en el slot de afiliado correspondiente
- Una línea de código por operador — nada más

### Negociación directa — cuando tengas 200+ clics/mes por operador:
1. Primero Boss Money y Remesas Reservas — más pequeños, negocian más fácil
2. Luego Ria y WorldRemit
3. Luego Remitly y Wise cuando el volumen lo justifique

---

## Métricas de validación del MVP

El MVP está validado cuando Google Analytics muestra:

| Métrica | Umbral de validación |
|---------|---------------------|
| Clics en "Enviar ahora" | 50+ en 30 días |
| Usuarios de EE.UU. | 70%+ del tráfico total |
| Tasa de comparación | 30%+ de visitantes hace clic en Comparar |
| Tiempo promedio en página | 30+ segundos promedio |
| Corredor más activo | Honduras o RD con 60%+ del tráfico |

Cuando estos umbrales se cumplan — se detienen los anuncios y se construye
el producto final con el stack completo.

---
## Etapas de desarrollo del MVP

### Etapa 1 — Landing definitivo (Paso 1–5)
- [ ] Diseño Trivago implementado — línea gráfica final, no se toca más
- [ ] Hero 2 columnas: título izquierda + slot de publicidad derecha (vacío)
- [ ] Barra de búsqueda: Monto · Destino (4 corredores) · botón Comparar
- [ ] Strip de operadores con tipografías y colores de marca
- [ ] Trust bar: Gratis · Sin registro · Independiente · Actualizado hoy
- [ ] Sección Cómo funciona (3 pasos)
- [ ] FAQ con acordeón
- [ ] Footer completo: Empresa · Legal · Corredores · Copyright
- [ ] Slots de publicidad vacíos: ad-hero · ad-mid · ad-footer
- [ ] Slots de afiliado preparados en cada botón "Enviar ahora"
- [ ] Algoritmo de ranking implementado (pesos 40/35/25)
- [ ] Google Analytics completo con todos los eventos personalizados
- [ ] Disclaimer de ranking visible junto a los resultados
- [ ] Mobile-first verificado en iPhone y Android

### Etapa 2 — Calculadoras por corredor (Paso 2)
- [ ] Corredor Honduras (HNL) activo con los 7 operadores
- [ ] Corredor República Dominicana (DOP) activo con los 7 operadores
- [ ] Corredor Guatemala (GTQ) activo con los 7 operadores
- [ ] Corredor El Salvador (USD) activo — solo fee y velocidad
- [ ] Tasas verificadas manualmente para los 4 corredores
- [ ] Estructura de código lista para recibir API en el futuro
- [ ] Cookie que recuerda el corredor elegido por el usuario
- [ ] Geolocalización IP como fallback

### Etapa 3 — SEO por corredor (Paso 6)
- [ ] URL preenvios.com/honduras activa e indexada
- [ ] URL preenvios.com/dominican-republic activa e indexada
- [ ] URL preenvios.com/guatemala activa e indexada
- [ ] URL preenvios.com/el-salvador activa e indexada
- [ ] Propiedad verificada en Google Search Console
- [ ] Sitemap.xml configurado
- [ ] Meta tags por corredor (title, description, og:image)

### Etapa 4 — Anuncios y contenido orgánico (Pasos 7–8)
- [ ] Imágenes de anuncios creadas — una por corredor, sin mencionar marcas
- [ ] Primer anuncio lanzado en TikTok ($40–50/semana)
- [ ] Primer post orgánico publicado por corredor
- [ ] Publicación semanal de tasa de cambio en TikTok, Instagram y Facebook

### Etapa 5 — Afiliados activos (Paso 9)
- [ ] 30 días de tráfico demostrable en Google Analytics
- [ ] Aplicación enviada a Impact.com (Remitly)
- [ ] Aplicación enviada a Partnerize (Wise)
- [ ] Aplicación enviada a CJ Affiliate (Xoom, Ria, WorldRemit)
- [ ] Links de afiliado reemplazados en los slots correspondientes
- [ ] Verificación de que los eventos click_operador coinciden con conversiones en las redes

### Etapa 6 — Validación confirmada (Paso 10)
- [ ] 50+ clics en "Enviar ahora" en 30 días ← umbral principal
- [ ] 70%+ del tráfico desde EE.UU.
- [ ] 30%+ de visitantes hace clic en Comparar
- [ ] 30+ segundos de tiempo promedio en página
- [ ] Honduras o RD con 60%+ del tráfico total
- [ ] ✅ MVP validado — detener anuncios e iniciar construcción del producto final
## Estructura del repositorio GitHub (MVP)
```
preenvios/
  index.html          ← landing principal con toda la lógica
  CNAME               ← apunta preenvios.com a GitHub Pages
  CONTEXTO_MVP.md     ← este documento
  CONTEXTO_FINAL.md   ← roadmap del producto completo
```

---

## Comandos esenciales
```bash
# Antes de trabajar siempre
git pull origin main

# Subir cambios
git add .
git commit -m "descripcion del cambio en español"
git push origin main

# El sitio se actualiza en 2 minutos en preenvios.com
```

## Reglas del repositorio
- Siempre git pull antes de empezar
- Siempre git push al terminar
- Commits descriptivos en español
- El index.html es el único archivo de código — todo vive ahí hasta migrar a Next.js
- No crear archivos adicionales de HTML, CSS, o JS durante el MVP

---

## Reglas del proyecto que no cambian durante el MVP
1. No migrar a Next.js hasta que Google Analytics confirme viabilidad
2. No aplicar a afiliados hasta tener 30 días de tráfico demostrable
3. No escalar presupuesto de anuncios hasta validar el primer canal
4. No agregar nuevos corredores más allá de los 4 definidos
5. No rediseñar el landing — solo agregar contenido a los slots vacíos
6. Actualizar tasas todos los lunes sin excepción
7. Revisar Google Analytics una vez por semana — no todos los días
8. El número que importa cada semana es uno solo: clics en "Enviar ahora"
