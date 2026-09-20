import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Check } from 'lucide-react'

const BENEFITS = [
  '500–2,500 real creators watch, save and share your post',
  'Engagement within 48 hours, staggered naturally',
  'A professionally managed network, open to every creator category',
  'Access to a vetted community of 10,000+ influencers',
  'A network that grows with you at no extra cost',
]

export default function Pricing() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" id="pricing" style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', opacity:0.07, background:'radial-gradient(circle,#3B82F6,#22D3EE,transparent 65%)', filter:'blur(70px)' }}/>
      </div>
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:16 }}>
          <span className="section-tag" style={{ color:'#F59E0B' }}>Membership</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Free for Life for the First 500.<br/><span className="gradient-text">Then ₹1,500 a Month.</span>
          </h2>
        </motion.div>

        <motion.div initial={{opacity:0,y:8}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.2}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontSize:15, color:'#64748B', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            Founding Members stay free for life, as long as they keep engaging regularly with all posts.
          </p>
        </motion.div>

        <div style={{ maxWidth:860, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }} className="pricing-grid">
          {/* Founding — gold featured */}
          <motion.div initial={{opacity:0,y:40,scale:0.97}} animate={inView?{opacity:1,y:0,scale:1}:{}}
            transition={{duration:0.9,delay:0.2,ease:[0.23,1,0.32,1]}}
            style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-2, borderRadius:28, background:'linear-gradient(135deg,#D97706,#F59E0B,#FBBF24)', opacity:0.3, filter:'blur(16px)' }}/>
            <div style={{ borderRadius:26, position:'relative', background:'#0D1326',
              border:'1.5px solid rgba(245,158,11,0.5)', overflow:'hidden' }}>
              {/* Animated gold border glow */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,transparent,#F59E0B,transparent)' }}/>
              <div style={{ padding:'36px 34px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#F59E0B', textTransform:'uppercase', letterSpacing:'0.1em' }}>⭐ Founding Member</span>
                </div>
                <div style={{ fontSize:11, color:'#64748B', marginBottom:20 }}>First 500 creators only</div>

                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:'clamp(3rem,5vw,4rem)', fontWeight:700, fontFamily:'Space Grotesk', letterSpacing:'-0.04em',
                    background:'linear-gradient(135deg,#D97706,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    Free
                  </span>
                </div>
                {/* Condition in gold — not small print */}
                <div style={{ fontSize:14, fontWeight:700, color:'#F59E0B', marginBottom:28, lineHeight:1.5 }}>
                  Stays free for life while you keep engaging regularly with all posts.
                </div>

                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
                  {BENEFITS.map((b,i)=>(
                    <motion.li key={b} initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
                      transition={{delay:0.4+i*0.06,duration:0.45}}
                      style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:'#CBD5E1' }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:2,
                        background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.4)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={9} color="#F59E0B"/>
                      </div>
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <a href="#community" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  width:'100%', padding:'15px 24px', borderRadius:14, fontSize:15, fontWeight:700,
                  background:'linear-gradient(135deg,#D97706,#F59E0B)', color:'#fff', textDecoration:'none',
                  boxShadow:'0 0 30px rgba(245,158,11,0.4)', transition:'transform 0.2s,box-shadow 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 50px rgba(245,158,11,0.6)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 0 30px rgba(245,158,11,0.4)'}}>
                  Claim Your Free Founding Spot
                </a>
                <p style={{ textAlign:'center', fontSize:11, color:'#475569', marginTop:10 }}>Limited to 500 · No credit card needed</p>
              </div>
            </div>
          </motion.div>

          {/* Standard */}
          <motion.div initial={{opacity:0,x:32}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.75,delay:0.35,ease:[0.23,1,0.32,1]}}
            style={{ display:'flex', flexDirection:'column', gap:0 }}>
            <div style={{ borderRadius:26, background:'rgba(13,19,38,0.65)', backdropFilter:'blur(22px)',
              border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', height:'100%' }}>
              <div style={{ padding:'36px 34px', height:'100%', display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Standard Member</div>
                <div style={{ fontSize:11, color:'#475569', marginBottom:20 }}>For members who join after the first 500</div>
                <div style={{ marginBottom:4 }}>
                  <span style={{ fontSize:'clamp(2.5rem,4vw,3.2rem)', fontWeight:700, fontFamily:'Space Grotesk', letterSpacing:'-0.04em', color:'#94A3B8' }}>₹1,500</span>
                </div>
                <div style={{ fontSize:13, color:'#64748B', marginBottom:8 }}>/month</div>
                <div style={{ fontSize:13, color:'#64748B', marginBottom:28 }}>Less than a dinner out</div>

                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:32, flex:1 }}>
                  {BENEFITS.map((b,i)=>(
                    <li key={b} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:'#94A3B8' }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:2,
                        background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={9} color="#3B82F6"/>
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>

                <a href="#community" className="btn-ghost" style={{ display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', borderRadius:14, fontSize:15 }}>
                  Join the Waitlist
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.pricing-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
