# Proceso 08 — Pipeline de tasas: Scrapfly + Hetzner cartero + Preenvíos

> **Estrategia decidida 2026-04-26 (founder).** Reemplaza el sistema viejo
> de 7 scrapers in-house con proxies rotativos. Aquellos scrapers existen
> todavía en `lib/scrapers/<op>.ts` pero quedan congelados — el cron viejo
> se desactiva en Fase 12.4 (cutover). Plan de implementación con
> checkboxes en CONTEXTO_FINAL.md → Fase 12.

---

## Filosofía del nuevo sistema

**Pagamos a Scrapfly para que haga el trabajo difícil. Nosotros sólo
recibimos los datos limpios y los validamos antes de guardarlos.**

Nadie en Preenvíos toca selectores HTML, proxies, ni captchas. Si una
remesadora cambia su web, lo arregla Scrapfly (vos clickeás 3 veces en su
panel para re-detectar selectores, sin tocar código).

---

## Quién hace qué (3 actores)

### Scrapfly (servicio externo, $30/mes plan Starter)
- Vos antes configuraste **42 "recetas" (schemas)** en su panel web,
  clickeando encima de la tasa, fee y método de cada (operador, corredor).
  Esas recetas quedan guardadas en Scrapfly.
- Cuando alguien le pide a Scrapfly "ejecutá schema wise_honduras", va a
  la web de Wise, bypassa Cloudflare con sus proxies residenciales,
  aplica la receta, y devuelve un JSON limpio con la tasa actual.
- Vos no escribís código para esto. Sólo configurás y mantenés schemas
  desde el dashboard web de Scrapfly.

### Hetzner (servidor "cartero", ya pagado por el bot trading)
- Cada **60 minutos** se despierta solo (cron interno) y le pide a
  Scrapfly: "ejecutá los 42 schemas".
- Scrapfly va a las 7 webs, aplica las recetas, extrae los números, le
  devuelve un JSON limpio.
- Hetzner sólo guarda ese JSON **en memoria** y lo expone en su
  ventanilla HTTPS `/prices` con un Bearer token.
- **Cero parseo, cero lógica de negocio.** Hetzner es un cartero —
  recibe sobres cerrados de Scrapfly y los entrega a Preenvíos cuando
  los pide.
- Si Hetzner reinicia, el próximo cron repuebla la memoria. No hay base
  de datos local que mantener.

### Preenvíos (consumidor)
- Cada cierto tiempo (cron en Vercel) va a la ventanilla de Hetzner con
  su token, recibe el JSON.
- El **Agente 1 valida** que cada tasa esté dentro de ±10% del banco
  central (BCH, BCRD, Banguat, BCR, Banco de la República, Banxico). Lo
  que pasa la validación se guarda en Supabase. Lo que falla se rechaza
  y se registra en `scraper_anomalies` (migración 007 ya activa).
- La web (`/api/precios`) sigue leyendo de Supabase como siempre. Cero
  cambios en el frontend.

---

## El flujo completo en orden

```
┌─ SCRAPFLY (siempre disponible, espera órdenes)
│
├─ 1. HETZNER cron se dispara cada 60 min
│
├─ 2. HETZNER → SCRAPFLY: "ejecutá los 42 schemas"
│
├─ 3. SCRAPFLY va a las 7 webs con sus proxies, bypassa Cloudflare,
│      trae HTML
│
├─ 4. SCRAPFLY aplica las recetas (schemas), extrae tasas/fees/métodos
│
├─ 5. SCRAPFLY → HETZNER: JSON limpio con 42 entries
│      { scrape_id, scraped_at, prices: [...], errors: [...] }
│
├─ 6. HETZNER guarda el JSON en memoria
│
├─ 7. PREENVÍOS cron pregunta a HETZNER /prices con Bearer token
│
├─ 8. HETZNER → PREENVÍOS: el JSON de paso 6
│
├─ 9. AGENTE 1 valida cada tasa: ±10% del banco central, fee ∈ [0,50],
│      operador whitelist, corredor whitelist, etc.
│
├─ 10. SUPABASE guarda lo que pasó la validación (UPSERT)
│       Lo que falló se registra en scraper_anomalies
│
└─ 11. WEB lee de Supabase como siempre (ningún cambio)
```

---

## Cómo sabés que algo se rompió (3 alarmas automáticas)

**No tenés que mirar nada por las dudas. Las alarmas te buscan a vos.**

### Alarma 1 — Sentry (parse failures + scraper_anomaly)

- Si Scrapfly devuelve `null/vacío` para un (operador, corredor) específico
  3 veces seguidas, Hetzner manda evento a Sentry con tag
  `scrapfly_extraction_failed:wise_honduras`.
- Si el Agente 1 rechaza una tasa (fuera de ±10% banco central, fee
  inválido, etc), Preenvíos manda evento a Sentry con tag
  `scraper_anomaly:wise_honduras`.
- Sentry te manda email/notificación al celular según preferencias del
  proyecto Sentry.

### Alarma 2 — Agente 1 + tabla `scraper_anomalies` (ya existe desde 2026-04-22)

- Cada vez que Agente 1 rechaza una tasa, INSERT en `scraper_anomalies`.
- 3+ anomalías consecutivas del mismo (operador, corredor) en la última
  hora → `reportScraperFailure` marca esos precios como `stale=true`
  → la web los esconde del comparador.
- Agente 1 sigue siendo la última línea de defensa antes de escribir en
  Supabase. **No cambia con esta migración.**

### Alarma 3 — Admin dashboard

- `/es/admin/dashboard` muestra cada operador con indicador verde/rojo +
  timestamp de último update exitoso.
- Si Wise Honduras lleva 6 horas sin actualizarse, indicador rojo.
- Widget nuevo "Pipeline status" muestra:
  - Último poll a Hetzner (timestamp)
  - Credits Scrapfly restantes este mes
  - Errores en las últimas 24h
- Email al `contact@preenvios.com` via Resend si algún operador queda
  rojo más de 3h (existente desde Fase 4.4.A — sin cambios).

---

## Cómo lo arreglás cuando se rompe (el trabajo manual real)

### Caso típico: una remesadora cambió su HTML

**Síntoma:** te llega alarma `scrapfly_extraction_failed:wise_honduras`.

**Pasos (5-10 minutos en celular o laptop):**

1. Abrís el panel de Scrapfly (web o app).
2. Buscás el schema `wise_honduras` en la lista.
3. Clickeás **"Re-detectar selectores"** (o "Edit schema" → "Visual mode").
4. Scrapfly te muestra la página actual de Wise.
5. Clickeás encima de la tasa actualizada, del fee, del método.
6. Scrapfly genera los selectores nuevos automáticamente.
7. Clickeás **"Save"** y **"Test"** para verificar que extrae bien.
8. Listo — el próximo cron de Hetzner (siguiente :00 horario) ya usa el
   schema corregido.

**No tocás código de Preenvíos. No hacés deploy. No tocás Supabase.**

### Caso emergencia: Scrapfly no logra bypassear Cloudflare de un operador

**Síntoma:** Sentry alerta `scrapfly_extraction_failed:remitly_*` para
TODOS los corredores de un mismo operador. Probablemente bot detection
escaló.

**Pasos:**

1. En Scrapfly dashboard → schema → "Settings" → activar `render_js: true`
   (cuesta más credits pero usa stealth proxies y JS rendering).
2. Si tampoco funciona → activar feature `Anti-Scraping Protection` de
   Scrapfly (puede requerir bump a plan Pro $100/mes).
3. Si sigue fallando → fallback manual: en `/es/admin/dashboard` cargás
   manualmente la tasa para ese operador (el botón ya existe desde
   Fase 4.4.A). Esa tasa entra a Supabase via `savePrices()` con flag
   `source: 'manual_admin'`.
4. Agendar tarea: revisar el operador en 24-48h cuando bot detection
   relaje.

### Caso: Hetzner se cae

**Síntoma:** Sentry alerta `hetzner_poll_failed` 3 ciclos seguidos.

**Pasos:**

1. SSH al Hetzner.
2. `systemctl status preenvios-scraper`
3. Ver logs: `journalctl -u preenvios-scraper -n 100`
4. `systemctl restart preenvios-scraper`
5. Próximo cron (siguiente :00 horario) repuebla cache.
6. Web sigue mostrando última tasa válida durante el outage. Si pasa
   más de 3h sin update, banner del comparador muestra "Última
   actualización hace Xh".

---

## Cómo configurás todo desde cero (founder setup)

### En Scrapfly (~3 horas, ÚNICA VEZ)

1. Crear cuenta en scrapfly.io
2. Comprar plan Starter ($30/mes)
3. Generar API key, guardarla
4. Configurar billing alert al 70% del cap mensual (en su dashboard,
   protección anti-bill-spike)
5. Crear los 42 schemas (1 por cada combo `operador + corredor`):
   - Vas a la URL pública de la remesadora con el corredor (ej:
     wise.com → enviar a Honduras)
   - En Scrapfly dashboard → "New Schema" → modo visual
   - Clickeás encima de la tasa → Scrapfly captura el selector
   - Clickeás encima del fee → idem
   - Clickeás encima del método (bank, cash pickup, etc) → idem
   - Nombrás el schema: `<operador>_<corredor>` (ej: `wise_honduras`)
   - Test: "Run schema" → debe devolver JSON con tasa, fee, método
   - Save

> **Nota sobre templates:** Scrapfly soporta schemas con parámetros. Si
> el schema base de Wise funciona igual para los 6 corredores cambiando
> sólo la URL, podés tener **1 schema por operador (7 schemas)** en vez
> de 42. Lo verificás cuando armes el primero. Si no soporta, son 42
> schemas — todavía es trabajo de un fin de semana.

### En Hetzner (Claude lo automatiza, founder sólo da acceso SSH)

Claude ejecuta:
- Crear `/opt/preenvios-scraper/` con package.json + index.ts (~80 líneas)
- Crear systemd unit `/etc/systemd/system/preenvios-scraper.service`
  con `MemoryMax=512M CPUWeight=50` (no roba recursos al bot trading)
- Configurar Caddy (subdominio HTTPS automático con Let's Encrypt)
- Env vars en `/etc/preenvios-scraper.env`:
  - `SCRAPFLY_API_KEY=<key del paso anterior>`
  - `HETZNER_SHARED_SECRET=<random 32 bytes>`
  - `SCRAPE_INTERVAL_MIN=60`
- `systemctl enable + start preenvios-scraper`
- Smoke test: `curl https://<subdominio>/health` → debe devolver 200

### En Vercel (Claude lo automatiza)

- Env vars en Vercel (prod + preview):
  - `HETZNER_API_URL=https://<subdominio>/prices`
  - `HETZNER_SHARED_SECRET=<mismo del paso anterior>`
- Crear endpoint `app/api/scrape/poll-hetzner/route.ts`
- Vercel cron en `vercel.json` cada 60 min
- Wiring a `savePrices()` (que ya pasa por Agente 1 — sin cambios)
- Sentry instrumentation: cada poll loggea `scrape_id` para correlación

---

## Por qué elegimos esta opción (Opción B — Schema-based extraction)

Scrapfly ofrece varios modos de extracción. Comparamos:

| Modo | Mantenimiento | Costo aprox. | Cuándo se rompe |
|---|---|---|---|
| **Opción A — AI Extraction** (le decís en lenguaje natural "extrae tasa y fee") | Cero | Alto (~50 credits/call → plan Enterprise $300-500/mes con nuestro volumen) | Casi nunca |
| **Opción B — Schema-based** (selectores en panel Scrapfly, NO en código) | Bajo (clickeo, no código) | Medio (~5 credits/call → plan Starter $30/mes) | Cuando el sitio cambia, editás en su panel web |
| ❌ Opción C — HTML crudo + parser nuestro | Alto (mantenemos selectores en código) | Barato (~1 credit/call) | Constantemente |

**Decisión 2026-04-26 (founder):** Opción B.

**Justificación:** Opción A es ideal en mantenimiento pero el costo
escala feo con 42 combos × cada 60 min. Opción B mantiene el espíritu
"que lo haga Scrapfly" (los selectores los editás clickeando en su web,
no en código) y entra en plan Starter.

**Opción C descartada explícitamente** porque era el sistema viejo —
mantenemos los 7 scrapers en `lib/scrapers/<op>.ts` como código congelado
hasta cutover, después se mueve a `lib/scrapers/_legacy/` o se elimina.

---

## Opción A — Backup plan documentado (NO implementar hoy)

**Cuándo migrar a A:**
1. Si la corrección de selectores en Opción B se vuelve frecuente — más
   de 1 vez por semana por operador.
2. Si el volumen crece mucho — ej. 20 corredores × 30 remesadoras = 600
   combos. A esa escala, mantener schemas manuales no escala.
3. Si los operadores empiezan a hacer cambios HTML masivos (tested A/B,
   redesigns frecuentes).

**Qué cambiaría:**

- En Scrapfly dashboard, cambiás el modo de cada schema de "Schema-based"
  a "AI Extraction" / "Auto Extract". Le pasás un prompt:
  ```
  Extract the following fields from this remittance provider page:
  - rate: numeric exchange rate (USD to local currency)
  - fee: numeric fee in USD
  - delivery_method: one of [bank, cash_pickup, mobile_wallet, home_delivery]
  - delivery_speed: one of [seconds, minutes, hours, days]
  Return as JSON.
  ```
- Scrapfly usa LLMs internamente para extraer aunque el HTML cambie.
- Costo escala — confirmar que volumen justifica plan más alto antes
  de migrar.

**Cero cambios en Hetzner ni Preenvíos.** El JSON que recibe Hetzner es
idéntico (mismo formato), la única diferencia es cómo Scrapfly lo extrae
internamente. Es un cambio invisible para el resto del pipeline.

**Tiempo de migración estimado:** 4-6 horas (re-configurar 42 schemas en
Scrapfly + actualizar plan + smoke test). Cero código.

**Costo estimado de la migración:**
- Plan Pro Scrapfly $100-300/mes (verificar al momento)
- Sin costo de desarrollo (ya hicimos la infraestructura)

---

## Por qué decidimos NO arreglar los scrapers in-house viejos

El plan diferido en [Proceso 28](28_scrapers_plan_diferido.md) proponía
arreglar los 7 scrapers in-house con proxies residenciales (ScraperAPI
$49/mes o Webshare $3/mes). Quedó **descartado** el 2026-04-26 por:

1. **Mantenimiento eterno.** Cada cambio de HTML del operador (mensual o
   más frecuente) requería editar `lib/scrapers/<op>.ts`, redeployar,
   testear. Trabajo sin fin del founder.
2. **Cat-and-mouse con bot detection.** WU/Remitly bloquean por IP →
   compramos proxies → ellos detectan proxies → compramos otros →
   loop infinito.
3. **Mismo costo.** $30 Scrapfly vs $49 ScraperAPI + tiempo de
   mantenimiento. No hay ahorro real.
4. **Filosofía del founder:** "para eso le pago al servicio". Si pagamos
   $30/mes, queremos que el problema no exista, no que lo gestionemos.

Proceso 28 queda como referencia histórica con banner de obsolescencia.

---

## Idempotencia y separación DB preview vs prod

**Sin cambios respecto al sistema viejo:**

- `savePrices()` hace UPSERT por `(operador, corredor)` — múltiples polls
  no duplican filas.
- Hetzner es agnóstico al entorno. Vercel preview cron y Vercel prod cron
  consumen el mismo Hetzner, pero `savePrices()` lee la env var
  `DATABASE_URL` que está separada por scope (proyecto Supabase
  `preenvios-preview` vs `preenvios` per Proceso 27).
- Preview y prod ven las mismas tasas. La separación es a nivel de DB
  destino, no de fuente.

---

## Archivos que existen post-cutover (Fase 12 completa)

| Archivo | Qué hace |
|---|---|
| **Hetzner** | |
| `/opt/preenvios-scraper/index.ts` | Servicio Node, cron interno, fetch Scrapfly, cache memoria, GET /prices |
| `/opt/preenvios-scraper/package.json` | Deps mínimas: scrapfly-sdk, fastify, node-cron |
| `/etc/systemd/system/preenvios-scraper.service` | systemd unit con cgroup limits |
| `/etc/preenvios-scraper.env` | Env vars (no commiteado) |
| `/etc/caddy/Caddyfile` | Reverse proxy con TLS automático |
| **Preenvíos (repo)** | |
| `app/api/scrape/poll-hetzner/route.ts` | Endpoint Vercel cron — consume Hetzner |
| `vercel.json` | Schedule cron cada 60 min apuntando al endpoint nuevo |
| `lib/scrapers/validator.ts` | **Sin cambios** — Agente 1 ya operativo desde 2026-04-22 |
| `lib/scrapers/_legacy/<op>.ts` | (post-cleanup) scrapers viejos archivados |
| `app/api/admin/dashboard/route.ts` | Widget pipeline status agregado |

---

## Relacionado

- Plan de implementación con checkboxes: **CONTEXTO_FINAL.md → Fase 12**
- Plan diferido obsoleto: [Proceso 28](28_scrapers_plan_diferido.md)
- Agente 1 (validador): [Proceso 24](24_agente_validador_ingress.md)
- Separación DB preview vs prod: [Proceso 27](27_db_preview_vs_produccion.md)
- Flujo end-to-end de precios (vista web): [Proceso 13](13_flujo_precios_end_to_end.md)
