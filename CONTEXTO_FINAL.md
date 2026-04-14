# CONTEXTO DEL PROYECTO — Comparador de Giros LATAM · Producto Final

---

## Qué es este documento
Este es el contexto del producto final del Comparador de Giros LATAM — una plataforma
completa de comparación de precios de remesas para la diáspora latinoamericana en EE.UU.,
con cobertura de múltiples corredores (USA→RD, USA→Haití, USA→Colombia), app móvil nativa,
sistema de alertas premium, publicidad directa de operadores bancarios, y partnerships
estratégicos con Banreservas y UniTeller.

El producto se construye sobre el MVP validado. Cada etapa aquí marcada con [x]
ya fue completada durante el MVP. Las etapas sin marcar son las que quedan por construir
en la fase de crecimiento y escala.

El negocio no procesa pagos, no mueve dinero, no requiere licencias regulatorias.
Es una plataforma de información y comparación — el "Trivago de las remesas" para
la diáspora latinoamericana en EE.UU., en español, con contexto cultural real.

Modelo de negocio (4 capas):
  Capa 1 → Afiliados de operadores (desde mes 2)
  Capa 2 → Publicidad directa de operadores y bancos (desde mes 7)
  Capa 3 → Alertas premium / suscripción $2–5/mes (desde mes 9)
  Capa 4 → Datos y research B2B vendidos a bancos y fintechs (año 2+)

---

## URLs del proyecto
- Web live:         [pendiente — configurar dominio]
- App iOS:          [pendiente — App Store]
- App Android:      [pendiente — Google Play]
- Vercel dashboard: https://vercel.com
- Supabase:         https://supabase.com
- GitHub:           https://github.com/[usuario]/giros-latam

---

## Repositorio GitHub
```
[pendiente — crear repositorio]
```

## Estructura del repositorio (producto final)
```
giros-latam/
  app/
    globals.css
    layout.tsx
    page.tsx                        ← calculadora principal / comparador
    blog/
      page.tsx                      ← listado de artículos SEO
      [slug]/page.tsx               ← artículo individual
    haiti/
      page.tsx                      ← corredor USA → Haití
    colombia/
      page.tsx                      ← corredor USA → Colombia
    alertas/
      page.tsx                      ← página de alertas premium
    api/
      precios/route.ts              ← endpoint precios actualizados
      tasa/route.ts                 ← tipo de cambio DOP/USD
      suscripcion/route.ts          ← gestión alertas premium
      webhook/route.ts              ← webhook Stripe alertas premium
  components/
    Comparador.tsx                  ← tabla de comparación
    Calculadora.tsx                 ← input monto + resultado
    AfiliadoLink.tsx                ← link con tracking afiliado
    WidgetTasaBanco.tsx             ← widget patrocinado por banco
    AlertaForm.tsx                  ← suscripción a alertas premium
    ReviewCard.tsx                  ← review de usuario real
  lib/
    supabase.ts
    stripe.ts
    scrapers/
      wise.ts
      remitly.ts
      xoom.ts
      worldremit.ts
      westernunion.ts
      banreservas.ts                ← Remesas Reservas (Banreservas)
      viamericas.ts
  public/
  .env.local
  next.config.ts
  package.json
  CONTEXTO_MVP.md
  CONTEXTO_FINAL.md
```

---

## Stack tecnológico
- Next.js 14+ (TypeScript) — frontend y API routes
- Tailwind CSS — estilos
- Supabase — base de datos, auth de usuarios, cache de precios
- Vercel — hosting y deploy automático
- Upstash Redis — cache de precios (actualización cada 30 min)
- Stripe — cobro de alertas premium ($2–5/mes)
- Resend — emails newsletter y alertas
- WhatsApp Business API (Twilio) — bot de tipo de cambio + alertas premium
- React Native + Expo — app móvil iOS y Android (Fase 2)
- GitHub — control de versiones

---

## Tipografía y diseño
- Fuente: [pendiente — decidir en Etapa 1 del MVP]
- Colores: verde bosque como acento, fondo claro neutro
- Mobile-first — el 91% de la audiencia llega desde smartphone
- Español dominicano en todo el copy
- App móvil diseñada para uso con una mano, tipografía grande

---

## Operadores comparados (producto final)
| Operador              | Afiliado activo | Estado        |
|-----------------------|-----------------|---------------|
| Wise                  | Partnerize      | MVP           |
| Remitly               | Directo         | MVP           |
| Xoom (PayPal)         | PayPal Affiliate| MVP           |
| WorldRemit            | Directo         | MVP           |
| Western Union         | CPA variable    | MVP           |
| Banreservas (Remesas Reservas) | Acuerdo directo | Fase 2 |
| Viamericas            | Acuerdo directo | Fase 2        |
| Operadores corredor Haití | Por definir | Fase 2       |
| Operadores corredor Colombia | Por definir | Fase 3    |

---

## Variables de entorno (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend (email)
RESEND_API_KEY=

# WhatsApp Business API
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# Stripe (alertas premium)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Afiliados — tracking IDs
WISE_AFFILIATE_ID=
REMITLY_AFFILIATE_ID=
XOOM_AFFILIATE_ID=
WORLDREMIT_AFFILIATE_ID=
BANRESERVAS_AFFILIATE_ID=
VIAMERICAS_AFFILIATE_ID=

# Banco Central RD — tipo de cambio oficial
BCRD_API_URL=https://apis.bancentral.gov.do/currency/get?key=

# Entorno
NODE_ENV=development
```

---

## Comandos esenciales
```bash
# Clonar en PC nueva
git clone https://github.com/[usuario]/giros-latam.git
cd giros-latam
npm install
npm run dev

# Abrir proyecto ya clonado
cd [ruta del proyecto]
code .

# Subir cambios
git add .
git commit -m "descripcion"
git push

# Antes de trabajar siempre
git pull
```

## Reglas del repositorio
- Siempre git pull antes de empezar
- Siempre git push al terminar
- Commits descriptivos en español
- Nunca subir .env.local al repositorio

---

## ROADMAP COMPLETO — 6 Etapas

### Etapa 0 — Preparación (Semana 1)
- [ ] Decidir nombre de dominio definitivo y registrarlo
- [ ] Crear repositorio GitHub: giros-latam
- [ ] Crear proyecto en Vercel — conectar con GitHub
- [ ] Crear proyecto en Supabase
- [ ] Crear cuenta en Upstash para Redis cache
- [ ] Registrarse en Wise Partnerize: wise.com/gb/affiliate-program
- [ ] Registrarse en Remitly Partner Program: partner@remitly.com
- [ ] Aplicar a Xoom Affiliate (PayPal Partner Program)
- [ ] Aplicar a WorldRemit Affiliates: worldremit.com/affiliates
- [ ] Crear cuenta de TikTok con el nombre del proyecto
- [ ] Crear cuenta de Instagram y Facebook Page
- [ ] Crear cuenta de YouTube
- [ ] Crear cuenta de WhatsApp Business
- [ ] Crear hoja de cálculo manual con precios actuales de los 5 operadores
- [ ] Entrar en 5 grupos de Facebook de dominicanos en NY/FL como observador

### Etapa 1 — MVP: Calculadora y comparador (Semana 2–3)
- [ ] Inicializar proyecto Next.js 14+ con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Crear layout.tsx con fuentes y estructura base
- [ ] Crear componente Calculadora — input de monto en USD
- [ ] Crear componente Comparador — tabla con 5 operadores
- [ ] Conectar a Supabase — tabla `precios` con cache de operadores
- [ ] Crear scraper básico para Wise
- [ ] Crear scraper básico para Remitly
- [ ] Crear scraper básico para Western Union
- [ ] Crear API route /api/precios que devuelve precios actualizados
- [ ] Configurar Upstash Redis — cache de precios cada 30 minutos
- [ ] Crear API route /api/tasa — tipo de cambio DOP/USD desde BCRD
- [ ] Cada botón "Enviar con X" tiene link de afiliado con tracking
- [ ] Deploy en Vercel — web visible en dominio real
- [ ] Prueba manual con 5 operadores comparados correctamente

### Etapa 2 — MVP: Contenido SEO y WhatsApp bot (Semana 4–5)
- [ ] Crear estructura de blog en Next.js (app/blog/)
- [ ] Escribir y publicar Artículo 1: "Cuánto cobra Western Union para enviar dinero a RD hoy"
- [ ] Escribir y publicar Artículo 2: "Remitly vs Western Union para enviar a RD"
- [ ] Escribir y publicar Artículo 3: "La forma más barata de mandar giros a RD en 2025"
- [ ] Configurar metadata de Next.js en cada artículo
- [ ] Configurar sitemap.xml automático
- [ ] Configurar robots.txt
- [ ] Verificar propiedad en Google Search Console
- [ ] Configurar WhatsApp Business API (Twilio)
- [ ] Bot responde "tasa" con tipo de cambio DOP/USD del día
- [ ] Bot responde "comparar" con link al comparador
- [ ] Añadir link al grupo de WhatsApp en el sitio web
- [ ] Verificar que los 3 artículos estén indexados en Google

### Etapa 3 — MVP: Comunidad y primeras comisiones (Semana 6–8)
- [ ] Publicar primer video de TikTok en español dominicano
- [ ] Publicar mismo video como Reel de Instagram
- [ ] Entrar a 10 grupos de Facebook de dominicanos en NY, FL, NJ, MA
- [ ] Publicar tipo de cambio DOP/USD en grupos Facebook todos los días hábiles
- [ ] Compartir link del comparador después de 2 semanas de dar valor
- [ ] Crear grupo de WhatsApp propio: "Tipo de cambio diario — Dominicanos USA"
- [ ] Recibir primeras comisiones de Wise y/o Remitly
- [ ] Documentar en hoja de cálculo qué canal generó cada clic
- [ ] Identificar cuál de los 3 artículos trae más tráfico orgánico
- [ ] Revisar Google Analytics — qué páginas funcionan mejor

### Etapa 4 — Escala: nuevos operadores, más corredores y publicidad directa (Mes 3–9)

#### 4.1 — Mejoras al comparador
- [ ] Añadir Banreservas (Remesas Reservas) al comparador
- [ ] Añadir Viamericas al comparador
- [ ] Crear scrapers para los dos nuevos operadores
- [ ] Historial de precios — "esta semana WU cobró X, la semana pasada Y"
- [ ] Calculadora de ahorro anual — "cambiando a Remitly ahorras $X al año"
- [ ] Página individual de review por operador con análisis editorial honesto
- [ ] Optimizar Core Web Vitals — verde en Google PageSpeed

#### 4.2 — Nuevos corredores
- [ ] Añadir corredor USA → Haití (app/haiti/)
- [ ] Identificar y registrarse en programas de afiliados de operadores del corredor Haití
- [ ] Crear contenido SEO específico para el corredor Haití (3 artículos mínimo)
- [ ] Añadir corredor USA → Colombia (app/colombia/)
- [ ] Identificar y registrarse en programas de afiliados para Colombia
- [ ] Crear contenido SEO específico para Colombia

#### 4.3 — Publicidad directa
- [ ] Reunión con oficina de Banreservas en Washington Heights, NY (Fabian)
- [ ] Propuesta CPA: $25–75 por usuario que descarga Remesas Reservas desde la plataforma
- [ ] Acuerdo de publicidad directa con Viamericas ($500–$1,500/mes)
- [ ] Implementar componente WidgetTasaBanco — tasa patrocinada por banco
- [ ] Contactar Banco Popular RD para acuerdo de widget de tasa de cambio
- [ ] Contactar BHD León para acuerdo de widget

#### 4.4 — Sistema de alertas premium
- [ ] Crear tabla `alertas_suscriptores` en Supabase
- [ ] Configurar Stripe para cobro recurrente $2–5/mes
- [ ] Implementar webhook Stripe para activar/desactivar alertas
- [ ] Bot de WhatsApp envía alerta cuando DOP/USD cruza umbral configurado
- [ ] Página de suscripción a alertas (app/alertas/)
- [ ] Email de confirmación de suscripción (Resend)

#### 4.5 — Crecimiento de comunidad
- [ ] Escalar a 3–5 videos TikTok por mes
- [ ] Primer micro-influencer dominicano: $100–$300 por video patrocinado
- [ ] Meta Ads: $200–500/mes segmentado en NY, FL, NJ, MA — solo si orgánico funciona
- [ ] Newsletter semanal con tipo de cambio + mejor operador de la semana
- [ ] Grupos de WhatsApp segmentados por estado: NY, FL, NJ, MA

### Etapa 5 — App móvil y datos B2B (Mes 9–18)

#### 5.1 — App móvil nativa
- [ ] Solo iniciar cuando la web tenga 5,000+ usuarios activos mensuales
- [ ] Inicializar proyecto React Native + Expo
- [ ] Pantalla principal: calculadora comparador
- [ ] Notificaciones push nativas (reemplaza el bot de WhatsApp para usuarios de app)
- [ ] Widget de tipo de cambio en pantalla de inicio del teléfono
- [ ] Historial de comparaciones del usuario
- [ ] Publicar en App Store (iOS)
- [ ] Publicar en Google Play (Android)

#### 5.2 — Datos y research B2B
- [ ] Crear API de precios públicos (datos históricos del corredor RD)
- [ ] Primer reporte de mercado: "Comportamiento del corredor USA–RD 2025"
- [ ] Identificar compradores potenciales: bancos, fintechs, consultoras
- [ ] Vender primer reporte ($500–$2,000)
- [ ] Contactar UniTeller como canal de distribución hacia sus 100+ clientes operadores
- [ ] Propuesta a UniTeller: el comparador como canal de adquisición de usuarios para sus clientes

### Etapa 6 — Decisión estratégica (Mes 18–36)
- [ ] Revenue de $10,000+/mes sostenido por 3 meses consecutivos
- [ ] 200,000+ visitas únicas mensuales
- [ ] Lista de WhatsApp de 5,000+ personas activas
- [ ] 3 corredores activos con contenido y afiliados
- [ ] Acuerdo formal vigente con al menos 1 banco dominicano
- [ ] Evaluar dirección: crecer independiente / partnership exclusivo / venta
- [ ] Si venta: preparar due diligence — métricas, ingresos, contratos, audiencia
- [ ] Precio objetivo de exit: 3–8x ARR anual

---

## PUNTO DE LANZAMIENTO MVP
= Etapas 0 + 1 + 2 completas

## PUNTO DE PRODUCTO COMPLETO
= Etapas 0 + 1 + 2 + 3 + 4 + 5 completas

---

## Métricas por etapa

| Etapa | Visitas/mes | Ingresos/mes | Meta clave                     |
|-------|-------------|--------------|--------------------------------|
| MVP   | 500–1,500   | $0–$500      | Primera comisión recibida      |
| 3     | 3,000–8,000 | $500–$2,000  | Break-even de costos operativos|
| 4     | 20,000–60,000 | $3,000–$10,000 | Acuerdo Banreservas activo  |
| 5     | 60,000–150,000 | $10,000–$25,000 | App lanzada                |
| 6     | 150,000–300,000 | $20,000–$50,000 | Decisión estratégica       |

---

## Reglas del proyecto que no cambian
1. No construir la app móvil hasta tener 5,000 usuarios activos/mes en la web
2. No invertir en publicidad pagada hasta que el canal orgánico demuestre conversiones
3. No agregar segundo corredor hasta que el corredor RD genere $3,000/mes estables
4. No levantar capital externo antes del mes 12
5. Publicar tipo de cambio todos los días hábiles en WhatsApp y Facebook — sin excepciones
6. Nunca esconder que somos un comparador independiente — la independencia editorial es el activo más valioso
7. Revisar métricas una vez por semana, no todos los días
8. Ninguna decisión de dirección estratégica antes del mes 18
