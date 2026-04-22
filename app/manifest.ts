import type { MetadataRoute } from 'next'

/**
 * Web App Manifest — habilita "Add to Home Screen" en mobile browsers.
 * Next.js App Router lo expone en /manifest.webmanifest automaticamente.
 *
 * Campos:
 * - name / short_name: nombre visible en launcher mobile
 * - description: para stores y cuando se instala como PWA
 * - start_url / display: app se abre en modo standalone (sin chrome del
 *   browser) cuando se instala, experiencia casi nativa
 * - theme_color: tinta el address bar mobile (tambien va en viewport
 *   meta de layout.tsx para que tome efecto inmediato en el primer load)
 * - background_color: fondo del splash screen al instalar
 * - icons: archivos estaticos en /public (pack de favicon disenado con
 *   Montserrat, 2026-04-22). Reemplazo de los dinamicos anteriores que
 *   usaban system-ui — los estaticos tienen la "P" correctamente kerneada.
 *
 * Nota: el default locale del manifest es 'es' porque routing.ts define
 * defaultLocale: 'es' y el usuario que instala la PWA probablemente viene
 * del sitio en espanol (corridors target: Latinoamerica diaspora).
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PreEnvios.com — Compara remesadoras',
    short_name: 'PreEnvios',
    description:
      'Compara remesadoras antes de enviar dinero a Latinoamerica. Ahorra en cada envio.',
    start_url: '/es',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00D957',
    lang: 'es',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
