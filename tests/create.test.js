import { describe, it, expect, vi, beforeEach } from 'vitest'

const state = { entitled: false, rows: [], fresh: {}, profile: { full_name: 'A', phone: '9999999999' }, inserted: [] }

vi.mock('../api/_lib/auth.js', () => ({
  requireUser: async () => ({ id: 'user-1', email: 'a@example.com' }),
  isEntitled: async () => state.entitled,
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
process.env.RAZORPAY_PLAN_ID = 'plan_A'
const { POST } = await import('../api/subscriptions/create.js')
const call = async () => { const r = await POST(new Request('https://x.test', { method: 'POST' })); return { status: r.status, body: await r.json() } }

beforeEach(() => {
  Object.assign(state, { entitled: false, rows: [], fresh: {}, inserted: [] })
  razorpay.createSubscription.mockReset().mockResolvedValue({ id: 'sub_new', plan_id: 'plan_A', status: 'created' })
  razorpay.cancelSubscription.mockReset().mockResolvedValue({})
  syncSubscription.mockReset().mockImplementation(async (id) => state.fresh[id] ?? null)
})

describe('POST /api/subscriptions/create', () => {
  it('creates a new subscription and returns checkout details with profile prefill', async () => {
    const { status, body } = await call()
    expect(status).toBe(200)
    expect(body).toEqual({ keyId: 'rzp_test_abc', subscriptionId: 'sub_new', prefill: { name: 'A', email: 'a@example.com', contact: '9999999999' } })
    expect(state.inserted).toHaveLength(1)
    expect(razorpay.createSubscription).toHaveBeenCalledWith(expect.objectContaining({ plan_id: 'plan_A', notes: expect.objectContaining({ user_id: 'user-1' }) }))
  })

  it('refuses when the user is already entitled', async () => {
    state.entitled = true
    const { status, body } = await call()
    expect(status).toBe(409)
    expect(body.code).toBe('already_member')
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('refuses when a subscription is in progress (fresh Razorpay status), without cancelling anything', async () => {
    state.rows = [
      { razorpay_subscription_id: 'sub_h', razorpay_plan_id: 'plan_A', status: 'halted' },
      { razorpay_subscription_id: 'sub_c', razorpay_plan_id: 'plan_A', status: 'created' },
    ]
    state.fresh = { sub_h: { status: 'halted', razorpay_plan_id: 'plan_A' }, sub_c: { status: 'authenticated', razorpay_plan_id: 'plan_A' } }
    const { status, body } = await call()
    expect(status).toBe(409)
    expect(body.code).toBe('subscription_in_progress')
    expect(razorpay.cancelSubscription).not.toHaveBeenCalled()
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('reuses an unpaid "created" subscription for the same plan', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_c', razorpay_plan_id: 'plan_A', status: 'created' }]
    state.fresh = { sub_c: { status: 'created', razorpay_plan_id: 'plan_A' } }
    const { status, body } = await call()
    expect(status).toBe(200)
    expect(body.subscriptionId).toBe('sub_c')
    expect(razorpay.createSubscription).not.toHaveBeenCalled()
  })

  it('cancels halted subscriptions, then creates a new one', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_h', razorpay_plan_id: 'plan_A', status: 'halted' }]
    state.fresh = { sub_h: { status: 'halted', razorpay_plan_id: 'plan_A' } }
    const { status, body } = await call()
    expect(status).toBe(200)
    expect(razorpay.cancelSubscription).toHaveBeenCalledWith('sub_h', false)
    expect(body.subscriptionId).toBe('sub_new')
  })

  it('does not reuse a "created" subscription for a different plan', async () => {
    state.rows = [{ razorpay_subscription_id: 'sub_old', razorpay_plan_id: 'plan_OLD', status: 'created' }]
    state.fresh = { sub_old: { status: 'created', razorpay_plan_id: 'plan_OLD' } }
    const { body } = await call()
    expect(body.subscriptionId).toBe('sub_new')
  })
})
