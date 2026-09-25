import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'The Problem', href: '#creators' },
  { label: 'What is Torque?', href: '#what-is-torque' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [mob, setMob] = useState(false)
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
        transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '10px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 18,
            padding: '10px 24px',
            background: scrolled
              ? 'linear-gradient(135deg, rgba(2,8,30,.96), rgba(4,12,40,.94))'
              : 'rgba(2,6,24,.72)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: scrolled
              ? '1px solid rgba(59,130,246,.22)'
              : '1px solid rgba(59,130,246,.12)',
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,.6), inset 0 1px 0 rgba(59,130,246,.1)'
              : 'none',
            transition: 'all .4s ease',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Torque Network"
              style={{
                height: 54,
                width: 'auto',
                objectFit: 'contain',
                filter:
                  'brightness(1.1) saturate(1.2) drop-shadow(0 0 10px rgba(59,130,246,.55))',
                transition: 'filter .3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter =
                  'brightness(1.25) saturate(1.4) drop-shadow(0 0 18px rgba(34,211,238,.7))')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter =
                  'brightness(1.1) saturate(1.2) drop-shadow(0 0 10px rgba(59,130,246,.55))')
              }
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#C8D3E5',
                  textDecoration: 'none',
                  transition: 'all .25s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fff'
                  e.target.style.textShadow =
                    '0 0 16px rgba(34,211,238,.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#C8D3E5'
                  e.target.style.textShadow = 'none'
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="nav-cta">
            <motion.a
              href="#community"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 35px rgba(245,158,11,.6)',
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 30px',
                borderRadius: 14,
                textDecoration: 'none',
                background:
                  'linear-gradient(180deg,#FBBF24 0%, #F59E0B 100%)',
                color: '#0B1120',
                fontWeight: 800,
                fontSize: 16,
                border: '1px solid rgba(255,214,102,.45)',
                boxShadow: '0 10px 28px rgba(245,158,11,.35)',
              }}
            >
              Claim Your Spot
            </motion.a>
          </div>

          {/* Mobile Burger */}
          <button
            className="nav-burger"
            onClick={() => setMob(!mob)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            {mob ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mob && (
            <motion.div
              initial={{ opacity: 0, y: -14, scaleY: 0.94 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{
                margin: '8px 24px 0',
                borderRadius: 18,
                background:
                  'linear-gradient(135deg,rgba(2,8,30,.98),rgba(4,12,40,.97))',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(59,130,246,.2)',
                padding: '18px 24px',
                transformOrigin: 'top center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: 18,
                  borderBottom: '1px solid rgba(255,255,255,.06)',
                  marginBottom: 8,
                }}
              >
                <img
                  src="/logo.png"
                  alt="Torque Network"
                  style={{
                    height: 46,
                    filter:
                      'brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(59,130,246,.5))',
                  }}
                />
              </div>

              {NAV.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMob(false)}
                  style={{
                    display: 'block',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#C8D3E5',
                    textDecoration: 'none',
                    borderBottom:
                      index < NAV.length - 1
                        ? '1px solid rgba(255,255,255,.05)'
                        : 'none',
                  }}
                >
                  {item.label}
                </a>
              ))}

              <motion.a
                href="#community"
                onClick={() => setMob(false)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: 18,
                  borderRadius: 14,
                  padding: '15px 24px',
                  background:
                    'linear-gradient(180deg,#FBBF24,#F59E0B)',
                  color: '#0B1120',
                  fontWeight: 800,
                  fontSize: 15,
                  textDecoration: 'none',
                }}
              >
                Claim Your Spot
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style>{`
        .nav-links{
          display:flex;
          gap:24px;
          align-items:center;
        }

        .nav-cta{
          display:block;
        }

        .nav-burger{
          display:none;
        }

        @media(max-width:1080px){
          .nav-links{
            gap:18px;
          }

          .nav-links a{
            font-size:14px !important;
          }
        }

        @media(max-width:900px){
          .nav-links,
          .nav-cta{
            display:none;
          }

          .nav-burger{
            display:block;
          }
        }
      `}</style>
    </>
  )
}