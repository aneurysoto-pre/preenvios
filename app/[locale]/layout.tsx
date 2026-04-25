import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Script from 'next/script'
import { Inter, Work_Sans, Quicksand, Fraunces } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import CookieConsent from '@/components/CookieConsent'
import '../globals.css'

// next/font/google — reemplaza el <link> externo a googleapis.com que
// hacia FOUT (flash of unstyled text) y dependia de red de Google. Ahora
// las fuentes se self-hostean desde Vercel (mismo origen, compresion
// automatica, preload automatico por Next.js, sin request externo).
//
// Cada font expone una CSS variable (--font-inter, --font-work-sans,
// --font-quicksand) que globals.css mapea a los tokens del @theme de
// Tailwind (--font-sans, --font-heading, --font-logo). Esto preserva las
// clases `font-sans`, `font-heading`, `font-logo` que usa todo el
// codebase sin tener que tocar componentes.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-work-sans',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-quicksand',
  display: 'swap',
})

// Fraunces (serif editorial) — usada en headings de paginas de pais
// (landing editorial modelo A: Honduras, y los demas MVP cuando se
// porten). El axis `opsz` (optical size) lo maneja next/font/google
// automaticamente; aqui solo declaramos los pesos que el landing usa.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PreEnvios.com — Compara remesadoras. Envía más por menos.',
  description:
    'Compara Remitly, Wise, Xoom, Ria, WorldRemit, Western Union y MoneyGram. Envía más dinero a Honduras, República Dominicana, Guatemala y El Salvador.',
}

// viewport export (Next.js 14+) — separa los tokens del viewport de
// metadata. `viewportFit: 'cover'` es CRITICO para iPhone con notch: sin
// el, env(safe-area-inset-*) retorna 0 y los modales/sheets no respetan
// el area del notch. `themeColor` tinta el address bar mobile con brand
// verde en el primer paint (antes de que el manifest se cargue).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#00D957',
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
    <html
      lang={locale}
      className={`${inter.variable} ${workSans.variable} ${quicksand.variable} ${fraunces.variable}`}
    >
      <head>
        <meta name="impact-site-verification" content="55a6cc64-e7c0-42c2-9995-7b243cc91810" />
        <meta name="fo-verify" content="2ac0d22d-e981-4a57-98c0-8a7ca20bd9fb" />
        {/* Preconnect a CDNs de imagenes usados en todo el sitio (flags
            + logos operadores). Reduce handshake TLS en el primer
            request a esos hosts cuando los componentes montan. */}
        <link rel="preconnect" href="https://flagcdn.com" />
        <link rel="preconnect" href="https://cdn.brandfetch.io" />
        {/* Favicons PNG adicionales — app/favicon.ico es el ICO legacy que
            Next.js auto-linkea como <link rel="icon"> default. Los PNGs
            a continuacion cubren los tamanos especificos que algunos
            browsers prefieren (Chrome 32px, Safari iOS 180px, etc). */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="es" href="https://preenvios.com/es" />
        <link rel="alternate" hrefLang="en" href="https://preenvios.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://preenvios.com/es" />
      </head>
      <body className="font-sans text-ink bg-white leading-relaxed">
        {/* Google Consent Mode v2 — default denied hasta consent explicito.
            GA4 carga en modo pingback (conversions anonimas agregadas, 0
            personal data) hasta que CookieConsent.tsx llame
            gtag('consent','update',...). Ref: CHECKLIST §15.1 */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{send_page_view:true});`}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <CookieConsent />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
