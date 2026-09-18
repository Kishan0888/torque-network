import { Suspense, lazy, useState, useRef } from 'react'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles,Volume2, VolumeX } from 'lucide-react'
import heroVideo from "../assets/video.mp4";
const NetworkScene = lazy(() => import('../components/NetworkScene'))

const fadeUp = (d=0) => ({ initial:{opacity:0,y:32}, animate:{opacity:1,y:0}, transition:{duration:0.85,delay:d,ease:[0.23,1,0.32,1]} })

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
const videoRef = useRef(null);

const toggleSound = async () => {
  if (!videoRef.current) return;

  videoRef.current.muted = !isMuted;
  setIsMuted(!isMuted);

  if (!isMuted) return;

  try {
    await videoRef.current.play();
  } catch (err) {
    console.log(err);
  }
};
  return (
    <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div className="aurora" style={{ position:'absolute', top:'10%', left:'25%', width:700, height:700, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(59,130,246,0.16),transparent 70%)', filter:'blur(50px)' }}/>
        <div className="aurora" style={{ position:'absolute', top:'55%', right:'5%', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(34,211,238,0.11),transparent 70%)', filter:'blur(45px)', animationDelay:'-9s' }}/>
        <div className="aurora" style={{ position:'absolute', bottom:'10%', left:'10%', width:350, height:350, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(129,140,248,0.09),transparent 70%)', filter:'blur(40px)', animationDelay:'-16s' }}/>
      </div>
      <div className="container" style={{ paddingTop:128, paddingBottom:80, position:'relative', zIndex:1 }}>
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <motion.div {...fadeUp(0.1)}>
              <span className="section-tag">
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#22D3EE', display:'inline-block' }} className="pulse-ring"/>
                India's Creator Amplification Network
              </span>
            </motion.div>
            <motion.h1 {...fadeUp(0.22)} style={{ fontSize:'clamp(2.8rem,5vw,5.2rem)', fontWeight:700, lineHeight:1.04, letterSpacing:'-0.035em', marginBottom:22 }}>
              Stop Fighting<br/>
              <span className="gradient-text">the Algorithm</span><br/>
              Alone.
            </motion.h1>
            <motion.p {...fadeUp(0.34)} style={{ fontSize:17, color:'#94A3B8', lineHeight:1.72, maxWidth:470, marginBottom:12 }}>
              Torque Network is India's first structured creator amplification community — 500 to 1,000 real creators amplifying your posts within 48 hours. Guaranteed.
            </motion.p>
            <motion.p {...fadeUp(0.4)} style={{ fontSize:14, color:'#475569', lineHeight:1.65, maxWidth:450, marginBottom:36, fontStyle:'italic' }}>
              Content Creates Potential. Torque Creates Momentum.
            </motion.p>
            <motion.div {...fadeUp(0.46)} style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:48 }}>
              <a href="#community" className="btn-primary" style={{ fontSize:15, padding:'16px 30px' }}>
                Join the Founding 100 <ArrowRight size={16}/>
              </a>
              <a href="#brands" className="btn-ghost" style={{ fontSize:15, padding:'16px 28px' }}>
                For Brands
              </a>
            </motion.div>
            <motion.div {...fadeUp(0.56)} style={{ display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ display:'flex' }}>
                {['#3B82F6','#22D3EE','#818CF8','#F59E0B','#EC4899'].map((c,i) => (
                  <div key={i} style={{ width:38, height:38, borderRadius:'50%', background:c,
                    border:'2px solid #050816', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:11, fontWeight:700, color:'#fff', marginLeft:i>0?-11:0, zIndex:5-i,
                    boxShadow:`0 0 12px ${c}66` }}>
                    {['SK','PM','AK','RJ','NV'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:600, color:'#F8FAFC' }}>Founding spots filling fast</div>
                <div style={{ fontSize:12, color:'#475569', marginTop:2 }}>First 100 creators · Rate locked for life</div>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
            transition={{duration:1.3,delay:0.45,ease:[0.23,1,0.32,1]}}
            style={{ position:'relative', height:580 }} className="hero-3d">
            <Suspense fallback={
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:50, height:50, border:'2px solid #3B82F6', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.9s linear infinite' }}/>
              </div>
            }>
              <NetworkScene />
            </Suspense>
            <motion.div
  initial={{ opacity: 0, y: 30, rotate: 8 }}
  animate={{
    opacity: 1,
    y: [0, -10, 0],
    rotate: [8, 6, 8]
  }}
  transition={{
    opacity: { duration: 1, delay: 0.5 },
    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  }}
  whileHover={{
    scale: 1.04,
    rotate: 4
  }}
  className="hero-phone"
  style={{
    position: "absolute",
    top: -5,
    right: 70,
    width: "clamp(170px,22vw,250px)",
    zIndex: 11,
    borderRadius: 34,
    padding: 8,
    background: "rgba(13,19,38,0.78)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 0 35px rgba(59,130,246,0.28), 0 0 80px rgba(34,211,238,0.12)",
    overflow: "hidden"
  }}
>
  {/* Live badge */}
  <div
    style={{
      position: "absolute",
      top: -12,
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg,#3B82F6,#22D3EE)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      padding: "4px 10px",
      borderRadius: 999,
      boxShadow: "0 0 16px rgba(34,211,238,0.45)",
      zIndex: 3
    }}
  >
    LIVE CREATOR
  </div>

  {/* Dynamic Island */}
  <div
    style={{
      position: "absolute",
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
      width: 56,
      height: 18,
      borderRadius: 999,
      background: "#000",
      zIndex: 3
    }}
  />
<motion.button
  whileTap={{ scale: 0.9 }}
  whileHover={{ scale: 1.08 }}
  onClick={toggleSound}
  style={{
    position: "absolute",
    bottom: 55,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(5,8,22,0.7)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    zIndex: 5,
    boxShadow: "0 0 12px rgba(59,130,246,0.35)"
  }}
>
  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
</motion.button>
  <video
  ref={videoRef}
  src={heroVideo}
  autoPlay
  muted={isMuted}
  loop
  playsInline
  preload="auto"
  style={{
    width: "100%",
    aspectRatio: "9 / 16",
    objectFit: "cover",
    borderRadius: 26,
    display: "block"
  }}
/>
  {/* Bottom live ticker */}
  <div
    style={{
      position: "absolute",
      bottom: 12,
      left: 10,
      right: 10,
      padding: "8px 10px",
      borderRadius: 12,
      background: "rgba(5,8,22,0.65)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.08)"
    }}
  >
    <div style={{ fontSize: 11, color: "#22D3EE", fontWeight: 600 }}>
      Live Creator Showcase
    </div>
  </div>
</motion.div>
            <div className="float-a" style={{ position:'absolute', top:55, right:0, zIndex:10,
              background:'rgba(13,19,38,0.88)', backdropFilter:'blur(24px)',
              border:'1px solid rgba(34,211,238,0.22)', borderRadius:20, padding:'16px 20px', width:192 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#EC4899,#8B5CF6)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>A</div>
                <span style={{ fontSize:12.5, fontWeight:500, color:'#F8FAFC' }}>@aanya.creates</span>
              </div>
              <div style={{ fontSize:11.5, color:'#22D3EE', marginBottom:7 }}>↑ 847 engagements · 48 hrs</div>
              <div style={{ height:3, background:'rgba(255,255,255,0.07)', borderRadius:2 }}>
                <div style={{ width:'88%', height:'100%', background:'linear-gradient(90deg,#3B82F6,#22D3EE)', borderRadius:2 }}/>
              </div>
            </div>
            <div className="float-c" style={{ position:'absolute', bottom:100, left:-16, zIndex:10,
              background:'rgba(13,19,38,0.88)', backdropFilter:'blur(24px)',
              border:'1px solid rgba(59,130,246,0.22)', borderRadius:20, padding:'16px 20px', width:178 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                <Sparkles size={14} color="#F59E0B"/>
                <span style={{ fontSize:11, color:'#94A3B8', fontWeight:500 }}>Brand Match</span>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:'#F8FAFC', fontFamily:'Space Grotesk' }}>Finance Niche</div>
              <div style={{ fontSize:11.5, color:'#22D3EE', marginTop:5, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#22D3EE', display:'inline-block' }}/>
                512 creators active
              </div>
            </div>
            <div className="float-b" style={{ position:'absolute', top:'40%', left:-30, zIndex:10,
              background:'rgba(13,19,38,0.85)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(129,140,248,0.2)', borderRadius:16, padding:'12px 16px', width:152 }}>
              <div style={{ fontSize:10.5, color:'#94A3B8', marginBottom:4 }}>Amplification Active</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#F8FAFC', fontFamily:'Space Grotesk' }}>1,000 creators</div>
              <div style={{ fontSize:10.5, color:'#818CF8', marginTop:4 }}>engaging right now</div>
            </div>
          </motion.div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:9, color:'#2D3748', letterSpacing:'0.18em', textTransform:'uppercase' }}>Scroll</span>
        <motion.div style={{ width:1, height:44, background:'linear-gradient(to bottom,#3B82F6,transparent)' }}
          animate={{ scaleY:[0,1,0], originY:0 }} transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}/>
      </div>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @media(max-width:900px){
  .hero-grid{
    grid-template-columns:1fr !important;
    gap:44px !important;
    text-align:center;
  }

  .hero-3d{
    height:380px !important;
  }

  .hero-phone{
    top:20px !important;
    right:20px !important;
    width:170px !important;
  }

  .float-a{
    top:160px !important;
    right:0 !important;
  }

  .float-b{
    left:0 !important;
  }

  .float-c{
    left:0 !important;
    bottom:20px !important;
  }
}
      `}</style>
    </section>
  )
}
