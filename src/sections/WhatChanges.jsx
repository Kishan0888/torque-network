import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { X, CheckCircle } from 'lucide-react'

const AGAINST = [
  'Only 3–7% of your followers ever see a post',
  'Posts without early engagement get buried',
  'Follower likes stop there — they don\'t carry your content to new people',
  'Building momentum alone takes years',
]
const CHANGES = [
  '500–2,500 real creators watch, save and share your post within 48 hours',
  'When a creator engages, their audience sees you',
  'Creators from every category engage, so new audiences discover you',
  'You grow inside a vetted creator community instead of on your own',
]

export default function WhatChanges() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.3)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>The Algorithm Isn't Broken</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            You're just fighting it <span className="gradient-text">alone.</span>
          </h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }} className="changes-grid">
          <motion.div initial={{opacity:0,x:-36}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px', background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.14)' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#EF4444', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>What You're Up Against</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {AGAINST.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.2+i*0.09,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <X size={10} color="#EF4444" strokeWidth={3}/>
                  </div>
                  <span style={{ fontSize:14, color:'#94A3B8', lineHeight:1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,x:36}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8,delay:0.1,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px', background:'rgba(34,211,238,0.04)', border:'1px solid rgba(34,211,238,0.14)' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#22D3EE', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>What Torque Network Changes</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {CHANGES.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.25+i*0.09,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle size={11} color="#22D3EE" strokeWidth={2.5}/>
                  </div>
                  <span style={{ fontSize:14, color:'#CBD5E1', lineHeight:1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Flow graphic */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7,delay:0.5}}
          style={{ marginTop:48, padding:'24px 32px', borderRadius:20,
            background:'rgba(13,19,38,0.55)', border:'1px solid rgba(59,130,246,0.12)',
            backdropFilter:'blur(16px)' }}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:12 }}>
            {['Creator engages','Their audience sees you','New audiences discover you','Your reach & engagement grows'].map((step,i)=>(
              <div key={step} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ padding:'8px 16px', borderRadius:100,
                  background:i===3?'linear-gradient(135deg,#3B82F6,#22D3EE)':'rgba(59,130,246,0.1)',
                  border:i===3?'none':'1px solid rgba(59,130,246,0.2)',
                  fontSize:13, fontWeight:600,
                  color:i===3?'#fff':'#94A3B8' }}>{step}</div>
                {i<3 && <span style={{ color:'#334155', fontSize:18 }}>→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pull quote */}
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.7,duration:0.7}}
          style={{ textAlign:'center', marginTop:40 }}>
          <p style={{ fontSize:18, color:'#64748B', fontStyle:'italic', maxWidth:560, margin:'0 auto', lineHeight:1.65 }}>
            "One post. Hundreds of real creators. Momentum from the first hour."
          </p>
        </motion.div>
      </div>
      <style>{`@media(max-width:768px){.changes-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
