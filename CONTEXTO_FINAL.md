# CONTEXTO DEL PROYECTO — Preenvíos.com · Producto Final

---

## Qué es este documento
Roadmap completo del producto final de Preenvíos.com — el comparador de referencia
de remesas para América Latina y expansión a Europa. Lo que Monito.com es para Europa,
Preenvíos.com es para la diáspora latinoamericana en EE.UU. y el mundo.

Este documento se construye sobre el MVP validado. Cada etapa aquí marcada con [ ]
se ejecuta después de que Google Analytics confirme la viabilidad del modelo.

El negocio no procesa pagos, no mueve dinero, no requiere licencias regulatorias.
Es una plataforma de información, comparación y referidos — modelo de negocio en 4 capas
que evoluciona desde CPA hasta Revenue Share en 12–18 meses.

---

## La visión
Ser el comparador de remesas de referencia para América Latina —
lo que Monito.com es para Europa, nosotros para el hemisferio occidental.
Expansión posterior a mercados de Europa con alta diáspora latinoamericana
(España, Italia, Reino Unido).

---

## URLs del proyecto
- Web MVP:        https://preenvios.com
- Web final:      https://preenvios.com (mismo dominio, nueva arquitectura)
- Dominio inglés: https://remitbefore.com (comprar cuando se expanda al mercado angloparlante)
- App iOS:        App Store (Fase 5)
- App Android:    Google Play (Fase 5)
- Vercel:         https://vercel.com
- Supabase:       https://supabase.com
- GitHub:         https://github.com/aneurysoto-pre/preenvios

---

## Modelo de negocio — 4 capas en evolución

### Capa 1 — CPA por red de afiliados (Mes 2–6)
Comisión fija por cada usuario nuevo que completa su primera transferencia.
- Remitly vía Impact.com: $20–$40/usuario
- Wise vía Partnerize: £10 personal / £50 business
- Xoom, Ria, WorldRemit vía CJ Affiliate: $15–$50/usuario

### Capa 2 — CPL + negociación directa (Mes 6–12)
Cuando se tienen 200+ clics/mes por operador — negociación directa sin intermediario.
- CPL: pago por usuario registrado aunque no haya enviado todavía
- Fee mensual fijo con operadores pequeños (Boss Money, Remesas Reservas): $500–$3,000/mes
- Eliminación del intermediario (Impact, CJ) — más margen por la misma conversión

### Capa 3 — Publicidad directa + alertas premium (Mes 7–12)
- Banners en slots de publicidad pagados por operadores y bancos
- Widget de tasa de cambio patrocinado por bancos dominicanos y centroamericanos
- Alertas premium de tipo de cambio: $2–5/mes por suscriptor

### Capa 4 — Revenue Share + datos B2B (Mes 12–18)
Meta explícita: cuando el volumen referido llegue a $50,000/mes —
negociar Revenue Share directo con Remitly y Wise.
- Revenue Share: 0.3%–0.5% de cada transferencia de por vida por usuario referido
- Datos y research B2B vendidos a bancos y fintechs: $500–$5,000/reporte
- API pública de precios históricos: $99–$499/mes por acceso

---

## Stack tecnológico — producto final

### Frontend
- Next.js 14+ con TypeScript
- Tailwind CSS
- React Native + Expo (app móvil — Fase 5)

### Backend
- Supabase — base de datos PostgreSQL + auth + storage
- Vercel — hosting con deploy automático desde GitHub
- Upstash Redis — cache de precios (actualización cada 2 horas)

### Scrapers automáticos
- Playwright o Puppeteer — scraping de tasas
- Vercel Cron Jobs — ejecución cada 2 horas
- Proxies rotativos — para operadores con protección avanzada ($10–30/mes)
- Wise API semi-pública — datos directos sin scraping
- APIs de afiliados (Impact, CJ, Partnerize) — tasas en tiempo real para operadores aprobados

### Redes de afiliados
- Impact.com — Remitly
- Partnerize — Wise
- CJ Affiliate — Xoom, Ria, WorldRemit, y futuras incorporaciones

### Comunicación
- Resend — emails, newsletter, alertas premium
- WhatsApp Business API (Twilio) — bot de tipo de cambio + alertas
- Stripe — cobro recurrente de alertas premium

---

## Corredores — expansión por fases

### Fase MVP (activos desde el inicio)
| Corredor | Moneda | Código | Prioridad |
|----------|--------|--------|-----------|
| USA → Honduras | Lempira | HNL | 🥇 Primera |
| USA → República Dominicana | Peso Dominicano | DOP | 🥈 Segunda |
| USA → Guatemala | Quetzal | GTQ | 🥉 Tercera |
| USA → El Salvador | Dólar Americano | USD | 4️⃣ Cuarta |

### Fase 4 — Expansión Latinoamérica
| Corredor | Moneda | Código |
|----------|--------|--------|
| USA → Colombia | Peso Colombiano | COP |
| USA → México | Peso Mexicano | MXN |
| USA → Haití | Gourde | HTG |
| USA → Nicaragua | Córdoba | NIO |
| USA → Ecuador | Dólar Americano | USD |
| USA → Perú | Sol | PEN |

### Fase 5 — Expansión Europa
| Corredor | Desde | Moneda destino |
|----------|-------|----------------|
| España → América Latina | EUR | Múltiples |
| Italia → América Latina | EUR | Múltiples |
| Reino Unido → América Latina | GBP | Múltiples |

---

## Operadores — expansión por fases

### MVP — 7 operadores (5 con afiliado + 2 referencia)
| Operador | Afiliado | Red | Estado |
|----------|----------|-----|--------|
| Remitly | ✅ | Impact.com | MVP |
| Wise | ✅ | Partnerize | MVP |
| Xoom (PayPal) | ✅ | CJ Affiliate | MVP |
| Ria Money Transfer | ✅ | CJ Affiliate | MVP |
| WorldRemit | ✅ | CJ Affiliate | MVP |
| Western Union | ❌ | Sin programa público | MVP (referencia) |
| MoneyGram | ❌ | Sin programa público | MVP (referencia) |

### Fase 4 — Operadores adicionales
| Operador | Afiliado | Tipo de acuerdo |
|----------|----------|-----------------|
| Boss Money | Negociar directo | Fee mensual fijo |
| Remesas Reservas (Banreservas) | Negociar directo | Fee mensual fijo |
| Viamericas | Negociar directo | CPA directo |
| Caribe Express | Negociar directo | CPA directo |
| La Nacional | Negociar directo | Fee mensual fijo |

---

## Estructura del repositorio — producto final
```
preenvios/
  app/
    globals.css
    layout.tsx
    page.tsx                        ← calculadora principal
    [corredor]/
      page.tsx                      ← página por corredor (honduras, rd, etc.)
    blog/
      page.tsx                      ← listado de artículos SEO
      [slug]/page.tsx               ← artículo individual
    alertas/
      page.tsx                      ← suscripción a alertas premium
    api/
      precios/route.ts              ← endpoint precios actualizados
      tasa/route.ts                 ← tipo de cambio por corredor
      suscripcion/route.ts          ← gestión alertas premium
      webhook/route.ts              ← webhook Stripe
  components/
    Comparador.tsx
    Calculadora.tsx
    AfiliadoLink.tsx                ← link con tracking + slot de afiliado
    AdSlot.tsx                      ← slot de publicidad (hero, mid, footer)
    WidgetTasaBanco.tsx             ← widget patrocinado por banco
    AlertaForm.tsx
    RankingBadge.tsx                ← badge "Mejor opción" / "Segunda opción"
  lib/
    supabase.ts
    stripe.ts
    ranking.ts                      ← algoritmo de ranking con pesos
    scrapers/
      remitly.ts
      wise.ts
      xoom.ts
      ria.ts
      worldremit.ts
      westernunion.ts
      moneygram.ts
      bossmoney.ts
      banreservas.ts
  public/
  .env.local
  next.config.ts
  package.json
  CONTEXTO_MVP.md
  CONTEXTO_FINAL.md
```

---

## Variables de entorno — producto final
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend
RESEND_API_KEY=

# WhatsApp Business API
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Redes de afiliados
IMPACT_ACCOUNT_SID=
IMPACT_AUTH_TOKEN=
PARTNERIZE_API_KEY=
CJ_API_KEY=

# IDs de tracking por operador
REMITLY_AFFILIATE_ID=
WISE_AFFILIATE_ID=
XOOM_AFFILIATE_ID=
RIA_AFFILIATE_ID=
WORLDREMIT_AFFILIATE_ID=

# Banco Central RD
BCRD_API_URL=https://apis.bancentral.gov.do/currency/get?key=

# Entorno
NODE_ENV=production
```

---

## ROADMAP COMPLETO — 6 Fases

### Fase 0 — MVP validado (completado antes de esta fase)
- [x] Landing HTML estático con 4 corredores y 7 operadores
- [x] Google Analytics con medición completa de comportamiento
- [x] Algoritmo de ranking implementado
- [x] Slots de afiliado preparados
- [x] Slots de publicidad preparados
- [x] 50+ clics en "Enviar ahora" en 30 días confirmados
- [x] 70%+ del tráfico desde EE.UU. confirmado

### Fase 1 — Migración al stack final (Semana 1–2 post-MVP)
- [ ] Crear proyecto Next.js 14+ con TypeScript en el mismo repositorio
- [ ] Migrar el diseño HTML a componentes React manteniendo línea gráfica exacta
- [ ] Configurar Tailwind CSS con las variables de diseño del MVP
- [ ] Conectar repositorio a Vercel — deploy automático desde GitHub
- [ ] Crear proyecto en Supabase — tabla `precios` y tabla `corredores`
- [ ] Migrar las tasas manuales del HTML a Supabase
- [ ] Crear API route /api/precios que sirve las tasas desde Supabase
- [ ] El landing ahora lee precios de Supabase en lugar del HTML hardcodeado
- [ ] Configurar dominio preenvios.com en Vercel (dejar de usar GitHub Pages)
- [ ] Verificar que Google Analytics sigue midiendo correctamente
- [ ] Verificar que todos los slots de afiliado y publicidad funcionan

### Fase 2 — Scrapers automáticos (Semana 3–4 post-MVP)
- [ ] Configurar Upstash Redis para cache de precios
- [ ] Crear scraper para Wise (API semi-pública — más fácil)
- [ ] Crear scraper para Ria
- [ ] Crear scraper para Boss Money
- [ ] Crear Vercel Cron Job — ejecuta scrapers cada 2 horas
- [ ] Los scrapers guardan resultados en Supabase
- [ ] Upstash Redis cachea los últimos precios para servir rápido
- [ ] Crear scraper para MoneyGram (protección media)
- [ ] Crear scraper para Western Union (protección alta — puede requerir proxy)
- [ ] Crear scraper para Remitly (protección alta — puede requerir proxy)
- [ ] Configurar proxies rotativos si Western Union o Remitly bloquean
- [ ] Dashboard interno para monitorear estado de scrapers

### Fase 3 — Afiliados activos y primeras comisiones (Mes 2)
- [ ] Aplicar a Remitly en Impact.com con datos de tráfico de GA4
- [ ] Aplicar a Wise en Partnerize
- [ ] Aplicar a Xoom, Ria, WorldRemit en CJ Affiliate
- [ ] Reemplazar links directos por links de afiliado con tracking ID
- [ ] Verificar que los eventos click_operador en GA4 coinciden con las conversiones en Impact/CJ
- [ ] Primer reporte mensual: clics → conversiones → comisiones generadas
- [ ] Contactar Boss Money directamente para acuerdo CPA directo
- [ ] Contactar Remesas Reservas (Banreservas) para acuerdo directo
- [ ] Implementar slots de publicidad activos con primeros banners

### Fase 4 — Escala y nuevos corredores (Mes 3–9)

#### 4.1 — SEO y contenido
- [ ] Crear estructura de blog en Next.js
- [ ] Artículo 1: "Cuánto cobra Western Union para enviar dinero a Honduras hoy"
- [ ] Artículo 2: "Remitly vs Western Union para enviar a República Dominicana"
- [ ] Artículo 3: "La forma más barata de mandar dinero a Guatemala en 2026"
- [ ] Un artículo por corredor por mes mínimo
- [ ] Configurar sitemap.xml automático
- [ ] Verificar propiedad en Google Search Console
- [ ] Optimizar Core Web Vitals — verde en PageSpeed

#### 4.2 — Nuevos corredores
- [ ] Agregar corredor USA → Colombia con operadores y afiliados
- [ ] Agregar corredor USA → México
- [ ] Agregar corredor USA → Nicaragua
- [ ] Agregar corredor USA → Haití
- [ ] Crear contenido SEO específico por cada nuevo corredor

#### 4.3 — Publicidad directa con bancos
- [ ] Reunión con Banreservas NY (Washington Heights)
- [ ] Propuesta: widget de tasa de cambio patrocinado en el landing
- [ ] Acuerdo de publicidad directa con Viamericas ($500–$1,500/mes)
- [ ] Contactar Banco Popular RD para widget de tasa
- [ ] Contactar bancos centroamericanos para acuerdos similares

#### 4.4 — Alertas premium
- [ ] Crear tabla alertas_suscriptores en Supabase
- [ ] Configurar Stripe para cobro recurrente $2–5/mes
- [ ] Bot WhatsApp envía alerta cuando tasa cruza umbral configurado
- [ ] Página de suscripción a alertas
- [ ] Email de confirmación de suscripción (Resend)
- [ ] Newsletter semanal: mejor operador de la semana por corredor

#### 4.5 — Negociación CPL y acuerdos directos
- [ ] Cuando 200+ clics/mes por operador: contactar para negociar directo
- [ ] Eliminar intermediario (Impact, CJ) para operadores con volumen
- [ ] Negociar CPL: pago por usuario registrado aunque no haya enviado

### Fase 5 — App móvil y datos B2B (Mes 9–18)

#### Solo iniciar cuando la web tenga 5,000+ usuarios activos mensuales

#### 5.1 — App móvil
- [ ] Inicializar React Native + Expo
- [ ] Pantalla principal: calculadora comparador
- [ ] Notificaciones push nativas
- [ ] Widget de tipo de cambio en pantalla de inicio del teléfono
- [ ] Publicar en App Store (iOS)
- [ ] Publicar en Google Play (Android)

#### 5.2 — Revenue Share — meta explícita: mes 12–18
Cuando el volumen referido llegue a $50,000/mes:
- [ ] Contactar Remitly para negociar Revenue Share directo
- [ ] Contactar Wise para Revenue Share
- [ ] Meta: 0.3%–0.5% de cada transferencia de por vida por usuario referido
- [ ] Modelo híbrido: CPA inicial + Revenue Share recurrente

#### 5.3 — Datos B2B
- [ ] API pública de precios históricos por corredor: $99–$499/mes
- [ ] Primer reporte de mercado: "Comportamiento del corredor USA–Honduras 2026"
- [ ] Identificar compradores: bancos, fintechs, consultoras, gobiernos
- [ ] Contactar UniTeller como canal de distribución hacia sus 100+ clientes

### Fase 6 — Expansión Europa y decisión estratégica (Mes 18–36)
- [ ] Lanzar remitbefore.com para mercado angloparlante
- [ ] Corredores desde España, Italia, Reino Unido hacia América Latina
- [ ] 200,000+ visitas únicas mensuales
- [ ] 3+ acuerdos de Revenue Share activos
- [ ] Presencia en al menos 8 corredores activos
- [ ] Evaluar dirección: crecer independiente / partnership / expansión con capital

---

## Métricas por fase

| Fase | Visitas/mes | Ingresos/mes | Meta clave |
|------|-------------|--------------|------------|
| MVP | 500–2,000 | $0 | 50 clics en Enviar ahora |
| 1–2 | 2,000–5,000 | $200–$800 | Primera comisión recibida |
| 3 | 5,000–15,000 | $800–$3,000 | Break-even costos operativos |
| 4 | 15,000–60,000 | $3,000–$10,000 | Acuerdo directo con 2 operadores |
| 5 | 60,000–150,000 | $10,000–$30,000 | Revenue Share activo |
| 6 | 150,000–400,000 | $30,000–$100,000 | Referente hemisferio occidental |

---

## Reglas del proyecto que no cambian
1. No construir app móvil hasta 5,000 usuarios activos/mes en la web
2. No agregar corredor nuevo hasta que el anterior genere $3,000/mes estables
3. No levantar capital externo antes del mes 18
4. No rediseñar el landing — solo agregar contenido a los slots vacíos
5. Publicar tasa de cambio todos los días hábiles en redes sociales — sin excepción
6. Nunca esconder que somos un comparador independiente — es el activo más valioso
7. Revisar métricas una vez por semana — no todos los días
8. El número que importa cada semana: clics en "Enviar ahora"
9. Ninguna decisión de dirección estratégica antes del mes 18
10. Revenue Share es la meta explícita — mes 12 a 18 — no es opcional
