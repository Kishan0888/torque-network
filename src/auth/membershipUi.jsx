// Small shared UI pieces for the account dashboard and the checkout page
// (moved unchanged from src/auth/pages/Account.jsx).
import { Check } from 'lucide-react'
import { checkDot } from './membershipStyles'

export function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '4px 0' }}>
      <span style={{ color: '#94A3B8' }}>{label}</span>
      <span style={{ color: '#E2E8F0', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export function Badge({ tone, children }) {
  const colors = { success: '#22C55E', info: '#3B82F6', warn: '#F59E0B', error: '#EF4444' }
  const c = colors[tone] || colors.info
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
      color: c, background: `${c}1A`, border: `1px solid ${c}55` }}>{children}</span>
  )
}

export function IncludedList({ items }) {
  return (
    <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }} className="member-includes">
      {items.map((item) => (
        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>
          <span style={checkDot} aria-hidden><Check size={10} color="#22D3EE" strokeWidth={3} /></span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function MemberStyles() {
  return (
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
  )
}
