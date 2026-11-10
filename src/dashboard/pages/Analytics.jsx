import { useState } from 'react'
import { Link } from '../../lib/router'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { PLATFORM_LABEL, postTitle } from '../../../shared/memberConfig.js'

const AVATAR = ['#c7d7fb', '#fbc3ac', '#bfe5d3', '#f5dca1', '#dcc9f7']
const initialsOf = (name) => (name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })

function Stat({ label, value, tone, sub }) {
  return (
    <div className="tn-card">
      <div className="tn-stat-label">{label}</div>
      <div className={`tn-stat ${tone || ''}`}>{value}</div>
      {sub && <div className="tn-small">{sub}</div>}
    </div>
  )
}

function Faces({ people }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">
      {people.slice(0, 6).map((p, i) => (
        <span key={p.id} className="tn-avatar" style={{ width: 28, height: 28, fontSize: 10, background: AVATAR[i % AVATAR.length], color: '#1f2937', border: '2px solid #fff', marginLeft: i ? -8 : 0 }}>{initialsOf(p.name)}</span>
      ))}
      {people.length > 6 && <span className="tn-small" style={{ marginLeft: 6 }}>+{people.length - 6}</span>}
    </div>
  )
}

function MyPost({ post }) {
  const [open, setOpen] = useState(false)
  const n = post.engagers.length
  return (
    <div className="tn-row" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #eee6d6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 260px' }}>
          <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>{postTitle(post)} ↗</a>
          <div className="tn-small">Live since {fmt(post.approved_at)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {n > 0 && <Faces people={post.engagers} />}
          <span className={`tn-badge ${n ? 'live' : 'neutral'}`} style={{ whiteSpace: 'nowrap' }}>{n} member{n === 1 ? '' : 's'} engaged</span>
          {n > 0 && <button type="button" className="tn-link" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide' : 'See who'}</button>}
        </div>
      </div>
      {open && (
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gap: 6 }}>
          {post.engagers.map((p, i) => (
            <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span className="tn-avatar" style={{ width: 26, height: 26, fontSize: 10, background: AVATAR[i % AVATAR.length], color: '#1f2937' }}>{initialsOf(p.name)}</span>
              <span><strong>{p.name}</strong>{[p.role, p.domain].filter(Boolean).length ? <span className="tn-small"> · {[p.role, p.domain].filter(Boolean).join(' · ')}</span> : null}</span>
              <span className="tn-small" style={{ marginLeft: 'auto' }}>{fmt(p.at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PeerList({ items, empty, where, action }) {
  if (!items.length) return <p className="tn-small" style={{ margin: '6px 0 0' }}>{empty}</p>
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.slice(0, 50).map((p, i) => (
        <li key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee6d6' }}>
          <span className="tn-avatar" style={{ width: 30, height: 30, fontSize: 11, background: AVATAR[i % AVATAR.length], color: '#1f2937' }}>{initialsOf(p.author.name)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13 }}><strong>{p.author.name}</strong>{p.author.role ? <span className="tn-small"> · {p.author.role}</span> : null}</div>
            <div className="tn-small" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{postTitle(p)}</div>
          </div>
          <a className="tn-link" href={p.url} target="_blank" rel="noopener noreferrer" style={{ whiteSpace: 'nowrap' }}>{action || `Open on ${where} ↗`}</a>
        </li>
      ))}
    </ul>
  )
}

export default function Analytics() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('analytics')
  const where = PLATFORM_LABEL[d.platform]
  const [tab, setTab] = useState('todo')

  return (
    <>
      <PageHead title="Analytics" subtitle="Who from the Torque community engaged with your posts, and how you are supporting theirs." />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        <>
          <div className="tn-grid tn-grid-3" style={{ marginBottom: 14 }}>
            <Stat label="Engagements on your posts" value={data.totals.received} tone="gold" sub={`across ${data.totals.livePosts} live post${data.totals.livePosts === 1 ? '' : 's'}`} />
            <Stat label="Members who engaged with you" value={data.totals.uniqueEngagers} tone="green" sub="different people from the community" />
            <Stat label="Posts you engaged with" value={data.totals.given} tone="orange"
              sub={`${data.totals.feedTodo} still waiting in Member Posts`} />
          </div>

          <div className="tn-card" style={{ marginBottom: 14 }}>
            <h2>Engagement on your posts</h2>
            {data.myPosts.length === 0 ? (
              <p className="tn-small">No live posts yet. <Link to="/dashboard/submit" className="tn-link">Submit a post →</Link> Once it is approved, you will see here who engaged with it.</p>
            ) : data.myPosts.map((p) => <MyPost key={p.id} post={p} />)}
          </div>

          <div className="tn-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h2 style={{ margin: 0 }}>Your engagement on members’ posts</h2>
              <span className="tn-small">Last {data.windowDays} days</span>
            </div>
            <div className="tn-pills" role="tablist" style={{ margin: '8px 0 4px' }}>
              <button role="tab" aria-selected={tab === 'todo'} className={`tn-pill ${tab === 'todo' ? 'on' : ''}`} onClick={() => setTab('todo')}>Not engaged yet ({data.notEngaged.length})</button>
              <button role="tab" aria-selected={tab === 'done'} className={`tn-pill ${tab === 'done' ? 'on' : ''}`} onClick={() => setTab('done')}>Engaged ({data.engaged.length})</button>
            </div>
            {tab === 'todo'
              ? <PeerList items={data.notEngaged} where={where} empty="You’ve engaged with every post in your feed 🎉" />
              : <PeerList items={data.engaged} where={where} empty="Nothing yet. Engage with a post and mark it in Member Posts." />}
            {tab === 'todo' && data.notEngaged.length > 0 && (
              <div style={{ marginTop: 12 }}><Link to="/dashboard/timeline" className="tn-btn gold small">Go to Member Posts to engage →</Link></div>
            )}
          </div>

          <p className="tn-small" style={{ marginTop: 12 }}>
            {where} doesn’t share who reacted to a post with outside apps, so these numbers come from members marking posts as engaged in Member Posts.
          </p>
        </>
      )}
    </>
  )
}
