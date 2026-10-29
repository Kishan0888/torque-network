/**
 * POST /api/subscriptions/cancel
 * Cancels the user's subscription at the end of the paid cycle when possible
 * (access continues until then). Subscriptions without an active billing cycle
 * are cancelled immediately, as Razorpay requires.
 *
 * Body (optional): { "product": "instagram" | "linkedin" } — defaults to
 * "instagram". Only that product's subscription is cancelled.
 */
import { handle, json, HttpError, readOptionalJson, productFromBody } from '../_lib/http.js'
import { requireUser } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { razorpay, RazorpayError } from '../_lib/razorpay.js'
import { syncSubscription } from '../_lib/sync.js'
import { CANCELLABLE_STATUSES } from '../_lib/subscriptionState.js'
import { productForPlanId, linkedinPlanIdOrNull, PRODUCTS, DEFAULT_PRODUCT } from '../_lib/env.js'

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const product = productFromBody(await readOptionalJson(request), PRODUCTS, DEFAULT_PRODUCT)
  const linkedinPlanId = linkedinPlanIdOrNull()
  const db = supabaseAdmin()

  const { data: rows, error } = await db
    .from('subscriptions')
    .select('razorpay_subscription_id, razorpay_plan_id, status, cancel_at_cycle_end')
    .eq('user_id', user.id)
    .in('status', CANCELLABLE_STATUSES)
    .order('created_at', { ascending: false })
  if (error) throw error
  // Newest cancellable subscription for THIS product only.
  const row = rows.find((r) => productForPlanId(r.razorpay_plan_id, linkedinPlanId) === product)
  if (!row) throw new HttpError(404, 'You have no active membership to cancel.')
  if (row.cancel_at_cycle_end) {
    return json({ cancelled: true, atCycleEnd: true, alreadyScheduled: true })
  }

  const atCycleEnd = row.status === 'active'
  try {
    await razorpay.cancelSubscription(row.razorpay_subscription_id, atCycleEnd)
  } catch (e) {
    if (e instanceof RazorpayError) {
      console.error('[cancel] razorpay error', e.status, e.code, e.message)
      throw new HttpError(409, `Could not cancel: ${e.message}`)
    }
    throw e
  }

  const synced = await syncSubscription(row.razorpay_subscription_id)
  if (atCycleEnd) {
    const { error: flagErr } = await db
      .from('subscriptions')
      .update({ cancel_at_cycle_end: true })
      .eq('razorpay_subscription_id', row.razorpay_subscription_id)
    if (flagErr) throw flagErr
  }

  return json({ cancelled: true, atCycleEnd, status: synced?.status ?? null, accessUntil: synced?.current_end ?? null })
})
