/**
 * POST /api/subscriptions/create
 * Creates (or reuses) a Razorpay subscription for the signed-in, verified user
 * and returns what the browser needs to open Razorpay Checkout. The plan id,
 * amount and key secret never come from the browser.
 */
import { handle, json, HttpError } from '../_lib/http.js'
import { requireUser, isEntitled } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { razorpay, RazorpayError } from '../_lib/razorpay.js'
import { razorpayConfig, razorpayPlanId, SUBSCRIPTION_TOTAL_COUNT } from '../_lib/env.js'
import { syncSubscription } from '../_lib/sync.js'
import { BLOCKING_STATUSES, subscriptionRowFromEntity } from '../_lib/subscriptionState.js'

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const { keyId } = razorpayConfig()
  const planId = razorpayPlanId()
  const db = supabaseAdmin()

  // Independent lookups run concurrently (previously sequential round trips).
  const [entitled, rowsResult, profileResult] = await Promise.all([
    isEntitled(user.id),
    db
      .from('subscriptions')
      .select('razorpay_subscription_id, razorpay_plan_id, status')
      .eq('user_id', user.id)
      .in('status', [...BLOCKING_STATUSES, 'created', 'halted']),
    db.from('profiles').select('full_name, phone').eq('id', user.id).maybeSingle(),
  ])

  if (entitled) {
    throw new HttpError(409, 'You already have an active membership.', { code: 'already_member' })
  }
  if (rowsResult.error) throw rowsResult.error
  const rows = rowsResult.data
  const profile = profileResult.data

  // Refresh every candidate from Razorpay in parallel, in case a webhook is still in flight.
  const refreshed = await Promise.all(
    rows.map(async (row) => {
      const fresh = await syncSubscription(row.razorpay_subscription_id)
      return { row, fresh, status: fresh?.status ?? row.status }
    }),
  )

  if (refreshed.some(({ status }) => BLOCKING_STATUSES.includes(status))) {
    throw new HttpError(409, 'You already have a membership in progress.', { code: 'subscription_in_progress' })
  }

  // Payments stopped after failed retries; close them so they can't revive alongside a new one.
  await Promise.all(
    refreshed
      .filter(({ status }) => status === 'halted')
      .map(async ({ row }) => {
        await razorpay.cancelSubscription(row.razorpay_subscription_id, false).catch((e) => {
          if (!(e instanceof RazorpayError)) throw e
        })
        await syncSubscription(row.razorpay_subscription_id)
      }),
  )

  const reusable = refreshed.find(({ status, fresh }) => status === 'created' && fresh?.razorpay_plan_id === planId)
  const reusableId = reusable ? reusable.row.razorpay_subscription_id : null

  let subscriptionId = reusableId
  if (!subscriptionId) {
    let entity
    try {
      entity = await razorpay.createSubscription({
        plan_id: planId,
        total_count: SUBSCRIPTION_TOTAL_COUNT,
        quantity: 1,
        customer_notify: 1,
        notes: { user_id: user.id, email: user.email ?? '' },
      })
    } catch (e) {
      if (e instanceof RazorpayError) {
        console.error('[create] razorpay error', e.status, e.code, e.message)
        throw new HttpError(502, 'Could not start checkout with the payment provider. Please try again.')
      }
      throw e
    }
    const { error: insertErr } = await db
      .from('subscriptions')
      .insert({ ...subscriptionRowFromEntity(entity), user_id: user.id })
    if (insertErr) throw insertErr
    subscriptionId = entity.id
  }

  return json({
    keyId,
    subscriptionId,
    prefill: {
      name: profile?.full_name ?? '',
      email: user.email ?? '',
      contact: profile?.phone ?? '',
    },
  })
})
