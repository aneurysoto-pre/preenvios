# Troubleshooting 04 — WhatsApp bot no responde

## Síntomas
- El usuario envía mensaje al número de WhatsApp y no recibe respuesta
- Twilio reporta errores en el webhook

## Causas comunes

### Causa 1: Twilio no está configurado
**Diagnóstico:**
1. Verificar que las env vars existen en Vercel: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
2. Si no existen → Twilio no se ha configurado todavía

**Solución:** Crear cuenta Twilio y configurar las 3 env vars

### Causa 2: Webhook URL incorrecta en Twilio
**Diagnóstico:**
1. Twilio console → Messaging → WhatsApp Sandbox → verificar webhook URL
2. Debe ser: `https://preenvios.vercel.app/api/whatsapp/webhook` (POST)

**Solución:** Actualizar la URL del webhook en Twilio console

### Causa 3: El endpoint responde error
**Diagnóstico:**
1. Probar: `curl -X POST https://preenvios.vercel.app/api/whatsapp/webhook -d "Body=DOP&From=+1234567890"`
2. Verificar respuesta — debe devolver TwiML XML

**Solución:**
1. Si devuelve 503 → Twilio no configurado (env vars faltantes)
2. Si devuelve 500 → error de código, revisar Vercel logs
3. Si devuelve XML vacío → el texto enviado no matchea ningún corredor

### Causa 4: Supabase no responde
**Diagnóstico:**
1. El webhook necesita leer precios de Supabase
2. Si Supabase está caído, el bot devuelve "No hay tasas disponibles"

**Solución:** Ver [06_supabase_errores.md](06_supabase_errores.md)

## Proceso paso a paso
```
1. ¿Twilio está configurado? (env vars en Vercel)
2. ¿Webhook URL correcta en Twilio console?
3. curl al endpoint → ¿responde TwiML?
4. Vercel logs → ¿errores en /api/whatsapp/webhook?
5. Supabase → ¿responde la tabla precios?
```
