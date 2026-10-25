/**
 * GET /api/subscriptions/me
 * Server-enforced membership status for the signed-in user.
 */
import { handle, json } from '../_lib/http.js'
import { requireUser, isEntitled } from '../_lib/auth.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'

export const GET = handle(async (request) => {
  const user = await requireUser(request)

  const { data: subscription, error } = await supabaseAdmin()
    .from('subscriptions')
    .select('status, current_start, current_end, charge_at, ended_at, paid_count, cancel_at_cycle_end, created_at')
    .eq('user_id', user.id)
    .neq('status', 'created')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error

  return json({ entitled: await isEntitled(user.id), subscription: subscription ?? null })
})
