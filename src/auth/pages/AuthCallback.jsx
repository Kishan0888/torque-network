import { useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { navigate } from '../../lib/router'
import { selectedPlan, postAuthPath, validPlan, takeOAuthIntent } from '../../lib/planSelection'
import { AuthShell, Notice, FooterLinks, TextLink, Loading } from '../ui'

/** Supabase reports link problems in the URL hash or query (e.g. expired links). */
// eslint-disable-next-line react/only-export-components
export function readAuthErrorFromUrl() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const query = new URLSearchParams(window.location.search)
  const desc = params.get('error_description') || query.get('error_description')
  return desc ? desc.replace(/\+/g, ' ') : ''
}

// The product saved on the account at signup wins over anything this browser
// remembers, so opening the email on another device can't switch products.
const planForVerifiedUser = (user) => validPlan(user?.user_metadata?.selected_plan) || selectedPlan({ user })

// Google sign-in leaves a single-use note of the plan chosen when the button
// was clicked. Read it exactly once per page load (also safe under StrictMode).
let oauthIntentOnce
const readOAuthIntentOnce = () => (oauthIntentOnce === undefined ? (oauthIntentOnce = takeOAuthIntent()) : oauthIntentOnce)

/** Landing page for the email verification link and the Google sign-in return. */
export default function AuthCallback() {
  const { session, loading, recovery } = useAuth()
  const [linkError] = useState(readAuthErrorFromUrl)
  const [oauthIntent] = useState(readOAuthIntentOnce)

  useEffect(() => {
    if (loading || linkError) return
    if (!session) return
    if (recovery) return navigate('/reset-password', { replace: true })
    // Returning from Google: go to the checkout for the plan chosen before
    // leaving (or the dashboard if none) — never a different, older choice.
    if (oauthIntent) return navigate(postAuthPath(oauthIntent.plan), { replace: true })
    navigate(postAuthPath(planForVerifiedUser(session.user), 'verified=1'), { replace: true })
  }, [loading, session, recovery, linkError, oauthIntent])

  if (loading || (session && !linkError)) return <Loading />

  return (
    <AuthShell title="We couldn’t verify that link" subtitle="The link may have expired or already been used.">
      {linkError && <Notice tone="error">{linkError}</Notice>}
      <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>
        Log in with your email and password — if your address still needs verifying, you can request a fresh link there.
      </p>
      <FooterLinks><TextLink to="/login">Go to log in</TextLink></FooterLinks>
    </AuthShell>
  )
}
