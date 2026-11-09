import crypto from 'node:crypto'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── in-memory Supabase ─────────────────────────────────────────────────────
const db = { leads: [], subscriptions: [], users: [] }
let nextId = 1
const uuid = () => `00000000-0000-4000-8000-${String(nextId++).padStart(12, '0')}`

function from(table) {
  const f = []
  let op = 'select'
  let payload
  const rows = () => db[table].filter((r) => f.every((fn) => fn(r)))
  const run = () => {
    if (op === 'update') { rows().forEach((r) => Object.assign(r, payload)); return { data: null, error: null } }
    return { data: rows(), error: null }
  }
  const api = {
    select() { return api }, limit() { return api },
    eq(c, v) { f.push((r) => r[c] === v); return api },
    gte(c, v) { f.push((r) => r[c] >= v); return api },
    insert(row) {
      const r = { id: uuid(), status: 'new', created_at: new Date().toISOString(), ...row }
      db[table].push(r)
      return { select: () => ({ single: async () => ({ data: r, error: null }) }), then: (res) => Promise.resolve({ error: null }).then(res) }
    },
    update(p) { op = 'update'; payload = p; return api },
    maybeSingle: async () => ({ data: rows()[0] || null, error: null }),
    then(res, rej) { return Promise.resolve(run()).then(res, rej) },
  }
  return api
}
const admin = {
  createUser: vi.fn(async ({ email, app_metadata }) => {
    const u = { id: uuid(), email, has_password: false, created_via: app_metadata?.created_via }
    db.users.push(u)
    return { data: { user: u }, error: null }
  }),
  updateUserById: vi.fn(async (id, { password }) => {
    const u = db.users.find((x) => x.id === id); u.has_password = Boolean(password); return { data: { user: u }, error: null }
  }),
}
const rpc = async (_fn, { p_email }) => {
  const u = db.users.find((x) => x.email === p_email.toLowerCase())
  return { data: u ? [{ id: u.id, has_password: u.has_password, created_via: u.created_via ?? null, email_confirmed: true }] : [], error: null }
}
vi.mock('../api/_lib/supabaseAdmin.js', () => ({ supabaseAdmin: () => ({ from, rpc, auth: { admin } }) }))

const paid = new Set()
vi.mock('../api/_lib/members.js', () => ({ entitlements: async (id) => ({ linkedin: paid.has(id), instagram: false, rows: [] }) }))
const startCheckout = vi.fn(async (user) => {
  db.subscriptions.push({ user_id: user.id, razorpay_subscription_id: 'sub_1' })
  return { keyId: 'rzp_test_x', subscriptionId: 'sub_1', prefill: {} }
})
vi.mock('../api/_lib/checkout.js', () => ({ startCheckout: (...a) => startCheckout(...a) }))
vi.mock('../api/_lib/sync.js', () => ({ syncSubscription: async () => { db.subscriptions.forEach((s) => paid.add(s.user_id)) } }))

process.env.SUPABASE_URL = 'https://sb.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
process.env.RAZORPAY_KEY_ID = 'rzp_test_x'
process.env.RAZORPAY_KEY_SECRET = 'rzp-secret'
const { POST, validateLead } = await import('../api/lead.js')

const post = async (body, action = '') => {
  const r = await POST(new Request(`https://x.test/api/lead${action ? `?action=${action}` : ''}`, { method: 'POST', body: JSON.stringify(body) }))
  return { status: r.status, body: await r.json() }
}
const good = { name: 'Priya Sharma', phone: '+91 98765 43210', email: 'Priya@Example.com', industry: 'Marketing & Creative', experience: '1–3 yrs', profile_url: 'https://www.linkedin.com/in/priya', utm_source: 'meta', utm_campaign: 'nov' }
const sign = (pay, sub) => crypto.createHmac('sha256', 'rzp-secret').update(`${pay}|${sub}`).digest('hex')

beforeEach(() => {
  db.leads.length = 0; db.subscriptions.length = 0; db.users.length = 0; paid.clear()
  admin.createUser.mockClear(); admin.updateUserById.mockClear(); startCheckout.mockClear()
  globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({ access_token: 'at', refresh_token: 'rt', expires_in: 3600, expires_at: 1, token_type: 'bearer' })))
})

describe('landing-page lead form', () => {
  it('normalises phone and email, keeps UTM', () => {
    expect(validateLead(good)).toMatchObject({ phone: '+919876543210', email: 'priya@example.com', platform: 'linkedin', utm_source: 'meta' })
    expect(validateLead({ ...good, phone: '09876543210' }).phone).toBe('+919876543210')
  })

  it.each([
    [{ name: 'P' }, /full name/],
    [{ phone: '12345' }, /mobile number/],
    [{ phone: '1234567890' }, /mobile number/], // Indian mobiles start 6–9
    [{ email: 'not-an-email' }, /email/],
    [{ industry: 'Astrology' }, /industry/],
    [{ experience: '20 yrs' }, /experience/],
    [{ profile_url: 'https://evil.com/in/x' }, /LinkedIn profile/],
  ])('rejects %j', async (patch, msg) => {
    const r = await post({ ...good, ...patch })
    expect(r.status).toBe(400)
    expect(r.body.error).toMatch(msg)
    expect(db.leads).toHaveLength(0)
  })

  it('saves the lead immediately and returns a checkout token; a double-submit reuses the same lead', async () => {
    const a = await post(good)
    expect(a.status).toBe(200)
    expect(a.body.lead_id).toBeTruthy()
    expect(a.body.token).toMatch(/^[0-9a-f]{64}$/)
    const b = await post(good)
    expect(b.body).toMatchObject({ duplicate: true, lead_id: a.body.lead_id })
    expect(db.leads).toHaveLength(1)
  })

  it('silently drops bots that fill the hidden field', async () => {
    expect((await post({ ...good, website: 'spam.com' })).status).toBe(200)
    expect(db.leads).toHaveLength(0)
  })

  it('email, profile link and "Other" industry are optional', async () => {
    expect((await post({ name: 'Rohan', phone: '9876500000', industry: 'Other', experience: '0–1 yrs' })).status).toBe(200)
  })
})

describe('landing-page checkout', () => {
  async function newLead(extra = {}) {
    const { body } = await post({ ...good, ...extra })
    return { lead_id: body.lead_id, token: body.token }
  }

  it('rejects a forged token and does nothing', async () => {
    const t = await newLead()
    const r = await post({ ...t, token: 'f'.repeat(64), email: 'a@b.co' }, 'checkout')
    expect(r.status).toBe(403)
    expect(admin.createUser).not.toHaveBeenCalled()
  })

  it('requires an email at the payment step', async () => {
    const t = await newLead({ email: '' })
    expect((await post({ ...t, email: '' }, 'checkout')).status).toBe(400)
  })

  it('full flow: form → checkout creates the account → verify marks paid → claim sets password and signs in', async () => {
    const t = await newLead()
    const co = await post({ ...t, email: 'Priya@Example.com' }, 'checkout')
    expect(co.status).toBe(200)
    expect(co.body).toMatchObject({ subscriptionId: 'sub_1', prefill: { name: 'Priya Sharma', email: 'priya@example.com', contact: '+919876543210' } })
    expect(admin.createUser).toHaveBeenCalledWith(expect.objectContaining({ email: 'priya@example.com', email_confirm: false, app_metadata: { created_via: 'landing_lead' } }))
    expect(db.leads[0]).toMatchObject({ email: 'priya@example.com', user_id: db.users[0].id })
    expect(db.leads[0].checkout_started_at).toBeTruthy()
    expect(db.leads[0].paid_at).toBeUndefined() // lead kept even if they never pay

    // Claim before paying is refused.
    expect((await post({ ...t, password: 'longenough' }, 'claim')).status).toBe(402)

    const bad = await post({ ...t, razorpay_payment_id: 'pay_1', razorpay_subscription_id: 'sub_1', razorpay_signature: 'ab'.repeat(32) }, 'verify')
    expect(bad.status).toBe(400)
    const v = await post({ ...t, razorpay_payment_id: 'pay_1', razorpay_subscription_id: 'sub_1', razorpay_signature: sign('pay_1', 'sub_1') }, 'verify')
    expect(v.body).toMatchObject({ verified: true, entitled: true, account: 'set_password', email: 'priya@example.com' })
    expect(db.leads[0]).toMatchObject({ status: 'converted' })
    expect(db.leads[0].paid_at).toBeTruthy()

    expect((await post({ ...t, password: 'short' }, 'claim')).status).toBe(400)
    const c = await post({ ...t, password: 'longenough' }, 'claim')
    expect(c.body).toMatchObject({ ok: true, session: { access_token: 'at', refresh_token: 'rt' } })
    expect(admin.updateUserById).toHaveBeenCalledWith(db.users[0].id, { password: 'longenough', email_confirm: true })
    // Only once.
    expect((await post({ ...t, password: 'another-one' }, 'claim')).body.code).toBe('use_login')
  })

  it('existing account with a password: payment attaches to it, buyer is told to log in, password can never be set from here', async () => {
    db.users.push({ id: 'existing-1', email: 'old@user.in', has_password: true, created_via: null })
    const t = await newLead({ email: 'old@user.in' })
    expect((await post({ ...t, email: 'old@user.in' }, 'checkout')).status).toBe(200)
    expect(admin.createUser).not.toHaveBeenCalled()
    const v = await post({ ...t, razorpay_payment_id: 'p', razorpay_subscription_id: 'sub_1', razorpay_signature: sign('p', 'sub_1') }, 'verify')
    expect(v.body.account).toBe('login')
    expect((await post({ ...t, password: 'longenough' }, 'claim')).status).toBe(409)
    expect(admin.updateUserById).not.toHaveBeenCalled()
  })

  it('Google-only account (no password, not created here) cannot be claimed', async () => {
    db.users.push({ id: 'google-1', email: 'g@user.in', has_password: false, created_via: null })
    const t = await newLead({ email: 'g@user.in' })
    await post({ ...t, email: 'g@user.in' }, 'checkout')
    await post({ ...t, razorpay_payment_id: 'p', razorpay_subscription_id: 'sub_1', razorpay_signature: sign('p', 'sub_1') }, 'verify')
    expect((await post({ ...t, password: 'longenough' }, 'claim')).status).toBe(409)
  })

  it('already an active LinkedIn member → told to log in, no new subscription', async () => {
    db.users.push({ id: 'member-1', email: 'm@user.in', has_password: true })
    paid.add('member-1')
    const t = await newLead()
    const r = await post({ ...t, email: 'm@user.in' }, 'checkout')
    expect(r.status).toBe(409)
    expect(r.body.code).toBe('already_member')
    expect(startCheckout).not.toHaveBeenCalled()
  })
})
