import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import logo from "../assets/logo.jpeg";
const NAV = [
  { label:'Creators',     href:'#creators'      },
  { label:'Brands',       href:'#brands'        },
  { label:'How It Works', href:'#how-it-works'  },
  { label:'Community',    href:'#community'     },
  { label:'FAQ',          href:'#faq'           },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible,  setVisible]  = useState(true)
  const [mob,      setMob]      = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setVisible(y < 80 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.header
        animate={{ y: visible ? 0 : -90 }}
        transition={{ duration: 0.38, ease: [0.23,1,0.32,1] }}
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'12px 24px' }}
      >
        <div style={{
          maxWidth: 1200, margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderRadius:18, padding:'10px 22px',
          background: scrolled ? 'rgba(5,8,22,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          border: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          transition: 'all 0.4s ease',
        }}>
          <a href="#" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
  <img
    src={logo}
    alt="Torque Network"
    style={{
      height: 42,
      width: "auto",
      objectFit: "contain",
      filter: "drop-shadow(0 0 14px rgba(59,130,246,0.35))",
      transition: "transform 0.3s ease, filter 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.filter =
        "drop-shadow(0 0 20px rgba(34,211,238,0.55))";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.filter =
        "drop-shadow(0 0 14px rgba(59,130,246,0.35))";
    }}
  />
</a>
          <nav className="nav-links">
            {NAV.map(l => (
              <a key={l.label} href={l.href} style={{ fontSize:13.5, color:'#64748B', textDecoration:'none', fontWeight:500, transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='#F8FAFC'}
                onMouseLeave={e=>e.target.style.color='#64748B'}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-cta">
            <motion.a href="#community" className="btn-primary"
              style={{ fontSize:13, padding:'10px 22px', borderRadius:11 }}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              Join Community
            </motion.a>
          </div>

          <button className="nav-burger"
            onClick={() => setMob(!mob)}
            style={{ background:'none', border:'none', color:'#F8FAFC', cursor:'pointer', padding:4 }}>
            {mob ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        <AnimatePresence>
          {mob && (
            <motion.div
              initial={{ opacity:0, y:-14, scaleY:0.94 }}
              animate={{ opacity:1, y:0, scaleY:1 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.25 }}
              style={{
                margin:'8px 24px 0', borderRadius:18,
                background:'rgba(5,8,22,0.96)', backdropFilter:'blur(28px)',
                border:'1px solid rgba(255,255,255,0.08)', padding:'20px 24px',
                transformOrigin:'top center',
              }}>
              {NAV.map((l,i) => (
                <a key={l.label} href={l.href} onClick={()=>setMob(false)}
                  style={{
                    display:'block', padding:'13px 0', color:'#94A3B8', fontSize:15,
                    textDecoration:'none',
                    borderBottom: i < NAV.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition:'color 0.2s',
                  }}
                  onMouseEnter={e=>e.target.style.color='#F8FAFC'}
                  onMouseLeave={e=>e.target.style.color='#94A3B8'}>
                  {l.label}
                </a>
              ))}
              <a href="#community" onClick={()=>setMob(false)} className="btn-primary"
                style={{ display:'block', textAlign:'center', marginTop:16, borderRadius:12 }}>
                Join Community
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style>{`
        .nav-links { display:flex; gap:32px; }
        .nav-cta   { display:block; }
        .nav-burger{ display:none; }
        @media(max-width:900px){
          .nav-links,.nav-cta{ display:none; }
          .nav-burger{ display:block; }
        }
      `}</style>
    </>
  )
}
