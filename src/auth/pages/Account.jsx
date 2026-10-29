import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { apiFetch } from '../../lib/api'
import { openSubscriptionCheckout, preloadCheckout } from '../../lib/razorpayCheckout'
import { navigate } from '../../lib/router'
import { useAuth } from '../AuthProvider'
import { AuthShell, Field, Notice, MIN_PASSWORD } from '../ui'

// Display only. The amount actually charged comes from the Razorpay plan
// (RAZORPAY_PLAN_ID on the server); keep this label in sync with that plan.
const PRICE_LABEL = '₹750 / month'

const STATUS_COPY = {
  active: ['Active', 'success'],
  authenticated: ['Payment authorised — activating', 'info'],
  pending: ['Payment retrying', 'warn'],
  halted: ['Payment failed', 'error'],
  cancelled: ['Cancelled', 'warn'],
  completed: ['Completed', 'info'],
  expired: ['Expired', 'warn'],
  paused: ['Paused', 'warn'],
}

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtAmount = (paise, currency) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format((paise || 0) / 100)

const card = {
  borderRadius: 18, padding: '22px 22px', marginBottom: 18,
  background: 'rgba(5,8,22,0.55)', border: '1px solid rgba(255,255,255,0.07)',
}
const h2 = { fontSize: 17, fontWeight: 700, marginBottom: 12 }
const muted = { fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }

export default function Account() {
  const { user } = useAuth()
  const [membership, setMembership] = useState(null) // { entitled, subscription }
  const [membershipError, setMembershipError] = useState('')
  const [payments, setPayments] = useState([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(() =>
    new URLSearchParams(window.location.search).get('verified') ? ['success', 'Email verified — welcome to Torque Network!'] : null,
  )

  const loadMembership = useCallback(async () => {
    try {
      setMembershipError('')
      const data = await apiFetch('/api/subscriptions/me')
      setMembership(data)
      return data
    } catch (e) {
      setMembershipError(e.message)
      return null
    }
  }, [])

  const loadPayments = useCallback(async () => {
    const { data } = await supabase
      .from('payments')
      .select('razorpay_payment_id, amount, currency, status, method, created_at')
      .order('created_at', { ascending: false })
      .limit(24)
    setPayments(data || [])
  }, [])

  useEffect(() => {
    loadMembership()
    loadPayments()
  }, [loadMembership, loadPayments])

  // Called only when the server has not yet seen the subscription as active
  // (Razorpay's activation webhook can lag a few seconds behind the payment).
  async function waitForActivation() {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const data = await loadMembership()
      if (data?.entitled) return true
    }
    return false
  }

  async function subscribe() {
    setNotice(null)
    setBusy(true)
    preloadCheckout() // no-op if already loaded; otherwise downloads while the server creates the subscription
    try {
      const order = await apiFetch('/api/subscriptions/create', { method: 'POST' })
      const result = await openSubscriptionCheckout(order)
      if (!result) {
        setNotice(['info', 'Checkout closed. You have not been charged.'])
        return
      }
      setNotice(['info', 'Payment received — confirming your membership…'])
      const verified = await apiFetch('/api/subscriptions/verify', { method: 'POST', body: result })
      // verify already reports server-side entitlement; only poll if it isn't active yet.
      const [active] = await Promise.all([
        verified.entitled ? loadMembership().then(() => true) : waitForActivation(),
        loadPayments(),
      ])
      setNotice(active
        ? ['success', 'Your membership is active. Welcome aboard!']
        : ['info', 'Payment verified. Activation can take a minute — refresh this page shortly.'])
    } catch (e) {
      setNotice(['error', e.message])
      await loadMembership()
    } finally {
      setBusy(false)
    }
  }

  async function cancel() {
    const sub = membership?.subscription
    const msg = sub?.status === 'active'
      ? `Cancel your membership? You'll keep access until ${fmtDate(sub.current_end)} and won't be charged again.`
      : 'Cancel your membership now?'
    if (!window.confirm(msg)) return
    setNotice(null)
    setBusy(true)
    try {
      const res = await apiFetch('/api/subscriptions/cancel', { method: 'POST' })
      setNotice(['success', res.atCycleEnd
        ? `Cancellation scheduled. Access continues until ${fmtDate(res.accessUntil)}.`
        : 'Your membership has been cancelled.'])
      await loadMembership()
    } catch (e) {
      setNotice(['error', e.message])
    } finally {
      setBusy(false)
    }
  }

  const sub = membership?.subscription
  const [statusLabel, statusTone] = sub ? STATUS_COPY[sub.status] || [sub.status, 'info'] : []
  const canCancel = sub && ['active', 'authenticated', 'pending', 'paused'].includes(sub.status) && !sub.cancel_at_cycle_end
  const canSubscribe = membership && !membership.entitled && !(sub && ['active', 'authenticated', 'pending', 'paused'].includes(sub.status))

  // Download Razorpay Checkout as soon as the page opens (unless the user is
  // already a member), in parallel with loading membership status, so clicking
  // the subscribe button only waits for the server, not for the script.
  const entitled = membership?.entitled
  useEffect(() => {
    if (!entitled) preloadCheckout()
  }, [entitled])

  return (
    <AuthShell title="Your account" subtitle={user.email} wide>
      {notice && <Notice tone={notice[0]}>{notice[1]}</Notice>}

      <section style={card} aria-labelledby="membership-h">
        <h2 id="membership-h" style={h2}>Membership</h2>
        {membershipError && <Notice tone="error">{membershipError}</Notice>}
        {!membership && !membershipError && <p style={muted}>Loading membership…</p>}
        {membership && (
          <>
            {sub ? (
              <div style={{ ...muted, marginBottom: 14 }}>
                <div>Status: <Badge tone={statusTone}>{statusLabel}</Badge></div>
                {sub.current_end && (
                  <div>
                    {sub.status === 'active' && !sub.cancel_at_cycle_end ? 'Renews on' : 'Access until'}{' '}
                    <strong style={{ color: '#E2E8F0' }}>{fmtDate(sub.current_end)}</strong>
                  </div>
                )}
                {sub.cancel_at_cycle_end && sub.status === 'active' && <div>Cancellation scheduled — no further charges.</div>}
                {sub.status === 'pending' && <div>Your last renewal failed; Razorpay will retry automatically. Access continues meanwhile.</div>}
                {sub.status === 'halted' && <div>Renewal payments failed. Start a new membership below to restore access.</div>}
              </div>
            ) : (
              <p style={{ ...muted, marginBottom: 14 }}>You don’t have a membership yet.</p>
            )}

            {membership.entitled && <Notice tone="success">You have full member access.</Notice>}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {canSubscribe && (
                <button type="button" className="btn-primary" disabled={busy} onClick={subscribe}>
                  {busy ? 'Please wait…' : `Become a member — ${PRICE_LABEL}`}
                </button>
              )}
              {canCancel && (
                <button type="button" className="btn-ghost" disabled={busy} onClick={cancel}>Cancel membership</button>
              )}
            </div>
            {canSubscribe && <p style={{ ...muted, fontSize: 12, marginTop: 10 }}>Billed monthly via Razorpay. Cancel anytime from this page.</p>}
          </>
        )}
      </section>

      <section style={card} aria-labelledby="payments-h">
        <h2 id="payments-h" style={h2}>Payment history</h2>
        {payments.length === 0 ? (
          <p style={muted}>No payments yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#64748B', textAlign: 'left' }}>
                  <th style={th}>Date</th><th style={th}>Amount</th><th style={th}>Status</th><th style={th}>Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.razorpay_payment_id} style={{ color: '#CBD5E1', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={td}>{fmtDate(p.created_at)}</td>
                    <td style={td}>{fmtAmount(p.amount, p.currency)}</td>
                    <td style={td}>{p.status}</td>
                    <td style={td}>{p.method || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ProfileSection userId={user.id} />
      <SecuritySection />
    </AuthShell>
  )
}

const th = { padding: '8px 8px', fontWeight: 600 }
const td = { padding: '10px 8px' }

function Badge({ tone, children }) {
  const colors = { success: '#22C55E', info: '#3B82F6', warn: '#F59E0B', error: '#EF4444' }
  const c = colors[tone] || colors.info
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
      color: c, background: `${c}1A`, border: `1px solid ${c}55` }}>{children}</span>
  )
}

function ProfileSection({ userId }) {
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('profiles').select('full_name, phone').eq('id', userId).maybeSingle()
      .then(({ data }) => data && setForm({ full_name: data.full_name || '', phone: data.phone || '' }))
  }, [userId])

  async function save(e) {
    e.preventDefault()
    setMsg(null)
    const phone = form.phone.replace(/[^\d+]/g, '')
    if (phone && !/^\+?\d{10,15}$/.test(phone)) return setMsg(['error', 'Enter a valid mobile number (10–15 digits).'])
    setBusy(true)
    const { error } = await supabase.from('profiles')
      .update({ full_name: form.full_name.trim().slice(0, 120) || null, phone: phone || null })
      .eq('id', userId)
    setBusy(false)
    setMsg(error ? ['error', error.message] : ['success', 'Profile saved.'])
  }

  return (
    <section style={card} aria-labelledby="profile-h">
      <h2 id="profile-h" style={h2}>Profile</h2>
      {msg && <Notice tone={msg[0]}>{msg[1]}</Notice>}
      <form onSubmit={save} noValidate>
        <Field label="Full name" name="full_name" maxLength={120} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <Field label="Mobile number" name="profile_phone" type="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="submit" className="btn-ghost" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button>
      </form>
    </section>
  )
}

function SecuritySection() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function changePassword(e) {
    e.preventDefault()
    setMsg(null)
    if (password.length < MIN_PASSWORD) return setMsg(['error', `Password must be at least ${MIN_PASSWORD} characters.`])
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) return setMsg(['error', error.message])
    setPassword('')
    setMsg(['success', 'Password updated.'])
  }

  async function signOut(scope) {
    await supabase.auth.signOut({ scope })
    navigate('/login', { replace: true })
  }

  return (
    <section style={card} aria-labelledby="security-h">
      <h2 id="security-h" style={h2}>Security</h2>
      {msg && <Notice tone={msg[0]}>{msg[1]}</Notice>}
      <form onSubmit={changePassword} noValidate>
        <Field label="New password" name="new_password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-ghost" disabled={busy}>{busy ? 'Updating…' : 'Change password'}</button>
      </form>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button type="button" className="btn-ghost" onClick={() => signOut('local')}>Log out</button>
        <button type="button" className="btn-ghost" onClick={() => signOut('global')}>Log out of all devices</button>
      </div>
    </section>
  )
}
