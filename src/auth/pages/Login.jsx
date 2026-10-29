import { useState } from 'react'
import { supabase, siteUrl } from '../../lib/supabase'
import { useAuth } from '../AuthProvider'
import { navigate, Redirect } from '../../lib/router'
import { selectedPlan, withPlan, postAuthPath } from '../../lib/planSelection'
import { AuthShell, Field, SubmitButton, Notice, FooterLinks, TextLink } from '../ui'
import GoogleButton from '../GoogleButton'

export default function Login() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [unverified, setUnverified] = useState(false)
  const [info, setInfo] = useState('')

  const plan = selectedPlan()
  if (user) return <Redirect to={postAuthPath(plan)} />

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setInfo(''); setUnverified(false)
    setBusy(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (!err) return navigate(postAuthPath(plan), { replace: true })
    if (err.code === 'email_not_confirmed' || /not confirmed/i.test(err.message)) {
      setUnverified(true)
      return setError('Please verify your email address before logging in.')
    }
    setError(err.code === 'invalid_credentials' ? 'Incorrect email or password.' : err.message)
  }

  async function resend() {
    setError('')
    const { error: err } = await supabase.auth.resend({
      type: 'signup', email: email.trim(), options: { emailRedirectTo: siteUrl('/auth/callback') },
    })
    if (err) setError(err.message)
    else setInfo('Verification email sent. Check your inbox.')
  }

  return (
    <AuthShell title="Log in" subtitle="Welcome back to Torque Network.">
      {error && <Notice tone="error">{error}</Notice>}
      {info && <Notice tone="success">{info}</Notice>}
      {unverified && (
        <button type="button" className="btn-ghost" style={{ width: '100%', marginBottom: 18 }} onClick={resend}>
          Resend verification email
        </button>
      )}
      <GoogleButton plan={plan} onError={setError} />
      <form onSubmit={onSubmit} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <SubmitButton busy={busy}>Log in</SubmitButton>
      </form>
      <FooterLinks>
        <TextLink to="/forgot-password">Forgot your password?</TextLink><br />
        New here? <TextLink to={withPlan('/signup', plan)}>Create an account</TextLink>
      </FooterLinks>
    </AuthShell>
  )
}
