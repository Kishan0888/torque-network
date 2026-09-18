import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { X, CheckCircle } from 'lucide-react'

const AGAINST = [
  '1–3% organic reach on every post',
  'Algorithm suppresses early engagement',
  'Brands ignore low engagement profiles',
  'Solo momentum takes years to build',
  'CIB detection kills pod strategies',
  'No community behind your content',
]
const CHANGES = [
  '500–1,000 genuine engagements per post',
  'Algorithmic signal boosted within 48 hrs',
  'Stronger brand rates with proof of reach',
  'Niche-matched creator community behind you',
  '100% algorithm-safe engagement system',
  'Network effect that compounds every post',
]

export default function WhatChanges() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.3)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>The Torque Difference</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            What Torque Network <span className="gradient-text">changes.</span>
          </h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }} className="changes-grid">
          {/* Left — against */}
          <motion.div initial={{opacity:0,x:-36}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px', background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.14)' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#EF4444', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>
              What You're Up Against
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {AGAINST.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.2+i*0.08,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(239,68,68,0.12)',
                    border:'1px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <X size={10} color="#EF4444" strokeWidth={3}/>
                  </div>
                  <span style={{ fontSize:14, color:'#94A3B8', lineHeight:1.55 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Right — changes */}
          <motion.div initial={{opacity:0,x:36}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8,delay:0.1,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px', background:'rgba(34,211,238,0.04)', border:'1px solid rgba(34,211,238,0.14)' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#22D3EE', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>
              What Torque Network Changes
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {CHANGES.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.25+i*0.08,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(34,211,238,0.12)',
                    border:'1px solid rgba(34,211,238,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <CheckCircle size={11} color="#22D3EE" strokeWidth={2.5}/>
                  </div>
                  <span style={{ fontSize:14, color:'#CBD5E1', lineHeight:1.55 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.changes-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
