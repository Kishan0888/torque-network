import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ClipboardCheck, Send, Zap, RefreshCw, BarChart2 } from 'lucide-react'

const STEPS = [
  { num:'01', icon:ClipboardCheck, color:'#3B82F6', title:'Apply & Get Verified',
    desc:'Apply with your Instagram handle. Approved members get channel access within 48 hours.' },
  { num:'02', icon:Send, color:'#22D3EE', title:'Post & Submit',
    desc:'Publish your content and submit it to the private Torque Network channel.' },
  { num:'03', icon:Zap, color:'#818CF8', title:'The Network Amplifies',
    desc:'500–2,500 real creators watch, save and share your post, staggered naturally over 48 hours.' },
  { num:'04', icon:RefreshCw, color:'#F59E0B', title:'Give Back & Grow',
    desc:'Support fellow members on their posting days. What you give comes back to you.' },
]

const BENEFITS = [
  { icon:BarChart2, color:'#3B82F6', title:'Higher Engagement Rate', desc:'Stronger numbers on every post you publish.' },
  { icon:Zap,       color:'#22D3EE', title:'Wider Reach',           desc:'Get discovered by audiences beyond your existing followers.' },
  { icon:RefreshCw, color:'#818CF8', title:'A Network That Grows With You', desc:'Every new member adds to your amplification at no extra cost.' },
]

function StepNode({ step, index, inView }) {
  const [ref, nodeInView] = useInView()
  const Icon = step.icon
  return (
    <motion.div ref={ref} initial={{opacity:0,y:36}} animate={nodeInView?{opacity:1,y:0}:{}}
      transition={{duration:0.7,delay:0.1+index*0.12,ease:[0.23,1,0.32,1]}}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
      <motion.div
        animate={inView?{boxShadow:[`0 0 0px ${step.color}00`,`0 0 32px ${step.color}88`,`0 0 0px ${step.color}00`]}:{}}
        transition={{duration:3,delay:index*0.55,repeat:Infinity,repeatDelay:0.5}}
        whileHover={{scale:1.18,boxShadow:`0 0 44px ${step.color}cc`}}
        style={{ width:68, height:68, borderRadius:22, marginBottom:20,
          background:`linear-gradient(135deg,${step.color}20,${step.color}08)`,
          border:`1.5px solid ${step.color}45`,
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', zIndex:2, backdropFilter:'blur(12px)' }}>
        <Icon size={24} color={step.color}/>
        {inView && (
          <motion.div style={{ position:'absolute', inset:-7, borderRadius:30, border:`1px solid ${step.color}30` }}
            animate={{scale:[1,1.5],opacity:[0.5,0]}} transition={{duration:2.5,delay:index*0.55,repeat:Infinity,repeatDelay:0.8}}/>
        )}
      </motion.div>
      <div style={{ fontSize:10, color:'#2D3748', fontFamily:'monospace', marginBottom:4, letterSpacing:'0.1em' }}>{step.num}</div>
      <div style={{ fontSize:16, fontWeight:700, marginBottom:8, fontFamily:'Space Grotesk' }}>{step.title}</div>
      <p style={{ fontSize:12.5, color:'#64748B', lineHeight:1.65, maxWidth:170 }}>{step.desc}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const [ref, inView] = useInView()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target:containerRef, offset:['start 0.85','end 0.35'] })
  const lineWidth = useTransform(scrollYProgress,[0,1],['0%','100%'])

  return (
    <section className="section-py" id="how-it-works" style={{ background:'rgba(13,19,38,0.28)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:80 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>How It Works</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            How Torque Network <span className="gradient-text">works.</span>
          </h2>
        </motion.div>

        {/* Desktop steps */}
        <div ref={containerRef} className="steps-desktop" style={{ position:'relative', marginBottom:72 }}>
          <div style={{ position:'absolute', top:34, left:'6%', right:'6%', height:1.5, background:'rgba(59,130,246,0.1)', borderRadius:2 }}/>
          <motion.div style={{ position:'absolute', top:34, left:'6%', height:1.5,
            background:'linear-gradient(90deg,#3B82F6,#22D3EE,#818CF8,#F59E0B)', borderRadius:2, width:lineWidth }}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, position:'relative' }}>
            {STEPS.map((s,i)=><StepNode key={s.num} step={s} index={i} inView={inView}/>)}
          </div>
        </div>

        {/* Mobile steps */}
        <div className="steps-mobile" style={{ display:'none', flexDirection:'column', gap:0, marginBottom:56 }}>
          {STEPS.map((s,i)=>{
            const [cardRef,cardInView]=useInView()
            const Icon=s.icon
            return (
              <motion.div key={s.num} ref={cardRef}
                initial={{opacity:0,x:-24}} animate={cardInView?{opacity:1,x:0}:{}}
                transition={{duration:0.6,delay:i*0.08}}
                style={{ display:'flex', gap:0, position:'relative' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginRight:20 }}>
                  <div style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:`${s.color}14`, border:`1px solid ${s.color}35`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={s.color}/>
                  </div>
                  {i<STEPS.length-1&&<div style={{ width:1.5, flex:1, marginTop:8, background:`linear-gradient(to bottom,${s.color}50,transparent)`, minHeight:32 }}/>}
                </div>
                <div style={{ paddingBottom:32, paddingTop:8 }}>
                  <div style={{ fontSize:10, color:'#2D3748', fontFamily:'monospace', marginBottom:3, letterSpacing:'0.1em' }}>{s.num}</div>
                  <div style={{ fontSize:16, fontWeight:700, marginBottom:5, fontFamily:'Space Grotesk' }}>{s.title}</div>
                  <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65 }}>{s.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Benefit cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="benefit-cards">
          {BENEFITS.map((b,i)=>{
            const [cardRef,cardInView]=useInView()
            const Icon=b.icon
            return (
              <motion.div key={b.title} ref={cardRef}
                initial={{opacity:0,y:24}} animate={cardInView?{opacity:1,y:0}:{}}
                transition={{duration:0.65,delay:i*0.12,ease:[0.23,1,0.32,1]}}
                whileHover={{y:-6,boxShadow:`0 24px 60px ${b.color}18`}}
                style={{ borderRadius:20, padding:'28px 26px', background:'rgba(13,19,38,0.65)', backdropFilter:'blur(20px)', border:`1px solid ${b.color}18`, cursor:'default', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${b.color}80,transparent)` }}/>
                <div style={{ width:48, height:48, borderRadius:15, background:`${b.color}12`, border:`1px solid ${b.color}28`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 0 20px ${b.color}22` }}>
                  <Icon size={22} color={b.color}/>
                </div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8, fontFamily:'Space Grotesk' }}>{b.title}</div>
                <p style={{ fontSize:13.5, color:'#64748B', lineHeight:1.65 }}>{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.steps-desktop{display:none !important;}.steps-mobile{display:flex !important;}.benefit-cards{grid-template-columns:1fr !important;}}
        @media(min-width:580px) and (max-width:768px){.benefit-cards{grid-template-columns:repeat(2,1fr) !important;}}
      `}</style>
    </section>
  )
}
