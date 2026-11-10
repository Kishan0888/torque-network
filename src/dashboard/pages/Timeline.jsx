import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { PLATFORM_LABEL, postTitle } from '../../../shared/memberConfig.js'

const AVATAR = ['#c7d7fb', '#fbc3ac', '#bfe5d3', '#f5dca1', '#dcc9f7']
const ago = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h} h ago`
  if (h < 48) return 'Yesterday'
  return `${Math.floor(h / 24)} days ago`
}
const initialsOf = (name) => (name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

/** "Member Posts": peers' approved posts, split into ones you still need to engage with and ones you have. */
export default function Timeline() {
  const d = useDash()
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('todo')
  const { data, error, loading, reload } = usePlatformData('timeline', `&filter=${encodeURIComponent(filter)}&view=${view}`)
  const [posts, setPosts] = useState([])
  const [counts, setCounts] = useState(null)
  const [busy, setBusy] = useState(null)
  const [msg, setMsg] = useState('')
  useEffect(() => { if (data) { setPosts(data.posts); setCounts(data.counts) } }, [data])

  const label = (f) => (f === 'all' ? 'Everyone' : f === 'domain' ? 'My domain' : f)
  const filters = data?.filters || ['all', 'domain', ...(d.setup?.interests || [])]
  const where = PLATFORM_LABEL[d.platform]

  async function toggle(p) {
    const next = !p.engaged
    setBusy(p.id); setMsg('')
    try {
      await apiFetch('/api/dashboard?action=engage', { method: 'POST', body: { post_id: p.id, engaged: next } })
      setPosts((list) => list.map((x) => (x.id === p.id ? { ...x, engaged: next } : x)))
      setCounts((c) => c && ({ ...c, todo: c.todo + (next ? -1 : 1), done: c.done + (next ? 1 : -1) }))
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(null)
    }
  }

  const tabs = [['todo', 'To engage', counts?.todo], ['done', 'Engaged', counts?.done], ['all', 'All', counts?.all]]
  return (
    <>
      <PageHead title="Member Posts" subtitle={`Posts from peers in ${d.setup?.domain || 'your community'}. Engage on ${where}, then tap “Mark as engaged” so they can see your support.`} />

      <div className="tn-pills" role="tablist" aria-label="Engagement" style={{ marginBottom: 8 }}>
        {tabs.map(([k, l, n]) => (
          <button key={k} role="tab" aria-selected={view === k} className={`tn-pill ${view === k ? 'on' : ''}`} onClick={() => setView(k)}>
            {l}{typeof n === 'number' ? ` (${n})` : ''}
          </button>
        ))}
      </div>
      {filters.length > 2 || d.setup?.domain ? (
        <div className="tn-pills" role="tablist" aria-label="Filter" style={{ opacity: 0.9 }}>
          {filters.map((f) => <button key={f} role="tab" aria-selected={filter === f} className={`tn-pill ${filter === f ? 'on' : ''}`} style={{ fontSize: 12, padding: '5px 11px' }} onClick={() => setFilter(f)}>{label(f)}</button>)}
        </div>
      ) : null}

      {error && <Notice tone="error">{error}</Notice>}
      {msg && <Notice tone="error">{msg}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        posts.length === 0 ? (
          <div className="tn-card tn-empty">
            {view === 'todo' ? <>You’re all caught up 🎉 New posts from your peers will appear here.</>
              : view === 'done' ? <>You haven’t marked any posts as engaged yet. Open a post, react or comment on {where}, then mark it here.</>
              : <>No posts here yet. As peers’ posts are approved they’ll appear here — check back soon.</>}
          </div>
        ) : (
          <div className="tn-grid">
            {posts.map((p, i) => {
              const meta = [p.author.role, p.author.experience].filter(Boolean).join(', ')
              return (
                <article key={p.id} className="tn-card" style={{ display: 'flex', gap: 12, opacity: view === 'todo' && p.engaged ? 0.6 : 1 }}>
                  <div className="tn-avatar" style={{ background: AVATAR[i % AVATAR.length], color: '#1f2937', width: 36, height: 36 }}>{initialsOf(p.author.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 13 }}><strong>{p.author.name}</strong>{meta && <span className="tn-small"> · {meta}</span>}</div>
                      <span className="tn-small">{ago(p.approved_at)}</span>
                    </div>
                    <p style={{ fontSize: 14, margin: '4px 0 10px', lineHeight: 1.45 }}>{postTitle(p)}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      {(p.topic || p.category || p.domain) ? <span className="tn-tag">{p.topic || p.category || p.domain}</span> : <span />}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <a className="tn-btn small" href={p.url} target="_blank" rel="noopener noreferrer">Open on {where} ↗</a>
                        <button type="button" className={`tn-btn small ${p.engaged ? 'green' : 'gold'}`} disabled={busy === p.id} onClick={() => toggle(p)}
                          title={p.engaged ? 'Tap to undo' : 'Tap after you have reacted or commented'}>
                          {busy === p.id ? 'Saving…' : p.engaged ? '✓ Engaged' : 'Mark as engaged'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
            <p className="tn-small" style={{ textAlign: 'center' }}>
              Showing posts from the last 30 days. Order is shuffled daily so every member’s post gets seen.{' '}
              {view !== 'todo' && <button type="button" className="tn-link" onClick={reload}>Refresh</button>}
            </p>
          </div>
        )
      )}
    </>
  )
}
