import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { Link } from '../../lib/router'
import { useDash, WhatsAppButton, PageHead, Notice } from '../DashboardApp'
import { PLANS, priceLabel, STATUS_COPY, IN_PROGRESS, fmtDate, fmtAmount } from '../../auth/plans'

const PLATFORM_COMMUNITY = { instagram: 'Torque for Instagram', linkedin: 'Torque for LinkedIn' }
const PAYMENT_STATUS = { captured: ['Paid', 'paid'], authorized: ['Authorised', 'neutral'], failed: ['Failed', 'failed'], refunded: ['Refunded', 'neutral'] }

export default function Subscription() {
  const d = useDash()
  const [billing, setBilling] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    apiFetch('/api/dashboard?action=billing').then(setBilling).catch((e) => setMsg(['error', e.message]))
  }, [])

  // Newest subscription per product (same rows the account page uses).
  const latest = (product) => d.subscriptions.find((s) => s.product === product && s.status !== 'created')

  async function cancel(plan, sub) {
    const text = sub.status === 'active'
      ? `Cancel ${plan.eyebrow}? You'll keep access until ${fmtDate(sub.current_end)} and won't be charged again.`
      : `Cancel ${plan.eyebrow} now?`
    if (!window.confirm(text)) return
    setBusy(plan.key); setMsg(null)
    try {
      const res = await apiFetch('/api/subscriptions/cancel', { method: 'POST', body: { product: plan.key } })
      setMsg(['success', res.atCycleEnd ? `Cancellation scheduled. Access continues until ${fmtDate(res.accessUntil)}.` : 'Your membership has been cancelled.'])
      await d.reload()
    } catch (e) {
      setMsg(['error', e.message])
    } finally {
      setBusy(null)
    }
  }

  async function openInvoice(id) {
    setBusy(id); setMsg(null)
    const win = window.open('', '_blank')
    try {
      const { url } = await apiFetch(`/api/dashboard?action=invoice&payment=${encodeURIComponent(id)}`)
      if (win) win.location.href = url
      else window.location.assign(url)
    } catch (e) {
      win?.close()
      setMsg(['error', e.message])
    } finally {
      setBusy(null)
    }
  }

  const methodFor = (product) => billing?.payments.find((p) => p.product === product && p.method)?.method
  const METHOD = { upi: 'UPI AutoPay', card: 'Card', emandate: 'Bank mandate', netbanking: 'Netbanking' }

  return (
    <>
      <PageHead title="Subscription" subtitle="Manage your plan, payments and payment receipts." />
      {msg && <Notice tone={msg[0]}>{msg[1]}</Notice>}
      <div className="tn-grid tn-grid-2-1" style={{ marginBottom: 14, alignItems: 'stretch' }}>
        <div className="tn-grid">
          {PLANS.filter((p) => latest(p.key)).map((plan) => {
            const sub = latest(plan.key)
            const [label, tone] = STATUS_COPY[sub.status] || [sub.status, 'neutral']
            const canCancel = IN_PROGRESS.includes(sub.status) && !sub.cancel_at_cycle_end
            const method = methodFor(plan.key)
            return (
              <div key={plan.key} className="tn-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ margin: 0 }}>Your plan</h2>
                  <span className={`tn-badge ${tone === 'success' ? 'active' : tone === 'error' ? 'failed' : tone === 'warn' ? 'pending' : 'neutral'}`}>{label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 2px' }}>{plan.eyebrow} · {priceLabel(plan)}</div>
                <div className="tn-small">
                  {sub.current_end ? `${sub.status === 'active' && !sub.cancel_at_cycle_end ? 'Renews on' : 'Access until'} ${fmtDate(sub.current_end)}` : 'Activating'}
                  {method ? ` · ${METHOD[method] || method}` : ''}
                </div>
                {sub.cancel_at_cycle_end && <div className="tn-small" style={{ marginTop: 4 }}>Cancellation scheduled — no further charges.</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  {!IN_PROGRESS.includes(sub.status) && <Link to={`/checkout?plan=${plan.key}`} className="tn-btn gold small">Subscribe again</Link>}
                  {canCancel && <button className="tn-btn danger small" disabled={busy === plan.key} onClick={() => cancel(plan, sub)}>Cancel subscription</button>}
                </div>
              </div>
            )
          })}
          {PLANS.filter((p) => !d.memberships[p.key] && !latest(p.key)).map((plan) => (
            <div key={plan.key} className="tn-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div><div style={{ fontWeight: 800 }}>{plan.eyebrow}</div><div className="tn-small">{plan.name} · {priceLabel(plan)}</div></div>
              <Link to={`/checkout?plan=${plan.key}`} className="tn-btn small">Add this membership</Link>
            </div>
          ))}
        </div>
        <div className="tn-card dark">
          <h2>WhatsApp communities</h2>
          <p className="tn-small" style={{ margin: '0 0 6px', lineHeight: 1.6 }}>Daily tasks and updates from your community.</p>
          {d.owned.map((p) => {
            const joined = d.platforms[p]?.whatsapp_joined_at
            return (
              <div key={p} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{PLATFORM_COMMUNITY[p]}</div>
                <div className="tn-small" style={{ marginBottom: 10 }}>{joined ? `You joined on ${fmtDate(joined)}.` : 'Not joined yet.'}</div>
                <WhatsAppButton className="tn-btn green small" platform={p} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="tn-card">
        <h2>Payment receipts</h2>
        {!billing ? <p className="tn-loading" style={{ padding: 0 }}>Loading…</p> : billing.payments.length === 0 ? <p className="tn-small">No payments yet.</p> : (
          <div className="tn-table-wrap">
            <table className="tn-table">
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th /></tr></thead>
              <tbody>
                {billing.payments.map((p) => {
                  const [label, cls] = PAYMENT_STATUS[p.status] || [p.status, 'neutral']
                  const plan = PLANS.find((x) => x.key === p.product)
                  return (
                    <tr key={p.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(p.created_at)}</td>
                      <td>{plan ? `${plan.eyebrow} — monthly` : 'Torque Network membership'}</td>
                      <td>{fmtAmount(p.amount, p.currency)}</td>
                      <td><span className={`tn-badge ${cls}`}>{label}</span></td>
                      <td>{p.hasInvoice && p.status === 'captured' && (
                        <button className="tn-link" disabled={busy === p.id} onClick={() => openInvoice(p.id)}>{busy === p.id ? 'Opening…' : 'Download receipt'}</button>
                      )}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
