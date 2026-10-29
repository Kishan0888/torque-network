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

/**
 * Where to send the user after signup / login / email verification:
 * the dedicated checkout for the plan they picked, or the account dashboard.
 * `extraQuery` (e.g. "verified=1") is kept.
 */
export function postAuthPath(plan, extraQuery = '') {
  const base = validPlan(plan) ? '/checkout' : '/account'
  return withPlan(extraQuery ? `${base}?${extraQuery}` : base, plan)
}

// ── Google (OAuth) sign-in ──────────────────────────────────────────────────
// Supabase only redirects back to URLs on its allow list (exact match, query
// string included), so the plan can't ride along in the OAuth return URL.
// Instead a single-use "intent" is saved right before leaving for Google and
// read once on /auth/callback. Google always returns to the same browser.
const OAUTH_KEY = 'torque_oauth_intent'
export const OAUTH_INTENT_MAX_AGE_MS = 30 * 60 * 1000

/** Save which plan (or none) the user had chosen when they clicked "Continue with Google". */
export function rememberOAuthIntent(plan, storage = browserStorage(), now = Date.now()) {
  if (!storage) return
  try {
    storage.setItem(OAUTH_KEY, JSON.stringify({ plan: validPlan(plan), at: now }))
  } catch {
    /* storage unavailable: callback falls back to the normal selection rules */
  }
}

/**
 * Read and delete the OAuth intent. Returns { plan } (plan may be null = no
 * plan chosen) or null if there is no fresh intent.
 */
export function takeOAuthIntent(storage = browserStorage(), now = Date.now()) {
  if (!storage) return null
  let raw = null
  try {
    raw = storage.getItem(OAUTH_KEY)
    storage.removeItem(OAUTH_KEY)
  } catch {
    return null
  }
  if (!raw) return null
  try {
    const { plan, at } = JSON.parse(raw)
    if (typeof at !== 'number' || now - at > OAUTH_INTENT_MAX_AGE_MS || at > now + 60_000) return null
    return { plan: validPlan(plan) }
  } catch {
    return null
  }
}
