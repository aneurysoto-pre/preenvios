# 18 — Headers de seguridad globales faltantes (🔒 seguridad)

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 20 min

## Síntoma
Dos evidencias:
1. En https://securityheaders.com pegar `https://preenvios.com` → grade C o peor (sin CSP, HSTS, etc.)
2. DevTools → Network → cualquier request → Response Headers → faltan: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

Consecuencias:
- Sitio se puede embeber en iframes de terceros (clickjacking)
- Sin HSTS: primer request HTTP puede ser interceptado
- Sin CSP: XSS via contenido no validado ejecuta scripts arbitrarios
- Respuestas 500 de APIs leakean `error.message` con detalles internos de Supabase

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — `next.config.ts` sin configuración de headers
Arreglo:
1. Editar `next.config.ts`:
   ```ts
   const securityHeaders = [
     { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
     { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
     { key: 'X-Content-Type-Options', value: 'nosniff' },
     { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
     { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
     {
       key: 'Content-Security-Policy',
       value: [
         "default-src 'self'",
         "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.brandfetch.io",
         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
         "font-src 'self' https://fonts.gstatic.com",
         "img-src 'self' data: https://cdn.brandfetch.io https://flagcdn.com",
         "connect-src 'self' https://dlblmquoasgoxnzclgyb.supabase.co https://www.google-analytics.com",
         "frame-ancestors 'self'",
       ].join('; '),
     },
   ]

   const nextConfig = {
     async headers() {
       return [{ source: '/:path*', headers: securityHeaders }]
     },
     // resto de la config existente
   }
   ```
2. `npm run build` local para verificar que el build pasa
3. Commit + push
4. Verificación:
   - https://securityheaders.com → debe dar grade A o A+
   - DevTools → verificar que los headers aparecen en todas las respuestas

### 🎯 Causa 2 — Error responses leakeando `error.message` de Supabase
Contexto: varios endpoints retornan `{ error: error.message }` (ej. `app/api/admin/precios/route.ts:38,60`, `app/api/precios/route.ts:30`, `app/api/corredores/route.ts:17`, `app/api/tasas-banco-central/route.ts:15`). Supabase devuelve errores como "violates unique constraint on (operador, corredor)" — expone estructura de DB.

Arreglo:
1. En cada route handler, reemplazar `error.message` por mensaje genérico + loguear el real:
   ```ts
   if (error) {
     console.error('precios API error:', error)
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
   ```
2. En admin endpoints puedes ser más explícito porque solo admin los consume, pero aún así evitar leakear constraint names
3. Verificar en el front que no muestras ese mensaje genérico de mala forma (ej. AlertaForm ya muestra "Algo salió mal")

### 🎯 Causa 3 — CSP demasiado permisivo (`unsafe-inline`)
Contexto: el CSP del fix anterior incluye `'unsafe-inline'` para scripts porque Next.js inyecta inline scripts en SSR. Es el compromiso default.

Arreglo (hardening futuro):
1. Usar CSP con `nonce` por request (Next.js middleware genera nonce, lo pasa a `<Script nonce={...}>`)
2. Complejidad: requiere refactor de cada `<Script>` del layout
3. Diferir a cuando el sitio tenga tráfico real — no urgente

### 🎯 Causa 4 — HSTS preload pendiente
Tras aplicar el header, registrar el dominio en https://hstspreload.org para que browsers siempre usen HTTPS sin el primer request HTTP.

Requisitos:
- HSTS con `max-age ≥ 63072000` (2 años) ✓
- `includeSubDomains` ✓
- `preload` directive ✓
- HTTPS válido en todos los subdominios

## Workaround mientras arreglas
No hay workaround — es un hardening preventivo. El sitio funciona igual sin los headers, solo que es más vulnerable a ataques indirectos.

## Relacionados
- [14_endpoint_cron_expuesto.md](14_endpoint_cron_expuesto.md) — otros problemas de seguridad
- [15_admin_login_vulnerable.md](15_admin_login_vulnerable.md)
