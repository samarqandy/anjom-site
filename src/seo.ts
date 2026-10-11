/**
 * Every public, indexable page of the site, in one place.
 *
 * The sitemap, the language alternates in each page's <head> and the SEO tests
 * all read this list, so a new page is added once and is then listed, linked
 * to its translation and checked — rather than three hand-written lists
 * drifting apart.
 *
 * A page with a translation names it in `alternate`; a page that exists in one
 * language only leaves it out and is then canonical to itself with no pair.
 * Never list a path that is private, parameterised or generated from data.
 */
import { site } from './config'

export type Lang = 'uz' | 'ru'

export interface PublicPage {
  /** Canonical path, no trailing slash except the root. */
  path: string
  lang: Lang
  /** Path of the same page in the other language, when one exists. */
  alternate?: string
}

export const publicPages: PublicPage[] = [
  { path: '/', lang: 'uz', alternate: '/ru' },
  { path: '/ru', lang: 'ru', alternate: '/' },
]

const absolute = (path: string) => new URL(path, site.url).toString()

export function pageAt(path: string): PublicPage {
  const page = publicPages.find((p) => p.path === path)
  if (!page) throw new Error(`${path} is not in the public page registry (src/seo.ts)`)
  return page
}

/**
 * The hreflang set of a page: itself, its translation if there is one, and an
 * x-default pointing at the Uzbek version of the pair (or at itself).
 */
export function alternatesFor(path: string): { hreflang: string; href: string }[] {
  const page = pageAt(path)
  if (!page.alternate) return [{ hreflang: page.lang, href: absolute(page.path) }]
  const other = pageAt(page.alternate)
  const uz = page.lang === 'uz' ? page : other
  return [
    { hreflang: page.lang, href: absolute(page.path) },
    { hreflang: other.lang, href: absolute(other.path) },
    { hreflang: 'x-default', href: absolute(uz.path) },
  ].sort((a, b) => a.hreflang.localeCompare(b.hreflang))
}
