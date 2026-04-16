'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function UsoMarcasContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  return (
    <LegalPage tag={t('legal.trademarksTag')} title={t('legal.trademarksTitle')} backLabel={t('legal.backToHome')} updatedLabel={t('legal.lastUpdated')}>
      <div className="highlight-box"><p><strong>{t('disclaimers.d6')}</strong></p></div>
      <h2>{en ? 'Trademarks used on this site' : 'Marcas usadas en este sitio'}</h2>
      <p>{en ? 'The following names and logos are registered trademarks of their respective owners:' : 'Los siguientes nombres y logos son marcas registradas de sus respectivos dueños:'}</p>
      <ul>
        <li><strong>Remitly</strong> — Remitly, Inc.</li>
        <li><strong>Wise</strong> — Wise Payments Limited</li>
        <li><strong>Xoom</strong> — PayPal, Inc.</li>
        <li><strong>Ria Money Transfer</strong> — Euronet Worldwide, Inc.</li>
        <li><strong>WorldRemit</strong> — Zepz Group</li>
        <li><strong>Western Union</strong> — The Western Union Company</li>
        <li><strong>MoneyGram</strong> — MoneyGram International, Inc.</li>
      </ul>
      <h2>{en ? 'Purpose of use' : 'Propósito del uso'}</h2>
      <p>{en ? 'These trademarks are used on PreEnvios.com solely for informational and comparison purposes, under the fair use doctrine of nominative use. We do not imply any sponsorship, endorsement, or affiliation with these companies unless explicitly stated.' : 'Estas marcas se usan en PreEnvios.com exclusivamente con fines informativos y de comparación, bajo la doctrina de uso justo nominativo. No implicamos patrocinio, respaldo o afiliación con estas empresas salvo que se indique explícitamente.'}</p>
      <h2>{en ? 'Trademark concerns' : 'Inquietudes sobre marcas'}</h2>
      <p>{en ? 'If you are a trademark owner and have concerns about how your mark is used on this site, please contact us at' : 'Si eres propietario de una marca y tienes inquietudes sobre cómo se usa en este sitio, contáctanos en'} <a href="mailto:contact@preenvios.com">contact@preenvios.com</a>. {en ? 'We will respond within 5 business days.' : 'Responderemos en un plazo de 5 días hábiles.'}</p>
    </LegalPage>
  )
}
