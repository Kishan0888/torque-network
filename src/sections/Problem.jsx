import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { TrendingDown, DollarSign, AlertCircle } from 'lucide-react'

const problems = [
  { icon:TrendingDown, title:'Low Reach',        color:'#EF4444', desc:'Your content disappears into the void. The algorithm buries isolated creators with no collaborative signal to boost distribution.' },
  { icon:DollarSign,   title:'No Opportunities', color:'#F59E0B', desc:'Brand collaborations, community events, creative partnerships — they go to the connected few. Without the right network, you stay invisible.' },
  { icon:AlertCircle,  title:'No Growth System', color:'#818CF8', desc:'You\'re posting blindly with no feedback loop, no community, no infrastructure. Just hustle and hope — and that is not a strategy.' },
]

/* slow-moving constellation lines in the background */
function ConstellationBg() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.18 }} preserveAspectRatio="none">
      <defs>
        <radialGradient id="cg1" cx="30%" cy="40%"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="transparent"/></radialGradient>
        <radialGradient id="cg2" cx="70%" cy="60%"><stop offset="0%" stopColor="#22D3EE"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      </defs>
      {[
        ['5%','20%','22%','68%'],['22%','68%','55%','30%'],['55%','30%','78%','75%'],
        ['78%','75%','95%','15%'],['95%','15%','5%','20%'],['22%','68%','78%','75%'],
      ].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#3B82F6" strokeWidth="0.5"
          strokeDasharray="4 8"
          style={{ animation:`beam-pulse ${2.5+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }}/>
      ))}
      {[['5%','20%'],['22%','68%'],['55%','30%'],['78%','75%'],['95%','15%']].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="3" fill="#22D3EE"
          style={{ animation:`star-twinkle ${2+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }}/>
      ))}
    </svg>
  )
}

function TiltCard({ problem, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-100,100],[10,-10]),{stiffness:300,damping:30})
  const rY = useSpring(useTransform(x,[-100,100],[-10,10]),{stiffness:300,damping:30})
  const Icon = problem.icon

  return (
    <motion.div ref={secRef}
      initial={{opacity:0,y:44}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.75,delay,ease:[0.23,1,0.32,1]}}
      style={{perspective:900}}
    >
      <motion.div ref={ref}
        style={{ rotateX:rX, rotateY:rY, transformStyle:'preserve-3d', height:'100%', borderRadius:26 }}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{
          scale:1.035,
          boxShadow:`0 32px 80px ${problem.color}22`,
        }}
        style={{
          borderRadius:26, padding:'36px 32px', height:'100%', cursor:'default',
          background:'rgba(13,19,38,0.68)', backdropFilter:'blur(22px)',
          border:`1px solid ${problem.color}22`,
          position:'relative', overflow:'hidden',
        }}
      >
        {/* Animated gradient border on hover */}
        <div className="animated-border-fast" style={{
          position:'absolute', inset:0, borderRadius:26, opacity:0,
          transition:'opacity 0.4s',
          pointerEvents:'none',
        }}/>

        <div style={{
          width:54, height:54, borderRadius:17, marginBottom:26,
          background:`${problem.color}12`, border:`1px solid ${problem.color}28`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 0 20px ${problem.color}22`,
        }}>
          <Icon size={24} color={problem.color}/>
        </div>

        <h3 style={{fontSize:21,fontWeight:700,marginBottom:12,fontFamily:'Space Grotesk'}}>{problem.title}</h3>
        <p style={{fontSize:14,color:'#64748B',lineHeight:1.68}}>{problem.desc}</p>

        <div style={{marginTop:24,height:2,borderRadius:2,background:`linear-gradient(90deg,${problem.color}35,transparent)`}}/>
      </motion.div>
    </motion.div>
  )
}

export default function Problem() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" id="creators" style={{position:'relative'}}>
      <ConstellationBg/>
      <div className="container" style={{position:'relative',zIndex:1}}>
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:64}}
        >
          <span className="section-tag" style={{color:'#F87171'}}>The Creator Problem</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            The system wasn't built<br/><span className="gradient-text">for creators.</span>
          </h2>
          <p style={{fontSize:16,color:'#64748B',maxWidth:480,margin:'16px auto 0',lineHeight:1.68}}>
            Three invisible walls block most creators from reaching the people who would love their content.
          </p>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}} className="problem-grid">
          {problems.map((p,i)=><TiltCard key={p.title} problem={p} delay={i*0.12}/>)}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.problem-grid{grid-template-columns:1fr !important;}}
        @media(min-width:600px) and (max-width:900px){.problem-grid{grid-template-columns:repeat(2,1fr) !important;}}
      `}</style>
    </section>
  )
}
