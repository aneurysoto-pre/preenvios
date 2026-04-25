import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import UsoMarcasContent from './content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const en = locale === 'en'
  return {
    title: en ? 'Trademark usage — PreEnvios.com' : 'Uso de marcas — PreEnvios.com',
    description: en
      ? 'All remittance provider logos and names shown on PreEnvios.com belong to their respective owners. PreEnvios is an independent comparison tool.'
      : 'Los logos y nombres de remesadoras mostrados en PreEnvios.com pertenecen a sus respectivos dueños. PreEnvios es un comparador independiente.',
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/uso-de-marcas`,
      languages: { es: 'https://preenvios.vercel.app/es/uso-de-marcas', en: 'https://preenvios.vercel.app/en/uso-de-marcas' },
    },
  }
}

export default async function UsoMarcasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const en = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://preenvios.vercel.app/${locale}/uso-de-marcas#webpage`,
    url: `https://preenvios.vercel.app/${locale}/uso-de-marcas`,
    name: en ? 'Trademark usage — PreEnvios.com' : 'Uso de marcas — PreEnvios.com',
    inLanguage: locale,
    isPartOf: { '@id': 'https://preenvios.vercel.app/#website' },
    publisher: { '@id': 'https://preenvios.vercel.app/#organization' },
  }
  return (
    <>
      <UsoMarcasContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
