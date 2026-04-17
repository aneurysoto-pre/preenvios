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

export default async function TasaPage({ params }: { params: Promise<{ locale: string; pair: string }> }) {
  const { locale, pair } = await params
  setRequestLocale(locale)
  return <TasaHistorica pair={pair} />
}
