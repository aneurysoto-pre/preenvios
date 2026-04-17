import { setRequestLocale } from 'next-intl/server'
import { OPERADORES_DATA } from '@/lib/corredores'
import OperadorContent from './operador-content'

export function generateStaticParams() {
  return OPERADORES_DATA.map(o => ({ slug: o.slug }))
}

export default async function OperadorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  return <OperadorContent slug={slug} />
}
