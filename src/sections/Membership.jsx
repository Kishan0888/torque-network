import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Check, Lock, ArrowRight, Sparkles } from 'lucide-react'

const benefits = [
  'Vetted niche community placement',
  'Algorithm-optimized posting framework',
  '48-hour amplification window access',
  'High-signal engagement training',
  'Brand deal matching & negotiation support',
  'Monthly masterclasses with top creators',
  'Compliance & accountability system',
  'Rate locked for life — never increases',
]

const nextSteps = [
  { day: 'Day 1', text: 'Application reviewed within 24 hours' },
  { day: 'Day 2', text: 'Matched to your niche community' },
  { day: 'Day 3', text: 'Onboarding call with your cohort lead' },
  { day: 'Week 1', text: 'First amplification session goes live' },
]

const formFields = [
  { key: 'name',      label: 'Full Name',         type: 'text',  placeholder: 'Your name' },
  { key: 'handle',    label: 'Instagram Handle',  type: 'text',  placeholder: '@yourhandle' },
  { key: 'followers', label: 'Follower Count',    type: 'text',  placeholder: 'e.g. 12,000' },
  { key: 'niche',     label: 'Content Niche',     type: 'text',  placeholder: 'e.g. Personal Finance' },
  { key: 'email',     label: 'Email Address',     type: 'email', placeholder: 'you@email.com' },
  { key: 'whatsapp',  label: 'WhatsApp Number',   type: 'tel',   placeholder: '+91 98765 43210' },
]

export default function Membership() {
  const [ref, inView] = useInView()
  const [view, setView] = useState('info') // 'info' | 'form' | 'success'
  const [form, setForm] = useState({ name:'', handle:'', followers:'', niche:'', email:'', whatsapp:'' })

  const handleSubmit = (e) => { e.preventDefault(); setView('success') }

  return (
    <section className="section-py" id="pricing" style={{ position:'relative', overflow:'hidden' }}>
      {/* Aurora background */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div className="aurora" style={{
          position:'absolute', top:'40%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:800, height:800, borderRadius:'50%', opacity:0.08,
          background:'radial-gradient(circle, #3B82F6 0%, #22D3EE 40%, transparent 70%)',
          filter:'blur(60px)',
        }}/>
      </div>

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}
        >
          <span className="section-tag">
            <Lock size={11} color="#22D3EE" /> Founding Member Access
          </span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            One price. <span className="gradient-text">Locked forever.</span>
          </h2>
          <p style={{ fontSize:16, color:'#64748B', maxWidth:440, margin:'16px auto 0' }}>
            Join now and your ₹1,500/month rate is locked for life — no matter how much the platform grows.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:40 }}
          animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.9, delay:0.2, ease:[0.23,1,0.32,1] }}
          style={{ position:'relative', maxWidth:1000, margin:'0 auto' }}
        >
          {/* Glow halo */}
          <div style={{
            position:'absolute', inset:-2, borderRadius:28,
            background:'linear-gradient(135deg,#3B82F6,#22D3EE,#818CF8)',
            opacity:0.25, filter:'blur(20px)', zIndex:0,
          }}/>

          {/* Card */}
          <div className="animated-border" style={{ borderRadius:26, position:'relative', zIndex:1 }}>
            <div style={{
              background:'#0D1326', borderRadius:25,
              display:'grid', gridTemplateColumns:'1fr 1fr',
            }} className="pricing-inner">
              {/* ── Left: Pricing ── */}
              <div style={{ padding:'48px 44px', borderRight:'1px solid rgba(255,255,255,0.06)' }} className="pricing-left">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <Sparkles size={14} color="#FBBF24" />
                  <span style={{ fontSize:11, fontWeight:700, color:'#FBBF24', textTransform:'uppercase', letterSpacing:'0.1em' }}>Founding Member</span>
                </div>
                <div style={{ marginTop:20, marginBottom:4 }}>
                  <span style={{
                    fontSize:'clamp(3rem,6vw,4.5rem)', fontWeight:700,
                    fontFamily:'Space Grotesk', letterSpacing:'-0.04em',
                    background:'linear-gradient(135deg,#3B82F6,#22D3EE)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                  }}>₹1,500</span>
                </div>
                <div style={{ fontSize:13, color:'#475569', marginBottom:32 }}>per month · rate locked for life</div>

                <ul style={{ listStyle:'none', marginBottom:36, display:'flex', flexDirection:'column', gap:11 }}>
                  {benefits.map((b, i) => (
                    <motion.li key={b}
                      initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
                      transition={{delay:0.4+i*0.05, duration:0.45}}
                      style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:'#CBD5E1' }}
                    >
                      <div style={{
                        width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:1,
                        background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.35)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Check size={9} color="#22D3EE" />
                      </div>
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <button
                  onClick={() => setView(view === 'info' ? 'form' : 'info')}
                  className="btn-primary"
                  style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'16px 28px', borderRadius:14 }}
                >
                  Apply Now — Founding Cohort <ArrowRight size={16}/>
                </button>
                <p style={{ textAlign:'center', fontSize:11, color:'#334155', marginTop:12 }}>
                  No commitment · Cancel anytime · Limited spots
                </p>
              </div>

              {/* ── Right: Info / Form / Success ── */}
              <div style={{ padding:'48px 44px', minHeight:480 }} className="pricing-right">
                <AnimatePresence mode="wait">
                  {view === 'info' && (
                    <motion.div key="info" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
                      <h3 style={{ fontSize:20, fontWeight:700, marginBottom:28, fontFamily:'Space Grotesk' }}>What happens next?</h3>
                      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                        {nextSteps.map(({ day, text }, i) => (
                          <div key={day} style={{ display:'flex', gap:16, paddingBottom: i < nextSteps.length-1 ? 28 : 0 }}>
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                              <div style={{
                                width:32, height:32, borderRadius:'50%', flexShrink:0,
                                background:'rgba(13,19,38,0.8)', border:'1px solid rgba(34,211,238,0.25)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:12, fontWeight:700, color:'#22D3EE',
                              }}>{i+1}</div>
                              {i < nextSteps.length-1 && (
                                <div style={{ width:1, flex:1, marginTop:8, background:'linear-gradient(to bottom, rgba(34,211,238,0.2), transparent)' }}/>
                              )}
                            </div>
                            <div style={{ paddingTop:4 }}>
                              <div style={{ fontSize:11, color:'#475569', fontFamily:'monospace', marginBottom:3, letterSpacing:'0.05em' }}>{day}</div>
                              <div style={{ fontSize:14, color:'#CBD5E1' }}>{text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:32, padding:'20px 24px', borderRadius:16, background:'rgba(34,211,238,0.05)', border:'1px solid rgba(34,211,238,0.12)' }}>
                        <div style={{ fontSize:13, color:'#22D3EE', fontWeight:600, marginBottom:4 }}>🔒 Founding Rate Guarantee</div>
                        <p style={{ fontSize:12, color:'#64748B', lineHeight:1.6 }}>Founding members will never pay more than ₹1,500/month — locked in perpetuity regardless of future pricing changes.</p>
                      </div>
                    </motion.div>
                  )}

                  {view === 'form' && (
                    <motion.form key="form" onSubmit={handleSubmit}
                      initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                      transition={{duration:0.3}}
                    >
                      <h3 style={{ fontSize:20, fontWeight:700, marginBottom:24, fontFamily:'Space Grotesk' }}>Creator Application</h3>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="form-grid">
                        {formFields.map(f => (
                          <div key={f.key} style={{ gridColumn: f.key==='email'||f.key==='whatsapp' ? 'span 1' : 'span 1' }}>
                            <label style={{ display:'block', fontSize:11, color:'#64748B', marginBottom:6, fontWeight:500 }}>{f.label}</label>
                            <input
                              type={f.type} placeholder={f.placeholder} required
                              value={form[f.key]}
                              onChange={e=>setForm({...form,[f.key]:e.target.value})}
                              className="form-input"
                            />
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="btn-primary"
                        style={{ width:'100%', justifyContent:'center', marginTop:20, fontSize:14, padding:'14px 24px', borderRadius:12 }}>
                        Submit Application
                      </button>
                    </motion.form>
                  )}

                  {view === 'success' && (
                    <motion.div key="success"
                      initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                      transition={{duration:0.5, ease:[0.23,1,0.32,1]}}
                      style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 0' }}
                    >
                      <motion.div
                        animate={{ scale:[0,1.2,1] }} transition={{ duration:0.6 }}
                        style={{
                          width:80, height:80, borderRadius:'50%', marginBottom:24,
                          background:'linear-gradient(135deg,#3B82F6,#22D3EE)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                        <Check size={36} color="#fff" strokeWidth={2.5} />
                      </motion.div>
                      <h3 style={{ fontSize:24, fontWeight:700, marginBottom:10, fontFamily:'Space Grotesk' }}>You're in the queue!</h3>
                      <p style={{ fontSize:14, color:'#64748B', maxWidth:280, lineHeight:1.6 }}>We'll reach out within 24 hours to confirm your spot in the founding cohort.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .pricing-inner { grid-template-columns: 1fr !important; }
          .pricing-left { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 40px 28px !important; }
          .pricing-right { padding: 36px 28px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
