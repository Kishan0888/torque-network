/**
 * Member dashboard (/dashboard/*). Loads the member's state once
 * (/api/dashboard?action=bootstrap) and renders the screen for the URL.
 *
 * - No active membership → sent to /account to subscribe (admins → /admin).
 * - Membership for a platform not yet set up → setup wizard.
 * - Members with both plans switch platform with the toggle in the header.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowUp, BarChart3, CreditCard, FileText, Home as HomeIcon, ListChecks, Menu, PlaySquare, Rows3, X, Shield } from 'lucide-react'
import { apiFetch } from '../lib/api'
import { Link, Redirect, navigate, usePathname } from '../lib/router'
import { supabase } from '../lib/supabase'
import { PLATFORM_LABEL, WHATSAPP_COMMUNITY_URLS, PLATFORM_FEATURES } from '../../shared/memberConfig.js'
import './dashboard.css'
import Setup from './pages/Setup'
import Home from './pages/Home'
import Submit from './pages/Submit'
import Timeline from './pages/Timeline'
import MyPosts from './pages/MyPosts'
import Resources from './pages/Resources'
import Guide from './pages/Guide'
import Subscription from './pages/Subscription'
import Analytics from './pages/Analytics'

const DashCtx = createContext(null)
// eslint-disable-next-line react/only-export-components
export const useDash = () => useContext(DashCtx)

// [path, label, icon, feature flag required (LinkedIn-only pages)]
const NAV = [
  ['/dashboard', 'Home', HomeIcon],
  ['/dashboard/submit', 'Submit a post', ArrowUp],
  ['/dashboard/timeline', 'Member Posts', Rows3],
  ['/dashboard/posts', 'My posts', ListChecks],
  ['/dashboard/analytics', 'Analytics', BarChart3],
  ['/dashboard/resources', 'Growth Playbook', PlaySquare, 'playbook'],
  ['/dashboard/guide', 'Monthly guide', FileText, 'guide'],
  ['/dashboard/subscription', 'Subscription', CreditCard],
]
const PAGE_FEATURE = { '/dashboard/resources': 'playbook', '/dashboard/guide': 'guide' }
const PAGES = {
  '/dashboard': Home,
  '/dashboard/submit': Submit,
  '/dashboard/timeline': Timeline,
  '/dashboard/posts': MyPosts,
  '/dashboard/resources': Resources,
  '/dashboard/guide': Guide,
  '/dashboard/subscription': Subscription,
  '/dashboard/analytics': Analytics,
}
const PLATFORM_KEY = 'torque_dashboard_platform'
const readStored = () => { try { return localStorage.getItem(PLATFORM_KEY) } catch { return null } }

export default function DashboardApp() {
  const path = usePathname().replace(/\/+$/, '') || '/dashboard'
  const [boot, setBoot] = useState(null)
  const [error, setError] = useState('')
  const [platformChoice, setPlatformChoice] = useState(() => new URLSearchParams(window.location.search).get('platform') || readStored())

  const reload = useCallback(async () => {
    try {
      setError('')
      const data = await apiFetch('/api/dashboard?action=bootstrap')
      setBoot(data)
      return data
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [])
  useEffect(() => { reload() }, [reload])

  const owned = useMemo(() => (boot ? ['linkedin', 'instagram'].filter((p) => boot.memberships[p]) : []), [boot])
  const platform = owned.includes(platformChoice) ? platformChoice : owned[0] || null
  const setPlatform = (p) => {
    setPlatformChoice(p)
    try { localStorage.setItem(PLATFORM_KEY, p) } catch { /* ignore */ }
  }

  const value = useMemo(() => boot && platform && ({
    ...boot, platform, owned, setPlatform, reload,
    setup: boot.platforms[platform] || null,
    joinedWhatsApp: Boolean(boot.platforms[platform]?.whatsapp_joined_at),
  }), [boot, platform, owned, reload])

  if (error) {
    return (
      <div className="tn-dash"><div className="tn-main" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="tn-notice error">{error}</div>
        <button className="tn-btn" onClick={reload}>Try again</button>
      </div></div>
    )
  }
  if (!boot) return <div className="tn-dash"><div className="tn-main"><p className="tn-loading">Loading your dashboard…</p></div></div>
  if (!platform) return <Redirect to={boot.isAdmin ? '/admin' : '/account'} />

  const needsSetup = !boot.platforms[platform]?.onboarded_at
  if (path === '/dashboard/setup' || needsSetup) {
    return <DashCtx.Provider value={value}><div className="tn-dash"><Setup /></div></DashCtx.Provider>
  }
  const Page = PAGES[path]
  if (!Page) return <Redirect to="/dashboard" />
  if (PAGE_FEATURE[path] && !PLATFORM_FEATURES[platform][PAGE_FEATURE[path]]) return <Redirect to="/dashboard" />

  return (
    <DashCtx.Provider value={value}>
      <div className="tn-dash"><Shell path={path}><Page /></Shell></div>
    </DashCtx.Provider>
  )
}

function Shell({ path, children }) {
  const d = useDash()
  const [open, setOpen] = useState(false)
  const initials = (d.user.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const domain = d.setup?.domain

  async function signOut() {
    await supabase.auth.signOut({ scope: 'local' })
    navigate('/login', { replace: true })
  }

  return (
    <div className="tn-shell">
      <div className="tn-topbar">
        <img src="/logo-sm.png" alt="Torque Network" />
        <button aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
      </div>
      {open && <div className="tn-scrim" onClick={() => setOpen(false)} />}
      <aside className={`tn-side ${open ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/dashboard" className="tn-logo"><img src="/logo-sm.png" alt="Torque Network" /></Link>
          {open && <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}><X size={20} /></button>}
        </div>
        <nav className="tn-nav" onClick={() => setOpen(false)}>
          {NAV.filter(([, , , f]) => !f || PLATFORM_FEATURES[d.platform][f]).map(([to, label, Icon]) => (
            <Link key={to} to={to} className={path === to ? 'active' : ''}><Icon size={17} /> {label}</Link>
          ))}
          {d.isAdmin && <Link to="/admin" className=""><Shield size={17} /> Admin panel</Link>}
        </nav>
        <div className="tn-side-foot">
          <WhatsAppButton />
          <div className="tn-me">
            <div className="tn-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="tn-me-name">{d.user.name}</div>
              <div className="tn-me-sub">{domain ? domain.split(' ')[0] : PLATFORM_LABEL[d.platform]} · Member</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                <Link to="/account" style={{ color: '#9aa4b5', fontSize: 11 }}>Account</Link>
                <button onClick={signOut} style={{ background: 'none', border: 'none', padding: 0, color: '#9aa4b5', fontSize: 11 }}>Log out</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="tn-main">{children}</main>
    </div>
  )
}

/**
 * The WhatsApp community for a platform (defaults to the one being viewed).
 * "Join" until the member has opened it once, then "Go to". If the link isn't
 * set yet (LinkedIn for now) the button shows "coming soon".
 */
export function WhatsAppButton({ className = 'tn-wa-btn', label, platform }) {
  const d = useDash()
  const p = platform || d.platform
  const url = WHATSAPP_COMMUNITY_URLS[p]
  const [joined, setJoined] = useState(Boolean(d.platforms[p]?.whatsapp_joined_at))
  const name = d.owned.length > 1 ? `${PLATFORM_LABEL[p]} ` : ''
  if (!url) {
    return <span className={className} aria-disabled="true" style={{ opacity: 0.65, cursor: 'default' }}>{name}WhatsApp community: link coming soon</span>
  }
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer"
      onClick={() => {
        if (!joined) {
          setJoined(true)
          apiFetch('/api/dashboard?action=whatsapp', { method: 'POST', body: { platform: p } }).then(() => d.reload()).catch(() => {})
        }
      }}>
      {label || (joined ? `Go to ${name}WhatsApp Community` : `Join ${name}WhatsApp Community`)}
    </a>
  )
}

/** Page header with title, subtitle, platform toggle (if both plans) and domain chip. */
export function PageHead({ title, subtitle }) {
  const d = useDash()
  return (
    <div className="tn-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {d.owned.length > 1 && (
          <div className="tn-switch" role="tablist" aria-label="Platform">
            {d.owned.map((p) => (
              <button key={p} role="tab" aria-selected={d.platform === p} className={d.platform === p ? 'on' : ''} onClick={() => d.setPlatform(p)}>
                {PLATFORM_LABEL[p]}
              </button>
            ))}
          </div>
        )}
        {d.setup?.domain && <span className="tn-chip">{d.setup.domain}</span>}
      </div>
    </div>
  )
}

export function Notice({ tone = 'info', children }) {
  return <div className={`tn-notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>
}

// Small helper hook for page data that depends on the active platform.
// eslint-disable-next-line react/only-export-components
export function usePlatformData(action, extra = '') {
  const d = useDash()
  const [state, setState] = useState({ data: null, error: '', loading: true })
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    try {
      const data = await apiFetch(`/api/dashboard?action=${action}&platform=${d.platform}${extra}`)
      setState({ data, error: '', loading: false })
    } catch (e) {
      setState({ data: null, error: e.message, loading: false })
    }
  }, [action, d.platform, extra])
  useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}
