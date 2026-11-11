import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import {
  ArrowRight, Users, PenLine, TrendingUp, UserSearch, Landmark, Handshake, Megaphone,
  Code2, BrainCircuit, Boxes, Lightbulb, Stethoscope,
} from 'lucide-react'
import { DOMAINS } from '../../shared/memberConfig.js'
import { LinkedInGlyph } from '../components/BrandGlyphs'

const LI = '#0A66C2'
const LI_SOFT = '#3B9BFF'
const ICONS = {
  'HR & Talent': UserSearch,
  'Finance & Banking': Landmark,
  'Sales & BD': Handshake,
  'Marketing & Creative': Megaphone,
  'IT & Software': Code2,
  'Data & AI': BrainCircuit,
  Product: Boxes,
  Consulting: Lightbulb,
  'Healthcare & Pharma': Stethoscope,
}

const FEATURES = [
  { Icon: Users, title: 'Peers from your own industry', desc: 'You are matched with professionals in your domain, so the reactions and comments on your posts come from people who understand your work.' },
  { Icon: PenLine, title: 'Learn what makes posts land', desc: 'The Growth Playbook gives you short videos on writing LinkedIn posts that start conversations, and your dashboard shows who engaged with each post.' },
  { Icon: TrendingUp, title: 'Credibility that compounds', desc: 'Post consistently, get genuine early engagement, and let LinkedIn show your work to more of the right people over time.' },
]

function IndustryTile({ name, topics, i, inView }) {
  const Icon = ICONS[name] || Boxes
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 16, padding: '16px 16px 14px', cursor: 'default',
        background: hover ? 'rgba(10,102,194,0.16)' : 'rgba(13,19,38,0.7)',
        border: `1px solid ${hover ? 'rgba(59,155,255,0.45)' : 'rgba(255,255,255,0.07)'}`,
        transition: 'background .25s, border-color .25s, transform .25s',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: hover ? LI : 'rgba(10,102,194,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, transition: 'background .25s' }}>
        <Icon size={17} color={hover ? '#fff' : LI_SOFT} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.45 }}>{topics.slice(0, 3).join(' · ')}</div>
    </motion.div>
  )
}

export default function LinkedInShowcase() {
  const [ref, inView] = useInView()
  const industries = Object.entries(DOMAINS.linkedin)
  return (
    <section id="linkedin" className="section-py" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="aurora" style={{ position: 'absolute', top: '15%', left: '-10%', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,102,194,0.2),transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={ref} className="li-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.05fr)', gap: 56, alignItems: 'center' }}>
          {/* Left: story */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span className="section-tag" style={{ color: LI_SOFT, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LinkedInGlyph size={13} color={LI_SOFT} /> Torque for LinkedIn
              </span>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16 }}>
                Your Expertise<br />
                <span style={{ background: `linear-gradient(135deg,${LI_SOFT},#22D3EE)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Deserves an Audience.</span>
              </h2>
              <p style={{ fontSize: 15.5, color: '#94A3B8', lineHeight: 1.7, maxWidth: 520, marginBottom: 30 }}>
                Most professionals post a few times, hear nothing back and stop. Torque for LinkedIn gives your posts early, genuine engagement from peers in your field, so every post starts strong and your profile builds real credibility.
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, x: -18 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(10,102,194,0.16)', border: '1px solid rgba(59,155,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={LI_SOFT} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, color: '#F1F5F9', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
              className="li-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="/signup?plan=linkedin" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 26px', borderRadius: 14, background: `linear-gradient(135deg,${LI},#2D8CFF)`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 12px 30px -10px rgba(10,102,194,0.7)' }}>
                Join for ₹500/month <ArrowRight size={16} />
              </a>
              <a href="/landing-linkedin" className="btn-ghost" style={{ fontSize: 14.5, padding: '14px 22px' }}>Learn more</a>
            </motion.div>
          </div>

          {/* Right: industries */}
          <motion.div initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ borderRadius: 26, padding: 26, background: 'rgba(8,12,28,0.75)', border: '1px solid rgba(59,155,255,0.18)', boxShadow: '0 30px 80px -40px rgba(10,102,194,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>Pick your industry community</div>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>9 industries · more coming</div>
            </div>
            <div className="li-tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12 }}>
              {industries.map(([name, topics], i) => <IndustryTile key={name} name={name} topics={topics} i={i} inView={inView} />)}
            </div>
            <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 12, background: 'rgba(10,102,194,0.1)', border: '1px dashed rgba(59,155,255,0.3)', fontSize: 13, color: '#94A3B8', lineHeight: 1.55 }}>
              Built for professionals building their presence: early-career talent, specialists, consultants and founders.
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:960px){.li-grid{grid-template-columns:1fr !important; gap:40px !important;}}
        @media(max-width:560px){.li-tiles{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}}
      `}</style>
    </section>
  )
}
