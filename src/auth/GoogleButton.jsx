/**
 * "Continue with Google" and "Continue with LinkedIn" via the existing
 * Supabase Auth providers (google, linkedin_oidc). No separate auth system.
 *
 * Google styling follows Google's Sign in with Google branding guidelines
 * (dark theme: fill #131314, 1px #8E918F stroke, #E3E3E3 text; the standard
 * Google "G" on white from Google's official asset URL). LinkedIn uses
 * LinkedIn blue (#0A66C2) with the "in" mark.
 *
 * Each button hides itself while its provider is not enabled in Supabase,
 * so visitors never hit a "provider is not enabled" error page.
 */
import { useEffect, useState } from 'react'
import { supabase, siteUrl } from '../lib/supabase'
import { rememberOAuthIntent } from '../lib/planSelection'
import { enabledProviders } from '../lib/authProviders'

const GOOGLE_G_LOGO = 'https://developers.google.com/static/identity/images/g-logo.png'

export default function SocialSignIn({ plan, onError }) {
  const [enabled, setEnabled] = useState(null) // null = checking
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    let alive = true
    enabledProviders().then((p) => alive && setEnabled(p))
    return () => { alive = false }
  }, [])

  if (!enabled || (!enabled.google && !enabled.linkedin_oidc)) return null

  async function start(provider) {
    setBusy(provider)
    // Remember which product (if any) this sign-in is for; read once on return.
    rememberOAuthIntent(plan)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: siteUrl('/auth/callback') },
    })
    if (error) {
      setBusy(null)
      onError?.(error.message)
    }
    // On success the browser is already navigating to the provider.
  }

  return (
    <>
      <div style={{ display: 'grid', gap: 10 }}>
        {enabled.google && (
          <button type="button" onClick={() => start('google')} disabled={Boolean(busy)} style={googleBtn(busy === 'google')} aria-label="Continue with Google">
            <span style={logoWrap} aria-hidden>
              <img src={GOOGLE_G_LOGO} alt="" width={18} height={18} style={{ display: 'block' }} />
            </span>
            <span>{busy === 'google' ? 'Redirecting to Google…' : 'Continue with Google'}</span>
          </button>
        )}
        {enabled.linkedin_oidc && (
          <button type="button" onClick={() => start('linkedin_oidc')} disabled={Boolean(busy)} style={linkedinBtn(busy === 'linkedin_oidc')} aria-label="Continue with LinkedIn">
            <span style={liLogo} aria-hidden>in</span>
            <span>{busy === 'linkedin_oidc' ? 'Redirecting to LinkedIn…' : 'Continue with LinkedIn'}</span>
          </button>
        )}
      </div>
      <div style={divider} role="separator" aria-label="or">
        <span style={dividerLine} /><span style={{ padding: '0 12px' }}>or</span><span style={dividerLine} />
      </div>
    </>
  )
}

const baseBtn = (busy) => ({
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  padding: '10px 12px', minHeight: 46, borderRadius: 12,
  fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
  cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.75 : 1, transition: 'background 0.2s',
})
const googleBtn = (busy) => ({
  ...baseBtn(busy), background: '#131314', border: '1px solid #8E918F', color: '#E3E3E3',
  fontFamily: "'Google Sans', 'Roboto', 'Inter', sans-serif",
})
const linkedinBtn = (busy) => ({ ...baseBtn(busy), background: '#0A66C2', border: '1px solid #0A66C2', color: '#FFFFFF', fontWeight: 600 })
const logoWrap = {
  width: 28, height: 28, borderRadius: 6, background: '#FFFFFF', flexShrink: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}
const liLogo = {
  width: 24, height: 24, borderRadius: 4, background: '#FFFFFF', color: '#0A66C2', flexShrink: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, fontFamily: 'Arial, sans-serif',
}
const divider = { display: 'flex', alignItems: 'center', margin: '18px 0', fontSize: 12, color: '#64748B' }
const dividerLine = { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }
