/* Building blocks for the LinkedIn versions of the home-page infographics. */
import { ThumbsUp, MessageSquare, Repeat2, Send, Check, X } from 'lucide-react'
import { LinkedInGlyph } from '../../components/BrandGlyphs'

export const LI = '#0A66C2'
export const LI_SOFT = '#3B9BFF'
export const HEAD = "'Space Grotesk', Inter, sans-serif"

/** Same-post-different-outcome mock of a LinkedIn post. `quiet` = the "before" state. */
export function LiPost({ quiet = false, name = 'Ananya Rao', role = 'Senior Analyst · Finance', initials = 'AR', text, stats, width = '100%', tilt = 0 }) {
  return (
    <div style={{
      width, transform: tilt ? `rotate(${tilt}deg)` : undefined,
      background: '#fff', color: '#1D2226', borderRadius: 14, padding: '12px 13px 8px',
      boxShadow: quiet ? '0 14px 34px rgba(0,0,0,0.45)' : '0 20px 50px rgba(10,102,194,0.28)',
      border: quiet ? '1px solid rgba(0,0,0,0.08)' : `1px solid ${LI}33`, textAlign: 'left',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: quiet ? '#94A3B8' : `linear-gradient(135deg,${LI},#22D3EE)`, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials}</div>
        <div style={{ lineHeight: 1.2, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 9.5, color: '#666' }}>{role}</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: 3, background: LI, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LinkedInGlyph size={10} color="#fff" /></div>
      </div>
      <div style={{ fontSize: 10.5, lineHeight: 1.45, color: '#333', marginBottom: 8 }}>
        {text || <>5 lessons from closing my first big deal 📈<br /><span style={{ color: '#888' }}>1. Listen more than you pitch…</span></>}
      </div>
      <div style={{ height: 54, borderRadius: 8, marginBottom: 7, background: quiet ? 'linear-gradient(135deg,#E2E8F0,#CBD5E1)' : 'linear-gradient(135deg,#DBEAFE,#BAE6FD)', display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 10px 8px' }}>
        {[30, 44, 38, 52, 46].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * (quiet ? 0.45 : 1)}%`, borderRadius: 3, background: quiet ? '#94A3B8' : i === 3 ? LI : '#60A5FA' }} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#666', paddingBottom: 6, borderBottom: '1px solid #eee' }}>
        <span>{quiet ? '👍 ' : '👍❤️💡 '}{stats?.reactions ?? (quiet ? '3' : '128')}</span>
        <span>{stats?.comments ?? (quiet ? '0' : '24')} comments · {stats?.reposts ?? (quiet ? '0' : '9')} reposts</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 6, fontSize: 9.5, color: '#666' }}>
        {[[ThumbsUp, 'Like'], [MessageSquare, 'Comment'], [Repeat2, 'Repost'], [Send, 'Send']].map(([I, l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}><I size={10} />{l}</span>
        ))}
      </div>
    </div>
  )
}

export function Bubble({ children, style }) {
  return (
    <div style={{ position: 'absolute', padding: '12px 16px', borderRadius: '50% 46% 52% 48% / 55% 50% 50% 45%', border: '1.5px solid rgba(255,255,255,0.75)', color: '#F8FAFC', fontSize: 16, fontWeight: 600, textAlign: 'center', lineHeight: 1.35, background: 'rgba(0,0,0,0.35)', fontFamily: "Caveat,'Segoe Print',cursive", ...style }}>
      {children}
    </div>
  )
}

export function Row({ ok, children, dark }) {
  const c = ok ? '#22C55E' : '#EF4444'
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.45, color: dark ? '#E2E8F0' : '#1E293B' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {ok ? <Check size={13} color="#fff" strokeWidth={3} /> : <X size={13} color="#fff" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </div>
  )
}

export function Pill({ children, bg, color }) {
  return <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: bg, color, fontWeight: 800, fontSize: 12.5, letterSpacing: '0.04em' }}>{children}</span>
}
