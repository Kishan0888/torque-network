import { supabaseAdmin } from './supabaseAdmin.js'
import { razorpay } from './razorpay.js'
import {
  subscriptionRowFromEntity,
  paymentRowFromEntity,
  userIdFromNotes,
} from './subscriptionState.js'

/**
 * Re-fetches the subscription from Razorpay (the source of truth) and upserts
 * it. Because we always store the *current* Razorpay state rather than the
 * snapshot inside a webhook, events that arrive late or out of order can never
 * roll the status backwards.
 *
 * Returns the stored row, or null when the subscription is not one of ours
 * (no matching row and no user_id in its notes).
 */
export async function syncSubscription(razorpaySubscriptionId, { eventAt } = {}) {
  const db = supabaseAdmin()

  const { data: existing, error: readErr } = await db
    .from('subscriptions')
    .select('id, user_id, last_event_at')
    .eq('razorpay_subscription_id', razorpaySubscriptionId)
    .maybeSingle()
  if (readErr) throw readErr

  const entity = await razorpay.fetchSubscription(razorpaySubscriptionId)
  const userId = existing?.user_id ?? userIdFromNotes(entity)
  if (!userId) return null

  const row = { ...subscriptionRowFromEntity(entity), user_id: userId }
  if (eventAt && (!existing?.last_event_at || new Date(eventAt) > new Date(existing.last_event_at))) {
    row.last_event_at = eventAt
  }

  const { data, error } = await db
    .from('subscriptions')
    .upsert(row, { onConflict: 'razorpay_subscription_id' })
    .select('*')
    .single()
  if (error) throw error
  return data
}

/** Upsert a payment (idempotent on razorpay_payment_id). */
export async function recordPayment(paymentEntity, subscriptionRow) {
  if (!paymentEntity?.id || !subscriptionRow) return
  const row = paymentRowFromEntity(paymentEntity, {
    userId: subscriptionRow.user_id,
    subscriptionRowId: subscriptionRow.id,
    razorpaySubscriptionId: subscriptionRow.razorpay_subscription_id,
  })
  const { error } = await supabaseAdmin()
    .from('payments')
    .upsert(row, { onConflict: 'razorpay_payment_id' })
  if (error) throw error
}
