import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label:'Creators',     href:'#creators'     },
  { label:'Brands',       href:'#brands'       },
  { label:'How It Works', href:'#how-it-works' },
  { label:'Community',    href:'#community'    },
  { label:'FAQ',          href:'#faq'          },
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
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'10px 24px' }}
      >
        <div style={{
          maxWidth: 1200, margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderRadius:18, padding:'8px 20px',
          /* When scrolled: deep navy with blue-tinted glass so the blue logo pops */
          background: scrolled
            ? 'linear-gradient(135deg, rgba(2,8,30,0.96) 0%, rgba(4,12,40,0.94) 100%)'
            : 'rgba(2,6,24,0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: scrolled
            ? '1px solid rgba(59,130,246,0.22)'
            : '1px solid rgba(59,130,246,0.1)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(59,130,246,0.1)' : 'none',
          transition: 'all 0.4s ease',
        }}>

          {/* Logo */}
          <a href="#" style={{ display:'flex', alignItems:'center', gap:0, textDecoration:'none', flexShrink:0 }}>
            <img
              src="/logo.png"
              alt="Torque Network"
              style={{
                height: 52,
                width: 'auto',
                objectFit: 'contain',
                /* Boost the blue/teal on the dark bg — filter keeps white logo areas bright */
                filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 0 10px rgba(59,130,246,0.55))',
                transition: 'filter 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.25) saturate(1.4) drop-shadow(0 0 18px rgba(34,211,238,0.7))'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1.1) saturate(1.2) drop-shadow(0 0 10px rgba(59,130,246,0.55))'}
            />
          </a>

          {/* Desktop nav */}
          <nav className="nav-links">
            {NAV.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontSize:13.5, color:'#94A3B8', textDecoration:'none', fontWeight:500, transition:'color 0.2s, text-shadow 0.2s' }}
                onMouseEnter={e => { e.target.style.color='#F8FAFC'; e.target.style.textShadow='0 0 16px rgba(34,211,238,0.5)' }}
                onMouseLeave={e => { e.target.style.color='#94A3B8'; e.target.style.textShadow='none' }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="nav-cta">
            <motion.a href="#community"
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                fontSize:13, padding:'10px 22px', borderRadius:11, textDecoration:'none',
                background:'linear-gradient(135deg,#D97706,#F59E0B)',
                color:'#fff', fontWeight:700,
                boxShadow:'0 0 20px rgba(245,158,11,0.35)',
              }}
              whileHover={{ scale:1.04, boxShadow:'0 0 36px rgba(245,158,11,0.6)' }}
              whileTap={{ scale:0.97 }}>
              Join Free
            </motion.a>
          </div>

          {/* Mobile burger */}
          <button className="nav-burger"
            onClick={() => setMob(!mob)}
            style={{ background:'none', border:'none', color:'#F8FAFC', cursor:'pointer', padding:4 }}>
            {mob ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mob && (
            <motion.div
              initial={{ opacity:0, y:-14, scaleY:0.94 }}
              animate={{ opacity:1, y:0, scaleY:1 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.25 }}
              style={{
                margin:'8px 24px 0', borderRadius:18,
                background:'linear-gradient(135deg,rgba(2,8,30,0.98),rgba(4,12,40,0.97))',
                backdropFilter:'blur(32px)',
                border:'1px solid rgba(59,130,246,0.2)', padding:'16px 24px',
                transformOrigin:'top center',
              }}>
              {/* Logo in mobile menu */}
              <div style={{ display:'flex', justifyContent:'center', paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:8 }}>
                <img src="/logo.png" alt="Torque Network" style={{ height:44, filter:'brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(59,130,246,0.5))' }}/>
              </div>
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
              <a href="#community" onClick={()=>setMob(false)}
                style={{
                  display:'block', textAlign:'center', marginTop:16, borderRadius:12,
                  padding:'14px 24px', background:'linear-gradient(135deg,#D97706,#F59E0B)',
                  color:'#fff', fontWeight:700, textDecoration:'none', fontSize:14,
                }}>
                Join Founding 500 — Free
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
