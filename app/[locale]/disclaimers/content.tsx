'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function DisclaimersContent() {
  const t = useTranslations()
  const td = useTranslations('disclaimers')
  const en = useLocale() === 'en'
  return (
    <LegalPage
      tag={en ? 'Legal' : 'Legal'}
      title={en ? 'Disclaimers' : 'Disclaimers'}
      backLabel={t('legal.backToHome')}
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
        <strong>{en ? 'Related:' : 'Relacionado:'}</strong>{' '}
        <a href={`/${en ? 'en' : 'es'}/como-ganamos-dinero`}>{en ? 'How we earn money' : 'Cómo ganamos dinero'}</a>{' · '}
        <a href={`/${en ? 'en' : 'es'}/metodologia`}>{en ? 'Ranking methodology' : 'Metodología del ranking'}</a>{' · '}
        <a href={`/${en ? 'en' : 'es'}/uso-de-marcas`}>{en ? 'Trademark usage' : 'Uso de marcas'}</a>
      </p>
    </LegalPage>
  )
}
