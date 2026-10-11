import type { APIRoute } from 'astro'

import { site } from '../config'
import { alternatesFor, publicPages } from '../seo'

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

export const GET: APIRoute = () => {
  const urls = publicPages
    .map((page) => {
      const loc = new URL(page.path, site.url).toString()
      const links = alternatesFor(page.path)
        // x-default is for the <head>; the sitemap pairs real languages only.
        .filter((alt) => alt.hreflang !== 'x-default')
        .map((alt) => `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escape(alt.href)}"/>`)
        .join('')
      return `  <url><loc>${escape(loc)}</loc>${links}</url>`
    })
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
