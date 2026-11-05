import { supabaseAdmin } from './supabaseAdmin.js'
import { HttpError } from './http.js'
import { productForPlanId, linkedinPlanIdOrNull, PRODUCTS } from './env.js'
import { rowGrantsAccess } from './subscriptionState.js'

/**
 * Per-product membership for a user, using the same rules as
 * /api/subscriptions/me and public.is_entitled():
 *   { instagram: boolean, linkedin: boolean, rows: [...subscriptions] }
 */
export async function entitlements(userId) {
  const { data: rows, error } = await supabaseAdmin()
    .from('subscriptions')
    .select('razorpay_subscription_id, razorpay_plan_id, status, current_start, current_end, charge_at, cancel_at_cycle_end, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  const linkedinPlanId = linkedinPlanIdOrNull()
  const result = { rows: rows.map((r) => ({ ...r, product: productForPlanId(r.razorpay_plan_id, linkedinPlanId) })) }
  for (const product of PRODUCTS) result[product] = result.rows.some((r) => r.product === product && rowGrantsAccess(r))
  return result
}

/** Throws 402 unless the user has an active membership for this platform. */
export async function requirePlatform(userId, platform) {
  if (!PRODUCTS.includes(platform)) throw new HttpError(400, 'Unknown platform.')
  const ent = await entitlements(userId)
  if (!ent[platform]) throw new HttpError(402, 'An active membership for this platform is required.', { code: 'membership_required' })
  return ent
}

export async function isAdmin(userId) {
  const { data, error } = await supabaseAdmin().from('admins').select('user_id').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function requireAdmin(userId) {
  if (!(await isAdmin(userId))) throw new HttpError(403, 'Admins only.')
}

/** Display name for a user: profile name, then Google/LinkedIn name, then email prefix. */
export function displayName(profile, user) {
  return (
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : 'Member')
  )
}

/** The LinkedIn identity attached via "Connect LinkedIn" (Supabase linkedin_oidc), if any. */
export function linkedinIdentity(user) {
  const id = (user?.identities || []).find((i) => i.provider === 'linkedin_oidc')
  if (!id) return null
  const d = id.identity_data || {}
  return { name: d.name || d.full_name || [d.given_name, d.family_name].filter(Boolean).join(' ') || null, picture: d.picture || null, email: d.email || null }
}
