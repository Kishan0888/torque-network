import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const CITIES = [
  { id:'delhi',     name:'New Delhi',   x:318, y:162, color:'#3B82F6', delay:0   },
  { id:'mumbai',    name:'Mumbai',      x:248, y:298, color:'#22D3EE', delay:0.2 },
  { id:'bangalore', name:'Bangalore',   x:288, y:388, color:'#818CF8', delay:0.4 },
  { id:'hyderabad', name:'Hyderabad',   x:306, y:332, color:'#F59E0B', delay:0.6 },
  { id:'kolkata',   name:'Kolkata',     x:420, y:240, color:'#EC4899', delay:0.8 },
  { id:'lucknow',   name:'Lucknow',     x:360, y:190, color:'#10B981', delay:1.0 },
  { id:'jaipur',    name:'Jaipur',      x:284, y:192, color:'#22D3EE', delay:1.2 },
  { id:'ahmedabad', name:'Ahmedabad',   x:230, y:246, color:'#3B82F6', delay:1.4 },
]
const CONNS = [['delhi','lucknow'],['delhi','jaipur'],['delhi','mumbai'],['mumbai','ahmedabad'],
  ['mumbai','bangalore'],['bangalore','hyderabad'],['hyderabad','kolkata'],['lucknow','kolkata'],['delhi','kolkata']]
const INDIA = `M310 60L340 55L380 70L420 90L450 130L470 160L460 200L480 230L470 260L450 290L420 310L430 340L410 370L390 400L370 430L340 460L310 480L290 470L270 450L250 420L240 390L220 360L210 320L200 290L210 260L220 230L210 200L220 170L240 140L260 120L280 90L310 60Z M420 320L440 340L450 370L430 390L420 360Z`

const ROADMAP = [
  { month:'Month 1–2',  count:'100',    label:'Founding Cohort',    color:'#22D3EE', desc:'Hand-picked creators. Intensive onboarding. Proof of concept.' },
  { month:'Month 3–6',  count:'500+',   label:'Community Expansion',color:'#3B82F6', desc:'Open 10 niche verticals. Brand matching portal goes live.' },
  { month:'Month 7–18', count:'2,000+', label:'Platform Scale',     color:'#818CF8', desc:'Proprietary analytics. Automated deal matching. Creator fund.' },
  { month:'Month 19–36',count:'10,000+',label:'National Infrastructure',color:'#F59E0B',desc:"India's largest verified creator network. Enterprise partnerships." },
]

export default function IndiaMap() {
  const [ref, inView] = useInView()
  const [visible, setVisible] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!inView) return
    CITIES.forEach(c => setTimeout(() => setVisible(p=>[...p,c.id]), c.delay*1000+300))
  }, [inView])

  const getCity = id => CITIES.find(c=>c.id===id)

  return (
    <section className="section-py" style={{ background:'rgba(5,8,22,0.92)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:64 }}>
          <span className="section-tag" style={{ color:'#22D3EE' }}>The Network That Grows With You</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Built to spread<br/><span className="gradient-text">across India.</span>
          </h2>
          <p style={{ fontSize:15, color:'#64748B', maxWidth:460, margin:'14px auto 0', lineHeight:1.7 }}>
            Starting in 8 cities, expanding to every corner. One network, one amplification system, one movement.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }} className="map-grid">
          <motion.div initial={{opacity:0,scale:0.9}} animate={inView?{opacity:1,scale:1}:{}}
            transition={{duration:1,delay:0.2,ease:[0.23,1,0.32,1]}}
            style={{ position:'relative', display:'flex', justifyContent:'center' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              width:340, height:340, borderRadius:'50%',
              background:'radial-gradient(circle,rgba(59,130,246,0.07),transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }}/>
            <svg viewBox="140 45 380 460" style={{ width:'100%', maxWidth:400, height:'auto', overflow:'visible' }}>
              <path d={INDIA} fill="rgba(13,19,38,0.7)" stroke="rgba(59,130,246,0.22)" strokeWidth="1.5" strokeLinejoin="round"/>
              {[150,200,250,300,350,400,450].map(y=>(
                <line key={y} x1="140" y1={y} x2="520" y2={y} stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
              ))}
              {CONNS.map(([a,b],i)=>{
                const ca=getCity(a),cb=getCity(b)
                if(!ca||!cb) return null
                const both=visible.includes(a)&&visible.includes(b)
                return <line key={i} x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                  stroke={both?'#3B82F6':'transparent'} strokeWidth="0.9" strokeDasharray="4 7"
                  style={{ opacity:both?0.45:0, transition:'opacity 0.6s', animation:both?`beam-pulse ${2.3+i*0.3}s ease-in-out infinite`:'' }}/>
              })}
              {CITIES.map(city=>{
                const vis=visible.includes(city.id), isAct=active===city.id
                return (
                  <g key={city.id} style={{ cursor:'pointer' }}
                    onMouseEnter={()=>setActive(city.id)} onMouseLeave={()=>setActive(null)}>
                    {vis&&<circle cx={city.x} cy={city.y} r={isAct?18:13} fill="none"
                      stroke={city.color} strokeWidth="0.8" opacity={0.3}
                      style={{ animation:'ripple-out 2s ease-out infinite', animationDelay:`${city.delay}s` }}/>}
                    <circle cx={city.x} cy={city.y} r={vis?8:0} fill={city.color} opacity={0.18}
                      style={{ transition:'r 0.5s ease', transitionDelay:`${city.delay}s` }}/>
                    <circle cx={city.x} cy={city.y} r={vis?(isAct?6:4):0} fill={city.color}
                      style={{ transition:'r 0.5s ease', transitionDelay:`${city.delay}s`,
                        filter:isAct?`drop-shadow(0 0 9px ${city.color})`:`drop-shadow(0 0 4px ${city.color}88)` }}/>
                    {vis&&<text x={city.x+11} y={city.y+4} fontSize="8.5"
                      fill={isAct?city.color:'rgba(148,163,184,0.65)'}
                      fontFamily="Inter" fontWeight={isAct?'600':'400'}
                      style={{ transition:'fill 0.2s' }}>{city.name}</text>}
                  </g>
                )
              })}
            </svg>
          </motion.div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {CITIES.map((city,i)=>{
              const [cardRef,cardInView]=useInView()
              const isVis=visible.includes(city.id)
              return (
                <motion.div key={city.id} ref={cardRef}
                  initial={{opacity:0,x:32}} animate={cardInView&&isVis?{opacity:1,x:0}:{opacity:0,x:32}}
                  transition={{duration:0.55,delay:city.delay+0.1,ease:[0.23,1,0.32,1]}}
                  onMouseEnter={()=>setActive(city.id)} onMouseLeave={()=>setActive(null)}
                  whileHover={{x:-4,boxShadow:`0 8px 32px ${city.color}20`}}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 18px', borderRadius:16,
                    cursor:'default', backdropFilter:'blur(16px)',
                    background:active===city.id?'rgba(13,19,38,0.9)':'rgba(13,19,38,0.55)',
                    border:`1px solid ${active===city.id?city.color+'40':'rgba(255,255,255,0.06)'}`,
                    transition:'all 0.25s ease' }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0,
                    background:city.color, boxShadow:`0 0 10px ${city.color}` }}/>
                  <span style={{ fontSize:14, fontWeight:600, color:'#F8FAFC', fontFamily:'Space Grotesk', flex:1 }}>{city.name}</span>
                  <span style={{ fontSize:11, color:city.color, fontWeight:500 }}>{isVis?'Launching':'—'}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Roadmap below */}
        <div style={{ marginTop:80 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#64748B', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>
              Growth Roadmap
            </div>
            <div style={{ height:1, background:'linear-gradient(to right,transparent,rgba(59,130,246,0.25),transparent)' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, position:'relative' }} className="roadmap-grid">
            {/* Connecting spine */}
            <div style={{ position:'absolute', top:28, left:'12%', right:'12%', height:1.5,
              background:'linear-gradient(90deg,#22D3EE,#3B82F6,#818CF8,#F59E0B)', opacity:0.3 }}/>
            {ROADMAP.map((r,i)=>{
              const [cardRef,cardInView]=useInView()
              return (
                <motion.div key={r.month} ref={cardRef}
                  initial={{opacity:0,y:24}} animate={cardInView?{opacity:1,y:0}:{}}
                  transition={{duration:0.65,delay:i*0.12,ease:[0.23,1,0.32,1]}}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 16px' }}>
                  <motion.div
                    animate={cardInView?{boxShadow:[`0 0 0px ${r.color}00`,`0 0 24px ${r.color}90`,`0 0 0px ${r.color}00`]}:{}}
                    transition={{duration:3,delay:i*0.4,repeat:Infinity,repeatDelay:1}}
                    style={{ width:14, height:14, borderRadius:'50%', background:r.color, marginBottom:20, zIndex:2, position:'relative',
                      boxShadow:`0 0 0 4px ${r.color}20` }}/>
                  <div style={{ fontSize:10, color:'#475569', fontFamily:'monospace', marginBottom:6, letterSpacing:'0.08em' }}>{r.month}</div>
                  <div style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:700, color:r.color, fontFamily:'Space Grotesk', marginBottom:6 }}>{r.count}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#F8FAFC', marginBottom:6 }}>{r.label}</div>
                  <p style={{ fontSize:12, color:'#475569', lineHeight:1.6 }}>{r.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ripple-out { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.8);opacity:0} }
        @media(max-width:800px){.map-grid{grid-template-columns:1fr !important;}}
        @media(max-width:640px){.roadmap-grid{grid-template-columns:repeat(2,1fr) !important;gap:32px !important;}}
      `}</style>
    </section>
  )
}
