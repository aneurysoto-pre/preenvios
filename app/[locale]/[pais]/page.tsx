import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { PAISES_MVP, findPaisBySlug } from '@/lib/paises'
import PaisContent from './pais-content'

export function generateStaticParams() {
  const params: { pais: string }[] = []
  for (const p of PAISES_MVP) {
    params.push({ pais: p.slugEs })
    params.push({ pais: p.slugEn })
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; pais: string }> }) {
  const { locale, pais: slug } = await params
  const pais = findPaisBySlug(slug)
  if (!pais) return {}
  const en = locale === 'en'
  const nombre = en ? pais.nombreEn : pais.nombre
  return {
    title: en
      ? `Send money to ${nombre} — PreEnvios | Compare the best rates`
      : `Enviar dinero a ${nombre} — PreEnvios | Compara las mejores tasas`,
    description: en
      ? `Compare Remitly, Wise, Xoom, Ria and more to send money to ${nombre}. Find the best rate today. 100% free, no signup.`
      : `Compara Remitly, Wise, Xoom, Ria y más para enviar dinero a ${nombre}. Encuentra la mejor tasa hoy. 100% gratis, sin registro.`,
  }
}

export default async function PaisPage({ params }: { params: Promise<{ locale: string; pais: string }> }) {
  const { locale, pais: slug } = await params
  setRequestLocale(locale)

  const pais = findPaisBySlug(slug)
  if (!pais) notFound()

  return <PaisContent slug={slug} />
}
