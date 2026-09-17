import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Users, Activity, Target, Layers } from 'lucide-react'

const features = [
  { icon:Users,    title:'Niche Communities',    color:'#3B82F6', desc:'Every creator lands in a curated cohort matched to their vertical — finance, fitness, fashion, food, tech, lifestyle. Each community is an independent growth engine.' },
  { icon:Activity, title:'Meaningful Engagement',color:'#22D3EE', desc:'We focus on saves, shares, and comments — the signals that tell algorithms this content deserves reach. No hollow interactions; every action has purpose.' },
  { icon:Target,   title:'Creator-First Design', color:'#818CF8', desc:'Every feature in Torque is built asking: does this help a creator succeed? Our product decisions are guided by creator outcomes, not platform metrics.' },
  { icon:Layers,   title:'Built to Last',        color:'#10B981', desc:'Community-driven platforms outlast algorithms. Torque is building the infrastructure for India\'s next generation of creators to grow sustainably for years.' },
]

function FeatureCard({ feature, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-80,80],[6,-6]),{stiffness:350,damping:35})
  const rY = useSpring(useTransform(x,[-80,80],[-6,6]),{stiffness:350,damping:35})
  const glowX = useTransform(x,[-80,80],['15%','85%'])
  const glowY = useTransform(y,[-80,80],['15%','85%'])
  const Icon = feature.icon

  return (
    <motion.div ref={secRef}
      initial={{opacity:0,y:36}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.75,delay,ease:[0.23,1,0.32,1]}}
      style={{perspective:1000}}
    >
      <motion.div ref={ref}
        style={{rotateX:rX,rotateY:rY,transformStyle:'preserve-3d',height:'100%'}}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{scale:1.025,boxShadow:`0 28px 70px ${feature.color}18`}}
        style={{
          borderRadius:26,padding:'38px 34px',height:'100%',cursor:'default',
          background:'rgba(13,19,38,0.68)',backdropFilter:'blur(24px)',
          border:`1px solid ${feature.color}18`,position:'relative',overflow:'hidden',
        }}
      >
        {/* Moving spotlight */}
        <motion.div style={{
          position:'absolute',width:180,height:180,borderRadius:'50%',
          background:feature.color,filter:'blur(55px)',
          left:glowX,top:glowY,transform:'translate(-50%,-50%)',
          opacity:0,pointerEvents:'none',transition:'opacity 0.35s',
        }} className={`glow-spot-${feature.color.replace('#','')}`}/>

        <motion.div
          whileHover={{rotate:6,scale:1.1}}
          style={{
            width:56,height:56,borderRadius:18,marginBottom:26,
            background:`${feature.color}12`,border:`1px solid ${feature.color}28`,
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:`0 0 22px ${feature.color}22`,
          }}>
          <Icon size={24} color={feature.color}/>
        </motion.div>

        <h3 style={{fontSize:19,fontWeight:700,marginBottom:12,fontFamily:'Space Grotesk'}}>{feature.title}</h3>
        <p style={{fontSize:14,color:'#64748B',lineHeight:1.72}}>{feature.desc}</p>
        <div style={{marginTop:24,height:1.5,borderRadius:2,background:`linear-gradient(90deg,${feature.color}35,transparent)`}}/>
      </motion.div>
    </motion.div>
  )
}

export default function WhyTorque() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py">
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:64}}
        >
          <span className="section-tag" style={{color:'#3B82F6'}}>Why It Works</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Infrastructure, not <span className="gradient-text">inspiration.</span>
          </h2>
          <p style={{fontSize:16,color:'#64748B',maxWidth:440,margin:'14px auto 0'}}>
            Torque is built on mechanics that compound — not motivation that fades.
          </p>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:22}} className="why-grid">
          {features.map((f,i)=><FeatureCard key={f.title} feature={f} delay={i*0.1}/>)}
        </div>
      </div>
      <style>{`@media(max-width:700px){.why-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
