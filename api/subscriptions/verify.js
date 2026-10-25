/**
 * POST /api/subscriptions/verify
 * Called by the browser after Razorpay Checkout succeeds. Verifies the checkout
 * signature against the subscription id stored for THIS user, then refreshes
 * the subscription from Razorpay. Access is granted from Razorpay's state, not
 * from anything the browser claims.
 */
import { handle, json, readJson, HttpError } from '../_lib/http.js'
import { requireUser, isEntitled } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { razorpayConfig } from '../_lib/env.js'
import { verifyCheckoutSignature } from '../_lib/signatures.js'
import { syncSubscription } from '../_lib/sync.js'

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const body = await readJson(request)
  const paymentId = String(body.razorpay_payment_id || '')
  const claimedSubscriptionId = String(body.razorpay_subscription_id || '')
  const signature = String(body.razorpay_signature || '')
  if (!paymentId || !claimedSubscriptionId || !signature) {
    throw new HttpError(400, 'Missing payment details.')
  }

  const { data: row, error } = await supabaseAdmin()
    .from('subscriptions')
    .select('razorpay_subscription_id')
    .eq('user_id', user.id)
    .eq('razorpay_subscription_id', claimedSubscriptionId)
    .maybeSingle()
  if (error) throw error
  if (!row) throw new HttpError(404, 'Subscription not found for this account.')

  const { keySecret } = razorpayConfig()
  const valid = verifyCheckoutSignature({
    paymentId,
    subscriptionId: row.razorpay_subscription_id, // server-side id, per Razorpay guidance
    signature,
    keySecret,
  })
  if (!valid) throw new HttpError(400, 'Payment signature could not be verified.')

  const synced = await syncSubscription(row.razorpay_subscription_id)
  return json({
    verified: true,
    status: synced?.status ?? null,
    entitled: await isEntitled(user.id),
  })
})
