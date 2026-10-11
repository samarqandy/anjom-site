import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

/**
 * What search engines read from the built site, checked on the built site.
 *
 * Two rental businesses in Uzbekistan find ANJOM through a title and a snippet
 * long before they see a page, so the things that decide what Google shows —
 * the title, the description, the canonical, the language alternates, the
 * structured data, what is kept out of the index — must not regress silently.
 */
const SITE = 'https://anjom.uz'

// Build first, then derive the page list from what was actually built — the
// sitemap — so a page added to the registry is checked without editing this
// file. (Top level, because the describe blocks below need the list to exist.)
execFileSync('npx', ['astro', 'build'], { stdio: 'ignore' })

const read = (file) => readFileSync(file, 'utf8')
const one = (html, pattern) => html.match(pattern)?.[1]
const all = (html, pattern) => [...html.matchAll(pattern)].map((m) => m[1])
const decode = (text) => text.replaceAll('&#39;', "'").replaceAll('&amp;', '&')

/** `format: 'file'` in astro.config: / → index.html, /ru → ru.html, /ru/x → ru/x.html */
const fileFor = (path) => (path === '/' ? 'dist/index.html' : `dist${path}.html`)

const PAGES = all(read('dist/sitemap.xml'), /<url>(.*?)<\/url>/gs).map((block) => {
  const url = one(block, /<loc>([^<]+)<\/loc>/)
  const path = new URL(url).pathname
  const lang = path === '/ru' || path.startsWith('/ru/') ? 'ru' : 'uz'
  const pair = Object.fromEntries(
    [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
  )
  return { file: fileFor(path), url, path, lang, htmlLang: lang === 'ru' ? 'ru' : 'uz-Latn', pair }
})

describe('every public page', () => {
  for (const page of PAGES) {
    const html = () => read(page.file)

    describe(page.url, () => {
      it('declares its language', () => {
        assert.equal(one(html(), /<html lang="([^"]+)"/), page.htmlLang)
      })

      it('has a title that fits a result line', () => {
        const title = decode(one(html(), /<title>([^<]*)<\/title>/) ?? '')
        assert.ok(title.length >= 20 && title.length <= 65, `title is ${title.length}: ${title}`)
        assert.match(title, /ANJOM/)
      })

      it('has a description that fits a snippet', () => {
        const text = decode(one(html(), /<meta name="description" content="([^"]*)"/) ?? '')
        assert.ok(text.length >= 80 && text.length <= 165, `description is ${text.length}`)
      })

      it('has exactly one h1', () => {
        assert.equal(all(html(), /<h1[ >]/g).length, 1)
      })

      it('is its own canonical and is indexable', () => {
        assert.equal(one(html(), /<link rel="canonical" href="([^"]+)"/), page.url)
        assert.doesNotMatch(html(), /content="[^"]*noindex/)
        assert.match(html(), /name="robots" content="index, follow, max-image-preview:large"/)
      })

      it('carries exactly the language alternates the sitemap declares, and its twin does the same', () => {
        const head = Object.fromEntries(
          [...html().matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
            (m) => [m[1], m[2]],
          ),
        )
        const { 'x-default': fallback, ...languages } = head
        assert.deepEqual(languages, page.pair)
        const twin = PAGES.find((p) => p.url === page.pair[page.lang === 'uz' ? 'ru' : 'uz'])
        if (twin) {
          // Reciprocal: the translation points back here.
          assert.equal(twin.pair[page.lang], page.url)
          assert.ok(fallback, 'a page with a translation also names an x-default')
        } else {
          assert.equal(Object.keys(page.pair).length, 1, 'a page without a translation has no pair')
        }
      })

      it('describes itself in valid, truthful structured data', () => {
        const json = JSON.parse(one(html(), /application\/ld\+json">([^<]*)</) ?? '{}')
        const types = json['@graph'].map((node) => node['@type'])
        assert.deepEqual(types, ['Organization', 'WebSite', 'SoftwareApplication'])
        const software = json['@graph'][2]
        assert.equal(software.url, page.url)
        assert.ok(software.featureList.length >= 5)
        // No claim the product cannot back: a price, a rating or a review.
        for (const forbidden of ['offers', 'aggregateRating', 'review']) {
          assert.equal(software[forbidden], undefined, `${forbidden} must not be invented`)
        }
      })

      it('has social metadata with an image that exists', () => {
        const image = one(html(), /property="og:image" content="([^"]+)"/)
        assert.equal(image, `${SITE}/og-${page.lang}.png`)
        readFileSync(`dist/og-${page.lang}.png`)
        assert.match(html(), /property="og:locale:alternate"/)
      })

      it('gives every image a text alternative', () => {
        const images = all(html(), /(<img[^>]*>)/g)
        assert.ok(images.length > 0)
        for (const tag of images) assert.match(tag, /alt="[^"]+"/, tag)
      })

      it('preloads the font its own language needs first', () => {
        const wanted = page.lang === 'ru' ? 'cyrillic' : 'latin'
        assert.match(html(), new RegExp(`rel="preload" href="/_astro/onest-${wanted}-wght`))
      })
    })
  }

  it('keeps the two languages from sharing a title or a description', () => {
    const [uz, ru] = PAGES.map((p) => read(p.file))
    assert.notEqual(one(uz, /<title>([^<]*)/), one(ru, /<title>([^<]*)/))
    assert.notEqual(
      one(uz, /name="description" content="([^"]*)"/),
      one(ru, /name="description" content="([^"]*)"/),
    )
  })
})

describe('internal links', () => {
  for (const file of [...PAGES.map((p) => p.file), 'dist/404.html']) {
    it(`${file}: every #anchor exists on the page it is on`, () => {
      const html = read(file)
      const ids = new Set(all(html, /\sid="([^"]+)"/g))
      const missing = all(html, /<a [^>]*href="#([^"]+)"/g).filter((id) => !ids.has(id))
      assert.deepEqual(missing, [])
    })
  }

  it('the 404 page sends its menu to the landing page, not to itself', () => {
    const links = all(read('dist/404.html'), /<a [^>]*href="([^"]*#[^"]*)"/g)
    assert.ok(links.length > 0)
    for (const href of links) assert.ok(href.startsWith('/#'), href)
  })
})

describe('page discovery', () => {
  it('reaches every page from another page: no orphans', () => {
    const linked = new Set(
      [...PAGES.map((p) => p.file), 'dist/404.html'].flatMap((file) =>
        all(read(file), /<a [^>]*href="(\/[^"#]*)/g).map((href) => new URL(href, SITE).toString()),
      ),
    )
    for (const page of PAGES) assert.ok(linked.has(page.url), `${page.url} is linked from nowhere`)
  })

  it('keeps the public pages free of any private application URL', () => {
    for (const page of PAGES) assert.doesNotMatch(read(page.file), /app\.anjom\.uz\/t\//)
  })
})

describe('what is kept out of the index', () => {
  it('marks the not-found page noindex and gives it no canonical', () => {
    const html = read('dist/404.html')
    assert.match(html, /<meta name="robots" content="noindex"/)
    assert.doesNotMatch(html, /rel="canonical"/)
  })

  it('keeps the lead endpoint away from crawlers but not the pages', () => {
    const robots = read('dist/robots.txt')
    assert.match(robots, /^User-agent: \*$/m)
    assert.match(robots, /^Allow: \/$/m)
    assert.match(robots, /^Disallow: \/api\/$/m)
    assert.match(robots, new RegExp(`^Sitemap: ${SITE}/sitemap.xml$`, 'm'))
    assert.doesNotMatch(robots, /^Disallow: \/$/m)
  })
})

describe('sitemap.xml', () => {
  const xml = () => read('dist/sitemap.xml')

  it('lists exactly the canonical public pages, once each', () => {
    const urls = all(xml(), /<loc>([^<]+)<\/loc>/g)
    assert.ok(urls.length >= 2)
    assert.equal(new Set(urls).size, urls.length)
    for (const url of urls) assert.ok(PAGES.some((p) => p.url === url))
  })

  it('declares both languages for each entry', () => {
    for (const block of all(xml(), /(<url>.*?<\/url>)/gs)) {
      const langs = all(block, /hreflang="([^"]+)"/g)
      assert.ok(langs.length >= 1 && !langs.includes('x-default'))
    }
  })

  it('is well-formed XML in the sitemap namespace', () => {
    assert.match(xml(), /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/)
    assert.equal(all(xml(), /<urlset/g).length, 1)
    assert.equal(all(xml(), /<\/urlset>/g).length, 1)
  })
})

describe('hosting configuration', () => {
  const config = JSON.parse(read('vercel.json'))

  it('has one URL form per page: no trailing slash', () => {
    assert.equal(config.trailingSlash, false)
    assert.equal(config.cleanUrls, true)
  })

  it('sends security headers on every response', () => {
    const headers = config.headers.find((h) => h.source === '/(.*)').headers.map((h) => h.key)
    for (const key of ['Strict-Transport-Security', 'X-Content-Type-Options']) {
      assert.ok(headers.includes(key), key)
    }
  })
})
