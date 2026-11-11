/* LinkedIn version of the four-step "How it works" infographic (/2.png on Instagram). */
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Link2, Users, CalendarDays, BookOpen, Infinity as Loop } from 'lucide-react'
import { LiPost, HEAD, LI } from './LiParts'

const AV = ['PS', 'RK', 'AM', 'NV', 'SG', 'JD']
const AV_BG = ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F87171']

function Visual({ n }) {
  if (n === 1) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 14, boxShadow: '0 12px 28px rgba(0,0,0,.1)', fontSize: 11.5, color: '#334155' }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 10, textAlign: 'center' }}>Set up your profile</div>
      <div style={{ color: '#64748B', fontSize: 10.5, marginBottom: 4 }}>Your industry</div>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '7px 9px', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>Finance &amp; Banking <ChevronDown size={13} /></div>
      <div style={{ color: '#64748B', fontSize: 10.5, marginBottom: 4 }}>LinkedIn profile</div>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '7px 9px', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, color: '#64748B' }}><Link2 size={12} /> linkedin.com/in/you</div>
      <div style={{ background: '#FACC15', borderRadius: 9, padding: '8px', textAlign: 'center', fontWeight: 800, color: '#0F172A' }}>Continue</div>
    </div>
  )
  if (n === 2) return (
    <div style={{ position: 'relative' }}>
      <LiPost width="100%" stats={{ reactions: 'Just posted', comments: '0', reposts: '0' }} text={<>How we cut onboarding time by 40% 🚀<br /><span style={{ color: '#888' }}>A thread on what actually worked…</span></>} />
      <div style={{ position: 'absolute', left: '50%', bottom: -16, transform: 'translateX(-50%)', background: LI, color: '#fff', fontWeight: 700, fontSize: 11.5, padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(10,102,194,.4)' }}>
        Submit to network →
      </div>
    </div>
  )
  if (n === 3) return (
    <div style={{ position: 'relative', height: 200 }}>
      <div style={{ position: 'absolute', inset: '18px 22px', borderRadius: '50%', border: '1.5px dashed rgba(34,160,107,.45)' }} />
      {AV.map((a, i) => {
        const ang = (i / AV.length) * Math.PI * 2 - Math.PI / 2
        return (
          <motion.div key={a} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
            style={{ position: 'absolute', left: `calc(50% + ${Math.cos(ang) * 44}% - 17px)`, top: `calc(50% + ${Math.sin(ang) * 40}% - 17px)`, width: 34, height: 34, borderRadius: '50%', background: AV_BG[i], color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>{a}</motion.div>
        )
      })}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 92, background: '#fff', borderRadius: 10, padding: 8, boxShadow: '0 10px 24px rgba(0,0,0,.15)', textAlign: 'center' }}>
        <div style={{ height: 38, borderRadius: 6, background: 'linear-gradient(135deg,#DBEAFE,#BAE6FD)', marginBottom: 6 }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: LI }}>👍💡❤️ rising</div>
      </div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {[['PS', '#F472B6', 'Great framework, Rohan. The point on pricing is spot on.'], ['RK', '#60A5FA', 'Saving this for our next sprint planning 🙌'], ['AM', '#34D399', 'Reposting for my network, very useful.']].map(([a, c, t], i) => (
        <motion.div key={a} initial={{ opacity: 0, x: i % 2 ? 14 : -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }}
          style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#fff', borderRadius: 12, padding: '9px 10px', boxShadow: '0 8px 20px rgba(0,0,0,.08)', marginLeft: i === 1 ? 18 : 0 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: c, color: '#fff', fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a}</span>
          <span style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>{t}</span>
        </motion.div>
      ))}
    </div>
  )
}

const STEPS = [
  { n: 1, title: ['Sign Up &', 'Pick Your Industry'], desc: 'Choose your industry and add your LinkedIn profile. Your dashboard is ready in minutes.', bg: '#FDECE8', c: '#EF5A5A', note: 'Your growth journey starts here' },
  { n: 2, title: ['Post &', 'Submit'], desc: 'Publish on LinkedIn, then paste the post link in your dashboard. Up to 2 posts a week.', bg: '#E3EFFD', c: '#1D6FE0', note: 'Share your expertise' },
  { n: 3, title: ['Your Peers', 'Engage'], desc: 'Members from your industry react, comment thoughtfully and repost.', bg: '#E0F5EA', c: '#22A06B', note: 'Real professionals, real engagement' },
  { n: 4, title: ['Give Back', '& Grow'], desc: "React to and comment on your peers' posts. What you give comes back to you.", bg: '#EEE9FC', c: '#7C5CE6', note: 'Support · Grow · Repeat ♡' },
]
const STATS = [
  [Users, '9', 'Industry communities'],
  [CalendarDays, '2 posts', 'You can submit each week'],
  [BookOpen, 'Growth', 'Playbook videos'],
  [Loop, 'A stronger', 'Professional community'],
]

export default function LiHowSteps() {
  return (
    <div className="lhs">
      <div className="lhs-steps">
        {STEPS.map((s, i) => (
          <div key={s.n} className="lhs-cell">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
              className="lhs-card" style={{ background: s.bg }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 44, height: 44, borderRadius: '50%', background: s.c, color: '#fff', fontFamily: HEAD, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</span>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 19, lineHeight: 1.08, color: '#0F172A' }}>{s.title[0]}<br />{s.title[1]}</div>
              </div>
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, margin: '12px 0 16px' }}>{s.desc}</p>
              <div style={{ marginTop: 'auto' }}><Visual n={s.n} /></div>
              <div style={{ fontFamily: "Caveat,'Segoe Print',cursive", fontSize: 17, color: '#1E293B', marginTop: s.n === 2 ? 26 : 14, textAlign: 'center' }}>{s.note}</div>
            </motion.div>
            {i < STEPS.length - 1 && <div className="lhs-arrow" aria-hidden="true"><ArrowRight size={18} color="#0F172A" /></div>}
          </div>
        ))}
      </div>
      <div className="lhs-stats">
        {STATS.map(([I, a, b]) => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <I size={30} color="#0F172A" strokeWidth={1.6} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: '#0F172A' }}>{a}</div>
              <div style={{ fontSize: 11.5, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{b}</div>
            </div>
          </div>
        ))}
        <div className="lhs-hand">More Visibility,<br /><span style={{ color: LI }}>Better Opportunities</span> ♡</div>
      </div>
      <style>{`
        .lhs{ background:#fff; border-radius:24px; padding:22px 18px 22px; text-align:left; }
        .lhs-steps{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:22px; }
        .lhs-cell{ position:relative; display:flex; }
        .lhs-card{ flex:1; border-radius:20px; padding:18px 16px 14px; display:flex; flex-direction:column; }
        .lhs-arrow{ position:absolute; right:-20px; top:120px; z-index:2; width:18px; display:flex; justify-content:center; }
        .lhs-stats{ display:flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap; padding:22px 10px 4px; }
        .lhs-hand{ font-family:Caveat,'Segoe Print',cursive; font-size:21px; color:#0F172A; transform:rotate(-5deg); line-height:1.05; }
        @media(max-width:1000px){ .lhs-steps{ grid-template-columns:repeat(2,minmax(0,1fr)); } .lhs-arrow{ display:none; } }
        @media(max-width:560px){
          .lhs{ padding:14px 12px; }
          .lhs-steps{ grid-template-columns:1fr; gap:14px; }
          .lhs-stats{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          .lhs-hand{ grid-column:1 / -1; text-align:center; }
        }
      `}</style>
    </div>
  )
}
