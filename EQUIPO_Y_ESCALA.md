# EQUIPO Y ESCALA — PreEnvios.com

Triggers concretos para decidir cuándo contratar y cuándo escalar el stack. Documento de referencia para no tomar decisiones por corazonada cuando llegue el tráfico.

**Última actualización:** 2026-04-21

---

## 1. Regla de oro

**Ningún hire full-time se aprueba sin dos señales:**
1. El trigger cuantitativo está superado de forma sostenida (≥3 semanas seguidas)
2. La retención de usuarios está verificada (cohort retention ≥30% mes a mes)

**Corolario:** si los usuarios vienen pero no vuelven, primero se resuelve retención. Contratar para escalar un producto que no retiene es quemar plata.

---

## 2. Hiring plan — quién contratar, cuándo, cuánto pagar

### Fase 1 — Meses 1-6 post-lanzamiento (solo founder)

- **Equipo:** founder + freelancer productor visual (según PLAN_MARKETING_MES_1.md)
- **Cost:** ~$500-800/mes freelancer producción
- **No contratar:** nada full-time. Freelancers puntuales si algo urge.

### Fase 2 — Meses 6-12 (primer empleado)

| Campo | Valor |
|-------|-------|
| **Rol** | Developer full-stack part-time |
| **Stack que debe manejar** | Next.js 16, TypeScript, Supabase, Tailwind CSS, básicos de Vercel |
| **Dedicación** | 20-25 hrs/semana para empezar |
| **Rango salarial** | **$2,000 - $4,000 USD/mes** part-time |
| **Ubicación preferida** | LATAM remoto — Argentina, Colombia, México (talento fuerte + zona horaria compatible + costo más bajo que USA) |
| **Trigger para contratar** | ⚠️ Se cumplen AMBOS: (a) >5,000 users únicos/mes sostenidos por ≥3 semanas seguidas, Y (b) founder dedica >2 hrs/día a bugs + features durante ≥2 semanas |
| **Señales secundarias** | Commits/semana del founder caen a <10 + backlog crece >20 items por 3+ semanas |
| **Por qué no antes** | Si contratás developer antes de validar retención, estás pagando para mantener código que nadie usa. Si contratás después del trigger, el founder se quema y el producto se rompe. |

**Proceso de contratación sugerido:**
1. Publicar en Workana, Torre, LinkedIn con rango claro ($2-4K/mes) y dedicación part-time
2. Screening: test técnico de 2-3 hrs (implementar una feature menor, ej. agregar un nuevo corredor end-to-end)
3. Paid trial: 2 semanas a tarifa acordada, con alcance definido (ej. "implementar X + 3 bugs específicos")
4. Decisión basada en trial, no en entrevista

### Fase 3 — Meses 12-18 (segundo empleado)

| Campo | Valor |
|-------|-------|
| **Rol** | Marketing / content manager (español LATAM nativo) |
| **Skills requeridos** | Social media orgánico (TikTok, IG, FB groups diáspora), copywriting español natural, análisis GA4 básico, Metricool operativo |
| **Dedicación** | 20-30 hrs/semana |
| **Rango salarial** | **$1,500 - $3,000 USD/mes** |
| **Trigger para contratar** | Orgánico llega a plateau — crecimiento mensual <5% por 2 meses seguidos Y ads ROI ya estabilizado (CAC < LTV comprobado) |
| **Por qué no antes** | Bugs matan conversión más que la falta de contenido. Primer empleado debe liberar tiempo del founder en código, no en marketing. |

### Fase 4 — Meses 18-24 (tercer empleado)

| Campo | Valor |
|-------|-------|
| **Rol** | Data analyst / business analyst |
| **Skills requeridos** | SQL, Supabase queries, GA4 advanced, dashboards (Metabase, Looker Studio) |
| **Dedicación** | Full-time o 30+ hrs/semana |
| **Rango salarial** | **$2,000 - $3,000 USD/mes** |
| **Trigger para contratar** | Founder o developer gasta >4 hrs/semana construyendo reports a mano Y decisiones importantes se traban esperando data |
| **Por qué no antes** | Con <50K users/mes los patrones son obvios a ojo. Data analyst a volumen bajo es overkill. |

---

## 3. Stack scaling — cuándo tocarlo

**Regla:** no re-plataformear por "si acaso". Escalar solo cuando un servicio específico satura.

| Usuarios/mes | Servicio que satura | Acción | Costo extra |
|--------------|---------------------|--------|-------------|
| 0-5K | Ninguno | Ninguna | $0 |
| 5K-50K | Ninguno significativo | Ninguna | $0 |
| 50K | Supabase Free DB (500MB con historial) | Upgrade a Supabase Pro | +$25/mes |
| 100K | Vercel Pro bandwidth (incluye 1TB) — aguanta | Ninguna | $0 |
| 500K | Upstash 10K cmd/día si rate limit público | Upstash Pay-as-you-go | +$10-30/mes |
| 500K | Scrapers en Vercel Cron (límite timeout) | Migrar a Railway/Fly.io worker | +$10-30/mes |
| 1M+ | Supabase Pro se queda corto en DB I/O | Supabase Team | +$100-500/mes |

**No cambiaría del stack actual:** Next.js + Supabase + Vercel son la combinación estándar 2026 para fintech comparadores. Escalan hasta 1M+ users sin problemas arquitectónicos. Ningún argumento técnico justifica re-plataformear.

**Cosas a agregar cuando crezca (por trigger, no por calendario):**
- **CI/CD con tests (GitHub Actions, free):** cuando se hagan >5 commits/día, para evitar romper main por error humano. Probablemente mes 4-6 con developer contratado.
- **Feature flags (LaunchDarkly free tier o Vercel Feature Flags):** cuando se hagan >2 experiments A/B por mes.
- **Data warehouse separado (Supabase Branching o BigQuery free):** cuando historial de tasas supere 2 años Y se quiera hacer ML o analytics pesado.
- **CDN edge cache agresivo (Vercel Edge Config):** cuando `/api/precios` reciba >10K requests/hora.

---

## 4. Timing de competencia — ventana de oportunidad

**Análisis del landscape competitivo (2026-04-21):**

- **Monito:** 12 años, $4M funding, 960K visits/mes. Para pivotear a LATAM-first necesita 3-6 meses planning + 6 meses execution. **Mínimo 9 meses antes de que aparezcan en LATAM con intención seria.**
- **CompareRemit:** USA→India laser-focused con equipo/stack en inglés. Pivotear a LATAM es culturalmente imposible para ellos.
- **Remitly/Wise/WU:** no lanzan comparador, conflicto de interés obvio.
- **Riesgo real:** ex-empleado de Monito ve el gap + levanta $300-500K semilla + lanza fork español. **Timeline: 9-12 meses mínimo para que aparezca algo competitivo.**

**Ventana de oportunidad PreEnvios: 9-12 meses para capturar first-mover advantage en LATAM-first español.**

Qué hacer en esa ventana (en orden de ROI):
1. **Mes 1-3:** primeros 5K users/mes + pipeline afiliados cerrado (Payoneer → CJ → Impact → Partnerize → FlexOffers)
2. **Mes 3-6:** moat de contenido SEO (wiki + tasa histórica + páginas país) + agregar México y Colombia
3. **Mes 6-9:** contratar primer developer + acelerar cadencia de features
4. **Mes 9-12:** construir relaciones directas con remesadoras (B2B Tier 1) + negociar acuerdos exclusivos con bancos LATAM

---

## 5. Señales para NO contratar / NO escalar

Triggers que deben detenerte si estás pensando en crecer:

- **No contratar si:** retención mes-a-mes <20%. Producto no retiene, escala = pérdida amplificada.
- **No contratar developer si:** hace >2 semanas que el founder no hace un commit a main. Problema de motivación o claridad de producto, no de capacidad.
- **No escalar stack si:** el uso es <10% del plan actual. Escalar "por si acaso" es costo sin retorno.
- **No contratar marketing si:** el founder no puede identificar qué contenido convierte mejor. Sin hipótesis clara, un CM va a producir ruido.

---

## 6. Comp benchmarks LATAM remoto (2026)

Referencia para negociar salarios sin pagar de más ni de menos. Rangos para talento senior-junior en rol remoto LATAM:

| Rol | Junior (0-2 años) | Mid (2-5 años) | Senior (5+ años) |
|-----|-------------------|----------------|-------------------|
| Developer full-stack part-time | $1.5-2K/mes | $2-3K/mes | $3-4K/mes |
| Developer full-stack full-time | $2-3K/mes | $3-5K/mes | $5-8K/mes |
| Marketing / content manager | $1-1.5K/mes | $1.5-2.5K/mes | $2.5-4K/mes |
| Data analyst | $1.5-2K/mes | $2-3K/mes | $3-4.5K/mes |
| Diseñador UX/UI freelance | $15-30/hr | $30-60/hr | $60-100/hr |

**Países con mejor ratio calidad/costo:** Argentina (tech maduro, inflación favorece contratador USD), Colombia (timezone USA, inglés fluido), México (muy cercano al mercado target, cultura compatible). Evitar Venezuela por inestabilidad de pagos internacionales.

---

## 7. Documentos relacionados

- [CONTEXTO_FINAL.md](CONTEXTO_FINAL.md) — visión de producto y stack
- [SERVICIOS_EXTERNOS.md](SERVICIOS_EXTERNOS.md) / [DETALLE](SERVICIOS_EXTERNOS_DETALLE.md) — costos de servicios por fase
- [PLAN_MARKETING_MES_1.md](PLAN_MARKETING_MES_1.md) — plan de crecimiento mes 1 que genera el tráfico que disparan estos triggers
- [CHECKLIST_PRE_LANZAMIENTO.md](CHECKLIST_PRE_LANZAMIENTO.md) — qué cerrar antes del cutover que genera el tráfico
