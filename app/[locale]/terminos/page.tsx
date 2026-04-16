import { setRequestLocale } from 'next-intl/server'
import TerminosContent from './content'

export default async function TerminosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <TerminosContent />
}
