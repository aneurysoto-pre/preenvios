import { setRequestLocale } from 'next-intl/server'
import ComoGanamosContent from './content'

export default async function ComoGanamosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ComoGanamosContent />
}
