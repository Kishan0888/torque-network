import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q:'Who is Torque Network for?',
    a:"Torque Network is built for Indian creators across any niche — fashion, finance, fitness, food, travel, tech, beauty — who are serious about growing their reach systematically. We accept creators at any follower count; we evaluate engagement quality, not vanity metrics." },
  { q:'How is this different from an engagement pod?',
    a:"Engagement pods are unstructured, unaccountable, and easily detected by platform algorithms as coordinated inauthentic behaviour (CIB). Torque is a compliance-governed amplification system with vetted members, enforced participation windows, and high-signal action training. The difference is the difference between a group chat and a performance engine." },
  { q:'Is the engagement algorithm-safe?',
    a:"Yes. Our system is designed around the exact behaviours that platforms reward: saves, shares, genuine comments, watch time, and profile visits. We explicitly prohibit AI-generated comments and rapid-fire liking patterns that trigger CIB detection. Every action is natural, distributed, and genuine." },
  { q:'What is the 48-hour amplification window?',
    a:"When you post and submit the link to your cohort channel, your 500–1,000 cohort members engage with your content over the following 48 hours. This timing is critical — platforms measure early engagement velocity to determine distribution. Concentrated genuine engagement in this window tells the algorithm your content deserves broader reach." },
  { q:'Is the ₹1,500/month founding rate really locked for life?',
    a:"Yes — in writing. The first 100 founding members are guaranteed this rate permanently. Standard membership will be priced higher after the founding cohort fills. The rate lock is our commitment to early believers. It never increases regardless of network size, feature additions, or pricing changes for new members." },
  { q:'How do brand campaigns work?',
    a:"As the network matures, brands seeking niche creator partnerships are introduced to the Torque Network brand directory. Founding members receive priority matching. Our team handles brief distribution and negotiation structure. You get approached — you don't have to pitch." },
  { q:'What happens if I miss my participation window?',
    a:"Three missed windows trigger an automatic membership review. One written warning is issued before any action. We understand life happens — the compliance system exists to protect every member's investment, not to punish occasional misses. Consistent, genuine participation is all we ask." },
  { q:"What's the minimum follower count to apply?",
    a:"There is no minimum. We evaluate content quality, engagement authenticity, niche clarity, and posting consistency. A creator with 2,000 genuinely engaged followers in a well-defined niche is a stronger fit than one with 100,000 passive followers." },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  return (
    <motion.div ref={ref} initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.55,delay:index*0.06,ease:[0.23,1,0.32,1]}}
      style={{ borderRadius:16, overflow:'hidden',
        background:open?'rgba(13,19,38,0.82)':'rgba(13,19,38,0.5)',
        border:open?'1px solid rgba(34,211,238,0.2)':'1px solid rgba(255,255,255,0.06)',
        transition:'background 0.25s,border-color 0.25s' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'20px 24px', background:'none', border:'none',
        color:'#F8FAFC', textAlign:'left', cursor:'pointer', gap:16 }}>
        <span style={{ fontSize:15, fontWeight:600, fontFamily:'Space Grotesk', lineHeight:1.4 }}>{faq.q}</span>
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.28}} style={{flexShrink:0}}>
          <ChevronDown size={18} color={open?'#22D3EE':'#475569'}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.3,ease:[0.23,1,0.32,1]}} style={{overflow:'hidden'}}>
            <div style={{ padding:'0 24px 22px', fontSize:14, color:'#64748B', lineHeight:1.72,
              borderTop:'1px solid rgba(255,255,255,0.05)' }}>
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
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <span className="section-tag">Common Questions</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Straight <span className="gradient-text">answers.</span>
          </h2>
          <p style={{ fontSize:15, color:'#64748B', maxWidth:440, margin:'14px auto 0', lineHeight:1.7 }}>
            Everything you need to know before applying.
          </p>
        </motion.div>
        <div style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:10 }}>
          {FAQS.map((f,i)=><FAQItem key={i} faq={f} index={i}/>)}
        </div>
      </div>
    </section>
  )
}
