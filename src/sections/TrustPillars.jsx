import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Users, Heart, TrendingUp } from 'lucide-react'

const pillars = [
  { icon:Users,     title:'Real Creators',         color:'#3B82F6', desc:'Every member is verified, niche-matched, and actively creating content. No ghost accounts, no inflated numbers — just authentic voices building real communities.' },
  { icon:Heart,     title:'Meaningful Engagement', color:'#EC4899', desc:'We foster saves, shares, and comments — the signals that matter to algorithms and audiences alike. Depth over volume, always.' },
  { icon:TrendingUp,title:'Growing Together',      color:'#22D3EE', desc:'When one creator in your community grows, everyone grows. Torque is designed so your success lifts the entire niche ecosystem around you.' },
]

function PillarCard({ pillar, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y, [-80,80],[8,-8]), { stiffness:320, damping:32 })
  const rY = useSpring(useTransform(x, [-80,80],[-8,8]), { stiffness:320, damping:32 })
  const Icon = pillar.icon

  return (
    <motion.div ref={secRef}
      initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.75, delay, ease:[0.23,1,0.32,1]}}
      style={{ perspective:1000 }}
    >
      <motion.div ref={ref}
        style={{ rotateX:rX, rotateY:rY, transformStyle:'preserve-3d', height:'100%' }}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{ scale:1.025 }}
        className="animated-border-fast"
        style={{
          borderRadius:26, padding:'40px 36px', height:'100%', cursor:'default',
          background:'rgba(13,19,38,0.72)', backdropFilter:'blur(24px)',
        }}
      >
        {/* Icon */}
        <motion.div
          whileHover={{ rotate:8, scale:1.1 }}
          style={{
            width:58, height:58, borderRadius:18, marginBottom:28,
            background:`${pillar.color}14`, border:`1px solid ${pillar.color}28`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 0 24px ${pillar.color}22`,
          }}>
          <Icon size={24} color={pillar.color}/>
        </motion.div>

        <h3 style={{ fontSize:20, fontWeight:700, marginBottom:14, fontFamily:'Space Grotesk' }}>{pillar.title}</h3>
        <p style={{ fontSize:14.5, color:'#64748B', lineHeight:1.72 }}>{pillar.desc}</p>

        {/* Bottom accent */}
        <div style={{ marginTop:28, height:2, borderRadius:2, background:`linear-gradient(90deg,${pillar.color}40,transparent)` }}/>
      </motion.div>
    </motion.div>
  )
}

export default function TrustPillars() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.3)' }}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}
        >
          <span className="section-tag" style={{ color:'#3B82F6' }}>What We Stand For</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Built on values that <span className="gradient-text">actually matter.</span>
          </h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="pillars-grid">
          {pillars.map((p,i) => <PillarCard key={p.title} pillar={p} delay={i*0.12}/>)}
        </div>
      </div>
      <style>{`@media(max-width:840px){.pillars-grid{grid-template-columns:1fr !important;}} @media(min-width:580px) and (max-width:840px){.pillars-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
    </section>
  )
}
