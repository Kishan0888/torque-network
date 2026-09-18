import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ClipboardCheck, Lock, Send, Zap, RefreshCw } from 'lucide-react'

const STEPS = [
  { num:'01', icon:ClipboardCheck, color:'#3B82F6', title:'Apply & Get Verified',
    desc:'Submit your application. Our team audits your profile — content quality, engagement authenticity, niche fit. Approved creators receive a welcome kit and onboarding within 48 hours.' },
  { num:'02', icon:Lock,           color:'#22D3EE', title:'Join Private Channel',
    desc:'Gain access to your exclusive Telegram or WhatsApp community — your niche-matched cohort of 50–200 creators at a similar stage, all verified and committed.' },
  { num:'03', icon:Send,           color:'#818CF8', title:'Submit Your Post',
    desc:'When you publish, submit the link to the channel. Our system queues it within the 48-hour amplification window and notifies your cohort.' },
  { num:'04', icon:Zap,            color:'#F59E0B', title:'Receive Amplification',
    desc:'500–1,000 creators engage with your post — saves, shares, comments. Real actions that trigger the algorithm to push your content further organically.' },
  { num:'05', icon:RefreshCw,      color:'#EC4899', title:'Reciprocate',
    desc:'You engage back on others\' posts in your rotation. The compliance system tracks participation. This mutual accountability is what makes the network unbreakable.' },
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
          border:`1.5px solid ${step.color}45`, display:'flex', alignItems:'center', justifyContent:'center',
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
            Five steps to <span className="gradient-text">guaranteed amplification.</span>
          </h2>
          <p style={{ fontSize:15, color:'#64748B', maxWidth:460, margin:'14px auto 0' }}>
            A clear, repeatable system — every post, every week.
          </p>
        </motion.div>

        {/* Desktop */}
        <div ref={containerRef} className="steps-desktop" style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:34, left:'6%', right:'6%', height:1.5, background:'rgba(59,130,246,0.1)', borderRadius:2 }}/>
          <motion.div style={{ position:'absolute', top:34, left:'6%', height:1.5,
            background:'linear-gradient(90deg,#3B82F6,#22D3EE,#818CF8,#F59E0B,#EC4899)',
            borderRadius:2, width:lineWidth }}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, position:'relative' }}>
            {STEPS.map((s,i)=><StepNode key={s.num} step={s} index={i} inView={inView}/>)}
          </div>
        </div>

        {/* Mobile */}
        <div className="steps-mobile" style={{ display:'none', flexDirection:'column', gap:0 }}>
          {STEPS.map((s,i)=>{
            const [cardRef,cardInView]=useInView()
            const Icon=s.icon
            return (
              <motion.div key={s.num} ref={cardRef}
                initial={{opacity:0,x:-24}} animate={cardInView?{opacity:1,x:0}:{}}
                transition={{duration:0.6,delay:i*0.08}}
                style={{ display:'flex', gap:0, position:'relative' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginRight:20 }}>
                  <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
                    background:`${s.color}14`, border:`1px solid ${s.color}35`,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={s.color}/>
                  </div>
                  {i<STEPS.length-1&&<div style={{ width:1.5, flex:1, marginTop:8,
                    background:`linear-gradient(to bottom,${s.color}50,transparent)`, minHeight:32 }}/>}
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
      </div>
      <style>{`@media(max-width:768px){.steps-desktop{display:none !important;}.steps-mobile{display:flex !important;}}`}</style>
    </section>
  )
}
