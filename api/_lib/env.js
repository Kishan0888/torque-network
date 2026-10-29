/**
 * Server-only configuration. Read lazily so a missing variable produces a
 * clear 500 for the one route that needs it instead of crashing every route.
 * Nothing in this file is ever bundled into the browser build (Vite only
 * bundles src/; /api runs as Vercel serverless functions).
 */

export class ConfigError extends Error {}

function required(name, fallbackName) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) throw new ConfigError(`Server is missing the ${name} environment variable.`)
  return value
}

export function supabaseConfig() {
  return {
    url: required('SUPABASE_URL', 'VITE_SUPABASE_URL'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  }
}

/**
 * Razorpay credentials. Refuses live keys unless RAZORPAY_ALLOW_LIVE=true, so
 * the integration stays in test mode until the owner explicitly approves
 * going live.
 */
export function razorpayConfig() {
  const keyId = required('RAZORPAY_KEY_ID')
  const keySecret = required('RAZORPAY_KEY_SECRET')
  assertModeAllowed(keyId, process.env.RAZORPAY_ALLOW_LIVE)
  return { keyId, keySecret }
}

export function razorpayPlanId() {
  return required('RAZORPAY_PLAN_ID')
}

/**
 * Subscription products. Each maps to its own Razorpay plan via its own env
 * variable; the browser only ever sends the product key, never a plan id.
 *   instagram -> RAZORPAY_PLAN_ID          (existing ₹750/month plan, unchanged)
 *   linkedin  -> RAZORPAY_LINKEDIN_PLAN_ID (₹500/month plan)
 */
export const PRODUCTS = ['instagram', 'linkedin']
export const DEFAULT_PRODUCT = 'instagram'

export function planIdForProduct(product) {
  if (product === 'instagram') return razorpayPlanId()
  if (product === 'linkedin') return required('RAZORPAY_LINKEDIN_PLAN_ID')
  throw new Error(`Unknown product: ${product}`)
}

/** LinkedIn plan id if configured, else null (LinkedIn is then unavailable). */
export function linkedinPlanIdOrNull() {
  return process.env.RAZORPAY_LINKEDIN_PLAN_ID || null
}

/**
 * Which product a stored subscription belongs to. Only the LinkedIn plan id
 * marks LinkedIn; every other plan is Instagram, so existing Instagram rows
 * behave exactly as before.
 */
export function productForPlanId(planId, linkedinPlanId = linkedinPlanIdOrNull()) {
  return linkedinPlanId && planId === linkedinPlanId ? 'linkedin' : 'instagram'
}

export function razorpayWebhookSecret() {
  return required('RAZORPAY_WEBHOOK_SECRET')
}

export function assertModeAllowed(keyId, allowLive) {
  if (keyId.startsWith('rzp_live_') && allowLive !== 'true') {
    throw new ConfigError(
      'Live Razorpay keys are configured but live mode has not been approved (RAZORPAY_ALLOW_LIVE is not "true").',
    )
  }
  if (!keyId.startsWith('rzp_test_') && !keyId.startsWith('rzp_live_')) {
    throw new ConfigError('RAZORPAY_KEY_ID does not look like a Razorpay key id.')
  }
}

/** Monthly plan: Razorpay allows charging a subscription for up to 10 years. */
export const SUBSCRIPTION_TOTAL_COUNT = 120
