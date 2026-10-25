import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../AuthProvider'
import { navigate } from '../../lib/router'
import { AuthShell, Field, SubmitButton, Notice, FooterLinks, TextLink, MIN_PASSWORD, Loading } from '../ui'
import { readAuthErrorFromUrl } from './AuthCallback'

export default function ResetPassword() {
  const { session, loading, clearRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [linkError] = useState(readAuthErrorFromUrl)

  if (loading) return <Loading />

  if (!session && !done) {
    return (
      <AuthShell title="Link expired or invalid" subtitle={linkError || 'This password reset link is no longer valid. Request a new one.'}>
        <a href="/forgot-password" className="btn-primary" style={{ width: '100%' }}>Request a new link</a>
        <FooterLinks><TextLink to="/login">Back to log in</TextLink></FooterLinks>
      </AuthShell>
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`)
    if (password !== confirm) return setError('Passwords do not match.')
    setBusy(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) return setError(err.message)
    clearRecovery()
    setDone(true)
  }

  if (done) {
    return (
      <AuthShell title="Password updated" subtitle="Your new password is set.">
        <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/account', { replace: true })}>
          Go to my account
        </button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Choose a new password" subtitle={`Signed in as ${session.user.email}.`}>
      {error && <Notice tone="error">{error}</Notice>}
      <form onSubmit={onSubmit} noValidate>
        <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD}
          hint={`At least ${MIN_PASSWORD} characters.`} value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <SubmitButton busy={busy}>Update password</SubmitButton>
      </form>
    </AuthShell>
  )
}
