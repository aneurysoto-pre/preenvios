# Troubleshooting 01 — Un scraper individual deja de funcionar

## Síntomas
- El panel admin (`/admin` → Dashboard) muestra un operador en **rojo** (stale)
- El endpoint `/api/admin/dashboard` reporta el operador en `staleOperators`
- Los precios de ese operador no se actualizan (timestamp viejo en `actualizado_en`)
- El comparador sigue mostrando precios viejos para ese operador (no se rompe, pero se desactualiza)

## Causas más probables (en orden de frecuencia)

### Causa 1: HTML/API de la web cambió (más común)
**Diagnóstico:**
1. Abre la URL del operador manualmente en el navegador (ej: `https://www.remitly.com/us/en/honduras`)
2. Abre las DevTools → Network → busca requests de pricing/API
3. Compara la estructura de la respuesta con lo que el scraper espera
4. Si la respuesta cambió (nuevos campos, diferente formato JSON, nuevo endpoint), el scraper no puede parsear

**Solución:**
1. Abre `lib/scrapers/[operador].ts`
2. Actualiza la URL del endpoint si cambió
3. Actualiza los campos que se extraen del JSON (ej: `data.exchangeRate` → `data.rate`)
4. Prueba localmente: `curl [URL] -H "User-Agent: PreenviosBot/1.0 contact@preenvios.com"`
5. Commit y push — Vercel re-deploya automáticamente

### Causa 2: Operador agregó captcha/protección anti-bot
**Diagnóstico:**
1. Ejecuta manualmente: `curl -v [URL] -H "User-Agent: PreenviosBot/1.0 contact@preenvios.com"`
2. Si recibes 403, 429, o HTML con captcha en lugar de JSON → protección activa
3. Revisa si el endpoint devuelve un redirect a una página de verificación

**Solución:**
1. **Corto plazo:** Actualizar tasas manualmente vía panel admin → tab Tasas → Editar
2. **Mediano plazo:** Configurar proxy rotativo (Bright Data o ScraperAPI)
3. **Largo plazo:** Contactar al operador para acceso API directo (cuando haya volumen)

### Causa 3: IP bloqueada (requiere proxy)
**Diagnóstico:**
1. El scraper devuelve HTTP 403 o 429 consistentemente
2. Funciona desde tu navegador personal pero no desde Vercel
3. Los logs de Vercel muestran `HTTP 403 — likely needs proxy`

**Solución:**
1. Configurar proxy rotativo en el scraper:
   - Contratar Bright Data o ScraperAPI ($10-30/mes)
   - Agregar `PROXY_URL` a las env vars de Vercel
   - Modificar `base.ts` para usar el proxy en fetch
2. Mientras tanto: actualización manual vía panel admin

### Causa 4: Web del operador caída temporalmente
**Diagnóstico:**
1. Abre la web del operador en el navegador — ¿carga?
2. Prueba con `curl -s -o /dev/null -w "%{http_code}" [URL]` — ¿devuelve 200?
3. Si devuelve 5xx → la web está caída, no es tu culpa

**Solución:**
1. Esperar — el sistema de fallback marca los precios como "desactualizados" después de 3 fallos
2. El cron reintenta cada 2 horas automáticamente
3. No hacer nada — cuando la web vuelva, el siguiente cron actualizará

### Causa 5: Cambio de endpoint de API
**Diagnóstico:**
1. El fetch devuelve 404 (Not Found) en lugar de 200
2. La URL anterior del API ya no existe
3. Revisar DevTools del navegador en la web del operador para encontrar el nuevo endpoint

**Solución:**
1. Encontrar el nuevo endpoint usando DevTools → Network → buscar requests tipo `/api/pricing`, `/rates`, `/estimate`
2. Actualizar la URL en `lib/scrapers/[operador].ts`
3. Verificar el formato de respuesta del nuevo endpoint
4. Commit y push

## Proceso paso a paso cuando detectas un scraper rojo

```
1. Entrar al panel admin → ver qué operador está en rojo
2. Revisar Vercel logs: vercel.com → Functions → /api/scrape
3. Identificar el error (HTTP status, parse error, etc.)
4. Abrir la web del operador en navegador → verificar que funciona
5. Si funciona en navegador pero no en scraper → causa 1, 2, o 3
6. Si no funciona en ningún lado → causa 4
7. Mientras se arregla: actualizar manualmente en admin → Tasas → Editar
8. Arreglar el scraper → commit → push → Vercel re-deploya
9. Ejecutar scrapers desde admin → "Ejecutar scrapers ahora"
10. Verificar que el operador pasa a verde
```

## Relacionado
- Flujo completo de precios: [LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md](../LOGICA_DE_NEGOCIO/13_flujo_precios_end_to_end.md)
- Cuando todos fallan: [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md)
