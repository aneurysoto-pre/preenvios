'use client'

/**
 * Cookie consent banner CCPA + GDPR compliant.
 *
 * Flujo con Google Consent Mode v2:
 * 1. layout.tsx carga gtag/js siempre y dispara gtag('consent', 'default',
 *    { ... denied }) antes de config. Eso significa que hasta que el usuario
 *    decida, GA4 NO almacena cookies (modo "pingback only", conversions
 *    anonimas agregadas, 0 personal data).
 * 2. Este componente renderiza el banner (bottom bar fullwidth) la primera
 *    vez que el usuario visita. Despues del choice, cookiecconsent guarda
 *    la preferencia en una cookie "cc_cookie" (6 meses) y no muestra el
 *    banner de nuevo salvo que el usuario abra /preferences manualmente.
 * 3. Al aceptar/rechazar, se dispara gtag('consent', 'update', { ... }) que
 *    hace que GA4 empiece (o no) a escribir cookies completas.
 *
 * 3 categorias: necessary (no desactivable), analytics (GA4), marketing
 * (futuro Meta Pixel / Google Ads — hoy no usado pero pre-declarado).
 *
 * Libreria: vanilla-cookieconsent v3 (~10KB, 0 deps, GDPR+CCPA+LGPD).
 *
 * Ref: CHECKLIST_PRE_LANZAMIENTO §15.1 — BLOQUEANTE pre-DNS cutover.
 */

import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

export default function CookieConsent() {
  const t = useTranslations('cookies')
  const locale = useLocale()

  useEffect(() => {
    let cancelled = false

    async function init() {
      const CC = await import('vanilla-cookieconsent')
      if (cancelled) return

      CC.run({
        guiOptions: {
          consentModal: {
            layout: 'bar inline',
            position: 'bottom',
            equalWeightButtons: false,
            flipButtons: false,
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false,
          },
        },

        categories: {
          necessary: { enabled: true, readOnly: true },
          analytics: {
            services: {
              ga4: {
                label: 'Google Analytics 4',
                cookies: [
                  { name: /^_ga/ },
                  { name: '_gid' },
                ],
              },
            },
          },
          marketing: {},
        },

        onConsent: ({ cookie }) => {
          pushConsentUpdate(cookie.categories)
        },
        onChange: ({ cookie }) => {
          pushConsentUpdate(cookie.categories)
        },

        language: {
          default: locale === 'en' ? 'en' : 'es',
          translations: {
            es: buildTranslations(t, 'es'),
            en: buildTranslations(t, 'en'),
          },
        },
      })
    }

    init()

    return () => {
      cancelled = true
    }
  }, [t, locale])

  return null
}

// Traduce el estado de categorias accepted por cookiecconsent al formato de
// gtag consent v2. Google define 4 signals: ad_storage, ad_user_data,
// ad_personalization, analytics_storage. Nuestra categoria "analytics"
// gobierna solo analytics_storage; "marketing" gobierna las 3 de ads.
function pushConsentUpdate(categories: string[]) {
  if (typeof window === 'undefined' || !window.gtag) return
  const analytics = categories.includes('analytics') ? 'granted' : 'denied'
  const marketing = categories.includes('marketing') ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  })
}

function buildTranslations(t: ReturnType<typeof useTranslations>, _lang: 'es' | 'en') {
  return {
    consentModal: {
      title: t('title'),
      description: t('description'),
      acceptAllBtn: t('acceptAll'),
      acceptNecessaryBtn: t('rejectAll'),
      showPreferencesBtn: t('customize'),
      footer: '',
    },
    preferencesModal: {
      title: t('settingsTitle'),
      acceptAllBtn: t('acceptAll'),
      acceptNecessaryBtn: t('rejectAll'),
      savePreferencesBtn: t('save'),
      closeIconLabel: t('closeLabel'),
      sections: [
        {
          description: t('settingsDescription'),
        },
        {
          title: t('categoryNecessary'),
          description: t('categoryNecessaryDesc'),
          linkedCategory: 'necessary',
        },
        {
          title: t('categoryAnalytics'),
          description: t('categoryAnalyticsDesc'),
          linkedCategory: 'analytics',
        },
        {
          title: t('categoryMarketing'),
          description: t('categoryMarketingDesc'),
          linkedCategory: 'marketing',
        },
      ],
    },
  }
}
