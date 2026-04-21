'use client'

/**
 * CountryPicker — selector de pais destino para el Comparador.
 *
 * Arquitectura mobile-first con dos UIs purpose-built:
 *  - Mobile (<768px): Drawer (vaul) — bottom sheet con handle arriba,
 *    overlay oscurecido bg-black/40, swipe-to-dismiss gesture nativo,
 *    max-h-[85dvh] para dejar aire al notch/home indicator arriba.
 *  - Desktop (>=768px): Dialog (Radix) — modal centered con X visible
 *    esquina superior derecha, overlay oscurecido bg-black/40, ESC cierra,
 *    click fuera cierra.
 *
 * Ambos usan el mismo <Command /> (cmdk) por dentro: search input con
 * keyboard navigation (flechas + enter), filtrado fuzzy automatico sobre
 * nombre/codigo/moneda/aliases, CommandList con max-h auto-scroll.
 *
 * Criterio de eleccion mobile vs desktop: matchMedia al momento del click
 * (no durante SSR ni mount) — evita hydration mismatch. Si el usuario
 * redimensiona la ventana entre aperturas, recalcula. Edge case aceptado.
 *
 * Trigger button: mismo para ambos viewports. Dispara openPicker que
 * detecta viewport y setea estado.
 *
 * Accesibilidad: Dialog/DrawerTitle + Description son obligatorios de
 * Radix/vaul para SR (pantalla de lectura). Si no se muestran visualmente,
 * van con sr-only para cumplir a11y sin cambiar UI visible.
 */

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

export type Corredor = {
  id: string
  nombre: string
  nombre_en: string
  moneda: string
  simbolo: string
  codigo_pais: string
  aliases: string[]
}

type Props = {
  /** ID del corredor actualmente seleccionado */
  corredor: string
  /** Lista de corredores disponibles (orden visible) */
  corredores: Corredor[]
  /** Callback cuando el usuario selecciona uno nuevo */
  onSelect: (id: string) => void
}

export function CountryPicker({ corredor, corredores, onSelect }: Props) {
  const t = useTranslations('search')
  const locale = useLocale()
  const en = locale === 'en'

  const [open, setOpen] = useState(false)
  // isMobile se resuelve en click-time via matchMedia para evitar
  // hydration mismatch. null = aun no se ha abierto ninguna vez.
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  const selected = corredores.find((c) => c.id === corredor) ?? corredores[0]

  function handleTriggerClick() {
    if (typeof window !== 'undefined') {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    }
    setOpen(true)
  }

  function handleSelect(id: string) {
    onSelect(id)
    setOpen(false)
  }

  const triggerButton = (
    <button
      type="button"
      onClick={handleTriggerClick}
      aria-haspopup="dialog"
      aria-expanded={open}
      className="w-full bg-g50 border-[1.5px] border-g200 rounded-[14px] px-3.5 py-3 cursor-pointer transition-colors hover:border-blue active:border-blue text-left"
    >
      <span className="block text-[11px] font-bold text-g500 uppercase tracking-wider mb-1">
        {t('destination')}
      </span>
      <span className="flex items-center gap-2.5">
        <Image
          src={`https://flagcdn.com/w40/${selected.codigo_pais}.png`}
          alt=""
          width={30}
          height={22}
          className="rounded-[3px] object-cover shadow-[0_0_0_1px_var(--color-g200)]"
          unoptimized
        />
        <span className="font-heading text-lg font-extrabold text-ink">
          {en ? selected.nombre_en : selected.nombre}
        </span>
        <ChevronDown className="size-3 text-g500 ml-auto" aria-hidden="true" />
      </span>
    </button>
  )

  // Contenido compartido del picker (Command con Input + List) — se renderiza
  // dentro del Drawer mobile o del Dialog desktop segun viewport.
  const commandContent = (
    <Command
      // cmdk filtra por el `value` de cada CommandItem, no por su children.
      // Concatenamos todos los campos buscables en value para que filtre OK.
      className="rounded-none"
    >
      <CommandInput
        placeholder={t('pickerSearchPlaceholder')}
        aria-label={t('pickerSearchPlaceholder')}
      />
      <CommandList className="max-h-[min(60vh,400px)]">
        <CommandEmpty>{t('pickerNoResults')}</CommandEmpty>
        <CommandGroup>
          {corredores.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.nombre} ${c.nombre_en} ${c.moneda} ${c.codigo_pais} ${c.aliases.join(' ')}`}
              onSelect={() => handleSelect(c.id)}
              data-checked={c.id === corredor}
              className="gap-3 py-3"
            >
              <Image
                src={`https://flagcdn.com/w40/${c.codigo_pais}.png`}
                alt=""
                width={28}
                height={20}
                className="rounded-[2px] object-cover shrink-0 shadow-[0_0_0_1px_rgba(15,23,42,.08)]"
                unoptimized
              />
              <span className="font-bold text-[15px] flex-1 min-w-0 truncate text-ink">
                {en ? c.nombre_en : c.nombre}
              </span>
              <span className="text-xs text-g500 font-semibold shrink-0">
                {c.moneda}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return (
    <>
      {triggerButton}

      {/* Mobile: Drawer (vaul) bottom sheet.
          - Handle visible arriba (del shadcn/ui template, visible cuando
            direction=bottom)
          - DrawerOverlay bg-black/40 (modificado en components/ui/drawer.tsx)
          - max-h-[85dvh] para dejar aire al notch iPhone
          - pb con env(safe-area-inset-bottom) para home indicator
          - swipe-down gesture cierra nativo (vaul feature) */}
      {isMobile === true && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent
            className="max-h-[85dvh] pb-[env(safe-area-inset-bottom)]"
          >
            <DrawerHeader className="pt-3 pb-2 px-4 border-b border-g200">
              <DrawerTitle className="text-[16px] font-heading font-extrabold text-ink">
                {t('pickerTitle')}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {t('pickerDescription')}
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 min-h-0 overflow-hidden">{commandContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop: Dialog (Radix) modal centered.
          - DialogContent con close button X auto en esquina superior
            derecha (del shadcn/ui template, showCloseButton=true default)
          - DialogOverlay bg-black/40 (modificado en components/ui/dialog.tsx)
          - Click fuera cierra, ESC cierra, focus trap nativo Radix */}
      {isMobile === false && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-4 pb-3 border-b border-g200 space-y-1">
              <DialogTitle className="text-[16px] font-heading font-extrabold text-ink">
                {t('pickerTitle')}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t('pickerDescription')}
              </DialogDescription>
            </DialogHeader>
            {commandContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
