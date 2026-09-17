import { motion } from 'framer-motion'
import { useInView, useCounter } from '../hooks/useInView'

const metrics = [
  { value:380,  suffix:'+',  prefix:'',  label:'Creators on Waitlist' },
  { value:8,    suffix:'',   prefix:'',  label:'Cities at Launch'     },
  { value:48,   suffix:'h',  prefix:'',  label:'Application Review'   },
  { value:100,  suffix:'',   prefix:'',  label:'Founding Spots'       },
]

function Metric({ m, delay }) {
  const [ref, inView] = useInView()
  const count = useCounter(m.value, 1800, inView)
  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.65,delay,ease:[0.23,1,0.32,1]}}
      style={{textAlign:'center',padding:'0 12px'}}
    >
      <div style={{
        fontSize:'clamp(2rem,3.5vw,2.8rem)',fontWeight:700,fontFamily:'Space Grotesk',
        letterSpacing:'-0.04em',marginBottom:8,
        background:'linear-gradient(135deg,#3B82F6,#22D3EE)',
        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
      }}>
        {m.prefix}{count.toLocaleString()}{m.suffix}
      </div>
      <div style={{fontSize:13,color:'#475569',fontWeight:400}}>{m.label}</div>
    </motion.div>
  )
}

export default function Metrics() {
  const [ref, inView] = useInView()
  return (
    <section style={{padding:'0 0 80px'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{
            background:'rgba(13,19,38,0.5)',backdropFilter:'blur(20px)',
            border:'1px solid rgba(59,130,246,0.1)',borderRadius:24,
            padding:'44px 32px',display:'grid',
            gridTemplateColumns:'repeat(4,1fr)',gap:0,position:'relative',overflow:'hidden',
          }}
          className="metrics-card"
        >
          {/* Subtle inner glow */}
          <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'60%',height:1,background:'linear-gradient(to right,transparent,rgba(34,211,238,0.3),transparent)'}}/>
          {/* Dividers */}
          {[1,2,3].map(i=>(
            <div key={i} style={{position:'absolute',left:`${i*25}%`,top:'18%',bottom:'18%',width:1,background:'rgba(59,130,246,0.1)'}} className="metric-div"/>
          ))}
          {metrics.map((m,i)=><Metric key={m.label} m={m} delay={i*0.08}/>)}
        </motion.div>
      </div>
      <style>{`
        @media(max-width:640px){.metrics-card{grid-template-columns:repeat(2,1fr) !important;gap:32px 0 !important;}.metric-div{display:none !important;}}
      `}</style>
    </section>
  )
}
