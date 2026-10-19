import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
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
const build = (env = {}) =>
  execFileSync('npx', ['astro', 'build'], {
    stdio: 'ignore',
    env: { ...process.env, PUBLIC_GA_ID: '', ...env },
  })

/** Everything a build emitted that a browser could run: pages and bundled scripts. */
const emitted = () => {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
    )
  return walk('dist')
    .filter((file) => /\.(html|js)$/.test(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
}

// Three builds, in this order: with a measurement id, with a malformed one, and
// without (the default every other test below reads).
build({ PUBLIC_GA_ID: 'G-NSE5CPZDTC' })
const WITH_GA = { uz: readFileSync('dist/index.html', 'utf8'), all: emitted() }
build({ PUBLIC_GA_ID: 'x"></script><script>alert(1)</script>' })
const WITH_BAD_GA = readFileSync('dist/index.html', 'utf8')
build()

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

// The product's landing pages; every other public page is plain content.
const isLanding = (page) => page.path === '/' || page.path === '/ru'

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
        // Only the landing page describes the product; a text page does not claim to be it.
        assert.deepEqual(types, isLanding(page) ? ['Organization', 'WebSite', 'SoftwareApplication'] : ['Organization', 'WebSite'])
        const [org, , software] = json['@graph']
        if (!isLanding(page)) return
        assert.equal(software.url, page.url)
        assert.ok(software.featureList.length >= 5)
        // No claim the product cannot back: a price, a rating or a review.
        for (const forbidden of ['offers', 'aggregateRating', 'review']) {
          assert.equal(software[forbidden], undefined, `${forbidden} must not be invented`)
        }

        // Who stands behind it: the company, with its address in the page's language.
        const maker = { '@type': 'Organization', name: 'SAM Smart Security Service', url: 'https://www.samsmart.uz' }
        assert.deepEqual(software.publisher, maker)
        assert.deepEqual(software.creator, maker)
        assert.equal(org.telephone, '+998 33 334 44 42')
        const parent = org.parentOrganization
        assert.equal(parent.name, maker.name)
        assert.equal(parent.url, maker.url)
        assert.equal(parent.telephone, '+998 33 334 44 42')
        assert.equal(parent.address['@type'], 'PostalAddress')
        assert.equal(parent.address.addressCountry, 'UZ')
        assert.equal(
          parent.address.streetAddress,
          page.lang === 'ru' ? 'ул. Дагбитская, 11' : 'Dahbed ko‘chasi 11',
        )
        assert.equal(parent.address.addressLocality, page.lang === 'ru' ? 'Самарканд' : 'Samarqand')
      })

      it('names its maker in the footer, with a plain link, and gives a phone and Telegram', () => {
        const footer = one(html(), /(<footer.*<\/footer>)/s) ?? ''
        const product = page.lang === 'ru' ? 'Продукт ' : ''
        const after = page.lang === 'ru' ? '' : ' mahsuloti'
        assert.match(
          footer,
          new RegExp(
            `${product}<a href="https://www\\.samsmart\\.uz"[^>]*>SAM Smart Security Service</a>${after}`,
          ),
        )
        assert.doesNotMatch(footer.match(/<a href="https:\/\/www\.samsmart\.uz"[^>]*>/)[0], /nofollow/)
        assert.match(footer, /href="tel:\+998333344442"/)
        assert.match(footer, /href="https:\/\/t\.me\/samsmartuz"/)
      })

      it('loads no analytics unless a measurement id is configured', () => {
        assert.doesNotMatch(html(), /googletagmanager|gtag\(/)
      })

      it('has social metadata with an image that exists', () => {
        const image = one(html(), /property="og:image" content="([^"]+)"/)
        assert.equal(image, `${SITE}/og-${page.lang}.png`)
        readFileSync(`dist/og-${page.lang}.png`)
        assert.match(html(), /property="og:locale:alternate"/)
      })

      it('gives every image a text alternative', () => {
        const images = all(html(), /(<img[^>]*>)/g)
        if (isLanding(page)) assert.ok(images.length > 0)
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

describe('privacy policy', () => {
  const pages = {
    uz: { file: 'dist/maxfiylik.html', url: `${SITE}/maxfiylik`, twin: `${SITE}/ru/konfidensialnost` },
    ru: { file: 'dist/ru/konfidensialnost.html', url: `${SITE}/ru/konfidensialnost`, twin: `${SITE}/maxfiylik` },
  }
  const text = (file) => decode(read(file).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '))

  for (const [lang, page] of Object.entries(pages)) {
    describe(page.url, () => {
      it('is a public page, paired with its translation', () => {
        const entry = PAGES.find((p) => p.url === page.url)
        assert.ok(entry, 'in the sitemap')
        assert.equal(entry.pair[lang === 'uz' ? 'ru' : 'uz'], page.twin)
      })

      it('switches language to its own translation, and keeps the menu on the landing page', () => {
        const html = read(page.file)
        const other = new URL(page.twin).pathname
        assert.ok(html.includes(`href="${other}" hreflang="${lang === 'uz' ? 'ru' : 'uz'}"`))
        const home = lang === 'uz' ? '/' : '/ru'
        assert.ok(html.includes(`href="${home}#imkoniyatlar"`))
        assert.ok(html.includes(`href="${home}#ariza"`))
      })

      it('says what is collected, why, for how long, and who to ask', () => {
        const body = text(page.file)
        for (const fact of ['utm_source', 'Google Analytics 4', '14', '+998 33 334 44 42', '@samsmartuz']) {
          assert.ok(body.includes(fact), `${fact} is missing`)
        }
        assert.ok(body.includes(lang === 'ru' ? 'не более 1 года' : 'ko‘pi bilan 1 yil'))
        assert.ok(body.includes(lang === 'ru' ? 'Дагбитская, 11, Самарканд' : 'Dahbed ko‘chasi 11, Samarqand'))
        assert.match(read(page.file), /<a href="https:\/\/www\.samsmart\.uz"[^>]*>https:\/\/www\.samsmart\.uz<\/a>/)
      })

      it('is linked from the landing page footer and from the lead form', () => {
        const landing = read(lang === 'uz' ? 'dist/index.html' : 'dist/ru.html')
        const link = new URL(page.url).pathname
        assert.match(one(landing, /(<footer.*<\/footer>)/s) ?? '', new RegExp(`<a href="${link}"`))
        const form = one(landing, /(<form id="lead-form".*?<\/form>)/s) ?? ''
        assert.match(form, new RegExp(`<a href="${link}"[^>]*>${lang === 'ru' ? 'Политика конфиденциальности' : 'Maxfiylik siyosati'}</a>`))
        assert.ok(form.includes(lang === 'ru' ? 'связи с вами и улучшения сервиса' : 'xizmatni yaxshilash uchun ishlatiladi'))
      })
    })
  }
})

describe('llms.txt', () => {
  const credit =
    'Developed by SAM Smart Security Service (https://www.samsmart.uz), Samarqand, +998 33 334 44 42'

  for (const [lang, file] of [['uz', 'dist/llms.txt'], ['ru', 'dist/ru/llms.txt']]) {
    describe(file, () => {
      const text = () => read(file)

      it('is plain text that starts with the product and ends with the maker credit', () => {
        assert.match(text(), /^# ANJOM\n\n> /)
        assert.equal(text().trimEnd().split('\n').at(-1), credit)
        assert.ok(text().endsWith('\n'))
      })

      it('lists exactly this language\'s public pages, from the sitemap', () => {
        const listed = all(text(), /^- \[[^\]]+\]\((https:\/\/anjom\.uz[^)]*)\):/gm).sort()
        const expected = PAGES.filter((p) => p.lang === lang).map((p) => p.url).sort()
        assert.deepEqual(listed, expected)
      })

      it('links the other language and gives the real contacts', () => {
        const other = lang === 'uz' ? 'https://anjom.uz/ru/llms.txt' : 'https://anjom.uz/llms.txt'
        assert.ok(text().includes(other))
        assert.ok(text().includes('+998 33 334 44 42'))
        assert.ok(text().includes('https://t.me/samsmartuz'))
        assert.ok(text().includes('[SAM Smart Security Service](https://www.samsmart.uz)'))
        assert.ok(text().includes(lang === 'ru' ? 'ул. Дагбитская, 11, Самарканд' : 'Dahbed ko‘chasi 11, Samarqand'))
      })
    })
  }
})

describe('Google Analytics 4', () => {
  it('loads gtag with the configured id and nothing else', () => {
    assert.match(WITH_GA.uz, /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-NSE5CPZDTC">/)
    assert.match(WITH_GA.uz, /gtag\('config', gaId\)/)
    assert.equal(all(WITH_GA.uz, /(googletagmanager\.com)/g).length, 1)
  })

  it('reports phone and Telegram clicks, and a submitted request', () => {
    assert.match(WITH_GA.uz, /'click_phone'/)
    assert.match(WITH_GA.uz, /'click_telegram'/)
    assert.match(WITH_GA.all, /generate_lead/)
  })

  it('never puts a name, a phone number or a message in an event', () => {
    const lead = WITH_GA.all.match(/generate_lead['"`],\s*\{([^}]*)\}/)?.[1] ?? ''
    assert.match(lead, /^\s*page_language:/)
    assert.doesNotMatch(lead, /name|phone|message|business/i)
    assert.match(WITH_GA.uz, /gtag\('event', name, \{ link_location: area, page_language: document\.documentElement\.lang \}\)/)
  })

  it('ignores an id that is not shaped like one', () => {
    assert.doesNotMatch(WITH_BAD_GA, /googletagmanager|alert\(1\)/)
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
