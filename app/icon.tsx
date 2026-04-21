import { ImageResponse } from 'next/og'

/**
 * Favicon dinamico renderizado con ImageResponse (edge runtime).
 * Next.js App Router lo expone como <link rel="icon" /> automatico.
 *
 * Diseno: cuadrado verde brand (#00D957) con letra "P" blanca bold.
 * Simplificacion del logo SVG completo (Nav.tsx:91-94) que es muy
 * detallado para 32x32px — una "P" legible es mas efectiva que la
 * silueta completa a ese tamano.
 *
 * Razon de NO usar un favicon.ico estatico: el public/ esta vacio y
 * generar ICOs multi-tamano requiere herramientas externas. ImageResponse
 * es la solucion Next.js-native: codigo JSX, rendering automatico, soporte
 * AVIF/WebP, compatible con todos los browsers modernos.
 */

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#00D957',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 8,
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
