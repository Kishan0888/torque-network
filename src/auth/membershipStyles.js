// Shared styles for the account dashboard and the checkout page
// (moved unchanged from src/auth/pages/Account.jsx).
export const card = {
  borderRadius: 18, padding: '22px 22px', marginBottom: 18,
  background: 'rgba(5,8,22,0.55)', border: '1px solid rgba(255,255,255,0.07)',
}
export const h2 = { fontSize: 17, fontWeight: 700, marginBottom: 12 }
export const muted = { fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }

export const memberCard = {
  position: 'relative', overflow: 'hidden', padding: '26px 26px',
  background: 'linear-gradient(180deg, rgba(13,19,38,0.95), rgba(5,8,22,0.9))',
  border: '1px solid rgba(59,130,246,0.28)',
  boxShadow: '0 0 0 1px rgba(34,211,238,0.04) inset, 0 18px 50px rgba(0,0,0,0.45), 0 0 40px rgba(59,130,246,0.08)',
}
export const memberGlowLine = {
  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
  background: 'linear-gradient(90deg, transparent, #3B82F6, #22D3EE, transparent)',
}
export const productRow = {
  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 16px', borderRadius: 16,
  background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
}
export const productIcon = {
  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(135deg, #2563EB, #22D3EE)', boxShadow: '0 0 24px rgba(34,211,238,0.35)',
}
export const priceText = {
  fontSize: 30, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.03em', lineHeight: 1,
  background: 'linear-gradient(135deg, #3B82F6, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}
export const checkDot = {
  width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)',
}
export const summaryBox = {
  marginTop: 18, marginBottom: 18, padding: '16px 18px', borderRadius: 14,
  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
}
export const checkoutBtn = (busy) => ({
  width: '100%', justifyContent: 'center', padding: '17px 24px', fontSize: 16, fontWeight: 700, borderRadius: 14,
  boxShadow: '0 10px 30px rgba(37,99,235,0.35), 0 0 30px rgba(34,211,238,0.15)',
  opacity: busy ? 0.8 : 1, cursor: busy ? 'wait' : 'pointer', whiteSpace: 'normal',
})
export const trustRow = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 18px', marginTop: 14,
}
export const trustItem = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' }
export const eyebrowText = { fontSize: 12, fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }
