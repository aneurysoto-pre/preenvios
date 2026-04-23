# Proceso 28 — Scrapers rotos post-2026-04-17: plan diferido hasta post-LLC

## ⚠️ Alerta crítica para quien lea este proyecto

**Antes de confiar en checkboxes `[x]` de scrapers en cualquier otro documento:**
las fases marcadas como "completadas" de scrapers (Fase 2 entera, Fase 8 MX/CO,
Fase 9.1 Agente 1) significan que el CÓDIGO existe y se escribió en su momento,
NO que los scrapers funcionan en producción hoy. Desde el 2026-04-17 los 7
scrapers MVP fallan al primer byte por cambios en las APIs internas de los
operadores. Ver sección "Fases marcadas `[x]` que requieren revisión" abajo.

## Resumen ejecutivo

El 2026-04-23 se descubrió que la columna `actualizado_en` de la tabla `precios`
en Supabase producción no cambia desde el 2026-04-17 — 6 días de data stale.
Un smoke test ejecutando `/api/scrape` manualmente confirmó que los 7 scrapers
MVP fallan inmediatamente (~1.7s total) por cambios en las APIs internas de los
operadores. Retornan 200 OK por el handler, pero `saved=0` silenciosamente.

**Decisión tomada (2026-04-23):** NO arreglar los scrapers ahora. Diferir hasta
post-LLC + aprobación en programas de afiliado (Impact, Partnerize, FlexOffers).

## Evidencia del problema

### JSON completo del run manual 2026-04-23 10:00 UTC

```json
{
  "timestamp": "2026-04-23T14:24:47.645Z",
  "scrapers": {
    "totalSaved": 0,
    "totalErrors": 7,
    "totalDuration_ms": 1706,
    "results": [
      { "operador": "wise",         "saved": 0, "errors": ["wise: HTTP 401"],                              "duration_ms": 210 },
      { "operador": "ria",          "saved": 0, "errors": ["ria: HTTP 404"],                               "duration_ms": 163 },
      { "operador": "xoom",         "saved": 0, "errors": ["xoom: HTTP 401"],                              "duration_ms": 227 },
      { "operador": "worldremit",   "saved": 0, "errors": ["worldremit: HTTP 404"],                        "duration_ms": 482 },
      { "operador": "remitly",      "saved": 0, "errors": ["remitly: HTTP 404 — may need proxy"],          "duration_ms": 279 },
      { "operador": "moneygram",    "saved": 0, "errors": ["moneygram: HTTP 404"],                         "duration_ms": 263 },
      { "operador": "westernunion", "saved": 0, "errors": ["westernunion: HTTP 403 — likely needs proxy"], "duration_ms": 82 }
    ]
  }
}
```

### Categorización de errores

| Tipo | Operadores | Causa raíz |
|------|------------|------------|
| **HTTP 401** (auth requerida) | Wise, Xoom | Endpoints internos ahora exigen API key o session token que el scraper no provee. |
| **HTTP 404** (URL no existe) | Ria, WorldRemit, Remitly, MoneyGram | Los paths `/api/pricing/estimate` y similares que los scrapers golpean fueron refactoreados o rotados por los operadores. |
| **HTTP 403** (IP bloqueada) | Western Union | Cloudflare/WAF detecta el request como bot y bloquea antes de llegar al backend. |

**Conclusión técnica:** un proxy residencial **sólo** resuelve Western Union.
Los otros 6 (401/404) no dependen de IP origin — son cambios reales en los
endpoints que requieren reverse-engineering de los nuevos paths o switch a una
fuente distinta de data.

## Fases marcadas `[x]` que requieren revisión

Cuando se ejecute la reactivación post-LLC, los siguientes items del
`CONTEXTO_FINAL.md` deben **re-verificarse** porque están marcados `[x]` pero
su funcionalidad real en producción está rota desde 2026-04-17:

### Fase 2 (Scrapers automáticos) — completada 2026-04-16

- `[x]` Scrapers para Wise, Ria, Boss Money, MoneyGram, Western Union, Remitly — **código existe, fetch falla 401/404**.
- `[x]` Vercel Cron Job — **corre, pero retorna 200 con saved=0**.
- `[x]` Scrapers guardan resultados en Supabase — **técnicamente correcto cuando hay data que guardar; hoy no hay**.
- `[x]` Rate limiting 2s entre requests al mismo operador — **intacto, no es causa del fallo**.
- `[x]` Sistema de fallback 3 strikes → marcar stale — **funciona, pero `reportScraperFailure` usa contador in-memory serverless-unsafe (TROUBLE/27, bug latente separado)**.

**Significado práctico:** el código de Fase 2 es un punto de partida — se
requiere actualizar URLs + auth headers + ev. proxy en cada uno de los 7
scrapers antes de declararlos funcionales otra vez.

### Fase 8 (Expansión MX/CO) — completada 2026-04-21

- `[x]` Scrapers de los 7 operadores incluyen `corredor=mexico` y `corredor=colombia` en su array CORREDORES — **cierto a nivel código; no se puede validar con data real hasta reactivar**.

### Fase 9.1 (Agente 1 validador ingress)

- `[x]` Agente 1 construido + integrado en `savePrices()` — **cierto a nivel código y validado 2026-04-23 con smoke test que usó data MOCK en endpoint temporal `/api/test-agente1` (branch borrada)**.
- El Agente 1 nunca ha procesado un precio real de scraper desde que se implementó porque los scrapers reales no devuelven data desde el 2026-04-17 (el Agente 1 se implementó el 2026-04-22).
- **Cuando se reactiven los scrapers, confirmar que el Agente 1 procesa los precios reales correctamente** — puede haber edge cases en tasas reales que el mock no cubrió (ej. valores en el borde de ±10% del BC).

### Admin dashboard (Fase 4.5)

- `[x]` Monitor de estado de scrapers verde/rojo por operador — **el dashboard técnicamente funciona; hoy muestra todos rojos por la data stale, lo cual es el comportamiento correcto pero visualmente puede confundir a quien no tenga contexto**.

## Las 7 opciones evaluadas (análisis 2026-04-23)

| # | Opción | Recupera | Costo/mes | Tiempo | Riesgo |
|---|--------|----------|-----------|--------|--------|
| 1 | Wise API oficial pública (`api.wise.com/v4/comparisons/`) | 1/7 | $0 | 2-3h | Bajo — API oficial, SLA real |
| 2 | Reverse engineer 5 endpoints nuevos + proxy residencial | 5/7 | $30-50 | 9-10h | Medio-alto — gato-ratón con operadores, re-rotan cada 1-3 meses |
| 3 | Solo proxy residencial sin actualizar URLs | 0-1/7 | $30-50 | 2h | Alto — NO resuelve 401/404, solo teóricamente WU |
| 4 | Scraping HTML público (no APIs internas) | 6/7 | $0-20 | 8-12h + 2-4h/mes mantenimiento | Alto — HTML cambia seguido, muchos requieren JS render (Playwright) |
| 5 | Data estática + update manual vía admin | 7/7 (stale) | $0 | 0h | Alto — rompe propuesta de valor "tasas en vivo" |
| 6 | APIs de partners vía programa de afiliados | 7/7 | $0 | variable post-LLC | Bajo — APIs estables con SLA, pero bloqueado pre-LLC |
| 7 | Agregador comercial (Monito, Exiap, WikiRemit) | 7/7+ | $200-800 | 3-4h | Dependencia comercial de competidor potencial |

## Decisión tomada y razón

**Decisión:** Opción 6 (partner APIs) como estrategia principal, con fallback a
Opción 2 solo si las afiliaciones tardan más de lo esperado.

**Razón:**

1. `preenvios.vercel.app` NO tiene tráfico real hoy — el dominio `preenvios.com`
   sigue apuntando al MVP estático en GitHub Pages hasta el DNS cutover. No hay
   usuarios reales viendo data stale a los que se les esté rompiendo la
   experiencia.
2. La fase pre-lanzamiento actual está enfocada en SEO + contenido + estructura.
   Los scrapers no son el cuello de botella de lo que bloquea el lanzamiento
   (bloquean Fase 7 agentes 2-5, que aún no están construidos).
3. Opción 2 sola cuesta 10+ horas de trabajo inicial + $30-50/mes de proxy con
   vida útil esperada de 1-3 meses hasta el próximo cambio de APIs. Es pagar
   por una solución temporal que luego se reemplaza por Opción 6.
4. Post-LLC + EIN + cuenta bancaria + aprobación en al menos 1 programa de
   afiliado (Impact, Partnerize, FlexOffers o CJ), los partners proveen APIs
   oficiales con pricing real, gratis como parte del programa. Solución
   permanente, estable, con SLA.
5. Mientras tanto, el founder puede actualizar tasas manualmente en el admin
   panel (`/admin`) cuando sea necesario — no es ideal pero es suficiente para
   la pre-fase sin tráfico.

## Plan de reactivación post-LLC

### Pre-requisitos que deben cumplirse antes de ejecutar

- [ ] LLC constituida en Delaware o Florida (Fase 1.5 CONTEXTO_FINAL)
- [ ] EIN obtenido del IRS
- [ ] Cuenta bancaria de negocio (Mercury o Relay Bank)
- [ ] **Aprobación en al menos 1 programa de afiliado** (Impact para Remitly,
      Partnerize para Wise, CJ Affiliate para Xoom/Ria/WorldRemit, FlexOffers
      para MoneyGram, CJ/FlexOffers para Western Union)

### Orden de ejecución recomendado

**Fase R1 (quick win, ~3h):** activar Wise API pública.
- No requiere LLC ni aprobación.
- Es gratis y estable.
- Puede hacerse ANTES de la LLC si se decide que vale la pena tener al menos
  1/7 operador funcional antes del cutover DNS.
- Ver `CONTEXTO_FINAL.md` Fase 8 línea 766 (ya auditado).

**Fase R2 (post-aprobación afiliados, 4-8h por programa):** para cada partner
aprobado, integrar su API de pricing.
- Impact.com → Remitly pricing API (cuando aprobación llegue).
- Partnerize → Wise (redundante si R1 está activo, pero mejor cobertura).
- CJ Affiliate → Xoom, Ria, WorldRemit.
- FlexOffers → MoneyGram, Western Union.
- Cada uno tiene su propio flujo de autenticación (API keys, OAuth, etc.) que
  se documenta cuando se llegue a esa fase.

**Fase R3 (fallback si R2 se retrasa >3 meses post-LLC):** Opción 2 del análisis.
- Reverse engineer los nuevos endpoints de los 6 que no sean Wise.
- Integrar proxy residencial (ScraperAPI recomendado, $49/mes).
- Esto es una solución temporal hasta que R2 complete.
- Requiere 10h de trabajo inicial + 2-4h/mes de mantenimiento.

## Validación de supuestos (pre-cutover, ~1h de lectura sin código)

La decisión de diferir scrapers hasta post-LLC + partner APIs descansa en 2
supuestos no verificados al momento de tomarla (2026-04-23). Antes del DNS
cutover, ambos deben chequearse contra la documentación oficial de cada red.
Si alguno se cae, el plan R2 no es viable solo y hay que mezclar con Fase R3
(reverse-engineer + proxy) como puente real, no como fallback teórico.

### Supuesto 1 — "Los programas de afiliado darán APIs de pricing"

**No todos los programas entregan APIs de pricing.** Muchos solo dan
deep links con clickid para tracking, feeds de productos (catálogos sin
pricing en vivo), o pricing embedded en URLs para calculators. Pricing
API JSON con tasa + fee + velocidad por corredor es data operacional que
muchos operadores reservan para partners estratégicos, no para afiliados
de entrada.

**Acción de validación — por programa, responder 2 preguntas:**

| Programa | Operadores | Q1: ¿qué entrega? (deeplink / feed / pricing API / combo) | Q2: ¿qué exigen para aprobar? (tráfico / dominio / contenido / tiempo) |
|----------|-----------|----------------------------------------------------------|-----------------------------------------------------------------------|
| **Impact.com** | Remitly | _pendiente verificar en impact.com/advertisers_ | _pendiente_ |
| **Partnerize** | Wise | _pendiente verificar en partnerize.com_ | _pendiente_ |
| **CJ Affiliate** | Xoom, Ria, WorldRemit, Western Union, MoneyGram | _pendiente verificar en cj.com_ | _pendiente_ |
| **FlexOffers** | MoneyGram, Western Union (redundante con CJ) | _pendiente verificar en flexoffers.com_ | _pendiente_ |

**Resultado esperado:** si Q1 da "pricing API" en al menos 4/7 operadores, el
plan R2 cubre el catálogo MVP. Si da "pricing API" en menos de 4/7, hay que
pivotar a una mezcla R2 + R3 real.

### Supuesto 2 — "Los programas me aprobarán una vez aplique"

La mayoría de las redes exige un piso de legitimidad para aprobar:

- **Dominio activo con tráfico demostrable** (típicamente 100-1000 visitas
  mensuales verificables con GA4 o similar).
- **Contenido relevante al nicho** (SEO de remesas, guías, comparativas).
- **Tiempo mínimo desde registro del dominio** (algunos exigen 3-6 meses).

**La circularidad del problema:** necesito tráfico para ser aprobado →
necesito scrapers funcionales para dar valor al usuario → atraer tráfico →
ser aprobado. Sin ningún operador con data real post-cutover, `preenvios.com`
es un comparador vacío y las redes rechazan la aplicación.

**Mitigación parcial que ya está en el plan:** Fase R1 (Wise API pública,
2-3h, $0) ejecutable sin LLC, da 1/7 operador con data real. Eso es poco
para convencer a una red seria de que Preenvios es un comparador legítimo.
El piso aceptable — sin pivotar a R3 — requiere además contenido SEO real
(blog con 5-10 posts, wiki con 10+ artículos, páginas editoriales por país
completadas con copy original del founder, no placeholders).

### Triggers para replantear el plan

Si tras la validación de supuestos ocurre cualquiera de estos casos:

1. **Q1 revela que menos de 4/7 operadores dan pricing API vía afiliación**
   → el plan R2 solo cubre parcialmente el catálogo MVP. Hay que decidir:
   - Achicar el catálogo visible a los 2-3 operadores con API real.
   - O ejecutar R3 (reverse-engineer + proxy $49/mes) para los operadores
     sin API, aceptando que es deuda técnica de 1-3 meses.

2. **Q2 revela criterios de aprobación imposibles sin DNS cutover primero**
   (ej. exigen 1000 visitas/mes en `preenvios.com` para revisar aplicación)
   → hay que lanzar `preenvios.com` antes de tener afiliados aprobados, lo
   cual obliga a decidir:
   - Lanzar con banner de data manual + Wise API (Escenario C del CHECKLIST).
   - O ejecutar R3 pre-cutover para tener 4-6 operadores funcionales el día
     del launch.

3. **Respuestas mixtas o ambiguas** → ejecutar R1 (Wise API) pre-cutover
   de todas formas (no tiene downside, es gratis), y mantener la decisión de
   diferir R2/R3 hasta tener claridad.

## Criterios para reconsiderar la decisión de diferir

Revisar este plan y eventualmente adelantar la reactivación si ocurre CUALQUIERA
de estos eventos:

1. **DNS cutover adelantado** — si por razón X se decide lanzar `preenvios.com`
   en Vercel antes de que haya APIs de partners funcionando, hay que decidir
   entre:
   - Pausar el launch hasta que haya data real.
   - Lanzar con banner de transparencia "Tasas actualizadas manualmente cada
     día por equipo editorial" + data manual en admin.
   - Ejecutar Fase R3 (Opción 2 del análisis) como solución puente.
2. **Tráfico orgánico llegando al preview** — si por SEO o algún share externo
   preenvios.vercel.app empieza a recibir usuarios reales que ven data stale,
   reevaluar urgencia (el preview NO debería tener tráfico, pero Google puede
   indexarlo si no se bloquea).
3. **Aprobaciones de afiliados tardan más de 3 meses post-LLC** — evaluar Fase
   R3 como puente.
4. **Cambio estratégico del founder** (ej. decide monetizar con publicidad
   directa antes que afiliados) — el plan entero se rehace.

## Impacto operacional hoy (2026-04-23)

- **Comparador en preview:** muestra tasas del 2026-04-17 (stale 6 días). El
  usuario no lo sabe.
- **Calculadora inversa:** misma tasa stale.
- **Páginas de tasa histórica (`/tasa/[pair]`):** gráfica congelada al 17 —
  visualmente se ve vacía desde entonces porque la tabla `historial_tasas_publico`
  tampoco recibe escrituras del cron.
- **Admin dashboard:** muestra todos los scrapers rojos (última actualización
  exitosa > 24h) — esto es correcto, indica el estado real.
- **Agente 1 (validador):** operativo pero sin tráfico de entrada. Vacío porque
  `savePrices([])` nunca llega a validar nada.

## Archivos relacionados

| Archivo | Qué dice sobre este tema |
|---------|--------------------------|
| `SCRAPERS_IMPORTANTE.md` (raíz) | Alerta upfront del estado actual para cualquiera que clone el repo |
| `CONTEXTO_FINAL.md` Fase 2 | Scrapers marcados `[x]` — ver alerta de re-verificación arriba |
| `CONTEXTO_FINAL.md` Fase 8 | Wise API pública pendiente — prioridad post-LLC |
| `CHECKLIST_PRE_LANZAMIENTO.md` | Item pre-cutover DNS: validar scrapers antes de lanzar |
| `TROUBLESHOOTING/01_scraper_individual_falla.md` | Playbook de 1 scraper caído (aplicable hoy a los 7) |
| `TROUBLESHOOTING/02_todos_scrapers_fallan.md` | Playbook específico de "todos los 7 caídos" |
| `TROUBLESHOOTING/27_contador_in_memory_serverless.md` | Bug latente del contador de `reportScraperFailure` |
| `lib/scrapers/` | Código fuente de los 7 scrapers — NO tocar hasta plan de reactivación |
| `app/api/scrape/route.ts` | Endpoint del cron — funciona, auth OK (commit `53c7d18`) |

## Relacionados

- Proceso 08 — Scrapers (documento de diseño original, describe el happy path
  que hoy no se cumple).
- Proceso 24 — Agente 1 validador de ingress.
- Proceso 27 — Separación DB preview vs producción (aprovechable para testear
  reactivación sin tocar prod).
