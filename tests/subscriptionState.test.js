import { describe, it, expect } from 'vitest'
import {
  subscriptionRowFromEntity,
  paymentRowFromEntity,
  rowGrantsAccess,
  userIdFromNotes,
  unixToIso,
} from '../api/_lib/subscriptionState.js'
import { assertModeAllowed, ConfigError } from '../api/_lib/env.js'

const now = new Date('2026-10-25T12:00:00Z')
const future = '2026-11-20T00:00:00Z'
const past = '2026-10-01T00:00:00Z'

describe('rowGrantsAccess (mirror of SQL is_entitled)', () => {
  it('grants access while active', () => {
    expect(rowGrantsAccess({ status: 'active', current_end: null }, now)).toBe(true)
  })
  it.each(['pending', 'cancelled', 'completed', 'halted'])('%s grants access only until current_end', (status) => {
    expect(rowGrantsAccess({ status, current_end: future }, now)).toBe(true)
    expect(rowGrantsAccess({ status, current_end: past }, now)).toBe(false)
    expect(rowGrantsAccess({ status, current_end: null }, now)).toBe(false)
  })
  it.each(['created', 'authenticated', 'expired', 'paused'])('%s never grants access', (status) => {
    expect(rowGrantsAccess({ status, current_end: future }, now)).toBe(false)
  })
  it('no row means no access', () => {
    expect(rowGrantsAccess(null, now)).toBe(false)
  })
})

describe('subscriptionRowFromEntity', () => {
  it('maps Razorpay fields and unix timestamps', () => {
    const row = subscriptionRowFromEntity({
      id: 'sub_1', plan_id: 'plan_1', customer_id: 'cust_1', status: 'active',
      current_start: 1761350400, current_end: 1763942400, charge_at: 1763942400, ended_at: null,
      paid_count: 1, total_count: 120, short_url: 'https://rzp.io/i/x',
    })
    expect(row).toMatchObject({
      razorpay_subscription_id: 'sub_1', razorpay_plan_id: 'plan_1', razorpay_customer_id: 'cust_1',
      status: 'active', paid_count: 1, total_count: 120, ended_at: null,
      current_start: new Date(1761350400 * 1000).toISOString(),
    })
  })
  it('rejects unknown statuses', () => {
    expect(() => subscriptionRowFromEntity({ id: 'sub_1', status: 'weird' })).toThrow()
  })
})

describe('helpers', () => {
  it('reads user_id from notes (object or empty array)', () => {
    const id = '0f8fad5b-d9cb-469f-a165-70867728950e'
    expect(userIdFromNotes({ notes: { user_id: id } })).toBe(id)
    expect(userIdFromNotes({ notes: [] })).toBe(null)
    expect(userIdFromNotes({ notes: { user_id: "x'; drop table" } })).toBe(null)
  })
  it('unixToIso handles null/zero', () => {
    expect(unixToIso(null)).toBe(null)
    expect(unixToIso(0)).toBe(null)
  })
  it('maps payment entities', () => {
    const row = paymentRowFromEntity(
      { id: 'pay_1', amount: 150000, currency: 'INR', status: 'captured', method: 'upi', invoice_id: 'inv_1' },
      { userId: 'u', subscriptionRowId: 's', razorpaySubscriptionId: 'sub_1' },
    )
    expect(row).toMatchObject({ razorpay_payment_id: 'pay_1', amount: 150000, status: 'captured', method: 'upi', user_id: 'u' })
  })
})

describe('assertModeAllowed (test-mode guard)', () => {
  it('allows test keys', () => {
    expect(() => assertModeAllowed('rzp_test_abc', undefined)).not.toThrow()
  })
  it('blocks live keys unless explicitly approved', () => {
    expect(() => assertModeAllowed('rzp_live_abc', undefined)).toThrow(ConfigError)
    expect(() => assertModeAllowed('rzp_live_abc', 'yes')).toThrow(ConfigError)
    expect(() => assertModeAllowed('rzp_live_abc', 'true')).not.toThrow()
  })
  it('rejects values that are not Razorpay key ids', () => {
    expect(() => assertModeAllowed('sk_live_123', undefined)).toThrow(ConfigError)
  })
})
