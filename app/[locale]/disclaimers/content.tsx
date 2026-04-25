'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function DisclaimersContent() {
  const t = useTranslations()
  const td = useTranslations('disclaimers')
  const en = useLocale() === 'en'
  const locale = en ? 'en' : 'es'
  return (
    <LegalPage
      tag={en ? 'Legal' : 'Legal'}
      title={en ? 'Disclaimers' : 'Disclaimers'}
      updatedLabel={t('legal.lastUpdated')}
    >
      <p>
        {en
          ? 'The following disclaimers apply to all content on PreEnvios.com and to every comparison we publish. Please read them before making a transfer decision based on our information.'
          : 'Los siguientes disclaimers aplican a todo el contenido de PreEnvios.com y a cada comparación que publicamos. Por favor léelos antes de tomar una decisión de envío basada en nuestra información.'}
      </p>

      <h2>{en ? '1. Rate accuracy' : '1. Exactitud de las tasas'}</h2>
      <p>{td('d1')}</p>

      <h2>{en ? '2. Not a financial institution' : '2. No somos una institución financiera'}</h2>
      <p>{td('d2')}</p>

      <h2>{en ? '3. Ranking and commercial agreements' : '3. Ranking y acuerdos comerciales'}</h2>
      <p>{td('d3')}</p>

      <h2>{en ? '4. Affiliate commission' : '4. Comisión de afiliado'}</h2>
      <p>{td('d4')}</p>

      <h2>{en ? '5. Limitation of liability' : '5. Limitación de responsabilidad'}</h2>
      <p>{td('d5')}</p>

      <h2>{en ? '6. Trademark use' : '6. Uso de marcas'}</h2>
      <p>{td('d6')}</p>

      <p>
        {en
          ? 'These disclaimers complement our Terms of Use and Privacy Policy. For questions, contact us at'
          : 'Estos disclaimers complementan nuestros Términos de uso y Política de privacidad. Para preguntas, contáctanos en'}{' '}
        <a href="mailto:contact@preenvios.com">contact@preenvios.com</a>.
      </p>

      <h2>{en ? 'Related pages' : 'Páginas relacionadas'}</h2>
      <ul>
        <li><a href={`/${locale}/terminos`}>{en ? 'Terms of use' : 'Términos de uso'}</a></li>
        <li><a href={`/${locale}/privacidad`}>{en ? 'Privacy policy' : 'Política de privacidad'}</a></li>
        <li><a href={`/${locale}/como-ganamos-dinero`}>{en ? 'How we earn money' : 'Cómo ganamos dinero'}</a></li>
        <li><a href={`/${locale}/metodologia`}>{en ? 'Ranking methodology' : 'Metodología del ranking'}</a></li>
        <li><a href={`/${locale}/uso-de-marcas`}>{en ? 'Trademark usage' : 'Uso de marcas'}</a></li>
      </ul>
    </LegalPage>
  )
}
