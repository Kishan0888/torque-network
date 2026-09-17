import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Send, BadgeCheck, Users, Handshake, TrendingUp } from 'lucide-react'

const STEPS = [
  { num:'01', icon:Send,        title:'Apply',          color:'#3B82F6', desc:'Submit a quick application telling us about your content, niche, and why you want to grow with a community.' },
  { num:'02', icon:BadgeCheck,  title:'Get Verified',   color:'#22D3EE', desc:'Our team reviews your application within 48 hours. We look at content quality and authentic engagement—not just numbers.' },
  { num:'03', icon:Users,       title:'Join Community', color:'#818CF8', desc:'Get matched to a curated cohort of creators in your niche. Meet your peers, get onboarded, and set your goals together.' },
  { num:'04', icon:Handshake,   title:'Collaborate',    color:'#F59E0B', desc:'Start amplifying each other\'s best content. Real interactions from real creators who care about your niche.' },
  { num:'05', icon:TrendingUp,  title:'Grow',           color:'#EC4899', desc:'Watch your reach, profile strength, and creator confidence compound over weeks, months, and years — together.' },
]

function StepNode({ step, index, globalInView }) {
  const [ref, inView] = useInView()
  const Icon = step.icon
  const isActive = globalInView

  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:36}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.7,delay:0.1+index*0.12,ease:[0.23,1,0.32,1]}}
      style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',position:'relative'}}
    >
      {/* Glowing node */}
      <motion.div
        animate={isActive?{
          boxShadow:[
            `0 0 0px ${step.color}00`,
            `0 0 30px ${step.color}80, 0 0 60px ${step.color}30`,
            `0 0 0px ${step.color}00`,
          ],
        }:{}}
        transition={{duration:3,delay:index*0.5,repeat:Infinity,repeatDelay:0.5}}
        whileHover={{scale:1.18,boxShadow:`0 0 40px ${step.color}99`}}
        style={{
          width:68, height:68, borderRadius:22, marginBottom:22,
          background:`linear-gradient(135deg,${step.color}22,${step.color}08)`,
          border:`1.5px solid ${step.color}45`,
          display:'flex',alignItems:'center',justifyContent:'center',
          position:'relative',zIndex:2,
          backdropFilter:'blur(12px)',
        }}
      >
        <Icon size={24} color={step.color}/>
        {/* Ripple on active */}
        {isActive && (
          <motion.div
            style={{
              position:'absolute',inset:-6,borderRadius:28,
              border:`1px solid ${step.color}35`,
            }}
            animate={{scale:[1,1.4],opacity:[0.6,0]}}
            transition={{duration:2.5,delay:index*0.5,repeat:Infinity,repeatDelay:0.8}}
          />
        )}
      </motion.div>

      <div style={{fontSize:10.5,color:'#2D3748',fontFamily:'monospace',marginBottom:5,letterSpacing:'0.1em'}}>{step.num}</div>
      <div style={{fontSize:17,fontWeight:700,marginBottom:8,fontFamily:'Space Grotesk'}}>{step.title}</div>
      <p style={{fontSize:13,color:'#64748B',lineHeight:1.62,maxWidth:160}}>{step.desc}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const [ref, inView] = useInView()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target:containerRef, offset:['start 0.8','end 0.4'] })
  const lineWidth = useTransform(scrollYProgress, [0,1], ['0%','100%'])

  return (
    <section className="section-py" id="how-it-works" style={{background:'rgba(13,19,38,0.28)'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:80}}
        >
          <span className="section-tag" style={{color:'#22D3EE'}}>The Path</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Five steps to <span className="gradient-text">unstoppable growth.</span>
          </h2>
          <p style={{fontSize:15,color:'#64748B',maxWidth:440,margin:'14px auto 0'}}>
            A clear, guided path from application to a thriving creator community.
          </p>
        </motion.div>

        {/* Desktop */}
        <div ref={containerRef} className="steps-desktop" style={{position:'relative'}}>
          {/* Track */}
          <div style={{position:'absolute',top:34,left:'6%',right:'6%',height:1.5,background:'rgba(59,130,246,0.1)',borderRadius:2}}/>
          {/* Animated fill */}
          <motion.div style={{
            position:'absolute',top:34,left:'6%',height:1.5,
            background:'linear-gradient(90deg,#3B82F6,#22D3EE,#818CF8,#F59E0B,#EC4899)',
            borderRadius:2,width:lineWidth,
          }}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,position:'relative'}}>
            {STEPS.map((s,i)=><StepNode key={s.num} step={s} index={i} globalInView={inView}/>)}
          </div>
        </div>

        {/* Mobile */}
        <div className="steps-mobile" style={{display:'none',flexDirection:'column',gap:0}}>
          {STEPS.map((s,i)=>{
            const [cardRef,cardInView]=useInView()
            const Icon=s.icon
            return(
              <motion.div key={s.num} ref={cardRef}
                initial={{opacity:0,x:-24}} animate={cardInView?{opacity:1,x:0}:{}}
                transition={{duration:0.6,delay:i*0.08}}
                style={{display:'flex',gap:0,position:'relative'}}
              >
                {/* Left spine */}
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:20}}>
                  <div style={{
                    width:48,height:48,borderRadius:15,flexShrink:0,
                    background:`${s.color}14`,border:`1px solid ${s.color}35`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                  }}>
                    <Icon size={20} color={s.color}/>
                  </div>
                  {i<STEPS.length-1&&<div style={{width:1.5,flex:1,marginTop:8,background:`linear-gradient(to bottom,${s.color}50,transparent)`,minHeight:32}}/>}
                </div>
                <div style={{paddingBottom:32,paddingTop:8}}>
                  <div style={{fontSize:10,color:'#2D3748',fontFamily:'monospace',marginBottom:3,letterSpacing:'0.1em'}}>{s.num}</div>
                  <div style={{fontSize:16,fontWeight:700,marginBottom:6,fontFamily:'Space Grotesk'}}>{s.title}</div>
                  <p style={{fontSize:13,color:'#64748B',lineHeight:1.65}}>{s.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .steps-desktop{display:none !important;}
          .steps-mobile{display:flex !important;}
        }
      `}</style>
    </section>
  )
}
