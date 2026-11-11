/**
 * /admin — team panel: review posts, manage playbook videos, publish monthly
 * guides, view members. Access is enforced on the server (public.admins).
 */
import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { Link, navigate } from '../lib/router'
import { supabase } from '../lib/supabase'
import '../dashboard/dashboard.css'
import { DOMAINS, PLATFORMS, PLATFORM_LABEL, monthKey, youtubeId, postTitle } from '../../shared/memberConfig.js'

const TABS = [['leads', 'Leads'], ['review', 'Review posts'], ['resources', 'Resources'], ['members', 'Members']]
const fmt = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '—')

function useApi(path) {
  const [state, setState] = useState({ data: null, error: '', loading: true })
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    try { setState({ data: await apiFetch(path), error: '', loading: false }) } catch (e) { setState({ data: null, error: e.message, status: e.status, loading: false }) }
  }, [path])
  useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}

export default function AdminApp() {
  const [tab, setTab] = useState('leads')
  async function signOut() {
    await supabase.auth.signOut({ scope: 'local' })
    navigate('/login', { replace: true })
  }
  const probe = useApi('/api/admin?action=posts&status=pending')
  if (probe.loading && !probe.data) return <div className="tn-dash"><div className="tn-main"><p className="tn-loading">Loading admin panel…</p></div></div>
  if (probe.error) {
    return (
      <div className="tn-dash"><div className="tn-main" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="tn-notice error">{probe.status === 403 ? 'This page is for the Torque Network team only.' : probe.error}</div>
        <Link to="/dashboard" className="tn-btn">Back to dashboard</Link>
      </div></div>
    )
  }
  return (
    <div className="tn-dash">
      <div style={{ background: 'var(--navy)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="/logo-sm.png" alt="Torque Network" style={{ height: 48, margin: '-8px 0' }} />
          <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: 13, letterSpacing: '0.08em' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link to="/dashboard" style={{ color: '#d9dee8', fontSize: 13 }}>← Member dashboard</Link>
          <button type="button" onClick={signOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '6px 14px', color: '#d9dee8', fontSize: 13, cursor: 'pointer' }}>Log out</button>
        </div>
      </div>
      <div style={{ background: 'var(--paper)', minHeight: 'calc(100vh - 56px)' }}><div className="tn-main" style={{ maxWidth: 1180, margin: '0 auto', background: 'transparent' }}>
        <div className="tn-pills" role="tablist">
          {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} className={`tn-pill ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>)}
        </div>
        {tab === 'review' && <Review />}
        {tab === 'resources' && <ResourcesAdmin />}
        {tab === 'guides' && <GuidesAdmin />}
        {tab === 'members' && <Members />}
        {tab === 'leads' && <Leads />}
      </div></div>
    </div>
  )
}

// ── Review posts ───────────────────────────────────────────────────────────
function Review() {
  const [status, setStatus] = useState('pending')
  const [platform, setPlatform] = useState('')
  const { data, error, loading, reload } = useApi(`/api/admin?action=posts&status=${status}${platform ? `&platform=${platform}` : ''}`)
  const [notes, setNotes] = useState({})
  const [busy, setBusy] = useState(null)
  const [msg, setMsg] = useState(null)

  async function act(post, patch) {
    setBusy(post.id); setMsg(null)
    try {
      await apiFetch('/api/admin?action=review', { method: 'POST', body: { id: post.id, note: notes[post.id] ?? post.moderator_note ?? '', ...patch } })
      await reload()
    } catch (e) { setMsg(e.message) } finally { setBusy(null) }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <select className="tn-select" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending review</option><option value="approved">Live</option><option value="rejected">Not approved</option>
        </select>
        <select className="tn-select" style={{ width: 'auto' }} value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">All platforms</option>{PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_LABEL[p]}</option>)}
        </select>
      </div>
      {(error || msg) && <div className="tn-notice error">{error || msg}</div>}
      {loading && !data ? <p className="tn-loading">Loading…</p> : data && (
        data.posts.length === 0 ? <div className="tn-card tn-empty">Nothing here. {status === 'pending' ? 'All caught up 🎉' : ''}</div> : (
          <div className="tn-grid">
            {data.posts.map((p) => (
              <div key={p.id} className="tn-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div className="tn-small"><strong style={{ color: 'var(--ink)' }}>{p.author || 'Member'}</strong> · {PLATFORM_LABEL[p.platform]} · {p.domain || '—'}{p.category ? ` · ${p.category}` : ''}{p.topic ? ` · ${p.topic}` : ''}</div>
                  <span className="tn-small">Submitted {fmt(p.created_at)}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, margin: '6px 0' }}>{postTitle(p)}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="tn-link" style={{ wordBreak: 'break-all' }}>{p.url} ↗</a>
                <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input className="tn-input" style={{ flex: '1 1 260px' }} maxLength={300} placeholder="Note for the member (required to reject)"
                    value={notes[p.id] ?? p.moderator_note ?? ''} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })} />
                  {p.status !== 'approved' && <button className="tn-btn gold small" disabled={busy === p.id} onClick={() => act(p, { status: 'approved' })}>Approve</button>}
                  {p.status !== 'rejected' && <button className="tn-btn small" disabled={busy === p.id} onClick={() => act(p, { status: 'rejected' })}>Reject</button>}
                  {p.status === 'approved' && (
                    <label className="tn-check" style={{ padding: 0 }}>
                      <input type="checkbox" checked={p.featured} disabled={busy === p.id} onChange={(e) => act(p, { featured: e.target.checked })} /> Spotlight on Home
                    </label>
                  )}
                  {p.status !== 'pending' && <button className="tn-link" disabled={busy === p.id} onClick={() => act(p, { note: notes[p.id] ?? p.moderator_note ?? '' })}>Save note</button>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  )
}

// ── Resources ──────────────────────────────────────────────────────────────
const EMPTY_RES = { id: null, platform: 'all', title: '', youtube_url: '', duration: '', sort_order: 0, published: true }
function ResourcesAdmin() {
  const { data, error, reload } = useApi('/api/admin?action=resources')
  const [form, setForm] = useState(EMPTY_RES)
  const [msg, setMsg] = useState(null)
  const set = (p) => setForm((f) => ({ ...f, ...p }))

  async function save(e) {
    e.preventDefault(); setMsg(null)
    try {
      await apiFetch('/api/admin?action=resource', { method: 'POST', body: form })
      setForm(EMPTY_RES); setMsg(['success', 'Saved.']); reload()
    } catch (err) { setMsg(['error', err.message]) }
  }
  async function remove(r) {
    if (!window.confirm(`Delete “${r.title}”?`)) return
    try { await apiFetch('/api/admin?action=resource-delete', { method: 'POST', body: { id: r.id } }); reload() } catch (err) { setMsg(['error', err.message]) }
  }

  return (
    <div className="tn-grid tn-grid-2-1" style={{ alignItems: 'start' }}>
      <div className="tn-card">
        <h2>Playbook videos</h2>
        {error && <div className="tn-notice error">{error}</div>}
        {!data ? <p className="tn-loading">Loading…</p> : data.resources.length === 0 ? <p className="tn-small">No videos yet. Add the first one →</p> : (
          <div className="tn-table-wrap"><table className="tn-table">
            <thead><tr><th>#</th><th>Title</th><th>For</th><th>Length</th><th>Shown</th><th /></tr></thead>
            <tbody>{data.resources.map((r) => (
              <tr key={r.id}>
                <td>{r.sort_order}</td>
                <td><a href={r.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700 }}>{r.title}</a></td>
                <td>{r.platform === 'all' ? 'Everyone' : PLATFORM_LABEL[r.platform]}</td>
                <td>{r.duration || '—'}</td>
                <td>{r.published ? 'Yes' : 'Hidden'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="tn-link" onClick={() => setForm({ ...EMPTY_RES, ...r })}>Edit</button>{' · '}
                  <button className="tn-link" style={{ color: 'var(--red)' }} onClick={() => remove(r)}>Delete</button>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
      <form className="tn-card" onSubmit={save}>
        <h2>{form.id ? 'Edit video' : 'Add a video'}</h2>
        {msg && <div className={`tn-notice ${msg[0]}`}>{msg[1]}</div>}
        <label className="tn-field"><span>Title</span><input className="tn-input" maxLength={120} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="Build a profile that gets noticed" /></label>
        <label className="tn-field"><span>YouTube link</span><input className="tn-input" value={form.youtube_url} onChange={(e) => set({ youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
          {form.youtube_url && !youtubeId(form.youtube_url) && <div className="tn-count over" style={{ textAlign: 'left' }}>Not a YouTube video link</div>}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <label className="tn-field"><span>For</span>
            <select className="tn-select" value={form.platform} onChange={(e) => set({ platform: e.target.value })}>
              <option value="all">Everyone</option>{PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_LABEL[p]}</option>)}
            </select>
          </label>
          <label className="tn-field"><span>Length</span><input className="tn-input" maxLength={10} value={form.duration || ''} onChange={(e) => set({ duration: e.target.value })} placeholder="6:40" /></label>
          <label className="tn-field"><span>Order</span><input className="tn-input" type="number" value={form.sort_order} onChange={(e) => set({ sort_order: e.target.value })} /></label>
        </div>
        <label className="tn-check"><input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} /> Show to members</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button className="tn-btn gold" type="submit">{form.id ? 'Save changes' : 'Add video'}</button>
          {form.id && <button className="tn-btn" type="button" onClick={() => setForm(EMPTY_RES)}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}

// ── Monthly guides ─────────────────────────────────────────────────────────
const blankWeeks = () => [1, 2, 3, 4].map((n) => ({ week: `Week ${n}`, focus: '', suggested: '' }))
const emptyGuide = () => ({ id: null, platform: 'linkedin', domain: Object.keys(DOMAINS.linkedin)[0], month: monthKey().slice(0, 7), theme: '', weeks: blankWeeks(), also_inside: '', pdf_url: '', published: false })

function GuidesAdmin() {
  const { data, error, reload } = useApi('/api/admin?action=guides')
  const [form, setForm] = useState(emptyGuide)
  const [msg, setMsg] = useState(null)
  const set = (p) => setForm((f) => ({ ...f, ...p }))
  const setWeek = (i, p) => setForm((f) => ({ ...f, weeks: f.weeks.map((w, j) => (j === i ? { ...w, ...p } : w)) }))

  async function save(e) {
    e.preventDefault(); setMsg(null)
    try {
      await apiFetch('/api/admin?action=guide', { method: 'POST', body: form })
      setMsg(['success', form.published ? 'Saved and published.' : 'Saved as draft.']); setForm(emptyGuide()); reload()
    } catch (err) { setMsg(['error', err.message]) }
  }
  function edit(g) {
    const weeks = [...(g.weeks || []), ...blankWeeks()].slice(0, Math.max(4, (g.weeks || []).length))
    setForm({ ...g, month: g.month.slice(0, 7), weeks, theme: g.theme || '', also_inside: g.also_inside || '', pdf_url: g.pdf_url || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  async function remove(g) {
    if (!window.confirm('Delete this guide?')) return
    try { await apiFetch('/api/admin?action=guide-delete', { method: 'POST', body: { id: g.id } }); reload() } catch (err) { setMsg(['error', err.message]) }
  }
  const copyTo = () => set({ id: null, published: false })

  return (
    <div className="tn-grid" style={{ gap: 18 }}>
      <form className="tn-card" onSubmit={save}>
        <h2>{form.id ? 'Edit guide' : 'New monthly guide'}</h2>
        {msg && <div className={`tn-notice ${msg[0]}`}>{msg[1]}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          <label className="tn-field"><span>Platform</span>
            <select className="tn-select" value={form.platform} onChange={(e) => set({ platform: e.target.value, domain: Object.keys(DOMAINS[e.target.value])[0] })}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_LABEL[p]}</option>)}
            </select>
          </label>
          <label className="tn-field"><span>Domain / niche</span>
            <select className="tn-select" value={form.domain} onChange={(e) => set({ domain: e.target.value })}>
              {Object.keys(DOMAINS[form.platform]).map((dmn) => <option key={dmn}>{dmn}</option>)}
            </select>
          </label>
          <label className="tn-field"><span>Month</span><input className="tn-input" type="month" value={form.month} onChange={(e) => set({ month: e.target.value })} /></label>
        </div>
        <label className="tn-field"><span>Theme of the month</span><input className="tn-input" maxLength={200} value={form.theme} onChange={(e) => set({ theme: e.target.value })} placeholder="Festive season campaigns and what they teach us" /></label>
        <div className="tn-field"><span>Weekly plan</span>
          {form.weeks.map((w, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 2fr', gap: 8, marginBottom: 8 }}>
              <input className="tn-input" value={w.week} maxLength={20} onChange={(e) => setWeek(i, { week: e.target.value })} />
              <input className="tn-input" placeholder="Focus" maxLength={60} value={w.focus || ''} onChange={(e) => setWeek(i, { focus: e.target.value })} />
              <input className="tn-input" placeholder="Suggested posts" maxLength={200} value={w.suggested || ''} onChange={(e) => setWeek(i, { suggested: e.target.value })} />
            </div>
          ))}
          {form.weeks.length < 6 && <button type="button" className="tn-link" onClick={() => set({ weeks: [...form.weeks, { week: `Week ${form.weeks.length + 1}`, focus: '', suggested: '' }] })}>+ Add week</button>}
        </div>
        <label className="tn-field"><span>Also inside (optional)</span><input className="tn-input" maxLength={300} value={form.also_inside} onChange={(e) => set({ also_inside: e.target.value })} placeholder="Hook templates · Hashtag guide · Best days to post · 5 example posts" /></label>
        <label className="tn-field"><span>PDF link (optional — otherwise members can print/save the on-screen guide)</span><input className="tn-input" value={form.pdf_url} onChange={(e) => set({ pdf_url: e.target.value })} placeholder="https://…/november-marketing.pdf" /></label>
        <label className="tn-check"><input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} /> Published (visible to members of this domain)</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <button className="tn-btn gold" type="submit">{form.id ? 'Save changes' : 'Save guide'}</button>
          {form.id && <button className="tn-btn" type="button" onClick={copyTo}>Use as template for another domain/month</button>}
          {form.id && <button className="tn-btn" type="button" onClick={() => setForm(emptyGuide())}>Cancel</button>}
        </div>
      </form>
      <div className="tn-card">
        <h2>All guides</h2>
        {error && <div className="tn-notice error">{error}</div>}
        {!data ? <p className="tn-loading">Loading…</p> : data.guides.length === 0 ? <p className="tn-small">No guides yet.</p> : (
          <div className="tn-table-wrap"><table className="tn-table">
            <thead><tr><th>Month</th><th>Platform</th><th>Domain</th><th>Theme</th><th>Status</th><th /></tr></thead>
            <tbody>{data.guides.map((g) => (
              <tr key={g.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{g.month.slice(0, 7)}</td><td>{PLATFORM_LABEL[g.platform]}</td><td>{g.domain}</td>
                <td className="tn-small">{g.theme || '—'}</td>
                <td><span className={`tn-badge ${g.published ? 'live' : 'neutral'}`}>{g.published ? 'Published' : 'Draft'}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}><button className="tn-link" onClick={() => edit(g)}>Edit</button>{' · '}<button className="tn-link" style={{ color: 'var(--red)' }} onClick={() => remove(g)}>Delete</button></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}

// ── Leads (landing-page form) ─────────────────────────────────────────────
const LEAD_STATUS = [['new', 'New'], ['contacted', 'Contacted'], ['converted', 'Converted'], ['not_interested', 'Not interested']]
const payStage = (l) => (l.paid_at ? ['active', 'Paid'] : l.checkout_started_at ? ['pending', 'Reached payment'] : ['neutral', 'Form only'])

function Leads() {
  const [status, setStatus] = useState('')
  const { data, error, reload } = useApi(`/api/admin?action=leads${status ? `&status=${status}` : ''}`)
  const [msg, setMsg] = useState(null)
  async function setLeadStatus(lead, next) {
    try { await apiFetch('/api/admin?action=lead-status', { method: 'POST', body: { id: lead.id, status: next } }); reload() } catch (e) { setMsg(e.message) }
  }
  function downloadCsv() {
    const cols = ['created_at', 'name', 'phone', 'email', 'industry', 'experience', 'profile_url', 'payment', 'paid_at', 'status', 'platform', 'page', 'utm_source', 'utm_medium', 'utm_campaign']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [cols.join(','), ...data.leads.map((l) => cols.map((c) => esc(c === 'payment' ? payStage(l)[1] : (c === 'created_at' || c === 'paid_at') && l[c] ? new Date(l[c]).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : l[c])).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = `torque-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }
  return (
    <div className="tn-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Landing page leads {data && <span className="tn-small">({data.leads.length})</span>}</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select className="tn-select" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>{LEAD_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <button className="tn-btn small" disabled={!data?.leads.length} onClick={downloadCsv}>Download CSV</button>
        </div>
      </div>
      {(error || msg) && <div className="tn-notice error">{error || msg}</div>}
      {!data ? <p className="tn-loading">Loading…</p> : data.leads.length === 0 ? <p className="tn-small">No leads yet. They appear here as soon as someone submits the form on torquenetwork.in/landing-linkedin.</p> : (
        <div className="tn-table-wrap"><table className="tn-table">
          <thead><tr><th>When</th><th>Name</th><th>Contact</th><th>Industry</th><th>Source</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody>{data.leads.map((l) => (
            <tr key={l.id}>
              <td className="tn-small" style={{ whiteSpace: 'nowrap' }}>{fmt(l.created_at)}</td>
              <td><div style={{ fontWeight: 700 }}>{l.name}</div>{l.profile_url && <a href={l.profile_url} target="_blank" rel="noopener noreferrer" className="tn-link" style={{ fontSize: 12 }}>LinkedIn ↗</a>}</td>
              <td className="tn-small">
                <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="tn-link" style={{ fontSize: 12 }}>{l.phone}</a>
                {l.email && <div><a href={`mailto:${l.email}`} style={{ color: 'inherit' }}>{l.email}</a></div>}
              </td>
              <td className="tn-small">{l.industry || '—'}{l.experience ? ` · ${l.experience}` : ''}</td>
              <td className="tn-small">{[l.utm_source, l.utm_campaign].filter(Boolean).join(' / ') || l.page || '—'}</td>
              <td><span className={`tn-badge ${payStage(l)[0]}`} style={{ whiteSpace: 'nowrap' }}>{payStage(l)[1]}</span></td>
              <td>
                <select className="tn-select" style={{ width: 'auto', padding: '6px 8px', fontSize: 12 }} value={l.status} onChange={(e) => setLeadStatus(l, e.target.value)}>
                  {LEAD_STATUS.map(([k, lab]) => <option key={k} value={k}>{lab}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  )
}

// ── Members ────────────────────────────────────────────────────────────────
function Members() {
  const { data, error } = useApi('/api/admin?action=members')
  const [q, setQ] = useState('')
  const rows = (data?.members || []).filter((m) => !q || `${m.name} ${m.email} ${m.phone}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="tn-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Members {data && <span className="tn-small">({data.members.filter((m) => m.linkedin || m.instagram).length} active of {data.members.length} accounts)</span>}</h2>
        <input className="tn-input" style={{ maxWidth: 260 }} placeholder="Search name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <div className="tn-notice error">{error}</div>}
      {!data ? <p className="tn-loading">Loading…</p> : (
        <div className="tn-table-wrap"><table className="tn-table">
          <thead><tr><th>Member</th><th>Plans</th><th>Setup</th><th>WhatsApp</th><th>Joined</th></tr></thead>
          <tbody>{rows.map((m) => (
            <tr key={m.id}>
              <td><div style={{ fontWeight: 700 }}>{m.name || '—'}</div><div className="tn-small">{m.email}{m.phone ? ` · ${m.phone}` : ''}</div></td>
              <td>
                {m.linkedin && <span className="tn-badge active" style={{ marginRight: 4 }}>LinkedIn</span>}
                {m.instagram && <span className="tn-badge active">Instagram</span>}
                {!m.linkedin && !m.instagram && <span className="tn-badge neutral">None</span>}
              </td>
              <td className="tn-small">{m.platforms.length === 0 ? '—' : m.platforms.map((p) => (
                <div key={p.platform}>{PLATFORM_LABEL[p.platform]}: {p.domain || '—'}{p.onboarded_at ? ' ✓' : ' (in progress)'}
                  {p.profile_url && <> · {p.platform === 'linkedin' ? <a href={p.profile_url} target="_blank" rel="noopener noreferrer" className="tn-link" style={{ fontSize: 12 }}>profile</a> : p.profile_url}</>}
                </div>
              ))}</td>
              <td className="tn-small">{m.whatsapp_joined_at ? 'Joined' : '—'}</td>
              <td className="tn-small" style={{ whiteSpace: 'nowrap' }}>{new Date(m.joined).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  )
}
