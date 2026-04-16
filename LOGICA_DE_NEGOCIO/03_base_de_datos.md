# Proceso 03 — Base de datos y API de precios

## Descripción

Los precios de las remesadoras se almacenan en Supabase (PostgreSQL) en lugar del HTML hardcodeado del MVP. Esto permite actualizar precios sin tocar código, preparar la estructura para scrapers automáticos y soportar métodos de entrega como dimensión del comparador.

Las tablas se crean con `supabase/migrations/001_create_tables.sql`. Los datos iniciales se insertan con `scripts/seed.mjs`.

## Pasos del flujo

### 1. Estructura de tablas

**Tabla `corredores`** — los 4 corredores activos del MVP:
- `id` (text, primary key): 'honduras', 'dominican_republic', 'guatemala', 'el_salvador'
- `nombre` / `nombre_en`: nombre en español e inglés para i18n
- `moneda`, `simbolo`, `bandera`, `codigo_pais`: metadata del corredor
- `tasa_banco_central`: tasa de referencia del banco central (se muestra en el strip de bancos)
- `prioridad`: orden de aparición (1 = Honduras, 2 = RD, etc.)

**Tabla `precios`** — precio por operador × corredor × método de entrega:
- `operador`: 'remitly', 'wise', 'xoom', etc.
- `corredor`: referencia a tabla corredores
- `metodo_entrega`: 'bank' (default), 'cash_pickup', 'delivery', 'mobile'
- `tasa`, `fee`, `velocidad`: datos de la comparación
- `afiliado`, `link`: para los botones "Enviar ahora"
- `confiabilidad`, `metodos_disponibles`: criterios del ranking expandido
- `actualizado_en`: timestamp de última actualización (será usado por scrapers)
- Índice único: (operador, corredor, metodo_entrega) — no puede haber duplicados

### 2. Seguridad (RLS)
- Ambas tablas tienen Row Level Security activado
- Política `public_read`: cualquier usuario puede leer sin autenticación
- Escritura: solo via service_role key (seed script, scrapers, panel admin)

### 3. API routes

**GET `/api/precios?corredor=honduras&metodo=bank`**
- Devuelve precios activos de un corredor y método de entrega
- Default: método 'bank' si no se especifica
- Cache: 5 minutos (s-maxage=300) con stale-while-revalidate de 10 minutos
- Sin corredor: devuelve todos

**GET `/api/corredores`**
- Devuelve corredores activos ordenados por prioridad
- Cache: 1 hora (s-maxage=3600) — los corredores cambian poco

### 4. Seed de datos iniciales
El script `scripts/seed.mjs` usa la service_role key para insertar:
- 4 corredores con metadata del MVP
- 28 precios (7 operadores × 4 corredores) con método 'bank'
- Usa `upsert` con `onConflict` para poder re-ejecutarse sin duplicar datos

### 5. Migración del MVP al producto final
| Antes (MVP) | Después (Producto final) |
|---|---|
| Tasas hardcodeadas en index.html | Tasas en Supabase, consultadas via API |
| Actualización: editar HTML, commit, push | Actualización: cambiar dato en Supabase (o scraper automático) |
| Sin método de entrega | Método de entrega como dimensión de la tabla |
| Sin historial | `actualizado_en` permite tracking de cambios |
