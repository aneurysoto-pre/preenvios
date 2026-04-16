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
| **Afiliado** | 25% | 1.0 si el operador tiene acuerdo de afiliado con Preenvíos, 0.0 si no |
| **Velocidad** | 20% | Segundos = 1.0, Minutos = 0.8, Horas = 0.4, Días = 0.0 |
| **Confiabilidad** | 10% | Valor fijo por operador (0-100) basado en años de operación y licencia en EE.UU., normalizado a 0-1 |
| **Métodos** | 10% | Cantidad de métodos de entrega disponibles dividido entre 4 (máximo posible) |

### 3. Puntaje final
- Se multiplica cada score parcial por su peso y se suman
- El resultado (0-1) se multiplica por 100 para obtener el Preenvíos Score (0-100)
- Se calcula también cuánto recibiría el destinatario: (monto - fee) × tasa

### 4. Ordenamiento
- Los operadores se ordenan de mayor a menor score
- El primero obtiene el badge "MEJOR OPCIÓN"
- El segundo obtiene el badge "SEGUNDA OPCIÓN"

### 5. Ejemplo concreto
Para enviar $200 a RD, si Remitly tiene tasa 59.64, fee $0, minutos, afiliado=sí, confiabilidad=80, métodos=3:
- Tasa score: (59.64 - 58.02) / (59.64 - 58.02) = 1.0 (asumiendo que es la mejor)
- Afiliado score: 1.0
- Velocidad score: 0.8 (Minutos)
- Confiabilidad score: 0.80
- Métodos score: 3/4 = 0.75
- Score final: (1.0×0.35 + 1.0×0.25 + 0.8×0.20 + 0.80×0.10 + 0.75×0.10) × 100 = **91.5**

## Cambios respecto al MVP

| MVP (index.html) | Producto final (lib/ranking.ts) |
|---|---|
| 3 criterios: tasa 40%, afiliado 35%, velocidad 25% | 5 criterios: tasa 35%, afiliado 25%, velocidad 20%, confiabilidad 10%, métodos 10% |
| Sin badge de puntaje | Badge "Preenvíos Score: X/100" en cada tarjeta |
| Puntaje interno no visible | Puntaje visible al usuario para transparencia |
