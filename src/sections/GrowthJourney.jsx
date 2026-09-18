import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { TrendingUp, Award, Globe } from 'lucide-react'

const EARLY = [
  { icon:TrendingUp, color:'#3B82F6', title:'Consistent Post Reach',    desc:'Every post receives 500–1,000 genuine interactions within 48 hours, giving algorithms the early signal they need to distribute further.' },
  { icon:Award,      color:'#22D3EE', title:'Stronger Engagement Rate', desc:'Your profile metrics improve measurably week over week as your engagement history builds into undeniable proof of content quality.' },
  { icon:Globe,      color:'#818CF8', title:'Community & Confidence',   desc:'You have a niche community behind your content. The isolation disappears. You post with purpose, backed by people who care about your growth.' },
]
const LONGTERM = [
  { color:'#F59E0B', title:'Brand Deals on Your Terms',       desc:'A proven engagement rate means brands approach you. Your rate card is backed by data, not hope.' },
  { color:'#EC4899', title:'Recognised Niche Authority',      desc:'18–36 months in a focused community makes you a known voice. Collaborations, speaking, and brand partnerships follow naturally.' },
  { color:'#10B981', title:'Network That Compounds Forever',  desc:'The creators you grow alongside become your long-term collaborators. This network effect outlasts any algorithm change.' },
]

export default function GrowthJourney() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(5,8,22,0.9)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:72 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>The Creator Journey</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            What growth <span className="gradient-text">actually looks like.</span>
          </h2>
          <p style={{ fontSize:16, color:'#64748B', maxWidth:500, margin:'14px auto 0', lineHeight:1.7 }}>
            Not overnight spikes — compounding momentum built on real community trust.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'start', position:'relative' }} className="journey-grid">
          {/* Connecting beam */}
          <div className="journey-beam" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:2, height:'60%', background:'linear-gradient(to bottom,#3B82F6,#22D3EE)',
            opacity:0.2, borderRadius:2 }}/>
          {/* Left */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:100,
              background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.28)',
              fontSize:12, fontWeight:700, color:'#3B82F6', marginBottom:24, textTransform:'uppercase', letterSpacing:'0.08em' }}>
              First 30–90 Days
            </div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'Space Grotesk', marginBottom:28 }}>Build momentum.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {EARLY.map((item,i)=>{
                const [cardRef, cardInView] = useInView()
                const Icon = item.icon
                return (
                  <motion.div key={item.title} ref={cardRef}
                    initial={{opacity:0,x:-24}} animate={cardInView?{opacity:1,x:0}:{}}
                    transition={{duration:0.6,delay:i*0.1}}
                    whileHover={{y:-4,boxShadow:`0 16px 48px ${item.color}18`}}
                    style={{ display:'flex', gap:16, alignItems:'flex-start', borderRadius:20, padding:'20px 22px',
                      background:'rgba(13,19,38,0.65)', backdropFilter:'blur(20px)',
                      border:`1px solid ${item.color}18`, cursor:'default' }}>
                    <div style={{ width:44, height:44, borderRadius:14, background:`${item.color}12`,
                      border:`1px solid ${item.color}28`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={20} color={item.color}/>
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, marginBottom:5, fontFamily:'Space Grotesk' }}>{item.title}</div>
                      <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          {/* Right */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:100,
              background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.25)',
              fontSize:12, fontWeight:700, color:'#22D3EE', marginBottom:24, textTransform:'uppercase', letterSpacing:'0.08em' }}>
              6–36 Months & Beyond
            </div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'Space Grotesk', marginBottom:28 }}>Build legacy.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {LONGTERM.map((item,i)=>{
                const [cardRef, cardInView] = useInView()
                return (
                  <motion.div key={item.title} ref={cardRef}
                    initial={{opacity:0,x:24}} animate={cardInView?{opacity:1,x:0}:{}}
                    transition={{duration:0.6,delay:i*0.1}}
                    whileHover={{y:-4,boxShadow:`0 16px 48px ${item.color}18`}}
                    style={{ borderRadius:20, padding:'20px 22px',
                      background:'rgba(13,19,38,0.65)', backdropFilter:'blur(20px)',
                      border:`1px solid ${item.color}18`, cursor:'default' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:item.color, flexShrink:0,
                        boxShadow:`0 0 10px ${item.color}` }}/>
                      <div style={{ fontSize:15, fontWeight:700, fontFamily:'Space Grotesk' }}>{item.title}</div>
                    </div>
                    <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65 }}>{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:800px){.journey-grid{grid-template-columns:1fr !important;}.journey-beam{display:none !important;}}`}</style>
    </section>
  )
}
