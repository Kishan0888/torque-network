// import { useRef, useState } from 'react'
// import { motion } from 'framer-motion'
// import { ArrowRight, Volume2, VolumeX } from 'lucide-react'

// const fadeUp = (d=0) => ({ initial:{opacity:0,y:32}, animate:{opacity:1,y:0}, transition:{duration:0.85,delay:d,ease:[0.23,1,0.32,1]} })

// export default function Hero() {
//   const videoRef = useRef(null)
//   const [muted, setMuted] = useState(false) // start unmuted per request

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted
//       setMuted(videoRef.current.muted)
//     }
//   }

//   return (
//     <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden' }}>
//       {/* Aurora blobs */}
//       <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
//         <div className="aurora" style={{ position:'absolute', top:'10%', left:'20%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.16),transparent 70%)', filter:'blur(55px)' }}/>
//         <div className="aurora" style={{ position:'absolute', top:'55%', right:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.11),transparent 70%)', filter:'blur(45px)', animationDelay:'-9s' }}/>
//         <div className="aurora" style={{ position:'absolute', bottom:'10%', left:'5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(129,140,248,0.09),transparent 70%)', filter:'blur(40px)', animationDelay:'-16s' }}/>
//       </div>

//       <div className="container" style={{ paddingTop:128, paddingBottom:80, position:'relative', zIndex:1 }}>
//         <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

//           {/* ── LEFT: Copy ───────────────────────── */}
//           <div>
//             <motion.div {...fadeUp(0.1)}>
//               <span className="section-tag">
//                 <span style={{ width:7, height:7, borderRadius:'50%', background:'#22D3EE', display:'inline-block' }} className="pulse-ring"/>
//                 A structured amplification network for Instagram creators
//               </span>
//             </motion.div>

//             <motion.h1 {...fadeUp(0.22)} style={{ fontSize:'clamp(2.2rem,4.2vw,4rem)', fontWeight:700, lineHeight:1.06, letterSpacing:'-0.03em', marginBottom:22 }}>
//               Only 3–7% of Your Followers<br/>
//               See Your Posts.<br/>
//               <span className="gradient-text">Torque Network Changes That.</span>
//             </motion.h1>

//             <motion.p {...fadeUp(0.34)} style={{ fontSize:16.5, color:'#94A3B8', lineHeight:1.74, maxWidth:480, marginBottom:36 }}>
//               Torque Network is a private, structured amplification network for Instagram creators of every kind. Between 500 and 2,500 real creators watch, save and share every post you publish within 48 hours, so new audiences discover you and your reach grows beyond your followers.
//             </motion.p>

//             <motion.div {...fadeUp(0.44)} style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:24 }}>
//               <a href="#community" className="btn-primary"
//                 style={{ fontSize:15, padding:'16px 30px', background:'linear-gradient(135deg,#D97706,#F59E0B)', boxShadow:'0 0 30px rgba(245,158,11,0.4)' }}>
//                 Join the Founding 500 for Free <ArrowRight size={16}/>
//               </a>
//               <a href="#how-it-works" className="btn-ghost" style={{ fontSize:15, padding:'16px 28px' }}>
//                 See How It Works
//               </a>
//             </motion.div>

//             {/* Trust line */}
//             <motion.div {...fadeUp(0.5)} style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center', marginBottom:40 }}>
//               {['Free for life for the first 500 members','₹1,500/month after that','Stay free by engaging regularly'].map((t,i)=>(
//                 <span key={t} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:'#64748B' }}>
//                   {i>0 && <span style={{ color:'#2D3748' }}>·</span>}
//                   {t}
//                 </span>
//               ))}
//             </motion.div>

//             {/* Social proof avatars */}
//             <motion.div {...fadeUp(0.56)} style={{ display:'flex', alignItems:'center', gap:18 }}>
//               <div style={{ display:'flex' }}>
//                 {['#3B82F6','#22D3EE','#818CF8','#F59E0B','#EC4899'].map((c,i)=>(
//                   <div key={i} style={{ width:36, height:36, borderRadius:'50%', background:c,
//                     border:'2px solid #050816', display:'flex', alignItems:'center', justifyContent:'center',
//                     fontSize:10, fontWeight:700, color:'#fff', marginLeft:i>0?-10:0, zIndex:5-i,
//                     boxShadow:`0 0 10px ${c}66` }}>
//                     {['SK','PM','AK','RJ','NV'][i]}
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <div style={{ fontSize:13, fontWeight:600, color:'#F8FAFC' }}>Founding spots filling fast</div>
//                 <div style={{ fontSize:11.5, color:'#475569', marginTop:2 }}>500 total · Free for life · Engage regularly to keep it</div>
//               </div>
//             </motion.div>
//           </div>

//           {/* ── RIGHT: Video player ───────────────── */}
//           <motion.div
//             initial={{ opacity:0, scale:0.9 }}
//             animate={{ opacity:1, scale:1 }}
//             transition={{ duration:1.2, delay:0.4, ease:[0.23,1,0.32,1] }}
//             style={{ position:'relative' }}
//             className="hero-3d"
//           >
//             {/* Glow ring behind video */}
//             <div style={{
//               position:'absolute', inset:'-12px', borderRadius:36,
//               background:'linear-gradient(135deg,rgba(59,130,246,0.35),rgba(34,211,238,0.2),rgba(129,140,248,0.15))',
//               filter:'blur(24px)', zIndex:0,
//             }}/>

//             {/* Animated border frame */}
//             <div className="animated-border" style={{ borderRadius:28, position:'relative', zIndex:1 }}>
//               <div style={{ borderRadius:27, overflow:'hidden', background:'#000', position:'relative' }}>
//                 <video
//                   ref={videoRef}
//                   src="/hero-video.mp4"
//                   autoPlay
//                   loop
//                   playsInline
//                   /* Start unmuted as requested — browser may still block unmuted autoplay;
//                      we handle that gracefully with the mute toggle below */
//                   muted={false}
//                   onError={() => {
//                     // If unmuted autoplay fails, fall back to muted (browser policy)
//                     if (videoRef.current) { videoRef.current.muted = true; setMuted(true); videoRef.current.play().catch(()=>{}) }
//                   }}
//                   style={{ width:'100%', height:'auto', display:'block', maxHeight:520, objectFit:'cover' }}
//                 />

//                 {/* Mute / unmute toggle */}
//                 <button
//                   onClick={toggleMute}
//                   style={{
//                     position:'absolute', bottom:14, right:14, zIndex:10,
//                     width:38, height:38, borderRadius:12,
//                     background:'rgba(5,8,22,0.75)', backdropFilter:'blur(12px)',
//                     border:'1px solid rgba(255,255,255,0.15)',
//                     display:'flex', alignItems:'center', justifyContent:'center',
//                     cursor:'pointer', transition:'background 0.2s, border-color 0.2s',
//                   }}
//                   title={muted ? 'Unmute' : 'Mute'}
//                   onMouseEnter={e => { e.currentTarget.style.background='rgba(59,130,246,0.4)'; e.currentTarget.style.borderColor='rgba(59,130,246,0.6)' }}
//                   onMouseLeave={e => { e.currentTarget.style.background='rgba(5,8,22,0.75)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)' }}
//                 >
//                   {muted
//                     ? <VolumeX size={16} color="#94A3B8"/>
//                     : <Volume2 size={16} color="#22D3EE"/>
//                   }
//                 </button>

//                 {/* AMPLIFY · CONNECT · GROW tag — matches logo tagline */}
//                 <div style={{
//                   position:'absolute', bottom:14, left:14, zIndex:10,
//                   padding:'5px 12px', borderRadius:100,
//                   background:'rgba(5,8,22,0.78)', backdropFilter:'blur(12px)',
//                   border:'1px solid rgba(245,158,11,0.3)',
//                   fontSize:10.5, fontWeight:700, color:'#F59E0B',
//                   letterSpacing:'0.1em',
//                 }}>
//                   AMPLIFY · CONNECT · GROW
//                 </div>
//               </div>
//             </div>

//             {/* Floating stat cards */}
//             <div className="float-a" style={{
//               position:'absolute', top:-20, right:-16, zIndex:10,
//               background:'rgba(13,19,38,0.9)', backdropFilter:'blur(24px)',
//               border:'1px solid rgba(34,211,238,0.25)', borderRadius:18,
//               padding:'14px 18px', width:186,
//             }}>
//               <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
//                 <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#EC4899,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>A</div>
//                 <span style={{ fontSize:12, fontWeight:600, color:'#F8FAFC' }}>@aanya.creates</span>
//               </div>
//               <div style={{ fontSize:11, color:'#22D3EE', marginBottom:7 }}>↑ 1,247 engagements · 48 hrs</div>
//               <div style={{ height:3, background:'rgba(255,255,255,0.07)', borderRadius:2 }}>
//                 <div style={{ width:'88%', height:'100%', background:'linear-gradient(90deg,#3B82F6,#22D3EE)', borderRadius:2 }}/>
//               </div>
//             </div>

//             <div className="float-c" style={{
//               position:'absolute', bottom:-16, left:-20, zIndex:10,
//               background:'rgba(13,19,38,0.9)', backdropFilter:'blur(24px)',
//               border:'1px solid rgba(245,158,11,0.3)', borderRadius:18,
//               padding:'14px 18px', width:178,
//             }}>
//               <div style={{ fontSize:10.5, fontWeight:700, color:'#F59E0B', marginBottom:5, letterSpacing:'0.06em', textTransform:'uppercase' }}>🔐 Founding Spot</div>
//               <div style={{ fontSize:15, fontWeight:700, color:'#F8FAFC', fontFamily:'Space Grotesk' }}>Free for Life</div>
//               <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>Stay free · engage regularly</div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll cue */}
//       <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
//         <span style={{ fontSize:9, color:'#2D3748', letterSpacing:'0.18em', textTransform:'uppercase' }}>Scroll</span>
//         <motion.div style={{ width:1, height:44, background:'linear-gradient(to bottom,#3B82F6,transparent)' }}
//           animate={{ scaleY:[0,1,0] }} transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}/>
//       </div>

//       <style>{`
//         @media(max-width:900px){
//           .hero-grid{ grid-template-columns:1fr !important; gap:44px !important; text-align:center; }
//           .hero-3d{ order:-1; }
//         }
//       `}</style>
//     </section>
//   )
// }
import { Suspense, lazy, useState, useRef } from "react";
import { usePlatform } from "../context/PlatformContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Volume2, VolumeX, Briefcase, ThumbsUp, MessageSquare, Repeat2 } from "lucide-react";
import heroVideo from "../assets/video.mp4";
import { InstagramGlyph, LinkedInGlyph } from "../components/BrandGlyphs";

const NetworkScene = lazy(() => import("../components/NetworkScene"));

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay: d, ease: [0.23, 1, 0.32, 1] },
});

const IG_GRAD = "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)";
const LI_BLUE = "#0A66C2";

// Copy for each platform. The switch sets the platform for the whole page.
const PLATFORM_COPY = {
  instagram: {
    tab: "Instagram creators",
    body: "Torque for Instagram is a private, structured amplification network for creators of every kind. Between 500 and 2,500 real creators watch, save and share every post you publish within 48 hours, so new audiences discover you and your reach grows beyond your followers.",
    cta: "Join Torque for Instagram",
    href: "/signup?plan=instagram",
    ghost: { label: "See How It Works", href: "#how-it-works" },
    people: "Creators across every niche",
    price: "₹750/month · Cancel anytime",
  },
  linkedin: {
    tab: "LinkedIn professionals",
    body: "Torque for LinkedIn is a professional growth community. Share your posts with verified peers from your own industry who react, comment thoughtfully and repost, so your expertise reaches the right people well beyond your connections.",
    cta: "Join Torque for LinkedIn",
    href: "/signup?plan=linkedin",
    ghost: { label: "See How It Works", href: "#how-it-works" },
    people: "Professionals across 9 industries",
    price: "₹500/month · Cancel anytime",
  },
};

export function PlatformSwitch({ platform, onPick }) {
  return (
    <div role="tablist" aria-label="Choose your platform" className="hero-switch"
      style={{ display: "inline-flex", padding: 5, gap: 4, borderRadius: 999, background: "rgba(13,19,38,.75)", border: "1px solid rgba(255,255,255,.09)", marginBottom: 22 }}>
      {["instagram", "linkedin"].map((k) => {
        const on = platform === k;
        return (
          <button key={k} role="tab" aria-selected={on} onClick={() => onPick(k)} type="button"
            style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, border: "none", background: "transparent", color: on ? "#fff" : "#94A3B8", fontSize: 13.5, fontWeight: 650, cursor: "pointer", fontFamily: "inherit" }}>
            {on && <motion.span layoutId="hero-switch-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{ position: "absolute", inset: 0, borderRadius: 999, background: k === "instagram" ? IG_GRAD : LI_BLUE, boxShadow: k === "instagram" ? "0 6px 22px rgba(221,42,123,.35)" : "0 6px 22px rgba(10,102,194,.45)" }} />}
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {k === "instagram" ? <InstagramGlyph size={15} /> : <LinkedInGlyph size={15} />}
              <span className="hs-long">{PLATFORM_COPY[k].tab}</span>
              <span className="hs-short">{k === "instagram" ? "Instagram" : "LinkedIn"}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** LinkedIn post mock shown in place of the reel when LinkedIn is selected. */
function LinkedInPostMock() {
  return (
    <div style={{ borderRadius: 22, background: "rgba(13,19,38,.92)", border: "1px solid rgba(10,102,194,.35)", boxShadow: "0 0 40px rgba(10,102,194,.25)", padding: 18, color: "#E2E8F0", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#0A66C2,#22D3EE)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14 }}>RM</div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>Rohan Mehta</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Product Manager · Fintech</div>
        </div>
        <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: 5, background: LI_BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}><LinkedInGlyph size={13} color="#fff" /></div>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#CBD5E1", marginBottom: 12 }}>
        3 things I wish I knew before my first product launch 🚀<br />
        <span style={{ color: "#64748B" }}>1. Talk to users before you write the spec…</span>
      </div>
      <div style={{ height: 78, borderRadius: 12, background: "linear-gradient(135deg,rgba(10,102,194,.35),rgba(34,211,238,.15))", border: "1px solid rgba(255,255,255,.06)", marginBottom: 12, display: "flex", alignItems: "flex-end", gap: 6, padding: "0 14px 12px" }}>
        {[38, 52, 46, 64, 58].map((h, i) => (
          <motion.div key={i} initial={{ height: 6 }} animate={{ height: h }} transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            style={{ flex: 1, borderRadius: 4, background: i === 4 ? "#22D3EE" : "rgba(255,255,255,.22)" }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <span>👍❤️💡 Rising with your peers</span><span>Comments · Reposts</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 10, fontSize: 11.5, color: "#94A3B8" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#60A5FA" }}><ThumbsUp size={13} />Like</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MessageSquare size={13} />Comment</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Repeat2 size={13} />Repost</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  // Shared with every section below: switching here switches the whole page.
  const { platform, setPlatform } = usePlatform();
  const copy = PLATFORM_COPY[platform];
  const isLi = platform === "linkedin";
  const pick = (k) => setPlatform(k);

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
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Aurora Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          className="aurora"
          style={{
            position: "absolute",
            top: "10%",
            left: "25%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(59,130,246,0.16),transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="aurora"
          style={{
            position: "absolute",
            top: "55%",
            right: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,211,238,0.11),transparent 70%)",
            filter: "blur(45px)",
            animationDelay: "-9s",
          }}
        />
        <div
          className="aurora"
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(129,140,248,0.09),transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "-16s",
          }}
        />
      </div>

      <div
        className="container"
        style={{
          paddingTop: 90,
          paddingBottom: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* LEFT CONTENT */}
          <div>
            <motion.div {...fadeUp(0.1)}>
              <span className="section-tag">
                <span
                  className="pulse-ring"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22D3EE",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#EAF4FF",
                    letterSpacing: "0.01em",
                  }}
                >
                  For Instagram creators & LinkedIn professionals
                </span>
              </span>
            </motion.div>

            <motion.h1
  {...fadeUp(0.22)}
  style={{
    fontSize: "clamp(2rem,3.6vw,3.5rem)",
    fontWeight: 700,
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    marginBottom: 16,
    maxWidth: 620,
  }}
>
  Most of Your Audience Never Sees Your Posts.
  <br />
  <span className="gradient-text">
    Torque Network Changes That.
  </span>
</motion.h1>

            <motion.div {...fadeUp(0.3)}>
              <PlatformSwitch platform={platform} onPick={pick} />
            </motion.div>

            <div className="hero-body" style={{ maxWidth: 520, marginBottom: 10 }}>
              <AnimatePresence mode="wait">
                <motion.p key={platform}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                  {copy.body}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              {...fadeUp(0.4)}
              style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.6,
                maxWidth: 450,
                marginBottom: 24,
                fontStyle: "italic",
              }}
            >
              Content Creates Potential. Torque Creates Momentum.
            </motion.p>

            {/* CTA */}
            <motion.div
              {...fadeUp(0.46)}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginBottom: 28,
              }}
            >
              <motion.a
                href={copy.href}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 35px rgba(245,158,11,.55)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 34px",
                  borderRadius: 18,
                  background:
                    "linear-gradient(180deg,#FBBF24 0%, #F59E0B 100%)",
                  color: "#0B1120",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  border: "1px solid rgba(255,214,102,.45)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,.05) inset,0 10px 28px rgba(245,158,11,.35)",
                }}
              >
                {copy.cta}
                <ArrowRight size={18} />
              </motion.a>

              <a
                href={copy.ghost.href}
                className="btn-ghost"
                style={{
                  fontSize: 15,
                  padding: "16px 28px",
                }}
              >
                {copy.ghost.label}
              </a>
            </motion.div>

            {/* Avatars */}
            <motion.div
              {...fadeUp(0.56)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div style={{ display: "flex" }}>
                {["#3B82F6", "#22D3EE", "#818CF8", "#F59E0B", "#EC4899"].map(
                  (c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #050816",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        marginLeft: i > 0 ? -11 : 0,
                        zIndex: 5 - i,
                        boxShadow: `0 0 12px ${c}66`,
                      }}
                    >
                      {["SK", "PM", "AK", "RJ", "NV"][i]}
                    </div>
                  )
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#F8FAFC",
                  }}
                >
                  {copy.people}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    marginTop: 2,
                  }}
                >
                  {copy.price}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.3,
              delay: 0.45,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{ position: "relative", height: 540 }}
            className="hero-3d"
          >
            <Suspense
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      border: "2px solid #3B82F6",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin .9s linear infinite",
                    }}
                  />
                </div>
              }
            >
              <NetworkScene />
            </Suspense>

            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 8 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                rotate: [8, 6, 8],
              }}
              transition={{
                opacity: { duration: 1, delay: 0.5 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.04, rotate: 4 }}
              className="hero-phone"
              aria-hidden={isLi}
              style={{
                position: "absolute",
                top: 0,
                right: 50,
                width: "clamp(165px,21vw,235px)",
                zIndex: 11,
                borderRadius: 34,
                padding: 8,
                background: "rgba(13,19,38,.78)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,.08)",
                boxShadow:
                  "0 0 35px rgba(59,130,246,.28),0 0 80px rgba(34,211,238,.12)",
                overflow: "hidden",
                visibility: isLi ? "hidden" : "visible",
              }}
            >
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
                  zIndex: 3,
                }}
              >
                LIVE CREATOR
              </div>

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
                  zIndex: 3,
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
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(5,8,22,.7)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                  zIndex: 5,
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
                  aspectRatio: "9/16",
                  objectFit: "cover",
                  borderRadius: 26,
                  display: "block",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 10,
                  right: 10,
                  padding: "8px 10px",
                  borderRadius: 12,
                  background: "rgba(5,8,22,.65)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#22D3EE",
                    fontWeight: 600,
                  }}
                >
                  Live Creator Showcase
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {isLi && (
                <motion.div key="li-post" className="hero-li-post"
                  initial={{ opacity: 0, y: 24, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 3 }} exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                  style={{ position: "absolute", top: 10, right: 40, width: "clamp(250px,27vw,320px)", zIndex: 11 }}>
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: LI_BLUE, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999, zIndex: 3, whiteSpace: "nowrap" }}>
                    TORQUE FOR LINKEDIN
                  </div>
                  <LinkedInPostMock />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Cards */}
            <div
              className="float-a"
              style={{
                opacity: isLi ? 0 : 1,
                transition: "opacity .4s",
                position: "absolute",
                top: 45,
                right: 0,
                zIndex: 10,
                background: "rgba(13,19,38,.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(34,211,238,.22)",
                borderRadius: 20,
                padding: "16px 20px",
                width: 190,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: isLi ? "linear-gradient(135deg,#0A66C2,#22D3EE)" : "linear-gradient(135deg,#EC4899,#8B5CF6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {isLi ? "P" : "A"}
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "#F8FAFC",
                  }}
                >
                  {isLi ? "Priya S. · HR Lead" : "@aanya.creates"}
                </span>
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: "#22D3EE",
                  marginBottom: 7,
                }}
              >
                {isLi ? "↑ Comments from industry peers" : "↑ 847 engagements · 48 hrs"}
              </div>

              <div
                style={{
                  height: 3,
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: "88%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#3B82F6,#22D3EE)",
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>

            <div
              className="float-c"
              style={{
                position: "absolute",
                bottom: 90,
                left: -10,
                zIndex: 10,
                background: "rgba(13,19,38,.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(59,130,246,.22)",
                borderRadius: 20,
                padding: "16px 20px",
                width: 175,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 6,
                }}
              >
                {isLi ? <Briefcase size={14} color="#60A5FA" /> : <Sparkles size={14} color="#F59E0B" />}
                <span
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    fontWeight: 500,
                  }}
                >
                  {isLi ? "Professional Network" : "Creator Network"}
                </span>
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#F8FAFC",
                }}
              >
                {isLi ? "IT & Software" : "Finance Niche"}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: "#22D3EE",
                  marginTop: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22D3EE",
                    display: "inline-block",
                  }}
                />
                {isLi ? "Peers in your industry" : "512 creators active"}
              </div>
            </div>

            <div
              className="float-b"
              style={{
                position: "absolute",
                top: "40%",
                left: -20,
                zIndex: 10,
                background: "rgba(13,19,38,.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(129,140,248,.2)",
                borderRadius: 16,
                padding: "12px 16px",
                width: 150,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: "#94A3B8",
                  marginBottom: 4,
                }}
              >
                Amplification Active
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#F8FAFC",
                }}
              >
                {isLi ? "Verified professionals" : "1,000 creators"}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: "#818CF8",
                  marginTop: 4,
                }}
              >
                engaging right now
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: "#2D3748",
            letterSpacing: ".18em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>

        <motion.div
          style={{
            width: 1,
            height: 36,
            background: "linear-gradient(to bottom,#3B82F6,transparent)",
          }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <style>{`
        .hero-body{ min-height:130px; }
        .hs-short{ display:none; }
        @media (max-width:520px){ .hs-long{ display:none; } .hs-short{ display:inline; } .hero-switch{ margin-left:auto; margin-right:auto; } }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width:900px){

          .hero-grid{
            grid-template-columns:1fr !important;
            gap:32px !important;
            text-align:center;
          }

          .hero-3d{
            height:320px !important;
          }

          .hero-body{ min-height:210px; }

          .hero-li-post{
            width:250px !important;
            right:8px !important;
            top:0 !important;
          }

          .hero-body{ margin-left:auto; margin-right:auto; }

          .hero-phone{
            width:155px !important;
            top:12px !important;
            right:16px !important;
          }

          .float-a{
            top:130px !important;
            right:0 !important;
          }

          .float-b{
            left:0 !important;
          }

          .float-c{
            left:0 !important;
            bottom:16px !important;
          }

        }
      `}</style>
    </section>
  );
}
