# VALIDACIÓN DEL MVP — Comparador de Giros LATAM
## Guía completa para saber si el negocio funciona antes de escalar

---

## Por qué existe este documento

La mayoría de los proyectos no fallan por mala tecnología. Fallan porque el fundador
construyó algo que nadie quería, o que nadie encontró, o que nadie usó más de una vez.

Este documento existe para evitar exactamente eso. Antes de escalar, antes de añadir
corredores, antes de hacer publicidad pagada, antes de hablar con Banreservas, antes
de construir la app — necesitas responder una sola pregunta con datos reales:

**¿Hay personas reales que llegan al sitio, comparan, hacen clic, y completan una transferencia?**

Si la respuesta es sí con números concretos, todo lo demás tiene sentido.
Si la respuesta es no, necesitas entender por qué antes de gastar más energía.

Este documento te lleva paso a paso por ese proceso.

---

## Los 4 niveles de validación

Validar un negocio no es un evento — es una secuencia. Cada nivel confirma algo diferente
y desbloquea el siguiente. No saltes niveles. No asumas que uno está validado sin datos.

```
Nivel 1 → El problema existe (la gente busca esto)
Nivel 2 → El producto funciona (la gente llega y usa el comparador)
Nivel 3 → El modelo de negocio funciona (la gente hace clic y completa una transferencia)
Nivel 4 → El canal de marketing funciona (sabes cómo adquirir usuarios de forma reproducible)
```

Cada nivel tiene sus propios experimentos, sus propias métricas, y su propio umbral de "sí, esto funciona."

---

## NIVEL 1 — Validar que el problema existe

### Qué estás validando
Que hay personas reales buscando activamente cómo enviar dinero más barato a la República
Dominicana, y que ese problema no tiene una solución en español que las sirva bien.

### Cómo validarlo — ANTES de escribir código

**Experimento 1.1 — Búsqueda manual en Google (1 hora)**

Abre Google y busca estas frases en modo incógnito:
- "enviar dinero a República Dominicana barato"
- "cuánto cobra Western Union a RD"
- "mejor app para mandar giros a Santo Domingo"
- "Remitly vs Western Union República Dominicana"
- "how to send money to Dominican Republic cheap"

Lo que buscas:
- ¿Aparecen resultados en español con contexto dominicano? Si la respuesta es no o pocos, hay un hueco.
- ¿Los primeros resultados son de los propios operadores (Western Union, Remitly)? Eso es bueno — significa intención de compra alta, y tú puedes posicionarte justo antes de ellos.
- ¿Aparece algún comparador en español para este corredor específico? Si no aparece, el vacío es real.

Documenta todo en una hoja de cálculo.

**Experimento 1.2 — Google Keyword Planner o Ubersuggest (2 horas)**

Crea una cuenta gratuita en Ubersuggest (ubersuggest.com) o usa Google Keyword Planner.
Busca el volumen de búsqueda mensual de estas keywords:

| Keyword | Volumen esperado | Lo que confirma |
|---------|-----------------|-----------------|
| "enviar dinero a República Dominicana" | 1,000–10,000/mes | Intención activa |
| "giros a República Dominicana" | 500–5,000/mes | Palabra clave local |
| "Western Union República Dominicana" | 500–5,000/mes | Comparan operadores |
| "remitly República Dominicana" | 200–2,000/mes | Conocen alternativas |
| "tipo de cambio dólar peso dominicano" | 1,000–10,000/mes | Buscan información financiera |

Umbral mínimo para continuar: al menos 3 de las 5 keywords tienen 500+ búsquedas/mes.
Si están por debajo, el mercado digital en español es demasiado pequeño para SEO — hay que cambiar
de canal (WhatsApp y Facebook se vuelven aún más importantes).

**Experimento 1.3 — Conversaciones con 10 personas reales (1 semana)**

Esta es la validación más importante y la más barata. Habla con 10 dominicanos en EE.UU.
que envíen giros regularmente. No tienes que conocerlos — están en grupos de Facebook,
en iglesias dominicanas, en comunidades de WhatsApp.

Preguntas que hacer (en ese orden):
1. "¿Cómo envías dinero a tu familia ahora mismo?"
2. "¿Sabes cuánto te cobran exactamente incluyendo el tipo de cambio?"
3. "¿Alguna vez comparaste precios entre dos opciones antes de enviar?"
4. "¿Usarías una web o app que te muestre cuál opción es la más barata hoy?"
5. "¿Qué te haría desconfiar de algo así?"

Lo que buscas escuchar:
- "Siempre uso Western Union porque no sé de otra" → hay ignorancia del mercado, hay oportunidad
- "Ya uso Remitly" → ya hay adopción digital, tu comparador tiene audiencia
- "No sé cuánto me cobran exactamente" → el dolor del precio opaco es real
- "No confiaría en algo que no conozco" → necesitas construir confianza primero

Documenta las respuestas literalmente. Las palabras que usan son las que vas a poner en tu copy.

**Umbral de validación del Nivel 1:**
- ✅ Al menos 7 de 10 personas no saben exactamente cuánto pagan en total (fee + spread de cambio)
- ✅ Al menos 5 de 10 personas dicen que usarían un comparador si existiera y fuera confiable
- ✅ Al menos 3 keywords tienen volumen de búsqueda real

Si no cumples estos umbrales: el problema no está bien articulado. Cambia el ángulo.
Quizás el problema no es el precio — es la velocidad, la confianza, o la entrega en efectivo.
Vuelve a las conversaciones con las preguntas ajustadas.

---

## NIVEL 2 — Validar que el producto funciona

### Qué estás validando
Que cuando alguien llega al sitio, entiende qué es, puede usarlo sin confusión,
y considera que la información es útil y confiable.

### Cuándo hacer este nivel
Cuando el MVP técnico esté desplegado en Vercel con el dominio real.
No antes — no hay nada que validar sin el producto.

**Experimento 2.1 — Prueba de los 5 segundos (1 semana)**

Comparte el link del sitio con 10 personas (diferentes a las de Nivel 1, si es posible).
Deja que abran el sitio solos en su teléfono. Después de 5 segundos, sin que hayan hecho
nada todavía, pregúntales:

- "¿Qué crees que hace este sitio?"
- "¿Para quién crees que es?"
- "¿Confiarías en los precios que muestra?"

Lo que buscas:
- Deben poder describir el propósito en sus propias palabras sin haber leído nada
- La respuesta no debe incluir "no sé" ni "parece complicado"
- La confianza debe ser neutral o positiva — si dicen "parece spam", hay un problema de diseño o copy

Si fallan: el problema está en el primer encabezado (H1), en el diseño, o en la ausencia
de señales de confianza (logos de los operadores conocidos, un número de transacciones comparadas, etc.)

**Experimento 2.2 — Prueba de uso real (2 semanas)**

Pide a 5 personas que completen esta tarea específica frente a ti (en persona o por llamada):
"Quiero que uses este sitio como si fueras a enviar $300 a República Dominicana hoy. Dime en voz alta todo lo que ves y piensas."

Esta técnica se llama "think aloud" y revela problemas que tú nunca verías porque conoces el producto.

Lo que buscas documentar:
- ¿Llegaron a la tabla de comparación sin perderse?
- ¿Entendieron la diferencia entre el fee y el tipo de cambio?
- ¿Hicieron clic en algún botón de "Enviar con X"?
- ¿Qué preguntaron o dijeron que los confundió?
- ¿Qué les generó desconfianza?

Umbral mínimo: 4 de 5 personas llegan a la tabla de comparación sin ayuda y entienden cuál operador es el más barato para su monto.

**Experimento 2.3 — Métricas de comportamiento (Google Analytics + Hotjar)**

Instala Google Analytics 4 y Hotjar (versión gratuita) desde el día 1 del deploy.
Después de 2 semanas con tráfico real, analiza:

| Métrica | Umbral mínimo "funciona" | Qué significa si falla |
|---------|--------------------------|------------------------|
| Tiempo promedio en página | 45+ segundos | La gente no lee/usa el comparador |
| Bounce rate | Menor al 75% | La página no conecta con la intención |
| Scroll depth | 60%+ llega a la tabla | El comparador está muy abajo |
| Clics en botones de afiliado | 5%+ del total de visitas | El comparador no genera acción |

Los heatmaps de Hotjar muestran exactamente dónde hace clic la gente y dónde se detiene.
Si nadie hace clic en "Enviar con Remitly" es un problema de posición, color, o copy del botón.

---

## NIVEL 3 — Validar que el modelo de negocio funciona

### Qué estás validando
Que existe al menos un usuario que llegó al sitio desde tu plataforma, hizo clic en
un link de afiliado, se registró en el operador, y completó una transferencia real.
Una sola conversión confirma que el mecanismo funciona.

### La métrica que más importa en este nivel
**Revenue por visita (RPV)**

```
RPV = Ingresos totales de afiliados / Visitas únicas del período
```

Ejemplo: Si en el mes 2 tienes 1,000 visitas y ganas $30 en comisiones:
RPV = $30 / 1,000 = $0.03 por visita

Ese número te dice cuánto vale cada visita que traes.
Si el RPV es mayor a $0.02, el negocio tiene fundamentos.
Si el RPV es mayor a $0.10, el negocio escala rentablemente con publicidad pagada.

### Experimento 3.1 — El primer afiliado activado (mes 2)

Objetivo: que al menos 1 persona complete una transferencia usando tu link de afiliado.

Para lograrlo activamente (no esperar pasivamente):
- Comparte el link del comparador en el grupo de WhatsApp propio
- Publica en los grupos de Facebook de dominicanos con el tipo de cambio del día
- Añade al final: "Compara aquí cuánto te cobran hoy: [link]"
- Si alguien pregunta cómo enviar dinero a RD, responde con el link

No consideres este nivel validado hasta tener la notificación de pago de al menos un afiliado.
No importa si son £10 de Wise o $20 de Remitly. Lo que importa es que el ciclo completo funcionó:
visita → clic → registro → transferencia → comisión.

### Experimento 3.2 — Medir la tasa de conversión real (mes 2–3)

Con los datos de los programas de afiliados, calcula:

```
Tasa de clic = Clics en links de afiliado / Visitas totales
Tasa de conversión = Usuarios que completan transferencia / Clics totales
```

| Benchmarks del mercado | Referencia |
|------------------------|-----------|
| Tasa de clic esperada | 5%–15% |
| Tasa de conversión esperada | 15%–30% de los que hacen clic |
| Combinadas: 1%–4% de las visitas generan una comisión | Normal para este modelo |

Si tu tasa de clic es menor al 3%: el botón de afiliado no es visible, no es convincente,
o el usuario no tiene intención de enviar dinero ahora mismo (problema de atracción del canal).

Si tu tasa de conversión es menor al 10%: el operador al que estás enviando tiene fricción
en su proceso de registro, o el usuario llegó a su web y no confió. Prueba con otro operador.

### Experimento 3.3 — La prueba del canal (mes 3)

¿De dónde viene el usuario que convierte?

En Google Analytics, configura objetivos (goals) que trackeen los clics en links de afiliado.
Después de 4 semanas con tráfico desde múltiples canales (SEO, Facebook, WhatsApp, TikTok),
analiza qué canal genera más conversiones — no más visitas.

Puede que TikTok traiga 300 visitas y 0 conversiones.
Puede que el grupo de Facebook traiga 50 visitas y 5 conversiones.
El segundo canal vale 30x más que el primero aunque tenga menos volumen.

Documenta el CPL (costo por lead) y el CPA (costo por adquisición) por canal:

```
CPA por canal = Dinero gastado en ese canal / Conversiones de ese canal
```

Si el CPA orgánico de Facebook es $0 (tiempo invertido únicamente) y genera conversiones,
eso es el canal principal a escalar. Si el TikTok orgánico genera visitas pero no conversiones,
es un canal de awareness, no de conversión — útil para construir comunidad, no para afiliados.

**Umbral de validación del Nivel 3:**
- ✅ Al menos 1 comisión de afiliado recibida
- ✅ RPV mayor a $0.02
- ✅ Al menos 1 canal identificado con CPA menor al valor de la comisión promedio ($25)

---

## NIVEL 4 — Validar que el canal de marketing es reproducible

### Qué estás validando
Que puedes adquirir usuarios de forma predecible, a un costo conocido,
y que esos usuarios convierten en comisiones que cubren su costo de adquisición.

Este es el nivel que desbloquea escalar. Sin este nivel validado, escalar solo amplifica
el problema — gastas más dinero en adquirir usuarios que no convierten.

### Experimento 4.1 — El canal orgánico principal (mes 3–4)

Elige el canal que en el Nivel 3 mostró el mejor CPA orgánico y ponle el 80% de tu energía.

Si fue el grupo de WhatsApp:
- Duplica el número de grupos donde eres activo
- Crea un segundo grupo segmentado (ej: dominicanos en Florida específicamente)
- Mide cuántas conversiones adicionales genera cada grupo nuevo
- Si cada nuevo grupo de 100 personas activas genera 1–2 conversiones/mes: el canal escala

Si fue el contenido de Facebook:
- Escala de 1 post por día a 2 posts por día
- Mide si las conversiones se duplican o si hay saturación
- Si el crecimiento es lineal (2x posts = 2x conversiones): el canal escala

Si fue el SEO:
- Publica 2 artículos adicionales con keywords similares a los que ya funcionan
- Mide si el tráfico orgánico crece proporcionalmente en 3–4 semanas
- El SEO tarda en validarse — dale 6–8 semanas antes de juzgarlo

### Experimento 4.2 — El primer peso en publicidad pagada (mes 4–5)

Solo hacer este experimento cuando el canal orgánico ya genera conversiones consistentes.
Nunca antes. Pagar por tráfico que no convierte solo quema capital.

Presupuesto mínimo de prueba: $50 en Meta Ads (Facebook + Instagram).
Segmentación: dominicanos en EE.UU., 25–55 años, que usan apps de pagos o que siguen páginas de Western Union/Remitly.

El anuncio no debe verse como un anuncio. Debe verse como contenido orgánico.
Ejemplo de copy: "¿Sabes exactamente cuánto te cobran cuando mandas los giros?
Compara los 5 operadores en 30 segundos. [Link]"

Después de $50 gastados, calcula:
- ¿Cuántas visitas generó?
- ¿Cuántos clics de afiliado?
- ¿Cuántas conversiones?
- ¿El CPA es menor a $25 (la comisión promedio)?

Si el CPA de la publicidad pagada es menor a la comisión promedio: el modelo es rentable
con paid acquisition y puedes escalar el presupuesto.

Si el CPA es mayor: el canal orgánico sigue siendo el principal. No escalar paid hasta
mejorar la tasa de conversión o el copy del anuncio.

### Experimento 4.3 — El test de retención (mes 3–4)

Un comparador de precios tiene un problema natural de retención: el usuario llega,
compara, se va al operador, y no vuelve hasta la próxima transferencia.

La forma de crear retención es el tipo de cambio diario.

Mide estas dos cosas:
1. ¿Cuántas personas del grupo de WhatsApp abren el mensaje del tipo de cambio?
   - Si más del 30% abre los mensajes: el grupo es saludable
   - Si menos del 10% abre los mensajes: el grupo está muerto, hay que reactivarlo o crear uno nuevo

2. ¿Hay usuarios que vuelven al comparador más de una vez por mes?
   - En Google Analytics, configura "returning visitors" como métrica
   - Si más del 15% son usuarios recurrentes: la retención existe
   - Si menos del 5% vuelven: la plataforma no genera hábito — el tipo de cambio diario no está funcionando como gancho

**Umbral de validación del Nivel 4:**
- ✅ Al menos 1 canal orgánico genera conversiones de forma predecible (mes tras mes)
- ✅ El CPA del mejor canal es menor a $20 (por debajo de la comisión promedio de $25)
- ✅ Al menos 15% de usuarios son recurrentes (vuelven al sitio más de una vez al mes)
- ✅ El grupo de WhatsApp tiene 30%+ de tasa de apertura en los mensajes de tipo de cambio

---

## La tabla resumen de validación

| Nivel | Pregunta clave | Umbral mínimo | Herramienta |
|-------|---------------|---------------|-------------|
| 1 — Problema | ¿La gente busca esto? | 7/10 personas no saben cuánto pagan; 3 keywords con 500+ vol. | Entrevistas + Ubersuggest |
| 2 — Producto | ¿La gente entiende y usa el comparador? | 4/5 llegan a la tabla sin ayuda; bounce rate <75% | Prueba de usuario + Hotjar |
| 3 — Modelo | ¿El modelo de negocio genera dinero? | 1 comisión recibida; RPV >$0.02 | Dashboard de afiliados + GA4 |
| 4 — Canal | ¿Puedo adquirir usuarios rentablemente? | CPA <$20; 15%+ retención | Meta Ads + GA4 + WhatsApp stats |

---

## Señales de que algo no funciona y qué hacer

### "Mucho tráfico, ninguna comisión"
Causa probable: los usuarios llegan con intención informacional (quieren saber el precio)
pero no tienen intención de enviar dinero ahora mismo.
Solución: añadir urgencia al copy. "Tipo de cambio de hoy — válido hasta las 11:59pm."
También revisar si los links de afiliado están funcionando técnicamente (trackear en el dashboard de Partnerize/Remitly).

### "Nadie llega al sitio"
Causa probable: el contenido SEO no está indexado aún (normal los primeros 2 meses)
o los canales de comunidad (WhatsApp, Facebook) no tienen masa crítica todavía.
Solución: verificar indexación en Google Search Console. Si los artículos aparecen pero sin
tráfico, las keywords son muy competidas — buscar long tail más específico.

### "La gente llega pero se va en 10 segundos"
Causa probable: el sitio tarda en cargar (Core Web Vitals deficientes), o el H1 no conecta
con la intención de búsqueda, o el diseño no genera confianza.
Solución: medir velocidad en PageSpeed Insights. Cambiar el H1 por algo más directo:
"¿Cuánto te cobra Western Union para enviar $300 a RD hoy?" — pregunta que responde
exactamente lo que el usuario vino a saber.

### "El grupo de WhatsApp no crece"
Causa probable: el mecanismo de invitación no está funcionando. Si la gente llega al sitio
pero no se une al grupo, el botón o el copy de invitación no es suficientemente valioso.
Solución: en lugar de "Únete a nuestro grupo", cambiar a "Recibe el tipo de cambio gratis
cada mañana antes de enviar los giros". El beneficio concreto convierte mejor que el concepto genérico.

### "Las comisiones son muy pequeñas para cubrir costos"
Causa probable: el volumen de usuarios es aún bajo. Esto es normal en los primeros 3 meses.
Lo que hay que medir es la tendencia, no el número absoluto.
Si las comisiones crecen semana tras semana aunque sean pequeñas: el modelo funciona, solo falta volumen.
Si las comisiones están estancadas o caen: hay un problema de retención o de canal.
Solución si hay estancamiento: diversificar el canal. Si solo usas SEO, añadir WhatsApp.
Si solo usas WhatsApp, añadir TikTok.

---

## Cuándo parar la validación y escalar

Puedes escalar cuando cumples TODOS estos criterios simultáneamente:

- [ ] Nivel 1 validado: el problema existe y lo confirman datos de búsqueda y entrevistas
- [ ] Nivel 2 validado: 4/5 usuarios usan el comparador sin ayuda; bounce rate <75%
- [ ] Nivel 3 validado: al menos 1 comisión recibida; RPV >$0.02
- [ ] Nivel 4 validado: CPA orgánico <$20; 15%+ usuarios recurrentes
- [ ] El ingreso mensual cubre los costos de infraestructura ($110/mes en los primeros meses)
- [ ] Tienes claro cuál es el canal principal (no puedes escalar lo que no sabes qué funciona)

Si cumples todos los criterios: puedes añadir el segundo corredor (Haití o Colombia),
subir el presupuesto de publicidad pagada, y comenzar las conversaciones con Banreservas.

Si no cumples todos: no escales. Vuelve al nivel que falla y resuelve ese problema primero.
Escalar un problema solo hace el problema más grande.

---

## El experimento más barato de todos — la prueba de los $0

Antes de construir cualquier tecnología, antes del MVP, antes del dominio incluso,
puedes hacer la prueba más barata del mundo para saber si hay demanda real:

1. Crea una cuenta de TikTok con el nombre del proyecto
2. Graba un video desde el teléfono, sin edición, diciendo:
   "¿Sabías que cuando mandas $300 a RD con Western Union, pierdes $18 en fees y tipo de cambio?
   Con Remitly pagas $4. Estoy creando una web para que siempre sepas quién tiene la mejor tasa.
   ¿Te interesaría? Comenta 'sí' abajo."
3. Publica el video
4. Espera 72 horas

Si el video tiene 20+ comentarios de "sí": hay demanda real. El problema resuena.
Si tiene 0 comentarios: o el algoritmo no lo distribuyó (prueba publicar otro) o el ángulo no conecta.

Este experimento cuesta $0, tarda 30 minutos, y te dice más sobre la demanda real que
3 semanas de análisis de mercado.

---

## Regla de oro de la validación

**No te enamores del producto. Enamórate del problema.**

Si el comparador no funciona pero descubres en el proceso que los dominicanos en EE.UU.
necesitan otra cosa — por ejemplo, que el problema real no es el precio sino no saber
si el dinero llegó — esa información vale más que haber lanzado el comparador perfecto.

La validación no busca confirmar que tu idea era correcta.
Busca encontrar la verdad lo más rápido y barato posible.
Si la verdad es que tu idea necesita ajustarse, eso es un éxito de validación.
Si la verdad es que tu idea funciona exactamente como la concebiste, eso también es un éxito.

El fracaso real es no validar y construir durante meses algo que nadie necesita.
