import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Eye, Award, Compass, Star, Globe, Handshake } from 'lucide-react'

const early = [
  { icon:Eye,     title:'Better Visibility',        color:'#3B82F6', desc:'Your content reaches people who genuinely care about your niche, not random scroll-by views.' },
  { icon:Award,   title:'Stronger Profile Activity', color:'#22D3EE', desc:'Consistent, meaningful engagement signals tell the algorithm your content deserves wider distribution.' },
  { icon:Compass, title:'Creator Confidence',       color:'#818CF8', desc:'When you have a community behind you, you create more boldly and with greater clarity of purpose.' },
]
const longterm = [
  { icon:Star,      title:'Stronger Creator Identity',   color:'#F59E0B', desc:'After months in your niche community, you become a recognisable voice — not just another account.' },
  { icon:Globe,     title:'Long-Term Community Value',   color:'#EC4899', desc:'The relationships you build in Torque outlast any algorithm update or trend cycle.' },
  { icon:Handshake, title:'Better Collaboration Opportunities', color:'#10B981', desc:'Brands and fellow creators seek out trusted community members first — because trust is the real currency.' },
]

function JourneyCard({ item, inView, delay }) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.65,delay,ease:[0.23,1,0.32,1]}}
      whileHover={{y:-5,boxShadow:`0 20px 50px ${item.color}18`}}
      style={{
        display:'flex',gap:16,alignItems:'flex-start',
        background:'rgba(13,19,38,0.65)',backdropFilter:'blur(20px)',
        border:`1px solid ${item.color}18`,borderRadius:20,padding:'22px 24px',cursor:'default',
      }}
    >
      <div style={{
        width:46,height:46,borderRadius:14,flexShrink:0,
        background:`${item.color}12`,border:`1px solid ${item.color}28`,
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:`0 0 18px ${item.color}22`,
      }}>
        <Icon size={20} color={item.color}/>
      </div>
      <div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:6,fontFamily:'Space Grotesk'}}>{item.title}</div>
        <p style={{fontSize:13,color:'#64748B',lineHeight:1.65}}>{item.desc}</p>
      </div>
    </motion.div>
  )
}

function Column({ label, sublabel, labelColor, items, inView, baseDelay }) {
  return (
    <div>
      <div style={{marginBottom:32}}>
        <div style={{
          display:'inline-flex',alignItems:'center',gap:8,
          padding:'6px 16px',borderRadius:100,
          background:`${labelColor}14`,border:`1px solid ${labelColor}28`,
          fontSize:12,fontWeight:600,color:labelColor,marginBottom:12,
        }}>{label}</div>
        <div style={{fontSize:24,fontWeight:700,fontFamily:'Space Grotesk'}}>{sublabel}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {items.map((item,i)=>(
          <JourneyCard key={item.title} item={item} inView={inView} delay={baseDelay+i*0.1}/>
        ))}
      </div>
    </div>
  )
}

export default function GrowthJourney() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{background:'rgba(5,8,22,0.9)'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:72}}
        >
          <span className="section-tag" style={{color:'#22D3EE'}}>The Creator Journey</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            What growth <span className="gradient-text">actually looks like.</span>
          </h2>
          <p style={{fontSize:16,color:'#64748B',maxWidth:500,margin:'14px auto 0',lineHeight:1.7}}>
            Not vanity metrics. Not overnight virality. Real, compounding growth built on community trust.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start'}} className="journey-grid">
          <Column
            label="First 30–90 Days" sublabel="Build momentum."
            labelColor="#3B82F6" items={early} inView={inView} baseDelay={0.2}
          />
          <Column
            label="6–36 Months" sublabel="Build legacy."
            labelColor="#22D3EE" items={longterm} inView={inView} baseDelay={0.35}
          />
        </div>
      </div>
      <style>{`@media(max-width:800px){.journey-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
