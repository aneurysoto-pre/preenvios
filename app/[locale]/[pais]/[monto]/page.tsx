import { setRequestLocale } from 'next-intl/server'
import { redirect, notFound } from 'next/navigation'
import { PAISES_MVP, findPaisBySlug } from '@/lib/paises'
import PaisContent from '../pais-content'

// Montos pre-renderizados como SSG (indexables por Google). El resto de enteros
// validos [10, 10000] se renderizan on-demand via dynamicParams = true (default).
const MONTOS_SSG = [100, 200, 500, 1000]

export function generateStaticParams() {
  const params: { pais: string; monto: string }[] = []
  for (const p of PAISES_MVP) {
    for (const m of MONTOS_SSG) {
      params.push({ pais: p.slugEs, monto: String(m) })
      if (p.slugEn !== p.slugEs) params.push({ pais: p.slugEn, monto: String(m) })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; pais: string; monto: string }> }) {
  const { locale, pais: slug, monto } = await params
  const pais = findPaisBySlug(slug)
  if (!pais) return {}

  const montoNum = parseInt(monto, 10)
  if (isNaN(montoNum) || montoNum < 10 || montoNum > 10000) return {}

  const en = locale === 'en'
  const nombre = en ? pais.nombreEn : pais.nombre

  return {
    title: en
      ? `Send $${montoNum} USD to ${nombre} — PreEnvios | Best rates today`
      : `Enviar $${montoNum} USD a ${nombre} — PreEnvios | Mejores tasas hoy`,
    description: en
      ? `Compare Remitly, Wise, Xoom, Ria and more to send $${montoNum} USD to ${nombre}. Find the best rate today. 100% free, no signup.`
      : `Compara Remitly, Wise, Xoom, Ria y más para enviar $${montoNum} USD a ${nombre}. Encuentra la mejor tasa hoy. 100% gratis, sin registro.`,
    alternates: {
      canonical: `https://preenvios.com/${locale}/${slug}/${montoNum}`,
      languages: {
        es: `https://preenvios.com/es/${pais.slugEs}/${montoNum}`,
        en: `https://preenvios.com/en/${pais.slugEn}/${montoNum}`,
      },
    },
  }
}

export default async function PaisMontoPage({ params }: { params: Promise<{ locale: string; pais: string; monto: string }> }) {
  const { locale, pais: slug, monto } = await params
  setRequestLocale(locale)

  const pais = findPaisBySlug(slug)
  if (!pais) notFound()

  // Solo dígitos puros o decimales con dígitos (no signos, no texto).
  if (!/^\d+(\.\d+)?$/.test(monto)) {
    redirect(`/${locale}/${slug}`)
  }
  const montoFloat = parseFloat(monto)
  if (isNaN(montoFloat) || montoFloat < 10 || montoFloat > 10000) {
    redirect(`/${locale}/${slug}`)
  }
  // Decimales y strings no canonicos (ej. "0200", "200.5") redirigen a la forma entera.
  const montoEntero = Math.round(montoFloat)
  if (String(montoEntero) !== monto) {
    redirect(`/${locale}/${slug}/${montoEntero}`)
  }

  return <PaisContent slug={slug} initialMonto={montoEntero} />
}
