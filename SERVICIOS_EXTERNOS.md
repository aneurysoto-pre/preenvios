# SERVICIOS EXTERNOS — PreEnvios.com

Resumen rápido de costo mensual por servicio. AHORA = estado actual pre-lanzamiento. LANZAMIENTO = día que se active DNS de preenvios.com a Vercel.

**Detalle completo** (env vars, dashboards, límites, umbrales de upgrade por servicio): [SERVICIOS_EXTERNOS_DETALLE.md](SERVICIOS_EXTERNOS_DETALLE.md)

**Última actualización:** 2026-04-21

```
SERVICIO            AHORA   LANZAMIENTO
github               $0        $0
vercel               $0        $20      ← upgrade a Pro (términos comerciales)
supabase             $0        $25      ← upgrade a Pro (backups)
upstash redis        $0        $0
twilio               $0        $0       (sandbox; ~$1+ cuando se productivice)
resend               $0        $0       (free cubre hasta ~100 suscriptores)
zoho mail            $0        $0
namecheap            $1        $1       (dominio anual amortizado)
google analytics     $0        $0
google search cons.  $0        $0
flexoffers           $0        $0
partnerize           $0        $0
impact.com           $0        $0
cj affiliate         $0        $0
payoneer             $0        $0       (fees por transacción, no mensual)
betterstack          $0        $0
sentry               $0        $0
proxy scrapers       $0        $0       (fallback táctico $3-30 si un scraper bloquea post-lanzamiento)
─────────────────────────────────────────
TOTAL / mes          $1        $46
```

**Proyección mes 2-3 post-lanzamiento (si crecemos según plan):**

| Trigger | Servicio | Sube a |
|---------|----------|--------|
| >100 suscriptores alertas | Resend Free → Pro | +$20 |
| WhatsApp bot productivizado (post Meta verification) | Twilio pay-as-you-go | +$5-15 |
| Tráfico real paga >100GB/mes | Vercel Pro ya incluye mucho | sin costo extra |

**Todo el detalle por servicio** (env vars, dashboards, límites, umbrales para subir de plan) vive en [SERVICIOS_EXTERNOS_DETALLE.md](SERVICIOS_EXTERNOS_DETALLE.md). Cuando necesites consultar algo específico de un servicio, ese es el archivo.
