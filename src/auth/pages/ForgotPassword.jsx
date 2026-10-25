import { useState } from 'react'
import { supabase, siteUrl } from '../../lib/supabase'
import { AuthShell, Field, SubmitButton, Notice, FooterLinks, TextLink } from '../ui'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: siteUrl('/reset-password'),
    })
    setBusy(false)
    // Don't reveal whether an account exists; only surface rate-limit/network style errors.
    if (err && err.status === 429) return setError('Too many requests. Please wait a few minutes and try again.')
    if (err && !err.status) return setError(err.message)
    setSent(true)
  }

  return (
    <AuthShell title="Reset your password" subtitle="Enter your account email and we’ll send you a reset link.">
      {error && <Notice tone="error">{error}</Notice>}
      {sent ? (
        <Notice tone="success">If an account exists for {email.trim()}, a reset link is on its way. Open it on any device to choose a new password.</Notice>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Field label="Email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <SubmitButton busy={busy}>Send reset link</SubmitButton>
        </form>
      )}
      <FooterLinks><TextLink to="/login">Back to log in</TextLink></FooterLinks>
    </AuthShell>
  )
}
