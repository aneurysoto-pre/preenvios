# TROUBLESHOOTING/

Guía operativa para cuando algo se rompe en PreEnvios.com. **Un archivo por problema**: abres el que corresponde al síntoma, ejecutas el arreglo, verificas que quedó bien. Sin prosa, sin diagnósticos largos.

---

## Índice

### Operativos (cuando algo se rompe en la app)
| # | Título | Gravedad | Tiempo al fix |
|---|---|---|---|
| [01](01_scraper_individual_falla.md) | Un scraper individual falla | 🟡 | 15-30m |
| [02](02_todos_scrapers_fallan.md) | Todos los scrapers fallan | 🔴 | 10-20m |
| [03](03_precios_stale_en_comparador.md) | Precios stale en el comparador | 🟡 | 5-15m |
| [04](04_whatsapp_bot_no_responde.md) | WhatsApp bot no responde | 🟡 | 10-20m |
| [05](05_vercel_deploy_falla.md) | Vercel deploy falla | 🔴 | 5-15m |
| [06](06_supabase_errores.md) | Supabase errores generales | 🟡 | 5-20m |
| [07](07_alertas_email_no_llegan.md) | Alertas email no llegan | 🟡 | 10-30m |
| [08](08_tasas_banco_central_vacias.md) | Tasas banco central vacías | 🟢 | 5-10m |
| [09](09_graficas_historicas_vacias.md) | Gráficas históricas vacías | 🟡 | 10-20m |
| [10](10_admin_panel_no_accede.md) | Admin panel no accede | 🔴 | 5-15m |
| [11](11_logos_banderas_rotas.md) | Logos/banderas rotas | 🟢 | 5m |
| [12](12_i18n_locale_rutas_rotas.md) | i18n / locale / rutas rotas | 🟡 | 10-20m |
| [13](13_formulario_suscripcion_stuck.md) | Formulario suscripción stuck | 🟢 | 5-15m |
| [19](19_ranking_orden_inesperado.md) | Ranking devuelve un orden inesperado | 🟡 | 10-20m |
| [20](20_comparador_ui_roto.md) | Comparador UI roto tras rediseño | 🟡 | 10-20m |
| [21](21_comparador_pais_y_locale.md) | País o idioma equivocados al cargar | 🟡 | 5-15m |
| [22](22_nav_footer_contacto_roto.md) | Nav/Footer falta o /contacto no guarda | 🟡 | 10-30m |
| [23](23_ui_polish_regresiones.md) | Regresiones del pulido UI (iconos, footer 4col, fundador) | 🟡 | 5-15m |
| [24](24_afiliado_wu_mg_links.md) | Botones WU/MG grises o links sin tracking | 🟡 | 5-15m |
| [25](25_cta_scroll_y_calc_inversa.md) | CTA "Comparar ahora" no scrollea o calc inversa >4 países | 🟡 | 5-15m |
| [26](26_scraper_revierte_afiliado.md) | Scraper revierte afiliado/link de un operador | 🔴 | 5m |
| [27](27_contador_in_memory_serverless.md) | Contador failCounts in-memory no dispara marca stale en Vercel serverless (bug latente) | 🟢 | documentado, sin arreglo inmediato |

### Seguridad (vulnerabilidades activas que hay que endurecer)
| # | Título | Gravedad | Tiempo al fix |
|---|---|---|---|
| [14](14_endpoint_cron_expuesto.md) | 🔒 Endpoint cron expuesto | 🔴 | 10m |
| [15](15_admin_login_vulnerable.md) | 🔒 Admin login vulnerable | 🔴 | 30-60m |
| [16](16_webhook_twilio_sin_firma.md) | 🔒 Webhook Twilio sin firma | 🔴 | 20m |
| [17](17_suscripcion_free_spam.md) | 🔒 Suscripción free vulnerable a spam | 🟡 | 30m |
| [18](18_headers_seguridad_globales.md) | 🔒 Headers seguridad faltantes | 🟡 | 20m |

---

## Cómo usar este manual

1. **Algo falla** → identifica el síntoma visible (usuario reporta, admin muestra rojo, logs con error)
2. **Busca el síntoma en el índice** → abre el archivo que corresponde
3. **Lee solo las causas** en orden (están de más probable a menos probable)
4. **Ejecuta el arreglo** numerado — los pasos son copy-paste, con URLs y comandos reales
5. **Verifica** que quedó bien con el paso final de verificación
6. **Si ninguna causa del archivo resuelve**: documentar el incidente como problema nuevo (ver abajo)

### Dónde mirar primero cuando algo raro pasa

| Lugar | Para qué sirve |
|---|---|
| `/es/admin` → Dashboard | Estado de scrapers (rojo/verde), última actualización por operador |
| Vercel → Functions → logs | Errores de API routes y cron |
| Vercel → Deployments | Estado del último deploy, build logs |
| Supabase dashboard → Table Editor | Ver datos reales en las tablas |
| Supabase dashboard → Logs | Errores de queries, RLS bloqueos |
| DevTools → Network | Responses 500, CORS, JSON inválido |
| DevTools → Console | Errores de JS cliente, imágenes rotas |
| Resend dashboard → Logs | Emails enviados, bounces, quota |
| Twilio Console → Monitor → Logs | Webhook calls, mensajes recibidos |

---

## Escalado de gravedad

| Icono | Nivel | Significado | Ejemplos |
|---|---|---|---|
| 🔴 | Crítico | La web está rota o hay riesgo activo de seguridad. Arreglar inmediatamente. | Deploy en error, todos los scrapers caídos, endpoint cron abierto al mundo, admin vulnerable a brute force |
| 🟡 | Importante | Una funcionalidad falla pero el sitio sigue arriba. Arreglar hoy. | Un scraper caído, gráfica histórica vacía, emails no llegan, i18n roto |
| 🟢 | Menor | Degradación visual o edge case. Arreglar esta semana. | Logos rotos, sección vacía, form edge case |

---

## Política: documentar antes de 24h tras un incidente real

Cuando aparece un problema que **no está cubierto** en ningún archivo existente:

1. Mientras arreglas, toma notas: síntoma, causa raíz, comandos que usaste
2. Dentro de las 24h posteriores al incidente: crea un archivo nuevo con el siguiente número disponible
3. **No guardes "para después"** — 24h porque los detalles frescos son los más valiosos; después se pierden

### Plantilla copy-paste para archivo nuevo

```markdown
# [NN] — [Título del problema]

## Gravedad · Tiempo al fix
🔴 Crítico / 🟡 Importante / 🟢 Menor
⏱ Fix típico: X min

## Síntoma
Una línea. Qué se ve roto.

## Causas y soluciones (ordenadas de más probable a menos probable)

### 🎯 Causa 1 — [Nombre corto]
Arreglo:
1. Acción concreta copy-paste (comando, click, URL exacta)
2. Siguiente acción
3. Verificación: cómo sé que quedó bien

### 🎯 Causa 2 — [Nombre corto]
Arreglo:
1. ...
2. ...

### 🎯 Causa 3 — [Nombre corto]
Arreglo:
1. ...
2. ...

## Workaround mientras arreglas
Una línea. Qué hacer YA para que el usuario no vea la web rota.

## Relacionados
Links a otros archivos relevantes.
```

### Reglas estrictas al documentar

- **Un archivo = un problema**. Si cubres más de un síntoma, sepáralos.
- **Sin prosa**: acciones numeradas copy-paste, sin párrafos de explicación.
- **Sin placeholders**: comandos reales, URLs reales, queries reales.
- **Mínimo 2 causas**: si solo se te ocurre una, piensa más.
- **Siempre workaround**: incluso si la solución tarda, tiene que haber algo que hacer YA.
- **Actualiza este README**: agrega el archivo al índice con gravedad y tiempo.

---

## Cuando arreglas algo importante

Tras resolver un incidente:
1. Actualizá el archivo correspondiente si descubriste una causa nueva
2. Si el arreglo requiere una feature de código (ej. agregar rate limit, validación de firma), agrégalo a `CONTEXTO_FINAL.md` como tarea pendiente
3. Si es un fix permanente, commit al repo con mensaje `fix: <descripción corta>`
