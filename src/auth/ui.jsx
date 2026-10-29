/* Shared visual building blocks for the account pages, matching the landing page palette. */
import { Link } from '../lib/router'

export function AuthShell({ title, subtitle, children, wide = false }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050816', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 900, borderRadius: '50%', opacity: 0.08, pointerEvents: 'none',
        background: 'radial-gradient(circle,#3B82F6,#22D3EE,transparent 65%)', filter: 'blur(80px)',
      }} />
      <header style={{ position: 'relative', zIndex: 1, padding: '20px 24px', display: 'flex', justifyContent: 'center' }}>
        <a href="/" aria-label="Torque Network home">
          <img src="/logo-sm.png" alt="Torque Network" style={{ height: 52, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(59,130,246,.5))' }} />
        </a>
      </header>
      <main style={{ position: 'relative', zIndex: 1, padding: '24px 16px 72px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: wide ? 760 : 440, borderRadius: 24, padding: '36px 32px',
          background: 'rgba(13,19,38,0.75)', backdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }} className="auth-card">
          {title && <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{title}</h1>}
          {subtitle && <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, marginBottom: 26 }}>{subtitle}</p>}
          {children}
        </div>
      </main>
      <style>{`@media(max-width:520px){.auth-card{padding:28px 20px !important;}}`}</style>
    </div>
  )
}

export function Field({ label, hint, ...inputProps }) {
  const id = inputProps.id || inputProps.name
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>{label}</label>
      <input id={id} className="form-input" {...inputProps} />
      {hint && <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>{hint}</div>}
    </div>
  )
}

export function SubmitButton({ busy, children, ...rest }) {
  return (
    <button type="submit" className="btn-primary" disabled={busy}
      style={{ width: '100%', marginTop: 6, opacity: busy ? 0.7 : 1, cursor: busy ? 'wait' : 'pointer' }} {...rest}>
      {busy ? 'Please wait…' : children}
    </button>
  )
}

export function Notice({ tone = 'info', children }) {
  const tones = {
    info: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.3)', '#BFDBFE'],
    success: ['rgba(34,197,94,0.1)', 'rgba(34,197,94,0.3)', '#BBF7D0'],
    error: ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.35)', '#FECACA'],
    warn: ['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.35)', '#FDE68A'],
  }
  const [bg, border, color] = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} style={{
      background: bg, border: `1px solid ${border}`, color, fontSize: 13, lineHeight: 1.6,
      borderRadius: 12, padding: '12px 14px', marginBottom: 18,
    }}>{children}</div>
  )
}

export function FooterLinks({ children }) {
  return <div style={{ marginTop: 22, fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 2 }}>{children}</div>
}

export function TextLink({ to, children }) {
  return <Link to={to} style={{ color: '#22D3EE', textDecoration: 'none', fontWeight: 600 }}>{children}</Link>
}

export function NotConfigured() {
  return (
    <AuthShell title="Accounts are coming soon" subtitle="Member accounts are not switched on yet. Please check back shortly.">
      <a href="/" className="btn-ghost" style={{ width: '100%' }}>Back to Torque Network</a>
    </AuthShell>
  )
}

export function Loading() {
  return (
    <AuthShell>
      <p style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center' }}>Loading…</p>
    </AuthShell>
  )
}

export const MIN_PASSWORD = 8
