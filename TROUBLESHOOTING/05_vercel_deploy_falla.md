# Troubleshooting 05 — Vercel deploy falla

## Síntomas
- Push a main pero el sitio no se actualiza
- Vercel dashboard muestra deploy con status "Error" o "Failed"
- Preview URL no funciona

## Causas comunes

### Causa 1: Error de TypeScript en build
**Diagnóstico:**
1. Vercel dashboard → Deployments → click en el deploy fallido → Build Logs
2. Buscar línea con "Type error" o "Build failed"

**Solución:**
1. Correr `npm run build` localmente para reproducir el error
2. Arreglar el error de TypeScript
3. Push de nuevo

### Causa 2: Dependencia faltante
**Diagnóstico:**
1. Build logs muestran "Module not found" o "Cannot find package"

**Solución:**
1. Verificar `package.json` — ¿el package está listado?
2. `npm install [package]` y commit package.json + package-lock.json

### Causa 3: Environment variable faltante
**Diagnóstico:**
1. Build compila pero el sitio muestra errores en runtime
2. La variable funciona en local pero no en Vercel

**Solución:**
1. Vercel → Settings → Environment Variables → verificar que todas existen
2. Variables con prefijo `NEXT_PUBLIC_` están disponibles en cliente
3. Variables sin prefijo solo están disponibles en server/API routes

### Causa 4: Vercel timeout en build
**Diagnóstico:**
1. Build logs muestran "Build exceeded maximum duration"

**Solución:**
1. Optimizar el build — revisar si hay imports circulares
2. Verificar que `node_modules` no se está commiteando (está en `.gitignore`)

## Proceso paso a paso
```
1. Vercel dashboard → Deployments → ¿último deploy exitoso?
2. Si failed → click → Build Logs → leer error exacto
3. Reproducir localmente: npm run build
4. Arreglar → push → verificar nuevo deploy
5. Si persiste: Vercel → Settings → verificar env vars
```
