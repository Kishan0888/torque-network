import { describe, it, expect, vi, beforeEach } from 'vitest'

// Shared in-memory subscriptions table for cancel + me.
const state = { rows: [], entitledAny: false }

vi.mock('../api/_lib/auth.js', () => ({
  requireUser: async () => ({ id: 'user-1', email: 'a@example.com' }),
  isEntitled: async () => state.entitledAny,
}))

function table() {
  const filters = []
  const q = {
    select() { return q }, order() { return q },
    eq() { return q },
    in(col, values) { filters.push((r) => values.includes(r[col])); return q },
    neq(col, value) { filters.push((r) => r[col] !== value); return q },
    update(values) { q._update = values; return q },
    then(res, rej) {
      const data = state.rows.filter((r) => filters.every((f) => f(r)))
      return Promise.resolve({ data, error: null }).then(res, rej)
    },
  }
  return q
}
vi.mock('../api/_lib/supabaseAdmin.js', () => ({ supabaseAdmin: () => ({ from: () => table() }) }))

const razorpay = { cancelSubscription: vi.fn() }
vi.mock('../api/_lib/razorpay.js', () => ({ razorpay, RazorpayError: class extends Error {} }))
const syncSubscription = vi.fn()
vi.mock('../api/_lib/sync.js', () => ({ syncSubscription: (...a) => syncSubscription(...a) }))

process.env.RAZORPAY_PLAN_ID = 'plan_IG'
process.env.RAZORPAY_LINKEDIN_PLAN_ID = 'plan_LI'
const cancel = (await import('../api/subscriptions/cancel.js')).POST
const me = (await import('../api/subscriptions/me.js')).GET

const future = new Date(Date.now() + 10 * 864e5).toISOString()
const IG = { razorpay_subscription_id: 'sub_ig', razorpay_plan_id: 'plan_IG', status: 'active', current_end: future, cancel_at_cycle_end: false, created_at: '2026-10-01T00:00:00Z' }
const LI = { razorpay_subscription_id: 'sub_li', razorpay_plan_id: 'plan_LI', status: 'active', current_end: future, cancel_at_cycle_end: false, created_at: '2026-10-20T00:00:00Z' }

beforeEach(() => {
  state.rows = []
  state.entitledAny = false
  process.env.RAZORPAY_LINKEDIN_PLAN_ID = 'plan_LI'
  razorpay.cancelSubscription.mockReset().mockResolvedValue({})
  syncSubscription.mockReset().mockImplementation(async (id) => ({ ...state.rows.find((r) => r.razorpay_subscription_id === id) }))
})

const post = (body) => cancel(new Request('https://x.test', { method: 'POST', ...(body ? { body: JSON.stringify(body) } : {}) }))

describe('POST /api/subscriptions/cancel — per product', () => {
  it('cancels only the LinkedIn subscription when product is "linkedin" (even though it is newest)', async () => {
    state.rows = [LI, IG]
    const res = await post({ product: 'linkedin' })
    expect(res.status).toBe(200)
    expect(razorpay.cancelSubscription).toHaveBeenCalledTimes(1)
    expect(razorpay.cancelSubscription).toHaveBeenCalledWith('sub_li', true)
  })

  it('with no body, cancels the Instagram subscription (existing behaviour), never LinkedIn', async () => {
    state.rows = [LI, IG]
    const res = await post()
    expect(res.status).toBe(200)
    expect(razorpay.cancelSubscription).toHaveBeenCalledWith('sub_ig', true)
    expect(razorpay.cancelSubscription).not.toHaveBeenCalledWith('sub_li', expect.anything())
  })

  it('404s when the chosen product has nothing to cancel', async () => {
    state.rows = [IG]
    expect((await post({ product: 'linkedin' })).status).toBe(404)
    expect(razorpay.cancelSubscription).not.toHaveBeenCalled()
  })
})

describe('GET /api/subscriptions/me — per product', () => {
  const get = async () => (await me(new Request('https://x.test', { headers: { Authorization: 'Bearer t' } }))).json()

  it('reports each membership separately and keeps the original fields', async () => {
    state.rows = [LI, IG]
    state.entitledAny = true
    const body = await get()
    expect(body.entitled).toBe(true)
    expect(body.subscription.status).toBe('active')
    expect(body.products.instagram).toMatchObject({ available: true, entitled: true, subscription: { status: 'active' } })
    expect(body.products.linkedin).toMatchObject({ available: true, entitled: true, subscription: { status: 'active' } })
    expect(body.products.linkedin.subscription).not.toHaveProperty('razorpay_plan_id')
  })

  it('LinkedIn-only member is not shown as an Instagram member', async () => {
    state.rows = [LI]
    const body = await get()
    expect(body.products.instagram).toMatchObject({ entitled: false, subscription: null })
    expect(body.products.linkedin.entitled).toBe(true)
  })

  it('marks LinkedIn unavailable until RAZORPAY_LINKEDIN_PLAN_ID is set', async () => {
    delete process.env.RAZORPAY_LINKEDIN_PLAN_ID
    const body = await get()
    expect(body.products.linkedin.available).toBe(false)
    expect(body.products.instagram.available).toBe(true)
  })
})
