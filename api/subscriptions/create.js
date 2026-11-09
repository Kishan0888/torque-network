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
import { handle, json, readOptionalJson, productFromBody } from '../_lib/http.js'
import { requireUser } from '../_lib/auth.js'
import { PRODUCTS, DEFAULT_PRODUCT } from '../_lib/env.js'
import { startCheckout } from '../_lib/checkout.js'

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const product = productFromBody(await readOptionalJson(request), PRODUCTS, DEFAULT_PRODUCT)
  return json(await startCheckout(user, product))
})
