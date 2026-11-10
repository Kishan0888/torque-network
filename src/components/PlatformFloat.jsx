import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlatform } from '../context/PlatformContext'
import { InstagramGlyph, LinkedInGlyph } from './BrandGlyphs'

/**
 * Small pill pinned to the bottom of the screen once the hero is out of view,
 * so visitors deep in the page can still switch between Instagram and LinkedIn.
 * Hidden again near pricing / the form / footer to stay out of the way.
 */
export default function PlatformFloat() {
  const { platform, setPlatform } = usePlatform()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.85
      const stop = document.getElementById('pricing')
      const before = !stop || stop.getBoundingClientRect().top > window.innerHeight * 0.6
      setShow(past && before)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  const opts = [
    ['instagram', 'Instagram', InstagramGlyph, 'linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)'],
    ['linkedin', 'LinkedIn', LinkedInGlyph, 'linear-gradient(135deg,#0A66C2,#2D8CFF)'],
  ]
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          role="tablist" aria-label="Show the page for"
          className="pf-wrap"
          style={{
            position: 'fixed', left: '50%', bottom: 18, zIndex: 60, display: 'flex', alignItems: 'center', gap: 4,
            padding: 5, borderRadius: 999, background: 'rgba(8,12,28,0.88)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
          }}>
          <span className="pf-label" style={{ fontSize: 12, color: '#64748B', fontWeight: 600, padding: '0 8px 0 12px', whiteSpace: 'nowrap' }}>Showing</span>
          {opts.map(([k, label, Glyph, bg]) => {
            const on = platform === k
            return (
              <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setPlatform(k)}
                style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 999, border: 'none', background: 'transparent', color: on ? '#fff' : '#94A3B8', fontWeight: 650, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {on && <motion.span layoutId="pf-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: bg }} />}
                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7 }}><Glyph size={14} /> {label}</span>
              </button>
            )
          })}
          <style>{`@media(max-width:400px){.pf-label{display:none}}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
