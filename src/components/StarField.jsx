import { useMemo } from 'react'

const STAR_DATA = Array.from({ length: 70 }, (_, i) => ({
  cx: `${(i * 137.508) % 100}%`,
  cy: `${(i * 61.803) % 100}%`,
  r: i % 5 === 0 ? 1.3 : i % 3 === 0 ? 0.8 : 0.5,
  fill: ['#22D3EE','#3B82F6','#818CF8','#ffffff'][i % 4],
  duration: 2 + (i % 4),
  delay: (i * 0.3) % 5,
}))

export default function StarField() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Drifting aurora layers */}
      <div className="aurora" style={{
        position: 'absolute', top: '-15%', left: '-5%',
        width: '65vw', height: '65vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.045), transparent 65%)',
        filter: 'blur(90px)',
      }} />
      <div className="aurora" style={{
        position: 'absolute', bottom: '5%', right: '-10%',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.03), transparent 65%)',
        filter: 'blur(80px)', animationDelay: '-11s',
      }} />
      <div className="aurora" style={{
        position: 'absolute', top: '40%', left: '40%',
        width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.025), transparent 65%)',
        filter: 'blur(70px)', animationDelay: '-6s',
      }} />

      {/* Static star field */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
        {STAR_DATA.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill}
            style={{
              animation: `star-twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }} />
        ))}
      </svg>

      {/* Dust particles — very subtle */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        {Array.from({ length: 25 }, (_, i) => ({
          cx: `${(i * 97.4) % 100}%`,
          cy: `${(i * 53.2) % 100}%`,
        })).map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r="1" fill="#22D3EE"
            style={{ animation: `beam-pulse ${3 + i % 3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </svg>
    </div>
  )
}
