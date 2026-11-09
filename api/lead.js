/**
 * /api/lead — lead form + checkout on public landing pages (no login needed).
 *
 * POST (no action)     { name, phone, email?, industry?, experience?, profile_url?, page?,
 *                        utm_source?, utm_medium?, utm_campaign?, website (honeypot) }
 *                      → saves the lead immediately, returns { lead_id, token }.
 * POST ?action=checkout { lead_id, token, email }
 *                      → finds or creates the account for that email and starts the
 *                        Razorpay subscription (same rules as /api/subscriptions/create).
 * POST ?action=verify   { lead_id, token, razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
 *                      → verifies the payment, marks the lead paid.
 * POST ?action=claim    { lead_id, token, password }
 *                      → for an account created at this checkout: sets its password once
 *                        and returns a session so the buyer lands in the dashboard.
 *
 * `token` is an HMAC of the lead id handed only to the browser that submitted the
 * form, so nobody else can drive checkout or claim the account for that lead.
 */
import crypto from 'node:crypto'
import { handle, json, readJson, HttpError } from './_lib/http.js'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { supabaseConfig, razorpayConfig } from './_lib/env.js'
import { startCheckout } from './_lib/checkout.js'
import { verifyCheckoutSignature } from './_lib/signatures.js'
import { syncSubscription } from './_lib/sync.js'
import { entitlements } from './_lib/members.js'
import { DOMAINS, EXPERIENCE, normalizeProfile } from '../shared/memberConfig.js'

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/
const UUID = /^[0-9a-f-]{36}$/i
const CREATED_VIA = 'landing_lead'
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

// ── lead token ─────────────────────────────────────────────────────────────
const tokenFor = (leadId) =>
  crypto.createHmac('sha256', supabaseConfig().serviceRoleKey).update(`lead:${leadId}`).digest('hex')

export function leadToken(leadId) { return tokenFor(leadId) }

async function loadLead(body) {
  const id = String(body.lead_id || '')
  const token = String(body.token || '')
  if (!UUID.test(id) || !/^[0-9a-f]{64}$/.test(token)) throw new HttpError(400, 'Your session expired. Please fill the form again.')
  const expected = Buffer.from(tokenFor(id), 'hex')
  if (!crypto.timingSafeEqual(expected, Buffer.from(token, 'hex'))) throw new HttpError(403, 'Your session expired. Please fill the form again.')
  const { data, error } = await supabaseAdmin().from('leads').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) throw new HttpError(404, 'Your session expired. Please fill the form again.')
  return data
}

async function accountByEmail(email) {
  const { data, error } = await supabaseAdmin().rpc('lead_account_by_email', { p_email: email })
  if (error) throw error
  return (Array.isArray(data) ? data[0] : data) || null
}

const canClaim = (acct) => Boolean(acct && acct.created_via === CREATED_VIA && !acct.has_password)

// ── actions ────────────────────────────────────────────────────────────────
async function createLead(body) {
  // Honeypot: real visitors never fill the hidden "website" field.
  if (body.website) return { ok: true }
  const row = validateLead(body)
  const db = supabaseAdmin()

  // Same number in the last 10 minutes: a double submit — reuse that lead.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { data: recent, error: readErr } = await db.from('leads').select('id').eq('phone', row.phone).gte('created_at', since).limit(1)
  if (readErr) throw readErr
  if (recent?.length) {
    const id = recent[0].id
    const patch = Object.fromEntries(Object.entries(row).filter(([, v]) => v !== null))
    await db.from('leads').update(patch).eq('id', id)
    return { ok: true, duplicate: true, lead_id: id, token: tokenFor(id) }
  }

  const { data, error } = await db.from('leads').insert(row).select('id').single()
  if (error) throw error
  return { ok: true, lead_id: data.id, token: tokenFor(data.id) }
}

async function checkout(body) {
  const lead = await loadLead(body)
  if (lead.platform !== 'linkedin') throw new HttpError(400, 'Checkout is not available for this page.')
  const email = clip(body.email, 254)?.toLowerCase()
  if (!email || !EMAIL.test(email)) throw new HttpError(400, 'Please enter a valid email address — your login and receipts go here.')
  const db = supabaseAdmin()

  let acct = await accountByEmail(email)
  let userId = acct?.id
  if (userId) {
    const ent = await entitlements(userId)
    if (ent.linkedin) throw new HttpError(409, 'This email already has an active LinkedIn membership. Log in to open your dashboard.', { code: 'already_member' })
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email,
      email_confirm: false, // confirmed when they set a password after paying
      user_metadata: { full_name: lead.name, phone: lead.phone, selected_plan: 'linkedin' },
      app_metadata: { created_via: CREATED_VIA },
    })
    if (error) {
      // Created in a parallel request a moment ago.
      acct = await accountByEmail(email)
      if (!acct) throw error
      userId = acct.id
    } else userId = data.user.id
  }

  const { error: upErr } = await db.from('leads')
    .update({ email, user_id: userId, checkout_started_at: new Date().toISOString() })
    .eq('id', lead.id)
  if (upErr) throw upErr

  const result = await startCheckout({ id: userId, email }, 'linkedin', { lead_id: lead.id })
  return { ...result, prefill: { name: lead.name, email, contact: lead.phone } }
}

async function verify(body) {
  const lead = await loadLead(body)
  if (!lead.user_id) throw new HttpError(400, 'Payment not started.')
  const paymentId = String(body.razorpay_payment_id || '')
  const claimedId = String(body.razorpay_subscription_id || '')
  const signature = String(body.razorpay_signature || '')
  if (!paymentId || !claimedId || !signature) throw new HttpError(400, 'Missing payment details.')

  const db = supabaseAdmin()
  const { data: row, error } = await db.from('subscriptions').select('razorpay_subscription_id')
    .eq('user_id', lead.user_id).eq('razorpay_subscription_id', claimedId).maybeSingle()
  if (error) throw error
  if (!row) throw new HttpError(404, 'Subscription not found.')
  const { keySecret } = razorpayConfig()
  if (!verifyCheckoutSignature({ paymentId, subscriptionId: row.razorpay_subscription_id, signature, keySecret })) {
    throw new HttpError(400, 'Payment signature could not be verified.')
  }
  await syncSubscription(row.razorpay_subscription_id)
  const ent = await entitlements(lead.user_id)
  if (ent.linkedin && !lead.paid_at) {
    await db.from('leads').update({ paid_at: new Date().toISOString(), status: 'converted' }).eq('id', lead.id)
  }
  const acct = await accountByEmail(lead.email)
  return {
    verified: true,
    entitled: Boolean(ent.linkedin),
    email: lead.email,
    account: canClaim(acct) && acct.id === lead.user_id ? 'set_password' : 'login',
  }
}

async function claim(body) {
  const lead = await loadLead(body)
  const password = String(body.password || '')
  if (password.length < 8) throw new HttpError(400, 'Use at least 8 characters for your password.')
  if (password.length > 72) throw new HttpError(400, 'Use at most 72 characters for your password.')
  if (!lead.user_id || !lead.email) throw new HttpError(400, 'Payment not started.')
  const ent = await entitlements(lead.user_id)
  if (!ent.linkedin) throw new HttpError(402, 'We have not received your payment yet.')
  const acct = await accountByEmail(lead.email)
  if (!canClaim(acct) || acct.id !== lead.user_id) {
    throw new HttpError(409, 'Your account already has a password. Log in to continue.', { code: 'use_login' })
  }

  const db = supabaseAdmin()
  const { error } = await db.auth.admin.updateUserById(lead.user_id, { password, email_confirm: true })
  if (error) throw new HttpError(400, error.message)
  await db.from('leads').update({ account_claimed_at: new Date().toISOString() }).eq('id', lead.id)

  // Sign them straight in (same as typing the password on /login).
  const { url, serviceRoleKey } = supabaseConfig()
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: serviceRoleKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: lead.email, password }),
  }).catch(() => null)
  const s = r?.ok ? await r.json() : null
  return {
    ok: true,
    email: lead.email,
    session: s?.access_token ? { access_token: s.access_token, refresh_token: s.refresh_token, expires_in: s.expires_in, expires_at: s.expires_at, token_type: s.token_type || 'bearer' } : null,
  }
}

export const POST = handle(async (request) => {
  const body = await readJson(request)
  switch (new URL(request.url).searchParams.get('action')) {
    case null:
    case '': return json(await createLead(body))
    case 'checkout': return json(await checkout(body))
    case 'verify': return json(await verify(body))
    case 'claim': return json(await claim(body))
    default: throw new HttpError(404, 'Unknown action.')
  }
})
