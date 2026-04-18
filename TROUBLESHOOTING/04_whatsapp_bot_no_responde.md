# 04 — WhatsApp bot no responde

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
Usuario manda mensaje al WhatsApp de PreEnvios. No recibe respuesta, o siempre recibe el texto de ayuda.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Twilio no configurado (env vars faltantes)
Arreglo:
1. Vercel → Settings → Environment Variables → verificar las 3:
   - `TWILIO_ACCOUNT_SID` (empieza con `AC...`)
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` (formato `whatsapp:+1XXXXXXXXXX`)
2. Si faltan: Twilio Console → Account → API keys & tokens → copiar
3. Pegar en Vercel, redesplegar
4. Verificación: `curl -X POST https://preenvios.vercel.app/api/whatsapp/webhook -d "Body=DOP&From=whatsapp:%2B1234567890"` debe devolver XML TwiML (no 503)

### 🎯 Causa 2 — Webhook URL mal configurado en Twilio
Arreglo:
1. Twilio Console → Messaging → WhatsApp Sandbox (o tu número de producción) → Webhook
2. Debe ser: `https://preenvios.vercel.app/api/whatsapp/webhook`
3. Método: `HTTP POST`
4. Guardar
5. Verificación: mandar "DOP" por WhatsApp → recibir tasa del día RD

### 🎯 Causa 3 — `Body` null en el webhook (cambio de content-type)
Contexto: `app/api/whatsapp/webhook/route.ts:66` parsea `await request.formData().get('Body')`. Twilio envía `application/x-www-form-urlencoded`. Si Twilio cambia a JSON o manda header raro, `Body` llega `null` y el bot siempre responde help.

Arreglo:
1. Vercel → Functions → `/api/whatsapp/webhook` → logs del último request
2. Verificar que `tool_input.command` muestra un POST con body válido
3. Si el body llega vacío: probar con `request.json()` como fallback
4. Editar el route handler para aceptar ambos formatos:
   ```ts
   const contentType = request.headers.get('content-type') || ''
   const data = contentType.includes('json')
     ? await request.json()
     : Object.fromEntries(await request.formData())
   const body = data.Body
   ```

### 🎯 Causa 4 — Texto no matchea `CORREDOR_MAP`
Contexto: el bot acepta solo códigos exactos: DOP, HNL, GTQ, SVC, COP, MXN, NIO, HTG. "Dominican" o "dominicana" NO matchea y cae al help.

Arreglo:
1. Pedir al usuario enviar código exacto (el mensaje de ayuda los lista)
2. Si quieres soportar nombres: editar `app/api/whatsapp/webhook/route.ts` — agregar un mapping de aliases (como tiene el Comparador en `lib/corredores.ts`)

### 🎯 Causa 5 — Supabase lento o caído → timeout Twilio
Contexto: Twilio da 15-30s para responder al webhook. Si Supabase tarda, Twilio cancela y el usuario no recibe nada.

Arreglo:
1. Vercel Functions logs → buscar duraciones >10s en `/api/whatsapp/webhook`
2. Si Supabase responde lento: [06_supabase_errores.md](06_supabase_errores.md)

### 🎯 Causa 6 — Webhook sin validación de firma = mensajes falsos
Esto no causa "no responde" sino "responde a atacantes". Ver [16_webhook_twilio_sin_firma.md](16_webhook_twilio_sin_firma.md).

## Workaround mientras arreglas
Publicar en redes sociales que el bot está en mantenimiento. El sitio web sigue funcionando — dirigir usuarios ahí.

## Relacionados
- [16_webhook_twilio_sin_firma.md](16_webhook_twilio_sin_firma.md) — seguridad del webhook
- [06_supabase_errores.md](06_supabase_errores.md) — si Supabase no responde
