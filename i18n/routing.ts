import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 365 * 24 * 60 * 60,
  },
})
