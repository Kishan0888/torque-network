/**
 * /checkout?plan=instagram|linkedin — dedicated order summary for ONE product.
 *
 * The product is fixed when the page opens (URL → remembered choice → signup
 * metadata, see lib/planSelection) and never changes while the user is here.
 * Payment reuses the existing flow: /api/subscriptions/create with
 * { product } (server maps it to RAZORPAY_PLAN_ID / RAZORPAY_LINKEDIN_PLAN_ID),
 * Razorpay Checkout, then /api/subscriptions/verify.
 */
import { useCallback, useEffect, useState } from 'react'
import { Lock, ShieldCheck, ArrowRight, RotateCcw, Zap, Loader, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { apiFetch } from '../../lib/api'
import { openSubscriptionCheckout, preloadCheckout } from '../../lib/razorpayCheckout'
import { navigate, Redirect } from '../../lib/router'
import { selectedPlan, withPlan, forgetPlan } from '../../lib/planSelection'
import { useAuth } from '../AuthProvider'
import { AuthShell, Notice } from '../ui'
import { planByKey, priceLabel, ownsProduct, productStateFrom } from '../plans'
import {
  card, muted, memberCard, memberGlowLine, productRow, productIcon, priceText, summaryBox,
  checkoutBtn, trustRow, trustItem, eyebrowText,
} from '../membershipStyles'
import { SummaryRow, IncludedList, MemberStyles } from '../membershipUi'

export default function Checkout() {
  const { user } = useAuth()
  // Locked for the life of this page, so the product can't switch mid-flow.
  const [plan] = useState(() => planByKey(selectedPlan({ user })))
  const [membership, setMembership] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null) // { active: boolean } after a verified payment
  const [notice, setNotice] = useState(() =>
    new URLSearchParams(window.location.search).get('verified') ? ['success', 'Email verified — you can complete your purchase now.'] : null,
  )

  const loadMembership = useCallback(async () => {
    try {
      setLoadError('')
      const data = await apiFetch('/api/subscriptions/me')
      setMembership(data)
      return data
    } catch (e) {
      setLoadError(e.message)
      return null
    }
  }, [])

  useEffect(() => {
    if (!plan) return
    // Keep the chosen product in the URL so a refresh shows the same checkout.
    const here = window.location.pathname + window.location.search
    const locked = withPlan(here, plan.key)
    if (locked !== here) window.history.replaceState({}, '', locked)
    preloadCheckout()
    loadMembership()
  }, [plan, loadMembership])

  if (!plan) return <Redirect to="/account" />

  const state = productStateFrom(membership, plan.key)
  const alreadyOwned = ownsProduct(state)
  const unavailable = Boolean(membership) && !state?.available

  // Clear the remembered choice once this purchase is finished.
  function clearRememberedPlan() {
    forgetPlan()
    if (user?.user_metadata?.selected_plan) {
      supabase.auth.updateUser({ data: { selected_plan: null } }).catch(() => {})
    }
  }

  async function waitForActivation() {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const data = await loadMembership()
      if (data?.products?.[plan.key]?.entitled) return true
    }
    return false
  }

  // Same flow as before: create → Razorpay Checkout → verify.
  async function proceedToPayment() {
    setNotice(null)
    setBusy(true)
    preloadCheckout()
    try {
      const order = await apiFetch('/api/subscriptions/create', { method: 'POST', body: { product: plan.key } })
      const result = await openSubscriptionCheckout(order)
      if (!result) {
        setNotice(['info', 'Payment window closed. You have not been charged.'])
        return
      }
      setNotice(['info', 'Payment received — confirming your membership…'])
      const verified = await apiFetch('/api/subscriptions/verify', { method: 'POST', body: result })
      const active = verified.status === 'active' ? (await loadMembership(), true) : await waitForActivation()
      clearRememberedPlan()
      setNotice(null)
      setDone({ active })
    } catch (e) {
      setNotice(['error', e.message])
      await loadMembership()
    } finally {
      setBusy(false)
    }
  }

  // Leaving checkout for the dashboard: forget the pending choice.
  const goToAccount = () => {
    forgetPlan()
    navigate('/account', { replace: true })
  }

  const { Icon } = plan

  return (
    <AuthShell title="Checkout" subtitle={`Signed in as ${user.email}`} wide>
      {notice && <Notice tone={notice[0]}>{notice[1]}</Notice>}
      {loadError && <Notice tone="error">{loadError}</Notice>}

      <section style={{ ...card, ...memberCard }} aria-labelledby="checkout-h" className="member-card">
        <div aria-hidden style={memberGlowLine} />
        <h2 id="checkout-h" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          {done ? 'Order complete' : 'Order summary'}
        </h2>

        {/* Selected product (only this one) */}
        <div style={productRow} className="member-product">
          <div style={productIcon} aria-hidden><Icon size={22} color="#fff" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={eyebrowText}>{plan.eyebrow}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk' }}>{plan.name}</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Monthly membership · Renews automatically</div>
          </div>
          <div style={{ textAlign: 'right' }} className="member-price">
            <div style={priceText}>{plan.price}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>per month</div>
          </div>
        </div>

        {done ? (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700, color: '#4ADE80', marginBottom: 8 }}>
              <CheckCircle2 size={20} /> {done.active ? 'Payment successful — your membership is active.' : 'Payment verified.'}
            </div>
            <p style={{ ...muted, marginBottom: 18 }}>
              {done.active
                ? `Welcome to ${plan.eyebrow}. You'll be billed ${priceLabel(plan)} until you cancel.`
                : 'Activation can take a minute. Your account page will show it as Active shortly.'}
            </p>
            <button type="button" className="btn-primary" onClick={goToAccount} style={checkoutBtn(false)}>
              Go to my account <ArrowRight size={17} />
            </button>
          </div>
        ) : !membership && !loadError ? (
          <p style={{ ...muted, marginTop: 18 }}>Preparing your order…</p>
        ) : unavailable ? (
          <div style={{ marginTop: 18 }}>
            <Notice tone="warn">{plan.eyebrow} ({priceLabel(plan)}) isn’t available for checkout yet. Please check back shortly.</Notice>
            <button type="button" className="btn-ghost" onClick={goToAccount}>Go to my account</button>
          </div>
        ) : alreadyOwned ? (
          <div style={{ marginTop: 18 }}>
            <Notice tone="success">You already have {plan.eyebrow}. There’s nothing to pay — manage it from your account.</Notice>
            <button type="button" className="btn-primary" onClick={goToAccount} style={checkoutBtn(false)}>
              Manage my membership <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <>
            <div style={{ margin: '20px 0 4px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 12 }}>What’s included</div>
              <IncludedList items={plan.included} />
            </div>

            <div style={summaryBox} aria-label="Order summary">
              <SummaryRow label="Product" value={`${plan.eyebrow} — ${plan.name}`} />
              <SummaryRow label="Monthly price" value={priceLabel(plan)} />
              <SummaryRow label="Billing frequency" value="Monthly (recurring), until you cancel" />
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Amount due today</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Space Grotesk', letterSpacing: '-0.02em' }}>{plan.price}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>Then {plan.price} every month. Cancel anytime from your account.</div>
            </div>

            <button type="button" className="btn-primary" disabled={busy} onClick={proceedToPayment} style={checkoutBtn(busy)}>
              {busy ? (
                <><Loader size={17} style={{ animation: 'member-spin 0.8s linear infinite' }} /> Opening secure payment…</>
              ) : (
                <><Lock size={16} /> Proceed to Payment<span className="member-btn-price">&nbsp;· {plan.price}</span> <ArrowRight size={17} /></>
              )}
            </button>

            <div style={trustRow} className="member-trust">
              <span style={trustItem}><ShieldCheck size={14} color="#22C55E" /> Secure payment via Razorpay</span>
              <span style={trustItem}><RotateCcw size={14} color="#22D3EE" /> Cancel anytime</span>
              <span style={trustItem}><Zap size={14} color="#F59E0B" /> Access starts after payment</span>
            </div>
          </>
        )}
      </section>

      {!done && (
        <p style={{ ...muted, textAlign: 'center', fontSize: 12 }}>
          <button type="button" onClick={goToAccount} disabled={busy}
            style={{ background: 'none', border: 'none', padding: 0, color: '#94A3B8', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>
            Go to my account instead
          </button>
        </p>
      )}
      <MemberStyles />
    </AuthShell>
  )
}
