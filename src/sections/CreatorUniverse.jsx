// import { Suspense, useRef, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Stars } from '@react-three/drei'
// import * as THREE from 'three'
// import { motion } from 'framer-motion'
// import { useInView } from '../hooks/useInView'

// /* ─── Three.js Globe ───────────────────────── */
// function Globe() {
//   const ref = useRef()
//   useFrame(({ clock }) => { if(ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08 })
//   return (
//     <mesh ref={ref}>
//       <sphereGeometry args={[1.6, 48, 48]}/>
//       <meshStandardMaterial
//         color="#0a1628" emissive="#1a2a50" emissiveIntensity={0.5}
//         wireframe={true} transparent opacity={0.25}
//       />
//     </mesh>
//   )
// }

// function GlobeGlow() {
//   const ref = useRef()
//   useFrame(({ clock }) => { if(ref.current) ref.current.material.opacity = 0.12 + Math.sin(clock.getElapsedTime()*0.8)*0.05 })
//   return (
//     <mesh ref={ref}>
//       <sphereGeometry args={[1.75, 32, 32]}/>
//       <meshBasicMaterial color="#3B82F6" transparent opacity={0.12} side={THREE.BackSide}/>
//     </mesh>
//   )
// }

// function OrbitDot({ angle, radius, color, speed }) {
//   const ref = useRef()
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime() * speed + angle
//     if(ref.current) { ref.current.position.x = Math.cos(t)*radius; ref.current.position.z = Math.sin(t)*radius }
//   })
//   return (
//     <group ref={ref}>
//       <mesh><sphereGeometry args={[0.06,12,12]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={3}/></mesh>
//       <mesh><sphereGeometry args={[0.14,12,12]}/><meshBasicMaterial color={color} transparent opacity={0.2}/></mesh>
//     </group>
//   )
// }

// function GlobeScene() {
//   const dots = useMemo(() => {
//     const colors = ['#3B82F6','#22D3EE','#818CF8','#F59E0B','#EC4899','#10B981']
//     return colors.map((c,i) => ({ color:c, angle:(i/colors.length)*Math.PI*2, radius:2.4+i%2*0.4, speed:0.15+i*0.04 }))
//   }, [])
//   return (
//     <Canvas camera={{ position:[0,0,5.5], fov:46 }} style={{ background:'transparent' }} dpr={[1,1.5]}>
//       <Suspense fallback={null}>
//         <ambientLight intensity={0.3}/>
//         <pointLight position={[5,5,5]}   intensity={2} color="#3B82F6"/>
//         <pointLight position={[-5,-5,5]} intensity={1.5} color="#22D3EE"/>
//         <Globe/><GlobeGlow/>
//         {dots.map((d,i) => <OrbitDot key={i} {...d}/>)}
//         <Stars radius={12} depth={4} count={200} factor={1.5} saturation={0} fade speed={0.3}/>
//       </Suspense>
//     </Canvas>
//   )
// }

// /* ─── Creator card ─────────────────────────── */
// const CREATORS = [
//   { handle:'@priya.style',  niche:'Fashion',  followers:'84K', color:'#EC4899', initials:'PS', delay:0   },
//   { handle:'@dev.rohan',    niche:'Tech',     followers:'52K', color:'#3B82F6', initials:'DR', delay:0.1 },
//   { handle:'@fit.kavya',    niche:'Fitness',  followers:'121K',color:'#10B981', initials:'FK', delay:0.2 },
//   { handle:'@travel.aryan', niche:'Travel',   followers:'67K', color:'#F59E0B', initials:'TA', delay:0.3 },
//   { handle:'@food.neha',    niche:'Food',     followers:'95K', color:'#F97316', initials:'FN', delay:0.4 },
//   { handle:'@glow.sanya',   niche:'Beauty',   followers:'43K', color:'#818CF8', initials:'GS', delay:0.5 },
// ]

// function CreatorCard({ creator, inView }) {
//   const ref = useRef(null)
//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity:0, y:24, scale:0.96 }}
//       animate={inView ? { opacity:1, y:0, scale:1 } : {}}
//       transition={{ duration:0.65, delay:0.3+creator.delay, ease:[0.23,1,0.32,1] }}
//       whileHover={{ y:-8, scale:1.04, boxShadow:`0 24px 60px ${creator.color}30` }}
//       style={{
//         background:'rgba(13,19,38,0.78)', backdropFilter:'blur(24px)',
//         border:`1px solid ${creator.color}25`, borderRadius:20,
//         padding:'22px 20px', cursor:'default',
//         transition:'box-shadow 0.3s',
//       }}
//     >
//       <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
//         <div style={{
//           width:44, height:44, borderRadius:'50%',
//           background:`linear-gradient(135deg,${creator.color},${creator.color}88)`,
//           display:'flex', alignItems:'center', justifyContent:'center',
//           fontSize:13, fontWeight:700, color:'#fff', flexShrink:0,
//           boxShadow:`0 0 16px ${creator.color}55`,
//         }}>
//           {creator.initials}
//         </div>
//         <div>
//           <div style={{ fontSize:13.5, fontWeight:600, color:'#F8FAFC' }}>{creator.handle}</div>
//           <div style={{ fontSize:11.5, color:'#64748B', marginTop:2 }}>{creator.niche} Creator</div>
//         </div>
//       </div>
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//         <div>
//           <div style={{ fontSize:17, fontWeight:700, color:'#F8FAFC', fontFamily:'Space Grotesk' }}>{creator.followers}</div>
//           <div style={{ fontSize:10.5, color:'#475569' }}>Followers</div>
//         </div>
//         <div style={{
//           padding:'4px 12px', borderRadius:100,
//           background:`${creator.color}12`, border:`1px solid ${creator.color}30`,
//           fontSize:11, color:creator.color, fontWeight:600,
//         }}>Active</div>
//       </div>
//       {/* Pulse beam */}
//       <div style={{ marginTop:12, height:2, background:'rgba(255,255,255,0.05)', borderRadius:2, overflow:'hidden' }}>
//         <div className="beam-pulse" style={{ height:'100%', width:'60%', background:`linear-gradient(90deg,transparent,${creator.color},transparent)`, borderRadius:2 }}/>
//       </div>
//     </motion.div>
//   )
// }

// export default function CreatorUniverse() {
//   const [ref, inView] = useInView()

//   return (
//     <section className="section-py" style={{ background:'rgba(5,8,22,0.95)' }}>
//       <div className="container">
//         <motion.div ref={ref}
//           initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
//           style={{ textAlign:'center', marginBottom:72 }}
//         >
//           <span className="section-tag" style={{ color:'#22D3EE' }}>The Creator Universe</span>
//           <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.4rem)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.035em' }}>
//             Every niche.<br/><span className="gradient-text">One network.</span>
//           </h2>
//           <p style={{ fontSize:16, color:'#64748B', maxWidth:480, margin:'16px auto 0', lineHeight:1.7 }}>
//             From fashion to finance, Torque connects India's most engaged creators into a single, pulsing ecosystem built for collaborative growth.
//           </p>
//         </motion.div>

//         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }} className="universe-grid">
//           {/* 3D Globe */}
//           <motion.div
//             initial={{ opacity:0, scale:0.88 }}
//             animate={inView ? { opacity:1, scale:1 } : {}}
//             transition={{ duration:1.1, delay:0.2, ease:[0.23,1,0.32,1] }}
//             style={{ height:480, position:'relative' }}
//             className="globe-wrap"
//           >
//             {/* Aurora behind globe */}
//             <div style={{
//               position:'absolute', inset:'-20%', borderRadius:'50%',
//               background:'radial-gradient(circle, rgba(34,211,238,0.08), rgba(59,130,246,0.06), transparent 70%)',
//               filter:'blur(30px)', pointerEvents:'none',
//             }}/>
//             <GlobeScene/>
//           </motion.div>

//           {/* Creator cards */}
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="creator-cards">
//             {CREATORS.map((c) => <CreatorCard key={c.handle} creator={c} inView={inView}/>)}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @media(max-width:900px){ .universe-grid{ grid-template-columns:1fr !important; } .globe-wrap{ height:300px !important; } }
//         @media(max-width:500px){ .creator-cards{ grid-template-columns:1fr !important; } }
//       `}</style>
//     </section>
//   )
// }
import { motion } from "framer-motion";
import {
  Plane,
  Utensils,
  Dumbbell,
  Music,
  Heart,
  Camera,
  Users,
  Infinity,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    title: "TRAVEL",
    subtitle: "Explore. Share. Inspire.",
    desc: "New places. New people.",
    icon: Plane,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80",
    note: "Explore\nShare\nInspire",
  },
  {
    title: "FOOD",
    subtitle: "Good Food. Happier People.",
    desc: "Share flavours. Build connections.",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80",
    note: "Good\nFood\nHappier\nPeople",
  },
  {
    title: "FITNESS",
    subtitle: "Stronger Creators.",
    desc: "Inspire healthier lives.",
    icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=80",
    note: "Stronger\nCreators",
  },
  {
    title: "MUSIC",
    subtitle: "Music Connects Us.",
    desc: "Create. Share. Be heard.",
    icon: Music,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80",
    note: "Music\nConnects\nUs",
  },
  {
    title: "LIFESTYLE",
    subtitle: "Style Stories.",
    desc: "Real stories. Real impact.",
    icon: Heart,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&q=80",
    note: "Style\nStories",
  },
  {
    title: "TECH",
    subtitle: "Tech Tips.",
    desc: "Create. Repeat.",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80",
    note: "Tech\nTips",
  },
];

export default function CreatorUniverse() {
  return (
    <section
      className="section-py"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(rgba(5,10,25,.72),rgba(5,10,25,.88)),url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=80') center/cover",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,193,7,.08), transparent 60%)",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div
            style={{
              letterSpacing: "8px",
              color: "#E5E7EB",
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            CREATE | SUPPORT | GROW
          </div>

          <h2
            style={{
              fontSize: "clamp(2.4rem,5vw,4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              fontFamily: "Space Grotesk",
            }}
          >
            Different Creators.
            <br />
            <span style={{ color: "#FACC15" }}>Bigger Opportunities.</span>
          </h2>

          <p
            style={{
              fontSize: 18,
              color: "#CBD5E1",
              marginTop: 18,
            }}
          >
            A community for every passion.
          </p>
        </motion.div>

        {/* Right Note */}

        <div
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            color: "#fff",
            fontSize: 24,
            fontFamily: "cursive",
            textAlign: "center",
            transform: "rotate(-8deg)",
          }}
        >
          All
          <br />
          Creators
          <br />
          Welcome ♡
        </div>

        {/* Cards */}

        <div className="creator-grid">
          {CATEGORIES.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                className="creator-card"
              >
                <img src={item.image} alt={item.title} />

                <div className="overlay" />

                <div className="note">{item.note}</div>

                <div className="content">
                  <Icon size={30} color="#FACC15" />

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bottom-strip"
        >
          <div className="stat">
            <Users color="#FACC15" />
            <div>
              <strong>10,000+</strong>
              <span>Creators</span>
            </div>
          </div>

          <div className="stat">
            <Infinity color="#FACC15" />
            <div>
              <strong>Real</strong>
              <span>Opportunities</span>
            </div>
          </div>

          <div className="stat">
            <TrendingUp color="#FACC15" />
            <div>
              <strong>Brighter</strong>
              <span>Tomorrow</span>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} className="join-btn">
            Join the Founding 500 <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>

      <style>{`
      .creator-grid{
        display:grid;
        grid-template-columns:repeat(6,1fr);
        gap:14px;
      }

      .creator-card{
        position:relative;
        height:430px;
        border-radius:22px;
        overflow:hidden;
        border:1px solid rgba(255,255,255,.15);
        backdrop-filter:blur(12px);
        box-shadow:0 20px 60px rgba(0,0,0,.35);
      }

      .creator-card img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .overlay{
        position:absolute;
        inset:0;
        background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.78));
      }

      .note{
        position:absolute;
        top:18px;
        left:18px;
        color:#fff;
        white-space:pre-line;
        font-family:cursive;
        font-size:20px;
        text-shadow:0 4px 12px rgba(0,0,0,.4);
      }

      .content{
        position:absolute;
        bottom:26px;
        left:22px;
        right:22px;
        text-align:center;
      }

      .content h3{
        font-size:28px;
        margin:14px 0 8px;
        font-weight:800;
        color:#fff;
      }

      .content p{
        color:#E5E7EB;
        line-height:1.5;
        font-size:14px;
      }

      .bottom-strip{
        margin-top:36px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
        gap:20px;
        padding:24px;
        border-radius:22px;
        background:rgba(8,13,28,.55);
        border:1px solid rgba(255,255,255,.08);
        backdrop-filter:blur(18px);
      }

      .stat{
        display:flex;
        align-items:center;
        gap:14px;
      }

      .stat strong{
        display:block;
        color:#fff;
        font-size:24px;
      }

      .stat span{
        color:#CBD5E1;
        font-size:13px;
      }

      .join-btn{
        display:flex;
        align-items:center;
        gap:10px;
        padding:16px 28px;
        border:none;
        border-radius:999px;
        background:#FACC15;
        color:#111827;
        font-weight:700;
        cursor:pointer;
      }

      @media(max-width:1200px){
        .creator-grid{
          grid-template-columns:repeat(3,1fr);
        }
      }

      @media(max-width:768px){
        .creator-grid{
          grid-template-columns:repeat(2,1fr);
        }

        .creator-card{
          height:340px;
        }

        .bottom-strip{
          justify-content:center;
          text-align:center;
        }
      }

      @media(max-width:480px){
        .creator-grid{
          grid-template-columns:1fr;
        }
      }
      `}</style>
    </section>
  );
}