import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { ArrowRight, Check, ChevronRight, Loader } from 'lucide-react'
import { submitCreatorApplication } from '../hooks/useWeb3Forms'

/* ── Multi-step application form ─────────────── */
const STEPS = [
  {
    label:'Your Details', fields:[
      { id:'name',      label:'Full Name',         type:'text',  placeholder:'Your full name',     required:true },
      { id:'instagram', label:'Instagram Handle',  type:'text',  placeholder:'@yourhandle',        required:true },
      { id:'followers', label:'Follower Count',    type:'select',options:['Under 5K','5K–10K','10K–50K','50K–100K','100K+'], required:true },
      { id:'email',     label:'Email',             type:'email', placeholder:'you@email.com',      required:true },
      { id:'phone',     label:'Phone / WhatsApp',  type:'tel',   placeholder:'+91 98765 43210',    required:true },
    ],
  },
  {
    label:'Membership Tier', fields:[
      { id:'tier', label:'Membership Tier', type:'select', options:['Founding Member (Free — first 500 only)','Standard Member (₹1,500/month)'], required:true },
    ],
    goals:[
      'Watch, save and share fellow creators\' posts within 48 hours',
      'Engage genuinely — no automation or bots',
      'Submit at least one post per month for amplification',
      'Help grow a community that grows back',
    ],
    goalsLabel:'I understand and agree to:',
  },
]

const emptyForm = {
  name:'',instagram:'',followers:'',email:'',phone:'',tier:'',goals:[],consent:false,
}

function StepIndicator({ current, total }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:36}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{
            width: i===current?32:i<current?24:24, height:24,
            borderRadius:100,
            background: i===current?'linear-gradient(135deg,#3B82F6,#22D3EE)':i<current?'rgba(59,130,246,0.6)':'rgba(255,255,255,0.07)',
            border: i>current?'1px solid rgba(255,255,255,0.1)':'none',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:11,fontWeight:700,color:'#fff',
            transition:'all 0.3s ease',
          }}>
            {i<current?<Check size={11}/>:i+1}
          </div>
          {i<total-1&&<div style={{width:24,height:1,background:i<current?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.08)'}}/>}
        </div>
      ))}
    </div>
  )
}

function FormField({ field, value, onChange }) {
  if (field.type==='select') return (
    <div>
      <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6,fontWeight:500}}>{field.label}{field.required&&<span style={{color:'#EF4444',marginLeft:3}}>*</span>}</label>
      <select required={field.required} value={value||''} onChange={e=>onChange(e.target.value)}
        className="form-input" style={{appearance:'none'}}>
        <option value="">Select…</option>
        {field.options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
  return (
    <div>
      <label style={{display:'block',fontSize:12,color:'#64748B',marginBottom:6,fontWeight:500}}>{field.label}{field.required&&<span style={{color:'#EF4444',marginLeft:3}}>*</span>}</label>
      <input type={field.type} placeholder={field.placeholder} required={field.required}
        value={value||''} onChange={e=>onChange(e.target.value)} className="form-input"/>
    </div>
  )
}

function SuccessAnimation() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:'center',padding:'40px 20px'}}>
      {/* Holographic checkmark */}
      <div style={{position:'relative',display:'inline-block',marginBottom:28}}>
        {[0,1,2].map(i=>(
          <motion.div key={i}
            initial={{scale:0,opacity:1}} animate={{scale:3+i*0.8,opacity:0}}
            transition={{duration:1.5,delay:i*0.25,ease:'easeOut'}}
            style={{
              position:'absolute',inset:0,borderRadius:'50%',
              border:'1.5px solid #22D3EE',
            }}
          />
        ))}
        <motion.div
          animate={{rotate:[0,10,-10,0]}} transition={{duration:0.6,delay:0.3}}
          style={{
            width:80,height:80,borderRadius:'50%',position:'relative',
            background:'linear-gradient(135deg,#3B82F6,#22D3EE)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 0 60px rgba(34,211,238,0.5)',
          }}>
          <Check size={36} color="#fff" strokeWidth={2.5}/>
        </motion.div>
      </div>

      {/* Confetti burst — CSS only */}
      <div style={{position:'relative',overflow:'visible'}}>
        {[...Array(14)].map((_,i)=>(
          <motion.div key={i}
            initial={{x:0,y:0,opacity:1,scale:1}}
            animate={{x:(Math.cos(i/14*Math.PI*2)*80),y:(Math.sin(i/14*Math.PI*2)*80-40),opacity:0,scale:0}}
            transition={{duration:0.9,delay:0.4+i*0.03,ease:'easeOut'}}
            style={{
              position:'absolute',top:'50%',left:'50%',
              width:6,height:6,borderRadius:i%3===0?'50%':2,
              background:['#3B82F6','#22D3EE','#818CF8','#F59E0B','#EC4899'][i%5],
            }}
          />
        ))}
      </div>

      <motion.h3 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
        style={{fontSize:24,fontWeight:700,fontFamily:'Space Grotesk',marginBottom:10}}>
        You're on the Waitlist! 🎉
      </motion.h3>
      <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.75}}
        style={{fontSize:15,color:'#64748B',lineHeight:1.65,maxWidth:340,margin:'0 auto'}}>
        We'll review your profile and get back to you within 48 hours. Welcome to Torque Network.
      </motion.p>
    </motion.div>
  )
}

export default function Community() {
  const [ref, inView] = useInView()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [toast, setToast]         = useState(null)

  const setField = (id, val) => setForm(f=>({...f,[id]:val}))
  const toggleGoal = (g) => setForm(f=>({...f,goals:f.goals.includes(g)?f.goals.filter(x=>x!==g):[...f.goals,g]}))

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleNext = async (e) => {
    e?.preventDefault()
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }
    // Final step — submit to Web3Forms
    setLoading(true)
    try {
      await submitCreatorApplication(form)
      setSubmitted(true)
      setForm(emptyForm)
      setStep(0)
    } catch (err) {
      showToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = STEPS[step]

  return (
    <section className="section-py" id="community" style={{position:'relative',overflow:'hidden'}}>
      {/* Aurora */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div className="aurora" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:800,borderRadius:'50%',opacity:0.07,background:'radial-gradient(circle,#3B82F6 0%,#22D3EE 40%,transparent 70%)',filter:'blur(70px)'}}/>
      </div>

      <div className="container" style={{position:'relative',zIndex:1}}>
        {/* Header */}
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:72}}
        >
          <span className="section-tag" style={{color:'#22D3EE'}}>Join the Movement</span>
          <h2 style={{fontSize:'clamp(2rem,4.5vw,3.2rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.035em'}}>
            Register to Join<br/><span className="gradient-text">Torque Network.</span>
          </h2>
          <p style={{fontSize:17,color:'#64748B',maxWidth:520,margin:'18px auto 0',lineHeight:1.72}}>
            We're inviting early creators to shape the future of Torque Network. This is your chance to be a founding voice.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'start'}} className="community-grid">
          {/* Left: why join */}
          <motion.div
            initial={{opacity:0,x:-32}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.85,delay:0.15,ease:[0.23,1,0.32,1]}}
          >
            <h3 style={{fontSize:24,fontWeight:700,marginBottom:20,fontFamily:'Space Grotesk'}}>Why apply now?</h3>
            {[
              {emoji:'🔒',title:'Founding Access',desc:'Shape the product roadmap and community culture from day one.'},
              {emoji:'🤝',title:'Real Community',desc:'Connect with vetted creators who are serious about their craft.'},
              {emoji:'📈',title:'Collaborative Growth',desc:'Grow alongside a community that actively supports your content.'},
              {emoji:'🌟',title:'Founding Creator Badge',desc:'Permanently recognized as a founding member of Torque Network.'},
            ].map((item,i)=>(
              <motion.div key={item.title}
                initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
                transition={{delay:0.3+i*0.1,duration:0.55}}
                style={{display:'flex',gap:16,marginBottom:22,alignItems:'flex-start'}}
              >
                <div style={{width:44,height:44,borderRadius:14,background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                  {item.emoji}
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:4,fontFamily:'Space Grotesk'}}>{item.title}</div>
                  <p style={{fontSize:13,color:'#64748B',lineHeight:1.62}}>{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Social proof */}
            <div style={{marginTop:32,padding:'20px 24px',borderRadius:18,background:'rgba(34,211,238,0.05)',border:'1px solid rgba(34,211,238,0.15)'}}>
              <div style={{display:'flex',marginBottom:10}}>
                {['#3B82F6','#22D3EE','#818CF8','#F59E0B','#EC4899'].map((c,i)=>(
                  <div key={i} style={{width:30,height:30,borderRadius:'50%',background:c,border:'2px solid #050816',marginLeft:i>0?-8:0,zIndex:5-i,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>
                    {['SK','PM','AK','RJ','NV'][i]}
                  </div>
                ))}
              </div>
              <div style={{fontSize:14,fontWeight:600,color:'#F8FAFC',marginBottom:3}}>380+ creators already applied</div>
              <div style={{fontSize:12,color:'#475569'}}>Applications reviewed within 48 hours</div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{opacity:0,x:32}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.85,delay:0.25,ease:[0.23,1,0.32,1]}}
          >
            <div className="animated-border" style={{borderRadius:28,position:'relative'}}>
              <div style={{background:'#0D1326',borderRadius:27,padding:'36px 36px'}} className="form-inner-pad">
                {submitted ? <SuccessAnimation/> : (
                  <>
                    <StepIndicator current={step} total={STEPS.length}/>

                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:18,fontWeight:700,fontFamily:'Space Grotesk',marginBottom:4}}>
                        {currentStep.label}
                      </div>
                      <div style={{fontSize:12,color:'#475569'}}>Step {step+1} of {STEPS.length}</div>
                    </div>

                    <form onSubmit={handleNext}>
                      <AnimatePresence mode="wait">
                        <motion.div key={step}
                          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                          transition={{duration:0.28}}
                        >
                          {/* Regular fields */}
                          {currentStep.fields.length>0&&(
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}} className="form-fields-grid">
                              {currentStep.fields.map(f=>(
                                <div key={f.id} style={{gridColumn:['email','profile_url','instagram','platforms'].includes(f.id)?'span 2':'span 1'}}>
                                  <FormField field={f} value={form[f.id]} onChange={v=>setField(f.id,v)}/>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Goals step */}
                          {currentStep.goals&&(
                            <div style={{marginBottom:24}}>
                              <p style={{fontSize:13,color:'#64748B',marginBottom:16}}>{currentStep.goalsLabel||'Select all that apply'}</p>
                              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                                {currentStep.goals.map(g=>(
                                  <button type="button" key={g} onClick={()=>toggleGoal(g)}
                                    style={{
                                      display:'flex',alignItems:'center',gap:12,padding:'13px 16px',
                                      borderRadius:12,cursor:'pointer',textAlign:'left',
                                      background:form.goals.includes(g)?'rgba(59,130,246,0.12)':'rgba(255,255,255,0.03)',
                                      border:form.goals.includes(g)?'1px solid rgba(59,130,246,0.4)':'1px solid rgba(255,255,255,0.07)',
                                      transition:'all 0.2s',
                                    }}>
                                    <div style={{
                                      width:20,height:20,borderRadius:6,flexShrink:0,
                                      background:form.goals.includes(g)?'#3B82F6':'transparent',
                                      border:form.goals.includes(g)?'1px solid #3B82F6':'1px solid rgba(255,255,255,0.2)',
                                      display:'flex',alignItems:'center',justifyContent:'center',
                                      transition:'all 0.2s',
                                    }}>
                                      {form.goals.includes(g)&&<Check size={11} color="#fff"/>}
                                    </div>
                                    <span style={{fontSize:14,color:form.goals.includes(g)?'#F8FAFC':'#64748B',transition:'color 0.2s'}}>{g}</span>
                                  </button>
                                ))}
                              </div>
                              {/* Consent */}
                              <button type="button" onClick={()=>setField('consent',!form.consent)}
                                style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px 0',background:'none',border:'none',cursor:'pointer',marginTop:16,textAlign:'left'}}>
                                <div style={{
                                  width:20,height:20,borderRadius:5,flexShrink:0,marginTop:1,
                                  background:form.consent?'#3B82F6':'transparent',
                                  border:form.consent?'1px solid #3B82F6':'1px solid rgba(255,255,255,0.2)',
                                  display:'flex',alignItems:'center',justifyContent:'center',
                                  transition:'all 0.2s',
                                }}>
                                  {form.consent&&<Check size={11} color="#fff"/>}
                                </div>
                                <span style={{fontSize:12,color:'#64748B',lineHeight:1.6}}>
                                  I agree to be contacted by the Torque Network team and understand this is a waitlist application, not an immediate enrolment.
                                </span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      <div style={{display:'flex',gap:12,alignItems:'center'}}>
                        {step>0&&(
                          <button type="button" onClick={()=>setStep(s=>s-1)}
                            className="btn-ghost" style={{padding:'13px 20px',fontSize:14}}>
                            Back
                          </button>
                        )}
                        <button type="submit"
                          disabled={(step===STEPS.length-1&&!form.consent)||loading}
                          className="btn-primary"
                          style={{flex:1,justifyContent:'center',fontSize:15,padding:'15px 24px',opacity:(step===STEPS.length-1&&!form.consent)||loading?0.6:1,transition:'opacity 0.2s'}}>
                          {loading
                            ? <><Loader size={16} style={{animation:'spin 0.8s linear infinite'}}/>&nbsp;Sending…</>
                            : step<STEPS.length-1
                              ? <>Continue <ChevronRight size={16}/></>
                              : 'Submit Application'
                          }
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position:'fixed',bottom:32,left:'50%',transform:'translateX(-50%)',
          background:'rgba(13,19,38,0.95)',backdropFilter:'blur(24px)',
          border:'1px solid rgba(239,68,68,0.35)',borderRadius:14,
          padding:'14px 24px',zIndex:1000,
          display:'flex',alignItems:'center',gap:12,
          boxShadow:'0 16px 48px rgba(0,0,0,0.5)',
          animation:'slideUpIn 0.3s ease',
        }}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444',flexShrink:0}}/>
          <span style={{fontSize:14,color:'#F8FAFC',fontWeight:500}}>{toast}</span>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUpIn { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @media(max-width:900px){.community-grid{grid-template-columns:1fr !important;gap:44px !important;}}
        @media(max-width:560px){.form-fields-grid{grid-template-columns:1fr !important;} .form-inner-pad{padding:28px 22px !important;}}
      `}</style>
    </section>
  )
}
