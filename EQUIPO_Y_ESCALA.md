# EQUIPO Y ESCALA — PreEnvios.com

Triggers concretos para decidir cuándo contratar y cuándo escalar el stack, con modelo de defensa en profundidad para un founder no-técnico que diseña para la vida real.

**Última actualización:** 2026-04-21

---

## 1. Filosofía rectora

En 2026 los sistemas serios no se construyen con una sola línea de defensa. Se diseñan con capas cruzadas donde cada una puede ser el fallback de las otras.

Como salir a la calle con **$100 cash + tarjeta de crédito como backup + celular con Apple Pay como backup de la tarjeta**. Si uno falla, los otros cubren.

PreEnvios aplica este mismo principio a nivel técnico: 4 capas cruzadas de defensa + el founder como última línea.

**Principio operativo:**
> "Mi problema no es gastar dinero. Mi problema es saber el problema antes de que pase, y si pasa, estar más que preparado."

Esto cambia la naturaleza de las decisiones de hiring y stack: no es "¿cuánto me ahorro?" sino "¿qué tan protegido quedo?".

---

## 2. Modelo de 4 capas de defensa

| Capa | Rol | Costo/mes | Qué cubre |
|------|-----|-----------|-----------|
| **1. Humano local (empleado RD)** | Operador del stack de defensa + supervisor | $1,800-2,400 (salary + cargas RD) | Juicio, contexto, fixes arquitectónicos, interpretar alertas |
| **2. Claude Code Max** | Ejecutor supervisado + análisis | $200 | Bugs, features, pattern-following, review de anomalías |
| **3. Agentes automáticos (5 agents + observabilidad pasiva)** | Verificadores cruzados 24/7 | $0 (dentro de planes existentes) | Data quality, DB health, E2E flows, business metrics, uptime, errors |
| **4. Auditoría de seguridad periódica** | Review externa cada 60-90 días | ~$300/mes amortizado ($1K-1.5K cada una) | OWASP Top 10, dependencias, hallazgos nuevos |
| **Total stack defensivo** | | **~$2,300-2,900/mes** | 4 capas cruzadas |

Esto cuesta lo mismo que un remote senior part-time sin monitoring, con **4x la cobertura**.

---

## 3. Detalle por capa

### Capa 1 — Empleado local (RD)

| Campo | Valor |
|-------|-------|
| **Rol** | Developer full-stack local + operador del stack de defensa |
| **Stack requerido** | Next.js 16, TypeScript, Supabase, Tailwind CSS, básicos de Vercel. Puede aprender en trabajo con Claude Code supervisado. |
| **Dedicación** | Full-time (40 hrs/semana) |
| **Ubicación** | Santo Domingo o alrededores (presencial al menos 2 días/semana) |
| **Rango salarial neto** | **$1,500 - $2,000 USD/mes** según nivel (junior-mid) |
| **Costo real al contratador** | **$1,800 - $2,400 USD/mes** (cargas RD: TSS, INFOTEP, regalía pascual ≈ 15-20%) |
| **Trigger para contratar** | Tráfico orgánico llegando + founder dedica >2 hrs/día a bugs/features durante 2+ semanas seguidas. Se puede adelantar vs modelo tradicional porque el empleado NO es solo "developer que escala" — es también operador del stack de defensa desde día 1. |
| **Por qué RD (no Argentina/Colombia)** | Timezone UTC-4 = 1 hora con Miami EST (80% del target diáspora HN/DO/GT/SV está East Coast USA). Presencial + supervisión diaria. Control cultural. Costo competitivo. |

#### Análisis timezone (por qué RD gana)

| Ubicación | Diferencia con Miami (EST) | Diferencia con LA (PST) |
|-----------|----------------------------|--------------------------|
| **RD (UTC-4)** | 1 hora | 4 horas |
| Argentina (UTC-3) | 2 horas | 5 horas |
| Colombia (UTC-5) | 0 horas | 3 horas |
| México (UTC-6) | 1 hora | 2 horas |

RD es óptimo para target East Coast USA. Colombia gana solo si el target se balanceara Central Time, que no es el caso PreEnvios.

#### Proceso de contratación

1. Publicar en bolsas RD (Tecoloco, LinkedIn Dominicana, Codehard) con rango claro y dedicación full-time presencial/híbrida
2. Screening: test técnico de 2-3 hrs (implementar una feature menor sobre el repo — ej. agregar un corredor nuevo end-to-end)
3. Paid trial: 2 semanas a tarifa acordada, con alcance definido
4. Decisión basada en trial + química en supervisión diaria, no en entrevista

#### Qué NO revisar del empleado

Para que la contratación realmente libere tiempo del founder, definir con claridad qué NO requiere review:
- Features de UI (copy, estilos, componentes visuales) → confiá en empleado + Claude Code
- Bug fixes en componentes aislados → no review
- Cambios de traducción en `messages/*.json` → no review

#### Qué SÍ revisar del empleado

- Endpoints `/api/*` (especialmente admin y precios)
- `lib/admin-auth.ts`, `lib/rate-limit.ts` — seguridad
- Migraciones SQL en `supabase/migrations/`
- Cambios en scrapers que afectan data quality
- Cualquier cambio que toque env vars o infra

Esto debería tomar 3-5 hrs/semana al founder. Si toma más, algo anda mal en el proceso.

### Capa 2 — Claude Code Max ($200/mes)

Herramienta primaria del empleado. No reemplaza juicio, amplifica ejecución.

**Stack AI recomendado (opcional agregar $200 más si querés IDE con agente):**
- Claude Code Max: $200/mes ← obligatorio
- Cursor Ultra: $200/mes ← opcional si el empleado lo prefiere como IDE
- GitHub Copilot: $20/mes ← opcional, complemento inline
- API credits buffer: $80/mes ← para workflows custom

Con el stack mínimo ($200) + documentación robusta del repo (CONTEXTO_FINAL, LOGICA_DE_NEGOCIO, TROUBLESHOOTING, AUDITORIA), un mid rinde 2-3x su nivel natural.

### Capa 3 — Agentes automáticos (5 activos + observabilidad pasiva)

Detalle completo en **CONTEXTO_FINAL.md § Fase 7 — Sistema de defensa en profundidad**. Resumen:

**Agentes activos:**
1. Validador de ingress en scrapers (arquitectónico, BLOQUEANTE pre-launch)
2. Data quality agent (post-launch Mes 3)
3. Database health agent (post-launch Mes 3)
4. E2E smoke test agent (post-launch Mes 2)
5. Business metrics agent (post-launch Mes 4)

**Observabilidad pasiva (ya planeada):**
- BetterStack uptime (activa el día del DNS cutover)
- Sentry error tracking (instalado, pendiente DSN)

Costo total capa 3: **$0** (dentro de planes existentes). Tiempo build: **20-30 hrs** distribuidas en los primeros 4 meses post-launch. Trabajo del empleado local + Claude Code.

### Capa 4 — Auditoría periódica

Cadencia post-launch:
- **Cada 60-90 días:** re-run del checklist OWASP Top 10 interno (formato auditoría 01 existente como template)
- **Anual (post-revenue):** auditoría externa profesional (~$1,000-$1,500)
- **Bimensual:** `npm audit` + review de Dependabot alerts + review de incidentes Sentry del período

Costo amortizado: ~$300/mes si se contrata externa trimestral; $0 si se hace interna.

---

## 4. Hiring plan progresivo

### Fase A — Meses 1-3 post-launch (founder solo)

- **Equipo:** founder + freelancer productor visual (según PLAN_MARKETING_MES_1.md)
- **Stack de defensa activo:** solo capa 4 (auditoría 01 ya hecha) + validador ingress pre-launch
- **Costo:** $500-800/mes freelancer + $200 Claude Code del founder

### Fase B — Meses 3-6 post-launch (primer empleado local)

**Trigger:** tráfico orgánico >1,000 users/mes sostenido + founder >2 hrs/día en bugs/features por 2+ semanas.

- **Hire:** empleado RD full-time (capa 1 + operador de capa 3)
- **Agentes activos a implementar:** 4 (E2E), 2 (data quality), 3 (DB health)
- **Costo total mensual:** ~$2,300-2,900

### Fase C — Meses 6-12 (segundo empleado: marketing)

**Trigger:** orgánico llega a plateau (crecimiento mensual <5% por 2 meses) Y ads ROI estable (CAC < LTV comprobado).

- **Hire:** marketing/content manager $1,500-3,000/mes LATAM remoto o RD
- **Agentes activos:** 5 (business metrics) implementado ahora
- **Costo total mensual:** ~$4,000-5,500

### Fase D — Meses 12-18 (data/analytics)

**Trigger:** founder o devs gastan >4 hrs/semana armando reports a mano + decisiones importantes trabadas esperando data.

- **Hire:** data analyst part-time $2,000-3,000/mes
- **Stack nuevo:** posiblemente Supabase Team (+$100/mes) para branching

---

## 5. Stack scaling — cuándo tocarlo

**Regla:** no re-plataformear por "si acaso". Escalar solo cuando un servicio específico satura.

| Usuarios/mes | Servicio que satura | Acción | Costo extra |
|--------------|---------------------|--------|-------------|
| 0-5K | Ninguno | Ninguna | $0 |
| 5K-50K | Ninguno significativo | Ninguna | $0 |
| 50K | Supabase Free DB 500MB | Upgrade a Supabase Pro | +$25/mes |
| 100K | Vercel Pro bandwidth 1TB aguanta | Ninguna | $0 |
| 500K | Upstash 10K cmd/día si rate limit público | Upstash Pay-as-you-go | +$10-30/mes |
| 500K | Scrapers en Vercel Cron (timeout) | Migrar a Railway/Fly worker | +$10-30/mes |
| 1M+ | Supabase Pro se queda corto en DB I/O | Supabase Team | +$100-500/mes |

**No cambiaría del stack actual:** Next.js + Supabase + Vercel son la combinación estándar 2026 para fintech comparadores. Escalan hasta 1M+ users sin problemas arquitectónicos.

---

## 6. Timing de competencia — ventana de oportunidad

**Análisis del landscape (2026-04-21):**

- **Monito:** 12 años, $4M funding, 960K visits/mes. Pivotar a LATAM-first requiere 3-6 meses planning + 6 meses execution. **Mínimo 9 meses antes de aparecer en LATAM con intención seria.**
- **CompareRemit:** USA→India laser-focused. Pivotar culturalmente imposible.
- **Remitly/Wise/WU:** no lanzan comparador (conflicto de interés).
- **Riesgo real:** ex-empleado de Monito levanta $300-500K semilla y lanza fork español. Timeline: 9-12 meses mínimo.

**Ventana PreEnvios: 9-12 meses para capturar first-mover advantage en LATAM-first español.**

Orden de acciones en esa ventana:
1. **Mes 1-3 post-launch:** cerrar pipeline afiliados (Payoneer → CJ → Impact → Partnerize → FlexOffers) + primeros 5K users/mes
2. **Mes 3-6:** contratar empleado local + implementar agentes 2/3/4 + agregar México y Colombia al catálogo
3. **Mes 6-9:** moat de contenido (wiki real escrito por humano, blog, páginas país) + agente 5 (business metrics)
4. **Mes 9-12:** relaciones directas con remesadoras (negociación B2B Tier 1) + acuerdos exclusivos con bancos LATAM

---

## 7. Señales para NO contratar / NO escalar

Guardrails para no tomar decisiones por corazonada:

- **No contratar si:** retención mes-a-mes <20%. Producto no retiene, escala = pérdida amplificada.
- **No contratar developer si:** el founder lleva >2 semanas sin commit a main. Es problema de motivación/claridad, no de capacidad.
- **No escalar stack si:** uso es <10% del plan actual. Escalar "por si acaso" es costo sin retorno.
- **No contratar marketing si:** el founder no puede identificar qué contenido convierte mejor. Sin hipótesis clara, CM produce ruido.
- **No implementar agente si:** no está claro a quién alerta ni qué acción dispara la alerta. Alertas sin dueño = ruido.

---

## 8. Comp benchmarks LATAM remoto + RD local (2026)

### RD local (full-time presencial/híbrido)

| Rol | Junior (0-2 años) | Mid (2-5 años) | Senior (5+ años) |
|-----|-------------------|----------------|-------------------|
| Developer full-stack | $900-1,400/mes neto | $1,500-2,200/mes neto | $2,300-3,500/mes neto |
| Marketing / content | $700-1,000/mes neto | $1,000-1,500/mes neto | $1,500-2,500/mes neto |

Sumar ~15-20% por cargas (TSS, INFOTEP, regalía pascual) para obtener costo real al contratador.

### LATAM remoto (contractor)

| Rol | Junior (0-2 años) | Mid (2-5 años) | Senior (5+ años) |
|-----|-------------------|----------------|-------------------|
| Developer full-stack part-time | $1,500-2K/mes | $2-3K/mes | $3-4K/mes |
| Developer full-stack full-time | $2-3K/mes | $3-5K/mes | $5-8K/mes |
| Marketing / content manager | $1-1.5K/mes | $1.5-2.5K/mes | $2.5-4K/mes |
| Data analyst | $1.5-2K/mes | $2-3K/mes | $3-4.5K/mes |
| Diseñador UX/UI freelance | $15-30/hr | $30-60/hr | $60-100/hr |

**Ranking de mercados LATAM remoto por ratio calidad/costo:** Argentina (tech maduro, inflación a favor del contratador USD), Colombia (timezone USA Central, inglés fluido), México (muy cerca del target cultural). Evitar Venezuela (inestabilidad de pagos internacionales).

---

## 9. Documentos relacionados

- [CONTEXTO_FINAL.md § Fase 7](CONTEXTO_FINAL.md) — detalle de los 5 agentes y la etapa de defense-in-depth
- [SERVICIOS_EXTERNOS.md](SERVICIOS_EXTERNOS.md) / [DETALLE](SERVICIOS_EXTERNOS_DETALLE.md) — costos de servicios por fase
- [PLAN_MARKETING_MES_1.md](PLAN_MARKETING_MES_1.md) — plan de crecimiento mes 1 que genera el tráfico que dispara los triggers
- [CHECKLIST_PRE_LANZAMIENTO.md § 7.4](CHECKLIST_PRE_LANZAMIENTO.md) — validador ingress como bloqueante de cutover
- [LOGICA_DE_NEGOCIO/08_scrapers.md](LOGICA_DE_NEGOCIO/08_scrapers.md) — estrategia de 4 tiers de data sourcing
- [AUDITORIA_DE_SEGURIDAD/monitoring.md](AUDITORIA_DE_SEGURIDAD/monitoring.md) — BetterStack + Sentry (capas de observabilidad pasiva)
