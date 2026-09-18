import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { CheckCircle, AlertOctagon } from 'lucide-react'

const MONTHLY = [
  { text:'Engage on every post submitted to your cohort channel during the amplification window',  warn:false },
  { text:'Submit a minimum of one post per month for community amplification',                     warn:false },
  { text:'Keep interactions high-quality: saves, genuine comments, meaningful shares',             warn:false },
  { text:'Maintain active presence in your niche channel — lurking without engaging is not allowed',warn:true },
  { text:'Respond to brand campaign briefs within 48 hours if selected',                           warn:false },
  { text:'Follow the algorithm playbook guidelines for post timing and format',                    warn:false },
]
const COMPLIANCE = [
  { text:'Three missed participation windows = automatic membership review',    level:'warn' },
  { text:'Engagement must be genuine — AI-generated comments are prohibited',   level:'warn' },
  { text:'No cross-posting or sharing content outside your verified cohort',     level:'info' },
  { text:'Repeated violations result in permanent removal with no refund',       level:'danger' },
  { text:'One written warning issued before any action is taken',                level:'info' },
  { text:'Appeals can be submitted within 7 days of any membership decision',   level:'info' },
]

const levelColor = { warn:'#F59E0B', danger:'#EF4444', info:'#22D3EE' }

export default function Obligations() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.3)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#F59E0B' }}>Community Standards</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            What we ask<br/><span className="gradient-text">of you.</span>
          </h2>
          <p style={{ fontSize:15.5, color:'#64748B', maxWidth:520, margin:'14px auto 0', lineHeight:1.72 }}>
            Torque's power comes from mutual accountability. These standards protect every member — including you.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }} className="oblig-grid">
          {/* Monthly Obligations */}
          <motion.div initial={{opacity:0,x:-32}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px',
              background:'rgba(13,19,38,0.65)', backdropFilter:'blur(22px)',
              border:'1px solid rgba(34,211,238,0.14)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <CheckCircle size={20} color="#22D3EE"/>
              <div style={{ fontSize:16, fontWeight:700, fontFamily:'Space Grotesk' }}>Monthly Obligations</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {MONTHLY.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-18}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.2+i*0.08,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background:item.warn?'rgba(245,158,11,0.12)':'rgba(34,211,238,0.1)',
                    border:`1px solid ${item.warn?'rgba(245,158,11,0.3)':'rgba(34,211,238,0.25)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle size={10} color={item.warn?'#F59E0B':'#22D3EE'}/>
                  </div>
                  <span style={{ fontSize:13.5, color:item.warn?'#CBD5E1':'#94A3B8', lineHeight:1.6 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Compliance */}
          <motion.div initial={{opacity:0,x:32}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8,delay:0.1,ease:[0.23,1,0.32,1]}}
            style={{ borderRadius:24, padding:'36px 32px',
              background:'rgba(13,19,38,0.65)', backdropFilter:'blur(22px)',
              border:'1px solid rgba(245,158,11,0.14)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <AlertOctagon size={20} color="#F59E0B"/>
              <div style={{ fontSize:16, fontWeight:700, fontFamily:'Space Grotesk' }}>Compliance Policy</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {COMPLIANCE.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:18}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.25+i*0.08,duration:0.5}}
                  style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 14px', borderRadius:12,
                    background:`${levelColor[item.level]}08`, border:`1px solid ${levelColor[item.level]}18` }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:levelColor[item.level], flexShrink:0, marginTop:7 }}/>
                  <span style={{ fontSize:13.5, color:'#94A3B8', lineHeight:1.6 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop:20, padding:'14px 16px', borderRadius:14,
              background:'rgba(34,211,238,0.05)', border:'1px solid rgba(34,211,238,0.12)' }}>
              <p style={{ fontSize:12.5, color:'#64748B', lineHeight:1.65 }}>
                💡 These standards exist to protect your investment in this network. Every rule here prevents one bad actor from diminishing the value of membership for hundreds of honest creators.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.oblig-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
