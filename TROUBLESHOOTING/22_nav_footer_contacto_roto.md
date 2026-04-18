# 22 — Nav/Footer falta en alguna página o formulario /contacto no guarda

## Gravedad · Tiempo al fix
🟡 Importante
⏱ Fix típico: 10-30 min

## Síntoma
Síntomas relacionados a las páginas institucionales y el header/footer globales introducidos el 2026-04-18:
- Una página legal o institucional se ve sin el nav global arriba o sin el footer abajo
- El link "Contacto" del nav o del footer va a `/contacto` pero devuelve 404
- El formulario de `/contacto` envía pero el usuario nunca ve "¡Recibimos tu mensaje!" — se queda en error
- El formulario devuelve "No se pudo guardar el mensaje" al enviar
- Los emails llegan a la API pero no aparecen en Supabase tabla `contactos`
- El footer muestra 4 columnas en lugar de 3 (+ brand) — o muestra las columnas viejas (Compare, Remitly/Wise, etc.)
- El header muestra "Comparar" al inicio del menú en lugar de empezar con "Destinos"
- Click en "Cómo funciona" o "FAQ" desde `/terminos` o `/nosotros` no hace nada

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — SQL 004 no ejecutado (tabla contactos no existe)
Contexto: la API route `/api/contactos` intenta `INSERT INTO contactos`. Si la tabla no existe en Supabase, `supabase-js` devuelve error y la ruta responde 500 → el formulario muestra "Algo falló".

Arreglo:
1. Ejecutar `supabase/migrations/004_contactos.sql` en Supabase SQL Editor (copy-paste completo)
2. Verificar en Supabase → Table Editor que `contactos` aparece con 10 columnas incluyendo `created_at` e `idioma`
3. Hacer un submit de prueba desde `/es/contacto`. Debe aparecer el row en la tabla inmediatamente
4. Si persiste error: ver Vercel Functions logs → `/api/contactos` POST → error exacto

### 🎯 Causa 2 — RLS bloquea insert porque API usa anon key
Contexto: las políticas RLS niegan cualquier INSERT al rol `anon`. El INSERT solo funciona con `SUPABASE_SERVICE_ROLE_KEY`. Si `app/api/contactos/route.ts` accidentalmente usa el anon key, todo INSERT es rechazado silenciosamente.

Arreglo:
1. Verificar en `app/api/contactos/route.ts`:
   ```bash
   grep -n "SERVICE_ROLE_KEY\|ANON_KEY" app/api/contactos/route.ts
   ```
2. Debe usar `SUPABASE_SERVICE_ROLE_KEY` (NO `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Verificar en Vercel → Settings → Environment Variables que `SUPABASE_SERVICE_ROLE_KEY` está configurada para Production + Preview

### 🎯 Causa 3 — Página legal se renderiza sin Nav/Footer
Contexto: las páginas legales usan `components/LegalPage.tsx` como wrapper. Desde 2026-04-18 ese wrapper renderiza `<Nav />` y `<Footer />` globales. Si alguien edita LegalPage y quita alguno, TODAS las páginas legales pierden header/footer.

Arreglo:
1. Verificar en `components/LegalPage.tsx`:
   ```bash
   grep -c "import Nav\|import { Footer }" components/LegalPage.tsx
   ```
2. Debe dar 2 (una línea por import). Si es 0: restaurar los imports + llamadas `<Nav />` y `<Footer />`
3. El layout esperado es: `<Nav />` → `<div className="flex-1 max-w-[820px] pt-[112px]">` (112px = 72px Nav + 40px aire) → `<Footer />`

### 🎯 Causa 4 — Página nueva no usa Nav/Footer y no es una legal
Contexto: `/nosotros` y `/contacto` NO usan LegalPage (necesitan layout custom). Deben importar Nav y Footer directamente.

Arreglo:
1. Verificar:
   ```bash
   grep -l "import Nav" app/[locale]/nosotros/content.tsx app/[locale]/contacto/content.tsx
   ```
2. Ambos archivos deben aparecer. Si falta uno: agregar `import Nav from '@/components/Nav'` y `import { Footer } from '@/components/Sections'`, y envolver el return en `<div className="min-h-screen flex flex-col"><Nav /><main className="flex-1">{...}</main><Footer /></div>`

### 🎯 Causa 5 — Anchor #como o #faq no navega desde pages legales
Contexto: en Nav.tsx los links usan `homeAnchor('#como')`. Esa función devuelve `#como` cuando el usuario está en la home y `/${locale}#como` en cualquier otra página. Si alguien la simplifica a solo `#como`, hacer click desde `/terminos` no hace nada (el ancla no existe en esa página).

Arreglo:
1. Verificar en `components/Nav.tsx`:
   ```bash
   grep -n "homeAnchor\|isHome" components/Nav.tsx
   ```
2. Deben aparecer al menos 4 matches (definición + usos en desktop y mobile menu para `#como` y `#faq`)
3. Si falta: restaurar el helper `const homeAnchor = (hash: string) => (isHome ? hash : \`/${locale}${hash}\`)`

### 🎯 Causa 6 — Translations faltantes para nav.contact, nosotros.* o contacto.*
Contexto: si las claves nuevas no existen en `messages/es.json` o `messages/en.json`, next-intl lanza error en build o renderiza la clave cruda en runtime.

Arreglo:
1. Verificar presencia:
   ```bash
   grep -c '"contact"\|"nosotros"\|"contacto"' messages/es.json messages/en.json
   ```
2. Cada archivo debe dar >=3 (al menos 1 por clave)
3. Si faltan: copiar del commit `feat(nav+pages): ...` que introdujo estas secciones

### 🎯 Causa 7 — Email de partnerships@ o contact@ no tiene mailbox configurado
Contexto: los links `mailto:contact@preenvios.com` y `mailto:partnerships@preenvios.com` funcionan en la UI pero los emails caen al vacío si el MX del dominio no está apuntando a un proveedor (Google Workspace, Zoho, etc.).

Arreglo:
1. No es un bug de código — es config de infraestructura
2. Ver DNS del dominio preenvios.com en Namecheap → verificar MX records
3. Si es acción del usuario: agregar al CONTEXTO_FINAL "Acciones pendientes" si aún no está

## Workaround mientras arreglas
- Si la tabla `contactos` no existe: el mensaje "Algo falló" redirige al usuario a `mailto:contact@preenvios.com` que sí funciona si el MX está bien
- Si el nav/footer falta visualmente en una página, el sitio sigue funcional — solo se ve desconectado
- Si el SQL no se ha ejecutado, desactivar temporalmente el formulario mostrando solo la sidebar con los emails directos

## Relacionados
- [LOGICA_DE_NEGOCIO/03_base_de_datos.md](../LOGICA_DE_NEGOCIO/03_base_de_datos.md) — schema contactos + RLS
- [LOGICA_DE_NEGOCIO/04_componentes_react.md](../LOGICA_DE_NEGOCIO/04_componentes_react.md) — LegalPage wrapper, Nav order, Footer columns
- [06_supabase_errores.md](06_supabase_errores.md) — si Supabase general falla
- [07_alertas_email_no_llegan.md](07_alertas_email_no_llegan.md) — si el patrón de emails inbound/outbound está roto
- [17_suscripcion_free_spam.md](17_suscripcion_free_spam.md) — si contactos comienza a recibir spam hay que copiar el patrón de rate limit
