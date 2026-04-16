import { setRequestLocale } from 'next-intl/server'
import PrivacidadContent from './content'

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PrivacidadContent />
}
