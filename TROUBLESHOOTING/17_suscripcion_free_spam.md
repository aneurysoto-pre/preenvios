# 17 — Suscripción free vulnerable a spam (🔒 seguridad)

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 30 min

## Síntoma
Uno o más de estos:
- `SELECT count(*) FROM suscriptores_free WHERE fecha_alta > now() - interval '1 hour'` devuelve 500+
- Cuota de Resend se consume anormalmente rápido
- Emails de confirmación a addresses que no se parecen a usuarios reales (`xyz@mailinator.com`, random chars)
- Resend dashboard → Logs muestra burst de sends a un mismo dominio sospechoso

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `POST /api/suscripcion-free` sin rate limit
Contexto: `app/api/suscripcion-free/route.ts:16-110` acepta cualquier POST sin límite. Un script puede registrar 1000 emails/min.

Arreglo:
1. Instalar Upstash Redis (gratis hasta 10k req/día): https://upstash.com
2. Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
3. `npm install @upstash/ratelimit @upstash/redis`
4. Editar `app/api/suscripcion-free/route.ts`:
   ```ts
   import { Ratelimit } from '@upstash/ratelimit'
   import { Redis } from '@upstash/redis'

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(3, '1 h'),
   })

   export async function POST(request: NextRequest) {
     const ip = request.headers.get('x-forwarded-for') || 'unknown'
     const { success } = await ratelimit.limit(`subscribe:${ip}`)
     if (!success) {
       return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
     }
     // resto del código
   }
   ```
5. Commit + push
6. Verificación: 4 POST desde la misma IP en 1h → 429

### 🎯 Causa 2 — Regex de email muy laxo
Contexto: `app/api/suscripcion-free/route.ts:27` acepta `test@d.c`, `a@b.c`. Un atacante puede spammear emails inválidos que consumen Resend sin llegar a nadie real.

Arreglo:
1. Usar regex más estricto O usar librería:
   ```bash
   npm install email-validator
   ```
   ```ts
   import * as EmailValidator from 'email-validator'
   if (!EmailValidator.validate(email)) {
     return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
   }
   ```
2. Opcional: bloquear dominios desechables (mailinator, temp-mail, etc.) con una lista

### 🎯 Causa 3 — Limpiar suscriptores spam existentes
Arreglo (si ya fuiste víctima):
1. Query para detectar patrones sospechosos:
   ```sql
   -- Emails nunca confirmados, registrados en menos de 1 hora desde la misma ventana de tiempo
   SELECT email, fecha_alta FROM suscriptores_free
   WHERE confirmado = false
     AND fecha_alta > now() - interval '7 days'
   ORDER BY fecha_alta DESC;
   ```
2. Borrar los sospechosos:
   ```sql
   DELETE FROM suscriptores_free
   WHERE confirmado = false
     AND fecha_alta < now() - interval '7 days';
   ```
   (un usuario legítimo que no confirma en 7 días probablemente no va a confirmar)
3. Agregar job de limpieza automática (puede ir en el cron `/api/scrape`):
   ```ts
   await supabaseAdmin.from('suscriptores_free')
     .delete()
     .eq('confirmado', false)
     .lt('fecha_alta', new Date(Date.now() - 7*24*60*60*1000).toISOString())
   ```

### 🎯 Causa 4 — CAPTCHA opcional (defense in depth)
Si el spam persiste tras rate limit: agregar hCaptcha o Cloudflare Turnstile (gratis) al `AlertaForm.tsx`. Pero empieza con rate limit — suele ser suficiente.

### 🎯 Causa 5 — Monitoring activo
Para detectar abuso antes de que consuma cuota Resend:
1. En Supabase dashboard → crear función programada que revise count/hora y alerte por email si excede umbral
2. O agregar métrica en `/api/admin/dashboard` que muestre suscriptores nuevos en últimas 24h

## Workaround mientras arreglas
Desactivar el formulario temporalmente: en `components/AlertaForm.tsx` retornar `null` al inicio hasta tener rate limit. Los usuarios no pueden suscribirse pero tampoco el atacante.

## Relacionados
- [07_alertas_email_no_llegan.md](07_alertas_email_no_llegan.md) — problemas operativos del flujo email
- [13_formulario_suscripcion_stuck.md](13_formulario_suscripcion_stuck.md) — problemas del form desde UI
