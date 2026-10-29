/**
 * GET /api/subscriptions/me
 * Server-enforced membership status for the signed-in user.
 *
 * `entitled` / `subscription` keep their original meaning (any membership,
 * newest subscription). `products` reports each membership separately:
 *   { instagram: { available, entitled, subscription }, linkedin: { ... } }
 * LinkedIn is `available: false` until RAZORPAY_LINKEDIN_PLAN_ID is set.
 */
import { handle, json } from '../_lib/http.js'
import { requireUser, isEntitled } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { productForPlanId, linkedinPlanIdOrNull, PRODUCTS } from '../_lib/env.js'
import { rowGrantsAccess } from '../_lib/subscriptionState.js'

const PUBLIC_FIELDS = ['status', 'current_start', 'current_end', 'charge_at', 'ended_at', 'paid_count', 'cancel_at_cycle_end', 'created_at']

export const GET = handle(async (request) => {
  const user = await requireUser(request)
  const linkedinPlanId = linkedinPlanIdOrNull()

  // Both lookups run concurrently.
  const [{ data: rows, error }, entitled] = await Promise.all([
    supabaseAdmin()
      .from('subscriptions')
      .select(['razorpay_plan_id', ...PUBLIC_FIELDS].join(', '))
      .eq('user_id', user.id)
      .neq('status', 'created')
      .order('created_at', { ascending: false }),
    isEntitled(user.id),
  ])
  if (error) throw error

  const publicView = (row) => (row ? Object.fromEntries(PUBLIC_FIELDS.map((k) => [k, row[k]])) : null)

  const products = Object.fromEntries(
    PRODUCTS.map((product) => {
      const mine = rows.filter((r) => productForPlanId(r.razorpay_plan_id, linkedinPlanId) === product)
      return [product, {
        available: product === 'instagram' || Boolean(linkedinPlanId),
        entitled: mine.some((r) => rowGrantsAccess(r)),
        subscription: publicView(mine[0]),
      }]
    }),
  )

  return json({ entitled, subscription: publicView(rows[0]), products })
})
