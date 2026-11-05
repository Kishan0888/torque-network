/**
 * Which social sign-in providers are switched on in Supabase (public
 * /auth/v1/settings). Checked once per page load. If the check itself fails,
 * providers are assumed on so buttons still show.
 */
let cached
export function enabledProviders() {
  if (!cached) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    cached = fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => (s
        ? { google: s.external?.google === true, linkedin_oidc: s.external?.linkedin_oidc === true }
        : { google: true, linkedin_oidc: true }))
      .catch(() => ({ google: true, linkedin_oidc: true }))
  }
  return cached
}
