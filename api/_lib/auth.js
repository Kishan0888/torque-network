import { supabaseAdmin } from './supabaseAdmin.js'
import { HttpError } from './http.js'

/**
 * Validates the caller's Supabase access token with the Auth server and
 * returns the user. Requires a verified email address.
 */
export async function requireUser(request, { requireVerifiedEmail = true } = {}) {
  const header = request.headers.get('authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) throw new HttpError(401, 'Please log in to continue.')

  const { data, error } = await supabaseAdmin().auth.getUser(match[1])
  if (error || !data?.user) throw new HttpError(401, 'Your session has expired. Please log in again.')

  const user = data.user
  if (requireVerifiedEmail && !user.email_confirmed_at) {
    throw new HttpError(403, 'Please verify your email address first.', { code: 'email_not_verified' })
  }
  return user
}

/** Server-side entitlement check, backed by the public.is_entitled() SQL function. */
export async function isEntitled(userId) {
  const { data, error } = await supabaseAdmin().rpc('is_entitled', { p_user_id: userId })
  if (error) throw error
  return data === true
}

/** Use in any members-only API route. */
export async function requireEntitlement(request) {
  const user = await requireUser(request)
  if (!(await isEntitled(user.id))) {
    throw new HttpError(402, 'An active membership is required.', { code: 'membership_required' })
  }
  return user
}
