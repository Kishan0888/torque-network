import { useState } from 'react'
import { supabase, siteUrl } from '../../lib/supabase'
import { useAuth } from '../AuthProvider'
import { navigate, Redirect } from '../../lib/router'
import { selectedPlan, withPlan } from '../../lib/planSelection'
import { AuthShell, Field, SubmitButton, Notice, FooterLinks, TextLink, MIN_PASSWORD } from '../ui'

export default function Signup() {
  const { user } = useAuth()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')

  const plan = selectedPlan()
  if (user && !sentTo) return <Redirect to={withPlan('/account', plan)} />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`)
    const phone = form.phone.replace(/[^\d+]/g, '')
    if (phone && !/^\+?\d{10,15}$/.test(phone)) return setError('Enter a valid mobile number (10–15 digits).')

    setBusy(true)
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: siteUrl('/auth/callback'),
        // selected_plan lets /account show the chosen plan even if the email link is opened on another device.
        data: { full_name: form.fullName.trim(), phone, ...(plan ? { selected_plan: plan } : {}) },
      },
    })
    setBusy(false)
    if (err) return setError(err.message)
    // Email confirmation enabled => no session yet. (If it were disabled, a session would exist.)
    if (data.session) return navigate(withPlan('/account', plan), { replace: true })
    setSentTo(form.email.trim())
  }

  async function resend() {
    setError('')
    const { error: err } = await supabase.auth.resend({
      type: 'signup', email: sentTo, options: { emailRedirectTo: siteUrl('/auth/callback') },
    })
    if (err) setError(err.message)
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a verification link to ${sentTo}. Open it to activate your account.`}>
        {error && <Notice tone="error">{error}</Notice>}
        <Notice>Didn’t get it? Check spam, or resend below. Links expire, so use the newest one.</Notice>
        <button type="button" className="btn-ghost" style={{ width: '100%' }} onClick={resend}>Resend verification email</button>
        <FooterLinks>Already verified? <TextLink to={withPlan('/login', plan)}>Log in</TextLink></FooterLinks>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Create your account" subtitle="Join Torque Network and manage your membership.">
      {error && <Notice tone="error">{error}</Notice>}
      <form onSubmit={onSubmit} noValidate>
        <Field label="Full name" name="fullName" autoComplete="name" required maxLength={120} value={form.fullName} onChange={set('fullName')} />
        <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength={20} value={form.phone} onChange={set('phone')} />
        <Field label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD}
          hint={`At least ${MIN_PASSWORD} characters.`} value={form.password} onChange={set('password')} />
        <SubmitButton busy={busy}>Create account</SubmitButton>
      </form>
      <FooterLinks>Already have an account? <TextLink to={withPlan('/login', plan)}>Log in</TextLink></FooterLinks>
    </AuthShell>
  )
}
