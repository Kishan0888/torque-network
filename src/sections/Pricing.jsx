import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const BENEFITS = [
  '500–2,500 real creators watch, save and share your post',
  'Engagement within 48 hours, staggered naturally',
  'A professionally managed network, open to every creator category',
  'Access to a vetted community of 10,000+ influencers',
  'A network that grows with you at no extra cost',
]

// Public pricing never opens Razorpay directly: visitors create an account
// first, then subscribe from /account. Signed-in visitors who land on /signup
// are redirected to /account automatically.
const SUBSCRIBE_HREF = '/signup'

export default function Pricing() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', opacity:0.07, background:'radial-gradient(circle,#3B82F6,#22D3EE,transparent 65%)', filter:'blur(70px)' }}/>
      </div>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:16 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>Membership</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            One Simple Plan.<br/><span className="gradient-text">₹750 a Month.</span>
          </h2>
        </motion.div>

        <motion.div initial={{opacity:0,y:8}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.2}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontSize:15, color:'#64748B', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            Every member gets the full Torque Network experience in a single monthly membership.
          </p>
        </motion.div>

        <motion.div initial={{opacity:0,y:40,scale:0.97}} animate={inView?{opacity:1,y:0,scale:1}:{}}
          transition={{duration:0.9,delay:0.25,ease:[0.23,1,0.32,1]}}
          style={{ position:'relative', width:'100%', maxWidth:480, margin:'0 auto' }}>
          {/* Glow halo */}
          <div style={{ position:'absolute', inset:-2, borderRadius:28, background:'linear-gradient(135deg,#3B82F6,#22D3EE,#818CF8)', opacity:0.25, filter:'blur(18px)' }}/>

          <div className="animated-border" style={{ borderRadius:26, position:'relative' }}>
            <div style={{ borderRadius:25, background:'#0D1326', overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,transparent,#22D3EE,transparent)' }}/>
              <div style={{ padding:'40px 38px' }} className="pricing-card-pad">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
                  <Sparkles size={14} color="#22D3EE"/>
                  <span style={{ fontSize:12, fontWeight:700, color:'#22D3EE', textTransform:'uppercase', letterSpacing:'0.1em' }}>Standard Member</span>
                </div>

                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:28 }}>
                  <span style={{ fontSize:'clamp(3rem,7vw,4.2rem)', fontWeight:700, fontFamily:'Space Grotesk', letterSpacing:'-0.04em', lineHeight:1,
                    background:'linear-gradient(135deg,#3B82F6,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    ₹750
                  </span>
                  <span style={{ fontSize:15, color:'#64748B', fontWeight:500 }}>/month</span>
                </div>

                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:34 }}>
                  {BENEFITS.map((b,i)=>(
                    <motion.li key={b} initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
                      transition={{delay:0.4+i*0.06,duration:0.45}}
                      style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'#CBD5E1', lineHeight:1.5 }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:2,
                        background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.35)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={9} color="#22D3EE"/>
                      </div>
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <a href={SUBSCRIBE_HREF} className="btn-primary"
                  style={{ width:'100%', justifyContent:'center', fontSize:15, fontWeight:700, padding:'16px 24px', borderRadius:14 }}>
                  Subscribe — ₹750/month <ArrowRight size={16}/>
                </a>
                <p style={{ textAlign:'center', fontSize:12, color:'#64748B', marginTop:12 }}>Billed monthly · Cancel anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:520px){.pricing-card-pad{padding:32px 22px !important;}}`}</style>
    </section>
  )
}
