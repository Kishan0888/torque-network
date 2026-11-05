import { useState } from 'react'
import { Link } from '../../lib/router'
import { apiFetch } from '../../lib/api'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { weeklyIdeas } from '../ideas'
import { CHECKLIST } from '../../../shared/memberConfig.js'

const NUM_COLORS = ['#f7b93e', '#f6ab92', '#bfd3f6']

export default function Home() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('home')
  const [template, setTemplate] = useState(null)
  const first = (d.user.name || '').split(' ')[0]
  const hour = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }))
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const ideas = weeklyIdeas(d.platform, d.setup?.domain)
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
              <div className="tn-stat-label">New in your timeline</div>
              <div className="tn-stat">{data.timelineNew} post{data.timelineNew === 1 ? '' : 's'}</div>
              <div className="tn-small">from {d.setup?.domain || 'your'} peers this week</div>
            </Link>
            <div className="tn-card">
              <div className="tn-stat-label">This month’s guide</div>
              <div style={{ fontSize: 18, fontWeight: 800, margin: '6px 0 4px' }}>{monthName} content plan</div>
              {data.guide ? <Link to="/dashboard/guide" className="tn-link">Open guide →</Link> : <span className="tn-small">Coming soon</span>}
            </div>
          </div>

          <div className="tn-grid tn-grid-2-1">
            <div className="tn-card">
              <h2>This week’s post ideas for {d.setup?.domain}</h2>
              {ideas.map((idea, i) => (
                <div key={idea.title} className="tn-row">
                  <span className="tn-num" style={{ background: NUM_COLORS[i] }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{idea.title}</div>
                    <div className="tn-small">{idea.format}</div>
                  </div>
                  <button className="tn-btn small" onClick={() => setTemplate(idea)}>Use template</button>
                </div>
              ))}
            </div>
            <Checklist spotlight={data.spotlight} />
          </div>
        </>
      )}
      {template && <TemplateModal idea={template} onClose={() => setTemplate(null)} />}
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
          <strong>Spotlight:</strong> {spotlight.name}{spotlight.domain ? ` from ${spotlight.domain}` : ''} — “{spotlight.summary}”{' '}
          <a href={spotlight.url} target="_blank" rel="noopener noreferrer" className="tn-link">View ↗</a>
        </div>
      )}
    </div>
  )
}

function TemplateModal({ idea, onClose }) {
  const d = useDash()
  const [copied, setCopied] = useState(false)
  const text = idea.template.replaceAll('[domain]', d.setup?.domain || '[domain]').replaceAll('[niche]', d.setup?.domain || '[niche]')
  return (
    <div className="tn-modal-bg" onClick={onClose}>
      <div className="tn-modal" role="dialog" aria-modal="true" aria-label={idea.title} onClick={(e) => e.stopPropagation()}>
        <div className="tn-modal-head"><h2>{idea.title}</h2><button className="tn-x" onClick={onClose} aria-label="Close">×</button></div>
        <p className="tn-small" style={{ marginTop: -6, marginBottom: 10 }}>{idea.format}. Replace the [brackets] with your own details.</p>
        <textarea className="tn-textarea" readOnly value={text} rows={12} style={{ fontSize: 13, lineHeight: 1.55 }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="tn-btn" onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true) } catch { setCopied(false) } }}>
            {copied ? 'Copied ✓' : 'Copy template'}
          </button>
          <Link to="/dashboard/submit" className="tn-btn gold">I’ve posted it — submit</Link>
        </div>
      </div>
    </div>
  )
}
