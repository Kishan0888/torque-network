import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import { Link } from '../../lib/router'
import { useDash, usePlatformData, PageHead, Notice } from '../DashboardApp'
import { CATEGORIES, SUMMARY_MAX, normalizePostUrl, PLATFORM_LABEL, PLATFORM_FEATURES, cleanCategory } from '../../../shared/memberConfig.js'

const OWN = '__own__'

export default function Submit() {
  const d = useDash()
  const { data: home, reload } = usePlatformData('home')
  const li = d.platform === 'linkedin'
  const details = PLATFORM_FEATURES[d.platform].postDetails
  const [form, setForm] = useState({ url: '', category: '', ownCategory: '', topic: '', summary: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const used = home?.week.used ?? 0
  const limit = home?.week.limit ?? 2
  const full = used >= limit
  const urlOk = !form.url || Boolean(normalizePostUrl(d.platform, form.url))

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(null)
    if (!normalizePostUrl(d.platform, form.url)) return setMsg(['error', li ? 'Paste the link of a published LinkedIn post.' : 'Paste the link of a published Instagram post or reel.'])
    const category = form.category === OWN ? form.ownCategory : form.category
    if (details) {
      if (!category) return setMsg(['error', form.category === OWN ? 'Type your category.' : 'Choose a category.'])
      if (!cleanCategory(d.platform, category)) return setMsg(['error', 'Use 2–40 letters or numbers for your category.'])
      if (!form.summary.trim()) return setMsg(['error', 'Add a one-line summary.'])
    }
    setBusy(true)
    try {
      const body = details
        ? { platform: d.platform, url: form.url, category, topic: form.topic || null, summary: form.summary }
        : { platform: d.platform, url: form.url }
      await apiFetch('/api/dashboard?action=submit', { method: 'POST', body })
      setForm({ url: '', category: '', ownCategory: '', topic: '', summary: '' })
      setMsg(['success', 'Submitted for review. You’ll see its status in My posts.'])
      reload()
    } catch (err) {
      setMsg(['error', err.message])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHead title="Submit a post" subtitle={`Share a post you have already published on ${PLATFORM_LABEL[d.platform]}. Up to ${limit} a week.`} />
      <div className="tn-grid tn-grid-2-1" style={{ alignItems: 'start' }}>
        <form className="tn-card" onSubmit={onSubmit} noValidate>
          {msg && <Notice tone={msg[0]}>{msg[1]}{msg[0] === 'success' && <> <Link to="/dashboard/posts" className="tn-link">View my posts →</Link></>}</Notice>}
          {full && <Notice tone="warn">You’ve used both submissions for this week. New slots open on Monday.</Notice>}
          <label className="tn-field"><span>{li ? 'LinkedIn post link' : 'Instagram post or reel link'}</span>
            <input className="tn-input" inputMode="url" value={form.url} onChange={(e) => set({ url: e.target.value })} disabled={full}
              placeholder={li ? 'https://www.linkedin.com/posts/your-name_topic-activity-…' : 'https://www.instagram.com/reel/…'} />
            {!urlOk && <div className="tn-count over" style={{ textAlign: 'left' }}>{li ? 'Use the link to a published post (Copy link to post on LinkedIn).' : 'Use the link to a published post or reel.'}</div>}
          </label>
          {details && <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <label className="tn-field"><span>Category</span>
              <select className="tn-select" value={form.category} onChange={(e) => set({ category: e.target.value })} disabled={full}>
                <option value="">Choose…</option>
                {CATEGORIES[d.platform].map((c) => <option key={c}>{c}</option>)}
                <option value={OWN}>+ Add your own category</option>
              </select>
              {form.category === OWN && (
                <input className="tn-input" style={{ marginTop: 8 }} maxLength={40} autoFocus value={form.ownCategory}
                  onChange={(e) => set({ ownCategory: e.target.value })} placeholder="e.g. Product launch" disabled={full} />
              )}
            </label>
            <label className="tn-field"><span>Topic (optional)</span>
              <select className="tn-select" value={form.topic} onChange={(e) => set({ topic: e.target.value })} disabled={full}>
                <option value="">—</option>
                {(d.setup?.interests || []).map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <label className="tn-field"><span>One-line summary (max {SUMMARY_MAX} characters)</span>
            <textarea className="tn-textarea" maxLength={SUMMARY_MAX} value={form.summary} onChange={(e) => set({ summary: e.target.value })} disabled={full}
              placeholder={li ? 'A failed campaign taught me more than any successful one. Here are 3 lessons.' : 'I tried 5 street-food spots in Old Delhi — here’s the one worth the queue.'} />
            <div className={`tn-count ${form.summary.length > SUMMARY_MAX ? 'over' : ''}`}>{form.summary.length} / {SUMMARY_MAX}</div>
          </label>
          </>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="tn-small">{used} of {limit} submissions used this week</span>
            <button className="tn-btn gold" type="submit" disabled={busy || full}>{busy ? 'Submitting…' : 'Submit Your Post'}</button>
          </div>
        </form>
        <div className="tn-grid">
          <div className="tn-card blue">
            <h2>What happens next</h2>
            <ol style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              <li>A moderator reviews your post, usually within 12 hours</li>
              <li>Once approved, it appears in your peers’ timelines</li>
              <li>You’ll see it marked <strong>Live</strong> in My posts</li>
            </ol>
          </div>
          <div className="tn-card">
            <h2>Before you submit</h2>
            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              ✓ The post is original and already published<br />
              ✓ It’s relevant to your {li ? 'industry' : 'niche'}<br />
              ✓ No “Agree? Comment below” engagement bait
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
