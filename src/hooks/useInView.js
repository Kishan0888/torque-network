import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.12, ...options }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

export function useCounter(end, duration = 2000, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let s = 0
    const step = end / (duration / 16)
    const t = setInterval(() => {
      s = Math.min(s + step, end)
      setCount(Math.floor(s))
      if (s >= end) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [end, duration, started])
  return count
}
