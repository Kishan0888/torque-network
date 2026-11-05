import { useState } from 'react'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { PLATFORM_LABEL } from '../../../shared/memberConfig.js'

const AVATAR = ['#c7d7fb', '#fbc3ac', '#bfe5d3', '#f5dca1', '#dcc9f7']
const ago = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h} h ago`
  if (h < 48) return 'Yesterday'
  return `${Math.floor(h / 24)} days ago`
}

export default function Timeline() {
  const d = useDash()
  const [filter, setFilter] = useState('all')
  const { data, error, loading } = usePlatformData('timeline', `&filter=${encodeURIComponent(filter)}`)
  const label = (f) => (f === 'all' ? 'All' : f === 'domain' ? 'My domain' : f)
  const filters = data?.filters || ['all', 'domain', ...(d.setup?.interests || [])]

  return (
    <>
      <PageHead title="Timeline" subtitle={`Posts from peers in ${d.setup?.domain} and your interests. Engage with the ones that interest you.`} />
      <div className="tn-pills" role="tablist">
        {filters.map((f) => <button key={f} role="tab" aria-selected={filter === f} className={`tn-pill ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{label(f)}</button>)}
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        data.posts.length === 0 ? (
          <div className="tn-card tn-empty">No posts here yet. As peers’ posts are approved they’ll appear here — check back soon.</div>
        ) : (
          <div className="tn-grid">
            {data.posts.map((p, i) => {
              const initials = p.author.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
              const meta = [p.author.role, p.author.experience].filter(Boolean).join(', ')
              return (
                <article key={p.id} className="tn-card" style={{ display: 'flex', gap: 12 }}>
                  <div className="tn-avatar" style={{ background: AVATAR[i % AVATAR.length], color: '#1f2937', width: 36, height: 36 }}>{initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 13 }}><strong>{p.author.name}</strong>{meta && <span className="tn-small"> · {meta}</span>}</div>
                      <span className="tn-small">{ago(p.approved_at)}</span>
                    </div>
                    <p style={{ fontSize: 14, margin: '4px 0 10px', lineHeight: 1.45 }}>{p.summary}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className="tn-tag">{p.topic || p.category}</span>
                      <a className="tn-btn gold small" href={p.url} target="_blank" rel="noopener noreferrer">Open on {PLATFORM_LABEL[d.platform]} ↗</a>
                    </div>
                  </div>
                </article>
              )
            })}
            <p className="tn-small" style={{ textAlign: 'center' }}>Order is shuffled daily so every member’s post gets seen. Engagement happens on {PLATFORM_LABEL[d.platform]}.</p>
          </div>
        )
      )}
    </>
  )
}
