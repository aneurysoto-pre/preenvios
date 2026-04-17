import { setRequestLocale } from 'next-intl/server'
import ConfirmarContent from './confirmar-content'

export default async function ConfirmarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ConfirmarContent />
}
