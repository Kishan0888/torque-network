import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Zap, BarChart2, Star, BookOpen, Target } from 'lucide-react'

const BENEFITS = [
  { icon:Zap,      color:'#3B82F6', title:'Guaranteed Post Amplification',
    desc:'Every post you submit receives 500–1,000 genuine engagements from verified niche creators within your 48-hour window. No exceptions.', tag:'Core Benefit' },
  { icon:BarChart2,color:'#22D3EE', title:'Higher Engagement Rate',
    desc:'A consistently strong engagement rate signals quality to both the algorithm and brands. Your profile becomes undeniable data.', tag:'Algorithm Edge' },
  // { icon:Star,     color:'#818CF8', title:'Priority Brand Campaigns',
  //   desc:'Founding members get first access to brand campaigns sourced through the Torque Network brand directory. No cold outreach needed.', tag:'Revenue' },
  // { icon:Target,   color:'#F59E0B', title:'Brand Discovery Directory',
  //   desc:'Brands actively searching for creators in your niche will find your verified profile in our curated discovery directory.', tag:'Visibility' },
  { icon:BookOpen, color:'#EC4899', title:'Algorithm Playbooks',
    desc:'Exclusive playbooks, content frameworks, and niche-specific posting strategies built from real engagement data inside the network.', tag:'Strategy' },
]

function BenefitCard({ b, delay }) {
  const [ref, inView] = useInView()
  const Icon = b.icon
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:36 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.7, delay, ease:[0.23,1,0.32,1] }}
      className="float-a"
      style={{ '--fd': `${delay*2}s` }}
      whileHover={{ scale:1.03, y:-8, boxShadow:`0 28px 70px ${b.color}22` }}
    >
      <motion.div
        whileHover={{ scale:1.03, y:-8 }}
        style={{ borderRadius:24, padding:'32px 28px', height:'100%', cursor:'default',
          background:'rgba(13,19,38,0.68)', backdropFilter:'blur(22px)',
          border:`1px solid ${b.color}20`, position:'relative', overflow:'hidden' }}
      >
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent,${b.color}80,transparent)` }}/>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ width:50, height:50, borderRadius:16, background:`${b.color}12`,
            border:`1px solid ${b.color}28`, display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 0 22px ${b.color}22` }}>
            <Icon size={22} color={b.color}/>
          </div>
          <span style={{ fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:100,
            background:`${b.color}14`, color:b.color, letterSpacing:'0.06em', textTransform:'uppercase' }}>{b.tag}</span>
        </div>
        <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10, fontFamily:'Space Grotesk', lineHeight:1.3 }}>{b.title}</h3>
        <p style={{ fontSize:13.5, color:'#64748B', lineHeight:1.68 }}>{b.desc}</p>
      </motion.div>
    </motion.div>
  )
}

export default function MemberBenefits() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.25)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#3B82F6' }}>Member Benefits</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            What you get as <span className="gradient-text">a member.</span>
          </h2>
          <p style={{ fontSize:15.5, color:'#64748B', maxWidth:480, margin:'14px auto 0', lineHeight:1.7 }}>
            Five unfair advantages that solo creators simply cannot build alone.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }} className="benefits-grid">
          {BENEFITS.slice(0,3).map((b,i)=><BenefitCard key={b.title} b={b} delay={i*0.1}/>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:22, marginTop:22, maxWidth:780, margin:'22px auto 0' }}>
          {BENEFITS.slice(3).map((b,i)=><BenefitCard key={b.title} b={b} delay={0.3+i*0.1}/>)}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.benefits-grid{grid-template-columns:1fr !important;}}
        @media(min-width:580px) and (max-width:900px){.benefits-grid{grid-template-columns:repeat(2,1fr) !important;}}
      `}</style>
    </section>
  )
}
