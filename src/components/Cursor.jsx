import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot  = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    const d = dot.current, g = glow.current
    if (!d || !g) return
    let raf
    let tx = 0, ty = 0, gx = 0, gy = 0

    const move = (e) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      gx += (tx - gx) * 0.1; gy += (ty - gy) * 0.1
      d.style.left = tx + 'px'; d.style.top = ty + 'px'
      g.style.left = gx + 'px'; g.style.top  = gy + 'px'
      raf = requestAnimationFrame(loop)
    }
    const expand  = () => d.classList.add('expanded')
    const shrink  = () => d.classList.remove('expanded')

    window.addEventListener('mousemove', move, { passive: true })
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move) }
  }, [])

  return (
    <>
      <div ref={glow} className="cursor-glow" />
      <div ref={dot}  className="cursor-dot" />
    </>
  )
}
