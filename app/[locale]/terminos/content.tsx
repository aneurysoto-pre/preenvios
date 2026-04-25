'use client'
import { useTranslations, useLocale } from 'next-intl'
import LegalPage from '@/components/LegalPage'

export default function TerminosContent() {
  const t = useTranslations()
  const en = useLocale() === 'en'
  const locale = en ? 'en' : 'es'
  return (
    <LegalPage tag={t('legal.termsTag')} title={t('legal.termsTitle')} updatedLabel={t('legal.lastUpdated')}>
      <div className="highlight-box"><p><strong>{t('disclaimers.d2')}</strong></p></div>

      <h2>{en ? 'Acceptance of terms' : 'Aceptación de términos'}</h2>
      <p>{en
        ? 'By accessing or using PreEnvios.com, you agree to be legally bound by these Terms. If you do not agree, do not use the site.'
        : 'Al acceder o usar PreEnvios.com, aceptas estar legalmente vinculado por estos Términos. Si no estás de acuerdo, no uses el sitio.'}</p>

      <h2>{en ? 'What is PreEnvios.com' : 'Qué es PreEnvios.com'}</h2>
      <p>{t('disclaimers.d2')}</p>

      <h2>{en ? 'Service "as is"' : 'Servicio "tal cual"'}</h2>
      <p>{en
        ? 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. PREENVIOS DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT THE RATES SHOWN ARE ACCURATE AT ALL TIMES.'
        : 'EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN PARTICULAR, O NO INFRACCIÓN. PREENVIOS NO GARANTIZA QUE EL SERVICIO SEA ININTERRUMPIDO, LIBRE DE ERRORES, O QUE LAS TASAS MOSTRADAS SEAN EXACTAS EN TODO MOMENTO.'}</p>

      <h2>{en ? 'Limitation of liability' : 'Limitación de responsabilidad'}</h2>
      <p><strong>{t('disclaimers.d5')}</strong></p>

      <h2>{en ? 'Limitation of damages' : 'Limitación de daños'}</h2>
      <p>{en
        ? 'IN NO EVENT SHALL THE TOTAL LIABILITY OF PREENVIOS, ITS DIRECTORS, EMPLOYEES, OR AFFILIATES EXCEED ONE HUNDRED U.S. DOLLARS (USD $100). PREENVIOS SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE.'
        : 'EN NINGÚN CASO LA RESPONSABILIDAD TOTAL DE PREENVIOS, SUS DIRECTORES, EMPLEADOS O AFILIADOS EXCEDERÁ CIEN DÓLARES ESTADOUNIDENSES (USD $100). PREENVIOS NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS, INCLUYENDO PERO NO LIMITADO A PÉRDIDA DE GANANCIAS, DATOS O USO.'}</p>

      <h2>{en ? 'User indemnification' : 'Indemnización del usuario'}</h2>
      <p>{en
        ? 'The user agrees to indemnify, defend, and hold harmless PreEnvios, its directors, employees, and affiliates from any claim, damage, loss, or expense (including reasonable attorneys\' fees) arising from the user\'s use of the site, violation of these terms, or violation of third-party rights.'
        : 'El usuario acepta indemnizar, defender y mantener indemne a PreEnvios, sus directores, empleados y afiliados de cualquier reclamo, daño, pérdida o gasto (incluyendo honorarios razonables de abogados) que surjan del uso del sitio por parte del usuario, de la violación de estos términos, o de la violación de derechos de terceros.'}</p>

      <h2>{en ? 'Prohibited conduct' : 'Conducta prohibida'}</h2>
      <p>{en
        ? 'The user may not: (a) use the site for illegal activities, including money laundering, terrorism financing, or tax evasion; (b) perform automated scraping, use bots, or extract data in bulk without authorization; (c) attempt to compromise the security or integrity of the site; (d) impersonate another person; (e) resell, redistribute, sublicense, or commercially exploit the site\'s content without authorization.'
        : 'El usuario no podrá: (a) usar el sitio para actividades ilegales, incluyendo lavado de dinero, financiamiento del terrorismo o evasión fiscal; (b) realizar scraping automatizado, usar bots o extraer datos masivamente sin autorización; (c) intentar vulnerar la seguridad o integridad del sitio; (d) suplantar la identidad de otra persona; (e) revender, redistribuir, sublicenciar o explotar comercialmente el contenido del sitio sin autorización.'}</p>

      <h2>{en ? 'Termination' : 'Terminación'}</h2>
      <p>{en
        ? 'PreEnvios may suspend or terminate any user\'s access to the site at any time, without prior notice, for any reason, including violation of these terms.'
        : 'PreEnvios puede suspender o terminar el acceso de cualquier usuario al sitio en cualquier momento, sin previo aviso, por cualquier razón, incluyendo violación de estos términos.'}</p>

      <h2>{en ? 'Intellectual property' : 'Propiedad intelectual'}</h2>
      <p>{en
        ? 'All site content (rankings, comparisons, articles, methodology, design, code) is the exclusive property of PreEnvios or its licensors. Reproduction, distribution, or commercial use without prior written authorization is prohibited.'
        : 'Todo el contenido del sitio (rankings, comparaciones, artículos, metodología, diseño, código) es propiedad exclusiva de PreEnvios o sus licenciantes. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita previa.'}</p>

      <h2>{en ? 'About the rates shown' : 'Sobre las tasas mostradas'}</h2>
      <p>{t('disclaimers.d1')}</p>

      <h2>{en ? 'Commercial agreements' : 'Acuerdos comerciales'}</h2>
      <p>{t('disclaimers.d4')}</p>
      <p>{t('disclaimers.d3')}</p>

      <h2>{en ? 'Minimum age' : 'Edad mínima'}</h2>
      <p>{en ? 'You must be at least 18 years old to use this site. By using PreEnvios.com, you confirm that you are of legal age.' : 'Debes tener al menos 18 años para usar este sitio. Al usar PreEnvios.com, confirmas que eres mayor de edad.'}</p>

      <h2>{en ? 'Trademark usage' : 'Uso de marcas'}</h2>
      <p>{t('disclaimers.d6')}</p>

      <h2>{en ? 'Mandatory arbitration and class action waiver' : 'Arbitraje obligatorio y renuncia a class action'}</h2>
      <p>{en
        ? 'ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING FROM OR IN CONNECTION WITH THESE TERMS OR USE OF THE SITE SHALL BE RESOLVED BY MANDATORY INDIVIDUAL ARBITRATION UNDER THE RULES OF THE AMERICAN ARBITRATION ASSOCIATION (AAA). THE USER EXPRESSLY WAIVES THE RIGHT TO PARTICIPATE IN CLASS ACTIONS, COLLECTIVE ACTIONS, OR REPRESENTATIVE ACTIONS. THE USER WAIVES THE RIGHT TO A JURY TRIAL. ARBITRATION SHALL BE CONDUCTED IN FLORIDA, UNITED STATES, IN SPANISH OR ENGLISH.'
        : 'CUALQUIER DISPUTA, RECLAMO O CONTROVERSIA QUE SURJA DE O EN RELACIÓN CON ESTOS TÉRMINOS O EL USO DEL SITIO SE RESOLVERÁ MEDIANTE ARBITRAJE INDIVIDUAL OBLIGATORIO BAJO LAS REGLAS DE LA AMERICAN ARBITRATION ASSOCIATION (AAA). EL USUARIO RENUNCIA EXPRESAMENTE AL DERECHO DE PARTICIPAR EN DEMANDAS COLECTIVAS, ACCIONES DE CLASE O ACCIONES REPRESENTATIVAS. EL USUARIO RENUNCIA AL DERECHO A JUICIO POR JURADO. EL ARBITRAJE SE LLEVARÁ A CABO EN FLORIDA, ESTADOS UNIDOS, EN ESPAÑOL O INGLÉS.'}</p>

      <h2>{en ? 'DMCA — copyright infringement notice' : 'DMCA — notificación de infracción de copyright'}</h2>
      <p>{en
        ? 'If you believe material on this site infringes your copyright, send a DMCA notice to contact@preenvios.com containing: (a) identification of the protected work; (b) location of the infringing material on the site; (c) your contact information; (d) good-faith statement; (e) physical or electronic signature.'
        : 'Si crees que material en este sitio infringe tus derechos de autor, envía una notificación DMCA a contact@preenvios.com conteniendo: (a) identificación del trabajo protegido; (b) ubicación del material infractor en el sitio; (c) tu información de contacto; (d) declaración de buena fe; (e) firma física o electrónica.'}</p>

      <h2>{en ? 'Jurisdiction' : 'Jurisdicción'}</h2>
      <p>{en ? 'These terms are governed by the laws of the State of Florida, United States. Any disputes shall be resolved in the courts of Florida.' : 'Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos. Cualquier disputa se resolverá en los tribunales de Florida.'}</p>

      <h2>{en ? 'Severability' : 'Divisibilidad'}</h2>
      <p>{en
        ? 'If any provision of these terms is declared invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.'
        : 'Si alguna disposición de estos términos es declarada inválida o inaplicable por un tribunal competente, las demás disposiciones permanecerán en pleno vigor y efecto.'}</p>

      <h2>{en ? 'Entire agreement' : 'Acuerdo completo'}</h2>
      <p>{en
        ? 'These terms, together with the Privacy Policy and the Disclaimers, constitute the entire agreement between the user and PreEnvios and supersede any prior agreement, communication, or understanding.'
        : 'Estos términos, junto con la Política de Privacidad y los Disclaimers, constituyen el acuerdo completo entre el usuario y PreEnvios y reemplazan cualquier acuerdo, comunicación o entendimiento previo.'}</p>

      <h2>{en ? 'Changes to terms' : 'Cambios en los términos'}</h2>
      <p>{en ? 'These terms may be updated at any time. The current version is always the one published on this page.' : 'Estos términos pueden actualizarse en cualquier momento. La versión vigente siempre es la publicada en esta página.'}</p>

      <h2>{en ? 'Contact' : 'Contacto'}</h2>
      <p>{en ? 'Questions about these terms? Write to' : '¿Preguntas sobre estos términos? Escríbenos a'} <a href="mailto:contact@preenvios.com">contact@preenvios.com</a></p>

      <h2>{en ? 'Related pages' : 'Páginas relacionadas'}</h2>
      <ul>
        <li><a href={`/${locale}/privacidad`}>{en ? 'Privacy policy' : 'Política de privacidad'}</a></li>
        <li><a href={`/${locale}/disclaimers`}>Disclaimers</a></li>
        <li><a href={`/${locale}/como-ganamos-dinero`}>{en ? 'How we earn money' : 'Cómo ganamos dinero'}</a></li>
        <li><a href={`/${locale}/metodologia`}>{en ? 'Ranking methodology' : 'Metodología del ranking'}</a></li>
        <li><a href={`/${locale}/uso-de-marcas`}>{en ? 'Trademark usage' : 'Uso de marcas'}</a></li>
      </ul>
    </LegalPage>
  )
}
