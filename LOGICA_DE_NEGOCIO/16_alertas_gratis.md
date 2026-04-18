# Proceso 16 — Alertas gratuitas por email (Fase 4.4.A)

## Descripción

Sistema de alertas gratuitas por email que captura leads y genera ingresos por afiliado. Los usuarios se suscriben desde las páginas de tasa histórica por corredor, reciben un email diario con la mejor tasa del día y un link afiliado, y un resumen semanal los lunes. Cumple CAN-SPAM con double opt-in y página de baja obligatoria.

Completado el 2026-04-17 como Fase 4.4.A del roadmap.

## Estado: OPERATIVO (activado 2026-04-17)

Infraestructura 100% activa end-to-end:
- ✅ Tabla `suscriptores_free` creada en Supabase con índices y RLS
- ✅ Endpoint `/api/suscripcion-free` desplegado (POST alta, GET confirmar/baja)
- ✅ Templates Resend bilingües operativos
- ✅ Flujo double opt-in funcional: formulario → email confirmación → token → activación
- ✅ Cron diario en `/api/scrape` envía alertas diarias + newsletter semanal los lunes
- ✅ Página `/[locale]/baja` con CAN-SPAM unsubscribe funcional
- ✅ GA4 evento `suscripcion_free` trackeando conversiones

## Flujo de suscripción (double opt-in)

1. Usuario visita `/[locale]/tasa/usd-hnl` (o cualquier corredor)
2. Ve formulario inline "Recibe la tasa de hoy en tu email"
3. Ingresa email → POST `/api/suscripcion-free` con `{ email, corredor_favorito, idioma }`
4. Backend valida email y corredor, crea registro en `suscriptores_free` con `confirmado=false`
5. Resend envía email de confirmación con `token_confirmacion` único
6. Usuario hace clic → `/[locale]/confirmar-suscripcion?token=xxx`
7. Frontend llama GET `/api/suscripcion-free?action=confirm&token=xxx`
8. Backend marca `confirmado=true`, guarda `fecha_confirmacion`
9. GA4 evento `suscripcion_free` se dispara en confirmación

## Flujo de emails automáticos

### Email diario (todos los días 7AM UTC)
1. Cron Vercel ejecuta `/api/scrape` → scrapers actualizan precios
2. Después de scrapers, ejecuta `sendAlertEmails()` de `lib/email-alerts.ts`
3. Query `suscriptores_free` WHERE `confirmado=true AND activo=true`
4. Para cada suscriptor: busca mejor precio de su `corredor_favorito` (método bank, tasa más alta)
5. Envía email con: tasa del día, nombre del operador, fee, botón verde con link afiliado, link para comparar
6. Delay 200ms entre emails para respetar rate limit de Resend

### Newsletter semanal (lunes)
1. Mismo cron, pero `new Date().getUTCDay() === 1` activa envío semanal
2. Arma tabla resumen: mejor operador por cada uno de los 8 corredores
3. Deduplica por email (un solo digest por persona, no por corredor)
4. Envía email con tabla comparativa de todos los corredores

## Flujo de baja (CAN-SPAM)

1. Cada email incluye link de baja con `token_baja` único
2. Link lleva a `/[locale]/baja?token=xxx`
3. Página llama GET `/api/suscripcion-free?action=unsubscribe&token=xxx`
4. Backend marca `activo=false` — no elimina el registro
5. Página muestra confirmación en el idioma del suscriptor

## Tabla Supabase (activa desde 2026-04-17)

```
suscriptores_free
├── id (BIGINT, identity)
├── email (TEXT, NOT NULL)
├── corredor_favorito (TEXT, NOT NULL)
├── idioma (TEXT, 'es' | 'en')
├── confirmado (BOOLEAN, default false)
├── token_confirmacion (UUID, auto-generated)
├── token_baja (UUID, auto-generated)
├── fecha_alta (TIMESTAMPTZ, default now())
├── fecha_confirmacion (TIMESTAMPTZ, nullable)
├── activo (BOOLEAN, default true)
└── UNIQUE(email, corredor_favorito)
```

Índices activos:
- `idx_suscriptores_free_token_confirmacion` (lookup para confirmar)
- `idx_suscriptores_free_token_baja` (lookup para unsubscribe)
- `idx_suscriptores_free_confirmado_activo` (parcial, filtra suscriptores activos en cron)
- `idx_suscriptores_free_corredor` (segmentación por corredor)

RLS habilitado con policy `suscriptores_public_read` de solo lectura pública. Escritura vía `SUPABASE_SERVICE_ROLE_KEY` que bypasea RLS desde el backend.

## Templates de email

3 templates en `lib/resend.ts`, todos bilingües:

| Template | Subject (es) | Subject (en) | Cuándo se envía |
|----------|-------------|-------------|-----------------|
| Confirmación | "Confirma tu suscripción en PreEnvios" | "Confirm your PreEnvios subscription" | Al registrarse |
| Alerta diaria | "[País]: 1 USD = X.XX [MONEDA] hoy" | "[Country]: 1 USD = X.XX [CURRENCY] today" | Diario 7AM UTC |
| Resumen semanal | "PreEnvios — Resumen semanal de tasas" | "PreEnvios — Weekly rate summary" | Lunes 7AM UTC |

## Archivos creados/modificados

| Archivo | Qué hace |
|---------|----------|
| `lib/resend.ts` | Cliente Resend + 3 templates de email (confirmación, diario, semanal) |
| `lib/email-alerts.ts` | Lógica de envío diario + semanal, queries a Supabase |
| `app/api/suscripcion-free/route.ts` | POST suscribir, GET confirmar/dar de baja |
| `app/api/scrape/route.ts` | Modificado: ahora ejecuta scrapers + emails en secuencia |
| `components/AlertaForm.tsx` | Formulario inline de suscripción con GA4 |
| `app/[locale]/baja/` | Página de unsubscribe (CAN-SPAM) |
| `app/[locale]/confirmar-suscripcion/` | Página de confirmación double opt-in |
| `app/[locale]/tasa/[pair]/tasa-content.tsx` | Modificado: incluye AlertaForm |
| `app/sitemap.ts` | Actualizado con /baja |

## Eventos GA4

- `suscripcion_free` — se dispara cuando el usuario envía el formulario (en AlertaForm.tsx) y cuando confirma (en confirmar-content.tsx)
  - Parámetros: `corredor`, `idioma`, `action` (confirmed)

## Cron integrado

No se usa un cron separado (Vercel Hobby = 1 cron/día). El cron existente `0 7 * * *` en `/api/scrape` ahora:
1. Ejecuta scrapers (precios frescos)
2. Envía alertas diarias a suscriptores confirmados
3. Los lunes también envía newsletter semanal

`maxDuration` subido de 120s a 300s para acomodar emails.

## Pendiente de acción del usuario

- ✅ ~~Ejecutar SQL de `suscriptores_free` en Supabase SQL Editor~~ (completado 2026-04-17)
- Verificar dominio `preenvios.com` en Resend para enviar desde `alertas@preenvios.com` (opcional — actualmente se usa `onboarding@resend.dev` que funciona sin verificación de dominio)
- Agregar RESEND_API_KEY en `.env.local` para desarrollo local
