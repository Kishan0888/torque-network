import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { apiFetch } from '../../lib/api'
import { openSubscriptionCheckout, preloadCheckout } from '../../lib/razorpayCheckout'
import { navigate } from '../../lib/router'
import { useAuth } from '../AuthProvider'
import { AuthShell, Field, Notice, MIN_PASSWORD } from '../ui'
import { Check, Lock, ShieldCheck, ArrowRight, Sparkles, Briefcase, RotateCcw, Zap, Loader } from 'lucide-react'

// Display only. The amount actually charged comes from each product's Razorpay
// plan on the server (instagram -> RAZORPAY_PLAN_ID, linkedin ->
// RAZORPAY_LINKEDIN_PLAN_ID); keep these labels in sync with those plans.
// The browser only sends the product key; the server picks the plan id.
const PLANS = [
  {
    key: 'instagram',
    eyebrow: 'Torque for Instagram',
    name: 'Standard Member',
    price: '₹750',
    Icon: Sparkles,
    // Same benefit wording as the public pricing card (src/sections/Pricing.jsx).
    included: [
      '500–2,500 real creators watch, save and share your post',
      'Engagement within 48 hours, staggered naturally',
      'A professionally managed network, open to every creator category',
      'Access to a vetted community of 10,000+ influencers',
      'A network that grows with you at no extra cost',
    ],
  },
  {
    key: 'linkedin',
    eyebrow: 'Torque for LinkedIn',
    name: 'LinkedIn Professional',
    price: '₹500',
    Icon: Briefcase,
    included: [
      'Share your LinkedIn posts with the Torque Network community',
      'Genuine engagement from fellow members on your posts',
      'A professionally managed network for LinkedIn professionals',
    ],
  },
]
const priceLabel = (plan) => `${plan.price} / month`

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
  const [busyProduct, setBusyProduct] = useState(null) // product key while an action runs
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
  async function waitForActivation(product) {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const data = await loadMembership()
      if (data?.products?.[product]?.entitled) return true
    }
    return false
  }

  async function subscribe(plan) {
    setNotice(null)
    setBusyProduct(plan.key)
    preloadCheckout() // no-op if already loaded; otherwise downloads while the server creates the subscription
    try {
      const order = await apiFetch('/api/subscriptions/create', { method: 'POST', body: { product: plan.key } })
      const result = await openSubscriptionCheckout(order)
      if (!result) {
        setNotice(['info', 'Checkout closed. You have not been charged.'])
        return
      }
      setNotice(['info', 'Payment received — confirming your membership…'])
      const verified = await apiFetch('/api/subscriptions/verify', { method: 'POST', body: result })
      // verify reports this subscription's fresh status; only poll if it isn't active yet.
      const [active] = await Promise.all([
        verified.status === 'active' ? loadMembership().then(() => true) : waitForActivation(plan.key),
        loadPayments(),
      ])
      setNotice(active
        ? ['success', `Your ${plan.eyebrow} membership is active. Welcome aboard!`]
        : ['info', 'Payment verified. Activation can take a minute — refresh this page shortly.'])
    } catch (e) {
      setNotice(['error', e.message])
      await loadMembership()
    } finally {
      setBusyProduct(null)
    }
  }

  async function cancel(plan, sub) {
    const msg = sub?.status === 'active'
      ? `Cancel your ${plan.eyebrow} membership? You'll keep access until ${fmtDate(sub.current_end)} and won't be charged again.`
      : `Cancel your ${plan.eyebrow} membership now?`
    if (!window.confirm(msg)) return
    setNotice(null)
    setBusyProduct(plan.key)
    try {
      const res = await apiFetch('/api/subscriptions/cancel', { method: 'POST', body: { product: plan.key } })
      setNotice(['success', res.atCycleEnd
        ? `Cancellation scheduled. Access continues until ${fmtDate(res.accessUntil)}.`
        : 'Your membership has been cancelled.'])
      await loadMembership()
    } catch (e) {
      setNotice(['error', e.message])
    } finally {
      setBusyProduct(null)
    }
  }

  // Per-product state from /api/subscriptions/me (older responses: Instagram only).
  const productState = (key) =>
    membership?.products?.[key] ??
    (key === 'instagram' && membership ? { available: true, entitled: membership.entitled, subscription: membership.subscription } : null)
  const visiblePlans = PLANS.filter((plan) => productState(plan.key)?.available)

  // Download Razorpay Checkout as soon as the page opens (unless the user
  // already has every membership), in parallel with loading membership status,
  // so clicking a checkout button only waits for the server, not for the script.
  const needsCheckout = !membership || visiblePlans.some((plan) => !productState(plan.key)?.entitled)
  useEffect(() => {
    if (needsCheckout) preloadCheckout()
  }, [needsCheckout])

  return (
    <AuthShell title="Your account" subtitle={user.email} wide>
      {notice && <Notice tone={notice[0]}>{notice[1]}</Notice>}

      <h2 id="membership-h" style={{ ...h2, fontSize: 20, margin: '4px 0 14px' }}>Your Membership</h2>
      {membershipError && <Notice tone="error">{membershipError}</Notice>}
      {!membership && !membershipError && <section style={card}><p style={muted}>Loading membership…</p></section>}
      {membership && visiblePlans.map((plan) => (
        <MembershipCard
          key={plan.key}
          plan={plan}
          state={productState(plan.key)}
          busyProduct={busyProduct}
          onSubscribe={() => subscribe(plan)}
          onCancel={(sub) => cancel(plan, sub)}
        />
      ))}
      <style>{`
        @keyframes member-spin { to { transform: rotate(360deg); } }
        @media (max-width: 520px) {
          .member-card { padding: 22px 16px !important; }
          .member-product { flex-wrap: wrap; }
          .member-price { text-align: left !important; width: 100%; padding-left: 60px; }
          .member-trust { flex-direction: column; align-items: flex-start !important; }
        }
        @media (max-width: 430px) { .member-btn-price { display: none; } }
      `}</style>

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

function MembershipCard({ plan, state, busyProduct, onSubscribe, onCancel }) {
  const sub = state.subscription
  const busy = Boolean(busyProduct)
  const thisBusy = busyProduct === plan.key
  const [statusLabel, statusTone] = sub ? STATUS_COPY[sub.status] || [sub.status, 'info'] : []
  const canCancel = sub && ['active', 'authenticated', 'pending', 'paused'].includes(sub.status) && !sub.cancel_at_cycle_end
  const canSubscribe = !state.entitled && !(sub && ['active', 'authenticated', 'pending', 'paused'].includes(sub.status))

  const statusLines = sub ? [
    sub.current_end && (
      <div key="end">
        {sub.status === 'active' && !sub.cancel_at_cycle_end ? 'Renews on' : 'Access until'}{' '}
        <strong style={{ color: '#E2E8F0' }}>{fmtDate(sub.current_end)}</strong>
      </div>
    ),
    sub.cancel_at_cycle_end && sub.status === 'active' && <div key="cancel">Cancellation scheduled — no further charges.</div>,
    sub.status === 'pending' && <div key="pending">Your last renewal failed; Razorpay will retry automatically. Access continues meanwhile.</div>,
    sub.status === 'halted' && <div key="halted">Renewal payments failed. Start a new membership below to restore access.</div>,
  ].filter(Boolean) : []
  const statusDetails = statusLines.length ? <div style={{ ...muted, display: 'grid', gap: 4 }}>{statusLines}</div> : null
  const headingId = `membership-${plan.key}-h`
  const { Icon } = plan

  return (
    <section style={{ ...card, ...memberCard }} aria-labelledby={headingId} className="member-card">
      <div aria-hidden style={memberGlowLine} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <h3 id={headingId} style={{ ...h2, fontSize: 18, marginBottom: 0 }}>{plan.eyebrow}</h3>
        {sub && <Badge tone={statusTone}>{statusLabel}</Badge>}
      </div>

      {/* Product line */}
      <div style={productRow} className="member-product">
        <div style={productIcon} aria-hidden><Icon size={22} color="#fff" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
            Torque Network
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk' }}>{plan.name}</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Monthly membership · Renews automatically</div>
        </div>
        <div style={{ textAlign: 'right' }} className="member-price">
          <div style={priceText}>{plan.price}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>per month</div>
        </div>
      </div>

      {/* What's included */}
      <div style={{ margin: '20px 0 4px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 12 }}>What’s included</div>
        <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }} className="member-includes">
          {plan.included.map((item) => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>
              <span style={checkDot} aria-hidden><Check size={10} color="#22D3EE" strokeWidth={3} /></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {canSubscribe ? (
        <>
          {sub && statusDetails && <div style={{ ...summaryBox, marginBottom: 0 }}>{statusDetails}</div>}
          {/* Order summary */}
          <div style={summaryBox} aria-label={`${plan.eyebrow} order summary`}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 10 }}>Order summary</div>
            <SummaryRow label="Plan" value={plan.name} />
            <SummaryRow label="Billing" value="Monthly, until you cancel" />
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Due today</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk', letterSpacing: '-0.02em' }}>{plan.price}</span>
            </div>
          </div>

          <button type="button" className="btn-primary" disabled={busy} onClick={onSubscribe} style={checkoutBtn(thisBusy)}>
            {thisBusy ? (
              <><Loader size={17} style={{ animation: 'member-spin 0.8s linear infinite' }} /> Opening secure checkout…</>
            ) : (
              <><Lock size={16} /> Proceed to Checkout<span className="member-btn-price">&nbsp;· {priceLabel(plan)}</span> <ArrowRight size={17} /></>
            )}
          </button>

          <div style={trustRow} className="member-trust">
            <span style={trustItem}><ShieldCheck size={14} color="#22C55E" /> Secure payment via Razorpay</span>
            <span style={trustItem}><RotateCcw size={14} color="#22D3EE" /> Cancel anytime from this page</span>
            <span style={trustItem}><Zap size={14} color="#F59E0B" /> Access starts after payment</span>
          </div>
        </>
      ) : (
        <div style={summaryBox}>
          {sub ? statusDetails : <p style={muted}>You don’t have a membership yet.</p>}
          {state.entitled && <div style={{ marginTop: 12 }}><Notice tone="success">You have full member access.</Notice></div>}
          {canCancel && (
            <button type="button" className="btn-ghost" disabled={busy} onClick={() => onCancel(sub)} style={{ marginTop: 4 }}>Cancel membership</button>
          )}
        </div>
      )}
    </section>
  )
}

// ── Membership (order summary) styles ──────────────────────────
const memberCard = {
  position: 'relative', overflow: 'hidden', padding: '26px 26px',
  background: 'linear-gradient(180deg, rgba(13,19,38,0.95), rgba(5,8,22,0.9))',
  border: '1px solid rgba(59,130,246,0.28)',
  boxShadow: '0 0 0 1px rgba(34,211,238,0.04) inset, 0 18px 50px rgba(0,0,0,0.45), 0 0 40px rgba(59,130,246,0.08)',
}
const memberGlowLine = {
  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
  background: 'linear-gradient(90deg, transparent, #3B82F6, #22D3EE, transparent)',
}
const productRow = {
  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 16px', borderRadius: 16,
  background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
}
const productIcon = {
  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(135deg, #2563EB, #22D3EE)', boxShadow: '0 0 24px rgba(34,211,238,0.35)',
}
const priceText = {
  fontSize: 30, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.03em', lineHeight: 1,
  background: 'linear-gradient(135deg, #3B82F6, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}
const checkDot = {
  width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)',
}
const summaryBox = {
  marginTop: 18, marginBottom: 18, padding: '16px 18px', borderRadius: 14,
  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
}
const checkoutBtn = (busy) => ({
  width: '100%', justifyContent: 'center', padding: '17px 24px', fontSize: 16, fontWeight: 700, borderRadius: 14,
  boxShadow: '0 10px 30px rgba(37,99,235,0.35), 0 0 30px rgba(34,211,238,0.15)',
  opacity: busy ? 0.8 : 1, cursor: busy ? 'wait' : 'pointer', whiteSpace: 'normal',
})
const trustRow = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 18px', marginTop: 14,
}
const trustItem = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' }

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '4px 0' }}>
      <span style={{ color: '#94A3B8' }}>{label}</span>
      <span style={{ color: '#E2E8F0', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
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
