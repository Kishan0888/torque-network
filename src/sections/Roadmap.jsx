import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const milestones = [
  { count:'100',   label:'Founding Cohort',       desc:'Hand-picked creators across 5 niches. Intensive onboarding. Proof of concept.', color:'#22D3EE', status:'Active Now' },
  { count:'500',   label:'Community Expansion',   desc:'Open 15 niche verticals. Launch brand matching portal. Introduce tiered membership.', color:'#3B82F6' },
  { count:'2,000', label:'Platform Scale',         desc:'Proprietary analytics dashboard. Automated deal matching. Creator fund launch.', color:'#818CF8' },
  { count:'5,000+',label:'National Infrastructure',desc:"India's largest verified creator network. Enterprise brand partnerships. Creator equity program.", color:'#64748B' },
]

export default function Roadmap() {
  const [ref, inView] = useInView()

  return (
    <section className="section-py" style={{ background:'rgba(13,19,38,0.2)' }}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ textAlign:'center', marginBottom:72 }}
        >
          <span className="section-tag" style={{ color:'#818CF8' }}>The Vision</span>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Built to scale <span className="gradient-text">India-wide.</span>
          </h2>
        </motion.div>

        {/* Desktop two-column timeline */}
        <div style={{ position:'relative', maxWidth:780, margin:'0 auto' }} className="roadmap-desktop">
          {/* Center spine */}
          <motion.div
            initial={{ scaleY:0 }} animate={inView?{scaleY:1}:{}}
            transition={{ duration:2, delay:0.3, ease:'easeInOut' }}
            style={{
              position:'absolute', left:'50%', top:0, bottom:0, width:2, transformOrigin:'top center',
              background:'linear-gradient(to bottom, #22D3EE, #3B82F6, #818CF8, rgba(100,116,139,0.3))',
              transform: 'scaleY(0)',
            }}
          />

          <div style={{ display:'flex', flexDirection:'column', gap:56 }}>
            {milestones.map((m, i) => {
              const [cardRef, cardInView] = useInView()
              const isLeft = i % 2 === 0
              return (
                <motion.div key={m.count} ref={cardRef}
                  initial={{opacity:0, x: isLeft?-40:40}}
                  animate={cardInView?{opacity:1,x:0}:{}}
                  transition={{duration:0.7, delay:0.1, ease:[0.23,1,0.32,1]}}
                  style={{ display:'flex', alignItems:'center', gap:0, position:'relative' }}
                >
                  {/* Left slot */}
                  <div style={{ flex:1, paddingRight:40, textAlign:'right' }}>
                    {isLeft && (
                      <div style={{
                        display:'inline-block', textAlign:'left',
                        background:'rgba(13,19,38,0.65)', border:`1px solid ${m.color}22`,
                        borderRadius:20, padding:'24px 28px',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, justifyContent:'flex-start' }}>
                          <span style={{ fontSize:'clamp(1.8rem,3vw,2.2rem)', fontWeight:700, color:m.color, fontFamily:'Space Grotesk' }}>{m.count}</span>
                          {m.status && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:`${m.color}18`, color:m.color, fontWeight:600 }}>{m.status}</span>}
                        </div>
                        <div style={{ fontSize:15, fontWeight:600, marginBottom:6, fontFamily:'Space Grotesk', color:'#F8FAFC' }}>{m.label}</div>
                        <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65, maxWidth:280 }}>{m.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <motion.div
                    style={{
                      width:16, height:16, borderRadius:'50%', background:m.color,
                      flexShrink:0, position:'relative', zIndex:2,
                      boxShadow:`0 0 0 4px ${m.color}22`,
                    }}
                    animate={cardInView ? { boxShadow:[`0 0 0 4px ${m.color}22`,`0 0 0 14px ${m.color}04`,`0 0 0 4px ${m.color}22`] } : {}}
                    transition={{ duration:3, repeat:Infinity, delay:i*0.6 }}
                  />

                  {/* Right slot */}
                  <div style={{ flex:1, paddingLeft:40 }}>
                    {!isLeft && (
                      <div style={{
                        background:'rgba(13,19,38,0.65)', border:`1px solid ${m.color}22`,
                        borderRadius:20, padding:'24px 28px',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <span style={{ fontSize:'clamp(1.8rem,3vw,2.2rem)', fontWeight:700, color:m.color, fontFamily:'Space Grotesk' }}>{m.count}</span>
                        </div>
                        <div style={{ fontSize:15, fontWeight:600, marginBottom:6, fontFamily:'Space Grotesk', color:'#F8FAFC' }}>{m.label}</div>
                        <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65 }}>{m.desc}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="roadmap-mobile" style={{ display:'none', flexDirection:'column', gap:16 }}>
          {milestones.map((m, i) => {
            const [cardRef, cardInView] = useInView()
            return (
              <motion.div key={m.count} ref={cardRef}
                initial={{opacity:0,y:20}} animate={cardInView?{opacity:1,y:0}:{}}
                transition={{duration:0.6, delay:i*0.08}}
                style={{
                  display:'flex', gap:16,
                  background:'rgba(13,19,38,0.65)', border:`1px solid ${m.color}20`,
                  borderRadius:20, padding:'24px 20px',
                }}
              >
                <div style={{ width:4, borderRadius:2, background:m.color, flexShrink:0, alignSelf:'stretch' }}/>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:24, fontWeight:700, color:m.color, fontFamily:'Space Grotesk' }}>{m.count}</span>
                    {m.status && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:100, background:`${m.color}18`, color:m.color }}>{m.status}</span>}
                  </div>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:6, fontFamily:'Space Grotesk', color:'#F8FAFC' }}>{m.label}</div>
                  <p style={{ fontSize:13, color:'#64748B', lineHeight:1.65 }}>{m.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .roadmap-desktop { display: none !important; }
          .roadmap-mobile  { display: flex !important; }
        }
      `}</style>
    </section>
  )
}
