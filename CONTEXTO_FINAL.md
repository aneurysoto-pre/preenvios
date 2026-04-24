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
- Upstash Redis — cache de precios (actualización diaria, cada 2 horas en plan Pro)

### Scrapers automáticos
- Playwright o Puppeteer — scraping de tasas
- Vercel Cron Jobs — ejecución diaria en Hobby, cada 2 horas en Pro
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

### Fase MVP — 6 corredores activos
| Corredor | Moneda | Código | Prioridad |
|----------|--------|--------|-----------|
| USA → Honduras | Lempira | HNL | 🥇 Primera |
| USA → República Dominicana | Peso Dominicano | DOP | 🥈 Segunda |
| USA → Guatemala | Quetzal | GTQ | 🥉 Tercera |
| USA → El Salvador | Dólar Americano | USD | 4️⃣ Cuarta |
| USA → Colombia | Peso Colombiano | COP | 5️⃣ Quinta |
| USA → México | Peso Mexicano | MXN | 6️⃣ Sexta |

### Integraciones futuras / alcance post-MVP

PreEnvios está diseñado para agregar nuevos corredores sin fricción arquitectónica (ver `LOGICA_DE_NEGOCIO/11_nuevos_corredores.md` para el proceso técnico). La decisión de qué países incorporar después del MVP se tomará en base a: volumen real de búsqueda orgánica post-lanzamiento, disponibilidad de scrapers o feeds de afiliados, y demanda explícita desde comments/emails de usuarios. **No hay compromiso de países específicos** hasta que esa data exista.

### Fase 5 — Expansión Europa
| Corredor | Desde | Moneda destino |
|----------|-------|----------------|
| España → América Latina | EUR | Múltiples |
| Italia → América Latina | EUR | Múltiples |
| Reino Unido → América Latina | GBP | Múltiples |

---

## Operadores — expansión por fases

### MVP — 7 operadores (5 aprobados + 2 pendientes de aprobación)
| Operador | Afiliado | Red | Estado |
|----------|----------|-----|--------|
| Remitly | ✅ | Impact.com | MVP — aprobado |
| Wise | ✅ | Partnerize | MVP — aprobado |
| Xoom (PayPal) | ✅ | CJ Affiliate | MVP — aprobado |
| Ria Money Transfer | ✅ | CJ Affiliate | MVP — aprobado |
| WorldRemit | ✅ | CJ Affiliate | MVP — aprobado |
| Western Union | 🟡 | CJ Affiliate ([cj.com](https://www.cj.com/advertiser/western-union)) | MVP — pendiente aprobación (boton activo, link temporal westernunion.com) |
| MoneyGram | 🟡 | FlexOffers + CJ ([flexoffers.com](https://www.flexoffers.com/affiliate-programs/moneygram-international-affiliate-program/)) | MVP — pendiente aprobación (boton activo, link temporal moneygram.com) |

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

> **📋 Inventario completo de servicios externos:** ver [SERVICIOS_EXTERNOS.md](SERVICIOS_EXTERNOS.md) en la raíz del repo. Ahí están todas las cuentas (GitHub, Vercel, Supabase, Upstash, Twilio, Resend, Zoho, Namecheap, GA4, Search Console, redes de afiliados, Payoneer) con plan actual, límites, uso estimado, costo, umbrales de upgrade, dashboards y variables de entorno que dependen de cada una. Este archivo resume el stack; SERVICIOS_EXTERNOS.md es la bitácora operativa.

> **👥 Equipo y escala:** ver [EQUIPO_Y_ESCALA.md](EQUIPO_Y_ESCALA.md) para triggers concretos de cuándo contratar el primer developer (>5K users/mes + >2 hrs/día del founder en bugs, rango **$2-4K/mes part-time LATAM**), cuándo escalar cada servicio del stack (umbrales por usuarios/mes), y análisis de ventana de oportunidad vs competencia (9-12 meses antes de que aparezcan comparadores LATAM-first competitivos). Decisiones de hiring y scaling deben pasar por ese documento — no se toman por corazonada.

### GitHub Secrets (seguridad de credenciales)
- Todas las variables de entorno listadas arriba NUNCA se guardan en el repositorio
- Se guardan en dos lugares:
  - GitHub Secrets (Settings → Secrets and variables → Actions) para que GitHub Actions pueda usarlas si se configura CI/CD futuro
  - Vercel Environment Variables (Project Settings → Environment Variables) para que Vercel las inyecte en build y runtime
- El archivo .env.local solo existe localmente en la máquina del desarrollador — está incluido en .gitignore
- El archivo .env.example se commitea SIN valores reales, solo con los nombres de las variables, para que nuevos colaboradores sepan qué configurar

### Vercel deploy automático
- Rama main del repositorio aneurysoto-pre/preenvios = deploy a producción automático en preenvios.com (post-cutover) + alias canónico `preenvios.vercel.app`
- Cualquier otra rama (feature/*, fix/*, test/*) = preview deployment automático con URL única generada por Vercel (ej. `preenvios-git-<branch>-aneurysoto-pre.vercel.app`)
- **Separación DB producción ↔ preview (desde 2026-04-23, FASE 10 BLOQUE K.1):** `main` deploy escribe en proyecto Supabase `preenvios` (prod, clientes reales); branches de desarrollo escriben en `preenvios-preview` (solo founder + devs). Las 3 env vars de Supabase tienen valores distintos por scope en Vercel. Cambios destructivos en branches ya no pueden corromper data real. Detalle en [LOGICA_DE_NEGOCIO/27_db_preview_vs_produccion.md](LOGICA_DE_NEGOCIO/27_db_preview_vs_produccion.md).
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
- [x] Sección "Tasas de referencia" con tarjetas de bancos centrales — datos de Supabase, tabla tasas_bancos_centrales, API /api/tasas-banco-central, componente TasasReferencia.tsx bilingüe (completado 2026-04-17)

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

> ⚠️ **ESTADO REAL 2026-04-23 — LOS 7 SCRAPERS ESTÁN ROTOS EN PRODUCCIÓN.**
> Los checkboxes `[x]` de esta fase significan que el CÓDIGO existe y fue
> escrito en 2026-04-16. La funcionalidad en producción falló el 2026-04-17
> cuando los operadores cambiaron sus APIs internas (HTTP 401/403/404).
> Decisión 2026-04-23: diferir arreglo hasta post-LLC + aprobación en programas
> de afiliados. Cualquier `[x]` abajo debe re-verificarse antes de confiar en
> él. Plan completo: [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md).
> Resumen ejecutivo: [SCRAPERS_IMPORTANTE.md](SCRAPERS_IMPORTANTE.md) en raíz.

- [ ] Configurar Upstash Redis para cache de precios (diferido — se activa cuando sea necesario)
- [x] Crear scraper para Wise (API semi-pública — más fácil) (completado 2026-04-16, **falla con HTTP 401 desde 2026-04-17** — reemplazar por Wise API pública oficial post-LLC, ver Proceso 28 Fase R1)
- [x] Crear scraper para Ria (completado 2026-04-16, **falla con HTTP 404 desde 2026-04-17** — Proceso 28)
- [x] Crear scraper para Boss Money (completado 2026-04-16 — placeholder, se activa en Fase 4)
- [x] Crear Vercel Cron Job — ejecuta scrapers una vez al día a las 7:00 AM UTC (completado 2026-04-16 — vercel.json con schedule "0 7 * * *", Hobby plan permite 1 cron/día). **Cron corre OK y retorna 200, pero `saved=0` silencioso por scrapers rotos — Proceso 28.**
- [x] Los scrapers guardan resultados en Supabase (completado 2026-04-16, **técnicamente correcto cuando hay data que guardar; desde 2026-04-17 ningún scraper devuelve data — Proceso 28**)
- [ ] Upstash Redis cachea los últimos precios para servir rápido (diferido — se activa cuando sea necesario)
- [x] Crear scraper para MoneyGram (protección media) (completado 2026-04-16, **falla con HTTP 404 desde 2026-04-17** — Proceso 28)
- [x] Crear scraper para Western Union (protección alta — puede requerir proxy) (completado 2026-04-16, **falla con HTTP 403 desde 2026-04-17, Cloudflare bloqueo** — Proceso 28)
- [x] Crear scraper para Remitly (protección alta — puede requerir proxy) (completado 2026-04-16, **falla con HTTP 404 desde 2026-04-17** — Proceso 28)
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
- [x] Crear estructura de blog en Next.js (completado 2026-04-17 — /blog con índice + /blog/[slug] con placeholder)
- [x] Artículo 1: "Cuánto cobra Western Union para enviar dinero a Honduras hoy" (completado 2026-04-17 — placeholder listo, contenido editorial pendiente)
- [x] Artículo 2: "Remitly vs Western Union para enviar a República Dominicana" (completado 2026-04-17 — placeholder listo, contenido editorial pendiente)
- [x] Artículo 3: "La forma más barata de mandar dinero a Guatemala en 2026" (completado 2026-04-17 — placeholder listo, contenido editorial pendiente)
- [ ] Un artículo por corredor por mes mínimo (pendiente — contenido editorial del fundador)
- [x] Configurar sitemap.xml automático (completado 2026-04-17 — incluye blog, wiki, tasa, operadores, legal, calculadora inversa con alternates es/en)
- [x ] Verificar propiedad en Google Search Console (pendiente de acción del usuario con ajsmconsulting) hecho 23/04/2026
- [x] Optimizar Core Web Vitals — verde en PageSpeed (completado 2026-04-17 — font swap, preconnect, dynamic imports, lazy loading, code splitting)
- [x] Crear tabla historial_tasas_publico en Supabase (completado 2026-04-17 — SQL ejecutado en Supabase, tabla activa con índices y RLS)
- [x] Páginas públicas indexadas por Google: preenvios.com/tasa/usd-dop, usd-hnl, usd-gtq, usd-svc, usd-cop, usd-mxn, usd-nio, usd-htg (completado 2026-04-17 — 8 corredores con Recharts, tabla operadores, CTA, Schema.org)
- [x] Cada página muestra tasa actual, gráfica de fluctuación últimos 30 días con Recharts, tabla de los 7 operadores comparados, y CTA al comparador principal (completado 2026-04-17)
- [x] Meta tags optimizados: "Tasa del dólar en República Dominicana hoy — [fecha actualizada]" (completado 2026-04-17)
- [x] Schema.org ExchangeRateSpecification en JSON-LD para rich snippets en Google (completado 2026-04-17)
- [x] Gráficas públicas son activo SEO — indexadas, no detrás de login (completado 2026-04-17)
- [x] Crear una página estática por operador: /operadores/remitly, /wise, /xoom, /ria, /worldremit, /western-union, /moneygram (completado 2026-04-17 — 7 páginas con contenido editorial placeholder, Schema.org Organization)
- [x] Crear versión en inglés de las páginas SEO principales (completado 2026-04-17 — todas las páginas soportan /es y /en via next-intl)
- [x] NO traducir cada artículo del blog automáticamente (completado 2026-04-17 — regla documentada, blog solo tiene placeholders por ahora)
- [x] Keywords SEO en inglés a priorizar para las páginas traducidas (completado 2026-04-17 — documentadas en 4.1.1)
- [x] Meta descriptions, titles y H1 traducidos manualmente (completado 2026-04-17 — traducciones en messages/*.json)
- [x] Crear estructura técnica de wiki educativa en preenvios.com/wiki (completado 2026-04-17 — /wiki con índice + /wiki/[slug] con 10 artículos placeholder)
- [x] Crear índice navegable en /wiki con categorías: Fundamentos, Guías por corredor, Educación financiera (completado 2026-04-17)
- [ ] Navegación lateral persistente con tabla de contenidos del artículo actual y links a artículos relacionados (diferido — se implementa cuando haya contenido real)
- [x] Schema.org Article en JSON-LD en cada artículo para rich snippets en Google (completado 2026-04-17)
- [x] Arrancar con 10 artículos fundacionales escritos manualmente — meta: publicar 1–2 por semana (completado 2026-04-17 — 10 placeholders listos, contenido editorial pendiente del fundador)
- [x] Artículos fundacionales de Fundamentos:
  - [x] Qué es la tasa de cambio mid-market y por qué importa (placeholder 2026-04-17)
  - [x] Diferencia entre tasa y fee — cuál cuesta más realmente (placeholder 2026-04-17)
  - [x] Cómo elegir la mejor remesadora según el monto que envías (placeholder 2026-04-17)
  - [x] Cash pickup vs depósito bancario — cuál me conviene (placeholder 2026-04-17)
  - [x] Qué documentos necesito para enviar dinero desde EE.UU. (placeholder 2026-04-17)
- [x] Artículos fundacionales por corredor (uno por cada corredor activo):
  - [x] Cómo recibir dinero en República Dominicana paso a paso (placeholder 2026-04-17)
  - [x] Qué bancos en Honduras tienen convenio con remesadoras (placeholder 2026-04-17)
  - [x] Cuánto tarda una transferencia a Guatemala realmente (placeholder 2026-04-17)
- [x] Artículos de educación financiera:
  - [x] Impuestos sobre remesas en EE.UU. y en el país receptor (placeholder 2026-04-17)
  - [x] Alertas de tipo de cambio — para qué sirven y cómo usarlas (placeholder 2026-04-17)
- [x] Cada artículo incluye CTA al comparador principal y al formulario de suscripción de alertas gratis (completado 2026-04-17 — CTA al comparador incluido)
- [x] La wiki se versiona en inglés solo cuando el artículo en español supere 500 visitas/mes (completado 2026-04-17 — regla documentada, estructura bilingüe lista)

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

#### 4.1.2 — Páginas editoriales por corredor (MVP: 4 países)
- [x] Crear ruta dinámica app/[locale]/[pais] con generateStaticParams para los 4 corredores del MVP (completado 2026-04-17)
- [x] Página /es/honduras + /en/honduras con hero, tasa actual, comparador, FAQ, bancos, Schema.org (completado 2026-04-17)
- [x] Página /es/republica-dominicana + /en/dominican-republic (completado 2026-04-17)
- [x] Página /es/guatemala + /en/guatemala (completado 2026-04-17)
- [x] Página /es/el-salvador + /en/el-salvador (completado 2026-04-17)
- [x] Comparador reutilizado con prop defaultCorredor preset al corredor del país (completado 2026-04-17)
- [x] Formulario de suscripción AlertaForm integrado en cada página de país (completado 2026-04-17)
- [x] Menú "Corredores" con dropdown en Nav desktop y lista en Nav mobile (completado 2026-04-17)
- [x] Sitemap actualizado con 8 URLs nuevas con hreflang alternates (completado 2026-04-17)
- [x] Schema.org WebPage + BreadcrumbList + FAQPage en cada página (completado 2026-04-17)
- [x] Cross-link bidireccional entre /[pais] (editorial) y /tasa/[pair] (técnica) (completado 2026-04-17)

#### 4.2 — Nuevos corredores
- [x] Agregar corredor USA → Colombia con operadores y afiliados (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [x] Agregar corredor USA → México (completado 2026-04-16 — 7 operadores, tasas estimadas en Supabase)
- [ ] Crear contenido SEO específico por cada nuevo corredor

#### 4.2.1 — Factor valor_afiliado en algoritmo de ranking (2026-04-18)
- [x] Agregar 3 columnas a tabla precios: comision_usd, cookie_dias, trafico_calificable (completado 2026-04-18 — SQL migración 003 pendiente de ejecutar por usuario)
- [x] Implementar calcularValorAfiliado() en lib/ranking.ts con fórmula comision × cookie × tráfico (completado 2026-04-18)
- [x] Nuevos pesos: tasa 35%, valor_afiliado 25%, velocidad 15%, confiabilidad 15%, métodos 10% (completado 2026-04-18)
- [x] Sección "Configuración de afiliado por operador" en panel admin → Tasas con bulk update PATCH /api/admin/precios (completado 2026-04-18)
- [x] Retrocompatibilidad: si las columnas son null, se usan defaults (comision=0, cookie=30, trafico=1.0) (completado 2026-04-18)

#### 4.2.2 — Rediseño Comparador simplicidad radical (2026-04-18, revertido el mismo día)
Primer intento: se rediseñó la tarjeta estilo trivago (logo izq, RECIBEN grande a la derecha, score coloreado verde/amarillo/rojo, botón "Enviar →"). Resultado: el usuario pidió revertir porque rompía la línea gráfica original. Ver 4.2.3 para el diseño final.

#### 4.2.9 — Banderas PNG (flagcdn) en calculadora inversa + Nav dropdowns (2026-04-18)
Extensión del mismo bug de Windows que afectaba al selector de idioma (4.2.7). Los emoji flags 🇩🇴 🇭🇳 🇬🇹 🇸🇻 🇨🇴 🇲🇽 🇳🇮 🇭🇹 renderizan como "DO HN GT SV CO MX NI HT" en Windows porque el OS no tiene glifos para Regional Indicator Symbols. El bug se repetía en 3 lugares además del selector de idioma.
- [x] `/es/calculadora-inversa` tabs: reemplazado campo `bandera` emoji por `codigo_pais` (ISO 3166-1 alpha-2), renderizado como `<img src="https://flagcdn.com/w40/{codigo_pais}.png">`. 22×15px con `rounded-[2px]` + sombra sutil (completado 2026-04-18)
- [x] Nav desktop corridor dropdown: emoji `{p.bandera}` reemplazado por `<img>` con flagcdn, 22×15px (completado 2026-04-18)
- [x] Nav mobile menu corridor list: mismo cambio, 26×18px (un poco más grande porque el menú mobile tiene más aire) (completado 2026-04-18)
- [x] Comparador hero search (ya usaba flagcdn.com desde el MVP — no cambia) (completado 2026-04-18)

**Regla consolidada del proyecto:** NO usar flag emojis en ningún lugar del sitio. Las opciones aprobadas son:
1. **PNG de flagcdn.com** (`https://flagcdn.com/w40/{iso}.png`) — para banderas dentro de listas largas y dropdowns de corredores donde se usa de forma repetitiva
2. **SVG inline** (como `<FlagUS />` y `<FlagES />` en Nav) — para casos puntuales (p.ej. selector de idioma) donde no hay ISO code o queremos cero network requests

Los `bandera: '🇸🇻'` que quedan en constantes JS (`CORREDORES` de Comparador, `PAISES_MVP` en `lib/paises.ts`) se conservan por compatibilidad pero NO deben renderizarse en UI. Son datos, no elementos visuales.

#### 4.2.8 — CTA scrollTo con offset + calculadora inversa a 4 MVP (2026-04-18)
**CTA "Comparar ahora →"**: el botón del bloque "Listo para enviar más por menos?" era un `<a href="#comparar">`. Problemas:
1. `#comparar` apunta a la sección de RESULTADOS (conditional: solo existe cuando `montoNum > 0`). Un usuario fresco al hacer click scrolleaba a nada
2. Aunque hubiera resultados, el header fixed (72px) ocultaba el top del destino

Fix aplicado:
- [x] Sección del hero + search card en `components/Comparador.tsx` ahora tiene `id="calculadora"` + `data-section="calculadora"` como fallback (completado 2026-04-18)
- [x] CTASection convertido de `<a>` a `<button>` con `onClick={scrollToCalculator}`. El handler hace `document.getElementById('calculadora') || document.querySelector('[data-section="calculadora"]')` → calcula posición con `getBoundingClientRect().top + pageYOffset - 80` y llama `window.scrollTo({ top, behavior: 'smooth' })`. 80px de offset para compensar el header fixed de 72px + 8px de aire (completado 2026-04-18)
- [x] Footer link "Destinos" actualizado de `/${locale}/#comparar` a `/${locale}/#calculadora` — antes el link del footer tenía el mismo bug (scrolleaba a sección oculta) (completado 2026-04-18)
- [x] En páginas de país (/honduras, /guatemala, /el-salvador, /republica-dominicana) el botón funciona igual porque ambas rutas renderizan el mismo `<Comparador />` que expone `id="calculadora"` (completado 2026-04-18)

**Calculadora inversa (`/[locale]/calculadora-inversa`)**: se alinea con el catálogo MVP — debe mostrar los mismos corredores que el comparador principal.
- [x] `CORREDORES` array ajustado a los corredores MVP vigentes (completado 2026-04-18)
- [x] Tabs con `flex-wrap` para que los botones se apilen bien en mobile <375px si hiciera falta (completado 2026-04-18)
- [x] El Salvador con tasa=1 (dolarizado) en la fórmula `(montoNum / p.tasa) + p.fee` produce `monto + fee`, que es semánticamente correcto (lo que enviaron = lo que recibieron + comisión) (completado 2026-04-18)

**Regla del proyecto (actualizada 2026-04-22):** la calculadora inversa, el buscador del hero, las páginas editoriales por país y `/tasa/[pair]` públicas exponen los 6 corredores MVP activos (HN, DO, GT, SV, CO, MX). Cualquier corredor fuera de ese conjunto no aparece en UI pública ni en el código de la aplicación. Ver sección "Integraciones futuras / alcance post-MVP" para la política de expansión.

#### 4.2.7 — Banderas SVG en selector idioma + círculos Steps reducidos (2026-04-18)
- [x] Selector de idioma reemplaza emojis 🇺🇸/🇪🇸 por SVGs inline. Motivo: Windows NO renderiza flag emojis — los muestra como los dos Regional Indicator letters ("us", "es") lo cual se veía "us English" con "us" minúsculas como texto suelto. Se definen 2 componentes locales en `components/Nav.tsx`: `<FlagUS />` (13 barras rojas + cantón azul sobre blanco, viewBox 60×30) y `<FlagES />` (rojo-amarillo-rojo horizontal, viewBox 60×40). Ambos con `rounded-[2px]` + sombra sutil para integrarse al diseño. Se usa en desktop y mobile menu (completado 2026-04-18)
- [x] Regla del proyecto actualizada: el proyecto usa **iconos lucide-react para iconos de UI, pero banderas SVG inline para flags de país/idioma**. Evitar flag emojis porque Windows los renderiza como letras (completado 2026-04-18)
- [x] Círculos de la sección "3 pasos" reducidos a la mitad: de `w-24 h-24` (96px) a `w-12 h-12` (48px). Iconos lucide internos bajan de `size={34}` a `size={20}`. Badge numérico de `w-8 h-8 text-sm` a `w-5 h-5 text-[11px]`. Sombra más sutil. Margen inferior `mb-6` → `mb-4`. Línea punteada horizontal baja de `top-11` (44px = centro del círculo viejo) a `top-6` (24px = centro del nuevo). Los círculos ahora acompañan el texto sin dominarlo visualmente (completado 2026-04-18)

#### 4.2.6 — Activación afiliado Western Union y MoneyGram (2026-04-18)
Contexto: ambos operadores SÍ tienen programa de afiliados público — investigación previa era incorrecta al marcarlos "sin programa público". WU es aplicable via CJ Affiliate (también conocido como Commission Junction) y MoneyGram via FlexOffers + CJ. Se activan para que el botón "Ver en sitio" gris pase a "Enviar ahora" verde como los demás. Mientras la aprobación de cuenta está pendiente, el link apunta al dominio público sin tracking ID.
- [x] Tabla `precios` en Supabase: `afiliado=true` y `link='https://www.westernunion.com'` para WU en los 8 corredores; `link='https://www.moneygram.com'` para MG (completado 2026-04-18 — SQL migración 005 pendiente de ejecutar por usuario)
- [x] Estado de ambos operadores en CONTEXTO_FINAL pasa de "❌ Sin programa público / MVP (referencia)" a "🟡 pendiente aprobación (boton activo, link temporal dominio público)" (completado 2026-04-18)
- [x] Ranking: ambos operadores vuelven a puntuar en el factor `valor_afiliado` usando los valores que ya estaban cargados en la migración 003 (WU: comision $10, cookie 30, tráfico 1.0 → valor_bruto 10; MG: $5 × 30 × 1.0 → valor_bruto 5). Antes aportaban 0 al score por tener `afiliado=false` (completado 2026-04-18)
- [x] Seed scripts `scripts/seed.mjs` y `scripts/seed-new-corridors.mjs` actualizados para consistencia en re-ejecuciones (completado 2026-04-18)
- [x] Página `/como-ganamos-dinero` actualizada: WU y MG dejan de aparecer como "no tienen programas de afiliados públicos" y se documenta su estado pendiente con las redes correspondientes (completado 2026-04-18)
- [x] Migración 005 `supabase/migrations/005_activate_wu_mg_affiliate.sql` copy-paste ready para ejecutar en Supabase SQL Editor (completado 2026-04-18)

**Bug importante descubierto el 2026-04-18:** los scrapers `lib/scrapers/moneygram.ts` y `westernunion.ts` hardcoded `afiliado: false, link: ''`. Cada corrida de cron revertía SQL 005 via upsert. Fix aplicado: scrapers ahora hardcoded `afiliado: true` con link al dominio público. Detalle en TROUBLESHOOTING/26.

**Acción pendiente del usuario (NO es código):**
1. Ejecutar SQL 005 en Supabase SQL Editor — RE-EJECUTAR si ya se había ejecutado (el scraper lo revirtió entre tanto). Es idempotente, seguro
1b. Verificar en Supabase: `SELECT operador, afiliado FROM precios WHERE operador IN ('westernunion','moneygram') LIMIT 4` — debe mostrar afiliado=true
2. Aplicar a CJ Affiliate como publisher y solicitar acceso al programa Western Union
3. Aplicar a FlexOffers (y/o CJ) para MoneyGram
4. Cuando las cuentas sean aprobadas: reemplazar el link `https://www.westernunion.com` por el link con tracking ID (via `/es/admin` → Tasas, o UPDATE SQL). Mismo para MoneyGram

**Nota operativa:** mientras los links no tengan tracking ID, los clicks NO generan comisión. Es un tradeoff aceptado: perder atribución a cambio de botones activos y mejor UX (evita el "callejón sin salida" del botón gris que suele generar bounces).

#### 4.2.5 — Pulido UI fase lanzamiento (2026-04-18)
Fase de ajustes cosméticos y SEO tras el rediseño del Comparador y las páginas institucionales.
- [x] Eliminado todo rastro del fundador (Aneury Soto) de `/nosotros`. La página ahora es **anónima — solo marca "Preenvíos"**. Se removió la sección "El fundador" completa (avatar con iniciales AS, nombre y bio). Las claves `nosotros.founderTitle`, `founderName`, `founderBio` fueron eliminadas de `messages/es.json` y `messages/en.json`. Regla del proyecto: NUNCA añadir nombre personal ni foto del fundador a /nosotros (completado 2026-04-18)
- [x] Instalado `lucide-react@^0.542.0`. Emojis 💰 ⚡ 🔒 de la sección "Por qué PreEnvios" reemplazados por iconos SVG: `DollarSign`, `Zap`, `ShieldCheck`. Color heredado de la clase contenedora vía `currentColor` (completado 2026-04-18)
- [x] Círculos 1-2-3 de la sección "3 pasos" rediseñados: ahora son círculos gradientes de 96px con icono lucide (`Search`, `BarChart3`, `Send`) en blanco + número pequeño en badge blanco con borde g200 en esquina superior derecha. Mantiene la línea punteada entre círculos (completado 2026-04-18)
- [x] Selector de idioma con bandera: 🇺🇸 English (cuando el sitio está en ES y ofrece cambiar a EN) y 🇪🇸 Español (cuando está en EN). Aplicado en desktop y mobile menu (completado 2026-04-18)
- [x] Timestamp dinámico "Tasas actualizadas hace X min/horas" como badge verde animado (punto pulsante) arriba del listado de resultados. Tick cada 30s para re-renderizar el label sin volver a fetch-ear la API (completado 2026-04-18)
- [x] Footer reorganizado de 3 a 4 columnas de contenido (+ brand): Producto · **Recursos** · Empresa · Legal. Nueva columna Recursos contiene Guías (/wiki), Blog, Calculadora inversa y Remesadoras (operadores/remitly) (completado 2026-04-18)
- [x] Meta descriptions específicas por página: `/` (home con generateMetadata bilingüe), `/[pais]` (ya tenía), `/nosotros` (bilingüe con canonical y alternates), `/contacto` (bilingüe), `/wiki` (bilingüe), `/blog` (bilingüe), `/operadores/[slug]` (bilingüe dinámico por operador). "Cómo funciona" y "FAQ" no son páginas separadas — son anchors en home, heredan metadata del home (completado 2026-04-18)
- [x] Página `/wiki` con alineación central: el tag, título y fecha están centrados horizontalmente. El cuerpo del contenido mantiene alineación left-aligned para legibilidad. Cambio aplicado en `components/LegalPage.tsx` → afecta a las 11 páginas que usan el wrapper (completado 2026-04-18)
- [x] CTA "Comparar ahora →" arreglado para mobile: padding reducido en viewports chicos (px-5 sm:px-8), flecha SVG separada de texto con gap-1.5, `whitespace-nowrap` para evitar wrap feo, contenedor con padding sm responsive (completado 2026-04-18)

#### 4.2.4 — Páginas institucionales + header/footer globales (2026-04-18)
Motivo: varias páginas legales no tenían el nav global ni el footer — se veían desconectadas del resto del sitio. A la vez faltaban /nosotros y /contacto que aparecían en footer pero no existían. Se unifica la experiencia: header completo (logo + Destinos + Cómo funciona + FAQ + Contacto + ES/EN) y footer en 3 columnas en toda la navegación pública.
- [x] `components/LegalPage.tsx` ahora renderiza `<Nav />` arriba y `<Footer />` abajo en lugar del mini-header custom. Un solo cambio propaga header/footer globales a las 11 páginas que usaban el wrapper (terminos, privacidad, como-ganamos-dinero, metodologia, uso-de-marcas, disclaimers, blog, wiki, operadores, wiki/[slug], blog/[slug]) (completado 2026-04-18)
- [x] Nav: elimina "Comparar", agrega "Contacto". Orden final: Destinos (dropdown) · Cómo funciona · FAQ · Contacto · ES/EN. Los anchors `#como` y `#faq` se prefijan con `/${locale}` cuando el usuario NO está en la home, para que navegue y scrollee (completado 2026-04-18)
- [x] Footer reorganizado de 4 columnas a 3 (+ brand): Producto (Destinos, Cómo funciona, FAQ) · Empresa (Nosotros, Contacto, Cómo ganamos dinero) · Legal (Términos, Privacidad, Disclaimers, Uso de marcas, Metodología) (completado 2026-04-18)
- [x] Nueva página `/es/nosotros` y `/en/nosotros` con hero pequeño, Nuestra historia, Nuestra misión, 4 valores (transparencia, independencia, simplicidad, gratis), sección cómo ganamos dinero con link a /como-ganamos-dinero, sección del fundador con avatar placeholder (iniciales AS) y bio de Aneury Soto, CTA a /contacto (completado 2026-04-18)
- [x] Nueva página `/es/contacto` y `/en/contacto` con formulario (nombre, email, asunto dropdown de 4 opciones, mensaje) + sidebar con contact@preenvios.com, partnerships@preenvios.com, tiempo de respuesta y link a FAQ. Al enviar muestra pantalla de éxito (completado 2026-04-18)
- [x] Tabla Supabase `contactos` con columnas id, nombre, email, asunto (CHECK: general/rate/partnership/other), mensaje, idioma, created_at, respondido, respondido_at, notas_admin. RLS: niega cualquier SELECT/INSERT/UPDATE/DELETE del anon key — solo service_role (API route) puede insertar. SQL: `supabase/migrations/004_contactos.sql` (completado 2026-04-18 — SQL pendiente de ejecutar por usuario)
- [x] API route `/api/contactos` POST con validación server-side (regex email, length nombre 2-120 / mensaje 10-4000, asunto whitelist, idioma normalizado a es/en) (completado 2026-04-18)
- [x] Evento GA4 `contacto_enviado` disparado al recibir status 200 (completado 2026-04-18)
- [x] Espaciado entre sección "Por qué Preenvíos" y "Cómo funciona" reducido: WhySection `pt-90 pb-50`, StepsSection `pt-50 pb-90`. Gap total 100px en lugar de 180px (completado 2026-04-18)
- [x] Sitemap actualizado con /disclaimers, /nosotros, /contacto en es/en con priority 0.3 (legal) y 0.5 (institucional) (completado 2026-04-18)
- [x] Traducciones `nosotros.*` y `contacto.*` en es.json y en.json + `nav.contact` (completado 2026-04-18)

**SQL pendiente de ejecutar por el usuario en Supabase SQL Editor:** `supabase/migrations/004_contactos.sql`. Sin ejecutarlo, el formulario de /contacto devolverá 500 al insertar.

#### 4.2.3 — Restauración del diseño original del Comparador + score discreto (2026-04-18)
Motivo: el rediseño trivago-style del 4.2.2 fue considerado "feo" comparado con el HTML de preenvios.com. Se volvió al diseño exacto del index.html MVP, añadiendo únicamente el Preenvíos Score como línea pequeña debajo del rating.
- [x] Card reinstaurada con `grid-template-columns: 1.4fr 1fr 1fr 1fr auto` (brand | Tasa | Comisión | Reciben | botón), padding 22px 26px, border-radius 22px (completado 2026-04-18)
- [x] Logo 48×48 redondeado 10px con fondo g50 y borde g200, imagen interna 36×36 (completado 2026-04-18)
- [x] Nombre del operador 16px weight 800, meta con ★★★★★ amarillo + rating + número de opiniones (completado 2026-04-18)
- [x] Tarjeta `.best` (posición 0): borde verde + gradiente blanco → verde muy claro + badge "★ MEJOR OPCIÓN" esquina superior derecha (completado 2026-04-18)
- [x] Tarjeta `.second` (posición 1): borde azul + gradiente + badge "SEGUNDA OPCIÓN" + botón azul (completado 2026-04-18)
- [x] Tarjeta `.fast` (cuando sort=fastest, posición 0): borde naranja + badge "⚡ MÁS RÁPIDO" (completado 2026-04-18)
- [x] Tarjeta `.cheap` (cuando sort=cheapest, posición 0): borde verde oscuro + badge "💰 MENOR COMISIÓN" (completado 2026-04-18)
- [x] Tabs de ordenamiento restaurados (pill container blanco con tres botones: Mejor tasa / Más rápido / Menor comisión). El activo va con fondo negro ink y texto blanco — igual que el HTML (completado 2026-04-18)
- [x] Lógica real de sort implementada: `best` usa el ranking por Preenvíos Score, `fastest` ordena por VELOCIDAD_RANK (Segundos > Minutos > Horas > Días) con tie-breaker por score, `cheapest` ordena por fee ascendente con tie-breaker por score (completado 2026-04-18)
- [x] Preenvíos Score agregado como única adición al diseño original: línea pequeña 11px weight 700 color azul, 3px por debajo del rating, formato "Preenvíos Score X/100" (completado 2026-04-18)
- [x] Botón CTA vuelto a "Enviar ahora" (original), estilo `.cmp-btn` azul con hover azul-oscuro y translateX(3px). Para operadores sin afiliado botón gris `.cmp-btn-ref` "Ver en sitio" (completado 2026-04-18)
- [x] Disclaimer inferior amarillo estilo original (icono SVG + "Importante: ..." + link "Ver disclaimers completos →" a /disclaimers) (completado 2026-04-18)
- [x] Línea gris "ranking-note" arriba de la lista con `disclaimers.d3` + link "Saber más" a /como-ganamos-dinero (original del HTML) (completado 2026-04-18)
- [x] Selector de método de entrega sigue oculto (no existía en el HTML original). Infra METODOS/selectMetodo/metodo_entrega intacta para reactivar post-lanzamiento (completado 2026-04-18)
- [x] Responsive idéntico al HTML: grid colapsa a 2 columnas a <980px, brand ocupa ambas columnas, botón full-width; a <640px logo 42×42 y nombre con ellipsis (completado 2026-04-18)
- [x] CSS portado del index.html a `app/globals.css` bajo prefijo `.cmp-*` para evitar colisiones con Tailwind (completado 2026-04-18)

**Regla:** Lo que venga sobre el comparador en el futuro debe preservar la línea gráfica del HTML original. Solo adiciones discretas tipo el Score. No reescribir layout.

**Features diferidas a post-lanzamiento:**
Selector de método de entrega (Retiro efectivo, Domicilio, Billetera móvil): nunca existió en el HTML original y no se implementa en Next.js hasta que los scrapers capturen tasas reales por método para los 4 corredores del MVP con al menos 3 operadores por método. Infra (constante METODOS, estado `metodo`, campo `metodo_entrega` en tabla `precios`, scrapers, parámetro `metodo` en `/api/precios`) permanece lista para activar.

#### 4.3 — Publicidad directa con bancos
- [ ] Reunión con Banreservas NY (Washington Heights)
- [ ] Propuesta: widget de tasa de cambio patrocinado en el landing
- [ ] Acuerdo de publicidad directa con Viamericas ($500–$1,500/mes)
- [ ] Contactar Banco Popular RD para widget de tasa
- [ ] Contactar bancos centroamericanos para acuerdos similares

#### 4.4.A — Alertas gratuitas y captura de email (lead-gen) — se construye ANTES que el panel premium
Propósito: capturar emails de usuarios no pagos para newsletter con links de afiliado. Tecnología: Supabase (tabla suscriptores_free), Resend (envío de emails), Next.js API Routes (endpoint de suscripción), double opt-in para cumplir CAN-SPAM.

- [x] Crear tabla suscriptores_free en Supabase con campos email, corredor_favorito, idioma (es/en), fecha_alta, confirmado, token_confirmacion (completado 2026-04-17 — SQL ejecutado en Supabase, tabla activa con índices y RLS)
- [x] Formulario de suscripción inline en cada página de corredor ("Recibe la tasa de hoy cada mañana en tu email") (completado 2026-04-17)
- [x] Flujo de double opt-in con Resend — email de confirmación con token único antes de activar suscripción (completado 2026-04-17)
- [x] Email diario automático con la tasa del día del corredor elegido + link afiliado al mejor operador (cron en Vercel a las 7 AM hora EST) (completado 2026-04-17 — integrado en cron existente /api/scrape)
- [x] Newsletter semanal con el mejor operador de la semana por corredor — misma infraestructura Resend (completado 2026-04-17 — se envía los lunes)
- [x] Templates de email en Resend separados por idioma — el usuario recibe emails en español o inglés según la columna idioma de su registro (completado 2026-04-17)
- [x] Página de baja (unsubscribe) obligatoria por ley CAN-SPAM con token único en cada email, renderizada en el idioma del email original (completado 2026-04-17)
- [x] Endpoint API /api/suscripcion-free para alta y baja (completado 2026-04-17)
- [x] Evento GA4 suscripcion_free cuando el usuario confirma (medir conversión del landing) (completado 2026-04-17)

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

### Fase 7 — Sistema de defensa en profundidad (defense-in-depth) — PRE-LANZAMIENTO

**Filosofía:** en 2026 los sistemas serios no se construyen con una sola línea de defensa. Se diseñan con capas cruzadas donde cada una puede ser el fallback de las otras. Análogo a salir a la calle con $100 cash + tarjeta de crédito como backup + celular con Apple Pay como backup de la tarjeta — si uno falla, los otros cubren.

**Objetivo:** PreEnvios debe tener validación arquitectónica en los bordes de entrada de datos + 5 agentes activos independientes monitoreando + monitoreo pasivo estándar (BetterStack + Sentry) + founder como última línea. **8 capas cruzadas**: si 7 fallan, la 8va te avisa.

**Timing (decisión 2026-04-21 + ajuste 2026-04-23):** los agentes 1, 2, 3, 4 se construyen **antes del DNS cutover**. El **Agente 5 se difirió a post-lanzamiento** (decisión 2026-04-23) por 3 blockers: setup GCP/GA4 Data API de 2-3h inevitable, y sobre todo porque el agente mide "caída vs baseline 7 días" — pre-launch no hay baseline real → cualquier threshold es guess → falsos positivos garantizados. Interim solution activa: GA4 Custom Alerts built-in cubre ~80% del valor sin código. Agente 5 real se construye cuando haya 4+ semanas de tráfico acumulado post-cutover. Razón del ajuste: el founder quiere defensa completa desde el día 1 pero NO construir agentes que solo pueden calibrarse correctamente después, eso es trabajo duplicado (construir + re-construir thresholds). "LANZA BIEN, NO LANZES RÁPIDO".

**Costo adicional total: $0** (todo dentro de planes existentes). **Tiempo total: 20-30 hrs** de implementación por Claude Code (ejecutor) + supervisión del founder.

#### Nivel arquitectónico (write-boundary validation)

- [x] **Agente 1 — Validador de ingress en scrapers (BLOQUEANTE PRE-LANZAMIENTO) — completado 2026-04-22.** Antes de que `savePrices()` guarde en Supabase, validatePrice() evalúa 7 reglas: operador en whitelist 7 MVP, corredor en whitelist 6 MVP, metodo_entrega en enum {bank, cash_pickup, home_delivery, mobile_wallet}, velocidad en enum {Segundos, Minutos, Horas, Días}, fee ∈ [0, 50] USD, tasa > 0, tasa dentro de ±10% del banco central (fuente: tabla `tasas_bancos_centrales` cacheada por batch + fallbacks hardcoded). Si falla, rechaza → no entra a DB → log en tabla `scraper_anomalies` (migración 007) → Sentry capture con tag `scraper_anomaly`. 3+ anomalías consecutivas del mismo par (operador, corredor) en la última hora → `reportScraperFailure` marca precios stale. Patrón serverless-safe — consulta a scraper_anomalies en lugar de contador in-memory. Firma pública de savePrices() inalterada. Implementación: `lib/scrapers/validator.ts`, integrado en `lib/scrapers/base.ts`. Doc completa en `LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md`.

#### Nivel agentes activos (observadores cruzados post-launch)

- [ ] **Agente 2 — Data quality agent.** Cada hora consulta `/api/precios` para los 4 corredores MVP. Valida: devuelve 7+ operadores, sin campos null, rates dentro de rangos esperados. Alerta si anomalía. Implementación: Vercel Cron + 4-6 hrs build. **Target: pre-launch próximos días.** Arranca con thresholds conservadores, se re-tunean con data de primeras 2 semanas post-launch.

- [ ] **Agente 3 — Database health agent.** Cada 30 min consulta Supabase directo: row counts por tabla (`precios`, `contactos`, `suscriptores_free`, `admin_login_attempts`). Alerta en 2 escenarios: (a) crecimiento súbito >5x del baseline (posible bot attack en suscripciones), (b) pérdida súbita >30% de rows (posible accidente o corrupción). Implementación: Supabase Edge Function + 3-4 hrs build. **Target: pre-launch próximos días.** Baselines iniciales educated guess, se ajustan con data real.

- [ ] **Agente 4 — E2E smoke test agent.** Cada 15-30 min corre Playwright headless que: navega a preenvios.com, selecciona corredor, escribe monto, click "Comparar", verifica que aparecen cards de remesadoras, click primer CTA, verifica que abre URL afiliada. Repite en viewport mobile + en `/es` y `/en`. Alerta si cualquier paso falla. Detecta lo que BetterStack no: botones rotos en mobile, CSS que colapsa en cierta resolución, routing que devuelve 200 pero render vacío. Implementación: GitHub Actions + Playwright + Chromium (solo) + 6-8 hrs build. **Target: pre-launch — inmediatamente después del Agente 3 cuando llegue el momento.** Script se construye ahora apuntando a `preenvios.vercel.app` (alias de prod); se cambia la URL target a `preenvios.com` el día del DNS cutover.

  **Análisis de dependencia con scrapers (2026-04-23):** 9 de 11 checks del Agente 4 son 100% independientes de scrapers (home carga, routing, mobile menu, cookie banner, dropdowns, input validación, CTA afiliada link). Los 2 restantes (cards aparecen, calculadora inversa) dependen de que la DB tenga rows en `precios` — NO dependen de que esas rows sean frescas. Hoy prod tiene 42 filas stale pero presentes → los tests pasan. El Agente 4 NO es defectuoso por scrapers rotos. Si algún día `precios` queda vacío, tests fallan — eso sería bug real que queremos detectar.

  **Diseño desacoplado:** los tests usan threshold flexible `E2E_MIN_CARDS` via env var. Pre-reactivación scrapers: `E2E_MIN_CARDS=1` (permissive, solo detecta "comparador vacío"). Post-reactivación: subir a `E2E_MIN_CARDS=7` via 1 edit de env var sin tocar tests.

  **Cadencia 15 min vs GitHub Actions free tier 2000 min/mes:** decisión pendiente — 15 min cabe solo si cada run queda <40s post-cache de browsers. Si se extiende, bajar a 30 min (48 runs/día × 1min ≈ 1440 min/mes, cabe). Alternativa: upgrade GitHub Pro ($4/mes).

  **Commits planeados (5):** (1) setup Playwright + config + test home; (2) flow completo comparador × 4 combos (ES/EN × desktop/mobile); (3) endpoint `/api/agents/e2e-alert` + lib; (4) workflow `.github/workflows/agent-e2e.yml`; (5) doc Proceso 30.

- [ ] **Agente 5 — Business metrics agent. DIFERIDO A POST-LANZAMIENTO (decisión 2026-04-23).** Cada hora consulta GA4 Data API + Supabase: `click_operador` por operador/corredor, `suscripcion_alertas` (tabla `alertas_email`), pageviews por ruta. Alerta si alguna métrica cae >30% vs baseline 7 días. Detecta regresiones silenciosas donde el sitio está "arriba" pero el embudo se rompió (ej. link afiliado cambió y nadie se dio cuenta). Implementación: Vercel Cron + GA4 Data API + 4-6 hrs build + **2-3 hrs de setup previo GA4 Data API (service account GCP + credenciales OAuth)**. Estimación revisada total: **7-8 hrs** (no 4-6 hrs).

  **Por qué diferido (2026-04-23):** 3 blockers identificados antes de poder construir:
  1. ~~Tabla `suscriptores_free` inexistente~~ ✅ RESUELTO — la tabla real es `alertas_email`, formalizada en migración 010 (commit `1c25b66` del 2026-04-23).
  2. **GA4 Data API requiere setup GCP no trivial:** service account, credenciales OAuth2, permisos en la propiedad GA4. ~2-3h de setup previo, inevitable.
  3. **Baseline inexistente pre-launch:** el agente alerta si métrica cae >30% vs baseline 7 días, pero pre-launch no hay tráfico real → baseline inexistente → threshold arbitrario → falsos positivos/negativos garantizados. No tiene sentido construir hasta tener data real.

  **Interim solution activa (2026-04-23):** GA4 Custom Alerts built-in (feature gratis nativa de GA4) cubren ~80% del valor del agente sin código. Configurar en Analytics → Admin → Custom Alerts. Alertas iniciales sugeridas (thresholds permissive hasta tener baseline real):
  - `click_operador` — cae >70% semana vs semana (semanal).
  - `comparar_click` — cae >70% semana vs semana (semanal).
  - `contacto_enviado` — sube >5x sobre promedio 7 días (diaria) — anti-spam.
  - `suscripcion_alertas` — sube >10x sobre promedio 7 días (diaria) — anti-bot.
  - `page_view` — cae >80% día vs día (diaria) — detecta caída masiva de tráfico.

  Post-launch con 7 días de baseline: ajustar thresholds a valores estándar (30% caídas, 2x spikes).

  **Criterio para activar el Agente 5 full (no solo GA4 Alerts):**
  - [ ] 4+ semanas post-DNS cutover con tráfico acumulado.
  - [ ] Baseline GA4 estable confirmado (varianza diaria <20% en conditions normales).
  - [ ] GA4 Custom Alerts insuficientes — ej. necesitás correlacionar GA4 + Supabase (click por corredor específico × operador × día) que GA4 Alerts no soporta.
  - [ ] Setup GCP + service account ejecutado.

  Si esos 4 criterios se cumplen, construir el Agente 5 full: ~7-8h distribuidas en ~5 commits (setup credenciales + lib + endpoint `/api/agents/business-metrics` + workflow pg_cron + doc Proceso 31). Mismo patrón que Agente 3 (pg_cron + pg_net → endpoint Next.js → Sentry con fingerprint).

  **Doc operacional:** el Proceso 31 (pendiente) documentará los pasos concretos de setup GCP + configuración de GA4 Custom Alerts interim + migración a agente full cuando llegue el momento.

#### Nivel monitoreo pasivo (observabilidad estándar)

- [x] BetterStack uptime (planeado activar el día del DNS cutover — ver AUDITORIA_DE_SEGURIDAD/monitoring.md Fase 1)
- [x] Sentry error tracking — DSN activo en Vercel (Production/Preview/Development). Smoke test end-to-end 2026-04-22 capturando eventos `Error` automáticos + `Sentry.captureMessage('scraper_anomaly', ...)` del Agente 1. Proyecto Sentry: `javascript-nextjs`. Cierra Fase 2 monitoring.

#### Nivel auditoría periódica

- [x] Primera auditoría OWASP (completada 2026-04-19, ver AUDITORIA_DE_SEGURIDAD/01_auditoria_2026_04_19.md)
- [ ] **Auditoría recurrente cada 60-90 días post-launch.** Re-ejecutar el checklist OWASP Top 10, revisar nuevas vulnerabilidades en dependencias (npm audit, Dependabot), reviewar incidentes Sentry del período. Formato: misma plantilla del 01_auditoria.
- [ ] Auditoría externa profesional anual (post-revenue estable, ~$500-1,500 cada una)

#### Gaps conscientes que NO cubre este stack

- **UX bugs en dispositivos raros** — ej. un iPhone SE con iOS 16 que rompe la calculadora. Los agentes chequean viewports comunes, no todos. **Mitigación:** rutina humana del founder o empleado = usar el sitio como usuario real 1x/semana en 3 dispositivos distintos.
- **Regulación/mercado externo** — cambios de política de Google, de FTC, de Meta, nuevo competidor fuerte. Ningún agente lo ve. **Mitigación:** lectura semanal del founder en Google Alerts para keywords del nicho.

#### Timing de implementación (actualizado 2026-04-23)

| Agente | Cuándo | Estado actual | Notas |
|--------|--------|---------------|-------|
| 1 (validador ingress) | ✅ Pre-launch — completado 2026-04-22 | Operativo (migración 007 + smoke test 2026-04-23 OK) | Thresholds ya tuneados con tasa banco central. Activo cuando scrapers vuelvan a escribir. |
| 2 (data quality) | Pre-launch | Pausado — depende de scrapers funcionando | Alerta permanente con scrapers rotos (data stale) → sin valor hasta reactivación post-LLC (Proceso 28). |
| 3 (DB health) | ✅ Pre-launch — activado 2026-04-23 en prod | Cron `*/30` activo, primera corrida exitosa pendiente validación | Doc Proceso 29. Thresholds absolutos v1, migran a ratios post-7-días de baseline. |
| 4 (E2E smoke) | Pre-launch — próximo en roadmap | Pendiente — 6-8h de trabajo en 5 commits | Diseño desacoplado de scrapers via env var `E2E_MIN_CARDS`. Análisis de dependencia confirma 9/11 tests independientes. |
| 5 (business metrics) | **POST-lanzamiento** | Diferido — 3 blockers (ver definición arriba) | Interim: GA4 Custom Alerts built-in cubren ~80% del valor. Activar Agente 5 full cuando: 4+ semanas post-cutover con tráfico acumulado + baseline estable + Custom Alerts insuficientes. |

**Decisión actualizada (2026-04-23):** agentes 1, 3 completados. Agentes 2 y 4 pre-launch, agente 5 post-lanzamiento. No se construye el 5 pre-launch porque cualquier threshold es guess sin data real (construcción + reconstrucción = trabajo duplicado). Interim con GA4 Alerts built-in.

Cada agente al implementarse se documenta en `LOGICA_DE_NEGOCIO/` (ej. `24_agente_validador_ingress.md`, `29_agente_db_health.md`). El doc sigue al código, no al revés. Proceso 31 para Agente 5 se escribe cuando se active el agente real (no ahora — sería doc hipotético sin implementación).

---

### Fase 8 — Expansión de catálogo pre-lanzamiento

**Contexto (2026-04-21):** la fecha de lanzamiento se movió a flexible. Mejor lanzar con catálogo más amplio y pulido que con 4 corredores. Se agregan México y Colombia al catálogo público ANTES del DNS cutover — ya que no hay fecha fija, conviene aprovechar el runway (espera de LLC + Payoneer) para maximizar el valor del lanzamiento.

**México y Colombia al catálogo público MVP:**

- [x] Scrapers de los 7 operadores ya incluyen `corredor=mexico` y `corredor=colombia` en su array CORREDORES (remitly, wise, xoom, ria, worldremit, westernunion, moneygram). Validación con data real se verifica tras primer cron en smoke test (completado 2026-04-21). **⚠️ Los 7 scrapers están rotos en prod desde 2026-04-17 — MX/CO tampoco validados aún con data real. Ver Proceso 28.**
- [x] Agregado al array `CORREDORES` en `components/Comparador.tsx` con aliases (completado 2026-04-21)
- [x] Agregado a `lib/paises.ts` (`PAISES_MVP`) — propaga auto a Nav dropdown, TasasReferencia, sitemap, páginas editoriales dinámicas (completado 2026-04-21)
- [x] Agregado a `app/[locale]/calculadora-inversa/content.tsx` (completado 2026-04-21)
- [x] Página editorial `/es/mexico` y `/en/mexico` — generada automáticamente vía ruta dinámica `app/[locale]/[pais]/page.tsx` + `generateStaticParams` con PAISES_MVP. Copy adapta con `heroTitle: "Envías dinero a México?"` (completado 2026-04-21)
- [x] Página editorial `/es/colombia` y `/en/colombia` — mismo mecanismo (completado 2026-04-21)
- [x] TasasReferencia grid ajustado de `lg:grid-cols-4` a `lg:grid-cols-3` para acomodar 6 tarjetas en 2 filas de 3 (completado 2026-04-21)
- [x] Color BR (Banrep Colombia) cambiado de amarillo claro `#FFD100` a gold oscuro `#C28A00→#7A5700` para contraste con texto blanco (completado 2026-04-21)
- [x] Traducciones ES/EN actualizadas (FAQ q3, q5 y nosotros.missionText) (completado 2026-04-21)
- [x] Migración SQL 006 lista (`supabase/migrations/006_mexico_colombia_mvp.sql`) — UPSERT corredores + tasas_bancos_centrales + 14 precios iniciales. Idempotente. **Acción pendiente del usuario: ejecutar en Supabase SQL Editor** (completado 2026-04-21 código, pendiente ejecución SQL)

**Marketing plan NO se toca:** la adición de MX/CO al catálogo es una decisión de producto/SEO de largo plazo. El plan de marketing del mes 1 post-launch sigue enfocado en Honduras (prioridad #1). MX y CO son tráfico orgánico + futuros ad sets del mes 2-3 cuando haya data de conversión por corredor. Referencia: `PLAN_MARKETING_MES_1.md` permanece intacto.

**Calidad de data sources (sube del Tier 3 a Tier 4 para Wise):**

- [ ] **[PRIORIDAD POST-LLC — Fase R1 del Proceso 28]** Integrar [Wise API pública](https://api.wise.com/v1/rates) para reemplazar/complementar scraper Wise. Es gratuita, no requiere aprobación, más confiable que scraping. Simplifica el pipeline y reduce dependencia de Tier 3 para 1 de los 7 operadores. **Post-2026-04-23 elevada de "pendiente general" a "quick win del plan de reactivación de scrapers"** — es el ÚNICO operador de los 7 cuya data source se puede arreglar sin esperar aprobación de afiliados. Puede ejecutarse incluso antes de la LLC si se decide recuperar al menos 1/7 operador antes del DNS cutover. Estimación: 2-3 hrs. Ver detalle en [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md).

**Email deliverability (crítico para alertas gratis y confirmaciones):**

- [ ] Verificar dominio `preenvios.com` en Resend (DKIM + SPF + DMARC records en Namecheap). Hoy los emails salen desde `onboarding@resend.dev` que mata trust de la marca y aumenta tasa de spam. Estimación: 20-30 min + propagación DNS ~2-24 hrs
- [ ] Smoke test: suscribirse con email propio, verificar que llega el email de confirmación desde `alertas@preenvios.com` (no resend.dev) y NO cae en spam
- [ ] DMARC policy inicial en `p=none` para monitoreo; subir a `p=quarantine` tras 2 semanas sin falsos positivos

**No se incluye en esta fase:**
- Corredores fuera del MVP actual (6 países): se evalúan post-launch según la política descrita en la sección "Integraciones futuras / alcance post-MVP" de este documento
- Wiki escrita: el founder la escribe manual post-launch (no IA por policy Google/Meta)
- Blog SEO: post-launch progresivo

---

### Fase 9 — SEO foundation + iconos + observability validation (pre-lanzamiento, 2026-04-22)

Bloque de trabajo enfocado del día 2026-04-22 que cierra varios pendientes del checklist pre-lanzamiento en una sola sesión. Todo es pre-DNS cutover (el dominio `preenvios.com` sigue apuntando a GitHub Pages; el preview es `preenvios.vercel.app`).

#### 9.1 Agente 1 — Validador de ingress en scrapers (Fase 7 capa arquitectónica)

- [x] Migración `supabase/migrations/007_scraper_anomalies.sql` — tabla idempotente + 2 indexes + RLS deny-anon (completada 2026-04-22)
- [x] `lib/scrapers/validator.ts` — 7 reglas: operador en whitelist 7 MVP, corredor en whitelist 6 MVP, `metodo_entrega` en enum (`bank`, `cash_pickup`, `home_delivery`, `mobile_wallet`), `velocidad` en enum, `fee ∈ [0, 50]` USD, `tasa > 0`, `tasa ± 10%` del banco central con fallback hardcoded. Cache de `tasas_bancos_centrales` al inicio del batch (1 query en lugar de N). "3 anomalías consecutivas" vía query a `scraper_anomalies` (serverless-safe, no contador in-memory) (completado 2026-04-22)
- [x] Integración en `lib/scrapers/base.ts` `savePrices()` sin romper firma pública (completado 2026-04-22)
- [x] Doc completa `LOGICA_DE_NEGOCIO/24_agente_validador_ingress.md` + `TROUBLESHOOTING/27_contador_in_memory_serverless.md` (bug latente del contador existente de `reportScraperFailure`, documentado pero no arreglado — scope separado)
- [x] **Migración 007 aplicada en prod 2026-04-23** — Supabase SQL Editor, verificación post-run (tabla_existe=1, policies=4, indexes=3, filas=0)
- [x] **Smoke test del validador ejecutado 2026-04-23** — branch efímera `test/smoke-agente1` (ya borrada) con endpoint temporal `/api/test-agente1` apuntando a DB preview. 3 mocks enviados a `savePrices()`: 1 válido (Remitly/Honduras/tasa 24.95) + 2 inválidos (tasa 999 fuera ±10%, `metodo_entrega='pigeon'` fuera de enum). Resultado: `saved=1`, `errors=[]`, 2 filas en `scraper_anomalies` con `campo_invalido` correcto. Sentry capturó los 2 eventos `scraper_anomaly`. Agente 1 end-to-end validado.
- Commits: `9367a35` (implementación), `ba43809` (ampliación docs Sentry § 17 con integración de Agente 1), `cb8d622` (endpoint smoke test, branch efímera ya borrada)

#### 9.2 Activación de Sentry DSN + smoke test end-to-end

- [x] Signup del founder en sentry.io (proyecto `javascript-nextjs`)
- [x] 5 env vars en Vercel: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` en los 3 entornos (Production/Preview/Development)
- [x] Endpoint temporal `/api/sentry-test` (commit `be65b1a`) → smoke test disparado → evento `Error` (Unhandled) + evento `scraper_anomaly` (tag del Agente 1) aparecieron en Sentry en <30s → endpoint eliminado (commit `7e3beac`)
- [x] Docs: `SERVICIOS_EXTERNOS_DETALLE.md § 17` expandido al nivel de detalle de BetterStack/Resend (env vars, archivos config, integraciones en código, alertas recomendadas, pasos de activación, troubleshooting)
- [x] Fase 2 monitoring cerrada. Ver sección "Nivel monitoreo pasivo" arriba para el estado actualizado

#### 9.3 SEO foundation — `generateMetadata` + JSON-LD

- [x] `generateMetadata` bilingüe (ES/EN) con `canonical` + `alternates.languages` en 7 páginas estáticas faltantes: `/terminos`, `/privacidad`, `/como-ganamos-dinero`, `/metodologia`, `/uso-de-marcas`, `/calculadora-inversa`, `/admin` (con `robots: noindex,nofollow`). Más home con descripción actualizada a 6 corredores MVP (antes decía 4) — commit `80990fb`
- [x] `generateMetadata` dinámicas en `/tasa/[pair]` (6 slugs SSG), `/wiki/[slug]` (10 slugs SSG), `/blog/[slug]` (3 slugs dynamic) con fallback `robots:noindex` si el slug no existe — commit `367b3b3`
- [x] JSON-LD Schema.org inline en 6 páginas: home (`@graph` con `WebSite + SearchAction + Organization + FAQPage` con las 6 preguntas de FAQ traducidas via `getTranslations`), `/nosotros` (`AboutPage + Organization`), `/contacto` (`ContactPage + ContactPoint`), `/calculadora-inversa` (`WebApplication`), `/blog` (`Blog + blogPost` array), `/wiki` (`CollectionPage + ItemList` de 10 artículos) — commit `8523e85`
- [x] Fix `/disclaimers` descubierto en smoke test: era `export const metadata` estático mono-lingüe con `noindex,nofollow` (bug, no decisión). Reemplazado por `generateMetadata` bilingüe + canonical + alternates, indexable — commit `6bdce58`
- **Resultado:** 19/19 páginas con metadata bilingüe + canonical + hreflang. 11 páginas con JSON-LD. `Organization` entity canonical con `@id` reutilizado en 4 páginas → Google consolida marca.
- **Tech debt no abordado (scope separado):** `/blog/[slug]` sigue como `ƒ Dynamic` por faltarle `generateStaticParams()` — una línea para convertirlo a SSG como los otros. Se documenta en BACKLOG_POST_REFACTOR § 2.

#### 9.4 Favicon + fuentes + preconnect

- [x] Favicon migrado a pack estático diseñado con Montserrat (7 archivos: `app/favicon.ico` + 5 PNGs en `public/` + `apple-touch-icon`). `app/icon.tsx` y `app/apple-icon.tsx` (dinámicos con `ImageResponse` + `system-ui`) eliminados — una sola fuente de verdad. `app/manifest.ts` apunta a rutas estáticas. `app/[locale]/layout.tsx` agrega 3 `<link>` para PNGs — commit `316a6ef`
- [x] Fuentes (Inter + Work Sans + Quicksand): ya estaban en `next/font/google` desde el refactor Fase 1. **No requirió cambios.**
- [x] Preconnect (`flagcdn.com` + `cdn.brandfetch.io`): ya estaban en `app/[locale]/layout.tsx`. **No requirió cambios.**

#### 9.5 Smoke test GA4 + eventos faltantes en forms

- [x] Verificación curl de 12 URLs legales (6 páginas × 2 locales) → 10/12 OK, 2/12 con defectos en `/disclaimers` → arreglado en commit `6bdce58` (ver § 9.3)
- [x] Eventos GA4 faltantes en forms de conversión crítica agregados (commit `6bdce58`):
  - `trackEvent('contacto_enviado', { asunto, idioma })` en `app/[locale]/contacto/content.tsx` al submit exitoso
  - `trackEvent('suscripcion_alertas', { idioma })` en `app/[locale]/alertas/content.tsx` al submit exitoso
- [x] Comentario de inventario de `lib/tracking.ts` actualizado al estado real 2026-04-22 (7 eventos custom + tag Sentry del Agente 1)
- [x] Doc permanente `TROUBLESHOOTING/28_ga4_smoke_test.md` con tabla de check + troubleshooting para futuros smoke tests
- [x] Fase 2 de validación manual en GA4 Realtime completada 2026-04-22: los 8 eventos (6 custom + page_view automático + session_start) disparados desde el browser, aparecieron en el widget "Event count by Event name" en <30 seg c/u. Founder confirmó "ya está validada, todo funciona en analytics". Commit del update: `3ef2fb3`

#### 9.6 Meta Pixel — DECISIÓN explícita del founder

- **Pendiente por decisión estratégica del founder 2026-04-22:** Meta Pixel NO se instala hasta post-LLC. Sin Meta Pixel no se pueden activar campañas Meta Ads con optimización por conversión. El plan de marketing mes 1 (`plan-marketing-mes1-v2.md`) depende de esto — se activa día 30 May según el plan si la LLC está lista.
- **Scope pendiente cuando toque:** agregar env var `NEXT_PUBLIC_FB_PIXEL_ID`, `<Script>` de fbevents.js en `app/[locale]/layout.tsx`, helper `fbq()` en `lib/tracking.ts` para `PageView`, `ViewContent`, `Lead`, `AddToWishlist`.

---

### Fase 10 — Mejoras de calidad técnica (post-cutover progressive)

**Contexto (2026-04-22):** esta fase consolida 6 bloques de mejoras identificadas en el diagnóstico exhaustivo. Son trabajos que NO bloquean el DNS cutover pero sí son necesarios para un producto maduro. Se ejecutan progresivamente en las semanas/meses siguientes al lanzamiento — cada item tiene checkbox para marcar cuando se completa.

**Regla importante:** ningún item de esta fase requiere LLC, Payoneer o Meta Business verification. Todo es trabajo técnico interno. La única dependencia externa es Upstash Redis (plan Free ya activo) y GitHub Actions (gratis en repos privados con límite de minutos).

**Bloques (post-filtro 2026-04-23 — ver `feedback_no_fix_sin_evidencia` en memoria):**
- **Bloque A:** Endurecimiento de seguridad — 5 vulnerabilidades documentadas (2-4h)
- **Bloque E:** Documentación técnica pendiente (30 min)
- **Bloque F:** Performance / LCP / Core Web Vitals (3-4h)
- **Bloque H:** Testing unitario — solo lib/ pure functions (opcionales, post-cutover)
- **Bloque J:** Rate-limit `/api/precios` — diferido, activar post-cutover si hay saturación
- **Bloque K:** Entorno / infraestructura (K.1 completado 2026-04-23)
- **Bloque L:** OG + Twitter Cards — integral para plan marketing con shares en redes sociales (1h)

**Bloques descartados 2026-04-23:** 10.G (accesibilidad completo), 10.H.4 (CI GitHub Actions — pre-launch sin team), 10.H.5 (Playwright básico — duplicado con Agente 4 Fase 7), 10.J.1 (rate-limit /api/scrape — auth CRON_SECRET ya protege), 10.J.3, 10.J.4 (rate-limits de endpoints sin uso significativo), 10.K.2 (cache headers — Vercel/Next ya cubren), 10.L.1 (error boundaries — sin evidencia de crashes), 10.L.2 (loading.tsx globales — Next default funciona), 10.L.4 (BreadcrumbList — ya marcado opcional).

**Nota sobre bloques no incluidos:**
- **Bloque I (Cookie consent CCPA/GDPR)** — vive en `CHECKLIST_PRE_LANZAMIENTO.md § 15 Compliance legal` como BLOQUEANTE pre-cutover. NO está en Fase 10 porque es legal, no calidad técnica; y porque es bloqueante (la Fase 10 es progressive post-cutover).
- **Bloque M (smoke tests formales)** — son acciones manuales del founder pre-cutover, no trabajo de desarrollo. Viven en `CHECKLIST_PRE_LANZAMIENTO.md § 13 y § 14`.

---

#### 10.A — Endurecimiento de seguridad (2-4h)

**Por qué importa:** los 5 items de este bloque son vulnerabilidades documentadas en `TROUBLESHOOTING/14-18` y `AUDITORIA_DE_SEGURIDAD/01_auditoria_2026_04_19.md` que NO se arreglaron antes del cutover. Cada una tiene un vector de explotación real — aunque bajo (el sitio es chico y poco conocido), van a escalar cuando haya tráfico real post-launch.

- [x] **10.A.1 — 🔒 Endpoint cron expuesto: `/api/scrape` sin auth** (completado 2026-04-23, commit `53c7d18`)
  - **Qué era:** el endpoint que dispara los scrapers estaba público sin auth robusta. El check `if (cronSecret && ...)` era falsy cuando `CRON_SECRET` undefined → endpoint abierto.
  - **Fix aplicado:** hard-fail (500) si `CRON_SECRET` no está seteada, 401 si el `Authorization: Bearer ${CRON_SECRET}` no matchea. Verificado con `curl -i https://preenvios.vercel.app/api/scrape` → 401 Unauthorized. `CRON_SECRET` confirmado en los 3 entornos Vercel (Production/Preview/Development).
  - **Archivo:** `app/api/scrape/route.ts`.
  - **Ref:** TROUBLESHOOTING/14 Causa 1 (puede actualizarse a ✅ RESUELTO).

- [ ] **10.A.2 — 🔒 Admin login hardening** (30-60 min) — severidad ALTA
  - **Qué es:** el login de `/admin` tiene rate-limit (commit `5fc6ab1` agregó `checkAdminLoginRateLimit` en `lib/rate-limit.ts`, 5 intentos / 15 min / IP). Pero el token de sesión NO rota y el password único está como env var sin rotación documentada.
  - **Ataques posibles:** si el token se filtra, acceso al admin permanente hasta cambio manual de env var.
  - **Solución:** ver `TROUBLESHOOTING/15_admin_login_vulnerable.md` — recomienda rotación de token + HttpOnly cookie con expiración corta + documentar cambio periódico de `ADMIN_PASSWORD`.
  - **Archivos:** `lib/admin-auth.ts`, `app/api/admin/auth/route.ts`.
  - **Ref:** TROUBLESHOOTING/15 + AUDITORIA_DE_SEGURIDAD/01_auditoria § H-03.1.

- [ ] **10.A.3 — 🔒 Webhook Twilio sin validación HMAC** (20 min) — severidad ALTA
  - **Qué es:** el webhook `/api/whatsapp/webhook` que recibe mensajes de Twilio NO valida el header `X-Twilio-Signature`. Cualquiera con la URL puede enviar POSTs falsos simulando mensajes de usuarios.
  - **Ataques posibles:** spoofing de mensajes (simular que `+1XXX` preguntó la tasa → el bot responde a un destino falso), agotar rate-limits, disparar logs basura.
  - **Solución:** validar HMAC con la librería de Twilio (`twilio.validateRequest()`) antes de procesar el body. Detallado en `TROUBLESHOOTING/16_webhook_twilio_sin_firma.md`.
  - **Archivo:** `app/api/whatsapp/webhook/route.ts`.
  - **Ref:** TROUBLESHOOTING/16 + AUDITORIA_DE_SEGURIDAD/01_auditoria § H-03.4.
  - **Nota:** el bot WhatsApp está actualmente pausado (requiere Meta Business verification post-LLC). Arreglar esto antes de re-activarlo.

- [ ] **10.A.4 — 🔒 Suscripción alertas — validar post-rebuild** (15 min) — severidad MEDIA
  - **Qué es:** el form de `/alertas` fue reescrito 2026-04-22 con shadcn Form + honeypot + rate-limit (3/h/IP). Re-verificar que las protecciones siguen vigentes — `TROUBLESHOOTING/17_suscripcion_free_spam.md` fue escrito cuando existía `/api/suscripcion-free` (endpoint distinto, ya eliminado).
  - **Procedimiento:** revisar `app/api/alertas/route.ts` + `TROUBLE/17` — actualizar el doc o eliminarlo si ya no aplica al endpoint nuevo.
  - **Archivos:** `app/api/alertas/route.ts`, `lib/rate-limit.ts` (limiter `checkAlertaRateLimit`), `TROUBLESHOOTING/17_suscripcion_free_spam.md` (revisar).
  - **Ref:** TROUBLESHOOTING/17.

- [ ] **10.A.5 — 🔒 Headers de seguridad globales** (20 min) — severidad MEDIA
  - **Qué es:** el sitio NO setea CSP (Content Security Policy), X-Frame-Options, Referrer-Policy ni Permissions-Policy. Defaults de Vercel son básicos pero no protegen contra clickjacking, inyección de scripts, fuga de referrers a partners.
  - **Solución:** configurar `next.config.ts` con `headers()` que añada:
    - `Content-Security-Policy` restrictiva (permitir solo self + googletagmanager + sentry.io + flagcdn.com + brandfetch.io)
    - `X-Frame-Options: DENY` (anti clickjacking)
    - `Referrer-Policy: strict-origin-when-cross-origin` (no fugar paths a terceros)
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (denegar features no usadas)
  - **Detallado en:** `TROUBLESHOOTING/18_headers_seguridad_globales.md`.
  - **Archivo:** `next.config.ts`.
  - **Ref:** TROUBLESHOOTING/18.

**Criterio de cierre del Bloque A:** los 5 items marcados [x]. Los docs TROUBLESHOOTING/14-18 pueden actualizarse con "✅ RESUELTO [fecha, commit]" al completar cada uno.

---

#### 10.E — Documentación técnica pendiente (30 min)

**Por qué importa:** estos docs evitan que conocimiento operacional se pierda cuando el founder no está presente o cuando un dev nuevo toma el proyecto. La inversión de 30 minutos ahorra horas de re-descubrimiento futuro.

- [x] **10.E.1 — Actualizar `TROUBLESHOOTING/04_whatsapp_bot_no_responde.md`** (verificado 2026-04-23, ya hecho en limpieza del 2026-04-22 commits `12bbc6e` + `8ae146e` + `5b32854` + `9eaae25`)
  - **Contexto:** el doc fue escrito antes de la limpieza de Nicaragua y Haití del 2026-04-22. Menciona códigos de moneda (NIO, HTG) que ya NO están en el `CORREDOR_MAP` del webhook. Si alguien lee el doc para diagnosticar el bot post-reactivación, puede seguir instrucciones obsoletas.
  - **Revisar:** que todos los códigos mencionados (DOP, HNL, GTQ, SVC/USD, COP, MXN) están vigentes, que no quedan referencias a NIO/HTG/nicaragua/haiti.
  - **Verificación:** `grep -iE "nicaragua|haiti|NIO|HTG" TROUBLESHOOTING/04_whatsapp_bot_no_responde.md` debe devolver 0 matches.

- [x] **10.E.2 — Escribir `TROUBLESHOOTING/29_scrapers_manual_run.md`** (completado 2026-04-23) — doc 6 pasos (curl + lectura JSON + verificar tabla precios + revisar scraper_anomalies + logs Vercel + Sentry) + workaround manual para Fase R0. Entrada en TROUBLESHOOTING/README.md.
  - **Qué es:** doc paso a paso de cómo correr los scrapers manualmente — crítico para el smoke test pre-cutover (CHECKLIST § 7.4 línea 164) y para debugging cuando algo falla en producción.
  - **Contenido mínimo:**
    - Cómo llamar `/api/scrape` manualmente (curl con auth header del Bloque 10.A.1 post-fix)
    - Qué esperar en la respuesta (status 200, JSON con `saved`, `errors`, eventuales rechazos del Agente 1)
    - Cómo verificar en Supabase que la tabla `precios` se actualizó (query: `SELECT operador, corredor, tasa, actualizado_en FROM precios ORDER BY actualizado_en DESC LIMIT 20;`)
    - Cómo revisar `scraper_anomalies` si hubo rechazos del validador
    - Cómo interpretar logs en Vercel → Functions → `/api/scrape`
  - **Archivo nuevo:** `TROUBLESHOOTING/29_scrapers_manual_run.md`
  - **También:** actualizar `TROUBLESHOOTING/README.md` con entry para el doc 29.

**Criterio de cierre del Bloque E:** los 2 docs actualizados/escritos. Los 2 items marcados [x].

---

#### 10.F — Performance / LCP / Core Web Vitals (3-4h)

**Por qué importa:** Google usa Core Web Vitals (LCP, INP, CLS) como factor de ranking desde 2021. Además afectan la percepción del usuario en los primeros segundos — si el sitio "se ve lento", el bounce rate sube y las conversiones caen. Este bloque aborda los 3 items del audit que NO se hicieron en el refactor Fase 1.

- [x] **10.F.1 — Migrar `<img>` a `next/image`** (completado 2026-04-23) — grep exhaustivo detectó solo 2 archivos con `<img>` real (el resto ya estaba migrado o usa SVG inline): `app/[locale]/calculadora-inversa/content.tsx` y `app/[locale]/operadores/[slug]/operador-content.tsx`. Ambos eran flags de flagcdn.com (hostname ya permitido en `next.config.ts` remotePatterns). Migrados a `<Image>` manteniendo width/height/alt/className; removido `decoding="async"` (manejado internamente por next/image). Typecheck + build limpios.
  - **Qué es:** Next.js provee el componente `<Image>` (`next/image`) que genera automáticamente versiones WebP/AVIF, aplica lazy loading por default, y reserva espacio para evitar CLS.
  - **Estado actual:** el proyecto tiene CERO uso de `next/image`. Los logos de operadores (Remitly, Wise, etc.), las banderas de FlagCDN, el avatar unificado y las imágenes del blog usan `<img>` nativo.
  - **Impacto directo:** LCP (Largest Contentful Paint) — hoy la imagen más grande (logo de operador en Comparador) no tiene hints de tamaño → el browser la baja sin optimización, puede ser 50-200KB vs <20KB en WebP.
  - **Archivos afectados:** `components/Comparador.tsx` (logos operadores), `components/TasasReferencia.tsx` (flags), `components/BannersPatrocinados.tsx` (iconos), `app/[locale]/operadores/[slug]/operador-content.tsx`, `app/[locale]/[pais]/pais-content.tsx`, `app/[locale]/nosotros/content.tsx`.
  - **Precaución:** `next/image` requiere `width` + `height` explícitos (o `fill`). Si no se calculan bien, puede romper el layout visual. Validar con screenshots antes/después en desktop + iPhone.

- [x] **10.F.2 — Loading states en fetch `/api/precios` (Comparador)** (completado 2026-04-23) — reemplazado el div de texto `{t('results.loading')}` por 3 skeleton cards animados (`ResultCardSkeleton`) con `animate-pulse`. Replican el layout exacto de `ResultCard` (.cmp-card + .cmp-brand + 3 .cmp-col + CTA) → zero layout shift cuando llegan los resultados reales. Accesible con `role="status"` + `aria-label` + `aria-busy`. Typecheck + build limpios.
  - **Qué es:** cuando el usuario hace click en "Comparar", se hace un fetch a `/api/precios` que devuelve los 7 operadores. Hoy NO hay indicador visual mientras llega → el UI se queda "vacío" por 500-2000ms.
  - **Solución:** agregar skeleton (tarjetas grises animadas) o spinner en el lugar donde van a aparecer los resultados. Similar patrón a lo que hace Monito.com.
  - **Archivo afectado:** `components/Comparador.tsx` — estado `loading` ya existe, falta renderizar un componente visual en ese estado.
  - **Ref:** AUDIT_COMPLETO.md §5.2.

- [ ] **10.F.3 — Audit CLS (Cumulative Layout Shift) post-refactor** (30 min)
  - **Qué es:** CLS mide si los elementos se mueven durante la carga. Si > 0.1, Google penaliza ranking.
  - **Procedimiento:** correr Lighthouse en Chrome DevTools sobre `preenvios.vercel.app/es`, `/es/honduras`, `/es/calculadora-inversa`. Guardar scores. Si CLS > 0.1 en alguna, investigar con DevTools → Performance → Layout Shift Regions qué elemento se mueve.
  - **Causas típicas:** imágenes sin dimensiones, fonts cargando con FOIT, elementos que cambian altura al hidratar React.
  - **Output esperado:** doc `TROUBLESHOOTING/29_cls_investigation.md` con resultados del baseline + fix si aplica.

**Criterio de cierre del Bloque F:** Lighthouse en `/es` muestra LCP ≤ 2.5s, CLS < 0.1, TTI < 3.8s en conexión 3G simulada. Todos los items marcados [x].

---

#### 10.H — Testing + CI (4-6h)

**Por qué importa:** hoy el proyecto NO tiene tests automáticos. Cada cambio se valida con `npm run typecheck` + `npm run build` + verificación manual. A medida que el codebase crece (ya son +150 archivos), la probabilidad de romper algo con un cambio inocente aumenta. Tests + CI son el safety net que permite al founder (o un dev futuro) cambiar código sin miedo.

- [ ] **10.H.1 — Unit tests para `lib/scrapers/validator.ts`** (1.5h)
  - **Por qué primero este:** es una **pure function** — sin I/O, sin async, sin dependencias. Input: `ScrapedPrice` + `BancoCentralCache`. Output: `ValidationResult`. Ideal para tests.
  - **Tool:** Vitest (más rápido que Jest, nativo TypeScript, 0 config con Next 16).
  - **Cobertura objetivo:** las 7 reglas del validador — 1 test por regla (valid case + invalid case) = ~14 tests.
  - **Archivo nuevo:** `lib/scrapers/validator.test.ts`.
  - **Comando:** agregar `"test": "vitest run"` en `package.json`.

- [ ] **10.H.2 — Unit tests para `lib/ranking.ts`** (1h)
  - **Qué cubre:** la fórmula del Preenvíos Score (5 criterios ponderados). Si el founder decide cambiar los pesos en el futuro (ej. dar más peso a `valor_afiliado`), los tests validan que el cambio no rompa el output para los casos existentes.
  - **Cobertura objetivo:** 5-8 tests con precios mockeados que representen: mejor tasa, peor tasa, empate, afiliado vs no-afiliado, velocidad top, velocidad slow.
  - **Archivo nuevo:** `lib/ranking.test.ts`.

- [ ] **10.H.3 — Unit tests para schemas zod (`contacto`, `alerta`)** (45 min)
  - **Qué cubre:** los schemas de zod son contratos. Si alguien cambia un field del schema, los tests fallan visiblemente en vez de crashear en producción.
  - **Tests por schema:** valid input, email inválido, mensaje muy corto (contacto), honeypot lleno (anti-bot), enum inválido.
  - **Archivo nuevo:** `lib/schemas/contacto.test.ts` + `lib/schemas/alerta.test.ts`.

**Criterio de cierre del Bloque H:** tests unitarios opcionales sobre `lib/` para casos críticos de lógica pura. No es bloqueante del cutover. CI workflow (10.H.4 original) descartado 2026-04-23 — pre-launch con equipo de 1 persona no justifica el setup vs validación manual actual. Playwright básico (10.H.5 original) descartado — duplicado con el Agente 4 de Fase 7 que se hará completo cuando llegue su turno.

---

#### 10.J — Rate-limit `/api/precios` (diferido post-cutover)

**Post-filtro 2026-04-23:** 3 items descartados (J.1, J.3, J.4). Queda solo J.2 diferido para activar post-cutover si se observa saturación. Ver razón de descarte en el bloque sumario arriba.

- [ ] **10.J.2 — Rate-limit para `/api/precios`** (15 min — **diferido, activar solo si hace falta post-cutover**)
  - **Contexto:** endpoint público consumido por el Comparador del front. Legítimamente tiene alto volumen. Sin rate-limit, un bot podría scrapearlo infinitamente.
  - **Criterio para activar:** observar post-cutover. Si Supabase Free tier se satura con queries o si algún scraper externo empieza a consumir bandwidth desmedido → activar. Hoy sin tráfico, el rate-limit no se necesita.
  - **Solución cuando se active:** Upstash `fixedWindow(60, '1 m')` — 60 requests por minuto por IP. Helper `checkApiPublicRateLimit` nuevo en `lib/rate-limit.ts`.
  - **Archivo:** `app/api/precios/route.ts`.

**Criterio de cierre del Bloque J:** activar 10.J.2 solo si se observa saturación real post-cutover. No es bloqueante.

---

#### 10.K — Entorno / infraestructura (1-2h)

**Por qué importa:** si el entorno de preview (preenvios.vercel.app — staging) comparte la base de datos con producción (preenvios.com), un push accidental a una feature branch puede corromper data real de usuarios. La regla universal de DevOps: NUNCA una DB prod es compartida con staging.

- [x] **10.K.1 — Separación de DB Supabase preview vs production** (completado 2026-04-23)
  - **Estado inicial detectado:** las 3 env vars de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) estaban compartidas entre Production + Preview + Development → todos los previews escribían directo en la DB de prod.
  - **Solución aplicada:**
    1. Creado proyecto Supabase nuevo `preenvios-preview` (Free tier, misma región que prod).
    2. Corrido script `supabase/preview_setup_all.sql` (commit `edaa553`) que concatena las 7 migraciones 001..007 + seed de los 4 corredores MVP originales (HN, DO, GT, SV). Resultado: 6 corredores, 6 tasas BC, 14 precios iniciales (MX/CO via migration 006).
    3. Reconfigurado Vercel env vars: las 3 de Supabase ahora tienen 2 entries cada una — scope "Production" con valores prod, scope "Preview + Development" con valores del proyecto nuevo.
    4. Redeployado preview.
  - **Smoke test validado 2026-04-23:** branch efímera `test/preview-db-separation` → preview deploy con URL única → insertado contacto test desde form `/contacto` → verificado que aparece SOLO en DB preview, NO en prod. Branch borrada post-test.
  - **Ref:** `supabase/preview_setup_all.sql` (script reejecutable si hay que recrear preview en el futuro).

**Criterio de cierre del Bloque K:** K.1 completado 2026-04-23 (DB preview separada de prod). Cache headers (10.K.2 original) descartado post-filtro 2026-04-23 — Vercel + Next.js ya aplican cache headers correctos a assets con hash, optimización redundante. El playbook del DNS cutover se trabaja por separado en la sección destacada debajo.

---

#### 10.L — Open Graph + Twitter Cards (integral para marketing con shares)

**Post-filtro 2026-04-23:** 3 items descartados (L.1, L.2, L.4). Queda solo L.3 porque el plan de marketing del mes 1 incluye shares en redes sociales (Instagram, TikTok, Facebook, X) — sin OG cards los links comparten plain, CTR 3-5x menor. Los otros 3 items eran polish preventivo sin evidencia de bug visible.

- [ ] **10.L.3 — Open Graph + Twitter Cards en páginas principales** (1h)
  - **Qué es:** metadatos que controlan cómo se ve el link cuando alguien lo comparte en WhatsApp, Twitter, Facebook, etc. Hoy NO están configurados — los shares muestran título + URL nada más.
  - **Impacto:** el plan de marketing v2 depende de shares en redes. Un OG con imagen + título + descripción tiene 3-5x mejor CTR que un share plain.
  - **Scope:** agregar campos `openGraph` y `twitter` al `generateMetadata` de: home, `/tasa/[pair]`, `/operadores/[slug]`, `/[pais]`, blog posts.
  - **Imagen OG:** 1200×630 con logo PreEnvios + "Compara remesadoras" + bandera del país destino (si aplica). Dos approaches:
    - **A.** Estática en `public/og/` — imágenes diseñadas custom, requiere diseño previo.
    - **B.** Dinámica con `ImageResponse` en `app/[locale]/[route]/opengraph-image.tsx` — código puro sin assets adicionales, recomendada.
  - **Decisión de approach pendiente:** founder elige A o B antes de codear.

**Criterio de cierre del Bloque L:** OG/Twitter cards en home + 4 rutas dinámicas. Share preview validado con https://www.opengraph.xyz/ post-deploy.

---

---

### 🚨 DÍA CRÍTICO DEL PROYECTO — DNS Cutover (HORA CERO)

> **Este es el día más riesgoso de todo el roadmap.** Un error acá puede dejar el sitio caído con tráfico pagado activo, perder posicionamiento SEO acumulado, o romper integraciones con servicios externos. Se elevó fuera de Fase 10 (era sub-item 10.K.3) porque merece su propia sección destacada para que nadie lo subestime.

**Qué es el cutover:** cambiar los DNS de `preenvios.com` en Namecheap — de apuntar al sitio viejo en GitHub Pages a apuntar al deploy Next.js en Vercel. Es una operación de minutos técnicos con consecuencias de días si algo falla.

**Pre-requisitos NO negociables antes de hacer el cutover:**
- [ ] Los 5 agentes de Fase 7 (defense-in-depth) construidos y probados en `preenvios.vercel.app` — Agente 1 [x] 2026-04-23 (commit `f1fefc0`); Agentes 2, 3, 4, 5 pendientes
- [x] Migración 007 (`scraper_anomalies`) corrida en Supabase prod (2026-04-23, verificación post-run: 1-4-3-0)
- [ ] **🚨 NUEVO 2026-04-23 — Estado de scrapers validado o plan de reactivación ejecutado.** Los 7 scrapers MVP están rotos en prod desde 2026-04-17. El día del cutover hay que decidir 1 de 3 escenarios (A/B/C en CHECKLIST §7.4 actualizado). No lanzar con `saved=0` silencioso. Ver [SCRAPERS_IMPORTANTE.md](SCRAPERS_IMPORTANTE.md) + [LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md](LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md).
- [x] Bloque 10.A Item 10.A.1 completado (`/api/scrape` con auth — commit `53c7d18`, 2026-04-23)
- [x] Bloque 10.K.1 completado (DB preview separada de producción — proyecto `preenvios-preview` + commit `edaa553`, 2026-04-23)
- [x] CHECKLIST §15.1 Cookie consent banner CCPA + GDPR funcionando (commit `d064dcc`, 2026-04-23)
- [ ] CHECKLIST §13 Smoke test formal pre-cutover ejecutado con todas las acciones OK
- [ ] CHECKLIST §14 Pre-DNS checklist final con todos los items [x]

**Deliverables del playbook:**

- [ ] **Escribir `DNS_CUTOVER_PLAYBOOK.md`** en raíz del repo con el procedimiento paso a paso. Contenido mínimo estructurado como checklist temporal:

  **Pre-cutover (T-1h):**
  - Correr smoke test en staging Vercel (todas las páginas, forms, comparador)
  - Validar todas las env vars en Vercel (Production + Preview + Development)
  - Verificar Sentry capturando en producción
  - Verificar GA4 midiendo en producción
  - Verificar BetterStack monitores configurados apuntando a `preenvios.com`
  - Screenshot del estado actual del sitio en GitHub Pages (evidencia pre-cutover)
  - Notificar a equipo si existe ventana de mantenimiento

  **Cutover (T=0):**
  - Login a Namecheap → Domain List → `preenvios.com` → Advanced DNS
  - Cambiar A record a la IP de Vercel (`76.76.21.21` o la que Vercel indique)
  - Cambiar CNAME `www` apuntando a `cname.vercel-dns.com`
  - Guardar cambios, anotar timestamp exacto
  - Esperar propagación: 5-30 minutos típicos (ver con `dig preenvios.com`)

  **Post-cutover (T+5min):**
  - Smoke test en `preenvios.com` (no en `vercel.app`): home carga, HTTPS OK, comparador funcional
  - Validar que Cloudflare NO está interceptando (debe ser Vercel direct)
  - Verificar GA4 Real-Time: una visita propia dispara `page_view` con `hostname: preenvios.com`
  - Verificar Sentry: forzar un error test y ver que aparece con environment production
  - Validar con Google Rich Results Test: https://search.google.com/test/rich-results → ingresar `preenvios.com/es`
  - Validar preview de shares: OG card correctamente

  **Post-cutover (T+24h):**
  - Review métricas de tráfico GA4 vs 24h previas a cutover
  - Confirmar Google Search Console recibe sitemap nuevo (puede tardar hasta 72h en empezar a rastrear)
  - Revisar errores en Sentry — cualquier spike inesperado
  - Verificar que BetterStack monitoreó 24h sin false alerts
  - Verificar que el Agente 4 (E2E Playwright) cambió su URL target a `preenvios.com`

  **Rollback plan (si algo falla críticamente):**
  - Decisión de rollback se toma en los primeros 30 minutos post-cutover
  - En Namecheap → Advanced DNS → revertir A record y CNAME a los valores de GitHub Pages
  - Downtime total estimado: 1 hora (propagación ida + vuelta)
  - Los datos de Supabase NO se tocan (la DB no depende del dominio)
  - Post-rollback: comunicar a marketing que pause campañas si había alguna activa
  - Escribir post-mortem del rollback en `TROUBLESHOOTING/` antes del siguiente intento

- [ ] **Ejecutar el playbook el día del cutover** — TU acción, no código. Pre-requisito: playbook escrito + checklist pre-cutover completo.

- [ ] **Documentar el cutover real** — post-ejecución, escribir `TROUBLESHOOTING/30_dns_cutover_YYYY-MM-DD.md` con: timeline real, issues encontrados, tiempo de propagación observado, métricas antes/después, decisiones tomadas. Esto es evidencia institucional por si alguna vez hay que hacer otro cutover o auditoría legal.

**Criterio de cierre del cutover exitoso:** 48 horas en producción con 0 errores críticos en Sentry, GA4 midiendo correctamente, BetterStack sin false alerts, tráfico llegando a Vercel confirmable en analytics.

---

#### Instrucciones para quien tome el proyecto después

Cuando un item de la Fase 10 se complete:

1. Abrir este documento (`CONTEXTO_FINAL.md`)
2. Cambiar `[ ]` por `[x]` en el item correspondiente
3. Agregar al final del item: `(completado YYYY-MM-DD, commit SHA corto)`
4. Si el item descubrió un bug o tech debt adicional, agregarlo al BACKLOG_POST_REFACTOR.md con descripción
5. Si el item generó un doc nuevo (ej. troubleshooting), agregar la entry al índice de ese directorio

Orden de ejecución (estado post-filtro 2026-04-23):

**Completados:** 10.A.1, 10.E.1, 10.E.2, 10.F.1, 10.F.2, 10.K.1.

**Pendientes que SÍ se ejecutan (si surgen):**
1. **10.L.3 (OG + Twitter Cards)** — 1h, integral para el plan de marketing con shares sociales.
2. **10.A.2, 10.A.4, 10.A.5** — items de seguridad restantes (admin hardening, alertas, headers).
3. **10.F.3 (Lighthouse CLS audit)** — 30 min, requiere intervención tuya en Chrome DevTools.
4. **10.H.1, 10.H.2, 10.H.3** — unit tests `lib/` (opcional, post-cutover).
5. **DNS_CUTOVER_PLAYBOOK.md** + ejecución del cutover + documentación post.

**Pendientes diferidos:**
- **10.J.2** — rate-limit `/api/precios` — activar solo si se observa saturación post-cutover.
- **10.A.3** — Twilio HMAC — diferido hasta reactivar bot WhatsApp post-LLC + Meta Business verification.

**Descartados (no se ejecutan):** 10.G entero, 10.H.4, 10.H.5, 10.J.1, 10.J.3, 10.J.4, 10.K.2, 10.L.1, 10.L.2, 10.L.4. Ver razones en el sumario de bloques arriba.

**Antes del DNS cutover** ejecutar los items marcados como pre-requisito en la sección "DÍA CRÍTICO" arriba.

---

### Fase 11 — Landing editorial por país (modelo A Magazine) — rollout progresivo

**Contexto (2026-04-24):** las páginas `/[locale]/[pais]` y `/[locale]/[pais]/[monto]` pasan a soportar un **landing editorial extendido** debajo del disclaimer del Comparador. Reemplaza `<TasasReferencia />` + `<LazyBelow />` (Sections genéricas de LatAm) cuando el país tiene entry en `data/corredores/<pais>.ts`. El patrón es un feature flag "por datos" — los países sin entry siguen renderizando el layout legacy, los con entry "upgradean" automáticamente al editorial.

**Arquitectura completa documentada en [LOGICA_DE_NEGOCIO/30_landing_editorial_pais.md](LOGICA_DE_NEGOCIO/30_landing_editorial_pais.md)** — incluye patrón híbrido (data TS + messages JSON), checklist para agregar país nuevo en 5 pasos, tech debts documentados.

**Rollout por país:**

- [x] **Honduras** — port completo 2026-04-24, branch `feat/landing-editorial-honduras` → merge a main post-validación visual del founder en preview URL. Incluye stats macroeconómicos (BCH 2025, CEPAL 2024, US Census 2020), 6 ciudades destacadas (Tegucigalpa, SPS, Roatán, Copán Ruinas, La Ceiba, Choluteca), 6 errores comunes, 7 FAQ específicas del corredor, form alertas duplicado (hero + CTA final) con GA4 tracking segmentado por `location` (`hero` vs `cta_final`).
- [ ] República Dominicana — pendiente, próximo candidato
- [ ] Guatemala
- [ ] El Salvador
- [ ] Colombia
- [ ] México

**Commits del port Honduras (10):**

| # | Hash | Alcance |
|---|------|---------|
| 1 | `7955b1e` | `feat(fonts)`: Fraunces serif → clase Tailwind `font-editorial` |
| 2 | `c24ad43` | `feat(db)`: migration 011 agrega `corredor` + `idioma` a `alertas_email` |
| — | `b1febfc` | `docs(proceso 27)`: checklist migraciones + incidente 2026-04-24 (docs-only, scope separado) |
| 3 | `2d915f8` | `feat(api)`: `/api/alertas` acepta `corredor` + `idioma` |
| 4 | `92bf8a4` | `docs(tracking)`: contrato de `suscripcion_alertas` extendido con params nuevos |
| 5 | `5101b08` | `feat(lib)`: `getTasaBancoCentral` server helper (cache por-request con `React.cache`) |
| 6 | `4d9c92b` | `feat(data)`: `data/corredores/honduras.ts` + types + registry con feature flag |
| 7 | `ba2bf9c` | `feat(i18n)`: `landing.editorial.honduras.*` ES + `comingSoon` EN |
| 8 | `7e0c53e` | `feat(components)`: `landing-editorial/` (AlertaInlineForm + LandingEditorial + EnglishComingSoon) |
| 9 | `b500446` | `feat(pais)`: integración feature-flag en `pais-content.tsx` |
| 10 | (este) | `docs`: Proceso 30 + update CONTEXTO_FINAL |

**Incidente durante el port:** los 4 primeros commits (1, 2, extra, 3) se pushearon por error directo a `main` en lugar de a feature branch. Revertidos con Opción B (4 commits `git revert` no-destructivos en main, hashes `00cff1c`, `6074f05`, `3c22a0d`, `a4d36a7`) y recreados en branch. Aprendizaje guardado en memoria persistente `feedback_feature_branch_no_main.md` y consolidado como regla: trabajo multi-commit va SIEMPRE en feature branch para aprovechar previews.

**Acción pendiente:** founder valida visualmente en preview URL `preenvios-git-feat-landing-editorial-honduras-aneurysoto-pres-projects.vercel.app`, itera (push adicionales a la branch si hace falta), y cuando apruebe → merge a main (producción dormida hasta DNS cutover).

---

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

## Costos mensuales estimados por fase

| Servicio | Plan actual | Costo | Cuándo upgradear |
|----------|-------------|-------|------------------|
| Vercel | Hobby (gratis) | $0 | Vercel Pro $20/mes es REQUERIDO al lanzar el producto para activar cron cada 2 horas y quitar límites de funciones |
| Supabase | Free | $0 | Pro $25/mes cuando supere límites del plan gratis o proyecto se pause por inactividad |
| Upstash Redis | No activado | $0 | ~$10/mes cuando se necesite cache (diferido) |
| Proxies rotativos | No activado | $0 | $10-30/mes si WU/Remitly bloquean scrapers |
| Dominio preenvios.com | Namecheap | ~$12/año | Ya activo |
| **Total actual** | | **$0/mes** | |
| **Total post-lanzamiento** | Vercel Pro + Supabase Pro | **$45/mes** | Cuando haya tráfico real |

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

### Reglas de producto y estrategia
1. No construir app móvil hasta 5,000 usuarios activos/mes en la web
2. No agregar corredor nuevo hasta que el anterior genere $3,000/mes estables
3. No levantar capital externo antes del mes 18
4. No rediseñar el landing — solo agregar contenido a los slots vacíos
5. Publicar tasa de cambio todos los días hábiles en redes sociales — sin excepción
6. Nunca esconder que somos un comparador independiente — es el activo más valioso

### Reglas técnicas de UX e internacionalización
7. Idioma por defecto siempre ES (2026-04-18). No detectar Accept-Language — solo cambiar a EN si el usuario lo elige manualmente desde el botón EN/ES del nav. La cookie `NEXT_LOCALE` persiste esa elección
8. El nav usa el label "Destinos" (ES) / "Destinations" (EN) para la sección de países soportados — no "Corredores" ni "Countries"
9. En páginas de país (`/[locale]/[pais]`), el `defaultCorredor` que recibe el Comparador siempre gana sobre la cookie `preenvios_corredor`. La cookie solo aplica en la home
10. La página `/nosotros` es **anónima** — representa solo la marca "Preenvíos". No incluir nombre personal de fundador, foto, biografía individual ni iniciales en avatar. Si futuros mandatos piden volver a agregar al fundador, levantar la inconsistencia con esta regla antes de ejecutar
11. Los iconos decorativos dentro del sitio (secciones Por qué / Cómo funciona) usan `lucide-react`. Para banderas (idioma y países de corredor en la navegación principal) usar **SVGs inline**, NO emojis — Windows no renderiza flag emojis y los muestra como letras ("us", "es") que parecen un error. Los emojis de bandera en el dropdown de corredores se conservan porque ya están en `PAISES_MVP` y funcionan bien visualmente en mobile/Mac, pero si hay queja en Windows se migrarán a SVG también
12. Footer tiene 4 columnas de contenido + brand: Producto / Recursos / Empresa / Legal. Si se agrega una página nueva, elegir la columna semánticamente más cercana en lugar de inventar una quinta

### Reglas operacionales y de negocio
13. Revisar métricas una vez por semana — no todos los días
14. El número que importa cada semana: clics en "Enviar ahora"
15. Ninguna decisión de dirección estratégica antes del mes 18
16. Revenue Share es la meta explícita — mes 12 a 18 — no es opcional
17. No construir nada detrás de paywall antes de tener primero su versión gratuita capturando emails
18. Toda feature nueva pasa el filtro: ¿genera rentabilidad directa, protección legal, o tracción orgánica medible? Si no, se difiere
19. No replicar Monito 1:1 — replicar solo lo que un usuario latino en EE.UU. necesita
20. Multi-idioma es español/inglés únicamente hasta Fase 6. No agregar francés, portugués, ni otros idiomas aunque tengan tráfico — el costo de mantenimiento editorial no se justifica hasta expansión Europa
21. El comparador solo pregunta país origen, país destino, monto y método de entrega — nunca pregunta método de pago (ACH, tarjeta débito, crédito). Eso lo decide el usuario dentro del sitio del operador después del clic. Mantener simple como Monito
22. El proyecto se lanza SIN esperar la LLC. Se opera como individuo con Wise/Payoneer durante las primeras 4-8 semanas. La LLC, EIN, cuenta bancaria de negocio y E&O se gestionan en paralelo y se activan cuando estén listos, sin bloquear el lanzamiento ni la monetización inicial.

---

## Acciones pendientes del usuario (no bloquean lanzamiento)

Estas tareas son responsabilidad del usuario, no de Claude Code. Se completan en paralelo al desarrollo o después del lanzamiento.

### Redes sociales de Preenvios
- [x] Crear Instagram @preenviosdotcom (completado 2026-04-23)
- [x] Crear TikTok @preenvios (completado 2026-04-23)
- [x] Crear Facebook Page Preenvios.com (completado 2026-04-23)
- [x] Crear cuenta X/Twitter @preenviosdotcom (completado 2026-04-23)
- [x] Logo versión cuadrada 1080x1080 para redes (Canva gratis) (completado 2026-04-23)
- [ ] Bio unificada en las 4 redes con link a preenvios.com

### Cuentas financieras y pago de afiliados
- [ ] Crear cuenta Wise Personal (https://wise.com) — para recibir Impact.com y Partnerize
- [ ] Activar funcionalidad de recibir pagos en Payoneer (actualmente solo envía) — contactar soporte o crear cuenta nueva
- [ ] Completar Payment Information en CJ Affiliate una vez Payoneer reciba

### Email profesional
- [ ] Evaluar alternativas a Zoho actual — considerar Google Workspace ($6/mes) o Proton Mail
- [ ] Asegurar que contact@preenvios.com responde correctamente

### Aplicaciones a redes de afiliados
- [x] Impact.com — aplicación enviada (RECHAZADA 2026-04-17, reaplicar en 30-60 días cuando haya más tráfico)
- [ ] CJ Affiliate — cuenta creada, bloqueada hasta completar Payment Information con Payoneer
- [x] FlexOffers — aplicación enviada 2026-04-17, respuesta en 5 días hábiles
- [ ] Partnerize (Wise) — pendiente aplicar
- [ ] Remitly directo — pendiente, puede ser vía FlexOffers una vez aprobados

### Legal y fiscal (parallel a lanzamiento)
- [ ] Constituir LLC en Delaware o Florida
- [ ] Obtener EIN del IRS
- [ ] Abrir cuenta bancaria Mercury o Relay Bank
- [ ] Contratar seguro E&O $500,000+

### Contenido editorial real (post-estructura SEO)
- [ ] Escribir los 10 artículos fundacionales del wiki (uno por semana)
- [ ] Escribir 3 artículos iniciales del blog por corredor activo
- [ ] Revisar y actualizar meta descriptions de las páginas SEO cuando haya tráfico real

### Publicidad directa con bancos y operadores (Fase 4.3)
- [ ] Reunión con Banreservas NY (Washington Heights) para widget de tasa
- [ ] Contactar Banco Popular RD para widget patrocinado
- [ ] Contactar Viamericas para acuerdo $500-$1,500/mes
- [ ] Contactar Boss Money directamente para CPA directo

### Pre-lanzamiento
- [ ] Completar CHECKLIST_PRE_LANZAMIENTO.md (13 bloques QA)
- [ ] Upgrade Vercel Pro ($20/mes)
- [ ] Cambio DNS de GitHub Pages a Vercel en Namecheap
- [ ] Cambiar cron de scrapers a cada 2h (después de Vercel Pro)
