import type { MetadataRoute } from 'next'
import { CORREDORES_DATA, OPERADORES_DATA, WIKI_ARTICLES } from '@/lib/corredores'
import { PAISES_MVP } from '@/lib/paises'

const BASE_URL = 'https://preenvios.com'
const LEGAL_PAGES = ['terminos', 'privacidad', 'como-ganamos-dinero', 'metodologia', 'uso-de-marcas', 'disclaimers']
const INSTITUTIONAL_PAGES = ['nosotros', 'contacto', 'alertas']
// Paridad 100% entre los 6 corredores MVP — 1 blog dedicado por corredor.
// Source of truth: lib/cross-links.ts CORRIDOR_BLOGS / BLOG_LINKS.
const BLOG_SLUGS = [
  'cuanto-cobra-western-union-honduras',
  'remitly-vs-western-union-dominicana',
  'forma-mas-barata-enviar-guatemala',
  'comision-cero-el-salvador-realmente-gratis',
  'wise-vs-remitly-colombia-mejor-tasa',
  'mejor-remesadora-mexico-2026',
]

function altLangs(path: string) {
  return { languages: { es: `${BASE_URL}/es${path}`, en: `${BASE_URL}/en${path}` } }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const pages: MetadataRoute.Sitemap = []

  // Home
  for (const locale of ['es', 'en']) {
    pages.push({ url: `${BASE_URL}/${locale}`, lastModified: now, changeFrequency: 'daily', priority: 1.0, alternates: altLangs('') })
  }

  // Legal pages
  for (const page of LEGAL_PAGES) {
    pages.push({ url: `${BASE_URL}/es/${page}`, lastModified: now, changeFrequency: 'monthly', priority: 0.3, alternates: altLangs(`/${page}`) })
    pages.push({ url: `${BASE_URL}/en/${page}`, lastModified: now, changeFrequency: 'monthly', priority: 0.3, alternates: altLangs(`/${page}`) })
  }

  // Institutional pages
  for (const page of INSTITUTIONAL_PAGES) {
    pages.push({ url: `${BASE_URL}/es/${page}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/${page}`) })
    pages.push({ url: `${BASE_URL}/en/${page}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/${page}`) })
  }

  // Tasa histórica por corredor
  for (const c of CORREDORES_DATA) {
    pages.push({ url: `${BASE_URL}/es/tasa/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: altLangs(`/tasa/${c.slug}`) })
    pages.push({ url: `${BASE_URL}/en/tasa/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: altLangs(`/tasa/${c.slug}`) })
  }

  // Operadores
  for (const o of OPERADORES_DATA) {
    pages.push({ url: `${BASE_URL}/es/operadores/${o.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: altLangs(`/operadores/${o.slug}`) })
    pages.push({ url: `${BASE_URL}/en/operadores/${o.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: altLangs(`/operadores/${o.slug}`) })
  }

  // Blog
  pages.push({ url: `${BASE_URL}/es/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7, alternates: altLangs('/blog') })
  pages.push({ url: `${BASE_URL}/en/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7, alternates: altLangs('/blog') })
  for (const slug of BLOG_SLUGS) {
    pages.push({ url: `${BASE_URL}/es/blog/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/blog/${slug}`) })
    pages.push({ url: `${BASE_URL}/en/blog/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/blog/${slug}`) })
  }

  // Wiki
  pages.push({ url: `${BASE_URL}/es/wiki`, lastModified: now, changeFrequency: 'weekly', priority: 0.7, alternates: altLangs('/wiki') })
  pages.push({ url: `${BASE_URL}/en/wiki`, lastModified: now, changeFrequency: 'weekly', priority: 0.7, alternates: altLangs('/wiki') })
  for (const a of WIKI_ARTICLES) {
    pages.push({ url: `${BASE_URL}/es/wiki/${a.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/wiki/${a.slug}`) })
    pages.push({ url: `${BASE_URL}/en/wiki/${a.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: altLangs(`/wiki/${a.slug}`) })
  }

  // Calculadora inversa
  pages.push({ url: `${BASE_URL}/es/calculadora-inversa`, lastModified: now, changeFrequency: 'daily', priority: 0.6, alternates: altLangs('/calculadora-inversa') })
  pages.push({ url: `${BASE_URL}/en/calculadora-inversa`, lastModified: now, changeFrequency: 'daily', priority: 0.6, alternates: altLangs('/calculadora-inversa') })

  // Páginas editoriales por país
  for (const p of PAISES_MVP) {
    pages.push({ url: `${BASE_URL}/es/${p.slugEs}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${BASE_URL}/es/${p.slugEs}`, en: `${BASE_URL}/en/${p.slugEn}` } } })
    pages.push({ url: `${BASE_URL}/en/${p.slugEn}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${BASE_URL}/es/${p.slugEs}`, en: `${BASE_URL}/en/${p.slugEn}` } } })
  }

  // Páginas país+monto (SSG). 4 montos × 6 países × 2 locales = 48 URLs.
  // Indexables con canonical + alternates ES/EN apuntando al mismo monto.
  const MONTOS_SSG = [100, 200, 500, 1000]
  for (const p of PAISES_MVP) {
    for (const m of MONTOS_SSG) {
      pages.push({
        url: `${BASE_URL}/es/${p.slugEs}/${m}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { es: `${BASE_URL}/es/${p.slugEs}/${m}`, en: `${BASE_URL}/en/${p.slugEn}/${m}` } },
      })
      pages.push({
        url: `${BASE_URL}/en/${p.slugEn}/${m}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { es: `${BASE_URL}/es/${p.slugEs}/${m}`, en: `${BASE_URL}/en/${p.slugEn}/${m}` } },
      })
    }
  }

  return pages
}
