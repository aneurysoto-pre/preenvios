import { ImageResponse } from 'next/og'

/**
 * Apple touch icon 180x180px — se muestra cuando el usuario hace
 * "Add to Home Screen" en Safari iOS. Next.js App Router lo expone
 * como <link rel="apple-touch-icon" /> automatico.
 *
 * Mismo diseno que favicon pero escalado: "P" blanca bold sobre
 * cuadrado verde brand con bordes redondeados proporcionales
 * (~12% del size, Apple HIG guideline).
 */

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#00D957',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 40,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1,
        }}
      >
        P
      </div>
    ),
    { ...size }
  )
}
