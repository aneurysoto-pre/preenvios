'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function MetodologiaContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  const locale = en ? 'en' : 'es'
  return (
    <LegalPage tag={t('legal.methodologyTag')} title={t('legal.methodologyTitle')} updatedLabel={t('legal.lastUpdated')}>
      <h2>Preenvíos Score</h2>
      <p>{en
        ? 'Each remittance provider receives a score from 0 to 100 based on 5 weighted criteria. This score determines the order of results in the comparator.'
        : 'Cada remesadora recibe un puntaje de 0 a 100 basado en 5 criterios ponderados. Este puntaje determina el orden de los resultados en el comparador.'}</p>

      <h2>{en ? 'The 5 criteria' : 'Los 5 criterios'}</h2>
      <ul>
        <li><strong>{en ? 'Exchange rate (35%)' : 'Tasa de cambio (35%)'}:</strong> {en ? 'How much local currency the recipient gets per dollar. Normalized between the worst and best rate in the corridor.' : 'Cuánta moneda local recibe el destinatario por dólar. Se normaliza entre la peor y la mejor tasa del corredor.'}</li>
        <li><strong>{en ? 'Affiliate status (25%)' : 'Estado de afiliado (25%)'}:</strong> {en ? 'Whether the operator has a commercial agreement with PreEnvios. Score: 1 if yes, 0 if no.' : 'Si el operador tiene acuerdo comercial con PreEnvios. Puntaje: 1 si sí, 0 si no.'} <a href={`/${locale}/como-ganamos-dinero`}>{en ? 'Why we include this' : 'Por qué incluimos esto'}</a></li>
        <li><strong>{en ? 'Speed (20%)' : 'Velocidad (20%)'}:</strong> {en ? 'How fast the money arrives. Seconds = 1.0, Minutes = 0.8, Hours = 0.4, Days = 0.0' : 'Qué tan rápido llega el dinero. Segundos = 1.0, Minutos = 0.8, Horas = 0.4, Días = 0.0'}</li>
        <li><strong>{en ? 'Reliability (10%)' : 'Confiabilidad (10%)'}:</strong> {en ? 'Fixed value per operator based on years of operation and US licensing. Scale 0-100.' : 'Valor fijo por operador basado en años de operación y licencia en EE.UU. Escala 0-100.'}</li>
        <li><strong>{en ? 'Delivery methods (10%)' : 'Métodos de entrega (10%)'}:</strong> {en ? 'Number of delivery methods available (bank, cash, home delivery, mobile wallet). Maximum 4.' : 'Cantidad de métodos de entrega disponibles (banco, efectivo, domicilio, billetera móvil). Máximo 4.'}</li>
      </ul>

      <h2>{en ? 'Data sources' : 'Fuentes de datos'}</h2>
      <p>{en
        ? 'Exchange rates and fees are obtained from the public websites of each remittance provider.'
        : 'Las tasas de cambio y comisiones se obtienen de los sitios web públicos de cada remesadora.'}</p>

      <h2>{en ? 'Update frequency' : 'Frecuencia de actualización'}</h2>
      <p>{en
        ? 'Rates are updated periodically. Each result in the comparator displays the date of its last update.'
        : 'Las tasas se actualizan periódicamente. Cada resultado en el comparador muestra la fecha de la última actualización.'}</p>

      <h2>{en ? 'Operators compared' : 'Operadores comparados'}</h2>
      <p>{en
        ? 'We compare the main operators that send from the United States to Latin America. The current list is reflected in each corridor of the comparator.'
        : 'Comparamos los operadores principales que envían desde Estados Unidos a Latinoamérica. La lista actual se refleja en cada corredor del comparador.'}</p>

      <h2>{en ? 'Related pages' : 'Páginas relacionadas'}</h2>
      <ul>
        <li><a href={`/${locale}/terminos`}>{en ? 'Terms of use' : 'Términos de uso'}</a></li>
        <li><a href={`/${locale}/privacidad`}>{en ? 'Privacy policy' : 'Política de privacidad'}</a></li>
        <li><a href={`/${locale}/disclaimers`}>Disclaimers</a></li>
        <li><a href={`/${locale}/como-ganamos-dinero`}>{en ? 'How we earn money' : 'Cómo ganamos dinero'}</a></li>
        <li><a href={`/${locale}/uso-de-marcas`}>{en ? 'Trademark usage' : 'Uso de marcas'}</a></li>
      </ul>
    </LegalPage>
  )
}
