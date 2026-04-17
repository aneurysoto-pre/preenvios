# TROUBLESHOOTING/

Guía de diagnóstico y solución de problemas para PreEnvios.com.

---

## Flujo general cuando algo falla

```
1. ¿Qué está fallando?
   ├── Un scraper específico     → 01_scraper_individual_falla.md
   ├── Todos los scrapers        → 02_todos_scrapers_fallan.md
   ├── Precios incorrectos       → 03_precios_desactualizados_en_comparador.md
   ├── WhatsApp bot              → 04_whatsapp_bot_no_responde.md
   ├── Deploy de Vercel          → 05_vercel_deploy_falla.md
   └── Errores de Supabase       → 06_supabase_errores.md

2. ¿Dónde reviso primero?
   ├── Panel admin: preenvios.vercel.app/es/admin → Dashboard → Monitor scrapers
   ├── Vercel logs: vercel.com → proyecto → Deployments → Functions
   ├── Supabase: supabase.com/dashboard → Table Editor → precios
   └── Endpoint directo: preenvios.vercel.app/api/admin/dashboard
```

## Índice de documentos

| # | Archivo | Cuándo usarlo |
|---|---------|---------------|
| 01 | [01_scraper_individual_falla.md](01_scraper_individual_falla.md) | Un scraper deja de funcionar |
| 02 | [02_todos_scrapers_fallan.md](02_todos_scrapers_fallan.md) | Todos los scrapers fallan al mismo tiempo |
| 03 | [03_precios_desactualizados_en_comparador.md](03_precios_desactualizados_en_comparador.md) | Precios no coinciden con la realidad |
| 04 | [04_whatsapp_bot_no_responde.md](04_whatsapp_bot_no_responde.md) | El bot de WhatsApp no responde |
| 05 | [05_vercel_deploy_falla.md](05_vercel_deploy_falla.md) | Un push a main no deploya correctamente |
| 06 | [06_supabase_errores.md](06_supabase_errores.md) | Errores de conexión o permisos en Supabase |
