'use client'

/**
 * Nav — barra de navegacion fixed top con dos UIs purpose-built:
 *  - Desktop (md+): nav horizontal con DropdownMenu (Radix) para Destinos
 *    + links <Link> directos + toggle ES/EN
 *  - Mobile (<md): burger button abre Drawer (vaul) lateral desde la
 *    derecha — overlay oscurecido bg-black/40, swipe-to-dismiss nativo,
 *    DrawerClose wraps cada link para que al tap se cierre el drawer
 *
 * Reemplaza el approach anterior basado en:
 *  - Estado `menuOpen` local + div `fixed top-[48px] max-h-[calc(100vh-48px)]`
 *    que replicaba un drawer custom sin a11y completo
 *  - `corridorRef` con outside-click handler manual para cerrar dropdown
 *    (Radix DropdownMenu ya maneja esto nativo + ESC + focus trap)
 *  - 3-span animated burger (sustituido por Menu icon Lucide con padding
 *    44x44px segun Apple HIG)
 */

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import { PAISES_MVP } from '@/lib/paises'
import { trackEvent } from '@/lib/tracking'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'

// Inline SVG flags — emoji flags (🇺🇸 🇪🇸) NO renderean en Windows (se ven
// como "us"/"es" texto). Estos son decorativos pequenos, SVG inline evita
// request externo + es resistente al bug de Windows.
function FlagUS({ className = 'w-5 h-[14px]' }: { className?: string }) {
  return (
    <svg
      className={`${className} rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(15,23,42,.08)]`}
      viewBox="0 0 60 30"
      aria-hidden="true"
    >
      <rect width="60" height="30" fill="#fff" />
      <g fill="#B22234">
        <rect y="0" width="60" height="2.3" />
        <rect y="4.6" width="60" height="2.3" />
        <rect y="9.2" width="60" height="2.3" />
        <rect y="13.8" width="60" height="2.3" />
        <rect y="18.4" width="60" height="2.3" />
        <rect y="23" width="60" height="2.3" />
        <rect y="27.6" width="60" height="2.4" />
      </g>
      <rect width="24" height="16.2" fill="#3C3B6E" />
    </svg>
  )
}

function FlagES({ className = 'w-5 h-[14px]' }: { className?: string }) {
  return (
    <svg
      className={`${className} rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(15,23,42,.08)]`}
      viewBox="0 0 60 40"
      aria-hidden="true"
    >
      <rect width="60" height="40" fill="#C60B1E" />
      <rect y="10" width="60" height="20" fill="#FFC400" />
    </svg>
  )
}

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const en = locale === 'en'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocale() {
    const next = locale === 'es' ? 'en' : 'es'
    const path = pathname.replace(`/${locale}`, `/${next}`)
    trackEvent('cambio_idioma', {
      event_category: 'i18n',
      idioma_anterior: locale,
      idioma_nuevo: next,
    })
    router.push(path)
    setMobileOpen(false)
  }

  // Anchors que solo existen en home. Desde otras paginas, prefijar con
  // /${locale} para que el browser navegue a home y luego scrollee al hash.
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const homeAnchor = (hash: string) => (isHome ? hash : `/${locale}${hash}`)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-[14px] border-b border-g200 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_14px_rgba(15,23,42,.08)]' : ''
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-[48px] flex items-center justify-between">
        {/* Logo — Link interno preserva prefetch + client-side navigation */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-logo text-[22px] font-bold lowercase tracking-tight"
        >
          <svg
            className="w-[26px] h-[26px] shrink-0"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <rect width="40" height="40" rx="10" fill="#00D957" />
            <path
              d="M13 10h10.5a7 7 0 0 1 0 14H17v6h-4V10zm4 4v6h6.5a3 3 0 0 0 0-6H17z"
              fill="#fff"
            />
          </svg>
          <span>
            <span className="text-green">pre</span>
            <span className="text-ink">envios</span>
            <span className="text-ink font-bold">.com</span>
          </span>
        </Link>

        {/* Desktop links — orden: Destinos, Como funciona, Preguntas, Contacto, ES/EN */}
        <div className="hidden md:flex gap-8 items-center">
          {/* Destinos — DropdownMenu (Radix) maneja click, ESC, outside
              click, focus trap, keyboard nav (arrows + enter) nativo.
              El comportamiento replica el dropdown custom anterior con
              mejor a11y. */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group text-sm font-semibold text-g600 hover:text-blue transition-colors flex items-center gap-1 outline-none focus-visible:text-blue data-[state=open]:text-blue">
              {t('corridors')}
              <ChevronDown
                className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px] w-auto p-2">
              {PAISES_MVP.map(p => (
                <DropdownMenuItem key={p.corredorId} asChild className="px-3 py-2.5 gap-3 cursor-pointer">
                  <Link href={`/${locale}/${en ? p.slugEn : p.slugEs}`}>
                    <Image
                      src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                      alt=""
                      width={22}
                      height={15}
                      unoptimized
                      className="rounded-[2px] shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
                    />
                    <span className="text-sm font-medium text-ink">
                      {en ? p.nombreEn : p.nombre}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href={homeAnchor('#como')}
            className="text-sm font-semibold text-g600 hover:text-blue transition-colors"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href={homeAnchor('#faq')}
            className="text-sm font-semibold text-g600 hover:text-blue transition-colors"
          >
            {t('faq')}
          </Link>
          <Link
            href={`/${locale}/contacto`}
            className="text-sm font-semibold text-g600 hover:text-blue transition-colors"
          >
            {t('contact')}
          </Link>
          <button
            onClick={switchLocale}
            className="text-sm font-bold text-g700 hover:text-blue border border-g200 hover:border-blue rounded-full px-3 py-1.5 transition-colors inline-flex items-center gap-2"
            aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
          >
            {locale === 'es' ? <FlagUS /> : <FlagES />}
            <span>{locale === 'es' ? 'English' : 'Español'}</span>
          </button>
        </div>

        {/* Mobile burger — Drawer (vaul) direction=right. Reusa overlay
            oscurecido bg-black/40 + swipe gesture + ESC que ya fueron
            configurados para el Comparador (Fase 1.1). Tap en burger
            abre, tap en overlay o swipe cierra, ESC cierra, click en
            cualquier link interno cierra (via DrawerClose). */}
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="right">
          <DrawerTrigger asChild>
            <button
              className="md:hidden p-2.5 -mr-2.5 text-ink hover:bg-g100 rounded-md transition-colors"
              aria-label={t('openMenu')}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="p-0">
            {/* DrawerTitle + Description sr-only — requeridos por Radix
                para screen readers. Sin header visual porque el boton
                "Cerrar" ahora vive AL FINAL de la lista de navegacion
                (bajo ES/EN), con mismo estilo que los demas links. */}
            <DrawerTitle className="sr-only">{t('menuTitle')}</DrawerTitle>
            <DrawerDescription className="sr-only">{t('menuTitle')}</DrawerDescription>
            {/* Content wrapper con paddingTop safe-area — empuja la
                primera label "DESTINOS" debajo del notch en iPhone
                14/15/16 Pro. max(16px, inset) garantiza minimo 16px de
                aire en devices sin notch (iPhone SE, desktop). */}
            <div
              className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]"
              style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
            >
              <p className="pt-2 pb-2 px-5 text-xs font-extrabold text-g500 uppercase tracking-wider">
                {t('corridors')}
              </p>
              {PAISES_MVP.map(p => (
                <DrawerClose asChild key={p.corredorId}>
                  <Link
                    href={`/${locale}/${en ? p.slugEn : p.slugEs}`}
                    className="py-3 px-5 text-base font-bold text-ink border-b border-g100 flex items-center gap-3"
                  >
                    <Image
                      src={`https://flagcdn.com/w40/${p.codigoPais}.png`}
                      alt=""
                      width={26}
                      height={18}
                      unoptimized
                      className="rounded-[2px] shadow-[0_0_0_1px_rgba(15,23,42,.08)] shrink-0"
                    />
                    {en ? p.nombreEn : p.nombre}
                  </Link>
                </DrawerClose>
              ))}
              <DrawerClose asChild>
                <Link
                  href={homeAnchor('#como')}
                  className="py-3.5 px-5 text-base font-bold text-ink border-b border-g100 block"
                >
                  {t('howItWorks')}
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href={homeAnchor('#faq')}
                  className="py-3.5 px-5 text-base font-bold text-ink border-b border-g100 block"
                >
                  {t('faq')}
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href={`/${locale}/contacto`}
                  className="py-3.5 px-5 text-base font-bold text-ink border-b border-g100 block"
                >
                  {t('contact')}
                </Link>
              </DrawerClose>
              <button
                onClick={switchLocale}
                className="w-full py-3.5 px-5 text-base font-bold text-ink border-b border-g100 text-left inline-flex items-center gap-2.5"
              >
                {locale === 'es' ? <FlagUS className="w-6 h-[17px]" /> : <FlagES className="w-6 h-[17px]" />}
                <span>{locale === 'es' ? 'English' : 'Español'}</span>
              </button>
              {/* Cerrar — SEPARADO visualmente del menu (no es parte
                  de la lista de navegacion, es accion de cerrar).
                  - Margen top grande (mt-8) para despegarlo de ES/EN
                  - Layout stacked: ✕ grande arriba (text-3xl) + "Cerrar"
                    pequeño debajo (text-sm). Convencion UX mobile apps:
                    usuarios buscan X en esquinas o arriba/abajo → les
                    damos la X prominente al fondo
                  - Centered (items-center) — NO text-left como los links
                  - Sin border-b (es el ultimo elemento, no fluye a nada) */}
              <DrawerClose asChild>
                <button
                  type="button"
                  className="w-full mt-8 py-6 flex flex-col items-center justify-center gap-1 text-ink hover:opacity-70 transition-opacity"
                  aria-label={t('closeMenu')}
                >
                  <span className="text-3xl font-normal leading-none" aria-hidden="true">✕</span>
                  <span className="text-sm font-medium">{t('close')}</span>
                </button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  )
}
