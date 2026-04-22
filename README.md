# PreEnvios.com

Comparador independiente de remesas para la diáspora latinoamericana en EE.UU.
Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram.

**MVP actual (6 corredores):** Honduras, República Dominicana, Guatemala, El Salvador, Colombia, México.
**Integraciones futuras:** nuevos corredores se evaluarán post-launch según demanda orgánica, sourcing disponible y señales reales de usuarios. Ver `CONTEXTO_FINAL.md` y `LOGICA_DE_NEGOCIO/11_nuevos_corredores.md` para política y proceso.

- [Contexto MVP](CONTEXTO_MVP.md)
- [Contexto Final / Roadmap](CONTEXTO_FINAL.md)

## Stack

- **Frontend:** Next.js 14+ · TypeScript · Tailwind CSS · next-intl (es/en)
- **Backend:** Supabase (PostgreSQL + Auth) · Vercel · Upstash Redis
- **Analytics:** Google Analytics GA4

## Setup local

```bash
git clone https://github.com/aneurysoto-pre/preenvios.git
cd preenvios
npm install
cp .env.example .env.local   # completar con keys reales
npm run dev                   # http://localhost:3000
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción local |
| `npm run lint` | Lint del proyecto |

## Estructura principal

```
app/[locale]/       ← páginas con soporte es/en
lib/                ← supabase, ranking, utilidades
messages/           ← traducciones es.json / en.json
i18n/               ← configuración next-intl
```

## Deploy

- **Producción:** push a `main` → deploy automático en Vercel → preenvios.com
- **Preview:** push a cualquier rama → URL de preview generada por Vercel
- **Docs Vercel:** https://vercel.com/docs
- **Docs Supabase:** https://supabase.com/docs

## Convención de commits

Commits descriptivos en español. Ejemplos:
- `fix: corrige scroll horizontal en móvil`
- `feat: agrega selector de método de entrega`
- `docs: actualiza roadmap Fase 4`
