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
