/**
 * POST /api/lead — lead form on public landing pages (no login).
 * Body: { name, phone, email?, industry?, experience?, profile_url?, page?,
 *         utm_source?, utm_medium?, utm_campaign?, website (honeypot) }
 * Saved to public.leads (service role); visible to admins in /admin → Leads.
 */
import { handle, json, readJson, HttpError } from './_lib/http.js'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { DOMAINS, EXPERIENCE, normalizeProfile } from '../shared/memberConfig.js'

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/
const clip = (v, max) => {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}

/** Pure validation, exported for tests. Returns the row to insert. */
export function validateLead(body) {
  const name = clip(body.name, 120)
  if (!name || name.length < 2) throw new HttpError(400, 'Please enter your full name.')
  let digits = String(body.phone ?? '').replace(/[^\d]/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (!/^[6-9]\d{9}$/.test(digits)) throw new HttpError(400, 'Please enter a valid 10-digit mobile number.')
  const email = clip(body.email, 254)
  if (email && !EMAIL.test(email)) throw new HttpError(400, 'Please enter a valid email address.')
  const platform = body.platform === 'instagram' ? 'instagram' : 'linkedin'
  const industry = clip(body.industry, 60)
  if (industry && !Object.keys(DOMAINS[platform]).includes(industry) && industry !== 'Other') throw new HttpError(400, 'Please choose your industry.')
  const experience = clip(body.experience, 20)
  if (experience && !EXPERIENCE.includes(experience)) throw new HttpError(400, 'Please choose your experience.')
  let profile_url = null
  if (clip(body.profile_url, 300)) {
    profile_url = normalizeProfile(platform, body.profile_url)
    if (!profile_url) throw new HttpError(400, platform === 'linkedin' ? 'Please enter your LinkedIn profile link, e.g. https://www.linkedin.com/in/your-name' : 'Please enter a valid Instagram handle.')
  }
  return {
    platform, name, phone: `+91${digits}`, email: email ? email.toLowerCase() : null, industry, experience, profile_url,
    page: clip(body.page, 100), utm_source: clip(body.utm_source, 100), utm_medium: clip(body.utm_medium, 100), utm_campaign: clip(body.utm_campaign, 150),
  }
}

export const POST = handle(async (request) => {
  const body = await readJson(request)
  // Honeypot: real visitors never fill the hidden "website" field.
  if (body.website) return json({ ok: true })
  const row = validateLead(body)

  const db = supabaseAdmin()
  // Same number in the last 10 minutes: treat as a double submit.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { data: recent, error: readErr } = await db.from('leads').select('id').eq('phone', row.phone).gte('created_at', since).limit(1)
  if (readErr) throw readErr
  if (recent?.length) return json({ ok: true, duplicate: true })

  const { error } = await db.from('leads').insert(row)
  if (error) throw error
  return json({ ok: true })
})
