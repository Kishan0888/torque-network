import { useState } from 'react'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'

const monthName = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function Guide() {
  const d = useDash()
  const { data, error, loading } = usePlatformData('guides')
  const [selectedId, setSelectedId] = useState(null)
  const guides = data?.guides || []
  const guide = guides.find((g) => g.id === selectedId) || guides[0]
  const past = guides.filter((g) => g !== guide)

  function download() {
    if (guide.pdf_url) window.open(guide.pdf_url, '_blank', 'noopener')
    else window.print() // printable version → "Save as PDF"
  }

  return (
    <>
      <PageHead title="Monthly guide" subtitle={guide ? `Your content strategy for ${monthName(guide.month).split(' ')[0]}, written for ${d.setup?.domain}.` : `Your monthly content strategy for ${d.setup?.domain}.`} />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        !guide ? (
          <div className="tn-card tn-empty">This month’s guide for {d.setup?.domain} is being written. It will appear here as soon as it’s published.</div>
        ) : (
          <div className="tn-grid tn-grid-2-1" style={{ alignItems: 'start' }}>
            <div className="tn-card tn-print">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{monthName(guide.month)} · {d.setup?.domain}</h2>
                <button className="tn-btn small tn-no-print" onClick={download}>Download PDF</button>
              </div>
              {guide.theme && <p style={{ fontSize: 13, margin: '0 0 12px' }}><strong>Theme of the month:</strong> {guide.theme}</p>}
              {guide.weeks?.length > 0 && (
                <div className="tn-table-wrap">
                  <table className="tn-table">
                    <thead><tr><th>Week</th><th>Focus</th><th>Suggested posts</th></tr></thead>
                    <tbody>{guide.weeks.map((w, i) => <tr key={i}><td style={{ whiteSpace: 'nowrap' }}>{w.week}</td><td>{w.focus}</td><td>{w.suggested}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
              {guide.also_inside && <p className="tn-small" style={{ marginTop: 12 }}><strong>Also inside:</strong> {guide.also_inside}</p>}
            </div>
            <div className="tn-grid">
              {guide.also_inside && (
                <div className="tn-card amber"><h2 style={{ marginBottom: 6 }}>Also inside</h2><div style={{ fontSize: 13, lineHeight: 1.6 }}>{guide.also_inside}</div></div>
              )}
              <div className="tn-card">
                <h2>Past guides</h2>
                {past.length === 0 ? <span className="tn-small">Past months will appear here.</span> : past.map((g) => (
                  <div key={g.id}><button className="tn-link" onClick={() => setSelectedId(g.id)} style={{ padding: '3px 0' }}>{monthName(g.month)} →</button></div>
                ))}
                {selectedId && guide !== guides[0] && <div style={{ marginTop: 8 }}><button className="tn-link" onClick={() => setSelectedId(null)}>← Back to this month</button></div>}
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}
