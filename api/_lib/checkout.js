/**
 * Starts (or reuses) a Razorpay subscription for a user and product. Shared by
 * /api/subscriptions/create (signed-in checkout) and /api/lead (landing-page
 * checkout) so both follow exactly the same rules.
 */
import { HttpError } from './http.js'
import { supabaseAdmin } from './supabaseAdmin.js'
import { razorpay, RazorpayError } from './razorpay.js'
import { razorpayConfig, planIdForProduct, productForPlanId, linkedinPlanIdOrNull, SUBSCRIPTION_TOTAL_COUNT } from './env.js'
import { syncSubscription } from './sync.js'
import { BLOCKING_STATUSES, subscriptionRowFromEntity, rowGrantsAccess } from './subscriptionState.js'

/** @param {{ id: string, email?: string }} user  @param {'instagram'|'linkedin'} product  @param {object} [extraNotes] */
export async function startCheckout(user, product, extraNotes = {}) {
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
        notes: { ...extraNotes, user_id: user.id, email: user.email ?? '', product },
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

  return {
    keyId,
    subscriptionId,
    prefill: {
      name: profile?.full_name ?? '',
      email: user.email ?? '',
      contact: profile?.phone ?? '',
    },
  }
}
