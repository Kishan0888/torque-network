import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q:'Is this an engagement pod?',
    a:"Torque Network is a structured community where verified creators support each other's posts, so it shares the give-and-take idea of a pod. The difference is in how it runs. Pods are usually small, informal groups with no checks. Here every member is verified, the network is professionally managed, and engagement is spread naturally over a 48-hour window instead of arriving all at once." },
  { q:'Will Instagram penalise me for joining?',
    a:"Instagram's rules are aimed at fake engagement such as bots, purchased likes and fake accounts. Torque Network is made up of real, verified creators who genuinely watch, save and share content. Nobody outside Instagram can control how it treats an account, so we don't promise specific results. We ask every member to engage genuinely and never to use automation." },
  { q:'How are members verified?',
    a:"Everyone applies with their Instagram handle. We review each application to check that the account is real and active. Approved members get access to the private channel within 48 hours." },
  { q:'Is Torque Network only for certain types of creators?',
    a:"No. It is open to Instagram creators in every category, from food and travel to fashion, fitness, tech and comedy. It is also open to creators of every size, from under 5K followers to 100K+." },
  { q:'Is Founding Membership really free?',
    a:"Yes. The first 500 members join free, and that free membership is locked for life. There is one condition: you keep engaging regularly with all the posts in the network. The network works because members give as much as they get." },
  { q:'What does "engaging regularly" mean?',
    a:"It means showing up for the other members by watching, saving and sharing their posts within the 48-hour window after each one is submitted. The engagement you receive comes from members doing the same for you, so this is what keeps the network working for everyone." },
  { q:'What happens if I stop engaging regularly?',
    a:"Founding Membership stays free only while you keep engaging regularly with all posts. If you stop, your free membership may end and your spot may be released to another creator. Coming back after that would be at the ₹1,500 per month rate." },
  { q:'What does it cost after the first 500 spots?',
    a:"Members who join after the first 500 pay ₹1,500 per month, which is less than a dinner out. They get the same benefits as Founding Members." },
  { q:'How soon will my posts get engagement?',
    a:"After you submit a post to the private channel, members engage within a 48-hour window, staggered naturally rather than all at once. Between 500 and 2,500 creators can engage with each post. Results vary from post to post, so we don't promise specific reach or follower numbers." },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  return (
    <motion.div ref={ref} initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.55,delay:index*0.055,ease:[0.23,1,0.32,1]}}
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
            <div style={{ padding:'0 24px 22px', fontSize:14, color:'#64748B', lineHeight:1.72, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
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
          <span className="section-tag">Questions</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Straight <span className="gradient-text">answers.</span>
          </h2>
        </motion.div>
        <div style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:10 }}>
          {FAQS.map((f,i)=><FAQItem key={i} faq={f} index={i}/>)}
        </div>
      </div>
    </section>
  )
}
