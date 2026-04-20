// Sentry — config edge runtime (middleware + edge functions).
// Cargado desde instrumentation.ts cuando NEXT_RUNTIME === 'edge'.

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
  debug: false,
})
