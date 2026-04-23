# ⚠️ SCRAPERS — ESTADO CRÍTICO Y DECISIÓN ESTRATÉGICA

> Este archivo existe en la raíz del repo deliberadamente para que cualquiera
> que clone el proyecto — founder futuro, developer nuevo, auditor, o el mismo
> Claude en otra sesión — lea primero el estado real de los scrapers antes de
> confiar en checkboxes `[x]` dispersos por los otros documentos.

---

## Estado en una línea

**Los 7 scrapers MVP están rotos en producción desde el 2026-04-17 y la decisión
deliberada es NO arreglarlos hoy — se difieren hasta post-LLC + aprobación en
programas de afiliados.**

## Decisión estratégica

Al 2026-04-23 los scrapers (Wise, Ria, Xoom, WorldRemit, Remitly, MoneyGram,
Western Union) fallan todos al primer byte: 2 con HTTP 401, 4 con HTTP 404, 1
con HTTP 403. Se evaluaron 7 opciones para solucionarlo (reverse-engineering,
proxy residencial, HTML scraping, data manual, agregador comercial, API
oficial, partner APIs).

**Se eligió: partner APIs post-LLC.** Razón: gastar 10+ horas y $30-50/mes en
una solución temporal (Opción 2 del análisis) que va a ser reemplazada en 1-3
meses por APIs oficiales de afiliados (Opción 6) que son gratis y estables, no
tiene ROI. El preview donde corren los scrapers hoy (`preenvios.vercel.app`) no
tiene tráfico real — `preenvios.com` sigue apuntando al MVP estático en GitHub
Pages. El founder puede actualizar tasas manualmente en `/admin` mientras
tanto.

## Por qué este archivo existe en la raíz

Porque en los otros documentos hay docenas de checkboxes `[x]` relacionados a
scrapers que pueden dar la falsa impresión de que todo funciona:

- **CONTEXTO_FINAL.md Fase 2** → los 7 scrapers, Vercel Cron, rate limiting,
  fallback: todo `[x]`. El código existe. **La funcionalidad en prod NO.**
- **CONTEXTO_FINAL.md Fase 8** → MX/CO agregados a scrapers `[x]`. Técnicamente
  cierto. Sin forma de validar con data real hoy.
- **CONTEXTO_FINAL.md Fase 9.1** → Agente 1 validador `[x]`. Construido.
  Funciona. Pero nunca procesó un precio real de scraper desde que se implementó
  (2026-04-22), porque los scrapers no devuelven data desde el 17.
- **Admin dashboard** → monitor de scrapers `[x]`. Funciona. Hoy muestra todo
  rojo. Lo cual es correcto — está reflejando el estado real.

**Regla de lectura:** si un `[x]` en cualquier documento menciona "scraper",
"cron", "pricing", "tasa en vivo", asumir que el código existe pero la
funcionalidad en producción requiere re-verificación hasta que se complete el
plan de reactivación (Fase R1/R2/R3 de `LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md`).

## Qué mirar para el detalle completo

1. **`LOGICA_DE_NEGOCIO/28_scrapers_plan_diferido.md`** — análisis completo:
   JSON de evidencia, 7 opciones evaluadas con tabla, plan de reactivación
   paso a paso, criterios de urgencia para reconsiderar.
2. **`CHECKLIST_PRE_LANZAMIENTO.md`** — item pre-cutover DNS que obliga a
   validar scrapers ANTES de lanzar preenvios.com a Vercel.
3. **`TROUBLESHOOTING/02_todos_scrapers_fallan.md`** — playbook operativo si
   pasa esto otra vez en el futuro.

## Qué NO hacer hasta tener el plan de reactivación aprobado

- No tocar `lib/scrapers/*.ts` (los 7 archivos de scraper).
- No modificar `app/api/scrape/route.ts` (funciona, auth OK desde commit `53c7d18`).
- No pagar proxy residencial (ScraperAPI, Bright Data, etc.) sin antes agotar
  la vía de partner APIs.
- No usar Monito/Exiap/WikiRemit como data source (Opción 7 descartada —
  dependencia comercial de competidor potencial).
- No marcar Fase 2 del CONTEXTO como "a revisar" en todos los checkboxes —
  basta con mantener esta doc + el Proceso 28 actualizados; quien lea sabrá
  que los `[x]` significan "código escrito", no "funcionalidad validada hoy".

## Qué SÍ hacer

- Mantener el código actual de scrapers sin borrar — es el punto de partida
  cuando llegue el plan de reactivación.
- Monitorear este archivo + el Proceso 28 cuando cambien condiciones:
  - Llegó la LLC → arrancar Fase R1 (Wise API) y aplicar a afiliados.
  - Llegó aprobación de un programa de afiliado → arrancar integración R2.
  - Pasaron 3 meses post-LLC sin afiliados aprobados → evaluar Fase R3 (proxy).
- Actualizar tasas manualmente en `/admin` si hay usuarios viendo preview y
  se necesita demostrar la UX.

## Trazabilidad de la decisión

- **Fecha de la decisión:** 2026-04-23
- **Quién decidió:** founder (Aneury Soto)
- **Evidencia que soportó la decisión:** run manual del endpoint con JSON de
  errores de los 7 operadores + análisis técnico de costo/riesgo de las 7
  opciones alternativas (ver Proceso 28).
- **Próxima revisión obligatoria de la decisión:** antes del DNS cutover de
  `preenvios.com` a Vercel (pre-cutover está bloqueado por este item — ver
  CHECKLIST_PRE_LANZAMIENTO.md).
