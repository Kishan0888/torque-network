/**
 * POST /api/subscriptions/create
 * Creates (or reuses) a Razorpay subscription for the signed-in, verified user
 * and returns what the browser needs to open Razorpay Checkout. The plan id,
 * amount and key secret never come from the browser.
 *
 * Body (optional): { "product": "instagram" | "linkedin" } — defaults to
 * "instagram". Each product uses its own Razorpay plan, and all checks below
 * are scoped to that product, so the two memberships are fully independent.
 */
import { handle, json, HttpError, readOptionalJson, productFromBody } from '../_lib/http.js'
import { requireUser } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { razorpay, RazorpayError } from '../_lib/razorpay.js'
import {
  razorpayConfig, planIdForProduct, productForPlanId, linkedinPlanIdOrNull,
  PRODUCTS, DEFAULT_PRODUCT, SUBSCRIPTION_TOTAL_COUNT,
} from '../_lib/env.js'
import { syncSubscription } from '../_lib/sync.js'
import { BLOCKING_STATUSES, subscriptionRowFromEntity, rowGrantsAccess } from '../_lib/subscriptionState.js'

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const product = productFromBody(await readOptionalJson(request), PRODUCTS, DEFAULT_PRODUCT)
  const { keyId } = razorpayConfig()
  const planId = planIdForProduct(product)
  const linkedinPlanId = linkedinPlanIdOrNull()
  const db = supabaseAdmin()

  // Independent lookups run concurrently.
  const [subsResult, profileResult] = await Promise.all([
    db
      .from('subscriptions')
      .select('razorpay_subscription_id, razorpay_plan_id, status, current_end')
      .eq('user_id', user.id),
    db.from('profiles').select('full_name, phone').eq('id', user.id).maybeSingle(),
  ])
  if (subsResult.error) throw subsResult.error
  const profile = profileResult.data

  // Only this product's subscriptions matter (Instagram and LinkedIn are independent).
  const productRows = subsResult.data.filter((r) => productForPlanId(r.razorpay_plan_id, linkedinPlanId) === product)

  // Same rule as public.is_entitled(), applied to this product only.
  if (productRows.some((r) => rowGrantsAccess(r))) {
    throw new HttpError(409, 'You already have an active membership.', { code: 'already_member' })
  }
  const rows = productRows.filter((r) => [...BLOCKING_STATUSES, 'created', 'halted'].includes(r.status))

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
        notes: { user_id: user.id, email: user.email ?? '', product },
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
