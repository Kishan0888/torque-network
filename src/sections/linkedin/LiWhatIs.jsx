/* LinkedIn version of the "What is Torque Network?" infographic (/3.png on Instagram). */
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Users, MessageSquareText, Infinity as Loop, ThumbsUp, MessageSquare, Repeat2, Eye } from 'lucide-react'
import { LiPost, Bubble, HEAD, LI } from './LiParts'

const CHIPS = [
  [ThumbsUp, 'Reactions', '#0A66C2', '#DBEAFE'],
  [MessageSquare, 'Comments', '#0F766E', '#CCFBF1'],
  [Repeat2, 'Reposts', '#15803D', '#DCFCE7'],
  [Eye, 'Profile views', '#7C3AED', '#EDE9FE'],
]
const FEATURES = [
  [BadgeCheck, 'Verified', 'Professionals'],
  [Users, 'Industry', 'Peers'],
  [MessageSquareText, 'Thoughtful', 'Comments'],
  [Loop, 'A Growing', 'Network'],
]

export default function LiWhatIs() {
  return (
    <div className="lwi">
      <div className="lwi-left">
        <h3 style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 'clamp(2.1rem,4vw,3.4rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: '#fff' }}>
          Stop Posting<br />Into the<br /><span style={{ color: '#F472B6' }}>Void.</span>
        </h3>
        <p style={{ color: '#E2E8F0', fontSize: 16, marginTop: 14, lineHeight: 1.45, maxWidth: 260 }}>Great insights deserve more than three likes.</p>
        <div style={{ width: 120, height: 3, borderRadius: 3, background: '#F472B6', marginTop: 12, opacity: 0.8 }} />
        <div className="lwi-quiet">
          <Bubble style={{ top: -78, left: 40, width: 150 }}>Is anyone even reading this?</Bubble>
          <LiPost quiet width="min(100%, 220px)" tilt={-4} />
          <div style={{ position: 'absolute', right: -6, bottom: -14, background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: '9px 12px', color: '#0F172A', fontSize: 11.5, lineHeight: 1.3, boxShadow: '0 10px 26px rgba(0,0,0,.35)' }}>
            <Eye size={14} style={{ verticalAlign: '-2px', marginRight: 5 }} />Seen by<br /><b style={{ fontSize: 14 }}>a handful</b>
          </div>
        </div>
      </div>

      <div className="lwi-mid" aria-hidden="true"><ArrowRight size={22} color="#fff" /></div>

      <div className="lwi-right">
        <div style={{ fontFamily: "Caveat,'Segoe Print',cursive", fontSize: 26, color: '#fff', transform: 'rotate(-5deg)', lineHeight: 1.05, marginBottom: 14 }}>
          Same Post.<br />Real Conversations <span style={{ color: '#FACC15' }}>♡</span>
        </div>
        <div className="lwi-post-row">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ flex: '1 1 220px', maxWidth: 250 }}>
            <LiPost width="100%" tilt={-2} />
          </motion.div>
          <div className="lwi-chips">
            {CHIPS.map(([I, label, c, bg], i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 12, background: bg, color: c, fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.25)' }}>
                <I size={15} /> {label} ↑
              </motion.div>
            ))}
          </div>
        </div>
        <h3 style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.5rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: '#fff', marginTop: 22 }}>
          Get Real<br /><span style={{ color: '#86EFAC' }}>Engagement.</span>
        </h3>
        <p style={{ color: '#E2E8F0', fontSize: 15.5, marginTop: 8, lineHeight: 1.45 }}>Verified peers from your industry react, comment and repost.</p>
      </div>

      <div className="lwi-foot">
        <div className="lwi-feats">
          {FEATURES.map(([I, a, b]) => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F1F5F9', fontSize: 13.5, lineHeight: 1.2 }}>
              <I size={26} color="#FACC15" strokeWidth={1.6} /><span>{a}<br />{b}</span>
            </div>
          ))}
        </div>
        <a href="/signup?plan=linkedin" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 28px', borderRadius: 999, background: '#FACC15', color: '#0F172A', fontWeight: 800, fontSize: 16, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(250,204,21,.3)' }}>
          Join Torque for LinkedIn <ArrowRight size={18} />
        </a>
      </div>

      <style>{`
        .lwi{ position:relative; display:grid; grid-template-columns:1fr auto 1.15fr; gap:0 26px; padding:44px 44px 30px; border-radius:24px; overflow:hidden; text-align:left;
          background:radial-gradient(circle at 18% 40%, rgba(236,72,153,.13), transparent 45%), radial-gradient(circle at 78% 35%, rgba(10,102,194,.35), transparent 50%), linear-gradient(120deg,#12131c 0%,#151a2c 48%,#0b2340 100%); }
        .lwi-left{ position:relative; }
        .lwi-quiet{ position:relative; margin-top:96px; max-width:260px; }
        .lwi-mid{ align-self:center; width:46px; height:46px; border-radius:50%; border:1.5px solid rgba(255,255,255,.5); display:flex; align-items:center; justify-content:center; }
        .lwi-post-row{ display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
        .lwi-chips{ display:flex; flex-direction:column; gap:9px; }
        .lwi-foot{ grid-column:1 / -1; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-top:34px; padding-top:22px; border-top:1px solid rgba(255,255,255,.1); }
        .lwi-feats{ display:flex; gap:26px; flex-wrap:wrap; }
        @media(max-width:900px){
          .lwi{ grid-template-columns:1fr; padding:30px 22px 26px; gap:0; }
          .lwi-mid{ transform:rotate(90deg); margin:30px auto 22px; }
          .lwi-quiet{ margin-left:auto; margin-right:auto; }
          .lwi-feats{ display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; }
          .lwi-foot a{ width:100%; justify-content:center; }
          .lwi-chips{ flex-direction:row; flex-wrap:wrap; }
        }
      `}</style>
    </div>
  )
}
