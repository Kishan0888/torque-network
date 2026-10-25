import { createClient } from '@supabase/supabase-js'

/**
 * Browser Supabase client. Uses ONLY the public URL and publishable (anon)
 * key; every table is protected by Row Level Security. Privileged keys live
 * exclusively in the /api serverless functions.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(url && publishableKey)

export const supabase = supabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Implicit flow: email links work even when opened on a different
        // device/browser than the one used to sign up.
        flowType: 'implicit',
      },
    })
  : null

export function siteUrl(path = '') {
  return `${window.location.origin}${path}`
}
