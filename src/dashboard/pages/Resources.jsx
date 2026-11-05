import { useState } from 'react'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { youtubeId, PLATFORM_LABEL } from '../../../shared/memberConfig.js'

const COLORS = ['#2f6fe0', '#e5582b', '#14875f', '#7048d6', '#b4781f', '#0f1a2e']

export default function Resources() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('resources')
  const [playing, setPlaying] = useState(null)
  return (
    <>
      <PageHead title={`Resources: ${PLATFORM_LABEL[d.platform]} growth playbook`} subtitle="Short videos. Watch them in order in your first week." />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        data.resources.length === 0 ? <div className="tn-card tn-empty">The playbook videos are being added. Check back soon.</div> : (
          <div className="tn-grid tn-grid-3">
            {data.resources.map((r, i) => {
              const id = youtubeId(r.youtube_url)
              return (
                <button key={r.id} className="tn-video" onClick={() => setPlaying(r)} aria-label={`Play: ${r.title}`}>
                  <div className="tn-video-thumb" style={{ background: COLORS[i % COLORS.length] }}>
                    {id && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
                    <span className="tn-play"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 1.5v11l9-5.5z" fill={COLORS[i % COLORS.length]} /></svg></span>
                  </div>
                  <div className="tn-video-meta">Video {i + 1}{r.duration ? ` · ${r.duration}` : ''}</div>
                  <div className="tn-video-title">{r.title}</div>
                </button>
              )
            })}
          </div>
        )
      )}
      {playing && (
        <div className="tn-modal-bg" onClick={() => setPlaying(null)}>
          <div className="tn-modal wide" role="dialog" aria-modal="true" aria-label={playing.title} onClick={(e) => e.stopPropagation()}>
            <div className="tn-modal-head"><h2>{playing.title}</h2><button className="tn-x" onClick={() => setPlaying(null)} aria-label="Close">×</button></div>
            <div className="tn-embed">
              <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId(playing.youtube_url)}?autoplay=1&rel=0`} title={playing.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
