import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './env.js'

let client

/** Service-role client. Bypasses RLS — server use only, never sent to the browser. */
export function supabaseAdmin() {
  if (!client) {
    const { url, serviceRoleKey } = supabaseConfig()
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  }
  return client
}
