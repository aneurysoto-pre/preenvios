# Cómo usar Claude Code — Límites, habilidades y mandatos

> Manual personal basado en lecciones reales de trabajo con Claude Code.
> Guardar en la raíz de cada proyecto y leer al inicio de cada sesión nueva.

---

## 1. La verdad de fondo

**Claude Code no es un ingeniero con juicio consistente. Es un ejecutor rapidísimo que necesita un architect humano dirigiendo.**

El architect eres tú. Él es el ejecutor senior bajo tu dirección. No al revés.

Si aceptas ese rol: vas 5x más rápido que contratando humanos, pagando casi nada, con la condición de que tú supervisas y validas.

Si no lo aceptas: necesitas un tech lead humano que haga el rol de architect.

No hay término medio.

---

## 2. Sus 3 modos de falla (reconocidos por él mismo)

### 2.1 Inercia del codebase
Cuando lee un proyecto que usa patrón X, sigue con X aunque Y sea mejor. No hace zoom-out espontáneo para preguntarse *"¿hay una librería mejor que esto?"*.

**Señal de alerta:** si ves que propone escribir código custom para algo común (modales, dropdowns, date pickers, sheets), párate y pregunta si existe una librería establecida.

### 2.2 Modo "quick fix" vs modo "arquitecto"
Cuando tu mensaje dice *"arréglame este bug"*, optimiza para el síntoma. Cuando dice *"evalúa la mejor herramienta para esto"*, hace la evaluación.

**El framing de tu instrucción gobierna el nivel al que piensa.** No piensa más allá de lo que le pides.

### 2.3 Bias hacia "continuar" en vez de "parar y replantear"
Un humano senior para después del segundo parche. Él sigue parcheando si cada mensaje tuyo es *"arregla esto otro"*. Necesita que alguien tire el freno — no sabe tirarlo bien solo.

---

## 3. Cómo ponerle el freno (el skill más importante)

### 3.1 Palabras gatillo que cambian su modo

| Si dices... | Entra en modo... |
|---|---|
| *"Arregla este bug"* | Quick fix (parche) |
| *"Evalúa el mejor enfoque para esto"* | Arquitecto |
| *"Busca la librería más usada en 2026 para resolver X"* | Research |
| *"Audita sin proponer arreglos"* | Diagnóstico |
| *"Antes de codear, justifica la decisión arquitectural"* | Planificación |
| *"Cuestioname si algún parámetro mío es malo"* | Push-back honesto |

**Regla práctica:** nunca pidas un arreglo sin antes pedir una evaluación. Los dos pasos separados cambian completamente el resultado.

### 3.2 Frases exactas para frenarlo

- *"No escribas código todavía. Solo responde."*
- *"Antes de tocar nada, hazme una auditoría y dame tu veredicto."*
- *"Para. Antes de continuar, justifica por qué este enfoque y no otro."*
- *"Si detectas que estás por meter un parche, avísame y yo decido."*
- *"No pushes sin mi OK explícito."*

### 3.3 Cuándo tirar el freno

- Después del **segundo** intento fallido de un mismo problema. No esperes al cuarto.
- Cuando te proponga una solución y no te explique **por qué esa y no otra**.
- Cuando uses palabras genéricas en la respuesta (*"debería funcionar"*, *"esto lo soluciona"*, *"es estándar"*) sin referencia a herramientas concretas o documentación.
- Cuando te cueste explicar tú mismo lo que hizo. Si no lo entiendes, es que no está bien hecho (o no te lo explicó bien).

---

## 4. Cómo hacer mandatos que funcionan

### 4.1 La estructura de un mandato bueno

1. **Rol claro** — *"Actúa como CMO senior"*, *"Actúa como arquitecto de software"*
2. **Contexto obligatorio** — archivos específicos que tiene que leer antes de responder
3. **Objetivo único** — qué quieres al final, medible
4. **Restricciones duras** — lo que NO puede hacer (cero parches, cero placeholders, cero features nuevos)
5. **Entregables** — archivos concretos a crear con rutas
6. **Reglas de calidad** — fechas reales, copy final, etc.
7. **Checkpoint** — puntos de pausa donde tiene que esperarte

### 4.2 Lo que NO debes hacer en un mandato

- **No sobre-especificar** el cómo. Si le dices "usa X técnica", lo estás tratando como ejecutor, no como experto. Dale el objetivo y el contexto, deja que él proponga el cómo.
- **No darle todo junto** si es complejo. Divide en fases con aprobación entre medio.
- **No darle mandato sin contexto del producto.** Sin `.agents/product-marketing-context.md` o equivalente, todo sale genérico.
- **No aceptar respuestas sin justificación.** Si propone X solución, tiene que decir por qué X y no Y.

### 4.3 Lo que SÍ debes incluir siempre

- Fecha real del momento, no variable
- Reglas estrictas: *"cero placeholders"*, *"cero parches"*, *"cero features nuevos"*
- Instrucción explícita de **cuestionarte** si algún parámetro tuyo es malo
- Checkpoint final: *"no ejecutes hasta que yo apruebe"*

---

## 5. Cómo hacer que evalúe en lugar de reparar

### 5.1 El patrón de 2 pasos

**Paso 1 — Auditoría sin código:**
> *"Audita el estado actual del componente X. NO propongas arreglos. Solo dime: ¿qué está bien, qué está mal, cuál es la causa raíz del bug? Veredicto: arreglable con cirugía, o hay que reescribir desde cero."*

**Paso 2 — Propuesta de solución con justificación:**
> *"Basado en la auditoría, proponme 2-3 caminos para resolverlo. Para cada uno: herramientas usadas, tiempo estimado, riesgos, trade-offs. NO ejecutes. Yo elijo."*

**Paso 3 — Ejecución con restricciones:**
> *"Ejecuta el camino elegido con estas reglas: X, Y, Z. Un commit por unidad de trabajo. Avísame antes de cada push."*

Nunca saltes el paso 1 o el paso 2. La tentación es decirle *"arreglalo"* directamente. Ahí empieza el ciclo de parches.

### 5.2 Cómo forzarlo a salir del codebase actual

Pregúntale explícitamente:
- *"¿Qué herramienta/librería usan los profesionales (Monito, Wise, Stripe, Linear) para esto?"*
- *"Si empezaras este proyecto hoy desde cero, ¿qué stack usarías?"*
- *"¿Hay alguna solución establecida que evite escribir esto custom?"*

Esto lo saca de la inercia del código existente y lo obliga a mirar el ecosistema real.

---

## 6. Checkpoints que debes exigir siempre

### 6.1 Antes de codear
- Auditoría del estado actual (sin proponer arreglos)
- Plan propuesto con justificación
- Tu aprobación explícita

### 6.2 Durante el trabajo
- Un commit por unidad lógica (un componente, una feature, un bug)
- Mensaje de commit específico con archivos tocados y por qué
- Verificación técnica (typecheck, lint, build) pasada ANTES del push

### 6.3 Antes del push
- Si es frontend: captura en DevTools iPhone/iPad/Desktop
- Si es backend: tests pasando + logs limpios
- Tu OK explícito si lo pediste

### 6.4 Al final de cada sesión
- Resumen de qué se hizo
- Lista de archivos modificados
- Riesgos y supuestos identificados
- Próximos pasos concretos que debes dar tú

---

## 7. Señales de que el mandato va mal

Para y replantea si ves cualquiera de estas señales:

- Te está proponiendo el mismo tipo de solución que ya falló
- No puede responder *"por qué este enfoque y no otro"* con referencias concretas
- Te pide que aceptes algo sin explicártelo primero
- Usa palabras vagas: *"debería"*, *"probablemente"*, *"en teoría"*
- Intenta ampliar el scope sin autorización
- Dice *"esta vez es distinto"* sin cambiar la estructura del trabajo

---

## 8. El mindset correcto al trabajar con Claude Code

**No estás contratando un ingeniero. Estás dirigiendo a un ejecutor súper rápido que necesita un arquitecto humano.**

Tú aportas: juicio, contexto de negocio, decisiones arquitecturales, validación.
Él aporta: velocidad, ejecución, investigación cuando se la pides, honestidad si se la exiges.

Si en algún momento sientes que él está tomando las decisiones importantes, algo está mal. **Vuelve al rol de architect.**

---

## 9. Cuándo parar y contratar humano

Considera contratar un dev senior humano cuando:

- El problema ha fallado 3+ veces con enfoques distintos
- El refactor requerido toca la arquitectura base del proyecto
- Necesitas alguien que establezca el sistema de diseño inicial (primitivas, design system, base mobile-first)
- No estás seguro de tu capacidad de supervisar técnicamente lo que él hace
- El tiempo perdido en iteraciones supera el costo de un freelance

Un humano senior con IA (Claude, Cursor, Copilot) te da las decisiones arquitecturales correctas desde el día 1. Después de eso, tú + Claude Code son autosuficientes.

**Contratar no es fracaso. Es reconocer cuál es el setup óptimo.**

---

## 10. Reglas permanentes para todos mis proyectos

1. Antes de escribir cualquier modal, dialog, picker, dropdown, sheet: **evaluar librerías establecidas primero** (shadcn/ui, Radix, Ark). Nunca custom por defecto.
2. Un bug que ya se arregló antes y vuelve = **señal de problema arquitectural**, no de implementación. Parar y replantear.
3. Después de 2 intentos fallidos del mismo bug: parar y cambiar de enfoque (evaluación desde arriba, no otro parche).
4. Un commit = una unidad lógica. Commits gigantes con 10 cambios mezclados = prohibido.
5. Todo refactor mayor empieza con auditoría sin código.
6. Si Claude Code propone algo custom donde hay librería establecida: preguntar explícitamente por qué no usa la librería.
7. Nunca aceptar *"esta vez es distinto"* como explicación. Solo acepto estructura y guardrails que lo fuercen.

---

*Archivo de referencia personal. Actualizar cuando identifique nuevas lecciones.*
*Última actualización: 21 abril 2026.*
