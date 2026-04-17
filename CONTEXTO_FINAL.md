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
- next-intl — soporte multi-idioma español/inglés con routing automático y SEO optimizado
- MDX — contenido editorial (wiki, reviews de operadores, páginas legales) versionado en el repo
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

## Infraestructura GitHub + Vercel — configuración desde Fase 1

Las siguientes configuraciones no son opcionales — son base de seguridad y mantenimiento. Se documentan aquí para que queden explícitas en el roadmap.

### GitHub Secrets (seguridad de credenciales)
- Todas las variables de entorno listadas arriba NUNCA se guardan en el repositorio
- Se guardan en dos lugares:
  - GitHub Secrets (Settings → Secrets and variables → Actions) para que GitHub Actions pueda usarlas si se configura CI/CD futuro
  - Vercel Environment Variables (Project Settings → Environment Variables) para que Vercel las inyecte en build y runtime
- El archivo .env.local solo existe localmente en la máquina del desarrollador — está incluido en .gitignore
- El archivo .env.example se commitea SIN valores reales, solo con los nombres de las variables, para que nuevos colaboradores sepan qué configurar

### Vercel deploy automático
- Rama main del repositorio aneurysoto-pre/preenvios = deploy a producción automático en preenvios.com
- Cualquier otra rama (feature/*, fix/*) = preview deployment automático con URL única generada por Vercel
- Rollback instantáneo disponible desde el dashboard de Vercel si un deploy rompe producción
- Webhook de Slack o email opcional para notificar deploys exitosos y fallidos

### Dependabot (seguridad automática de dependencias)
- Crear archivo .github/dependabot.yml en el repositorio con configuración para escanear npm semanalmente
- Dependabot abre pull requests automáticamente cuando detecta vulnerabilidades o actualizaciones importantes
- Review manual de los PRs antes de merge — no auto-merge
- Sin costo, incluido gratis en GitHub

### README técnico del repositorio
- Crear archivo README.md en la raíz del repositorio con las siguientes secciones:
  - Qué es Preenvíos (link al CONTEXTO_FINAL.md y CONTEXTO_MVP.md)
  - Stack tecnológico resumido
  - Cómo correr el proyecto localmente (git clone, npm install, .env.local, npm run dev)
  - Estructura de carpetas principal
  - Scripts disponibles (dev, build, start, lint, test)
  - Link a documentación de Vercel para deployment
  - Link a documentación de Supabase para gestión de base de datos
  - Convención de commits en español
- El README se actualiza cuando se agregan dependencias nuevas o scripts

---

## ROADMAP COMPLETO — 6 Fases

### Fase 0 — MVP validado (completado antes de esta fase)
- [x] Landing HTML estático con 4 corredores y 7 operadores
- [x] Google Analytics con medición completa de comportamiento
- [x] Algoritmo de ranking implementado
- [x] Slots de afiliado preparados
- [x] Slots de publicidad preparados
- [x] Sección "Ofertas destacadas hoy" oculta en el HTML (clase `hidden-block`) — se construye en Fase 1
- [x] 50+ clics en "Enviar ahora" en 30 días confirmados
- [x] 70%+ del tráfico desde EE.UU. confirmado

### Fase 1 — Migración al stack final (Semana 1–2 post-MVP)
- [x] Crear proyecto Next.js 14+ con TypeScript en el mismo repositorio (completado 2026-04-16)
- [x] Migrar el diseño HTML a componentes React manteniendo línea gráfica exacta (completado 2026-04-16)
- [x] Configurar Tailwind CSS con las variables de diseño del MVP (completado 2026-04-16)
- [x] Conectar repositorio a Vercel — deploy automático desde GitHub (completado 2026-04-16 — https://preenvios.vercel.app)
- [x] Crear proyecto en Supabase — tabla `precios` y tabla `corredores` (completado 2026-04-16)
- [x] Migrar las tasas manuales del HTML a Supabase (completado 2026-04-16)
- [x] Crear API route /api/precios que sirve las tasas desde Supabase (completado 2026-04-16)
- [x] El landing ahora lee precios de Supabase en lugar del HTML hardcodeado (completado 2026-04-16)
- [ ] Configurar dominio preenvios.com en Vercel (dejar de usar GitHub Pages) (diferido — se hace después de Fase 1.5 y pruebas de Fase 2)
- [x] Verificar que Google Analytics sigue midiendo correctamente (completado 2026-04-16)
- [x] Verificar que todos los slots de afiliado y publicidad funcionan (completado 2026-04-16)
- [x] Construir sección **"Ofertas destacadas hoy"** (estilo trivago · carrusel horizontal de tarjetas patrocinadas) — estuvo oculta en el MVP porque mostrar promociones sin sponsors reales es publicidad engañosa y pone en riesgo la aplicación a Impact/CJ. Activarla en Fase 1 solo cuando: (a) al menos un afiliado esté aprobado y genere comisión real, (b) las tarjetas muestren únicamente promociones reales verificadas con el operador, (c) cada tarjeta tenga el badge "Patrocinado" visible y link directo con tracking ID. Tabla `ofertas` en Supabase alimenta el carrusel. (completado 2026-04-16 — componente OfertasDestacadas.tsx creado con hidden=true)
- [x] Reemplazar el selector nativo del celular para elegir país destino por un buscador web personalizado — debe buscar por nombre del país, código de moneda (DOP, HNL, GTQ, USD) y código de país (DO, HN, GT, SV). Ejemplo: escribir DOP muestra República Dominicana, escribir DOM también la muestra. Referencia visual: RemitFinder.com. El selector nativo del sistema operativo no debe activarse. (completado 2026-04-16)
- [x] Agregar selector horizontal de método de entrega en el comparador principal, exactamente como Monito.com — el usuario solo elige país origen + país destino + monto + método de entrega, nada más. Opciones del selector con iconos claros: Cuenta bancaria, Retiro en efectivo, Domicilio, Billetera móvil. No todos los operadores soportan todos los métodos. Tecnología: estado React con useState para el método seleccionado, filtrado dinámico de resultados (completado 2026-04-16)
- [x] Default inteligente: el primer render preselecciona "Cuenta bancaria" como método de entrega (más común en LatAm moderno). Badge "POPULAR" en el método más usado por corredor y "LA MEJOR OFERTA" en el que entrega más dinero al receptor (completado 2026-04-16)
- [x] La tabla precios en Supabase debe soportar el método_entrega como campo. Ejemplo: Remitly + DOP + cuenta_bancaria + $200 = tasa específica, Remitly + DOP + cash_pickup + $200 = tasa distinta (completado 2026-04-16)
- [x] NO incluir selector de método de pago (ACH, tarjeta débito, tarjeta crédito) — ese lo decide el usuario dentro del sitio del operador después de hacer clic en "Enviar ahora". Monito no se mete en eso y nosotros tampoco. Mantenerlo simple (completado 2026-04-16)
- [x] Evento GA4 cambio_metodo_entrega para medir qué métodos usa cada corredor (insight para negociar con operadores después) (completado 2026-04-16)
- [x] Expandir el algoritmo de ranking del MVP (hoy tasa 40 + afiliado 35 + velocidad 25) agregando 2 criterios nuevos: confiabilidad (basada en años del operador + licencia en EE.UU., valor fijo por operador) y disponibilidad de métodos de entrega. Nuevos pesos: tasa 35, afiliado 25, velocidad 20, confiabilidad 10, métodos 10. Tecnología: función rankProviders en lib/ranking.ts. Mostrar en la tarjeta de cada operador un badge "Preenvíos Score: X/100" que rompe el tie visual y genera credibilidad sin construir un sistema de 30 criterios como Monito (completado 2026-04-16)
- [x] Configurar soporte multi-idioma español/inglés desde la migración inicial usando next-intl en Next.js 14 (App Router). Hacerlo en Fase 1 evita reescribir rutas después. Estructura de URLs: preenvios.com/es/ (español, default) y preenvios.com/en/ (inglés). Tecnología: next-intl con middleware de Next.js para detección de locale (completado 2026-04-16)
- [x] Crear archivos de traducción messages/es.json y messages/en.json con todos los textos de UI — navegación, hero, comparador, resultados, FAQ, footer, formularios (completado 2026-04-16)
- [x] Middleware next-intl que detecta automáticamente el idioma del navegador en primera visita (header Accept-Language) y redirige a /es o /en. Fallback a español si el navegador reporta otro idioma (completado 2026-04-16)
- [x] Cookie NEXT_LOCALE que recuerda la preferencia del usuario 365 días — prioridad sobre Accept-Language en visitas siguientes (completado 2026-04-16)
- [x] Selector de idioma EN/ES en el header del sitio — reemplaza el botón EN actual del MVP. Al cambiar, navega a la misma página en el otro idioma (no pierde la ruta actual) (completado 2026-04-16)
- [x] Meta tags hreflang en cada página: rel="alternate" hreflang="es" y hreflang="en" apuntando a la versión correspondiente — requerido para SEO multi-idioma por Google (completado 2026-04-16)
- [x] Sitemap.xml separado por idioma — sitemap-es.xml y sitemap-en.xml, ambos referenciados en robots.txt (completado 2026-04-16)
- [x] NO traducir nombres de operadores (Remitly, Wise, Western Union) ni códigos de moneda (DOP, HNL, GTQ, USD) — se quedan igual en ambos idiomas (completado 2026-04-16)
- [x] Evento GA4 cambio_idioma para medir cuántos usuarios usan cada versión (validar si inglés genera tráfico suficiente para justificar mantener contenido) (completado 2026-04-16)
- [x] Configurar Vercel Environment Variables con todas las credenciales del .env.local (completado 2026-04-16 — 4 variables verificadas en producción)
- [x] Configurar GitHub Secrets con las mismas credenciales (redundancia por si se usa GitHub Actions futuro) (completado 2026-04-16 — 4 secrets configuradas)
- [x] Crear archivo .env.example con nombres de variables sin valores reales (completado 2026-04-16)
- [x] Verificar que .env.local está en .gitignore antes del primer commit de Next.js (completado 2026-04-16)
- [x] Crear archivo .github/dependabot.yml con scan semanal de npm (completado 2026-04-16)
- [x] Crear README.md técnico del repositorio con instrucciones de setup local (completado 2026-04-16)
- [x] Verificar deploy automático desde main a preenvios.vercel.app funciona correctamente (completado 2026-04-16 — preenvios.com sigue en GitHub Pages hasta migración DNS)
- [x] Verificar preview deployments en ramas no-main funcionan con URL única de Vercel (completado 2026-04-16 — verificado con rama test/verify-preview, deploy BBviLHHJY Ready)

### Fase 1.5 — Cumplimiento legal y estructura de negocio (Semana 2–3 post-MVP)
Esta fase se ejecuta en paralelo al lanzamiento, no bloquea Fase 2 ni Fase 3. Plazo realista: 4-8 semanas (depende del proveedor de LLC). Durante ese tiempo se puede operar como individuo usando Payoneer (para CJ Affiliate) y Wise Personal (para Impact.com y Partnerize). Los pagos llegarán al nombre personal del founder hasta que la LLC esté activa, y después se migran los datos bancarios de las redes a la cuenta de la LLC.

- [ ] Constituir LLC en Delaware o Florida para operar el negocio (proteger patrimonio personal) (pendiente de acción del usuario)
- [ ] Obtener EIN (Employer Identification Number) del IRS — requerido para abrir cuenta bancaria del negocio y para aplicar a redes de afiliados (pendiente de acción del usuario)
- [ ] Abrir cuenta bancaria de negocio (Mercury o Relay Bank recomendado por facilidad con LLCs nuevas) (pendiente de acción del usuario)
- [ ] Contratar seguro de E&O (Errors & Omissions) — cobertura $500,000+ para cuando el negocio recomiende un operador y haya disputas (pendiente de acción del usuario)
- [x] Crear página /terminos — términos y condiciones con cláusula de no-liability por decisiones del usuario basadas en la comparación (completado 2026-04-16)
- [x] Crear página /privacidad — política de privacidad compatible con CCPA (California) y GDPR (usuarios europeos futuros): qué datos se recolectan, cookies, Google Analytics, derecho a solicitar borrado (completado 2026-04-16)
- [x] Crear página /como-ganamos-dinero — divulgación FTC clara: Preenvíos recibe comisión de afiliados cuando el usuario envía con ciertos operadores, esto no afecta el ranking que es basado en datos de tasa y velocidad. Link visible en footer de cada página. (completado 2026-04-16)
- [x] Agregar disclosure FTC corta visible cerca de los botones "Enviar ahora" en el comparador: "Preenvíos puede recibir comisión cuando usas estos enlaces" (completado 2026-04-16)
- [x] Crear página /metodologia — explica el algoritmo de ranking, fuentes de datos, frecuencia de actualización (transparencia genera trust) (completado 2026-04-16)
- [x] Crear página /uso-de-marcas — aclaración legal de que los logos y nombres de operadores son marcas nominativas usadas para comparación informativa (protege ante posibles disputas) (completado 2026-04-16)
- [x] Proceso documentado de eliminación de datos personales a solicitud del usuario (CCPA / GDPR compliance) (completado 2026-04-16 — incluido en página /privacidad con email contact@preenvios.com y plazo 30 días)

### Fase 2 — Scrapers automáticos (Semana 3–4 post-MVP)
- [ ] Configurar Upstash Redis para cache de precios (diferido — se activa cuando sea necesario)
- [x] Crear scraper para Wise (API semi-pública — más fácil) (completado 2026-04-16)
- [x] Crear scraper para Ria (completado 2026-04-16)
- [x] Crear scraper para Boss Money (completado 2026-04-16 — placeholder, se activa en Fase 4)
- [x] Crear Vercel Cron Job — ejecuta scrapers cada 2 horas (completado 2026-04-16 — vercel.json con schedule "0 */2 * * *")
- [x] Los scrapers guardan resultados en Supabase (completado 2026-04-16)
- [ ] Upstash Redis cachea los últimos precios para servir rápido (diferido — se activa cuando sea necesario)
- [x] Crear scraper para MoneyGram (protección media) (completado 2026-04-16)
- [x] Crear scraper para Western Union (protección alta — puede requerir proxy) (completado 2026-04-16)
- [x] Crear scraper para Remitly (protección alta — puede requerir proxy) (completado 2026-04-16)
- [ ] Configurar proxies rotativos si Western Union o Remitly bloquean (diferido — se activa cuando sea necesario)
- [x] Dashboard interno para monitorear estado de scrapers (completado 2026-04-16 — /api/admin/dashboard)
- [x] Agregar campo método_entrega a la tabla precios en Supabase (completado 2026-04-16 — campo ya existe desde Fase 1)
- [x] Los scrapers capturan la tasa por método de entrega por operador (completado 2026-04-16 — estructura lista, actualmente solo bank)
- [x] Cada scraper debe capturar las tasas por cada método de entrega soportado por el operador (completado 2026-04-16 — estructura lista, expande a más métodos cuando scrapers estén activos)
- [x] Tabla precios en Supabase con columnas: operador, corredor, metodo_entrega, tasa, fee, velocidad, actualizado_en (completado 2026-04-16)
- [x] Implementar rate limiting y User-Agent identificable en cada scraper (ejemplo: "PreenviosBot/1.0 contact@preenvios.com"). Respetar robots.txt donde aplique. Mínimo 2 segundos entre requests al mismo operador (completado 2026-04-16)
- [x] Sistema de fallback manual — si un scraper falla 3 veces seguidas, el precio queda marcado como "desactualizado" en Supabase y el dashboard admin envía notificación por email. Así la web nunca muestra datos rotos (completado 2026-04-16)
- [ ] Configurar backups automáticos diarios de Supabase exportando a S3 o Backblaze B2 (retención 30 días) (diferido — se activa cuando sea necesario)
- [ ] Monitoreo de uptime con UptimeRobot (gratis hasta 50 monitores) (diferido — se activa cuando sea necesario)
- [x] Bot WhatsApp básico sin login vía Twilio WhatsApp Business API — el usuario escribe el código del corredor (DOP, HNL, GTQ, SVC) y recibe la tasa del día + link de afiliado al mejor operador (completado 2026-04-16 — webhook listo, se activa cuando usuario configure Twilio)
- [ ] Número de WhatsApp publicitado en el footer del sitio y en posts de redes sociales (diferido — se activa cuando sea necesario)
- [x] Tecnología: Twilio WhatsApp sandbox para pruebas, luego número aprobado para producción. Endpoint Next.js /api/whatsapp/webhook que recibe mensajes entrantes, consulta la tasa en Supabase y responde con Twilio SDK (completado 2026-04-16)
- [x] Bot detecta idioma del primer mensaje del usuario y responde en español o inglés consistentemente durante la conversación (completado 2026-04-16)
- [x] WhatsApp es interfaz nativa del mercado latino — prioridad alta, no accesorio (completado 2026-04-16 — webhook implementado)
- [x] Calculadora inversa en preenvios.com/calculadora-inversa — el receptor en LatAm escribe cuántos pesos o lempiras recibió y la calculadora muestra cuánto USD se envió con cada operador (completado 2026-04-16)
- [x] Botón de compartir por WhatsApp con mensaje pre-escrito — activo viral en cadenas familiares (completado 2026-04-16)

### Fase 3 — Afiliados activos y primeras comisiones (Mes 2)

#### 3.0 — Setup de cobro sin LLC (ejecutable desde día 1)
- [ ] Crear cuenta Wise Personal (wise.com) — genera número de cuenta USA con routing number para recibir ACH desde Impact.com y Partnerize
- [ ] Crear cuenta Payoneer (payoneer.com) — para recibir pagos de CJ Affiliate vía "CJ International Payments"
- [ ] Si eres residente USA: preparar W-9 con tu SSN/ITIN. Si no: preparar W-8BEN. Ambos se suben a la red de afiliados cuando pasas el threshold de $2,000/año
- [ ] Cuando la LLC y EIN estén listos (Fase 1.5), cambiar datos bancarios en cada red de afiliado a la cuenta Mercury/Relay de la LLC

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
- [ ] Crear tabla historial_tasas_publico en Supabase (separada de la tabla premium) con tasas por corredor guardadas cada 2 horas por los scrapers
- [ ] Páginas públicas indexadas por Google: preenvios.com/tasa/usd-dop, preenvios.com/tasa/usd-hnl, preenvios.com/tasa/usd-gtq — renderizadas con Next.js ISR (revalidate cada 2 horas)
- [ ] Cada página muestra tasa actual, gráfica de fluctuación de los últimos 30 días con Recharts, tabla de los 7 operadores comparados, y CTA al comparador principal
- [ ] Meta tags optimizados: "Tasa del dólar en República Dominicana hoy — [fecha actualizada]"
- [ ] Schema.org ExchangeRateSpecification en JSON-LD para rich snippets en Google
- [ ] Gráficas públicas son activo SEO — indexadas, no detrás de login
- [ ] Crear una página estática por operador: preenvios.com/operadores/remitly, /wise, /xoom, /ria, /worldremit, /western-union, /moneygram. Contenido: qué es el operador, corredores soportados, tasa actual para LatAm, pros y contras desde perspectiva del usuario latino, badge de ranking Preenvíos. Tecnología: Next.js dynamic routes /app/operadores/[slug]/page.tsx con MDX para contenido editorial. NO es review dinámico con scraping de opiniones — es editorial estático actualizado manualmente cada trimestre
- [ ] Crear versión en inglés de las páginas SEO principales: landing por corredor, páginas de tasa histórica, páginas de operador. Tecnología: estructura /app/[locale]/[corredor]/page.tsx con contenido MDX separado por idioma en /content/es/ y /content/en/
- [ ] NO traducir cada artículo del blog automáticamente — solo se traducen los 3 artículos de mayor tráfico por corredor al inglés. Medir con GA4 si el tráfico en inglés justifica traducir más. Regla: se traduce artículo solo si tiene 500+ visitas/mes en español
- [ ] Keywords SEO en inglés a priorizar para las páginas traducidas: "send money to Honduras", "send money to Dominican Republic", "cheapest remittance to Guatemala", "USD to DOP exchange rate today"
- [ ] Meta descriptions, titles y H1 traducidos manualmente (no automático) — calidad editorial sobre cantidad
- [ ] Crear estructura técnica de wiki educativa en preenvios.com/wiki. Tecnología: ruta dinámica Next.js /app/[locale]/wiki/[slug]/page.tsx con archivos MDX estáticos en /content/wiki/es/ y /content/wiki/en/. Sin base de datos, sin CMS, sin login. Mismo patrón que páginas de operador
- [ ] Crear índice navegable en /wiki con categorías: Fundamentos, Guías por corredor, Educación financiera
- [ ] Navegación lateral persistente con tabla de contenidos del artículo actual y links a artículos relacionados
- [ ] Schema.org Article en JSON-LD en cada artículo para rich snippets en Google
- [ ] Arrancar con 10 artículos fundacionales escritos manualmente (no auto-generados) — meta: publicar 1–2 por semana hasta completar
- [ ] Artículos fundacionales de Fundamentos:
  - [ ] Qué es la tasa de cambio mid-market y por qué importa
  - [ ] Diferencia entre tasa y fee — cuál cuesta más realmente
  - [ ] Cómo elegir la mejor remesadora según el monto que envías
  - [ ] Cash pickup vs depósito bancario — cuál me conviene
  - [ ] Qué documentos necesito para enviar dinero desde EE.UU.
- [ ] Artículos fundacionales por corredor (uno por cada corredor activo):
  - [ ] Cómo recibir dinero en República Dominicana paso a paso
  - [ ] Qué bancos en Honduras tienen convenio con remesadoras
  - [ ] Cuánto tarda una transferencia a Guatemala realmente
- [ ] Artículos de educación financiera:
  - [ ] Impuestos sobre remesas en EE.UU. y en el país receptor
  - [ ] Alertas de tipo de cambio — para qué sirven y cómo usarlas
- [ ] Cada artículo incluye CTA al comparador principal y al formulario de suscripción de alertas gratis (cerrar el loop de lead-gen)
- [ ] La wiki se versiona en inglés solo cuando el artículo en español supere 500 visitas/mes (misma regla que el blog)

#### 4.1.1 — Keywords SEO prioritarias (no mencionar marcas en anuncios pagados)
Palabras y frases de mayor volumen de búsqueda para los corredores activos:
- enviar dinero
- envios de dinero
- enviar dinero a República Dominicana
- enviar dinero a Honduras
- enviar dinero a Guatemala
- enviar dinero a El Salvador
- remesas a República Dominicana
- remesas a Honduras
- mejor tasa de cambio hoy
- cuanto llega si envio 100 dolares
- DOP USD
- HNL USD
- GTQ USD
- comparar remesadoras
- remesadora más barata
- enviar dinero sin comisión

Estas keywords deben guiar los títulos, meta descriptions, H1 y contenido del blog por corredor.

#### 4.2 — Nuevos corredores
- [x] Agregar corredor USA → Colombia con operadores y afiliados (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [x] Agregar corredor USA → México (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [x] Agregar corredor USA → Nicaragua (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [x] Agregar corredor USA → Haití (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [ ] Crear contenido SEO específico por cada nuevo corredor

#### 4.3 — Publicidad directa con bancos
- [ ] Reunión con Banreservas NY (Washington Heights)
- [ ] Propuesta: widget de tasa de cambio patrocinado en el landing
- [ ] Acuerdo de publicidad directa con Viamericas ($500–$1,500/mes)
- [ ] Contactar Banco Popular RD para widget de tasa
- [ ] Contactar bancos centroamericanos para acuerdos similares

#### 4.4.A — Alertas gratuitas y captura de email (lead-gen) — se construye ANTES que el panel premium
Propósito: capturar emails de usuarios no pagos para newsletter con links de afiliado. Tecnología: Supabase (tabla suscriptores_free), Resend (envío de emails), Next.js API Routes (endpoint de suscripción), double opt-in para cumplir CAN-SPAM.

- [ ] Crear tabla suscriptores_free en Supabase con campos email, corredor_favorito, idioma (es/en), fecha_alta, confirmado, token_confirmacion
- [ ] Formulario de suscripción inline en cada página de corredor ("Recibe la tasa de hoy cada mañana en tu email")
- [ ] Flujo de double opt-in con Resend — email de confirmación con token único antes de activar suscripción
- [ ] Email diario automático con la tasa del día del corredor elegido + link afiliado al mejor operador (cron en Vercel a las 7 AM hora EST)
- [ ] Newsletter semanal con el mejor operador de la semana por corredor — misma infraestructura Resend
- [ ] Templates de email en Resend separados por idioma — el usuario recibe emails en español o inglés según la columna idioma de su registro
- [ ] Página de baja (unsubscribe) obligatoria por ley CAN-SPAM con token único en cada email, renderizada en el idioma del email original
- [ ] Endpoint API /api/suscripcion-free para alta y baja
- [ ] Evento GA4 suscripcion_free cuando el usuario confirma (medir conversión del landing)

#### 4.4.B — Panel del cliente premium con Stripe — se construye DESPUÉS del 4.4.A
Propósito: monetización recurrente de usuarios avanzados. Tecnología: Supabase Auth, Stripe Subscriptions + webhooks, Twilio WhatsApp Business API, Next.js middleware para proteger rutas premium.

- [ ] Crear tabla alertas_suscriptores_premium en Supabase (separada de la free)
- [ ] Crear tabla historial_tasas en Supabase — guarda tasas por corredor cada 2 horas para mostrar gráfica de fluctuación
- [ ] Crear tabla envios_record en Supabase — el usuario registra sus envíos manualmente para tener historial descargable
- [ ] Configurar Stripe Subscriptions con producto "Preenvíos Premium" $2–5/mes + webhook route /api/stripe/webhook
- [ ] Página de registro e inicio de sesión — auth con Supabase Auth (email + password)
- [ ] Middleware Next.js que protege /app/panel cuando no hay sesión activa o suscripción vencida
- [ ] Panel del cliente premium — lo que el usuario hace adentro:
  - [ ] Ver tasas de cambio en tiempo real de sus corredores favoritos
  - [ ] Elegir hasta 5 pares de monedas para seguir (DOP/USD, HNL/USD, GTQ/USD, SVC/USD)
  - [ ] Configurar alertas múltiples por umbral — ejemplo: "avísame cuando DOP pase de 61"
  - [ ] Canal de notificación WhatsApp vía Twilio Business API (diferenciador premium vs free que solo tiene email)
  - [ ] Ver gráfica de fluctuación histórica por par de monedas (Recharts o Chart.js)
  - [ ] Registrar y descargar récord de envíos en PDF (react-pdf) o CSV
  - [ ] Sin publicidad en el panel y en la calculadora para usuarios premium
  - [ ] Gestionar suscripción y método de pago vía Stripe Customer Portal

#### 4.5 — Panel de administrador
- [x] Dashboard interno con métricas clave — visitas, comparaciones y clics por operador en tiempo real (completado 2026-04-16 — /admin con login, stats, monitor scrapers)
- [x] Módulo de actualización manual de tasas por corredor — interfaz simple para actualizar sin tocar código (completado 2026-04-16 — tab Tasas con edición inline)
- [x] Lista de suscriptores activos con estado de pago y corredor favorito (completado 2026-04-16 — estructura lista, se conecta cuando Fase 4.4 esté activa)
- [x] Módulo para disparar alertas manualmente por corredor — para cuando un scraper falle (completado 2026-04-16 — selector corredor + mensaje, envío real con Resend en Fase 4.4.A)
- [x] Reporte de ingresos — comisiones por afiliado + suscripciones premium por mes (completado 2026-04-16 — tab Ingresos con placeholder, datos reales en Fase 3)
- [x] Monitor de estado de scrapers — verde/rojo por operador con última actualización exitosa (completado 2026-04-16 — tarjetas verde/rojo por operador con timestamp)

#### 4.6 — Negociación CPL y acuerdos directos
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
- [ ] Lanzar remitbefore.com como dominio independiente para mercado angloparlante europeo y estadounidense — separado de preenvios.com/en porque el posicionamiento de marca en inglés para Europa (España, Italia, UK enviando a LatAm) requiere marca propia no derivada de "Preenvíos". preenvios.com/en sigue existiendo para la diáspora latina en EE.UU. que prefiere inglés
- [ ] Corredores desde España, Italia, Reino Unido hacia América Latina
- [ ] 200,000+ visitas únicas mensuales
- [ ] 3+ acuerdos de Revenue Share activos
- [ ] Presencia en al menos 8 corredores activos
- [ ] Evaluar dirección: crecer independiente / partnership / expansión con capital

### Fase 16 — Políticas legales

- [x] Implementar Disclaimer #1 (tasas aproximadas) en la tarjeta de cada operador del comparador (completado 2026-04-16)
- [x] Implementar Disclaimer #1 también como párrafo debajo del bloque de resultados del comparador (completado 2026-04-16)
- [x] Implementar Disclaimer #2 (institución no financiera) en el footer global (completado 2026-04-16)
- [x] Implementar Disclaimer #3 (ranking influenciado) debajo del encabezado de resultados con link a /como-ganamos-dinero (completado 2026-04-16)
- [x] Implementar Disclaimer #4 (FTC afiliados) cerca de cada botón "Enviar ahora" (completado 2026-04-16)
- [x] Crear página /terminos con Disclaimer #2 y #5, edad mínima 18, jurisdicción Delaware (completado 2026-04-16)
- [x] Crear página /privacidad compatible con CCPA y GDPR (completado 2026-04-16)
- [x] Crear página /como-ganamos-dinero con Disclaimer #4 y detalle de redes de afiliados (completado 2026-04-16)
- [x] Crear página /metodologia con los 5 criterios y pesos exactos (completado 2026-04-16)
- [x] Crear página /uso-de-marcas con Disclaimer #6 (completado 2026-04-16)
- [x] Footer global tiene links visibles a /terminos, /privacidad, /como-ganamos-dinero y /uso-de-marcas (completado 2026-04-16)
- [x] Traducir los 6 disclaimers y las 5 páginas legales a inglés con next-intl (completado 2026-04-16)

---

## Métricas por fase

| Fase | Visitas/mes | Emails free | Ingresos/mes | Meta clave |
|------|-------------|-------------|--------------|------------|
| MVP | 500–2,000 | — | $0 | 50 clics en Enviar ahora |
| 1–2 | 2,000–5,000 | 100–500 | $200–$800 | Primera comisión recibida |
| 3 | 5,000–15,000 | 500–2,000 | $800–$3,000 | Break-even costos operativos |
| 4 | 15,000–60,000 | 2,000–10,000 | $3,000–$10,000 | Acuerdo directo con 2 operadores |
| 5 | 60,000–150,000 | 10,000–30,000 | $10,000–$30,000 | Revenue Share activo |
| 6 | 150,000–400,000 | 30,000–80,000 | $30,000–$100,000 | Referente hemisferio occidental |

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
11. No construir nada detrás de paywall antes de tener primero su versión gratuita capturando emails
12. Toda feature nueva pasa el filtro: ¿genera rentabilidad directa, protección legal, o tracción orgánica medible? Si no, se difiere
13. No replicar Monito 1:1 — replicar solo lo que un usuario latino en EE.UU. necesita
14. Multi-idioma es español/inglés únicamente hasta Fase 6. No agregar francés, portugués, ni otros idiomas aunque tengan tráfico — el costo de mantenimiento editorial no se justifica hasta expansión Europa
15. El comparador solo pregunta país origen, país destino, monto y método de entrega — nunca pregunta método de pago (ACH, tarjeta débito, crédito). Eso lo decide el usuario dentro del sitio del operador después del clic. Mantener simple como Monito
16. El proyecto se lanza SIN esperar la LLC. Se opera como individuo con Wise/Payoneer durante las primeras 4-8 semanas. La LLC, EIN, cuenta bancaria de negocio y E&O se gestionan en paralelo y se activan cuando estén listos, sin bloquear el lanzamiento ni la monetización inicial.
