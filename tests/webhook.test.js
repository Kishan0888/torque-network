import crypto from 'node:crypto'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---- In-memory stand-in for the razorpay_webhook_events table -------------
const events = new Map()

function eventsTable() {
  const q = { _filter: null, _update: null, _upsert: null }
  const run = () => {
    if (q._upsert) {
      const { row, ignoreDuplicates } = q._upsert
      if (events.has(row.event_id)) return { data: ignoreDuplicates ? [] : [row], error: null }
      events.set(row.event_id, { attempts: 1, processed_at: null, last_error: null, ...row })
      return { data: [{ event_id: row.event_id }], error: null }
    }
    if (q._update) {
      const existing = events.get(q._filter)
      if (existing) Object.assign(existing, q._update)
      return { data: null, error: null }
    }
    return { data: events.get(q._filter) ?? null, error: events.has(q._filter) ? null : { message: 'not found' } }
  }
  const api = {
    upsert(row, opts) { q._upsert = { row, ignoreDuplicates: opts?.ignoreDuplicates }; return api },
    update(values) { q._update = values; return api },
    select() { return api },
    eq(_col, value) { q._filter = value; return api },
    single() { return Promise.resolve(run()) },
    then(resolve, reject) { return Promise.resolve(run()).then(resolve, reject) },
  }
  return api
}

vi.mock('../api/_lib/supabaseAdmin.js', () => ({
  supabaseAdmin: () => ({ from: () => eventsTable() }),
}))

const syncSubscription = vi.fn()
const recordPayment = vi.fn()
vi.mock('../api/_lib/sync.js', () => ({
  syncSubscription: (...a) => syncSubscription(...a),
  recordPayment: (...a) => recordPayment(...a),
}))

const SECRET = 'whsec_unit_test'
process.env.RAZORPAY_WEBHOOK_SECRET = SECRET
const { POST } = await import('../api/razorpay/webhook.js')

function makeRequest(bodyObj, { eventId = 'evt_1', secret = SECRET, signature } = {}) {
  const raw = JSON.stringify(bodyObj)
  const sig = signature ?? crypto.createHmac('sha256', secret).update(raw).digest('hex')
  return new Request('https://example.test/api/razorpay/webhook', {
    method: 'POST',
    headers: { 'x-razorpay-signature': sig, 'x-razorpay-event-id': eventId, 'content-type': 'application/json' },
    body: raw,
  })
}

const charged = {
  event: 'subscription.charged',
  created_at: 1761390000,
  payload: {
    subscription: { entity: { id: 'sub_1', status: 'active' } },
    payment: { entity: { id: 'pay_1', amount: 150000, status: 'captured' } },
  },
}

beforeEach(() => {
  events.clear()
  syncSubscription.mockReset().mockResolvedValue({ id: 'row1', user_id: 'u1', razorpay_subscription_id: 'sub_1' })
  recordPayment.mockReset().mockResolvedValue(undefined)
})

describe('POST /api/razorpay/webhook', () => {
  it('rejects an invalid signature without touching the database', async () => {
    const res = await POST(makeRequest(charged, { signature: 'deadbeef' }))
    expect(res.status).toBe(400)
    expect(events.size).toBe(0)
    expect(syncSubscription).not.toHaveBeenCalled()
  })

  it('processes a valid renewal: syncs the subscription and records the payment', async () => {
    const res = await POST(makeRequest(charged))
    expect(res.status).toBe(200)
    expect(syncSubscription).toHaveBeenCalledWith('sub_1', { eventAt: new Date(1761390000 * 1000).toISOString() })
    expect(recordPayment).toHaveBeenCalledWith(charged.payload.payment.entity, expect.objectContaining({ id: 'row1' }))
    expect(events.get('evt_1').processed_at).toBeTruthy()
  })

  it('is idempotent: a redelivered event is acknowledged but not reprocessed', async () => {
    await POST(makeRequest(charged))
    const res = await POST(makeRequest(charged))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ duplicate: true })
    expect(syncSubscription).toHaveBeenCalledTimes(1)
    expect(recordPayment).toHaveBeenCalledTimes(1)
  })

  it('returns 500 on failure so Razorpay retries, then succeeds on retry', async () => {
    syncSubscription.mockRejectedValueOnce(new Error('razorpay down'))
    const first = await POST(makeRequest(charged))
    expect(first.status).toBe(500)
    expect(events.get('evt_1').processed_at).toBeNull()
    expect(events.get('evt_1').last_error).toMatch(/razorpay down/)

    const retry = await POST(makeRequest(charged))
    expect(retry.status).toBe(200)
    expect(events.get('evt_1').processed_at).toBeTruthy()
    expect(events.get('evt_1').attempts).toBe(2)
  })

  it.each(['subscription.halted', 'subscription.cancelled', 'subscription.pending', 'subscription.completed'])(
    'syncs state for %s (no payment entity)',
    async (type) => {
      const res = await POST(makeRequest({ event: type, created_at: 1, payload: { subscription: { entity: { id: 'sub_1' } } } }, { eventId: type }))
      expect(res.status).toBe(200)
      expect(syncSubscription).toHaveBeenCalledWith('sub_1', expect.any(Object))
      expect(recordPayment).not.toHaveBeenCalled()
    },
  )

  it('acknowledges events for subscriptions this app did not create', async () => {
    syncSubscription.mockResolvedValueOnce(null)
    const res = await POST(makeRequest(charged, { eventId: 'evt_foreign' }))
    expect(res.status).toBe(200)
    expect(recordPayment).not.toHaveBeenCalled()
    expect(events.get('evt_foreign').last_error).toMatch(/not created by this app/)
  })

  it('ignores non-subscription events', async () => {
    const res = await POST(makeRequest({ event: 'payment.captured', payload: {} }, { eventId: 'evt_pay' }))
    expect(res.status).toBe(200)
    expect(syncSubscription).not.toHaveBeenCalled()
  })
})
