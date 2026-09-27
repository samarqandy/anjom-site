import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import handler, { formatLead, normalizePhone, parseLead, sendToTelegram } from '../api/lead.js'

function fakeRes() {
  const res = { statusCode: 200, headers: {}, body: undefined }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (value) => ((res.body = value), res)
  res.send = (value) => ((res.body = value), res)
  res.setHeader = (key, value) => ((res.headers[key.toLowerCase()] = value), res)
  return res
}

const json = { accept: 'application/json' }
const good = { name: ' Aziz  Karimov ', phone: '90 123-45-67', lang: 'uz', elapsed: 9000 }

describe('normalizePhone', () => {
  it('adds the country code to a local number', () => {
    assert.equal(normalizePhone('90 123 45 67'), '998901234567')
  })
  it('keeps a full Uzbek number', () => {
    assert.equal(normalizePhone('+998 (90) 123-45-67'), '998901234567')
  })
  it('keeps a foreign number', () => {
    assert.equal(normalizePhone('+7 912 345 67 89'), '79123456789')
  })
  it('refuses what is not a phone', () => {
    assert.equal(normalizePhone('12345'), null)
    assert.equal(normalizePhone('998 12'), null)
  })
})

describe('parseLead', () => {
  it('cleans a real request', () => {
    const { lead } = parseLead({ ...good, business: 'Qurilish', message: 'Salom\u0007' })
    assert.deepEqual(lead, {
      name: 'Aziz Karimov',
      phone: '998901234567',
      business: 'Qurilish',
      message: 'Salom',
      lang: 'uz',
    })
  })
  it('treats the hidden field as a bot', () => {
    assert.deepEqual(parseLead({ ...good, website: 'http://spam' }), { spam: true })
  })
  it('treats an instant submit as a bot', () => {
    assert.deepEqual(parseLead({ ...good, elapsed: 300 }), { spam: true })
  })
  it('refuses a missing name or phone', () => {
    assert.deepEqual(parseLead({ ...good, name: 'A' }), { error: 'invalid' })
    assert.deepEqual(parseLead({ ...good, phone: '' }), { error: 'invalid' })
    assert.deepEqual(parseLead(null), { error: 'invalid' })
  })
  it('cuts long fields', () => {
    const { lead } = parseLead({ ...good, message: 'x'.repeat(5000) })
    assert.equal(lead.message.length, 1000)
  })
})

describe('formatLead', () => {
  it('reads like a notification and skips empty lines', () => {
    const text = formatLead(
      { name: 'Aziz', phone: '998901234567', business: '', message: '', lang: 'ru' },
      new Date('2026-09-27T09:00:00Z'),
    )
    assert.equal(
      text,
      '🆕 Yangi ariza — anjom.uz\n👤 Aziz\n📞 +998901234567\n🌐 RU · 27.09.2026, 14:00:00',
    )
  })
})

describe('sendToTelegram', () => {
  it('reports Telegram refusing the message', async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ ok: false }), { status: 400 })
    assert.equal(await sendToTelegram('x', { token: 't', chatId: '1', fetchImpl }), false)
  })
  it('reports a network failure', async () => {
    const fetchImpl = async () => {
      throw new Error('offline')
    }
    assert.equal(await sendToTelegram('x', { token: 't', chatId: '1', fetchImpl }), false)
  })
})

describe('handler', () => {
  const realFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = realFetch
    delete process.env.LEAD_TELEGRAM_BOT_TOKEN
    delete process.env.LEAD_TELEGRAM_CHAT_ID
  })

  it('only accepts POST', async () => {
    const res = fakeRes()
    await handler({ method: 'GET', headers: json }, res)
    assert.equal(res.statusCode, 405)
    assert.equal(res.headers.allow, 'POST')
  })

  it('says so when the form is not configured', async () => {
    const res = fakeRes()
    await handler({ method: 'POST', headers: json, body: good }, res)
    assert.equal(res.statusCode, 503)
    assert.deepEqual(res.body, { ok: false, error: 'not_configured' })
  })

  it('delivers a request to the configured chat', async () => {
    process.env.LEAD_TELEGRAM_BOT_TOKEN = 'TOKEN'
    process.env.LEAD_TELEGRAM_CHAT_ID = '-100500'
    const calls = []
    globalThis.fetch = async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) })
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }
    const res = fakeRes()
    await handler({ method: 'POST', headers: json, body: good }, res)
    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { ok: true })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.telegram.org/botTOKEN/sendMessage')
    assert.equal(calls[0].body.chat_id, '-100500')
    assert.match(calls[0].body.text, /Aziz Karimov/)
  })

  it('does not send anything for a bot, but answers the same', async () => {
    process.env.LEAD_TELEGRAM_BOT_TOKEN = 'TOKEN'
    process.env.LEAD_TELEGRAM_CHAT_ID = '1'
    let called = false
    globalThis.fetch = async () => ((called = true), new Response('{}'))
    const res = fakeRes()
    await handler({ method: 'POST', headers: json, body: { ...good, website: 'x' } }, res)
    assert.equal(res.statusCode, 200)
    assert.equal(called, false)
  })

  it('answers a form posted without JavaScript with a page', async () => {
    const res = fakeRes()
    const body = 'name=Aziz&phone=901234567&lang=ru'
    await handler({ method: 'POST', headers: { accept: 'text/html' }, body }, res)
    assert.equal(res.statusCode, 503)
    assert.match(res.headers['content-type'], /text\/html/)
    assert.match(res.body, /Не удалось отправить/)
    assert.match(res.body, /href="\/ru#ariza"/)
  })

  it('refuses an invalid request', async () => {
    const res = fakeRes()
    await handler({ method: 'POST', headers: json, body: { name: '', phone: '1' } }, res)
    assert.equal(res.statusCode, 400)
  })
})
