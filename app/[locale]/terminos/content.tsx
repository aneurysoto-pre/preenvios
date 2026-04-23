'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function TerminosContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  return (
    <LegalPage tag={t('legal.termsTag')} title={t('legal.termsTitle')} updatedLabel={t('legal.lastUpdated')}>
      <div className="highlight-box"><p><strong>{t('disclaimers.d2')}</strong></p></div>
      <h2>{en ? 'What is PreEnvios.com' : 'Qué es PreEnvios.com'}</h2>
      <p>{t('disclaimers.d2')}</p>
      <h2>{en ? 'Limitation of liability' : 'Limitación de responsabilidad'}</h2>
      <p><strong>{t('disclaimers.d5')}</strong></p>
      <h2>{en ? 'About the rates shown' : 'Sobre las tasas mostradas'}</h2>
      <p>{t('disclaimers.d1')}</p>
      <h2>{en ? 'Commercial agreements' : 'Acuerdos comerciales'}</h2>
      <p>{t('disclaimers.d4')}</p>
      <p>{t('disclaimers.d3')}</p>
      <h2>{en ? 'Minimum age' : 'Edad mínima'}</h2>
      <p>{en ? 'You must be at least 18 years old to use this site. By using PreEnvios.com, you confirm that you are of legal age.' : 'Debes tener al menos 18 años para usar este sitio. Al usar PreEnvios.com, confirmas que eres mayor de edad.'}</p>
      <h2>{en ? 'Jurisdiction' : 'Jurisdicción'}</h2>
      <p>{en ? 'These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be resolved in the courts of Delaware.' : 'Estos términos se rigen por las leyes del Estado de Delaware, Estados Unidos. Cualquier disputa se resolverá en los tribunales de Delaware.'}</p>
      <h2>{en ? 'Trademark usage' : 'Uso de marcas'}</h2>
      <p>{t('disclaimers.d6')}</p>
      <h2>{en ? 'Changes to terms' : 'Cambios en los términos'}</h2>
      <p>{en ? 'These terms may be updated at any time. The current version is always the one published on this page.' : 'Estos términos pueden actualizarse en cualquier momento. La versión vigente siempre es la publicada en esta página.'}</p>
      <h2>{en ? 'Contact' : 'Contacto'}</h2>
      <p>{en ? 'Questions about these terms? Write to' : '¿Preguntas sobre estos términos? Escríbenos a'} <a href="mailto:contact@preenvios.com">contact@preenvios.com</a></p>
    </LegalPage>
  )
}
