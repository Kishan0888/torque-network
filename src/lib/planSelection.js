/**
 * Remembers which membership a visitor picked on the homepage ("instagram" or
 * "linkedin") across /signup → email verification → /login → /account.
 *
 * Sources, in priority order:
 *   1. ?plan=… in the current URL (homepage buttons and internal redirects add it)
 *   2. browser storage (same-browser fallback if the URL loses it)
 *   3. the user's signup metadata (when the verification email is opened on
 *      another device)
 *
 * Only the product key is carried. The server still maps it to the Razorpay
 * plan id (RAZORPAY_PLAN_ID / RAZORPAY_LINKEDIN_PLAN_ID); plan ids never appear here.
 */
export const PLAN_KEYS = ['instagram', 'linkedin']
const STORAGE_KEY = 'torque_selected_plan'

export const validPlan = (value) => (PLAN_KEYS.includes(value) ? value : null)

export function planFromSearch(search) {
  try {
    return validPlan(new URLSearchParams(search || '').get('plan'))
  } catch {
    return null
  }
}

function browserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

/** Store a valid selection; ignores invalid values and unavailable storage. */
export function rememberPlan(plan, storage = browserStorage()) {
  const valid = validPlan(plan)
  if (!valid || !storage) return
  try {
    storage.setItem(STORAGE_KEY, valid)
  } catch {
    /* private mode / blocked storage: the URL and user metadata still carry it */
  }
}

/** Forget the remembered selection (e.g. the cart was emptied or the purchase finished). */
export function forgetPlan(storage = browserStorage()) {
  if (!storage) return
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}

function storedPlan(storage) {
  if (!storage) return null
  try {
    return validPlan(storage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

/** The visitor's selected plan, or null if they never picked one. */
export function selectedPlan({
  search = typeof window !== 'undefined' ? window.location.search : '',
  storage = browserStorage(),
  user = null,
} = {}) {
  return planFromSearch(search) || storedPlan(storage) || validPlan(user?.user_metadata?.selected_plan) || null
}

/** Append ?plan=… to an internal path (keeps any existing query, e.g. ?verified=1). */
export function withPlan(path, plan) {
  const valid = validPlan(plan)
  if (!valid) return path
  const url = new URL(path, 'http://local')
  url.searchParams.set('plan', valid)
  return url.pathname + url.search + url.hash
}
