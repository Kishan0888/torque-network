import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Zap, Network, Globe } from 'lucide-react'

const milestones = [
  {
    year:'Year 1', icon:Zap, color:'#3B82F6',
    headline:'Build Your Foundation.',
    points:['Get verified and niche-matched','Amplify your best content','Understand what resonates with your community','Build your creator identity'],
  },
  {
    year:'Year 2', icon:Network, color:'#22D3EE',
    headline:'Expand Your Network.',
    points:['Cross-niche collaborations begin','Your name becomes recognisable in your space','Brands start approaching your community','Leadership roles within cohorts open up'],
  },
  {
    year:'Year 3+', icon:Globe, color:'#818CF8',
    headline:'Become Part of the Ecosystem.',
    points:['A senior voice in India\'s creator landscape','Mentor newer creators in your niche','Long-term creative partnerships','Recognised as a Torque Founding Creator'],
  },
]

function TimelineCard({ m, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-80,80],[7,-7]),{stiffness:300,damping:30})
  const rY = useSpring(useTransform(x,[-80,80],[-7,7]),{stiffness:300,damping:30})
  const Icon = m.icon

  const floatClass = ['float-a','float-b','float-c'][milestones.indexOf(m)]

  return (
    <motion.div ref={secRef}
      initial={{opacity:0,y:48}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.8,delay,ease:[0.23,1,0.32,1]}}
      style={{perspective:900}}
    >
      <motion.div ref={ref}
        className={floatClass}
        style={{rotateX:rX,rotateY:rY,transformStyle:'preserve-3d'}}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{scale:1.03,boxShadow:`0 32px 80px ${m.color}28`,y:-6}}
        style={{
          borderRadius:28,padding:'38px 34px',cursor:'default',
          background:'rgba(13,19,38,0.72)',backdropFilter:'blur(26px)',
          border:`1px solid ${m.color}25`,
          position:'relative',overflow:'hidden',
        }}
      >
        {/* Top glow bar */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${m.color},transparent)`}}/>

        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:22}}>
          <div style={{
            width:52,height:52,borderRadius:16,
            background:`${m.color}14`,border:`1px solid ${m.color}30`,
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:`0 0 24px ${m.color}30`,
          }}>
            <Icon size={22} color={m.color}/>
          </div>
          <div>
            <div style={{fontSize:11,color:m.color,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>{m.year}</div>
            <div style={{fontSize:20,fontWeight:700,fontFamily:'Space Grotesk',marginTop:2}}>{m.headline}</div>
          </div>
        </div>

        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
          {m.points.map((pt,i)=>(
            <motion.li key={i}
              initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
              transition={{delay:delay+0.2+i*0.08,duration:0.5}}
              style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,color:'#94A3B8',lineHeight:1.55}}
            >
              <span style={{width:5,height:5,borderRadius:'50%',background:m.color,display:'inline-block',flexShrink:0,marginTop:6}}/>
              {pt}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default function CreatorTimeline() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{background:'rgba(13,19,38,0.25)'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:64}}
        >
          <span className="section-tag" style={{color:'#818CF8'}}>Creator Milestones</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Your journey,<br/><span className="gradient-text">year by year.</span>
          </h2>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}} className="timeline-grid">
          {milestones.map((m,i)=><TimelineCard key={m.year} m={m} delay={i*0.15}/>)}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.timeline-grid{grid-template-columns:1fr !important;}}
        @media(min-width:600px) and (max-width:900px){.timeline-grid{grid-template-columns:repeat(2,1fr) !important;}}
      `}</style>
    </section>
  )
}
