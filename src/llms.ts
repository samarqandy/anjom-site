/**
 * /llms.txt and /ru/llms.txt: a plain-text summary of the product for language
 * models and the tools that feed them, following https://llmstxt.org.
 *
 * It says only what the site itself says. The page list comes from the same
 * registry as the sitemap, so a page added there is listed here too.
 */
import { company, site, telegramLink } from './config'
import { publicPages, type Lang } from './seo'

const copy = {
  uz: {
    summary:
      'Ijara va prokat biznesi uchun tizim: bandlov shaxmatkasi, mijozlar uchun Telegram vitrina, Payme va Click orqali to‘lov, garov, hujjatlar va hisobotlar. Daftar va Excel’ni almashtiradi.',
    audienceTitle: 'Kimlar uchun',
    audience:
      'Avtomobil, uskuna, kiyim, tadbir jihozlari kabi ijara va prokat xizmatlari.',
    featuresTitle: 'Imkoniyatlar',
    features: [
      'Bandlov shaxmatkasi',
      'Mijozlar uchun Telegram vitrina',
      'Payme va Click orqali to‘lov',
      'Garov hisobi',
      'Hujjatlar',
      'Hisobotlar',
      'Daftar va Excel o‘rniga yagona tizim',
    ],
    pagesTitle: 'Sahifalar',
    otherLanguage: 'Ruscha versiya',
    contactTitle: 'Aloqa',
    madeBy: 'Ishlab chiqaruvchi',
    address: 'Manzil',
    phone: 'Telefon',
    telegram: 'Telegram',
  },
  ru: {
    summary:
      'Система для проката и аренды: шахматка бронирований, витрина для клиентов в Telegram, оплата через Payme и Click, залоги, документы и отчёты. Заменяет тетрадь и Excel.',
    audienceTitle: 'Для кого',
    audience:
      'Сервисы аренды и проката: автомобили, оборудование, одежда, инвентарь для мероприятий.',
    featuresTitle: 'Возможности',
    features: [
      'Шахматка бронирований',
      'Витрина для клиентов в Telegram',
      'Оплата через Payme и Click',
      'Учёт залогов',
      'Документы',
      'Отчёты',
      'Одна система вместо тетради и Excel',
    ],
    pagesTitle: 'Страницы',
    otherLanguage: 'Версия на узбекском',
    contactTitle: 'Контакты',
    madeBy: 'Разработчик',
    address: 'Адрес',
    phone: 'Телефон',
    telegram: 'Telegram',
  },
} as const

/** The last line, verbatim, in both languages. */
export const credit = `Developed by ${company.name} (${company.url}), Samarqand, ${site.contacts.phone}`

export function llmsText(lang: Lang): string {
  const t = copy[lang]
  const absolute = (path: string) => new URL(path, site.url).toString()
  const pages = publicPages.filter((page) => page.lang === lang)
  const other = lang === 'uz' ? '/ru' : '/'
  const otherLlms = lang === 'uz' ? '/ru/llms.txt' : '/llms.txt'
  const { telegram, phone, email } = site.contacts

  const lines: (string | null)[] = [
    `# ${site.name}`,
    '',
    `> ${t.summary}`,
    '',
    `## ${t.audienceTitle}`,
    '',
    t.audience,
    '',
    `## ${t.featuresTitle}`,
    '',
    ...t.features.map((feature) => `- ${feature}`),
    '',
    `## ${t.pagesTitle}`,
    '',
    ...pages.map((page) => `- [${page.title}](${absolute(page.path)}): ${page.description}`),
    `- [${t.otherLanguage}](${absolute(other)}) · [llms.txt](${absolute(otherLlms)})`,
    '',
    `## ${t.contactTitle}`,
    '',
    `- ${t.madeBy}: [${company.name}](${company.url})`,
    `- ${t.address}: ${company.address[lang].text}`,
    phone ? `- ${t.phone}: ${phone}` : null,
    telegram ? `- ${t.telegram}: ${telegramLink(telegram)}` : null,
    email ? `- E-mail: ${email}` : null,
    '',
    credit,
    '',
  ]
  // Contacts that are not configured leave an empty string behind; drop only those.
  return lines.filter((line) => line !== null).join('\n')
}
