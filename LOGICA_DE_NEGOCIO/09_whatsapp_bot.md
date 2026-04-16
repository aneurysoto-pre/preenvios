# Proceso 09 — Bot WhatsApp (Twilio)

## Descripción

Bot de WhatsApp que responde con la tasa del día cuando el usuario escribe un código de corredor. Detecta idioma automáticamente y responde en español o inglés. Incluye link de afiliado al mejor operador.

Completado el 2026-04-16 como parte de Fase 2. Se activa cuando el usuario configure Twilio.

## Pasos del flujo

### 1. El usuario envía mensaje por WhatsApp
Escribe cualquiera de: DOP, HNL, GTQ, USD, SVC, RD, HN, GT, SV, dominicana, honduras, guatemala, salvador

### 2. Twilio envía el mensaje al webhook
`POST /api/whatsapp/webhook` recibe FormData con `Body` (texto) y `From` (número)

### 3. Detección de idioma
- Si el mensaje contiene palabras en inglés (send, rate, how, money, hello): responde en inglés
- Si no: responde en español

### 4. Búsqueda del corredor
- El texto se normaliza a minúsculas
- Se busca en un mapa de aliases: DOP → dominican_republic, HNL → honduras, etc.
- Si no encuentra match: envía mensaje de ayuda con los 4 códigos disponibles

### 5. Consulta a Supabase
- Busca precios del corredor con método 'bank', activos, ordenados por tasa descendente
- El primer resultado es el mejor operador

### 6. Respuesta formateada
Ejemplo en español:
```
📊 *Tasa de hoy — USA → Rep. Dominicana*

🥇 Mejor: *Remitly*
💱 Tasa: 59.64 por USD
💰 Comisión: Gratis
⚡ Velocidad: Minutos

👉 Enviar ahora: [link afiliado]

Compara todas: preenvios.com/es
```

### 7. Respuesta TwiML
Se devuelve XML TwiML que Twilio usa para enviar la respuesta al usuario.

## Pendiente de acción del usuario
- Crear cuenta Twilio
- Configurar WhatsApp sandbox
- Proveer keys: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
- Publicar número en footer y redes sociales
