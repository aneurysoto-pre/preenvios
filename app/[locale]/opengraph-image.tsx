import { ImageResponse } from 'next/og'

/**
 * Open Graph image — generada dinamicamente por Next.js.
 *
 * Next.js auto-detecta este archivo en `app/[locale]/` y agrega un
 * `<meta property="og:image">` apuntando a `/${locale}/opengraph-image`
 * en TODAS las páginas dentro de ese segmento (todas las rutas con
 * locale). Soporta también `<meta name="twitter:image">` cuando
 * combinado con metadata twitter.card='summary_large_image'.
 *
 * Diseño: P verde brand (#00D957) + "preenvios.com" + tagline gris.
 * Match visual exacto con el favicon, apple-icon, redes sociales.
 *
 * Tamaño: 1200×630 px (estandar OG). Cacheable por CDN — Vercel sirve
 * con cache-control inmutable salvo invalidación de deploy.
 */

export const alt = 'PreEnvios.com — Compara antes de enviar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const tagline = locale === 'en' ? 'Compare before you send' : 'Compara antes de enviar'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          padding: '80px',
        }}
      >
        {/* Logo + wordmark — replica el header SVG del sitio */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '48px',
          }}
        >
          {/* P verde brand — mismo path que el favicon/Sections.tsx logo */}
          <svg width="180" height="180" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#00D957" />
            <path
              d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z"
              fill="#fff"
            />
          </svg>
          {/* Wordmark — coincide con Nav y Footer */}
          <div
            style={{
              display: 'flex',
              fontSize: '108px',
              fontWeight: 700,
              letterSpacing: '-2px',
              lineHeight: 1,
              color: '#0B1220',
            }}
          >
            <span style={{ color: '#00D957' }}>pre</span>
            <span>envios</span>
            <span style={{ color: '#94A3B8' }}>.com</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: '40px',
            color: '#64748B',
            fontWeight: 500,
            letterSpacing: '-0.5px',
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  )
}
