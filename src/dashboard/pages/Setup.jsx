/**
 * Six-step setup wizard after payment (one run per platform):
 *   1 Connect (LinkedIn sign-in / profile link, or Instagram handle)
 *   2 Domain   3 Role & experience   4 Interests & goals
 *   5 Guidelines   6 WhatsApp community
 * Each step is saved as you go, so members can leave and resume.
 */
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { apiFetch } from '../../lib/api'
import { supabase, siteUrl } from '../../lib/supabase'
import { enabledProviders } from '../../lib/authProviders'
import { navigate } from '../../lib/router'
import { useDash, WhatsAppButton, Notice } from '../DashboardApp'
import { DOMAINS, EXPERIENCE, GOALS, GUIDELINES, PLATFORM_LABEL } from '../../../shared/memberConfig.js'

const TOTAL = 6

function firstOpenStep(s, member) {
  if (!s || (!s.profile_url && !s.connected_at)) return 1
  if (!s.domain) return 2
  if (!s.experience) return 3
  if (!s.interests?.length) return 4
  if (!member?.guidelines_accepted_at) return 5
  return 6
}

export default function Setup() {
  const d = useDash()
  const { platform } = d
  const s = d.setup || {}
  const [step, setStep] = useState(() => firstOpenStep(d.setup, d.member))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    profile_url: s.profile_url || '',
    domain: s.domain || '',
    role_title: s.role_title || '',
    experience: s.experience || '',
    interests: s.interests || [],
    goals: s.goals || [],
    accepted: Boolean(d.member?.guidelines_accepted_at),
  })
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const toggle = (key, value, max) => setForm((f) => {
    const has = f[key].includes(value)
    if (!has && f[key].length >= max) return f
    return { ...f, [key]: has ? f[key].filter((v) => v !== value) : [...f[key], value] }
  })

  async function save(body, next) {
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/dashboard?action=setup', { method: 'POST', body: { platform, ...body } })
      await d.reload()
      if (next === 'done') navigate('/dashboard', { replace: true })
      else setStep(next)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function onContinue() {
    if (step === 1) {
      if (platform === 'instagram' && !form.profile_url) return setError('Enter your Instagram handle.')
      if (platform === 'linkedin' && !form.profile_url && !s.connected_at && !d.linkedin) return setError('Connect LinkedIn or paste your profile link.')
      return save({ profile_url: form.profile_url || null, ...(platform === 'linkedin' && d.linkedin && !s.connected_at ? { connect_linkedin: true } : {}) }, 2)
    }
    if (step === 2) return form.domain ? save({ domain: form.domain }, 3) : setError('Choose your domain.')
    if (step === 3) return form.experience ? save({ role_title: form.role_title, experience: form.experience }, 4) : setError('Choose your experience.')
    if (step === 4) return form.interests.length ? save({ interests: form.interests, goals: form.goals }, 5) : setError('Pick at least one interest.')
    if (step === 5) return form.accepted ? save({ accept_guidelines: true }, 6) : setError('Please agree to the guidelines to continue.')
    if (step === 6) return save({ complete: true }, 'done')
  }

  const signedInAs = platform === 'linkedin' && (s.connected_name || d.linkedin?.name)

  return (
    <div className="tn-wizard-bg">
      <div className="tn-wizard-arc" aria-hidden />
      <div className="tn-wizard">
        <div className="tn-wizard-top">
          <span className="tn-wizard-logo"><img src="/logo-sm.png" alt="Torque Network" /></span>
          <span className="tn-small">{PLATFORM_LABEL[platform]} setup · Step {step} of {TOTAL}</span>
        </div>
        <div className="tn-progress" aria-hidden>{Array.from({ length: TOTAL }).map((_, i) => <span key={i} className={i < step ? 'on' : ''} />)}</div>

        {error && <Notice tone="error">{error}</Notice>}

        {step === 1 && <StepConnect platform={platform} form={form} set={set} />}
        {step === 2 && (
          <>
            <h1>Which {platform === 'linkedin' ? 'domain do you work in' : 'niche do you create in'}?</h1>
            <p className="lead">We’ll place you with peers from your {platform === 'linkedin' ? 'industry' : 'niche'} and personalise your timeline, prompts and monthly guide.</p>
            <div className="tn-options">
              {Object.keys(DOMAINS[platform]).map((dom) => (
                <button key={dom} type="button" className={`tn-option ${form.domain === dom ? 'on' : ''}`}
                  onClick={() => set({ domain: dom, interests: form.domain === dom ? form.interests : [] })}>{dom}</button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1>{platform === 'linkedin' ? 'Your role and experience' : 'About your content'}</h1>
            <p className="lead">Shown next to your posts in peers’ timelines.</p>
            <label className="tn-field"><span>{platform === 'linkedin' ? 'Job title' : 'What you create'}</span>
              <input className="tn-input" maxLength={80} value={form.role_title} onChange={(e) => set({ role_title: e.target.value })}
                placeholder={platform === 'linkedin' ? 'e.g. Brand Executive' : 'e.g. Food reels and recipe carousels'} />
            </label>
            <div className="tn-field"><span>{platform === 'linkedin' ? 'Experience' : 'How long you’ve been creating'}</span>
              <div className="tn-options">
                {EXPERIENCE.map((x) => <button key={x} type="button" className={`tn-option ${form.experience === x ? 'on' : ''}`} onClick={() => set({ experience: x })}>{x}</button>)}
              </div>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1>Interests and goals</h1>
            <p className="lead">Pick up to 5 topics you want in your timeline, and what you want from Torque.</p>
            <div className="tn-field"><span>Topics</span>
              <div className="tn-options">
                {(DOMAINS[platform][form.domain] || []).map((t) => (
                  <button key={t} type="button" className={`tn-option ${form.interests.includes(t) ? 'on' : ''}`} onClick={() => toggle('interests', t, 5)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="tn-field"><span>Goals</span>
              <div className="tn-options">
                {GOALS[platform].map((g) => (
                  <button key={g} type="button" className={`tn-option ${form.goals.includes(g) ? 'on' : ''}`} onClick={() => toggle('goals', g, 3)}>{g}</button>
                ))}
              </div>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <h1>Community guidelines</h1>
            <p className="lead">Short and simple — they keep the network genuine for everyone.</p>
            <ol style={{ paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
              {GUIDELINES[platform].map((g) => <li key={g}>{g}</li>)}
            </ol>
            <label className="tn-check" style={{ fontWeight: 700 }}>
              <input type="checkbox" checked={form.accepted} onChange={(e) => set({ accepted: e.target.checked })} /> I agree to follow these guidelines
            </label>
          </>
        )}
        {step === 6 && (
          <>
            <h1>Join the WhatsApp community</h1>
            <p className="lead">Daily tasks, reminders and updates from your community happen here.</p>
            <WhatsAppButton className="tn-btn green" label={d.joinedWhatsApp ? 'Open WhatsApp Community' : 'Join WhatsApp Community'} />
            <p className="tn-small" style={{ marginTop: 12 }}>You can also join later from the green button in your dashboard.</p>
          </>
        )}

        <div className="tn-wizard-foot">
          {step > 1 ? <button className="tn-btn" type="button" disabled={busy} onClick={() => { setError(''); setStep(step - 1) }}>Back</button> : <span />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {signedInAs && <span className="tn-small">Signed in with LinkedIn as {signedInAs}</span>}
            <button className="tn-btn gold" type="button" disabled={busy} onClick={onContinue}>
              {busy ? 'Saving…' : step === TOTAL ? 'Go to my dashboard' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepConnect({ platform, form, set }) {
  const d = useDash()
  const [liEnabled, setLiEnabled] = useState(null)
  const [linkError, setLinkError] = useState(() => {
    const p = new URLSearchParams(window.location.hash.replace(/^#/, '') || window.location.search)
    return p.get('error_description')?.replace(/\+/g, ' ') || ''
  })
  useEffect(() => { if (platform === 'linkedin') enabledProviders().then((p) => setLiEnabled(p.linkedin_oidc)) }, [platform])

  async function connectLinkedIn() {
    setLinkError('')
    const { error } = await supabase.auth.linkIdentity({ provider: 'linkedin_oidc', options: { redirectTo: siteUrl('/dashboard/setup') } })
    if (error) setLinkError(error.message)
  }

  if (platform === 'instagram') {
    return (
      <>
        <h1>Your Instagram account</h1>
        <p className="lead">Peers will see this handle on your posts.</p>
        <label className="tn-field"><span>Instagram handle</span>
          <input className="tn-input" value={form.profile_url} onChange={(e) => set({ profile_url: e.target.value })} placeholder="@yourname" maxLength={31} />
        </label>
      </>
    )
  }

  const connected = d.setup?.connected_name || d.linkedin?.name
  return (
    <>
      <h1>Connect your LinkedIn</h1>
      <p className="lead">So peers can find you and your posts are matched to your profile.</p>
      {linkError && <Notice tone="error">{linkError}</Notice>}
      {connected ? (
        <Notice tone="success"><Check size={14} style={{ verticalAlign: '-2px' }} /> Connected as <strong>{connected}</strong></Notice>
      ) : liEnabled ? (
        <button type="button" className="tn-li-btn" onClick={connectLinkedIn} style={{ marginBottom: 16 }}>
          <span className="tn-li-logo" aria-hidden>in</span> Sign in with LinkedIn
        </button>
      ) : null}
      <label className="tn-field"><span>LinkedIn profile link {connected || liEnabled ? '(recommended)' : ''}</span>
        <input className="tn-input" value={form.profile_url} onChange={(e) => set({ profile_url: e.target.value })} placeholder="https://www.linkedin.com/in/your-name" />
      </label>
    </>
  )
}
