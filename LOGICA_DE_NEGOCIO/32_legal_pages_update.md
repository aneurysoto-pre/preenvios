# Proceso 32 — Update páginas legales (2026-04-25)

Fecha: 2026-04-25
Branch: `feat/legal-pages-update`
Motivación: cubrir huecos legales críticos pre-cutover (LLC en Florida,
manejo de afiliados, exposición legal en disputas USA bilingüe).

## Aclaración importante

**Estos cambios NO son asesoría legal certificada.** Son mejores
prácticas estándar de la industria para comparadores financieros (AAA
arbitration, DMCA, COPPA, class action waiver). Antes de:
- Tener tráfico real significativo
- Aplicar a programas de afiliados grandes (Wise, Remitly directos)
- Ir live con dominio `.com`

→ revisión con abogado fintech de Florida sobre **ambas versiones (ES + EN)**.

## Cambios aplicados (paridad ES + EN)

### Cambios globales (consistencia legal entre páginas)

1. **Jurisdicción**: Delaware → Florida (1 instancia, en `terminos`)
2. **Eliminación de redes de afiliados**: removidas todas las menciones
   de Impact.com, Partnerize, CJ Affiliate, FlexOffers (info comercial
   privada). Fuente original: `como-ganamos-dinero/content.tsx`.
3. **Eliminación de listas nominativas de operadores en páginas que NO
   son `uso-de-marcas`**: la lista "Remitly, Wise, Xoom, Ria,
   WorldRemit, Western Union, MoneyGram" ya no aparece en `metodologia`.
   Reemplazada por descripción genérica.

### `/es/terminos` y `/en/terminos`

11 cláusulas nuevas agregadas en orden lógico:
- Aceptación de términos (refuerzo)
- Servicio "tal cual" (en mayúsculas, convención AS IS)
- Limitación de daños (cap USD $100, sin daños indirectos)
- Indemnización del usuario
- Conducta prohibida (lavado, scraping, suplantación, reventa)
- Terminación (sin previo aviso)
- Propiedad intelectual
- Arbitraje obligatorio + class action waiver + jury trial waiver (AAA, Florida)
- DMCA notification process
- Severability
- Acuerdo completo

Mantenido: highlight-box, "Qué es", "Limitación de responsabilidad"
(disclaimers.d5), "Sobre las tasas mostradas" (disclaimers.d1),
"Acuerdos comerciales" (disclaimers.d3+d4), "Edad mínima",
"Uso de marcas" (disclaimers.d6), "Cambios en los términos", "Contacto".

### `/es/privacidad` y `/en/privacy`

3 cláusulas nuevas:
- Retención de datos (GA4 14 meses)
- Menores de edad (COPPA, <13 años)
- Do Not Track (statement explícito)

### `/es/disclaimers`

Mantenido contenido. Agregado párrafo de cierre + cross-links.

### `/es/como-ganamos-dinero`

Eliminada sección "¿Qué redes de afiliados usamos?" (4 redes nombradas
+ párrafo sobre WU/MG pendientes aprobación). Reemplazada por:
- "Cómo funcionan los programas de afiliados" — descripción genérica.

Mantenido: 5 criterios del ranking con porcentajes, "¿Te cuesta algo a
ti?" con "No", link a metodología.

### `/es/metodologia`

Eliminado:
- Sección "Operadores comparados" con 7 nombres
- Mención específica "Vercel Cron Jobs", "scrapers Playwright", "Fase 2"
- Sección "Código" con referencia a `lib/ranking.ts`

Reemplazado:
- "Frecuencia de actualización" → texto genérico ("se actualizan
  periódicamente, cada resultado muestra la fecha de la última
  actualización")
- "Operadores comparados" → "los operadores principales que envían
  desde Estados Unidos a Latinoamérica"

Mantenido: Preenvíos Score, los 5 criterios con porcentajes y
explicaciones, fuentes de datos.

### `/es/uso-de-marcas`

Mantenido íntegro. Esta es la única página legal donde se listan los 7
nombres de operadores con sus dueños.

### Cross-links al final de cada página

Bloque consistente "Páginas relacionadas" en las 6 páginas, listando
las **otras 5** (no la actual).

### Fecha "Última actualización"

`components/LegalPage.tsx` línea 25: `2026-04-16` → `2026-04-25`.

## Decisión arquitectural — paridad ES + EN

**Razón**: el sitio es bilingüe desde el día 1. Dejar EN con texto
viejo (Delaware, redes de afiliados, sin arbitraje obligatorio)
durante el gap hasta una sesión de traducción crearía:
- Inconsistencia jurisdiccional (¿Delaware o Florida?)
- Waivers no ejecutables en EN (no class action waiver = demandable
  con jurado en USA)
- Días de exposición legal innecesaria

Solución aplicada: cláusulas legales canónicas (AAA, DMCA, COPPA,
class action waiver) traducidas siguiendo templates estándar de la
industria. Cuando llegue revisión con abogado, pule ambas versiones
juntas.

## Caveats técnicos

- Los textos viven hardcoded en `content.tsx` con patrón ternario
  `en ? 'EN' : 'ES'`. NO en `messages/{es,en}.json`. Eso significa:
  - **NO** hay que sincronizar i18n cuando se actualice
  - **SÍ** hay que mantener ambos idiomas en el mismo file change
- `disclaimers.d1..d6` SÍ vienen de `messages/es.json` y `messages/en.json`
  — esos son los párrafos cortos reusables que aparecen tanto en
  `/disclaimers` como dentro de `/terminos` (highlight-box, etc).

## Archivos modificados

- `components/LegalPage.tsx`
- `app/[locale]/terminos/content.tsx`
- `app/[locale]/privacidad/content.tsx`
- `app/[locale]/disclaimers/content.tsx`
- `app/[locale]/como-ganamos-dinero/content.tsx`
- `app/[locale]/metodologia/content.tsx`
- `app/[locale]/uso-de-marcas/content.tsx`

## NO modificado

- `messages/{es,en}.json` (`disclaimers.d1..d6` siguen iguales — son
  reusables y consistentes)
- Landing principal, comparador, wiki, blog, footer (links siguen
  apuntando a las mismas URLs, solo cambia el contenido interno)
- Versiones EN del wiki/blog (no son legales, fuera de scope)

## Smoke test esperado

- `Delaware` no debe aparecer en NINGÚN idioma del sitio
- `Impact.com`, `Partnerize`, `CJ Affiliate`, `FlexOffers` no deben
  aparecer en páginas públicas (sí queda 1 mención en
  `app/api/admin/ingresos/route.ts` que es comentario interno API
  admin, no página pública)
- Las 11 cláusulas nuevas de términos presentes en ES y EN
- Las 3 cláusulas nuevas de privacidad presentes en ES y EN
- Cross-links funcionan en las 6 páginas
- Footer intacto, links siguen apuntando a las URLs legales
