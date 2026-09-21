// import { motion } from 'framer-motion'
// import { useInView } from '../hooks/useInView'
// import { X, CheckCircle } from 'lucide-react'

// const AGAINST = [
//   'Only 3–7% of your followers ever see a post',
//   'Posts without early engagement get buried',
//   'Follower likes stop there — they don\'t carry your content to new people',
//   'Building momentum alone takes years',
// ]
// const CHANGES = [
//   '500–2,500 real creators watch, save and share your post within 48 hours',
//   'When a creator engages, their audience sees you',
//   'Creators from every category engage, so new audiences discover you',
//   'You grow inside a vetted creator community instead of on your own',
// ]

// export default function WhatChanges() {
//   const [ref, inView] = useInView()
//   return (
//     <section className="section-py" style={{ background:'rgba(13,19,38,0.3)' }}>
//       <div className="container">
//         <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
//           style={{ textAlign:'center', marginBottom:64 }}>
//           <span className="section-tag" style={{ color:'#22D3EE' }}>The Algorithm Isn't Broken</span>
//           <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.03em' }}>
//             You're just fighting it <span className="gradient-text">alone.</span>
//           </h2>
//         </motion.div>

//         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }} className="changes-grid">
//           <motion.div initial={{opacity:0,x:-36}} animate={inView?{opacity:1,x:0}:{}}
//             transition={{duration:0.8,ease:[0.23,1,0.32,1]}}
//             style={{ borderRadius:24, padding:'36px 32px', background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.14)' }}>
//             <div style={{ fontSize:12, fontWeight:700, color:'#EF4444', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>What You're Up Against</div>
//             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//               {AGAINST.map((item,i)=>(
//                 <motion.div key={i} initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
//                   transition={{delay:0.2+i*0.09,duration:0.5}}
//                   style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
//                   <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
//                     background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)',
//                     display:'flex', alignItems:'center', justifyContent:'center' }}>
//                     <X size={10} color="#EF4444" strokeWidth={3}/>
//                   </div>
//                   <span style={{ fontSize:14, color:'#94A3B8', lineHeight:1.6 }}>{item}</span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div initial={{opacity:0,x:36}} animate={inView?{opacity:1,x:0}:{}}
//             transition={{duration:0.8,delay:0.1,ease:[0.23,1,0.32,1]}}
//             style={{ borderRadius:24, padding:'36px 32px', background:'rgba(34,211,238,0.04)', border:'1px solid rgba(34,211,238,0.14)' }}>
//             <div style={{ fontSize:12, fontWeight:700, color:'#22D3EE', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24 }}>What Torque Network Changes</div>
//             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//               {CHANGES.map((item,i)=>(
//                 <motion.div key={i} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
//                   transition={{delay:0.25+i*0.09,duration:0.5}}
//                   style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
//                   <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
//                     background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.3)',
//                     display:'flex', alignItems:'center', justifyContent:'center' }}>
//                     <CheckCircle size={11} color="#22D3EE" strokeWidth={2.5}/>
//                   </div>
//                   <span style={{ fontSize:14, color:'#CBD5E1', lineHeight:1.6 }}>{item}</span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Flow graphic */}
//         <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
//           transition={{duration:0.7,delay:0.5}}
//           style={{ marginTop:48, padding:'24px 32px', borderRadius:20,
//             background:'rgba(13,19,38,0.55)', border:'1px solid rgba(59,130,246,0.12)',
//             backdropFilter:'blur(16px)' }}>
//           <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:12 }}>
//             {['Creator engages','Their audience sees you','New audiences discover you','Your reach & engagement grows'].map((step,i)=>(
//               <div key={step} style={{ display:'flex', alignItems:'center', gap:12 }}>
//                 <div style={{ padding:'8px 16px', borderRadius:100,
//                   background:i===3?'linear-gradient(135deg,#3B82F6,#22D3EE)':'rgba(59,130,246,0.1)',
//                   border:i===3?'none':'1px solid rgba(59,130,246,0.2)',
//                   fontSize:13, fontWeight:600,
//                   color:i===3?'#fff':'#94A3B8' }}>{step}</div>
//                 {i<3 && <span style={{ color:'#334155', fontSize:18 }}>→</span>}
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Pull quote */}
//         <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.7,duration:0.7}}
//           style={{ textAlign:'center', marginTop:40 }}>
//           <p style={{ fontSize:18, color:'#64748B', fontStyle:'italic', maxWidth:560, margin:'0 auto', lineHeight:1.65 }}>
//             "One post. Hundreds of real creators. Momentum from the first hour."
//           </p>
//         </motion.div>
//       </div>
//       <style>{`@media(max-width:768px){.changes-grid{grid-template-columns:1fr !important;}}`}</style>
//     </section>
//   )
// }
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

function ConstellationBg() {
  const lines = [
    ["5%", "20%", "25%", "65%"],
    ["25%", "65%", "55%", "28%"],
    ["55%", "28%", "80%", "72%"],
    ["80%", "72%", "95%", "18%"],
    ["95%", "18%", "5%", "20%"],
  ];

  const dots = [
    ["5%", "20%"],
    ["25%", "65%"],
    ["55%", "28%"],
    ["80%", "72%"],
    ["95%", "18%"],
    ["50%", "45%"],
  ];

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.12,
      }}
      preserveAspectRatio="none"
    >
      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#3B82F6"
          strokeWidth="0.7"
          strokeDasharray="6 10"
        />
      ))}

      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#22D3EE" />
      ))}
    </svg>
  );
}

export default function Problem() {
  const [ref, inView] = useInView();

  return (
    <section
      id="creators"
      className="section-py"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ConstellationBg />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(13,19,38,.7)",
              color: "#FF6B81",
              fontSize: 14,
              marginBottom: 22,
            }}
          >
            The Problem Every Creator Faces
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem,4vw,3.2rem)",
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-.03em",
              marginBottom: 16,
            }}
          >
            The system wasn't built
            <br />
            <span className="gradient-text">for creators.</span>
          </h2>

          <p
            style={{
              color: "#64748B",
              maxWidth: 620,
              margin: "0 auto",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Three compounding forces keep most creators invisible — no matter
            how good their content is.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          whileHover={{
            y: -4,
            boxShadow: "0 40px 100px rgba(0,0,0,.35)",
          }}
          style={{
            borderRadius: 30,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(13,19,38,.45)",
            backdropFilter: "blur(22px)",
          }}
        >
          <img
            src="/1.png"
            alt="Creator Problem vs Solution"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @media(max-width:768px){

          #creators img{
            content:url("/1.png");
          }

        }

        @media(max-width:480px){

          #creators{
            padding-top:72px;
            padding-bottom:72px;
          }

        }
      `}</style>
    </section>
  );
}