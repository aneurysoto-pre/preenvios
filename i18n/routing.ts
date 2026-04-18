import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  // Desactiva deteccion Accept-Language. El locale por defecto siempre es 'es'.
  // El usuario solo cambia a 'en' si lo selecciona manualmente con el boton EN/ES (Nav.tsx).
  // La cookie NEXT_LOCALE recuerda esa eleccion para visitas futuras.
  localeDetection: false,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 365 * 24 * 60 * 60,
  },
})
