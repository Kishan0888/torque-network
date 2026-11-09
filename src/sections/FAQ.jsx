import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q:'Is Torque Network for Instagram or LinkedIn?',
    a:"Both. Torque for Instagram is a network for creators who want their posts, reels and carousels to reach beyond their followers. Torque for LinkedIn is a separate network for professionals who want genuine engagement on their LinkedIn posts from peers in their own industry. Each has its own members and its own monthly plan, and you can join one or both with the same account." },
  { q:'How does Torque for LinkedIn work?',
    a:"You pick your industry (for example HR, finance, sales, marketing, IT, data and AI, product, consulting or healthcare) and join a community of professionals in that field. When you publish a LinkedIn post, you submit its link from your dashboard, and fellow members react, comment thoughtfully and repost. You can submit up to two posts a week, and every month you get a content guide with topic ideas for your domain." },
  { q:'Is this an engagement pod?',
    a:"Torque Network is a structured community where verified members support each other's posts, so it shares the give-and-take idea of a pod. The difference is in how it runs. Pods are usually small, informal groups with no checks. Here every member is verified, the network is professionally managed, and engagement is spread naturally over time instead of arriving all at once." },
  { q:'Will Instagram or LinkedIn penalise me for joining?',
    a:"Both platforms' rules are aimed at fake engagement such as bots, purchased likes and fake accounts. Torque Network is made up of real, verified people who genuinely engage with content. Nobody outside Instagram or LinkedIn can control how they treat an account, so we don't promise specific results. We ask every member to engage genuinely and never to use automation or copy-paste comments." },
  { q:'How are members verified?',
    a:"Everyone signs up with their Instagram handle or LinkedIn profile, which our team checks to make sure the account is real and active. Posts submitted to the network are reviewed by the team as well." },
  { q:'Who can join?',
    a:"On Instagram, creators in every category, from food and travel to fashion, fitness, tech and comedy, and of every size, from under 5K followers to 100K+. On LinkedIn, working professionals across nine industries, from early-career talent to specialists, consultants and founders." },
  { q:'How much does membership cost?',
    a:"Torque Network has two separate monthly plans: Torque for Instagram (Standard Member) at ₹750 per month, and Torque for LinkedIn (LinkedIn Professional) at ₹500 per month. Join one or both. The network works because members give as much as they get, so every member is expected to engage regularly." },
  { q:'What does "engaging regularly" mean?',
    a:"It means showing up for the other members. On Instagram that means watching, saving and sharing their posts within the 48-hour window after each one is submitted. On LinkedIn it means reacting to and leaving thoughtful comments on posts from your industry community. The engagement you receive comes from members doing the same for you." },
  { q:'Can I cancel anytime?',
    a:"Yes. You can cancel from your account page at any time. You won't be charged again, and you keep access until the end of the month you have already paid for." },
  { q:'How soon will my posts get engagement?',
    a:"On Instagram, members engage within a 48-hour window after you submit a post, staggered naturally rather than all at once, and between 500 and 2,500 creators can engage with each post. On LinkedIn, peers from your industry engage after you submit the post from your dashboard. Results vary from post to post, so we don't promise specific reach or follower numbers." },
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
