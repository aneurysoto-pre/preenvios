import { setRequestLocale } from 'next-intl/server'
import CalculadoraInversaContent from './content'

export default async function CalculadoraInversaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CalculadoraInversaContent />
}
