import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ArrowRight, Check, Eye, Bookmark, Send, ThumbsUp, MessageSquare, Repeat2 } from 'lucide-react'
import { InstagramGlyph, LinkedInGlyph } from '../components/BrandGlyphs'
import { usePlatform } from '../context/PlatformContext'

/**
 * "One network. Two platforms." — sits right under the hero and makes it clear
 * Torque runs a separate network for Instagram creators and LinkedIn professionals.
 */
const PLATFORMS = [
  {
    key: 'instagram',
    tag: 'Torque for Instagram',
    title: 'For creators who want reach beyond their followers',
    audience: 'Creators in every niche: food, travel, fashion, fitness, tech, comedy and more.',
    accent: '#EC4899',
    grad: 'linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)',
    glow: 'rgba(221,42,123,0.28)',
    Glyph: InstagramGlyph,
    actions: [[Eye, 'Watch'], [Bookmark, 'Save'], [Send, 'Share']],
    points: [
      '500–2,500 real creators engage with every post',
      'Engagement staggered naturally over 48 hours',
      'A vetted community of 10,000+ influencers',
      'Open to every niche and every account size',
    ],
    price: '₹750',
    cta: { label: 'Join Torque for Instagram', href: '/signup?plan=instagram' },
    more: { label: 'See Instagram details', href: '#creators' },
  },
  {
    key: 'linkedin',
    tag: 'Torque for LinkedIn',
    title: 'For professionals who want their expertise to be seen',
    audience: 'Professionals across 9 industries, from HR, sales and finance to tech, product and healthcare.',
    accent: '#3B9BFF',
    grad: 'linear-gradient(135deg,#0A66C2,#2D8CFF)',
    glow: 'rgba(10,102,194,0.35)',
    Glyph: LinkedInGlyph,
    actions: [[ThumbsUp, 'React'], [MessageSquare, 'Comment'], [Repeat2, 'Repost']],
    points: [
      'Peers from your own industry engage with your posts',
      'Submit up to 2 posts a week to the network',
      'A monthly content guide with topics for your domain',
      'Private WhatsApp community and learning videos',
    ],
    price: '₹500',
    cta: { label: 'Join Torque for LinkedIn', href: '/signup?plan=linkedin' },
    more: { label: 'See LinkedIn details', href: '#creators' },
  },
]

function PlatformCard({ p, inView, delay }) {
  const { Glyph } = p
  const { setPlatform } = usePlatform()
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6 }}
      style={{ position: 'relative', borderRadius: 26, padding: 1, background: `linear-gradient(160deg, ${p.glow}, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.03))` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 26, boxShadow: `0 30px 80px -30px ${p.glow}`, pointerEvents: 'none' }} />
      <div className="plat-pad" style={{ position: 'relative', borderRadius: 25, background: 'rgba(11,16,34,0.94)', padding: '34px 32px 30px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: '50%', background: p.glow, filter: 'blur(60px)', opacity: 0.55, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, position: 'relative' }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${p.glow}` }}>
            <Glyph size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.accent }}>{p.tag}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{p.price}/month · Cancel anytime</div>
          </div>
        </div>

        <h3 style={{ fontSize: 'clamp(1.35rem,2.2vw,1.65rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#F8FAFC', marginBottom: 10, position: 'relative' }}>{p.title}</h3>
        <p style={{ fontSize: 14.5, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>{p.audience}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }} aria-label="How members engage">
          {p.actions.map(([Icon, label]) => (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, color: '#E2E8F0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Icon size={13} color={p.accent} /> {label}
            </span>
          ))}
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flex: 1 }}>
          {p.points.map((t) => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#CBD5E1', lineHeight: 1.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: `${p.accent}22`, border: `1px solid ${p.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={10} color={p.accent} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href={p.cta.href} style={{ flex: '1 1 220px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 14, background: p.grad, color: '#fff', fontWeight: 700, fontSize: 14.5, textDecoration: 'none', boxShadow: `0 10px 26px -8px ${p.glow}` }}>
            {p.cta.label} <ArrowRight size={16} />
          </a>
          <a href={p.more.href} onClick={() => setPlatform(p.key)} style={{ padding: '14px 8px', fontSize: 14, fontWeight: 600, color: '#94A3B8', textDecoration: 'none' }}>{p.more.label} →</a>
        </div>
      </div>
    </motion.article>
  )
}

export default function Platforms() {
  const [ref, inView] = useInView()
  return (
    <section id="platforms" className="section-py" style={{ position: 'relative' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-tag" style={{ color: '#22D3EE' }}>Two networks</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            One Torque Network.<br /><span className="gradient-text">Built for Two Platforms.</span>
          </h2>
          <p style={{ fontSize: 15.5, color: '#64748B', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.7 }}>
            Each platform has its own network, its own members and its own way of engaging, so your posts get support that fits where you publish.
          </p>
        </motion.div>

        <div className="plat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 26, maxWidth: 1040, margin: '0 auto' }}>
          {PLATFORMS.map((p, i) => <PlatformCard key={p.key} p={p} inView={inView} delay={0.15 + i * 0.12} />)}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', fontSize: 13.5, color: '#64748B', marginTop: 26 }}>
          Active on both? Join both networks with one account.
        </motion.p>
      </div>
      <style>{`
        @media(max-width:860px){.plat-grid{grid-template-columns:1fr !important; max-width:520px !important;}}
        @media(max-width:520px){.plat-pad{padding:28px 22px 24px !important;}}
      `}</style>
    </section>
  )
}
