import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Check, Sparkles, TrendingUp } from 'lucide-react'

const FOUNDING_BENEFITS = [
  'Rate locked at ₹1,500/month permanently',
  'Founding Creator badge & permanent recognition',
  '500–1,000 engagements guaranteed per post',
  '48-hour amplification window enforcement',
  'Priority access to brand campaigns',
  'Brand Discovery Directory listing',
  'Algorithm Playbook library access',
  'Exclusive niche-matched creator cohort',
  'Direct access to founding community channel',
]

export default function Pricing() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" id="pricing" style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:800, height:800, borderRadius:'50%', opacity:0.07,
          background:'radial-gradient(circle,#3B82F6,#22D3EE,transparent 65%)', filter:'blur(70px)' }}/>
      </div>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>Membership</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            One price. <span className="gradient-text">Locked forever.</span>
          </h2>
          <p style={{ fontSize:15.5, color:'#64748B', maxWidth:440, margin:'14px auto 0', lineHeight:1.7 }}>
            The founding 100 creators get a rate that never increases — no matter how large the network grows.
          </p>
        </motion.div>

        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }} className="pricing-grid">
          {/* Founding card */}
          <motion.div initial={{opacity:0,y:40,scale:0.97}} animate={inView?{opacity:1,y:0,scale:1}:{}}
            transition={{duration:0.9,delay:0.2,ease:[0.23,1,0.32,1]}}
            style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-2, borderRadius:28,
              background:'linear-gradient(135deg,#3B82F6,#22D3EE,#818CF8)',
              opacity:0.22, filter:'blur(16px)' }}/>
            <div className="animated-border" style={{ borderRadius:26, position:'relative' }}>
              <div style={{ background:'#0D1326', borderRadius:25, padding:'36px 34px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <Sparkles size={14} color="#FBBF24"/>
                  <span style={{ fontSize:11, fontWeight:700, color:'#FBBF24', textTransform:'uppercase', letterSpacing:'0.1em' }}>Founding Member</span>
                </div>
                <div style={{ fontSize:11, color:'#475569', marginBottom:16 }}>First 100 creators only</div>
                <div style={{ marginBottom:4 }}>
                  <span style={{ fontSize:'clamp(3rem,5vw,4rem)', fontWeight:700, fontFamily:'Space Grotesk', letterSpacing:'-0.04em',
                    background:'linear-gradient(135deg,#3B82F6,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    ₹1,500
                  </span>
                </div>
                <div style={{ fontSize:13, color:'#475569', marginBottom:32 }}>per month · rate locked for life</div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
                  {FOUNDING_BENEFITS.map((b,i)=>(
                    <motion.li key={b} initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
                      transition={{delay:0.4+i*0.05,duration:0.45}}
                      style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:'#CBD5E1' }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:1,
                        background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.35)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={9} color="#22D3EE"/>
                      </div>
                      {b}
                    </motion.li>
                  ))}
                </ul>
                <a href="#community" className="btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'15px 24px', borderRadius:14, display:'flex' }}>
                  Apply for Founding Access
                </a>
                <p style={{ textAlign:'center', fontSize:11, color:'#334155', marginTop:10 }}>No commitment · Cancel anytime · Limited to 100</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Standard + ROI */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Standard */}
            <motion.div initial={{opacity:0,x:32}} animate={inView?{opacity:1,x:0}:{}}
              transition={{duration:0.7,delay:0.35,ease:[0.23,1,0.32,1]}}
              style={{ borderRadius:22, padding:'28px 28px',
                background:'rgba(13,19,38,0.55)', backdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Standard Member</div>
              <div style={{ fontSize:11, color:'#475569', marginBottom:14 }}>After founding cohort fills</div>
              <div style={{ fontSize:28, fontWeight:700, color:'#94A3B8', fontFamily:'Space Grotesk', marginBottom:4 }}>₹2,500+</div>
              <div style={{ fontSize:12, color:'#475569', marginBottom:16 }}>per month · rate subject to change</div>
              <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)' }}>
                <p style={{ fontSize:12.5, color:'#94A3B8', lineHeight:1.6 }}>
                  Standard members do not receive the founding rate lock, founding badge, or priority brand campaign access.
                </p>
              </div>
            </motion.div>

            {/* ROI Box */}
            <motion.div initial={{opacity:0,x:32}} animate={inView?{opacity:1,x:0}:{}}
              transition={{duration:0.7,delay:0.48,ease:[0.23,1,0.32,1]}}
              style={{ borderRadius:22, padding:'28px 28px', flex:1,
                background:'rgba(34,211,238,0.04)', backdropFilter:'blur(20px)',
                border:'1px solid rgba(34,211,238,0.15)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <TrendingUp size={16} color="#22D3EE"/>
                <div style={{ fontSize:13, fontWeight:700, color:'#22D3EE', textTransform:'uppercase', letterSpacing:'0.06em' }}>ROI Perspective</div>
              </div>
              {[
                ['₹1,500/month','Your investment'],
                ['₹5,000–₹50,000','Value of one brand deal unlocked through stronger engagement metrics'],
                ['₹10,000–₹2,00,000','Annual brand deals accessed through Priority Brand Campaigns'],
                ['Priceless','A verified engagement history that compounds forever'],
              ].map(([val,label])=>(
                <div key={label} style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:14 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:'#F8FAFC', fontFamily:'Space Grotesk' }}>{val}</div>
                  <div style={{ fontSize:12, color:'#64748B', lineHeight:1.5 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:800px){.pricing-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
