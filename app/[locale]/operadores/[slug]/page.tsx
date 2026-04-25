import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { OPERADORES_DATA } from '@/lib/corredores'
import OperadorContent from './operador-content'

export function generateStaticParams() {
  return OPERADORES_DATA.map(o => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const op = OPERADORES_DATA.find(o => o.slug === slug)
  if (!op) return {}
  const en = locale === 'en'
  return {
    title: en
      ? `${op.nombre} — reviews and rates | PreEnvios`
      : `${op.nombre} — opiniones y tasas | PreEnvios`,
    description: en
      ? `Is ${op.nombre} worth it to send money to Latin America? Rates, fees, speed and honest reviews — compare with Remitly, Wise and others.`
      : `¿Vale la pena ${op.nombre} para enviar dinero a Latinoamérica? Tasas, comisiones, velocidad y opiniones reales — compara con Remitly, Wise y más.`,
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/operadores/${slug}`,
      languages: {
        es: `https://preenvios.vercel.app/es/operadores/${slug}`,
        en: `https://preenvios.vercel.app/en/operadores/${slug}`,
      },
    },
  }
}

export default async function OperadorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  return <OperadorContent slug={slug} />
}
