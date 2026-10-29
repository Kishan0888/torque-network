import { useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { navigate } from '../../lib/router'
import { selectedPlan, postAuthPath, validPlan } from '../../lib/planSelection'
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

/** Landing page for the email verification link. */
export default function AuthCallback() {
  const { session, loading, recovery } = useAuth()
  const [linkError] = useState(readAuthErrorFromUrl)

  useEffect(() => {
    if (loading || linkError) return
    if (session) navigate(recovery ? '/reset-password' : postAuthPath(planForVerifiedUser(session.user), 'verified=1'), { replace: true })
  }, [loading, session, recovery, linkError])

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
