# 07 — Alertas email no llegan

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-30 min

## Síntoma
Usuario se suscribe pero el email de confirmación no llega. O: suscriptores confirmados no reciben la alerta diaria / semanal. O: link de unsubscribe devuelve 404.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `RESEND_API_KEY` faltante o inválida
Contexto: `lib/resend.ts:9` usa `getResend()` lazy. Si la key falta, el cliente se crea pero los sends fallan silenciosamente (no lanza excepción visible al usuario).

Arreglo:
1. Vercel → Settings → Environment Variables → verificar `RESEND_API_KEY` en los 3 entornos
2. Resend dashboard → API Keys → copiar la actual (empieza con `re_`)
3. Pegar en Vercel, redesplegar
4. Verificación: suscribirse con tu email y chequear que el email de confirmación llega

### 🎯 Causa 2 — Email en spam del usuario
Contexto: enviamos desde `onboarding@resend.dev` (subdominio free de Resend, sin verificación). Muchos clientes lo marcan spam por default.

Arreglo:
1. Pedir al usuario revisar carpeta Spam/Promociones
2. Si quieres mejorar deliverability: verificar dominio `preenvios.com` en Resend y cambiar remitente a `alertas@preenvios.com` en `lib/resend.ts:8`
3. Verificación: enviar desde dominio propio tiene tasas de inbox >90%

### 🎯 Causa 3 — Cron de Vercel no terminó de enviar (timeout)
Contexto: `app/api/scrape/route.ts:36` tiene `maxDuration=300`. Si hay >100 suscriptores, Resend rate-limita y el loop de `email-alerts.ts:59-87` nunca termina.

Arreglo:
1. Vercel → Functions → `/api/scrape` → revisar última ejecución
2. Si duración ≈ 300s y `dailySent` < total de suscriptores → timeout
3. Implementar batching: en `lib/email-alerts.ts` enviar en batches de 50 con Promise.all + sleep entre batches
4. O usar Resend Batch API (`resend.batch.send`)

### 🎯 Causa 4 — Suscriptor no confirmado (confirmado=false)
Arreglo:
1. Query Supabase:
   ```sql
   SELECT email, confirmado, activo, fecha_alta
   FROM suscriptores_free
   WHERE email = '[usuario@ejemplo.com]';
   ```
2. Si `confirmado=false`: nunca confirmó → reenviar email de confirmación via POST `/api/suscripcion-free` con su email
3. Si `activo=false`: dio unsubscribe → no enviar más (respetar su decisión)

### 🎯 Causa 5 — Token de baja inválido (unsubscribe 404)
Contexto: si el usuario copia mal el link o el token venció. `token_baja` es UUID permanente hasta que se usa.

Arreglo:
1. Abrir `/[locale]/baja` sin token → mensaje "Falta token"
2. Query:
   ```sql
   SELECT token_baja FROM suscriptores_free WHERE email = '[X]';
   ```
3. Construir link manualmente: `https://preenvios.com/es/baja?token=[UUID]`
4. Si el token ya fue usado (activo=false): la página muestra "Ya diste de baja"

### 🎯 Causa 6 — `onboarding@resend.dev` bloqueado por Resend
Resend tiene cuotas gratuitas estrictas (100 emails/día, 3000/mes). Pasada la cuota, `resend.emails.send()` devuelve error.

Arreglo:
1. Resend dashboard → Logs → buscar "rate limit exceeded" o "quota"
2. Upgrade a plan pago de Resend ($20/mes, 50k emails)
3. O verificar dominio propio (quita límite de subdominio free)

## Workaround mientras arreglas
Enviar email manualmente desde la cuenta `contact@preenvios.com` a suscriptores afectados con la tasa del día.

## Relacionados
- [06_supabase_errores.md](06_supabase_errores.md) — si la tabla `suscriptores_free` tiene problemas
- [13_formulario_suscripcion_stuck.md](13_formulario_suscripcion_stuck.md) — si el formulario queda en "Sending..."
- [LOGICA_DE_NEGOCIO/16_alertas_gratis.md](../LOGICA_DE_NEGOCIO/16_alertas_gratis.md) — flujo completo
