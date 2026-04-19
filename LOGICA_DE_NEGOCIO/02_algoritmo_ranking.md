# Proceso 02 — Algoritmo de ranking (Preenvíos Score)

## Descripción

El algoritmo de ranking determina en qué orden aparecen los operadores en los resultados del comparador. Cada operador recibe un puntaje de 0 a 100 llamado "Preenvíos Score" basado en 5 criterios ponderados. Este puntaje se muestra como badge en cada tarjeta de resultado.

El código vive en `lib/ranking.ts`.

## Pasos del flujo

### 1. Entrada
- La función `rankProviders` recibe la lista de precios (de Supabase) y el monto en USD que el usuario quiere enviar.

### 2. Cálculo por operador
Para cada operador se calculan 5 scores parciales normalizados de 0 a 1:

| Criterio | Peso | Cómo se calcula |
|----------|------|-----------------|
| **Tasa** | 35% | Se normaliza entre la peor y la mejor tasa del corredor. El operador con mejor tasa obtiene 1.0, el peor obtiene 0.0 |
| **Valor afiliado** | 25% | Valor económico esperado por click: `comision_usd × min(cookie_dias/30, 3) × trafico_calificable`. Normalizado contra min/max de operadores con afiliado del corredor. Si el operador no tiene afiliado → 0 |
| **Velocidad** | 15% | Segundos = 1.0, Minutos = 0.8, Horas = 0.4, Días = 0.0 |
| **Confiabilidad** | 15% | Valor fijo por operador (0-100) basado en años de operación y licencia en EE.UU., normalizado a 0-1 |
| **Métodos** | 10% | Cantidad de métodos de entrega disponibles dividido entre 4 (máximo posible) |

### 3. Valor afiliado — fórmula detallada (Fase 4.2, 2026-04-18)

El factor reemplazó al antiguo binario "afiliado" (1 o 0) por una medida económica:

```
valor_bruto = comision_usd × min(cookie_dias/30, 3) × trafico_calificable
valor_afiliado_score = (valor_bruto - min) / (max - min)  [normalizado contra operadores con afiliado del corredor]
```

- **comision_usd**: comisión estimada por conversión en USD
- **cookie_dias**: duración de cookie del programa (9999 = lifetime). Se cap a 3× para que un lifetime no domine completamente
- **trafico_calificable**: fracción 0-1 del tráfico que califica al programa (ej. Xoom solo US Android → 0.4 porque iPhone y desktop quedan fuera)

#### Valores iniciales por operador (seed SQL 003, activados WU+MG en SQL 005)

| Operador | comision_usd | cookie_dias | trafico_calificable | valor_bruto | Estado afiliado |
|----------|--------------|-------------|----------------------|-------------|-----------------|
| WorldRemit | $30 | 45 | 1.0 | 45 | Aprobado (CJ) |
| Wise | $12 | 9999 (lifetime) | 1.0 | 36 | Aprobado (Partnerize) |
| Remitly | $12 | 30 | 1.0 | 12 | Aprobado (Impact.com) |
| Western Union | $10 | 30 | 1.0 | 10 | 🟡 Pendiente (CJ) |
| Xoom | $10 | 30 | 0.4 | 4 | Aprobado (CJ) |
| Ria | $8 | 30 | 1.0 | 8 | Aprobado (CJ) |
| MoneyGram | $5 | 30 | 1.0 | 5 | 🟡 Pendiente (FlexOffers + CJ) |

**Nota sobre Western Union y MoneyGram (2026-04-18):** tras la migración 005 ambos tienen `afiliado=true` y puntúan en el factor valor_afiliado como cualquier otro operador. Sus valores de comision/cookie/trafico son placeholders hasta que las cuentas sean aprobadas y se confirmen los términos reales de cada programa. El link en `precios.link` es el dominio público (sin tracking ID) — CTR contará pero no hay atribución de comisión hasta el swap a URL con tracking.

### 4. Puntaje final
- Se multiplica cada score parcial por su peso y se suman
- El resultado (0-1) se multiplica por 100 para obtener el Preenvíos Score (0-100)
- Se calcula también cuánto recibiría el destinatario: (monto - fee) × tasa

### 5. Ordenamiento
- Los operadores se ordenan de mayor a menor score
- El primero obtiene el badge "MEJOR OPCIÓN"
- El segundo obtiene el badge "SEGUNDA OPCIÓN"

### 6. Ejemplo concreto — Rep. Dominicana, $200, tasas realistas

| Operador | tasa | valor_afiliado_score | Preenvíos Score |
|----------|------|----------------------|-----------------|
| Wise | 59.80 | 0.78 (cookie lifetime) | 84 |
| WorldRemit | 58.90 | 1.00 ($30 comisión) | 72 |
| Remitly | 59.60 | 0.20 | 67 |
| Xoom | 59.40 | 0.00 (tráfico 0.4) | 58 |
| Ria | 59.00 | 0.10 | 49 |
| Western Union | 58.50 | ~0.20 | ~42 |
| MoneyGram | 58.30 | ~0.10 | ~37 |

Wise sube al top por cookie lifetime aunque no tenga la mejor tasa absoluta.
WorldRemit sube pese a peor tasa por su comisión $30.
Xoom cae pese a buena tasa por tráfico calificable 0.4 (solo US Android).
Western Union y MoneyGram (desde 2026-04-18) vuelven a puntuar — sus valor_afiliado_score queda en el tercio bajo porque comision_usd es pequeña ($10 y $5) pero ya no es 0.

## Mantenimiento — cómo ajustar los valores

Cuando cambien las condiciones de un programa de afiliado (ej. Remitly sube comisión a $15):

1. `/es/admin` → Tasas → sección "Configuración de afiliado por operador"
2. Seleccionar operador del dropdown
3. Editar los 3 campos
4. Click "Aplicar a todos los corredores" → actualiza todas las filas de ese operador en `precios`
5. El ranking refleja el cambio inmediatamente (los datos se leen en cada fetch a `/api/precios`)

## Cambios respecto al MVP y versiones anteriores

| Versión | Criterios y pesos |
|---------|-------------------|
| MVP (index.html) | 3 criterios: tasa 40%, afiliado 35%, velocidad 25% |
| Fase 1 Bloque 3 (2026-04-16) | 5 criterios: tasa 35%, afiliado binario 25%, velocidad 20%, confiabilidad 10%, métodos 10% |
| **Fase 4.2 (2026-04-18 — actual)** | **5 criterios: tasa 35%, valor_afiliado ponderado 25%, velocidad 15%, confiabilidad 15%, métodos 10%** |

El binario "afiliado" se reemplazó por valor_afiliado ponderado. Velocidad bajó 5 pts, confiabilidad subió 5 pts para dar más peso a los años de trayectoria del operador.
