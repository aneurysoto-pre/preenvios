# Proceso 13 — Flujo de precios end-to-end

## Descripción

Flujo completo desde que un operador publica su tasa en su web hasta que el usuario la ve en el comparador de PreEnvios. Cubre scraping, almacenamiento, ranking y presentación.

## Diagrama del flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FUENTES DE DATOS                                │
│  Remitly.com  Wise.com  Xoom.com  Ria.com  WorldRemit  WU  MG     │
│     │            │         │        │          │        │    │      │
│     └────────────┴─────────┴────────┴──────────┴────────┴────┘      │
│                              │                                      │
│                    APIs públicas / HTMLs                             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  VERCEL CRON JOB (1x/día 7AM UTC — TEMPORAL Hobby, 2h con Pro)  │
│  vercel.json → GET /api/scrape                                      │
│                                                                      │
│  ┌─────────────────────────────────────┐                            │
│  │  ORQUESTADOR (lib/scrapers/index.ts)│                            │
│  │                                     │                            │
│  │  1. scrapeWise()      ──┐          │                            │
│  │  2. scrapeRia()        │          │                            │
│  │  3. scrapeXoom()       │ 2s min   │                            │
│  │  4. scrapeWorldRemit() ├─entre──► │ rate limiting por operador │
│  │  5. scrapeRemitly()    │ cada     │ User-Agent: PreenviosBot   │
│  │  6. scrapeMoneyGram()  │ request  │                            │
│  │  7. scrapeWesternUnion()┘          │                            │
│  └─────────────────────────────────────┘                            │
│                    │                                                 │
│           Por cada scraper:                                         │
│           - 8 corredores (HN,DO,GT,SV,CO,MX,NI,HT)                │
│           - Extrae: tasa, fee, velocidad, metodo_entrega            │
│           - Si falla 3x seguidas → marca "desactualizado"          │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL)                                              │
│                                                                      │
│  tabla: precios                                                     │
│  ┌──────────┬──────────┬────────────────┬──────┬─────┬───────────┐ │
│  │ operador │ corredor │ metodo_entrega │ tasa │ fee │ actualiz. │ │
│  ├──────────┼──────────┼────────────────┼──────┼─────┼───────────┤ │
│  │ remitly  │ honduras │ bank           │26.45 │2.99 │ 2026-04.. │ │
│  │ wise     │ dom_rep  │ bank           │58.02 │4.50 │ 2026-04.. │ │
│  │ ...      │ ...      │ ...            │ ...  │ ... │ ...       │ │
│  └──────────┴──────────┴────────────────┴──────┴─────┴───────────┘ │
│  UPSERT on conflict (operador, corredor, metodo_entrega)           │
│  56 filas activas (7 operadores × 8 corredores)                    │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│  USUARIO EN preenvios.com                                           │
│                                                                      │
│  1. Elige corredor (🇩🇴 Rep. Dominicana)                            │
│  2. Elige método de entrega (Cuenta bancaria)                       │
│  3. Escribe monto ($200 USD)                                        │
│  4. Frontend → GET /api/precios?corredor=dominican_republic&metodo=bank│
│                                                                      │
│  ┌─────────────────────────────────────┐                            │
│  │  API /api/precios (route.ts)        │                            │
│  │  → SELECT * FROM precios            │                            │
│  │    WHERE corredor = X               │                            │
│  │    AND metodo_entrega = Y           │                            │
│  │    AND activo = true                │                            │
│  │  → Cache: 5 min (s-maxage=300)      │                            │
│  └──────────────────┬──────────────────┘                            │
│                     │                                                │
│                     ▼                                                │
│  ┌─────────────────────────────────────┐                            │
│  │  RANKING (lib/ranking.ts)           │                            │
│  │                                     │                            │
│  │  Para cada operador calcula:        │                            │
│  │  · Tasa normalizada         × 0.35  │                            │
│  │  · Afiliado (sí=1, no=0)   × 0.25  │                            │
│  │  · Velocidad (seg→1, hr→.4)× 0.20  │                            │
│  │  · Confiabilidad (0-100)   × 0.10  │                            │
│  │  · Métodos disponibles     × 0.10  │                            │
│  │  ─────────────────────────────────  │                            │
│  │  = Preenvíos Score (0-100)          │                            │
│  │                                     │                            │
│  │  Ordena de mayor a menor score      │                            │
│  └──────────────────┬──────────────────┘                            │
│                     │                                                │
│                     ▼                                                │
│  ┌─────────────────────────────────────┐                            │
│  │  TARJETAS DE RESULTADO              │                            │
│  │                                     │                            │
│  │  #1 ★ MEJOR OPCIÓN (verde)         │                            │
│  │     Remitly · Score 91/100          │                            │
│  │     Tasa 59.64 · Fee Gratis         │                            │
│  │     Reciben: RD$11,928              │                            │
│  │     [Enviar ahora →] ← link afil.  │                            │
│  │     Disclaimer #4 FTC               │                            │
│  │     Disclaimer #1 tasas aprox.      │                            │
│  │                                     │                            │
│  │  #2 SEGUNDA OPCIÓN (azul)           │                            │
│  │     Wise · Score 78/100             │                            │
│  │     ...                             │                            │
│  │                                     │                            │
│  │  #3-7 sin badge                     │                            │
│  └─────────────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────────┘
```

## Pasos del flujo (detalle)

### 1. Operador publica tasa
Cada remesadora publica su tasa de cambio y fees en su sitio web. Algunas exponen APIs semi-públicas (Wise), otras requieren scraping de HTML (WU, Remitly).

### 2. Cron job ejecuta
Vercel ejecuta `GET /api/scrape` una vez al día a las 7:00 AM UTC según `vercel.json` (TEMPORAL — Vercel Hobby plan solo permite 1 cron/día. Al activar Vercel Pro $20/mes se volverá a cada 2 horas según el diseño original). El endpoint verifica `CRON_SECRET` para seguridad. El admin también puede ejecutar scrapers manualmente desde el panel.

### 3. Orquestador corre scrapers
`lib/scrapers/index.ts` ejecuta los 7 scrapers en secuencia. Cada scraper procesa los 8 corredores con rate limiting de 2 segundos mínimo entre requests.

### 4. Scraper extrae datos
Cada scraper hace fetch al endpoint del operador, parsea la respuesta JSON/HTML, y extrae: tasa, fee en USD, velocidad estimada, y método de entrega.

### 5. Upsert en Supabase
`savePrices()` en `base.ts` hace upsert con `onConflict: 'operador,corredor,metodo_entrega'`. Si el precio ya existe, actualiza tasa/fee/timestamp. Si no existe, lo crea.

### 6. Usuario entra al sitio
Elige corredor en el buscador personalizado, selecciona método de entrega, escribe monto en USD.

### 7. Frontend llama API
`GET /api/precios?corredor=X&metodo=bank` — el Comparador hace fetch cada vez que cambian corredor o método.

### 8. API lee Supabase
Filtra por corredor, método de entrega, y `activo=true`. Ordena por tasa descendente. Cache de 5 minutos con `stale-while-revalidate`.

### 9. Ranking calcula scores
`rankProviders()` normaliza los 5 criterios, pondera, y ordena. El resultado incluye `score` (0-100) y `recibe` (monto que llega al destinatario).

### 10. Frontend muestra tarjetas
Las tarjetas se renderizan con badges (Mejor Opción, Segunda Opción), Preenvíos Score, disclaimers #1 y #4, y botones de afiliado con tracking.

## Tiempos del flujo

| Paso | Tiempo |
|------|--------|
| Cron trigger → scrapers completan | 30-90 segundos |
| Supabase write | < 1 segundo |
| Usuario request → API response | < 200ms (con cache: < 50ms) |
| Ranking cálculo | < 5ms (JavaScript en cliente) |
| Total: dato actualizado → usuario lo ve | 2 horas max (intervalo del cron) |
