# Proceso 19 — Banners patrocinados (Fase 4.3)

## Descripción

Sección de 4 banners mock visibles SIEMPRE entre el hero y los resultados del comparador. Creada en 2026-04-18 como vehículo de monetización directa — antes que la infraestructura de ventas publicitarias esté lista, los banners se usan como "slots reservados" con ofertas mock de los partners objetivo. Cuando se firmen acuerdos reales con bancos/operadores, cada banner se reemplaza con contenido real + tracking.

Nota: este módulo se construye ANTES de Fase 4.3 formal (publicidad directa con bancos) porque la diáspora ve los slots como prueba de concepto y ayuda a cerrar conversaciones comerciales.

## Pasos del flujo

### 1. Posición en el layout
Entre el hero + calculadora (dentro de `<Comparador>` como children) y la sección `<TasasReferencia />`. Siempre visibles, incluso antes de que el usuario escriba un monto. No se ocultan cuando aparecen los resultados del comparador — los banners siempre están arriba de los resultados.

```tsx
<Comparador>
  <BannersPatrocinados />
</Comparador>
<TasasReferencia />
```

Aplicado igual en home (`app/[locale]/page.tsx`) y páginas de país (`app/[locale]/[pais]/pais-content.tsx`).

### 2. Los 4 banners mock (2026-04-18)

| # | Partner | Oferta ES | Oferta EN | CTA ES | CTA EN | Icono lucide | Color de marca |
|---|---------|-----------|-----------|--------|--------|--------------|----------------|
| 1 | Banreservas | Tasa hoy 60.50 DOP/USD | Today's rate 60.50 DOP/USD | Abrir cuenta | Open account | Landmark | #C8102E (rojo) |
| 2 | Banco Popular | Cuenta para diáspora | Diaspora account | Más info | Learn more | Building2 | #003087 (azul oscuro) |
| 3 | Viamericas | $0 comisión primer envío | $0 fee first transfer | Enviar ahora | Send now | Zap | #00A859 (verde) |
| 4 | Boss Money | Primer envío gratis hasta $300 | First transfer free up to $300 | Probar | Try it | Gift | #FF6B00 (naranja) |

Los valores son **placeholders** hasta que se firmen los acuerdos reales. La tasa de Banreservas (60.50) es un valor de muestra — no se actualiza automáticamente.

### 3. Diseño visual
- Desktop (≥ lg): 4 banners horizontales, máx 280×140px cada uno
- Mobile: grid 2×2, altura 160px
- Gap entre banners: 12px (`gap-3`)
- Padding de la sección: 16px arriba/abajo (`py-4`) — reducido del inicial 32px
- Cada banner:
  - Fondo con tinte suave del color de la marca + borde coordinado
  - Ícono lucide 18px blanco sobre círculo 32px con el color fuerte de marca (top-left)
  - Título 14px bold
  - Oferta 16px bold verde oscuro
  - CTA azul 12px con flecha → (bottom-right absolute)
- Hover: `-translate-y-0.5` + sombra sutil
- Etiqueta "PATROCINADO" / "SPONSORED" 11px gris uppercase tracking-wider centrada arriba

### 3bis. Target del scroll al comparar — iteración final (2026-04-18)

Cuando el usuario hace click en "Comparar las mejores remesadoras" o presiona Enter en el input de monto:

1. **Se muestra un loading spinner centrado** (logo P verde con anillo giratorio animado alrededor) durante 800ms como micro-delay psicológico que refuerza la percepción de "se están buscando las mejores tasas".
2. **Paralelamente, se inicia scroll smooth** al encabezado de resultados con offset -150px para dejar visible:
   - Parte inferior (~80px) de los banners patrocinados arriba del viewport
   - El Nav fixed (72px)
   - El encabezado "Resultados para $X USD → País" en posición prominente
   - El primer resultado asomando, con su botón "Enviar ahora" cerca del centro del viewport

**Razón de negocio doble:**
1. **Impresión publicitaria garantizada:** si el scroll saltara directo al top de resultados, los banners quedarían fuera del viewport y se perdería el impacto publicitario. Con el offset -150 los banners quedan parcialmente visibles arriba, garantizando exposición en cada conversión.
2. **Friction diseñada:** el primer resultado asoma pero no se ve completo → el usuario hace un scroll corto y consciente para ver el ranking completo. Ese scroll expone el catálogo entero Y refuerza engagement.

**Loading spinner:** overlay fixed que cubre el viewport entero (z-[90], pointer-events-none). Al centro, una bola blanca de 88px con el logo P (verde Preenvíos) + anillo giratorio `border-t-green border-green-soft animate-spin`. Desaparece a los 800ms. Es puramente estético — los resultados YA están en el DOM desde que el usuario escribió el monto (ranking es síncrono, no hay fetch real).

Implementación completa en `components/Comparador.tsx`:
```ts
function onCompararClick() {
  if (montoNum <= 0) { inputRef.current?.focus(); return }
  trackEvent('comparar_click', {...})

  // Loading micro-delay (800ms)
  setIsComparing(true)
  setTimeout(() => setIsComparing(false), 800)

  // Scroll intermedio
  const results = document.getElementById('comparar')
  if (results) {
    const y = results.getBoundingClientRect().top + window.pageYOffset - 150
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
```

Comportamiento idéntico en desktop y mobile. El offset 150px funciona bien en ambos viewports porque los banners tienen altura similar (160px desktop horizontal / 180px mobile grid 2×2 según pantalla).

**Historial de iteraciones:**
- v1 (mañana 2026-04-18): scrolleaba a `#comparar` → usuario perdía los banners
- v2 (mediodía): scrolleaba a `#banners-patrocinados` con offset -72 → banners 100% visibles pero resultado lejos, usuario no veía la carne del comparador
- v3 (final, actual): scroll al encabezado de resultados -150px → equilibrio: banners parcial + header + primer resultado medio. Adicionalmente loading spinner para UX premium.

**Nota:** no confundir con `scrollToCalculator` en `CTASection` (bloque final "Listo para enviar más por menos?") — ese botón lleva al usuario DE VUELTA al hero calculadora si está abajo. Targets y propósitos distintos.

### 4. Tracking (preparado, no activo)
Cada `<a>` tiene:
- `rel="noopener sponsored"` — cumple con las directrices FTC y Google sobre links pagados
- `data-sponsor-slot={id}` — para tracking futuro via GA4 custom dimension o evento `click_banner_patrocinado`

Los `href` apuntan a `#` hasta que se firmen los acuerdos. Cuando haya URL real + tracking, actualizar el array `BANNERS` en el componente.

### 5. Cambio de un banner en producción
El array `BANNERS` está hardcoded en `components/BannersPatrocinados.tsx`. No se guarda en Supabase (aún). Para cambiar un banner:
1. Editar el objeto correspondiente (title, offer, cta, href, icon, bgCls, iconCls)
2. Commit + push → deploy automático
3. Tiempo a producción: ~2-3 min

Cuando haya más de 4-6 banners o se quiera rotación dinámica, se debe mover a Supabase (tabla `banners_patrocinados` con columnas id, orden, activo, title_es/en, offer_es/en, cta_es/en, href, icon_name, color_primary, start_date, end_date). No se ha implementado todavía — overkill para 4 banners fijos.

## Archivos
| Archivo | Qué hace |
|---------|----------|
| `components/BannersPatrocinados.tsx` | Componente client con datos mock, layout responsive, tracking atributos |
| `app/[locale]/page.tsx` | Insertado como children de `<Comparador>` |
| `app/[locale]/[pais]/pais-content.tsx` | Insertado como children de `<Comparador>` en páginas de país |

## Reglas del proyecto
- **No inflar a más de 4 banners** sin mover a Supabase primero. 5+ banners hardcoded se vuelve difícil de mantener.
- **No sumar animaciones agresivas.** Los banners compiten visualmente con el resultado del comparador — el estilo debe ser discreto, hover sutil, sin carrusel automático.
- **Siempre respetar `rel="sponsored"`** en los CTA. Google trata links patrocinados sin este atributo como manipulación de ranking.
- **La etiqueta "Patrocinado" arriba es obligatoria** por transparencia con el usuario y cumplimiento FTC.
- **Si un banner cambia a contenido real** (partner firmado), mantener el mismo layout visual — no rediseñar el slot individual para destacarlo más que los otros.

## Fase siguiente
Cuando se active Fase 4.3 (Publicidad directa con bancos, documentada en CONTEXTO_FINAL) se conecta cada banner a un acuerdo real:
- Widget de Banreservas con tasa en vivo (requiere API del banco o scrape)
- Cuenta diáspora de Banco Popular (link con referral code)
- Viamericas CPA directo ($500-1,500/mes por slot)
- Boss Money con tracking de primer envío gratis

## Relacionado
- [CONTEXTO_FINAL Fase 4.3](../CONTEXTO_FINAL.md) — publicidad directa con bancos
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](04_componentes_react.md) — arquitectura del Comparador que acepta children
- [TROUBLESHOOTING/22_nav_footer_contacto_roto.md](../TROUBLESHOOTING/22_nav_footer_contacto_roto.md) — si banners o secciones institucionales se ven rotas
