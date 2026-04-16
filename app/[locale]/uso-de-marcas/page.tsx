import { setRequestLocale } from 'next-intl/server'
import UsoMarcasContent from './content'

export default async function UsoMarcasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <UsoMarcasContent />
}
