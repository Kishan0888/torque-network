import { useState } from 'react'
import { Link } from '../../lib/router'
import { apiFetch } from '../../lib/api'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { CHECKLIST, PLATFORM_FEATURES } from '../../../shared/memberConfig.js'

export default function Home() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('home')
  const first = (d.user.name || '').split(' ')[0]
  const hour = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }))
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const monthName = new Date().toLocaleDateString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' })

  return (
    <>
      <PageHead title={`${greeting}, ${first}`} subtitle={data ? `Here is your plan for this week (${data.week.label})` : 'Here is your plan for this week'} />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        <>
          <div className="tn-grid tn-grid-3" style={{ marginBottom: 14 }}>
            <div className="tn-card dark">
              <div className="tn-stat-label">Posts submitted this week</div>
              <div className="tn-stat gold">{data.week.used} / {data.week.limit}</div>
              <div className="tn-small">
                {data.week.used >= data.week.limit ? 'All slots used — new ones open Monday'
                  : `${data.week.limit - data.week.used} more slot${data.week.limit - data.week.used === 1 ? '' : 's'} left this week`}
              </div>
            </div>
            <Link to="/dashboard/timeline" className="tn-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="tn-stat-label">New in Member Posts</div>
              <div className="tn-stat">{data.timelineNew} post{data.timelineNew === 1 ? '' : 's'}</div>
              <div className="tn-small">from {d.setup?.domain || 'your'} peers this week</div>
            </Link>
            {PLATFORM_FEATURES[d.platform].guide ? (
              <div className="tn-card">
                <div className="tn-stat-label">This month’s guide</div>
                <div style={{ fontSize: 18, fontWeight: 800, margin: '6px 0 4px' }}>{monthName} content plan</div>
                {data.guide ? <Link to="/dashboard/guide" className="tn-link">Open guide →</Link> : <span className="tn-small">Coming soon</span>}
              </div>
            ) : (
              <Link to="/dashboard/timeline" className="tn-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="tn-stat-label">Waiting for your engagement</div>
                <div className="tn-stat orange">{data.toEngage ?? 0} post{data.toEngage === 1 ? '' : 's'}</div>
                <div className="tn-small">Support your peers, then mark them done</div>
              </Link>
            )}
          </div>

          <Checklist spotlight={data.spotlight} />
        </>
      )}
    </>
  )
}

function Checklist({ spotlight }) {
  const d = useDash()
  const [done, setDone] = useState(d.setup?.checklist || {})
  async function toggle(key) {
    const next = !done[key]
    setDone((c) => ({ ...c, [key]: next }))
    try {
      await apiFetch('/api/dashboard?action=checklist', { method: 'POST', body: { platform: d.platform, key, done: next } })
    } catch {
      setDone((c) => ({ ...c, [key]: !next }))
    }
  }
  return (
    <div className="tn-card">
      <h2>Profile checklist</h2>
      {CHECKLIST[d.platform].map(([key, label]) => (
        <label key={key} className={`tn-check ${done[key] ? 'done' : ''}`}>
          <input type="checkbox" checked={Boolean(done[key])} onChange={() => toggle(key)} /> <span>{label}</span>
        </label>
      ))}
      {spotlight && (
        <div className="tn-card amber" style={{ marginTop: 12, padding: '10px 12px', fontSize: 13 }}>
          <strong>Spotlight:</strong> {spotlight.name}{spotlight.domain ? ` from ${spotlight.domain}` : ''} {spotlight.summary ? <> — “{spotlight.summary}”</> : null}{' '}
          <a href={spotlight.url} target="_blank" rel="noopener noreferrer" className="tn-link">View ↗</a>
        </div>
      )}
    </div>
  )
}
