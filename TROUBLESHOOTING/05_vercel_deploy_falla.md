# 05 — Vercel deploy falla

## Gravedad · Tiempo al fix
🔴 Crítico
⏱ Fix típico: 5-15 min

## Síntoma
Vercel → Deployments muestra el último deploy en rojo `Error` o `Failed`. El sitio no se actualiza después de un `git push`.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Error de TypeScript o lint
Arreglo:
1. Vercel dashboard → Deployments → click en el fallido → Build Logs
2. Buscar línea con `Type error:` o `error TS`
3. Reproducir local: `npm run build` (en `c:/Users/ethan/preenvios/preenvios`)
4. Arreglar error, commit, push
5. Verificación: nuevo deploy pasa a `Ready`

### 🎯 Causa 2 — Variable de entorno faltante en runtime
Contexto: el build pasa pero el sitio muestra 500 al cargar. Típico cuando se agrega código que usa `process.env.X` y no se agregó `X` a Vercel env vars. Los `NEXT_PUBLIC_*` deben estar presentes en BUILD time.

Arreglo:
1. Abrir el sitio → ver error en consola del navegador
2. Vercel → Settings → Environment Variables → verificar todas:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_GA_ID`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CRON_SECRET`
   - `RESEND_API_KEY`
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
3. Agregar la que falte en los 3 entornos (Production, Preview, Development)
4. Redesplegar

### 🎯 Causa 3 — Lazy init rompe en build time
Contexto: pasó con Resend. `new Resend(process.env.X)` en top-level se ejecuta en build, si X no existe en build falla. Ver [lib/resend.ts](../lib/resend.ts) — se arregló con `getResend()` lazy.

Arreglo:
1. Build logs → "Missing API key" o similar
2. Envolver la inicialización en función lazy:
   ```ts
   let _client: Client | null = null
   function getClient() { if (!_client) _client = new Client(process.env.X); return _client }
   ```
3. Commit, push

### 🎯 Causa 4 — `useSearchParams` sin Suspense
Contexto: Next.js 16 requiere `<Suspense>` wrapping cuando un Client Component usa `useSearchParams()`. Si falta, el build de páginas estáticas falla.

Arreglo:
1. Build logs → "useSearchParams() should be wrapped in a suspense boundary"
2. Wrappear el componente:
   ```tsx
   import { Suspense } from 'react'
   export default function Page() {
     return <Suspense><MyClientComponent /></Suspense>
   }
   ```

### 🎯 Causa 5 — `vercel.json` inválido
Arreglo:
1. `cat vercel.json` — validar JSON con `jq . vercel.json`
2. No incluir campos custom como `$comment` (Vercel rechaza)
3. Cron schedule debe ser válido: `"0 7 * * *"` (diario) en plan Hobby

### 🎯 Causa 6 — Deploy no arrancó (webhook GitHub roto)
Arreglo:
1. Vercel → Deployments → última fila debe ser del último push
2. Si no aparece: Vercel → Settings → Git → Reconectar con GitHub
3. O forzar deploy manual: `git commit --allow-empty -m "redeploy"` + push

## Workaround mientras arreglas
Vercel → Deployments → buscar último deploy `Ready` → click `...` → Promote to Production. El sitio vuelve a la versión anterior funcional.

## Relacionados
- [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) — si el deploy pasa pero los scrapers no corren después
