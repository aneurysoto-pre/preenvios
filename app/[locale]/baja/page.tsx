import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import BajaContent from './baja-content'

export default async function BajaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <BajaContent />
    </Suspense>
  )
}
