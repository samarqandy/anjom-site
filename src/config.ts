/**
 * Everything on the site that belongs to the business rather than the design.
 *
 * Empty values are not shown: a button to a Telegram account that does not
 * exist yet is worse than no button. Fill these in and redeploy.
 */
export const site = {
  url: 'https://anjom.uz',
  name: 'ANJOM',

  /**
   * The ANJOM panel staff sign in to. Empty hides «Kirish»: it stays empty
   * until the panel is live, then becomes 'https://app.anjom.uz'.
   */
  appUrl: '',

  contacts: {
    /** Telegram username without the @, e.g. 'anjom_uz'. */
    telegram: 'samsmartuz',
    /** As it should be shown, e.g. '+998 90 123 45 67'. */
    phone: '+998 33 334 44 42',
    email: '',
  },
}

/**
 * The company that makes and sells ANJOM. Its phone and Telegram are the
 * contacts above; what is here is what the footer, the structured data and
 * llms.txt say about who stands behind the product.
 */
export const company = {
  name: 'SAM Smart Security Service',
  url: 'https://www.samsmart.uz',
  country: 'UZ',
  /** The address as written in each language of the site. */
  address: {
    uz: { street: 'Dahbed ko‘chasi 11', locality: 'Samarqand', text: 'Dahbed ko‘chasi 11, Samarqand' },
    ru: { street: 'ул. Дагбитская, 11', locality: 'Самарканд', text: 'ул. Дагбитская, 11, Самарканд' },
  },
} as const

/**
 * Google Analytics 4 measurement id, from the PUBLIC_GA_ID environment
 * variable (Astro exposes only PUBLIC_* to the browser; the id is public
 * anyway). Anything that is not shaped like an id is ignored, so a typo in the
 * environment cannot put a stray string into a <script>.
 */
const rawGaId = import.meta.env.PUBLIC_GA_ID ?? ''
export const gaId: string = /^G-[A-Z0-9]{6,12}$/.test(rawGaId) ? rawGaId : ''

/**
 * Yandex Metrica counter id, from the PUBLIC_YM_ID environment variable — the
 * same rule as the GA id: only digits are accepted, anything else loads nothing.
 */
const rawYmId = import.meta.env.PUBLIC_YM_ID ?? ''
export const ymId: string = /^\d{6,10}$/.test(rawYmId) ? rawYmId : ''

/** Yandex Webmaster ownership code (public; a <meta> tag on every page). */
export const yandexVerification = 'b994ea988ec24def'

export function telegramLink(username: string, text?: string): string {
  const base = `https://t.me/${username.replace(/^@/, '')}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function phoneLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export const hasContacts = Boolean(
  site.contacts.telegram || site.contacts.phone || site.contacts.email,
)
