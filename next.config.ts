import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
}

// Sentry wrap: si SENTRY_DSN + SENTRY_AUTH_TOKEN no estan configurados, el
// upload de source maps se salta silenciosamente y el build pasa igual.
// Las env vars vienen de Vercel en production y de .env.local en dev.
// disableLogger / automaticVercelMonitors estan deprecados y solo aplican a
// webpack (no Turbopack) — omitidos a proposito para evitar warnings.
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
})
