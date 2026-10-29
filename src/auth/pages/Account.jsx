import { useCallback, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { apiFetch } from '../../lib/api'
import { navigate, Redirect } from '../../lib/router'
import { useAuth } from '../AuthProvider'
import { planFromSearch, withPlan } from '../../lib/planSelection'
import { AuthShell, Field, Notice, MIN_PASSWORD } from '../ui'
import { PLANS, priceLabel, canPurchase, productStateFrom, STATUS_COPY, IN_PROGRESS, fmtDate, fmtAmount } from '../plans'
import { card, h2, muted, memberCard, memberGlowLine, productRow, productIcon, priceText, summaryBox, eyebrowText } from '../membershipStyles'
import { Badge, IncludedList, MemberStyles } from '../membershipUi'

const checkoutPath = (plan) => withPlan('/checkout', plan.key)

/**
 * /account — membership dashboard: existing memberships (status, renewal,
 * cancel), payment history, profile and security. Buying happens on the
 * dedicated /checkout page for one product at a time.
 */
export default function Account() {
  const { user } = useAuth()
  // Old links like /account?plan=linkedin go straight to that product's checkout.
  const [explicitPlan] = useState(() => planFromSearch(window.location.search))
  const [membership, setMembership] = useState(null)
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
    if (explicitPlan) return
    loadMembership()
    loadPayments()
  }, [explicitPlan, loadMembership, loadPayments])

  if (explicitPlan) return <Redirect to={withPlan('/checkout', explicitPlan)} />

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

  const available = PLANS.filter((plan) => productStateFrom(membership, plan.key)?.available)
  // Memberships the user has (or had): shown with status and management actions.
  const mine = available.filter((plan) => productStateFrom(membership, plan.key)?.subscription || productStateFrom(membership, plan.key)?.entitled)
  // Products never subscribed to: offered as a link to their own checkout.
  const others = available.filter((plan) => !mine.includes(plan) && canPurchase(productStateFrom(membership, plan.key)))

  return (
    <AuthShell title="Your account" subtitle={user.email} wide>
      {notice && <Notice tone={notice[0]}>{notice[1]}</Notice>}

      <h2 id="membership-h" style={{ ...h2, fontSize: 20, margin: '4px 0 14px' }}>Your Membership</h2>
      {membershipError && <Notice tone="error">{membershipError}</Notice>}
      {!membership && !membershipError && <section style={card}><p style={muted}>Loading membership…</p></section>}
      {membership && mine.length === 0 && (
        <section style={card}><p style={muted}>You don’t have a membership yet.</p></section>
      )}
      {membership && mine.map((plan) => (
        <MembershipCard
          key={plan.key}
          plan={plan}
          state={productStateFrom(membership, plan.key)}
          busyProduct={busyProduct}
          onCancel={(sub) => cancel(plan, sub)}
        />
      ))}

      {membership && others.length > 0 && (
        <section style={card} aria-labelledby="add-membership-h">
          <h2 id="add-membership-h" style={h2}>{mine.length ? 'Add another membership' : 'Choose a membership'}</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {others.map((plan) => <PlanLinkRow key={plan.key} plan={plan} />)}
          </div>
        </section>
      )}
      <MemberStyles />

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

/** A product the user doesn't have: one line linking to its dedicated checkout. */
function PlanLinkRow({ plan }) {
  const { Icon } = plan
  return (
    <div style={{ ...productRow, flexWrap: 'wrap' }}>
      <div style={productIcon} aria-hidden><Icon size={20} color="#fff" /></div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={eyebrowText}>{plan.eyebrow}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk' }}>{plan.name} · {priceLabel(plan)}</div>
      </div>
      <button type="button" className="btn-ghost" onClick={() => navigate(checkoutPath(plan))} style={{ padding: '11px 18px', fontSize: 14 }}>
        Subscribe <ArrowRight size={15} />
      </button>
    </div>
  )
}

/** A membership the user has or had: status, renewal date and management actions. */
function MembershipCard({ plan, state, busyProduct, onCancel }) {
  const sub = state.subscription
  const busy = Boolean(busyProduct)
  const [statusLabel, statusTone] = sub ? STATUS_COPY[sub.status] || [sub.status, 'info'] : []
  const canCancel = sub && IN_PROGRESS.includes(sub.status) && !sub.cancel_at_cycle_end
  const canRenew = canPurchase(state) // e.g. halted / expired: start a new subscription via checkout

  const statusLines = sub ? [
    sub.current_end && (
      <div key="end">
        {sub.status === 'active' && !sub.cancel_at_cycle_end ? 'Renews on' : 'Access until'}{' '}
        <strong style={{ color: '#E2E8F0' }}>{fmtDate(sub.current_end)}</strong>
      </div>
    ),
    sub.cancel_at_cycle_end && sub.status === 'active' && <div key="cancel">Cancellation scheduled — no further charges.</div>,
    sub.status === 'pending' && <div key="pending">Your last renewal failed; Razorpay will retry automatically. Access continues meanwhile.</div>,
    sub.status === 'halted' && <div key="halted">Renewal payments failed. Subscribe again to restore access.</div>,
  ].filter(Boolean) : []
  const headingId = `membership-${plan.key}-h`
  const { Icon } = plan

  return (
    <section style={{ ...card, ...memberCard }} aria-labelledby={headingId} className="member-card">
      <div aria-hidden style={memberGlowLine} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <h3 id={headingId} style={{ ...h2, fontSize: 18, marginBottom: 0 }}>{plan.eyebrow}</h3>
        {sub && <Badge tone={statusTone}>{statusLabel}</Badge>}
      </div>

      <div style={productRow} className="member-product">
        <div style={productIcon} aria-hidden><Icon size={22} color="#fff" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={eyebrowText}>Torque Network</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk' }}>{plan.name}</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Monthly membership · Renews automatically</div>
        </div>
        <div style={{ textAlign: 'right' }} className="member-price">
          <div style={priceText}>{plan.price}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>per month</div>
        </div>
      </div>

      <div style={{ margin: '20px 0 4px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 12 }}>What’s included</div>
        <IncludedList items={plan.included} />
      </div>

      <div style={summaryBox}>
        {statusLines.length > 0 && <div style={{ ...muted, display: 'grid', gap: 4 }}>{statusLines}</div>}
        {state.entitled && <div style={{ marginTop: statusLines.length ? 12 : 0 }}><Notice tone="success">You have full member access.</Notice></div>}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {canCancel && (
            <button type="button" className="btn-ghost" disabled={busy} onClick={() => onCancel(sub)} style={{ marginTop: 4 }}>Cancel membership</button>
          )}
          {canRenew && (
            <button type="button" className="btn-primary" disabled={busy} onClick={() => navigate(checkoutPath(plan))} style={{ marginTop: 4 }}>
              Subscribe again · {priceLabel(plan)} <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

const th = { padding: '8px 8px', fontWeight: 600 }
const td = { padding: '10px 8px' }

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
