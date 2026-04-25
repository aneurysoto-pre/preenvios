'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function PrivacidadContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  const locale = en ? 'en' : 'es'
  return (
    <LegalPage tag={t('legal.privacyTag')} title={t('legal.privacyTitle')} updatedLabel={t('legal.lastUpdated')}>
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

      <h2>{en ? 'Data retention' : 'Retención de datos'}</h2>
      <p>{en
        ? 'We retain data collected via Google Analytics for a maximum of 14 months, after which it is automatically deleted. Cookies expire according to the timeframes listed in the Cookies section.'
        : 'Conservamos los datos recopilados a través de Google Analytics por un máximo de 14 meses, después de los cuales se eliminan automáticamente. Las cookies expiran según los plazos indicados en la sección de Cookies.'}</p>

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

      <h2>{en ? 'Minors (COPPA)' : 'Menores de edad (COPPA)'}</h2>
      <p>{en
        ? 'PreEnvios.com is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided information, we will delete it immediately. If you believe a child under 13 has provided information to this site, contact us at contact@preenvios.com.'
        : 'PreEnvios.com no está dirigido a menores de 13 años. No recopilamos intencionalmente información personal de menores de 13. Si descubrimos que un menor de 13 años nos ha proporcionado información, la eliminaremos inmediatamente. Si crees que un menor de 13 años ha proporcionado información a este sitio, contáctanos en contact@preenvios.com.'}</p>

      <h2>{en ? 'Do Not Track' : 'Do Not Track'}</h2>
      <p>{en
        ? 'We currently do not respond to "Do Not Track" signals from the browser. However, we respect user choices about cookies via browser settings.'
        : 'Actualmente no respondemos a señales "Do Not Track" del navegador. Sin embargo, respetamos las opciones del usuario sobre cookies a través de la configuración del navegador.'}</p>

      <h2>{en ? 'Contact' : 'Contacto'}</h2>
      <p>{en ? 'Privacy questions? Write to' : '¿Preguntas sobre privacidad? Escríbenos a'} <a href="mailto:contact@preenvios.com">contact@preenvios.com</a></p>

      <h2>{en ? 'Related pages' : 'Páginas relacionadas'}</h2>
      <ul>
        <li><a href={`/${locale}/terminos`}>{en ? 'Terms of use' : 'Términos de uso'}</a></li>
        <li><a href={`/${locale}/disclaimers`}>Disclaimers</a></li>
        <li><a href={`/${locale}/como-ganamos-dinero`}>{en ? 'How we earn money' : 'Cómo ganamos dinero'}</a></li>
        <li><a href={`/${locale}/metodologia`}>{en ? 'Ranking methodology' : 'Metodología del ranking'}</a></li>
        <li><a href={`/${locale}/uso-de-marcas`}>{en ? 'Trademark usage' : 'Uso de marcas'}</a></li>
      </ul>
    </LegalPage>
  )
}
