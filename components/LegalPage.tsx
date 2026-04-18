'use client'

import Nav from './Nav'
import { Footer } from './Sections'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LegalPage({
  tag,
  title,
  children,
  backLabel: _backLabel,
  updatedLabel,
}: {
  tag: string
  title: string
  children: React.ReactNode
  backLabel: string
  updatedLabel: string
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      {/* Content — offset by Nav height (72px) */}
      <div className="flex-1 max-w-[820px] w-full mx-auto px-6 pt-[112px] pb-24">
        <span className="inline-block text-xs font-extrabold text-blue uppercase tracking-[2px] mb-3.5 px-3.5 py-1.5 bg-blue-soft rounded-full">{tag}</span>
        <h1 className="font-heading text-[clamp(30px,4vw,44px)] font-black leading-[1.1] mb-4 text-ink">{title}</h1>
        <p className="text-sm text-g500 mb-10">{updatedLabel}: 2026-04-16</p>
        <div className="prose-legal">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  )
}
