import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CORREDORES_DATA } from '@/lib/corredores'
import TasaHistorica from './tasa-content'

export function generateStaticParams() {
  const params: { pair: string }[] = []
  for (const c of CORREDORES_DATA) {
    params.push({ pair: c.slug })
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>
}): Promise<Metadata> {
  const { locale, pair } = await params
  const en = locale === 'en'
  const corredor = CORREDORES_DATA.find((c) => c.slug === pair)

  // Fallback genérico si el slug no existe — evita crash en páginas 404.
  if (!corredor) {
    return {
      title: en ? 'Rate not found — PreEnvios.com' : 'Tasa no encontrada — PreEnvios.com',
      robots: { index: false, follow: false },
    }
  }

  const nombre = en ? corredor.nombre_en : corredor.nombre

  return {
    title: en
      ? `${corredor.moneda} rate today — USD to ${nombre} · PreEnvios.com`
      : `Tasa ${corredor.moneda} hoy — USD a ${nombre} · PreEnvios.com`,
    description: en
      ? `Today's ${corredor.moneda} exchange rate for sending USD to ${nombre}. Compare Remitly, Wise, Xoom, Ria, WorldRemit, Western Union and MoneyGram with 30-day history chart.`
      : `Tasa ${corredor.moneda} de hoy para enviar USD a ${nombre}. Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram con gráfica de 30 días.`,
    alternates: {
      canonical: `https://preenvios.vercel.app/${locale}/tasa/${pair}`,
      languages: {
        es: `https://preenvios.vercel.app/es/tasa/${pair}`,
        en: `https://preenvios.vercel.app/en/tasa/${pair}`,
      },
    },
  }
}

export default async function TasaPage({ params }: { params: Promise<{ locale: string; pair: string }> }) {
  const { locale, pair } = await params
  setRequestLocale(locale)
  return <TasaHistorica pair={pair} />
}
