import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { TrendingDown, EyeOff, AlertTriangle } from 'lucide-react'

const PROBLEMS = [
  { icon:TrendingDown, color:'#EF4444', title:'The Algorithm Suppresses You',
    points:['Posts receive only 1–3% organic reach by default','Early engagement signals determine your entire distribution','The algorithm detects and penalises coordinated inauthentic behaviour (CIB)','Solo momentum takes years — most creators never break through'] },
  { icon:EyeOff, color:'#F59E0B', title:'Brands Only See Numbers',
    points:['Brands now prioritise engagement rate over follower count','A weak engagement history makes you invisible in brand searches','Without proof of reach, negotiations start at zero','Micro-influencers are ignored despite having tighter communities'] },
  { icon:AlertTriangle, color:'#818CF8', title:'You Are Building Alone',
    points:['No structured community amplifying your best work','No accountability system keeping momentum going','No playbooks for consistent algorithmic performance','No network effect — every post starts from scratch'] },
]

function ConstellationBg() {
  const lines=[['5%','20%','25%','65%'],['25%','65%','55%','28%'],['55%','28%','80%','72%'],['80%','72%','95%','18%'],['95%','18%','5%','20%'],['25%','65%','80%','72%']]
  const dots=[['5%','20%'],['25%','65%'],['55%','28%'],['80%','72%'],['95%','18%'],['50%','45%']]
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.14 }} preserveAspectRatio="none">
      {lines.map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3B82F6" strokeWidth="0.6"
          strokeDasharray="5 9" style={{ animation:`beam-pulse ${2.8+i*0.35}s ease-in-out infinite`, animationDelay:`${i*0.28}s` }}/>
      ))}
      {dots.map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#22D3EE"
          style={{ animation:`star-twinkle ${2.2+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }}/>
      ))}
    </svg>
  )
}

function TiltCard({ p, delay }) {
  const ref = useRef(null)
  const [secRef, inView] = useInView()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-100,100],[10,-10]),{stiffness:280,damping:28})
  const rY = useSpring(useTransform(x,[-100,100],[-10,10]),{stiffness:280,damping:28})
  const glowX = useTransform(x,[-100,100],['10%','90%'])
  const glowY = useTransform(y,[-100,100],['10%','90%'])
  const Icon = p.icon
  return (
    <motion.div ref={secRef} initial={{opacity:0,y:44}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.75,delay,ease:[0.23,1,0.32,1]}} style={{perspective:900}}>
      <motion.div ref={ref}
        style={{ rotateX:rX, rotateY:rY, transformStyle:'preserve-3d', borderRadius:26, padding:'34px 30px',
          background:'rgba(13,19,38,0.7)', backdropFilter:'blur(22px)',
          border:`1px solid ${p.color}22`, position:'relative', overflow:'hidden', cursor:'default' }}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{scale:1.03,boxShadow:`0 32px 80px ${p.color}20`}}
      >
        <motion.div style={{ position:'absolute', width:160, height:160, borderRadius:'50%',
          background:p.color, filter:'blur(55px)', opacity:0.08,
          left:glowX, top:glowY, transform:'translate(-50%,-50%)', pointerEvents:'none' }}/>
        <div style={{ width:52, height:52, borderRadius:17, background:`${p.color}12`,
          border:`1px solid ${p.color}28`, display:'flex', alignItems:'center', justifyContent:'center',
          marginBottom:22, boxShadow:`0 0 20px ${p.color}22` }}>
          <Icon size={23} color={p.color}/>
        </div>
        <h3 style={{ fontSize:19, fontWeight:700, marginBottom:16, fontFamily:'Space Grotesk' }}>{p.title}</h3>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
          {p.points.map((pt,i)=>(
            <li key={i} style={{ display:'flex', gap:9, fontSize:13.5, color:'#64748B', lineHeight:1.55 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:p.color, display:'inline-block', flexShrink:0, marginTop:6 }}/>
              {pt}
            </li>
          ))}
        </ul>
        <div style={{ marginTop:22, height:1.5, borderRadius:2, background:`linear-gradient(90deg,${p.color}45,transparent)` }}/>
      </motion.div>
    </motion.div>
  )
}

export default function Problem() {
  const [ref, inView] = useInView()
  return (
    <section
  className="section-py"
  id="creators"
  style={{
    position: "relative",
    paddingTop: "0px",
    paddingBottom: "96px",
    marginTop: "-70px",
  }}
>
      <ConstellationBg/>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
       <motion.div
  ref={ref}
  initial={{ opacity: 0, y: 24 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.7 }}
  style={{ textAlign: "center", marginBottom: 52 }}
>
  <span
    className="section-tag"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 22px",
      borderRadius: 999,
      background: "rgba(13,19,38,0.65)",
      border: "1px solid rgba(248,113,113,0.28)",
      backdropFilter: "blur(14px)",
    }}
  >
    <span
      className="pulse-ring"
      style={{
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: "#F87171",
        display: "inline-block",
        boxShadow: "0 0 12px #F87171",
      }}
    />
    <span
      style={{
        fontSize: "18px",
        fontWeight: 800,
        color: "#FFD4D4",
        letterSpacing: "0.01em",
      }}
    >
      The Problem Every Creator Faces
    </span>
  </span>
          
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="problem-grid">
          {PROBLEMS.map((p,i)=><TiltCard key={p.title} p={p} delay={i*0.13}/>)}
        </div>
      </div>
      <style>{`@media(max-width:900px){.problem-grid{grid-template-columns:1fr !important;}}@media(min-width:580px) and (max-width:900px){.problem-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
    </section>
  )
}
