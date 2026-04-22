import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import AdminPanel from './panel'

// Ruta admin — NO indexar. robots: noindex,nofollow garantiza que
// Google no la incluya en SERP aunque alguien linkee por accidente.
export const metadata: Metadata = {
  title: 'Admin — PreEnvios.com',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AdminPanel />
}
