'use client'

/**
 * Sección "Ofertas destacadas hoy" — estilo trivago
 *
 * OCULTA hasta tener sponsors reales y aprobación de afiliados.
 * Reactivar cambiando hidden={false} cuando:
 * (a) al menos un afiliado esté aprobado y genere comisión real
 * (b) las tarjetas muestren únicamente promociones reales verificadas
 * (c) cada tarjeta tenga el badge "Patrocinado" visible y link con tracking ID
 *
 * En Fase 1 la tabla `ofertas` en Supabase alimentará el carrusel.
 * Por ahora la estructura HTML está lista pero no se renderiza.
 */

const OFERTAS_PLACEHOLDER = [
  { operador: 'Remitly',    color: 'from-blue to-green',      titulo: 'Primer envío sin comisión',           sub: 'Nuevos usuarios · Todos los corredores', badge: '-100% comisión',    badgeCls: 'bg-green' },
  { operador: 'wise',       color: 'from-green to-[#047857]', titulo: 'Tasa real del mercado',               sub: 'Sin margen oculto',                      badge: 'Tasa transparente', badgeCls: 'bg-green' },
  { operador: 'xoom',       color: 'from-[#8B5CF6] to-blue',  titulo: 'Envío instantáneo garantizado',       sub: 'Llega en segundos',                      badge: '⚡ Instantáneo',    badgeCls: 'bg-blue' },
  { operador: 'ria',        color: 'from-orange to-red',       titulo: 'Red global con recogida en efectivo', sub: 'Más de 490,000 puntos',                  badge: 'Efectivo',          badgeCls: 'bg-red' },
  { operador: 'WorldRemit', color: 'from-yellow to-orange',    titulo: 'Transferencia a móvil disponible',    sub: 'Envía directo a billetera digital',      badge: 'Wallet',            badgeCls: 'bg-blue' },
]

export default function OfertasDestacadas({ hidden = true }: { hidden?: boolean }) {
  if (hidden) return null

  return (
    <section className="py-[70px] bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
          <div>
            <h2 className="font-heading text-[clamp(24px,3vw,34px)] font-black leading-[1.15] flex items-center gap-3">
              <span className="text-[28px]">🔥</span> Ofertas destacadas hoy
            </h2>
            <p className="text-ink-2 text-sm mt-1 font-medium">Promociones especiales de remesadoras aliadas</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-5 scroll-snap-x-mandatory">
          {OFERTAS_PLACEHOLDER.map((o) => (
            <div key={o.operador} className="flex-none w-[280px] scroll-snap-start bg-white border-[1.5px] border-g200 rounded-[22px] overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-lg cursor-pointer flex flex-col">
              <div className={`h-[150px] bg-gradient-to-br ${o.color} relative flex items-center justify-center`}>
                <span className="absolute top-3 left-3 bg-black/55 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase backdrop-blur-sm">Patrocinado</span>
                <div className="relative bg-white px-5 py-3 rounded-[10px] font-heading font-black text-xl shadow-lg">{o.operador}</div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-extrabold text-[15px] mb-1.5 leading-snug">{o.titulo}</h3>
                <div className="text-xs text-ink-2 font-medium mb-3.5">{o.sub}</div>
                <span className={`${o.badgeCls} text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider self-start mt-auto`}>{o.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
