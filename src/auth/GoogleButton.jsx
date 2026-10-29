/**
 * "Continue with Google" via the existing Supabase Auth Google provider
 * (supabase.auth.signInWithOAuth). No separate auth system.
 *
 * Styling follows Google's Sign in with Google branding guidelines (dark
 * theme: fill #131314, 1px #8E918F stroke, #E3E3E3 text; the standard,
 * unmodified Google "G" on a white background, loaded from Google's own
 * official asset URL).
 *
 * The button hides itself while the Google provider is not enabled in
 * Supabase, so visitors never hit a "provider is not enabled" error page.
 */
import { useEffect, useState } from 'react'
import { supabase, siteUrl } from '../lib/supabase'
import { rememberOAuthIntent } from '../lib/planSelection'

const GOOGLE_G_LOGO = 'https://developers.google.com/static/identity/images/g-logo.png'

let providerCheck // shared across both pages: one request per visit
function googleEnabled() {
  if (!providerCheck) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    providerCheck = fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => (s ? s.external?.google === true : true)) // unknown → show the button
      .catch(() => true)
  }
  return providerCheck
}

export default function GoogleButton({ plan, label = 'Continue with Google', onError }) {
  const [enabled, setEnabled] = useState(null) // null = checking
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    googleEnabled().then((ok) => alive && setEnabled(ok))
    return () => { alive = false }
  }, [])

  if (!enabled) return null

  async function start() {
    setBusy(true)
    // Remember which product (if any) this sign-in is for; read once on return.
    rememberOAuthIntent(plan)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: siteUrl('/auth/callback') },
    })
    if (error) {
      setBusy(false)
      onError?.(error.message)
    }
    // On success the browser is already navigating to Google.
  }

  return (
    <>
      <button type="button" onClick={start} disabled={busy} style={googleBtn(busy)} aria-label={label}>
        <span style={logoWrap} aria-hidden>
          <img src={GOOGLE_G_LOGO} alt="" width={18} height={18} style={{ display: 'block' }} />
        </span>
        <span>{busy ? 'Redirecting to Google…' : label}</span>
      </button>
      <div style={divider} role="separator" aria-label="or">
        <span style={dividerLine} /><span style={{ padding: '0 12px' }}>or</span><span style={dividerLine} />
      </div>
    </>
  )
}

const googleBtn = (busy) => ({
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  padding: '10px 12px 10px 12px', minHeight: 46, borderRadius: 12,
  background: '#131314', border: '1px solid #8E918F', color: '#E3E3E3',
  fontFamily: "'Google Sans', 'Roboto', 'Inter', sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
  cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.75 : 1, transition: 'background 0.2s',
})
const logoWrap = {
  width: 28, height: 28, borderRadius: 6, background: '#FFFFFF', flexShrink: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}
const divider = { display: 'flex', alignItems: 'center', margin: '18px 0', fontSize: 12, color: '#64748B' }
const dividerLine = { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }
