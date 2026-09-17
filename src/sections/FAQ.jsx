import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q:'Who is Torque Network for?', a:'Torque is built for Indian creators at any stage — from 1,000 to 1,000,000 followers — who want genuine community over vanity metrics. We work best for finance, fitness, food, fashion, tech, and lifestyle niches.' },
  { q:'Is this an engagement pod?', a:'No. Engagement pods are unstructured, unaccountable, and often low-quality. Torque is a curated creator community with verified members, niche matching, and a culture of meaningful content interaction. Think of it as a professional network, not a like-for-like scheme.' },
  { q:'How does the application process work?', a:'Apply through our 4-step form. Our team reviews every application within 48 hours. We look at content quality, engagement authenticity, and niche fit. If approved, you\'ll receive an onboarding invite to join your cohort.' },
  { q:'Is there a cost to join right now?', a:'The founding community phase is invite-first and we\'re currently focusing on building the right community before introducing any membership structure. Apply now to secure your founding status.' },
  { q:'How quickly will I see results?', a:'Torque is built for long-term, compounding growth — not overnight spikes. Most members notice stronger engagement quality within the first few weeks, with meaningful profile growth building over 2–3 months in community.' },
  { q:'How do brand opportunities work?', a:'As the community matures, we\'ll facilitate connections between brands and creators through our platform. Founding creators get priority access when brand opportunities become available.' },
  { q:"What's the minimum follower count?", a:"None. We evaluate engagement quality and content potential, not follower count alone. A creator with 2,000 highly engaged followers in a defined niche is often a stronger fit than one with 100,000 passive followers." },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()

  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.55,delay:index*0.06,ease:[0.23,1,0.32,1]}}
      style={{
        borderRadius:16,overflow:'hidden',
        background:open?'rgba(13,19,38,0.82)':'rgba(13,19,38,0.5)',
        border:open?'1px solid rgba(34,211,238,0.2)':'1px solid rgba(255,255,255,0.06)',
        transition:'background 0.25s,border-color 0.25s',
      }}
    >
      <button onClick={()=>setOpen(!open)} style={{
        width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'20px 24px',background:'none',border:'none',color:'#F8FAFC',
        textAlign:'left',cursor:'pointer',gap:16,
      }}>
        <span style={{fontSize:15,fontWeight:600,fontFamily:'Space Grotesk',lineHeight:1.4}}>{faq.q}</span>
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.28}} style={{flexShrink:0}}>
          <ChevronDown size={18} color={open?'#22D3EE':'#475569'}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open&&(
          <motion.div
            initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.3,ease:[0.23,1,0.32,1]}} style={{overflow:'hidden'}}
          >
            <div style={{padding:'0 24px 22px',fontSize:14,color:'#64748B',lineHeight:1.72,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{paddingTop:16}}>{faq.a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" id="faq">
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:56}}
        >
          <span className="section-tag">Common Questions</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Straight <span className="gradient-text">answers.</span>
          </h2>
        </motion.div>
        <div style={{maxWidth:720,margin:'0 auto',display:'flex',flexDirection:'column',gap:10}}>
          {faqs.map((f,i)=><FAQItem key={i} faq={f} index={i}/>)}
        </div>
      </div>
    </section>
  )
}
