# LOGICA_DE_NEGOCIO/

Documentación paso a paso de cómo funciona cada pieza del proyecto PreEnvios.com.

---

## Qué es esta carpeta

Aquí se documenta la **lógica de negocio** de cada funcionalidad del proyecto en español claro. No es código — es la explicación de qué hace cada pieza y cómo funciona internamente para que alguien que llegue nuevo al proyecto entienda todo sin tener que leer el código fuente.

El código vive en los archivos `.ts/.tsx` del proyecto. Aquí vive la explicación.

---

## Cómo se usa

- Cada archivo tiene un prefijo numérico y nombre descriptivo: `01_flujo_comparador.md`, `02_algoritmo_ranking.md`, etc.
- Se crea o actualiza cada vez que se termina una funcionalidad o sub-fase del roadmap
- Cada archivo sigue la misma estructura:

```
# Proceso X — Nombre descriptivo

## Descripción
Qué hace esta pieza y por qué existe.

## Pasos del flujo
1. Paso uno...
2. Paso dos...
3. ...
```

---

## Índice de documentos

| # | Archivo | Qué documenta | Fase |
|---|---------|---------------|------|
| 01 | [01_scaffolding_nextjs.md](01_scaffolding_nextjs.md) | Estructura base del proyecto Next.js, Tailwind, i18n, Supabase | Fase 1 — Bloque 1 |

Este índice se actualiza cada vez que se agrega un nuevo documento.
