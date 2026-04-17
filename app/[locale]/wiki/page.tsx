import { setRequestLocale } from 'next-intl/server'
import WikiIndex from './wiki-index'

export default async function WikiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <WikiIndex />
}
