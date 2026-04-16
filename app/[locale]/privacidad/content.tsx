'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function PrivacidadContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  return (
    <LegalPage tag={t('legal.privacyTag')} title={t('legal.privacyTitle')} backLabel={t('legal.backToHome')} updatedLabel={t('legal.lastUpdated')}>
      <div className="highlight-box"><p><strong>{t('disclaimers.d2')}</strong></p></div>
      <h2>{en ? 'What data we collect' : 'Qué datos recopilamos'}</h2>
      <p>{en ? 'PreEnvios.com uses Google Analytics (GA4) to measure site traffic. This includes:' : 'PreEnvios.com utiliza Google Analytics (GA4) para medir el tráfico del sitio. Esto incluye:'}</p>
      <ul>
        <li>{en ? 'Country, city and device you visit from' : 'País, ciudad y dispositivo desde el que visitas'}</li>
        <li>{en ? 'Pages you visit and time on each' : 'Páginas que visitas y tiempo en cada una'}</li>
        <li>{en ? 'Traffic source (where you came from)' : 'Fuente de tráfico (de dónde llegaste)'}</li>
        <li>{en ? 'Interactions with the comparator (amounts, corridors, clicks)' : 'Interacciones con el comparador (montos, corredores elegidos, clics)'}</li>
      </ul>
      <h2>{en ? 'What we do NOT collect' : 'Qué NO recopilamos'}</h2>
      <p>{en ? 'We do not require registration, do not collect names, emails, phone numbers or financial data. We do not process payments or move money.' : 'No pedimos registro, no recopilamos nombre, correo, teléfono ni datos financieros. No procesamos pagos ni movemos dinero.'}</p>
      <h2>{en ? 'How we use the data' : 'Cómo usamos los datos'}</h2>
      <p>{en ? 'We use this information only to understand what users need and improve the comparator.' : 'Usamos esta información únicamente para entender qué necesitan los usuarios y mejorar el comparador.'} <strong>{en ? 'We never sell or share data with third parties' : 'Nunca vendemos ni compartimos datos con terceros'}</strong> {en ? 'outside of Google Analytics.' : 'fuera de Google Analytics.'}</p>
      <h2>Cookies</h2>
      <p>{en ? 'We use two types of cookies:' : 'Usamos dos tipos de cookies:'}</p>
      <ul>
        <li><strong>Google Analytics:</strong> {en ? 'anonymous measurement cookies that help us know how many people visit the site.' : 'cookies de medición anónimas que nos permiten saber cuántas personas visitan el sitio.'}</li>
        <li><strong>NEXT_LOCALE:</strong> {en ? 'remembers your language preference (español/English) for 365 days.' : 'recuerda tu preferencia de idioma (español/English) por 365 días.'}</li>
        <li><strong>preenvios_corredor:</strong> {en ? 'remembers the corridor you chose for 30 days.' : 'recuerda el corredor que elegiste por 30 días.'}</li>
      </ul>
      <h2>{en ? 'Your rights (CCPA / GDPR)' : 'Tus derechos (CCPA / GDPR)'}</h2>
      <p>{en ? 'You have the right to:' : 'Tienes derecho a:'}</p>
      <ul>
        <li>{en ? 'Know what data we have about you' : 'Saber qué datos tenemos sobre ti'}</li>
        <li>{en ? 'Request deletion of your personal data' : 'Solicitar la eliminación de tus datos personales'}</li>
        <li>{en ? 'Opt out of tracking by disabling cookies in your browser' : 'Optar por no ser rastreado desactivando las cookies en tu navegador'}</li>
      </ul>
      <h2>{en ? 'Data deletion request' : 'Solicitud de eliminación de datos'}</h2>
      <p>{t('legal.deleteRequestDesc')} <a href="mailto:contact@preenvios.com">{t('legal.deleteRequestEmail')}</a>. {t('legal.deleteRequestNote')}</p>
      <h2>{en ? 'Contact' : 'Contacto'}</h2>
      <p>{en ? 'Privacy questions? Write to' : '¿Preguntas sobre privacidad? Escríbenos a'} <a href="mailto:contact@preenvios.com">contact@preenvios.com</a></p>
    </LegalPage>
  )
}
