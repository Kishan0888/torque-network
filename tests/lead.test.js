import { describe, it, expect, vi, beforeEach } from 'vitest'

const rows = []
function from() {
  const f = []
  const api = {
    select() { return api }, eq(c, v) { f.push((r) => r[c] === v); return api }, gte(c, v) { f.push((r) => r[c] >= v); return api },
    limit() { return api },
    insert: async (row) => { rows.push({ ...row, created_at: new Date().toISOString() }); return { error: null } },
    then(res, rej) { return Promise.resolve({ data: rows.filter((r) => f.every((fn) => fn(r))), error: null }).then(res, rej) },
  }
  return api
}
vi.mock('../api/_lib/supabaseAdmin.js', () => ({ supabaseAdmin: () => ({ from }) }))
const { POST, validateLead } = await import('../api/lead.js')

const post = async (body) => {
  const r = await POST(new Request('https://x.test/api/lead', { method: 'POST', body: JSON.stringify(body) }))
  return { status: r.status, body: await r.json() }
}
const good = { name: 'Priya Sharma', phone: '+91 98765 43210', email: 'Priya@Example.com', industry: 'Marketing & Creative', experience: '1–3 yrs', profile_url: 'https://www.linkedin.com/in/priya', utm_source: 'meta', utm_campaign: 'nov' }

beforeEach(() => { rows.length = 0 })

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
    expect(rows).toHaveLength(0)
  })

  it('saves a valid lead; a double-submit within 10 minutes is not saved twice', async () => {
    expect((await post(good)).status).toBe(200)
    expect((await post(good)).body).toMatchObject({ ok: true, duplicate: true })
    expect(rows).toHaveLength(1)
  })

  it('silently drops bots that fill the hidden field', async () => {
    expect((await post({ ...good, website: 'spam.com' })).status).toBe(200)
    expect(rows).toHaveLength(0)
  })

  it('email, profile link and "Other" industry are optional', async () => {
    expect((await post({ name: 'Rohan', phone: '9876500000', industry: 'Other', experience: '0–1 yrs' })).status).toBe(200)
  })
})
