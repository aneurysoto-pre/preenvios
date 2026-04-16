import type { MetadataRoute } from 'next'

const BASE_URL = 'https://preenvios.com'

const CORREDORES = ['honduras', 'dominican-republic', 'guatemala', 'el-salvador']

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

  return pages
}
