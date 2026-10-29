import { describe, it, expect, vi, beforeEach } from 'vitest'

const state = { rows: [], fresh: {}, profile: { full_name: 'A', phone: '9999999999' }, inserted: [] }

vi.mock('../api/_lib/auth.js', () => ({
  requireUser: async () => ({ id: 'user-1', email: 'a@example.com' }),
}))

function table(name) {
  const q = {
    select() { return q }, eq() { return q }, in() { return q },
    maybeSingle: async () => ({ data: name === 'profiles' ? state.profile : null, error: null }),
    insert: async (row) => { state.inserted.push(row); return { error: null } },
    then(res, rej) { return Promise.resolve({ data: state.rows, error: null }).then(res, rej) },
  }
  return q
}
vi.mock('../api/_lib/supabaseAdmin.js', () => ({ supabaseAdmin: () => ({ from: (n) => table(n) }) }))

const razorpay = { createSubscription: vi.fn(), cancelSubscription: vi.fn() }
vi.mock('../api/_lib/razorpay.js', () => ({ razorpay, RazorpayError: class extends Error {} }))
const syncSubscription = vi.fn()
vi.mock('../api/_lib/sync.js', () => ({ syncSubscription: (...a) => syncSubscription(...a) }))

process.env.RAZORPAY_KEY_ID = 'rzp_test_abc'
process.env.RAZORPAY_KEY_SECRET = 'secret'
process.env.RAZORPAY_PLAN_ID = 'plan_IG'
process.env.RAZORPAY_LINKEDIN_PLAN_ID = 'plan_LI'
const { POST } = await import('../api/subscriptions/create.js')

const call = async (body) => {
  const init = { method: 'POST' }
  if (body !== undefined) init.body = JSON.stringify(body)
  const r = await POST(new Request('https://x.test', init))
  return { status: r.status, body: await r.json() }
}
const future = new Date(Date.now() + 10 * 864e5).toISOString()

beforeEach(() => {
  Object.assign(state, { rows: [], fresh: {}, inserted: [] })
  process.env.RAZORPAY_LINKEDIN_PLAN_ID = 'plan_LI'
  razorpay.createSubscription.mockReset().mockImplementation(async ({ plan_id }) => ({ id: `sub_new_${plan_id}`, plan_id, status: 'created' }))
  razorpay.cancelSubscription.mockReset().mockResolvedValue({})
  syncSubscription.mockReset().mockImplementation(async (id) => state.fresh[id] ?? null)
})

describe('POST /api/subscriptions/create — Instagram (existing behaviour)', () => {
  it('with no body, uses the Instagram plan (RAZORPAY_PLAN_ID) and returns checkout details', async () => {
    const { status, body } = await call()
    expect(status).toBe(200)
    expect(body).toEqual({ keyId: 'rzp_test_abc', subscriptionId: 'sub_new_plan_IG', prefill: { name: 'A', email: 'a@example.com', contact: '9999999999' } })
    expect(razorpay.createSubscription).toHaveBeenCalledWith(expect.objectContaining({ plan_id: 'plan_IG', notes: expect.objectContaining({ user_id: 'user-1', product: 'instagram' }) }))
    expect(state.inserted).toHaveLength(1)
  })

  it('product "instagram" uses the Instagram plan', async () => {
    const { body } = await call({ product: 'instagram' })
    expect(body.subscriptionId).toBe('sub_new_plan_IG')
  })

  it('refuses when the user already has an active Instagram membership', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_a', razorpay_plan_id: 'plan_IG', status: 'active', current_end: future }]
    const { status, body } = await call({ product: 'instagram' })
    expect(status).toBe(409)
    expect(body.code).toBe('already_member')
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('treats subscriptions on any non-LinkedIn plan as Instagram (legacy rows)', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_old', razorpay_plan_id: 'plan_OLD', status: 'active', current_end: future }]
    const { status } = await call()
    expect(status).toBe(409)
  })

  it('refuses when a subscription is in progress (fresh Razorpay status), without cancelling anything', async () => {
    state.rows = [
      { razorpay_subscription_id: 'sub_h', razorpay_plan_id: 'plan_IG', status: 'halted' },
      { razorpay_subscription_id: 'sub_c', razorpay_plan_id: 'plan_IG', status: 'created' },
    ]
    state.fresh = { sub_h: { status: 'halted', razorpay_plan_id: 'plan_IG' }, sub_c: { status: 'authenticated', razorpay_plan_id: 'plan_IG' } }
    const { status, body } = await call()
    expect(status).toBe(409)
    expect(body.code).toBe('subscription_in_progress')
    expect(razorpay.cancelSubscription).not.toHaveBeenCalled()
  })

  it('reuses an unpaid "created" subscription for the same plan', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_c', razorpay_plan_id: 'plan_IG', status: 'created' }]
    state.fresh = { sub_c: { status: 'created', razorpay_plan_id: 'plan_IG' } }
    const { body } = await call()
    expect(body.subscriptionId).toBe('sub_c')
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('cancels halted subscriptions, then creates a new one', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_h', razorpay_plan_id: 'plan_IG', status: 'halted' }]
    state.fresh = { sub_h: { status: 'halted', razorpay_plan_id: 'plan_IG' } }
    const { status, body } = await call()
    expect(status).toBe(200)
    expect(razorpay.cancelSubscription).toHaveBeenCalledWith('sub_h', false)
    expect(body.subscriptionId).toBe('sub_new_plan_IG')
  })
})

describe('POST /api/subscriptions/create — LinkedIn (separate plan)', () => {
  it('product "linkedin" uses RAZORPAY_LINKEDIN_PLAN_ID', async () => {
    const { status, body } = await call({ product: 'linkedin' })
    expect(status).toBe(200)
    expect(body.subscriptionId).toBe('sub_new_plan_LI')
    expect(razorpay.createSubscription).toHaveBeenCalledWith(expect.objectContaining({ plan_id: 'plan_LI', notes: expect.objectContaining({ product: 'linkedin' }) }))
  })

  it('an active Instagram membership does not block LinkedIn, and vice versa', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_ig', razorpay_plan_id: 'plan_IG', status: 'active', current_end: future }]
    expect((await call({ product: 'linkedin' })).status).toBe(200)

    state.rows = [{ razorpay_subscription_id: 'sub_li', razorpay_plan_id: 'plan_LI', status: 'active', current_end: future }]
    expect((await call({ product: 'instagram' })).status).toBe(200)
  })

  it('never reuses or cancels the other product’s subscriptions', async () => {
    state.rows = [
      { razorpay_subscription_id: 'sub_ig_created', razorpay_plan_id: 'plan_IG', status: 'created' },
      { razorpay_subscription_id: 'sub_ig_halted', razorpay_plan_id: 'plan_IG', status: 'halted' },
    ]
    state.fresh = { sub_ig_created: { status: 'created', razorpay_plan_id: 'plan_IG' }, sub_ig_halted: { status: 'halted', razorpay_plan_id: 'plan_IG' } }
    const { body } = await call({ product: 'linkedin' })
    expect(body.subscriptionId).toBe('sub_new_plan_LI')
    expect(syncSubscription).not.toHaveBeenCalled()
    expect(razorpay.cancelSubscription).not.toHaveBeenCalled()
  })

  it('refuses when an active LinkedIn membership exists', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_li', razorpay_plan_id: 'plan_LI', status: 'active', current_end: future }]
    const { status } = await call({ product: 'linkedin' })
    expect(status).toBe(409)
  })

  it('returns 503 (not configured) when RAZORPAY_LINKEDIN_PLAN_ID is missing', async () => {
    delete process.env.RAZORPAY_LINKEDIN_PLAN_ID
    const { status } = await call({ product: 'linkedin' })
    expect(status).toBe(503)
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('rejects unknown products and never accepts a plan id from the browser', async () => {
    expect((await call({ product: 'plan_LI' })).status).toBe(400)
    expect((await call({ product: 'youtube' })).status).toBe(400)
    await call({ product: 'instagram', plan_id: 'plan_EVIL' })
    expect(razorpay.createSubscription).toHaveBeenLastCalledWith(expect.objectContaining({ plan_id: 'plan_IG' }))
  })
})
