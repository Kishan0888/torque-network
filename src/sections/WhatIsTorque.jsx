import { useRef, Suspense } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Users, Zap, Shield } from 'lucide-react'

const CARDS = [
  { icon:Users,  color:'#3B82F6', title:'Real Creators',        desc:'Every member is verified, niche-matched and actively creating. No ghost accounts — only authentic voices with genuine communities behind them.' },
  { icon:Zap,    color:'#22D3EE', title:'Genuine Engagement',   desc:'Saves, shares, comments — the high-signal actions that tell the algorithm your content deserves wider distribution. Depth over volume, always.' },
  { icon:Shield, color:'#818CF8', title:'Guaranteed Delivery',  desc:'Your amplification window is enforced by our compliance system. When you post, 500–1,000 creators engage within 48 hours. Guaranteed.' },
]

function TiltCard({ card, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-80,80],[8,-8]),{stiffness:320,damping:32})
  const rY = useSpring(useTransform(x,[-80,80],[-8,8]),{stiffness:320,damping:32})
  const Icon = card.icon
  return (
    <motion.div ref={secRef} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.75,delay,ease:[0.23,1,0.32,1]}} style={{perspective:1000}}>
      <motion.div ref={ref}
        style={{ rotateX:rX, rotateY:rY, transformStyle:'preserve-3d', borderRadius:26, padding:'38px 34px',
          height:'100%', cursor:'default', position:'relative', overflow:'hidden' }}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{scale:1.025,boxShadow:`0 32px 80px ${card.color}22`}}
        className="animated-border-fast"
        style={{ borderRadius:26, padding:'38px 34px', height:'100%', cursor:'default',
          background:'rgba(13,19,38,0.75)', backdropFilter:'blur(28px)' }}
      >
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent,${card.color},transparent)` }}/>
        <motion.div whileHover={{rotate:6,scale:1.1}}
          style={{ width:56, height:56, borderRadius:18, background:`${card.color}14`,
            border:`1px solid ${card.color}30`, display:'flex', alignItems:'center', justifyContent:'center',
            marginBottom:26, boxShadow:`0 0 26px ${card.color}25` }}>
          <Icon size={24} color={card.color}/>
        </motion.div>
        <h3 style={{ fontSize:20, fontWeight:700, marginBottom:13, fontFamily:'Space Grotesk' }}>{card.title}</h3>
        <p style={{ fontSize:14.5, color:'#64748B', lineHeight:1.72 }}>{card.desc}</p>
        <div style={{ marginTop:26, height:1.5, borderRadius:2, background:`linear-gradient(90deg,${card.color}40,transparent)` }}/>
      </motion.div>
    </motion.div>
  )
}

export default function WhatIsTorque() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ position:'relative' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)',
          width:600, height:600, borderRadius:'50%', opacity:0.06,
          background:'radial-gradient(circle,#3B82F6,#22D3EE,transparent 70%)', filter:'blur(60px)' }}/>
      </div>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#3B82F6' }}>What is Torque Network?</span>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:700, lineHeight:1.12, letterSpacing:'-0.03em', maxWidth:700, margin:'0 auto' }}>
            Think of it as a <span className="gradient-text">high-performance engine room</span> behind your content.
          </h2>
          <p style={{ fontSize:16, color:'#64748B', maxWidth:560, margin:'18px auto 0', lineHeight:1.72 }}>
            Torque Network is a private, vetted creator amplification community — India's first structured system for real, algorithm-safe post amplification at scale.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="wit-grid">
          {CARDS.map((c,i)=><TiltCard key={c.title} card={c} delay={i*0.13}/>)}
        </div>
      </div>
      <style>{`@media(max-width:900px){.wit-grid{grid-template-columns:1fr !important;}}@media(min-width:580px) and (max-width:900px){.wit-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
    </section>
  )
}
