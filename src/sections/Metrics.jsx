import { motion } from 'framer-motion'
import { useInView, useCounter } from '../hooks/useInView'

const METRICS = [
  { value:1000, prefix:'', suffix:'+',    label:'Members amplify your post', sub:'500–1,000 per post' },
  { value:48,   prefix:'', suffix:' Hrs', label:'Guaranteed engagement',     sub:'Within the window' },
  { value:10000,prefix:'', suffix:'+',    label:'Network at full scale',     sub:'Growing monthly'   },
  { value:1500, prefix:'₹',suffix:'',    label:'Founding rate / month',     sub:'Locked for life'   },
]

function Metric({ m, delay }) {
  const [ref, inView] = useInView()
  const count = useCounter(m.value, 2000, inView)
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.65, delay, ease:[0.23,1,0.32,1] }}
      style={{ textAlign:'center', padding:'0 16px', position:'relative' }}
    >
      <div style={{ fontSize:'clamp(1.9rem,3vw,2.6rem)', fontWeight:700, fontFamily:'Space Grotesk', letterSpacing:'-0.04em', lineHeight:1,
        background:'linear-gradient(135deg,#3B82F6,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
        {m.prefix}{count.toLocaleString()}{m.suffix}
      </div>
      <div style={{ fontSize:13, color:'#F8FAFC', fontWeight:600, marginTop:8 }}>{m.label}</div>
      <div style={{ fontSize:11, color:'#475569', marginTop:3 }}>{m.sub}</div>
    </motion.div>
  )
}

export default function Metrics() {
  const [ref, inView] = useInView()
  return (
    <section style={{ padding:'0 0 80px' }}>
      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.7 }}
          style={{ background:'rgba(13,19,38,0.55)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(59,130,246,0.12)', borderRadius:24, padding:'44px 32px',
            display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0,
            position:'relative', overflow:'hidden' }} className="metrics-card"
        >
          <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'70%', height:1,
            background:'linear-gradient(to right,transparent,rgba(34,211,238,0.35),transparent)' }}/>
          <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'50%', height:1,
            background:'linear-gradient(to right,transparent,rgba(59,130,246,0.2),transparent)' }}/>
          {[1,2,3].map(i=>(
            <div key={i} style={{ position:'absolute', left:`${i*25}%`, top:'15%', bottom:'15%', width:1,
              background:'rgba(59,130,246,0.1)' }} className="metric-div"/>
          ))}
          {METRICS.map((m,i)=><Metric key={m.label} m={m} delay={i*0.09}/>)}
        </motion.div>
      </div>
      <style>{`@media(max-width:640px){.metrics-card{grid-template-columns:repeat(2,1fr) !important;gap:36px 0 !important;padding:32px 20px !important;}.metric-div{display:none !important;}}`}</style>
    </section>
  )
}
