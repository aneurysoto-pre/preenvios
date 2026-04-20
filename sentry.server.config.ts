// Sentry — config server-side (Node runtime).
// Cargado desde instrumentation.ts cuando NEXT_RUNTIME === 'nodejs'.
// Si SENTRY_DSN no está configurado, el SDK queda en no-op (sin errores).

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
  debug: false,
})
