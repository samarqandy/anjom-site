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
    telegram: '',
    /** As it should be shown, e.g. '+998 90 123 45 67'. */
    phone: '',
    email: '',
  },
}

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
