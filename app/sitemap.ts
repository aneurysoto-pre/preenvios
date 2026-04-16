import type { MetadataRoute } from 'next'

const BASE_URL = 'https://preenvios.com'

const LEGAL_PAGES = ['terminos', 'privacidad', 'como-ganamos-dinero', 'metodologia', 'uso-de-marcas']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const pages: MetadataRoute.Sitemap = []

  // Home pages per locale
  for (const locale of ['es', 'en']) {
    pages.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          es: `${BASE_URL}/es`,
          en: `${BASE_URL}/en`,
        },
      },
    })
  }

  // Legal pages per locale
  for (const page of LEGAL_PAGES) {
    for (const locale of ['es', 'en']) {
      pages.push({
        url: `${BASE_URL}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: {
          languages: {
            es: `${BASE_URL}/es/${page}`,
            en: `${BASE_URL}/en/${page}`,
          },
        },
      })
    }
  }

  return pages
}
