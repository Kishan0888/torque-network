/**
 * Pure helpers for translating Razorpay subscription entities into our
 * database rows and deciding entitlement. Kept dependency-free so they can be
 * unit-tested.
 */

export const STATUSES = [
  'created', 'authenticated', 'active', 'pending', 'halted',
  'cancelled', 'completed', 'expired', 'paused',
]

/** Statuses during which the user must not start a second subscription. */
export const BLOCKING_STATUSES = ['authenticated', 'active', 'pending', 'paused']

/** Statuses from which the user may cancel. */
export const CANCELLABLE_STATUSES = ['authenticated', 'active', 'pending', 'paused']

export function unixToIso(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return new Date(n * 1000).toISOString()
}

function notesObject(notes) {
  return notes && typeof notes === 'object' && !Array.isArray(notes) ? notes : {}
}

/** user_id we attached when creating the subscription (notes may be [] when empty). */
export function userIdFromNotes(entity) {
  const id = notesObject(entity?.notes).user_id
  return typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id) ? id : null
}

/** Razorpay subscription entity -> columns for public.subscriptions. */
export function subscriptionRowFromEntity(entity) {
  if (!entity?.id) throw new Error('Subscription entity has no id')
  if (!STATUSES.includes(entity.status)) throw new Error(`Unknown subscription status: ${entity.status}`)
  return {
    razorpay_subscription_id: entity.id,
    razorpay_plan_id: entity.plan_id,
    razorpay_customer_id: entity.customer_id || null,
    status: entity.status,
    current_start: unixToIso(entity.current_start),
    current_end: unixToIso(entity.current_end),
    charge_at: unixToIso(entity.charge_at),
    ended_at: unixToIso(entity.ended_at),
    paid_count: Number(entity.paid_count) || 0,
    total_count: entity.total_count ?? null,
    short_url: entity.short_url || null,
  }
}

/** Razorpay payment entity -> columns for public.payments. */
export function paymentRowFromEntity(entity, { userId, subscriptionRowId, razorpaySubscriptionId }) {
  if (!entity?.id) throw new Error('Payment entity has no id')
  return {
    user_id: userId,
    subscription_id: subscriptionRowId ?? null,
    razorpay_payment_id: entity.id,
    razorpay_subscription_id: razorpaySubscriptionId ?? null,
    razorpay_invoice_id: entity.invoice_id || null,
    amount: Number(entity.amount) || 0,
    currency: entity.currency || 'INR',
    status: entity.status || 'unknown',
    method: entity.method || null,
    error_code: entity.error_code || null,
    error_description: entity.error_description || null,
  }
}

/**
 * JS mirror of SQL public.is_entitled() for a single row (used in tests and UI
 * copy; the database function is the source of truth for access decisions).
 */
export function rowGrantsAccess(row, now = new Date()) {
  if (!row) return false
  if (row.status === 'active') return true
  if (['pending', 'cancelled', 'completed', 'halted'].includes(row.status)) {
    return Boolean(row.current_end) && new Date(row.current_end) > now
  }
  return false
}
