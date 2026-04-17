# Proceso 12 — Panel de administrador (Fase 4.5)

## Descripción

Panel interno protegido por autenticación básica (email + password via env vars) para gestionar el sitio sin tocar código. Incluye monitor de scrapers, editor de tasas, disparador de alertas manuales y reporte de ingresos.

Acceso: `preenvios.com/[locale]/admin` o `preenvios.vercel.app/es/admin`
Autenticación: ADMIN_EMAIL + ADMIN_PASSWORD en variables de entorno (temporal hasta Supabase Auth en Fase 4.4.B).

Completado el 2026-04-16 como Fase 4.5 del roadmap.

## Pasos del flujo

### 1. Login
1. Admin accede a `/admin`
2. Pantalla de login con email + password sobre fondo oscuro
3. `POST /api/admin/auth` valida contra env vars ADMIN_EMAIL y ADMIN_PASSWORD
4. Si correcto: crea cookie `preenvios_admin_session` httpOnly, 24 horas
5. Si incorrecto: muestra error "Credenciales incorrectas"

### 2. Dashboard (tab principal)
Al entrar ve:
- **Status badge**: HEALTHY (verde) o "X STALE" (rojo) según operadores desactualizados
- **Monitor de scrapers**: tarjeta por operador con semáforo verde/rojo, cantidad de precios, última actualización
- **Botón "Ejecutar scrapers ahora"**: llama `GET /api/scrape` manualmente
- **Disparador de alertas manual**: selector de corredor + mensaje + botón enviar
- **Stats**: precios activos, operadores, corredores, count stale

### 3. Tasas (tab editor)
- Tabla con todos los precios activos: operador, corredor, tasa, fee, última actualización
- Botón "Editar" en cada fila → inputs inline para tasa y fee
- "Guardar" → `PUT /api/admin/precios` actualiza en Supabase con timestamp nuevo
- "Cancelar" → cierra editor sin guardar
- Útil para actualización manual del lunes sin tocar código

### 4. Ingresos (tab reporte)
- Total del mes (placeholder $0 hasta Fase 3)
- Comisiones por red de afiliados: Impact (Remitly), Partnerize (Wise), CJ (Xoom/Ria/WorldRemit)
- Status de cada red: "pendiente aplicación"
- Suscripciones: free, premium, MRR (se activan en Fase 4.4)
- Datos reales cuando las APIs de afiliados estén conectadas

### 5. Seguridad
- Autenticación via cookie httpOnly (no localStorage)
- APIs admin verifican cookie en cada request via `isAdminAuthenticated()`
- Cookie secure en producción, sameSite lax
- Sesión expira en 24 horas
- Botón "Cerrar sesión" llama `DELETE /api/admin/auth`
- Se migra a Supabase Auth cuando Fase 4.4.B esté activa

## APIs del panel

| Endpoint | Método | Qué hace |
|----------|--------|----------|
| `/api/admin/auth` | POST | Login con email + password |
| `/api/admin/auth` | DELETE | Logout — borra cookie |
| `/api/admin/dashboard` | GET | Estado de scrapers, precios, stale |
| `/api/admin/precios` | GET | Lista todos los precios para edición |
| `/api/admin/precios` | PUT | Actualiza tasa y fee de un operador |
| `/api/admin/alertas` | POST | Dispara alerta manual por corredor |
| `/api/admin/ingresos` | GET | Reporte de comisiones y suscripciones |

## Archivos creados
| Archivo | Qué hace |
|---------|----------|
| `lib/admin-auth.ts` | Login, sesión, validación cookie |
| `app/api/admin/auth/route.ts` | Login/logout endpoints |
| `app/api/admin/precios/route.ts` | CRUD de precios |
| `app/api/admin/alertas/route.ts` | Disparar alertas manuales |
| `app/api/admin/ingresos/route.ts` | Reporte de ingresos |
| `app/[locale]/admin/page.tsx` | Server component |
| `app/[locale]/admin/panel.tsx` | Client component — UI completa con 3 tabs |
