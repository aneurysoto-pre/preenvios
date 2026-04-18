# 16 — Webhook Twilio sin validación de firma (🔒 seguridad)

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 20 min

## Síntoma
`app/api/whatsapp/webhook/route.ts` acepta cualquier POST sin verificar el header `X-Twilio-Signature`. Un atacante puede:
- Postear mensajes fake al webhook con `Body`, `From`, `To` arbitrarios
- Triggear respuestas a números arbitrarios (el bot responde con TwiML que Twilio procesa)
- Saturar Supabase con queries falsas (abuso de rate)

Detección: ejecutar desde cualquier terminal:
```bash
curl -X POST https://preenvios.vercel.app/api/whatsapp/webhook \
  -d "Body=DOP&From=whatsapp:%2B10000000000&To=whatsapp:%2B1XXXXXXXXXX"
```
Si responde con TwiML válido: el webhook está abierto.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — No se valida `X-Twilio-Signature`
Arreglo:
1. `npm install twilio`
2. Editar `app/api/whatsapp/webhook/route.ts`:
   ```ts
   import twilio from 'twilio'

   export async function POST(request: NextRequest) {
     const authToken = process.env.TWILIO_AUTH_TOKEN
     if (!authToken) {
       return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
     }

     const signature = request.headers.get('x-twilio-signature')
     if (!signature) {
       return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
     }

     const url = `https://preenvios.vercel.app${request.nextUrl.pathname}`
     const formData = await request.formData()
     const params: Record<string, string> = {}
     formData.forEach((v, k) => { params[k] = v.toString() })

     const isValid = twilio.validateRequest(authToken, signature, url, params)
     if (!isValid) {
       return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
     }

     // resto del código usa params.Body, params.From, etc.
   }
   ```
3. Commit + push
4. Verificación:
   - `curl -X POST https://preenvios.vercel.app/api/whatsapp/webhook -d "Body=DOP"` → debe devolver `401`
   - Mandar WhatsApp real al número de Twilio → debe responder normalmente

### 🎯 Causa 2 — `TWILIO_AUTH_TOKEN` faltante en Vercel
Tras aplicar el fix anterior, si la env var falta el webhook devuelve 500. Twilio hace retries automáticos pero eventualmente abandona.

Arreglo:
1. Twilio Console → Account → API keys & tokens → copiar Auth Token (primary, el que empieza con hash hex)
2. Vercel → Settings → Environment Variables → agregar `TWILIO_AUTH_TOKEN` en los 3 entornos
3. Redesplegar

### 🎯 Causa 3 — URL de validación no matchea
Contexto: `twilio.validateRequest` hashea `URL + params + authToken`. Si la URL que le pasas no es exactamente la misma que Twilio llama (ej. protocolo, trailing slash), falla.

Arreglo:
1. Vercel Functions logs → ver qué URL completa Twilio está llamando
2. Ajustar el parámetro `url` del `validateRequest` para que coincida exactamente
3. Si hay proxy/rewrites: usar `request.headers.get('x-forwarded-proto')` y `x-forwarded-host`

### 🎯 Causa 4 — Deduplicar mensajes (opcional, defense-in-depth)
Contexto: aun con firma válida, Twilio puede reintentar el mismo mensaje 3 veces si tu endpoint tarda. Sin dedup, procesas 3 veces.

Arreglo:
1. Usar `MessageSid` que Twilio envía en cada request como idempotency key
2. Guardar en Upstash Redis con TTL 1h:
   ```ts
   const messageSid = params.MessageSid
   const seen = await redis.set(`twilio:${messageSid}`, '1', { ex: 3600, nx: true })
   if (!seen) return new Response('<Response></Response>') // duplicado, ignora
   ```

## Workaround mientras arreglas
Desactivar el webhook temporalmente: en Twilio Console → Messaging → cambiar webhook URL a uno dummy (ej. `https://preenvios.vercel.app/404`). El bot deja de responder pero nadie puede abusar.

## Relacionados
- [04_whatsapp_bot_no_responde.md](04_whatsapp_bot_no_responde.md) — problemas operativos del bot
- [LOGICA_DE_NEGOCIO/09_whatsapp_bot.md](../LOGICA_DE_NEGOCIO/09_whatsapp_bot.md) — flujo completo
