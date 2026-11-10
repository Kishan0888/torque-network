import { Link } from '../../lib/router'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { PLATFORM_FEATURES, postTitle } from '../../../shared/memberConfig.js'

const STATUS = { pending: ['Pending review', 'pending'], approved: ['Live', 'live'], rejected: ['Not approved', 'rejected'] }
const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })

export default function MyPosts() {
  const { data, error, loading } = usePlatformData('my-posts')
  const details = PLATFORM_FEATURES[useDash().platform].postDetails
  return (
    <>
      <PageHead title="My posts" subtitle="Track the status of everything you have submitted." />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        <>
          <div className="tn-card" style={{ marginBottom: 14 }}>
            {data.posts.length === 0 ? (
              <div className="tn-empty">Nothing submitted yet. <Link to="/dashboard/submit" className="tn-link">Submit your first post →</Link></div>
            ) : (
              <div className="tn-table-wrap">
                <table className="tn-table">
                  <thead><tr><th>Post</th>{details && <th>Category</th>}<th>Submitted</th><th>Status</th><th>Moderator note</th></tr></thead>
                  <tbody>
                    {data.posts.map((p) => {
                      const [label, cls] = STATUS[p.status]
                      return (
                        <tr key={p.id}>
                          <td style={{ maxWidth: 280 }}>
                            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none' }}>{postTitle(p)} ↗</a>
                          </td>
                          {details && <td>{p.category || '—'}</td>}
                          <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.created_at)}</td>
                          <td><span className={`tn-badge ${cls}`}>{label}</span></td>
                          <td className="tn-small" style={{ maxWidth: 240 }}>{p.moderator_note || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="tn-grid tn-grid-3">
            <div className="tn-card"><div className="tn-stat-label">Total submitted</div><div className="tn-stat">{data.stats.total}</div></div>
            <div className="tn-card"><div className="tn-stat-label">Approved</div><div className="tn-stat green">{data.stats.approved}</div></div>
            <div className="tn-card"><div className="tn-stat-label">Weeks in a row posting</div><div className="tn-stat orange">{data.stats.streak}</div></div>
          </div>
        </>
      )}
    </>
  )
}
