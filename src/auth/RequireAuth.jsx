import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase, siteUrl } from '../lib/supabase'
import { Redirect } from '../lib/router'
import { AuthShell, Notice, Loading } from './ui'

/** Protects account routes: requires a session AND a verified email address. */
export default function RequireAuth({ children }) {
  const { user, loading, emailVerified } = useAuth()
  const [msg, setMsg] = useState('')

  if (loading) return <Loading />
  if (!user) return <Redirect to="/login" />

  if (!emailVerified) {
    return (
      <AuthShell title="Verify your email" subtitle={`Open the link we sent to ${user.email} to finish setting up your account.`}>
        {msg && <Notice tone="success">{msg}</Notice>}
        <button type="button" className="btn-ghost" style={{ width: '100%', marginBottom: 12 }}
          onClick={async () => {
            const { error } = await supabase.auth.resend({ type: 'signup', email: user.email, options: { emailRedirectTo: siteUrl('/auth/callback') } })
            setMsg(error ? error.message : 'Verification email sent.')
          }}>
          Resend verification email
        </button>
        <button type="button" className="btn-ghost" style={{ width: '100%' }} onClick={() => supabase.auth.signOut({ scope: 'local' })}>
          Log out
        </button>
      </AuthShell>
    )
  }

  return children
}
