'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function LegalPage({
  tag,
  title,
  children,
  backLabel,
  updatedLabel,
}: {
  tag: string
  title: string
  children: React.ReactNode
  backLabel: string
  updatedLabel: string
}) {
  const locale = useLocale()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-g200 z-10">
        <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
          <a href={`/${locale}`} className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight">
            <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#00D957" />
              <path d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z" fill="#fff" />
            </svg>
            <span><span className="text-green">pre</span><span className="text-ink">envios</span><span className="text-ink font-bold">.com</span></span>
          </a>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="inline-flex items-center gap-2 bg-g50 border-[1.5px] border-g200 px-4 py-2.5 rounded-full text-sm font-bold text-ink hover:bg-blue hover:text-white hover:border-blue transition-colors"
          >
            {backLabel}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[820px] mx-auto px-6 py-16 pb-24">
        <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{tag}</span>
        <h1 className="font-heading text-[clamp(30px,4vw,44px)] font-black leading-[1.1] mb-4 text-ink">{title}</h1>
        <p className="text-sm text-g500 mb-10">{updatedLabel}: 2026-04-16</p>
        <div className="prose-legal">
          {children}
        </div>
      </div>
    </div>
  )
}
