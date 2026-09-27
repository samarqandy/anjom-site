/**
 * POST /api/lead — a request from the form on anjom.uz, delivered to Telegram.
 *
 * Configure in Vercel → Settings → Environment Variables:
 *   LEAD_TELEGRAM_BOT_TOKEN  token of the bot that posts the requests
 *   LEAD_TELEGRAM_CHAT_ID    chat (or group) id the requests go to
 *
 * Without them the form answers 503 and the page asks the visitor to try
 * later: nothing is stored anywhere, so an unconfigured form must not pretend
 * to have received anything.
 */

const LIMITS = { name: 80, business: 80, message: 1000 }
/** A human needs longer than this to type a name and a phone number. */
const MIN_FILL_MS = 1500

const TEXT = {
  uz: {
    title: 'Ariza',
    ok: 'Rahmat! Arizangiz qabul qilindi — tez orada bog‘lanamiz.',
    invalid: 'Ism va telefon raqamini to‘g‘ri kiriting.',
    error: 'Yuborib bo‘lmadi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
    back: 'anjom.uz ga qaytish',
  },
  ru: {
    title: 'Заявка',
    ok: 'Спасибо! Заявка принята — скоро свяжемся.',
    invalid: 'Проверьте имя и номер телефона.',
    error: 'Не удалось отправить. Попробуйте ещё раз чуть позже.',
    back: 'Вернуться на anjom.uz',
  },
}

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Uzbek numbers become 998XXXXXXXXX; foreign ones are kept as typed digits. */
export function normalizePhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length === 9) return `998${digits}`
  if (digits.length === 12 && digits.startsWith('998')) return digits
  if (digits.length >= 10 && digits.length <= 15 && !digits.startsWith('998')) return digits
  return null
}

/**
 * @returns {{ spam: true } | { error: 'invalid' } | { lead: {
 *   name: string, phone: string, business: string, message: string, lang: 'uz' | 'ru' } }}
 */
export function parseLead(body) {
  const data = body && typeof body === 'object' ? body : {}
  if (clean(data.website, 200)) return { spam: true }
  const elapsed = Number(data.elapsed)
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) return { spam: true }

  const name = clean(data.name, LIMITS.name)
  const phone = normalizePhone(data.phone)
  if (name.length < 2 || !phone) return { error: 'invalid' }

  return {
    lead: {
      name,
      phone,
      business: clean(data.business, LIMITS.business),
      message: clean(data.message, LIMITS.message),
      lang: data.lang === 'ru' ? 'ru' : 'uz',
    },
  }
}

export function formatLead(lead, now = new Date()) {
  const when = now.toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent', hour12: false })
  return [
    '🆕 Yangi ariza — anjom.uz',
    `👤 ${lead.name}`,
    `📞 +${lead.phone}`,
    lead.business && `🏷 ${lead.business}`,
    lead.message && `💬 ${lead.message}`,
    `🌐 ${lead.lang.toUpperCase()} · ${when}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendToTelegram(text, { token, chatId, fetchImpl = fetch }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: controller.signal,
    })
    if (!response.ok) return false
    const payload = await response.json().catch(() => null)
    return Boolean(payload?.ok)
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

function readBody(req) {
  const body = req.body
  if (body && typeof body === 'object') return body
  if (typeof body !== 'string' || !body) return {}
  try {
    return JSON.parse(body)
  } catch {
    return Object.fromEntries(new URLSearchParams(body))
  }
}

function wantsJson(req) {
  return String(req.headers?.accept ?? '').includes('application/json')
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** JSON for the page's script; a small page of its own for a form posted without JS. */
function reply(req, res, status, outcome, lang) {
  if (wantsJson(req)) {
    res.status(status).json(outcome === 'ok' ? { ok: true } : { ok: false, error: outcome })
    return
  }
  const t = TEXT[lang] ?? TEXT.uz
  const message = outcome === 'ok' ? t.ok : outcome === 'invalid' ? t.invalid : t.error
  const home = lang === 'ru' ? '/ru' : '/'
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(status).send(
      `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width,initial-scale=1">` +
        `<meta name="robots" content="noindex"><title>${t.title} — ANJOM</title></head>` +
        `<body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#0f1728">` +
        `<p style="font-size:20px;line-height:1.5">${escapeHtml(message)}</p>` +
        `<p><a href="${home}#ariza" style="color:#1f5fd6">← ${escapeHtml(t.back)}</a></p></body></html>`,
    )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ ok: false, error: 'method_not_allowed' })
    return
  }

  const body = readBody(req)
  const lang = body.lang === 'ru' ? 'ru' : 'uz'
  const parsed = parseLead(body)

  // Bots get the same answer as people, so there is nothing to learn from it.
  if ('spam' in parsed) return reply(req, res, 200, 'ok', lang)
  if ('error' in parsed) return reply(req, res, 400, 'invalid', lang)

  const token = process.env.LEAD_TELEGRAM_BOT_TOKEN
  const chatId = process.env.LEAD_TELEGRAM_CHAT_ID
  if (!token || !chatId) return reply(req, res, 503, 'not_configured', lang)

  const sent = await sendToTelegram(formatLead(parsed.lead), { token, chatId })
  if (!sent) return reply(req, res, 502, 'delivery_failed', lang)
  return reply(req, res, 200, 'ok', lang)
}
