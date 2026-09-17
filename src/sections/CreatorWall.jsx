import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Camera } from 'lucide-react'

const CREATORS = [
  { name:'Priya Sharma',   handle:'@priya.creates', niche:'Fashion',  city:'Mumbai',    color:'#EC4899', init:'PS', followers:'84K',  delay:0 },
  { name:'Rohan Dev',      handle:'@devrohan.tech', niche:'Tech',     city:'Bangalore', color:'#3B82F6', init:'RD', followers:'52K',  delay:0.05 },
  { name:'Kavya Fitness',  handle:'@fit.kavya',     niche:'Fitness',  city:'Delhi',     color:'#10B981', init:'KF', followers:'121K', delay:0.1 },
  { name:'Aryan Travels',  handle:'@aryan.world',   niche:'Travel',   city:'Jaipur',    color:'#F59E0B', init:'AT', followers:'67K',  delay:0.15 },
  { name:'Neha Bakes',     handle:'@nehabakes',     niche:'Food',     city:'Hyderabad', color:'#F97316', init:'NB', followers:'95K',  delay:0.2 },
  { name:'Sanya Glow',     handle:'@sanya.glow',    niche:'Beauty',   city:'Kolkata',   color:'#818CF8', init:'SG', followers:'43K',  delay:0.25 },
  { name:'Vikram Finance', handle:'@vikram.money',  niche:'Finance',  city:'Lucknow',   color:'#22D3EE', init:'VF', followers:'76K',  delay:0.3 },
  { name:'Aisha Art',      handle:'@aisha.art',     niche:'Art',      city:'Ahmedabad', color:'#FB7185', init:'AA', followers:'38K',  delay:0.35 },
  { name:'Kunal Sports',   handle:'@kunal.sports',  niche:'Sports',   city:'Pune',      color:'#34D399', init:'KS', followers:'59K',  delay:0.4 },
  { name:'Meera Life',     handle:'@meera.lifestyle',niche:'Lifestyle',city:'Chennai',  color:'#A78BFA', init:'ML', followers:'91K',  delay:0.45 },
  { name:'Dev Vlogs',      handle:'@devvlogs',      niche:'Vlogs',    city:'Delhi',     color:'#60A5FA', init:'DV', followers:'33K',  delay:0.5 },
  { name:'Riya Dance',     handle:'@riya.dance',    niche:'Dance',    city:'Mumbai',    color:'#F472B6', init:'RD', followers:'145K', delay:0.55 },
]

function CreatorCard({ c, inView }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const rX = useSpring(useTransform(y,[-60,60],[8,-8]),{stiffness:350,damping:35})
  const rY = useSpring(useTransform(x,[-60,60],[-8,8]),{stiffness:350,damping:35})

  const floatClass = ['float-a','float-b','float-c'][Math.floor(CREATORS.indexOf(c)%3)]

  return (
    <motion.div
      initial={{opacity:0,y:32,scale:0.94}}
      animate={inView?{opacity:1,y:0,scale:1}:{}}
      transition={{duration:0.65,delay:0.15+c.delay,ease:[0.23,1,0.32,1]}}
      style={{perspective:800}}
    >
      <motion.div ref={ref}
        className={floatClass}
        style={{rotateX:rX,rotateY:rY,transformStyle:'preserve-3d'}}
        onMouseMove={e=>{const r=ref.current?.getBoundingClientRect();if(!r)return;x.set(e.clientX-r.left-r.width/2);y.set(e.clientY-r.top-r.height/2)}}
        onMouseLeave={()=>{x.set(0);y.set(0)}}
        whileHover={{scale:1.05,y:-8,boxShadow:`0 28px 60px ${c.color}30`}}
        style={{
          borderRadius:22,padding:'24px 20px',cursor:'default',textAlign:'center',
          background:'rgba(13,19,38,0.75)',backdropFilter:'blur(24px)',
          border:`1px solid ${c.color}20`,
          position:'relative',overflow:'hidden',
        }}
      >
        {/* Top glow line */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${c.color}80,transparent)`}}/>

        {/* Avatar */}
        <div style={{position:'relative',display:'inline-block',marginBottom:14}}>
          <div style={{
            width:60,height:60,borderRadius:'50%',
            background:`linear-gradient(135deg,${c.color},${c.color}55)`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:18,fontWeight:700,color:'#fff',
            boxShadow:`0 0 24px ${c.color}55`,
            border:`2px solid ${c.color}40`,
          }}>{c.init}</div>
          <div style={{
            position:'absolute',bottom:-2,right:-2,
            width:18,height:18,borderRadius:'50%',
            background:'#050816',border:`2px solid ${c.color}`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <div style={{width:7,height:7,borderRadius:'50%',background:c.color}}/>
          </div>
        </div>

        <div style={{fontSize:14,fontWeight:700,color:'#F8FAFC',fontFamily:'Space Grotesk',marginBottom:4}}>{c.name}</div>
        <div style={{fontSize:11.5,color:'#64748B',marginBottom:10}}>{c.handle}</div>

        <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap',marginBottom:12}}>
          <span style={{fontSize:10.5,padding:'3px 10px',borderRadius:100,background:`${c.color}14`,color:c.color,fontWeight:600}}>{c.niche}</span>
          <span style={{fontSize:10.5,padding:'3px 10px',borderRadius:100,background:'rgba(255,255,255,0.04)',color:'#64748B'}}>{c.city}</span>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:'#F8FAFC',fontFamily:'Space Grotesk'}}>{c.followers}</div>
            <div style={{fontSize:10,color:'#475569'}}>followers</div>
          </div>
          <Camera size={16} color={c.color} strokeWidth={1.5}/>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CreatorWall() {
  const [ref, inView] = useInView()
  return (
    <section className="section-py" style={{background:'rgba(13,19,38,0.3)'}}>
      <div className="container">
        <motion.div ref={ref}
          initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{textAlign:'center',marginBottom:64}}
        >
          <span className="section-tag" style={{color:'#EC4899'}}>Founding Creators</span>
          <h2 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,lineHeight:1.1,letterSpacing:'-0.03em'}}>
            Meet the people<br/><span className="gradient-text">shaping this network.</span>
          </h2>
          <p style={{fontSize:15,color:'#64748B',maxWidth:440,margin:'14px auto 0',lineHeight:1.68}}>
            These are the founding voices of Torque Network — each one representing a niche, a city, and a community that deserves to grow.
          </p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18}} className="wall-grid">
          {CREATORS.map(c=><CreatorCard key={c.handle} c={c} inView={inView}/>)}
        </div>

        <motion.div
          initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6,delay:0.8}}
          style={{textAlign:'center',marginTop:40}}
        >
          <p style={{fontSize:13,color:'#334155'}}>
            Placeholder profiles · Real creators will appear after launch
          </p>
        </motion.div>
      </div>
      <style>{`
        @media(max-width:1100px){.wall-grid{grid-template-columns:repeat(3,1fr) !important;}}
        @media(max-width:750px) {.wall-grid{grid-template-columns:repeat(2,1fr) !important;}}
        @media(max-width:460px) {.wall-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </section>
  )
}
