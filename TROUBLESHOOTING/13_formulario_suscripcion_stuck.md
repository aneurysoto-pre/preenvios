# 13 — Formulario de suscripción stuck en "Sending..."

## Gravedad · Tiempo al fix
🟢 Menor
⏱ Fix típico: 5-15 min

## Síntoma
Usuario llena el formulario de alertas en `/es/tasa/usd-X` o `/es/[pais]`, hace click "Subscribirme gratis" y el botón queda en "Enviando..." sin resolver nunca. Otro síntoma: aparece mensaje "Algo salió mal".

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `/api/suscripcion-free` devuelve 500
Arreglo:
1. DevTools → Network → buscar `suscripcion-free` → ver status
2. Si 500: Vercel Functions logs → revisar error exacto
3. Causas típicas: `SUPABASE_SERVICE_ROLE_KEY` inválida, `RESEND_API_KEY` faltante (para enviar email confirmación), tabla `suscriptores_free` no existe
4. Ir a [06_supabase_errores.md](06_supabase_errores.md) o [07_alertas_email_no_llegan.md](07_alertas_email_no_llegan.md)

### 🎯 Causa 2 — Response no es JSON parseable
Contexto: `components/AlertaForm.tsx:28` hace `const data = await res.json()`. Si el endpoint devuelve HTML (típico en errores 500 sin JSON), `res.json()` throwea y el form cae al catch → `setStatus('error')`.

Arreglo:
1. Verificar response en Network tab → debe ser JSON válido
2. Si es HTML: el endpoint está roto (causa 1)
3. Hardening: en `AlertaForm.tsx` agregar validación:
   ```ts
   const text = await res.text()
   const data = text ? JSON.parse(text) : {}
   ```

### 🎯 Causa 3 — Email ya suscrito (status `already_subscribed`)
Contexto: si el usuario ya está suscrito a ese corredor, el API devuelve 200 con `status: 'already_subscribed'`. El form maneja esto en `AlertaForm.tsx:32` y muestra mensaje "Ya estás suscrito". NO queda stuck.

Arreglo:
1. Si el mensaje aparece: es comportamiento correcto, no es bug
2. Si queda stuck: el response no tiene el shape esperado → verificar en Network

### 🎯 Causa 4 — CORS o mixed content (HTTPS → HTTP)
Arreglo:
1. DevTools → Console → buscar errores CORS
2. Si aparecen: el form está en HTTPS pero el fetch va a HTTP (no debería pasar en Vercel)
3. Hardening: el fetch en AlertaForm usa URL relativa `/api/suscripcion-free` — siempre matchea protocolo. Si hay CORS error, es config server.

### 🎯 Causa 5 — Timeout de fetch (red lenta)
Contexto: `fetch` en browser no tiene timeout por defecto. Si el backend tarda >30s (Supabase + Resend), el usuario ve "Sending..." indefinido.

Arreglo:
1. Vercel Functions logs → duración de `/api/suscripcion-free` — ¿mayor a 10s?
2. Agregar timeout en `AlertaForm.tsx`:
   ```ts
   const controller = new AbortController()
   const timeout = setTimeout(() => controller.abort(), 15000)
   const res = await fetch('/api/suscripcion-free', { signal: controller.signal, /*...*/ })
   clearTimeout(timeout)
   ```
3. Mostrar error al usuario si aborta

### 🎯 Causa 6 — Email regex rechaza un email válido
Contexto: `app/api/suscripcion-free/route.ts:27` usa `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (regex laxo). Acepta `test@d.c` pero también puede rechazar emails unicode válidos tipo `user@exámple.com`.

Arreglo:
1. Si usuario reporta email válido rechazado con "Email inválido": relajar regex o usar librería `email-validator`
2. Cambiar en `app/api/suscripcion-free/route.ts:27`:
   ```ts
   const emailRegex = /^.+@.+\..+$/
   ```

## Workaround mientras arreglas
Pedir al usuario enviar su email a `contact@preenvios.com` manualmente. Agregar el registro a mano en Supabase:
```sql
INSERT INTO suscriptores_free (email, corredor_favorito, idioma, confirmado, activo)
VALUES ('[X]', 'dominican_republic', 'es', true, true);
```

## Relacionados
- [07_alertas_email_no_llegan.md](07_alertas_email_no_llegan.md) — si el flujo email completo está roto
- [06_supabase_errores.md](06_supabase_errores.md) — si la tabla `suscriptores_free` tiene problemas
- [17_suscripcion_free_spam.md](17_suscripcion_free_spam.md) — si ves muchos emails sospechosos en la DB
