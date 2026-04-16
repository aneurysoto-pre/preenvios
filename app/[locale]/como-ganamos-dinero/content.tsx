'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function ComoGanamosContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  return (
    <LegalPage tag={t('legal.howWeEarnTag')} title={t('legal.howWeEarnTitle')} backLabel={t('legal.backToHome')} updatedLabel={t('legal.lastUpdated')}>
      <div className="highlight-box"><p><strong>{t('disclaimers.d4')}</strong></p></div>
      <h2>{en ? 'How does PreEnvios generate revenue?' : '¿Cómo genera ingresos PreEnvios?'}</h2>
      <p>{en ? 'PreEnvios.com is free for users. We generate revenue through affiliate programs with some of the remittance providers we compare. When you click "Send now" and complete a transfer through one of our partner links, the provider pays us a commission.' : 'PreEnvios.com es gratis para los usuarios. Generamos ingresos a través de programas de afiliados con algunas de las remesadoras que comparamos. Cuando haces clic en "Enviar ahora" y completas una transferencia a través de uno de nuestros enlaces de afiliado, la remesadora nos paga una comisión.'}</p>
      <h2>{en ? 'Which affiliate networks do we use?' : '¿Qué redes de afiliados usamos?'}</h2>
      <ul>
        <li><strong>Impact.com</strong> — Remitly</li>
        <li><strong>Partnerize</strong> — Wise</li>
        <li><strong>CJ Affiliate</strong> — Xoom, Ria, WorldRemit</li>
      </ul>
      <p>{en ? 'Western Union and MoneyGram do not have public affiliate programs. They appear in our comparison for informational purposes only.' : 'Western Union y MoneyGram no tienen programas de afiliados públicos. Aparecen en nuestra comparación solo con fines informativos.'}</p>
      <h2>{en ? 'Does this affect the ranking?' : '¿Esto afecta el ranking?'}</h2>
      <p>{en ? 'Our ranking algorithm (Preenvíos Score) uses 5 weighted criteria:' : 'Nuestro algoritmo de ranking (Preenvíos Score) usa 5 criterios ponderados:'}</p>
      <ul>
        <li><strong>{en ? 'Exchange rate' : 'Tasa de cambio'}:</strong> 35%</li>
        <li><strong>{en ? 'Affiliate status' : 'Estado de afiliado'}:</strong> 25%</li>
        <li><strong>{en ? 'Speed' : 'Velocidad'}:</strong> 20%</li>
        <li><strong>{en ? 'Reliability' : 'Confiabilidad'}:</strong> 10%</li>
        <li><strong>{en ? 'Delivery methods' : 'Métodos de entrega'}:</strong> 10%</li>
      </ul>
      <p>{en ? 'Affiliate status is one of the 5 criteria. This means operators with affiliate agreements may rank higher when other factors are equal. We believe this is fair because it allows us to keep the service free while still showing you the best rates.' : 'El estado de afiliado es uno de los 5 criterios. Esto significa que los operadores con acuerdo de afiliado pueden rankear más alto cuando los demás factores son iguales. Creemos que esto es justo porque nos permite mantener el servicio gratis mientras te mostramos las mejores tasas.'}</p>
      <p><strong>{en ? 'The complete methodology is available at' : 'La metodología completa está disponible en'}</strong> <a href={`/${en ? 'en' : 'es'}/metodologia`}>{en ? 'our methodology page' : 'nuestra página de metodología'}</a>.</p>
      <h2>{en ? 'Does it cost you anything?' : '¿Te cuesta algo a ti?'}</h2>
      <p><strong>{en ? 'No.' : 'No.'}</strong> {t('disclaimers.d4')}</p>
    </LegalPage>
  )
}
