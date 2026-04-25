import type { MetadataRoute } from 'next'

/**
 * robots.txt — generated dynamically by Next.js.
 *
 * Canonical host: preenvios.vercel.app HASTA el cutover de DNS. Después
 * cambiar a preenvios.com + setup redirect 301 + GSC Change of Address.
 *
 * Defense-in-depth: las páginas `/admin` y los endpoints `/api/*` ya
 * tienen `noindex` por meta tag (admin) o no devuelven HTML indexable
 * (api). Los `Disallow` aquí son una segunda capa para crawlers que
 * ignoren las meta tags.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://preenvios.vercel.app/sitemap.xml',
  }
}
