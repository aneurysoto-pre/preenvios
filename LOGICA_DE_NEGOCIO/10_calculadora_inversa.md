# Proceso 10 — Calculadora inversa

## Descripción

El receptor en Latinoamérica escribe cuántos pesos/lempiras/quetzales recibió y la calculadora muestra cuánto USD se envió con cada operador. Revela quién aplicó peor tasa. Incluye botón de compartir por WhatsApp como activo viral.

Completado el 2026-04-16 como parte de Fase 2.

## Pasos del flujo

### 1. El receptor accede a la página
URL: `preenvios.com/[locale]/calculadora-inversa`

### 2. Elige corredor
3 botones: Rep. Dominicana, Honduras, Guatemala (El Salvador no aplica — USD a USD)

### 3. Escribe monto recibido
Ejemplo: 12,000 DOP

### 4. Cálculo inverso
Para cada operador: USD enviados = (monto recibido / tasa) + fee

Ejemplo con 12,000 DOP:
- Remitly (tasa 59.64, fee $0): $201.21 USD
- Wise (tasa 58.02, fee $4.50): $211.27 USD
- Ria (tasa 58.80, fee $1.99): $206.09 USD

### 5. Resultados ordenados
De menor a mayor USD enviado (el que usó menos dólares dio mejor tasa). El primero aparece con borde verde.

### 6. Botón de compartir por WhatsApp
Mensaje pre-escrito: "Me llegaron 12,000 DOP. Mira cuánto realmente enviaron: preenvios.com/es/calculadora-inversa"

Abre `wa.me/?text=...` — funciona en cadenas familiares como activo viral.

## Archivos
| Archivo | Qué hace |
|---------|----------|
| `app/[locale]/calculadora-inversa/page.tsx` | Server component con setRequestLocale |
| `app/[locale]/calculadora-inversa/content.tsx` | Client component con toda la lógica |
