'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function MetodologiaContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  return (
    <LegalPage tag={t('legal.methodologyTag')} title={t('legal.methodologyTitle')} updatedLabel={t('legal.lastUpdated')}>
      <h2>Preenvíos Score</h2>
      <p>{en ? 'Each remittance provider receives a score from 0 to 100 based on 5 weighted criteria. This score determines the order of results in the comparator.' : 'Cada remesadora recibe un puntaje de 0 a 100 basado en 5 criterios ponderados. Este puntaje determina el orden de los resultados en el comparador.'}</p>

      <h2>{en ? 'The 5 criteria' : 'Los 5 criterios'}</h2>
      <ul>
        <li><strong>{en ? 'Exchange rate (35%)' : 'Tasa de cambio (35%)'}:</strong> {en ? 'How much local currency the recipient gets per dollar. Normalized between the worst and best rate in the corridor.' : 'Cuánta moneda local recibe el destinatario por dólar. Se normaliza entre la peor y la mejor tasa del corredor.'}</li>
        <li><strong>{en ? 'Affiliate status (25%)' : 'Estado de afiliado (25%)'}:</strong> {en ? 'Whether the operator has a commercial agreement with PreEnvios. Score: 1 if yes, 0 if no.' : 'Si el operador tiene acuerdo comercial con PreEnvios. Puntaje: 1 si sí, 0 si no.'} <a href={`/${en ? 'en' : 'es'}/como-ganamos-dinero`}>{en ? 'Why we include this' : 'Por qué incluimos esto'}</a></li>
        <li><strong>{en ? 'Speed (20%)' : 'Velocidad (20%)'}:</strong> {en ? 'How fast the money arrives. Seconds = 1.0, Minutes = 0.8, Hours = 0.4, Days = 0.0' : 'Qué tan rápido llega el dinero. Segundos = 1.0, Minutos = 0.8, Horas = 0.4, Días = 0.0'}</li>
        <li><strong>{en ? 'Reliability (10%)' : 'Confiabilidad (10%)'}:</strong> {en ? 'Fixed value per operator based on years of operation and US licensing. Scale 0-100.' : 'Valor fijo por operador basado en años de operación y licencia en EE.UU. Escala 0-100.'}</li>
        <li><strong>{en ? 'Delivery methods (10%)' : 'Métodos de entrega (10%)'}:</strong> {en ? 'Number of delivery methods available (bank, cash, home delivery, mobile wallet). Maximum 4.' : 'Cantidad de métodos de entrega disponibles (banco, efectivo, domicilio, billetera móvil). Máximo 4.'}</li>
      </ul>

      <h2>{en ? 'Data sources' : 'Fuentes de datos'}</h2>
      <p>{en ? 'Exchange rates and fees are obtained from the public websites of each remittance provider. Currently updated manually on a weekly basis. Automated scrapers running every 2 hours are planned for Phase 2.' : 'Las tasas de cambio y comisiones se obtienen de los sitios web públicos de cada remesadora. Actualmente se actualizan manualmente de forma semanal. En la Fase 2 se implementarán scrapers automáticos cada 2 horas.'}</p>

      <h2>{en ? 'Update frequency' : 'Frecuencia de actualización'}</h2>
      <ul>
        <li><strong>{en ? 'Current (MVP)' : 'Actual (MVP)'}:</strong> {en ? 'Weekly manual update every Monday' : 'Actualización manual semanal cada lunes'}</li>
        <li><strong>{en ? 'Planned (Phase 2)' : 'Planificado (Fase 2)'}:</strong> {en ? 'Automated every 2 hours via Vercel Cron Jobs + Playwright scrapers' : 'Automatizado cada 2 horas via Vercel Cron Jobs + scrapers Playwright'}</li>
      </ul>

      <h2>{en ? 'Operators compared' : 'Operadores comparados'}</h2>
      <p>{en ? '7 operators across 4 corridors from the USA:' : '7 operadores en 4 corredores desde EE.UU.:'}</p>
      <ul>
        <li>Remitly, Wise, Xoom (PayPal), Ria, WorldRemit — {en ? 'with affiliate' : 'con afiliado'}</li>
        <li>Western Union, MoneyGram — {en ? 'reference only (no affiliate program)' : 'solo referencia (sin programa de afiliado)'}</li>
      </ul>

      <h2>{en ? 'Code' : 'Código'}</h2>
      <p>{en ? 'The ranking algorithm is implemented in' : 'El algoritmo de ranking está implementado en'} <strong>lib/ranking.ts</strong>. {en ? 'The weights can be verified in the source code.' : 'Los pesos se pueden verificar en el código fuente.'}</p>
    </LegalPage>
  )
}
