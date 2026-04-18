# 20 — Comparador UI roto tras rediseño simplicidad radical (2026-04-18)

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-20 min

## Síntoma
Síntomas posibles del rediseño del 2026-04-18:
- Usuario ve los 4 tabs viejos (Cuenta bancaria / Retiro efectivo / Domicilio / Billetera móvil) en lugar de la etiqueta gris "Método: Cuenta bancaria"
- Falta el link "Disclaimers" en el footer columna Legal
- La página `/es/disclaimers` o `/en/disclaimers` devuelve 404
- La tarjeta de operador muestra el layout viejo (grid 5 columnas con TASA/COMISIÓN/RECIBEN amontonados arriba)
- Disclaimer repetido 14 veces en el listado (2 por operador)
- Falta el badge colorizado de Preenvíos Score (verde/amarillo/rojo según valor)
- El listado se ve ancho hasta el borde de la pantalla en desktop (debería limitarse a 900px)
- La caja amarilla al final muestra el texto largo en vez del acortado con link

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — Deploy antiguo todavía cacheado en Vercel Edge
Contexto: tras el commit del rediseño, el CDN puede servir la versión vieja hasta que se invalide.

Arreglo:
1. Vercel dashboard → Deployments → confirmar que el último "Ready" corresponde al commit del rediseño
2. Si ya está desplegado: DevTools → Network → hard reload con shift+reload. El HTML debe contener "Método: Cuenta bancaria"
3. Si persiste: redeploy manual desde Vercel para purgar cache edge

### 🎯 Causa 2 — Translations faltantes (claves nuevas no agregadas)
Contexto: el rediseño agregó claves `disclaimers.topShort`, `topShortLink`, `bottomShort`, `bottomShortLink`, `footerLink` y `delivery.methodLabel`. Si `messages/es.json` o `messages/en.json` no las tienen, next-intl muestra la clave cruda o lanza error en build.

Arreglo:
1. Verificar claves presentes:
   ```bash
   grep -E "topShort|bottomShort|footerLink|methodLabel" messages/es.json messages/en.json
   ```
2. Deben aparecer 6 resultados por archivo. Si faltan, copiar del commit `feat(ui): rediseño Comparador simplicidad radical`
3. Build local: `npm run build` → si falla con "key not found", la clave falta

### 🎯 Causa 3 — Página /disclaimers no existe en el build
Contexto: la página nueva vive en `app/[locale]/disclaimers/page.tsx` + `content.tsx`. Si se borraron o la carpeta no se subió a git, el link del footer va a 404.

Arreglo:
1. Verificar archivos:
   ```bash
   ls app/[locale]/disclaimers/
   # Debe listar: page.tsx content.tsx
   ```
2. Si faltan: restaurar del commit `feat(ui): rediseño Comparador simplicidad radical` o del repo
3. Verificar build incluye la ruta: `npm run build | grep disclaimers` → debe mostrar `/es/disclaimers` y `/en/disclaimers`

### 🎯 Causa 4 — Cambio accidental revirtió el ResultCard al diseño viejo
Contexto: alguien abrió `components/Comparador.tsx` y pegó por encima el grid viejo de 5 columnas.

Arreglo:
1. Verificar que `ResultCard` tiene la estructura nueva (flex en 2 filas, no grid):
   ```bash
   grep -c "grid-cols-\[1fr_1fr\]" components/Comparador.tsx
   # Debe dar 0 (grid 2-col viejo eliminado)
   grep -c "scoreColor" components/Comparador.tsx
   # Debe dar >=2 (lógica nueva de color de badge)
   ```
2. Si hay divergencia: revertir al commit del rediseño con `git checkout <hash> -- components/Comparador.tsx`

### 🎯 Causa 5 — ESLint/TypeScript bloquea el build por METODOS sin uso
Contexto: la constante `METODOS` y la función `selectMetodo` quedaron intactas a propósito (infra para reactivar post-lanzamiento). Si alguien agrega `noUnusedLocals: true` a `tsconfig.json` o endurece eslint, el build puede fallar.

Arreglo:
1. Verificar `tsconfig.json` NO tiene `noUnusedLocals: true`
2. Si se quiere endurecer: renombrar a `_METODOS` y `_selectMetodo` (convención TS para unused intentional)
3. NO borrar — forman parte de la infra diferida según CONTEXTO_FINAL.md sección 4.2.2

### 🎯 Causa 6 — Colores Tailwind del scoreColor no existen
Contexto: la nueva ResultCard usa `bg-green`, `bg-yellow`, `bg-red` según el score. Si `app/globals.css` pierde las variables CSS, los badges se verán transparentes.

Arreglo:
1. Verificar en `app/globals.css`:
   ```bash
   grep -E "color-(green|yellow|red)" app/globals.css
   ```
2. Deben aparecer `--color-green: #00D957`, `--color-yellow: #FACC15`, `--color-red: #EF4444`
3. Si faltan: restaurar del commit base de Tailwind

## Workaround mientras arreglas
No hay workaround porque es un regresión visual, no funcional. El usuario aún puede comparar y hacer click en "Enviar →". Si el ResultCard se rompe completamente mostrando errores de console, desplegar el commit `cef65db` (docs TROUBLESHOOTING) que es el anterior al rediseño:
```bash
git revert <hash-del-rediseno>
git push
```

## Relacionados
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](../LOGICA_DE_NEGOCIO/04_componentes_react.md) — estructura del Comparador y ResultCard
- [LOGICA_DE_NEGOCIO/07_paginas_legales_disclaimers.md](../LOGICA_DE_NEGOCIO/07_paginas_legales_disclaimers.md) — dónde aparece cada disclaimer
- [05_vercel_deploy_falla.md](05_vercel_deploy_falla.md) — si el deploy del rediseño nunca terminó
- [12_i18n_locale_rutas_rotas.md](12_i18n_locale_rutas_rotas.md) — si las claves nuevas rompen el i18n
