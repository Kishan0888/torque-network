import { useState } from 'react'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { youtubeId, PLATFORM_LABEL } from '../../../shared/memberConfig.js'
import { apiFetch } from '../../lib/api'

const COLORS = ['#2f6fe0', '#e5582b', '#14875f', '#7048d6', '#b4781f', '#0f1a2e']

/** A 5-minute signed link to a playbook PDF (members only; the file is not public). */
async function pdfLink(id, download) {
  const { url } = await apiFetch(`/api/dashboard?action=playbook-link&id=${encodeURIComponent(id)}${download ? '&download=1' : ''}`)
  return url
}

function PdfCard({ r, n, onError }) {
  const [busy, setBusy] = useState('')
  async function open() {
    // Open the tab straight away (inside the click) so pop-up blockers allow it.
    const tab = window.open('', '_blank')
    setBusy('open')
    try {
      const url = await pdfLink(r.id)
      if (tab) tab.location.href = url
      else window.location.href = url
    } catch (e) { tab?.close(); onError(e.message) } finally { setBusy('') }
  }
  async function download() {
    setBusy('download')
    try {
      // The server answers with "attachment", so this saves the file without leaving the page.
      window.location.href = await pdfLink(r.id, true)
    } catch (e) { onError(e.message) } finally { setBusy('') }
  }
  const week = r.title.match(/^Week\s*(\d+)/i)?.[1]
  const title = r.title.replace(/^Week\s*\d+\s*[:–-]\s*/i, '')
  return (
    <div className="tn-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div aria-hidden style={{ width: 40, height: 48, borderRadius: 6, background: COLORS[n % COLORS.length], color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.06em', opacity: 0.85 }}>{week ? 'WEEK' : 'PDF'}</span>
          {week && <span style={{ fontSize: 17, fontWeight: 800 }}>{String(week).padStart(2, '0')}</span>}
        </div>
        <div style={{ fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button type="button" className="tn-btn gold small" onClick={open} disabled={Boolean(busy)}>{busy === 'open' ? 'Opening…' : 'Open PDF'}</button>
        <button type="button" className="tn-btn small" onClick={download} disabled={Boolean(busy)}>{busy === 'download' ? 'Downloading…' : 'Download'}</button>
      </div>
    </div>
  )
}

export default function Resources() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('resources')
  const [playing, setPlaying] = useState(null)
  const [fileError, setFileError] = useState('')
  const pdfs = data?.resources.filter((r) => r.pdf) || []
  const videos = data?.resources.filter((r) => !r.pdf) || []
  return (
    <>
      <PageHead title={`Resources: ${PLATFORM_LABEL[d.platform]} growth playbook`}
        subtitle={pdfs.length ? `Weekly worksheets${videos.length ? ' and short videos' : ''}. Work through them in order, one week at a time.` : 'Short videos. Watch them in order in your first week.'} />
      {error && <Notice tone="error">{error}</Notice>}
      {fileError && <Notice tone="error">{fileError}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        data.resources.length === 0 ? <div className="tn-card tn-empty">The playbook videos are being added. Check back soon.</div> : (
          <>
            {pdfs.length > 0 && (
              <section style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 16, margin: '0 0 10px' }}>Weekly worksheets</h2>
                <div className="tn-grid tn-grid-3">
                  {pdfs.map((r, i) => <PdfCard key={r.id} r={r} n={i} onError={setFileError} />)}
                </div>
              </section>
            )}
            {videos.length > 0 && (
              <section>
                {pdfs.length > 0 && <h2 style={{ fontSize: 16, margin: '0 0 10px' }}>Videos</h2>}
                <div className="tn-grid tn-grid-3">
                  {videos.map((r, i) => {
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
              </section>
            )}
          </>
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
