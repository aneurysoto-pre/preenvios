# CONTEXTO DEL PROYECTO — Comparador de Giros LATAM · MVP

---

## Qué es este documento
Este es el contexto del MVP (Producto Mínimo Viable) del Comparador de Giros LATAM.
El MVP consiste en un sitio web comparador de precios de remesas para la diáspora dominicana
en EE.UU., enfocado exclusivamente en el corredor USA → República Dominicana.
No procesa pagos, no mueve dinero, no requiere licencias. Solo compara precios públicos
de operadores de remesas y genera ingresos mediante comisiones de afiliados cuando
un usuario hace clic y completa su primera transferencia con alguno de los operadores listados.

El MVP se considera completo cuando:
- La calculadora muestra precios en tiempo real de 5 operadores
- Los links de afiliado de Wise y Remitly están activos y trackeando
- El bot de WhatsApp responde con el tipo de cambio DOP/USD
- 3 artículos SEO están publicados e indexados
- Se han recibido las primeras comisiones de afiliado (aunque sean pequeñas)

---

## URLs del proyecto
- Web live:         [pendiente — configurar dominio]
- Vercel dashboard: https://vercel.com
- Supabase:         https://supabase.com
- GitHub:           https://github.com/[usuario]/giros-latam

---

## Repositorio GitHub
```
[pendiente — crear repositorio]
```

## Estructura del repositorio
```
giros-latam/
  app/
    globals.css
    layout.tsx
    page.tsx                  ← calculadora principal / comparador
    blog/
      page.tsx                ← listado de artículos SEO
      [slug]/page.tsx         ← artículo individual
    api/
      precios/route.ts        ← endpoint que devuelve precios actualizados
      tasa/route.ts           ← endpoint tipo de cambio DOP/USD
  components/
    Comparador.tsx            ← tabla de comparación de operadores
    Calculadora.tsx           ← input de monto + resultado por operador
    AfiliadoLink.tsx          ← link con tracking de afiliado
  lib/
    supabase.ts               ← cliente Supabase
    scrapers/
      wise.ts                 ← obtiene precio Wise
      remitly.ts              ← obtiene precio Remitly
      xoom.ts                 ← obtiene precio Xoom
      worldremit.ts           ← obtiene precio WorldRemit
      westernunion.ts         ← obtiene precio Western Union
  public/
  .env.local                  ← variables de entorno (nunca al repo)
  next.config.ts
  package.json
  CONTEXTO_MVP.md
  CONTEXTO_FINAL.md
```

---

## Stack tecnológico
- Next.js 14+ (TypeScript) — frontend y API routes
- Tailwind CSS — estilos
- Supabase — base de datos y cache de precios
- Vercel — hosting y deploy automático desde GitHub
- Upstash Redis — cache de precios (actualización cada 30 min)
- Resend — emails de la lista de espera / newsletter
- WhatsApp Business API — bot de tipo de cambio diario
- GitHub — control de versiones

---

## Tipografía y diseño
- Fuente: [pendiente — decidir en Etapa 1]
- Colores: verde bosque como acento, fondo claro neutro
- Mobile-first — el 91% de la audiencia llega desde smartphone
- Español dominicano en todo el copy

---

## Operadores comparados en el MVP
| Operador         | Programa de afiliados       | Comisión        |
|------------------|-----------------------------|-----------------|
| Wise             | Partnerize (wise.com/gb/affiliate-program) | £10 personal / £50 business |
| Remitly          | partner@remitly.com         | $20–$40/usuario |
| Xoom (PayPal)    | PayPal Affiliate Program    | $25–$50/usuario |
| WorldRemit       | worldremit.com/affiliates   | $15–$30/usuario |
| Western Union    | Programa propio (CPA variable) | Variable     |

---

## Variables de entorno (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis (cache de precios)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend (email)
RESEND_API_KEY=

# WhatsApp Business API
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# Afiliados — tracking IDs
WISE_AFFILIATE_ID=
REMITLY_AFFILIATE_ID=
XOOM_AFFILIATE_ID=
WORLDREMIT_AFFILIATE_ID=

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

## ROADMAP MVP — 4 Etapas

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

### Etapa 1 — Calculadora y comparador (Semana 2–3)
- [ ] Inicializar proyecto Next.js 14+ con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Crear layout.tsx con fuentes y estructura base
- [ ] Crear componente Calculadora — input de monto en USD
- [ ] Crear componente Comparador — tabla con 5 operadores
- [ ] Conectar a Supabase — tabla `precios` con cache de operadores
- [ ] Crear scraper básico para Wise (precio en tiempo real)
- [ ] Crear scraper básico para Remitly
- [ ] Crear scraper básico para Western Union
- [ ] Crear API route /api/precios que devuelve los precios actualizados
- [ ] Configurar Upstash Redis — cache de precios cada 30 minutos
- [ ] Crear API route /api/tasa — tipo de cambio DOP/USD desde BCRD
- [ ] Cada botón "Enviar con X" tiene link de afiliado con tracking
- [ ] Deploy en Vercel — web visible en dominio real
- [ ] Prueba manual con 5 operadores comparados correctamente

### Etapa 2 — Contenido SEO y WhatsApp bot (Semana 4–5)
- [ ] Crear estructura de blog en Next.js (app/blog/)
- [ ] Escribir y publicar Artículo 1: "Cuánto cobra Western Union para enviar dinero a República Dominicana hoy"
- [ ] Escribir y publicar Artículo 2: "Remitly vs Western Union para enviar a República Dominicana — comparación real"
- [ ] Escribir y publicar Artículo 3: "La forma más barata de mandar giros a RD en 2025"
- [ ] Configurar next-seo o metadata de Next.js en cada artículo
- [ ] Configurar sitemap.xml automático
- [ ] Configurar robots.txt
- [ ] Verificar propiedad en Google Search Console
- [ ] Configurar WhatsApp Business API (Twilio)
- [ ] Bot responde "tasa" con tipo de cambio DOP/USD del día
- [ ] Bot responde "comparar" con link al comparador
- [ ] Añadir link al grupo de WhatsApp en el sitio web
- [ ] Verificar que los 3 artículos estén indexados en Google

### Etapa 3 — Comunidad inicial y primeras comisiones (Semana 6–8)
- [ ] Publicar primer video de TikTok en español dominicano
- [ ] Publicar mismo video como Reel de Instagram
- [ ] Entrar a 10 grupos de Facebook de dominicanos en NY, FL, NJ, MA
- [ ] Publicar tipo de cambio DOP/USD en grupos de Facebook — todos los días hábiles
- [ ] Compartir link del comparador una vez después de 2 semanas de dar valor
- [ ] Crear grupo de WhatsApp propio: "Tipo de cambio diario — Dominicanos USA"
- [ ] Recibir primeras comisiones de Wise y/o Remitly (aunque sean pequeñas)
- [ ] Documentar en hoja de cálculo: qué canal generó cada clic de afiliado
- [ ] Identificar cuál de los 3 artículos trae más tráfico orgánico
- [ ] Revisar Google Analytics — qué páginas funcionan mejor

---

## PUNTO DE LANZAMIENTO MVP
= Etapas 0 + 1 + 2 completas
= Calculadora funcionando + 3 artículos indexados + afiliados activos + bot WhatsApp
= Etapa 3 es validación del modelo, no requisito del MVP técnico

---

## Métricas de éxito del MVP
- Primera comisión de afiliado recibida: validación del modelo
- 500 visitas únicas en el primer mes: validación del SEO
- 50 personas en el grupo de WhatsApp: validación de comunidad
- 3 artículos indexados en Google: validación del contenido

---

## Lo que el MVP NO incluye (queda para CONTEXTO_FINAL.md)
- App móvil nativa (iOS / Android)
- Sistema de usuarios / login / perfil
- Alertas premium de tipo de cambio ($3/mes)
- Corredor USA → Haití
- Corredor USA → Colombia
- Publicidad directa de operadores (requiere tráfico mínimo de 10K visitas/mes)
- Dashboard de analytics avanzado
- Widget de tasa de cambio para bancos
- Datos y research B2B
- Acuerdo formal con Banreservas
- Conversación con UniTeller
