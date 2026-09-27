import type { APIRoute } from 'astro'

import { site } from '../config'

const pages = [
  { path: '/', alt: '/ru', lang: 'uz', altLang: 'ru' },
  { path: '/ru', alt: '/', lang: 'ru', altLang: 'uz' },
]

export const GET: APIRoute = () => {
  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, site.url).toString()
      const self = `<xhtml:link rel="alternate" hreflang="${page.lang}" href="${loc}"/>`
      const other = `<xhtml:link rel="alternate" hreflang="${page.altLang}" href="${new URL(page.alt, site.url)}"/>`
      return `  <url><loc>${loc}</loc>${self}${other}</url>`
    })
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
