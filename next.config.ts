import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Hosts externos autorizados para next/image. Necesario para que los
    // componentes puedan pasar de <img src="https://flagcdn.com/..."> a
    // <Image src="https://flagcdn.com/..."> sin error de dominio rechazado.
    // Se agregan conforme los refactors (Fase 1) migran <img> a <Image>.
    // - flagcdn.com: banderas PNG (Nav, Comparador, TasasReferencia)
    // - cdn.brandfetch.io: logos operadores (Comparador, Sections LogoStrip)
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'cdn.brandfetch.io' },
    ],
  },
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
