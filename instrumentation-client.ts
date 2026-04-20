// Sentry — init client-side. Next.js 15+ carga este archivo automáticamente
// en el cliente. Si NEXT_PUBLIC_SENTRY_DSN no está configurado, el SDK queda
// en no-op (sin errores, sin envío).

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.1,
  debug: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
