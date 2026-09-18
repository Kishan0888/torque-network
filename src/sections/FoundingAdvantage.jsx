import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Lock, TrendingUp, Network } from 'lucide-react'

const PILLARS = [
  { icon:Lock,       color:'#22D3EE', title:'Rate Locked for Life',
    desc:'₹1,500/month is your founding rate — permanently. As Torque scales and the value of membership compounds, your rate never increases. The first 100 creators get this guarantee in writing.' },
  { icon:TrendingUp, color:'#3B82F6', title:'Value Grows as Network Grows',
    desc:'Month 1 you have 100 creators amplifying your posts. Month 18, you have 2,000. Month 36, 10,000. Same subscription. Exponentially greater reach. The value of your membership multiplies with every new verified creator.' },
  { icon:Network,    color:'#818CF8', title:'The Network Effect Explained',
    desc:"Every new creator makes Torque more valuable for every existing creator. More niches. More reach. More brand campaigns. More collaboration opportunities. You're not just buying access — you're locking into a compounding asset." },
]

export default function FoundingAdvantage() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ position:'relative', overflow:'hidden' }}>
      {/* Moving aurora */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:900, height:900, borderRadius:'50%', opacity:0.06,
          background:'radial-gradient(circle,#3B82F6 0%,#22D3EE 35%,transparent 70%)', filter:'blur(80px)' }}/>
        <div className="aurora" style={{ position:'absolute', top:'20%', right:'-10%',
          width:500, height:500, borderRadius:'50%', opacity:0.04,
          background:'radial-gradient(circle,#818CF8,transparent 70%)', filter:'blur(60px)', animationDelay:'-8s' }}/>
      </div>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>Founding Member Advantage</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Why joining now<br/><span className="gradient-text">changes everything.</span>
          </h2>
          <p style={{ fontSize:16, color:'#64748B', maxWidth:500, margin:'14px auto 0', lineHeight:1.7 }}>
            The founding 100 creators receive advantages that will never be available to standard members.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="adv-grid">
          {PILLARS.map((p,i)=>{
            const [cardRef,cardInView]=useInView()
            const Icon=p.icon
            return (
              <motion.div key={p.title} ref={cardRef}
                initial={{opacity:0,y:40}} animate={cardInView?{opacity:1,y:0}:{}}
                transition={{duration:0.75,delay:i*0.14,ease:[0.23,1,0.32,1]}}
                whileHover={{y:-8,boxShadow:`0 32px 80px ${p.color}22`}}
                style={{ borderRadius:26, padding:'38px 34px', cursor:'default', position:'relative', overflow:'hidden',
                  background:'rgba(13,19,38,0.72)', backdropFilter:'blur(26px)', border:`1px solid ${p.color}22` }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
                  background:`linear-gradient(90deg,transparent,${p.color},transparent)` }}/>
                <div style={{ width:56, height:56, borderRadius:18, background:`${p.color}14`,
                  border:`1px solid ${p.color}30`, display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:26, boxShadow:`0 0 28px ${p.color}28` }}>
                  <Icon size={24} color={p.color}/>
                </div>
                <h3 style={{ fontSize:19, fontWeight:700, marginBottom:13, fontFamily:'Space Grotesk' }}>{p.title}</h3>
                <p style={{ fontSize:14.5, color:'#64748B', lineHeight:1.72 }}>{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
      <style>{`@media(max-width:900px){.adv-grid{grid-template-columns:1fr !important;}}@media(min-width:580px) and (max-width:900px){.adv-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
    </section>
  )
}
