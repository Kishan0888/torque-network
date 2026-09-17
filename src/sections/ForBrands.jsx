import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Sparkles, Zap, BarChart3, ArrowRight, Check } from 'lucide-react'

const packages = [
  { name:'Spark',    price:'₹25,000', icon:Sparkles, color:'#F59E0B', desc:'Test the waters with 50+ vetted creators.', features:['50 creator posts','5 communities','Basic analytics','7-day run'] },
  { name:'Amplify',  price:'₹75,000', icon:Zap,      color:'#3B82F6', desc:'Full-scale community activation.', features:['200 creator posts','15 communities','Advanced analytics','21-day run','Dedicated manager'], featured:true },
  { name:'Campaign', price:'Custom',  icon:BarChart3, color:'#22D3EE', desc:'White-glove end-to-end management.', features:['Unlimited creators','All communities','Real-time dashboard','Custom duration','Legal & contracts'] },
]

export default function ForBrands() {
  const [ref, inView] = useInView()
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({company:'',name:'',budget:'',requirement:''})

  return (
    <section className="section-py" id="brands" style={{background:'rgba(13,19,38,0.2)'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'flex-start'}} className="brands-grid">
          {/* Left */}
          <motion.div ref={ref}
            initial={{opacity:0,x:-36}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.85,ease:[0.23,1,0.32,1]}}
          >
            <span className="section-tag" style={{color:'#3B82F6'}}>For Brands</span>
            <h2 style={{fontSize:'clamp(1.9rem,3.5vw,2.8rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:20}}>
              Reach audiences that <span className="gradient-text">actually trust</span> the message.
            </h2>
            <p style={{fontSize:15,color:'#64748B',lineHeight:1.72,marginBottom:28}}>
              Torque's vetted creator network delivers authentic advocacy — not paid noise. Every creator has a real audience, documented engagement, and a community they protect.
            </p>
            {['Authentic engagement from niche-matched audiences','Precision targeting across 15+ content verticals','End-to-end campaign management & documentation'].map((pt,i)=>(
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:14}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:'#22D3EE'}}/>
                </div>
                <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.6}}>{pt}</p>
              </div>
            ))}
            <div style={{marginTop:32}}>
              <button onClick={()=>setShowForm(!showForm)} className="btn-primary">
                Submit Brand Inquiry <ArrowRight size={15}/>
              </button>
            </div>
            <AnimatePresence>
              {showForm&&!submitted&&(
                <motion.form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}
                  initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                  style={{marginTop:24,overflow:'hidden',display:'flex',flexDirection:'column',gap:12}}
                >
                  {[{k:'company',l:'Company',p:'Acme Corp'},{k:'name',l:'Your Name',p:'Marketing Head'},{k:'budget',l:'Budget',p:'₹50K – ₹2L'}].map(f=>(
                    <div key={f.k}>
                      <label style={{fontSize:11,color:'#64748B',display:'block',marginBottom:5,fontWeight:500}}>{f.l}</label>
                      <input type="text" placeholder={f.p} required className="form-input"
                        value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div>
                    <label style={{fontSize:11,color:'#64748B',display:'block',marginBottom:5,fontWeight:500}}>Campaign Requirement</label>
                    <textarea rows={3} placeholder="Describe your goal..." required className="form-input" style={{resize:'none'}}
                      value={form.requirement} onChange={e=>setForm({...form,requirement:e.target.value})}/>
                  </div>
                  <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>Send Inquiry</button>
                </motion.form>
              )}
              {submitted&&(
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  style={{marginTop:20,padding:'16px 20px',borderRadius:14,background:'rgba(34,211,238,0.06)',border:'1px solid rgba(34,211,238,0.18)',display:'flex',alignItems:'center',gap:10}}>
                  <Check size={15} color="#22D3EE"/><p style={{fontSize:13,color:'#22D3EE',fontWeight:500}}>Received! We'll reply within 48 hours.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: packages */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {packages.map((pkg,i)=>{
              const [cardRef,cardInView]=useInView()
              const Icon=pkg.icon
              return(
                <motion.div key={pkg.name} ref={cardRef}
                  initial={{opacity:0,x:36}} animate={cardInView?{opacity:1,x:0}:{}}
                  transition={{duration:0.65,delay:i*0.12,ease:[0.23,1,0.32,1]}}
                  whileHover={{y:-4,boxShadow:`0 24px 56px ${pkg.color}18`}}
                  style={{
                    borderRadius:20,padding:'24px 28px',
                    background:pkg.featured?'rgba(13,19,38,0.88)':'rgba(13,19,38,0.55)',
                    border:pkg.featured?`1px solid ${pkg.color}35`:'1px solid rgba(255,255,255,0.06)',
                    position:'relative',cursor:'default',
                  }}
                >
                  {pkg.featured&&(
                    <div style={{position:'absolute',top:-12,left:24}}>
                      <span style={{padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:700,background:'linear-gradient(135deg,#2563EB,#22D3EE)',color:'#fff'}}>Most Popular</span>
                    </div>
                  )}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,borderRadius:12,background:`${pkg.color}12`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon size={18} color={pkg.color}/>
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:16,fontFamily:'Space Grotesk'}}>{pkg.name}</div>
                        <div style={{fontSize:12,color:'#64748B'}}>{pkg.desc}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontWeight:700,fontSize:18,color:pkg.color,fontFamily:'Space Grotesk'}}>{pkg.price}</div>
                      {pkg.price!=='Custom'&&<div style={{fontSize:11,color:'#475569'}}>per campaign</div>}
                    </div>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {pkg.features.map(f=>(
                      <span key={f} style={{fontSize:11,padding:'4px 10px',borderRadius:8,background:`${pkg.color}0e`,color:pkg.color,fontWeight:500}}>{f}</span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.brands-grid{grid-template-columns:1fr !important;gap:48px !important;}}`}</style>
    </section>
  )
}
