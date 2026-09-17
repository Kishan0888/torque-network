import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

/* SVG-based India map with city dots — no external deps */
const CITIES = [
  { id:'delhi',     name:'New Delhi',  x:318, y:162, color:'#3B82F6', delay:0 },
  { id:'mumbai',    name:'Mumbai',     x:248, y:298, color:'#22D3EE', delay:0.2 },
  { id:'bangalore', name:'Bangalore',  x:288, y:388, color:'#818CF8', delay:0.4 },
  { id:'hyderabad', name:'Hyderabad',  x:306, y:332, color:'#F59E0B', delay:0.6 },
  { id:'kolkata',   name:'Kolkata',    x:420, y:240, color:'#EC4899', delay:0.8 },
  { id:'lucknow',   name:'Lucknow',    x:360, y:190, color:'#10B981', delay:1.0 },
  { id:'jaipur',    name:'Jaipur',     x:284, y:192, color:'#22D3EE', delay:1.2 },
  { id:'ahmedabad', name:'Ahmedabad',  x:230, y:246, color:'#3B82F6', delay:1.4 },
]

const CONNECTIONS = [
  ['delhi','lucknow'],['delhi','jaipur'],['delhi','mumbai'],
  ['mumbai','ahmedabad'],['mumbai','bangalore'],['bangalore','hyderabad'],
  ['hyderabad','kolkata'],['lucknow','kolkata'],['delhi','kolkata'],
]

/* Simplified India outline path (approximate) */
const INDIA_PATH = `
M 310 60 L 340 55 L 380 70 L 420 90 L 450 130 L 470 160 L 460 200
L 480 230 L 470 260 L 450 290 L 420 310 L 430 340 L 410 370
L 390 400 L 370 430 L 340 460 L 310 480 L 290 470 L 270 450
L 250 420 L 240 390 L 220 360 L 210 320 L 200 290 L 210 260
L 220 230 L 210 200 L 220 170 L 240 140 L 260 120 L 280 90 L 310 60 Z
M 420 320 L 440 340 L 450 370 L 430 390 L 420 360 Z
`

export default function IndiaMap() {
  const [ref, inView] = useInView()
  const [activeCity, setActiveCity] = useState(null)
  const [visibleCities, setVisibleCities] = useState([])

  useEffect(() => {
    if (!inView) return
    CITIES.forEach(c => {
      setTimeout(() => setVisibleCities(prev => [...prev, c.id]), c.delay * 1000 + 300)
    })
  }, [inView])

  const getCityPos = (id) => CITIES.find(c => c.id === id)

  return (
    <section className="section-py" style={{background:'rgba(5,8,22,0.92)'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:64}}
        >
          <span className="section-tag" style={{color:'#22D3EE'}}>National Scale</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Built to spread<br/><span className="gradient-text">across India.</span>
          </h2>
          <p style={{fontSize:15,color:'#64748B',maxWidth:460,margin:'14px auto 0',lineHeight:1.7}}>
            Torque is starting in 8 cities and expanding to every corner of India. One network, one movement.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}} className="map-grid">
          {/* Map */}
          <motion.div
            initial={{opacity:0,scale:0.9}} animate={inView?{opacity:1,scale:1}:{}}
            transition={{duration:1,delay:0.2,ease:[0.23,1,0.32,1]}}
            style={{position:'relative',display:'flex',justifyContent:'center'}}
          >
            {/* Ambient glow */}
            <div style={{
              position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
              width:340,height:340,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)',
              filter:'blur(30px)',pointerEvents:'none',
            }}/>

            <svg viewBox="140 45 380 460" style={{width:'100%',maxWidth:400,height:'auto',overflow:'visible'}}>
              {/* India fill */}
              <path d={INDIA_PATH}
                fill="rgba(13,19,38,0.7)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5"
                strokeLinejoin="round"/>

              {/* Grid lines on map */}
              {[150,200,250,300,350,400,450].map(y=>(
                <line key={y} x1="140" y1={y} x2="520" y2={y} stroke="rgba(59,130,246,0.05)" strokeWidth="0.5"/>
              ))}
              {[200,250,300,350,400,450].map(x=>(
                <line key={x} x1={x} y1="45" x2={x} y2="505" stroke="rgba(59,130,246,0.05)" strokeWidth="0.5"/>
              ))}

              {/* Connections */}
              {CONNECTIONS.map(([a,b],i)=>{
                const ca=getCityPos(a), cb=getCityPos(b)
                if(!ca||!cb) return null
                const both=visibleCities.includes(a)&&visibleCities.includes(b)
                return(
                  <line key={i} x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                    stroke={both?"#3B82F6":"transparent"}
                    strokeWidth="0.8" strokeDasharray="4 6" opacity={both?0.5:0}
                    style={{transition:'opacity 0.6s ease',animation:both?`beam-pulse ${2.2+i*0.3}s ease-in-out infinite`:''}}
                  />
                )
              })}

              {/* City dots */}
              {CITIES.map(city=>{
                const visible=visibleCities.includes(city.id)
                const isActive=activeCity===city.id
                return(
                  <g key={city.id}
                    style={{cursor:'pointer'}}
                    onMouseEnter={()=>setActiveCity(city.id)}
                    onMouseLeave={()=>setActiveCity(null)}
                  >
                    {/* Ripple */}
                    {visible&&(
                      <circle cx={city.x} cy={city.y} r={isActive?16:12}
                        fill="none" stroke={city.color} strokeWidth="0.8" opacity={0.35}
                        style={{animation:'ripple-out 2s ease-out infinite',animationDelay:`${city.delay}s`}}/>
                    )}
                    {/* Outer glow */}
                    <circle cx={city.x} cy={city.y} r={visible?7:0}
                      fill={city.color} opacity={0.2}
                      style={{transition:'r 0.5s ease',transitionDelay:`${city.delay}s`}}/>
                    {/* Core dot */}
                    <circle cx={city.x} cy={city.y} r={visible?(isActive?6:4):0}
                      fill={city.color}
                      style={{
                        transition:'r 0.5s ease, filter 0.3s',
                        filter:isActive?`drop-shadow(0 0 8px ${city.color})`:`drop-shadow(0 0 4px ${city.color}88)`,
                        transitionDelay:`${city.delay}s`,
                      }}/>
                    {/* City label */}
                    {visible&&(
                      <text x={city.x+10} y={city.y+4}
                        fontSize="9" fill={isActive?city.color:'rgba(148,163,184,0.7)'}
                        fontFamily="Inter" fontWeight={isActive?'600':'400'}
                        style={{transition:'fill 0.2s'}}>
                        {city.name}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Decorative corner label */}
              <text x="148" y="60" fontSize="8" fill="rgba(59,130,246,0.3)" fontFamily="monospace">INDIA</text>
            </svg>
          </motion.div>

          {/* City cards */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {CITIES.map((city,i)=>{
              const [cardRef,cardInView]=useInView()
              const isVisible=visibleCities.includes(city.id)
              return(
                <motion.div key={city.id} ref={cardRef}
                  initial={{opacity:0,x:30}} animate={cardInView&&isVisible?{opacity:1,x:0}:{opacity:0,x:30}}
                  transition={{duration:0.55,delay:city.delay+0.1,ease:[0.23,1,0.32,1]}}
                  onMouseEnter={()=>setActiveCity(city.id)}
                  onMouseLeave={()=>setActiveCity(null)}
                  whileHover={{x:-4,boxShadow:`0 8px 32px ${city.color}20`}}
                  style={{
                    display:'flex',alignItems:'center',gap:14,
                    padding:'14px 18px',borderRadius:16,cursor:'default',
                    background:activeCity===city.id?`rgba(13,19,38,0.9)`:'rgba(13,19,38,0.55)',
                    border:`1px solid ${activeCity===city.id?city.color+'40':'rgba(255,255,255,0.06)'}`,
                    backdropFilter:'blur(16px)',
                    transition:'all 0.25s ease',
                  }}
                >
                  <div style={{
                    width:10,height:10,borderRadius:'50%',flexShrink:0,background:city.color,
                    boxShadow:`0 0 10px ${city.color}`,
                  }}/>
                  <span style={{fontSize:14,fontWeight:600,color:'#F8FAFC',fontFamily:'Space Grotesk'}}>{city.name}</span>
                  <span style={{marginLeft:'auto',fontSize:11,color:city.color,fontWeight:500}}>
                    {isVisible?'Active':'—'}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ripple-out { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.5);opacity:0} }
        @media(max-width:800px){.map-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </section>
  )
}
