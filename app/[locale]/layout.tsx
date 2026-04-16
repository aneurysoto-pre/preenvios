import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Script from 'next/script'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'PreEnvios.com — Compara remesadoras. Envía más por menos.',
  description:
    'Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Envía más dinero a Honduras, República Dominicana, Guatemala y El Salvador.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" hrefLang="es" href="https://preenvios.com/es" />
        <link rel="alternate" hrefLang="en" href="https://preenvios.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://preenvios.com/es" />
      </head>
      <body className="font-sans text-ink bg-white leading-relaxed">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{send_page_view:true});`}
        </Script>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
