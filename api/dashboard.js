/**
 * /api/dashboard?action=…  — member dashboard (one function to stay within
 * Vercel's function limits). Every action requires a verified user; actions
 * on a platform also require an active membership for that platform.
 *
 * GET  bootstrap                         profile, memberships, setup state
 * POST setup        { platform, step… }  save setup-wizard answers
 * POST checklist    { platform, key, done }
 * POST whatsapp                          mark WhatsApp community joined
 * GET  home         ?platform=
 * POST submit       { platform, url, category, topic, summary }
 * GET  timeline     ?platform=&filter=
 * GET  my-posts     ?platform=
 * GET  resources    ?platform=
 * GET  guides       ?platform=
 * GET  billing                           payments + invoice availability
 * GET  invoice      ?payment=pay_…       Razorpay invoice link for own payment
 */
import { handle, json, HttpError, readOptionalJson } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { entitlements, requirePlatform, isAdmin, displayName, linkedinIdentity } from './_lib/members.js'
import { razorpayConfig } from './_lib/env.js'
import {
  DOMAINS, CATEGORIES, EXPERIENCE, GOALS, CHECKLIST, PLATFORMS, WEEKLY_POST_LIMIT, SUMMARY_MAX,
  normalizePostUrl, normalizeProfile, weekStart, weekLabel, weekStreak, monthKey, dailyShuffle,
} from '../shared/memberConfig.js'

const db = () => supabaseAdmin()

async function getPlatformRow(userId, platform) {
  const { data, error } = await db().from('member_platforms').select('*').eq('user_id', userId).eq('platform', platform).maybeSingle()
  if (error) throw error
  return data
}

function str(v, max) {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}

// ── actions ────────────────────────────────────────────────────────────────

async function bootstrap(user) {
  const [ent, profileRes, memberRes, platformsRes, admin] = await Promise.all([
    entitlements(user.id),
    db().from('profiles').select('full_name, phone').eq('id', user.id).maybeSingle(),
    db().from('member_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    db().from('member_platforms').select('*').eq('user_id', user.id),
    isAdmin(user.id),
  ])
  for (const r of [profileRes, memberRes, platformsRes]) if (r.error) throw r.error
  const platforms = Object.fromEntries((platformsRes.data || []).map((p) => [p.platform, p]))
  return {
    user: { id: user.id, email: user.email, name: displayName(profileRes.data, user) },
    memberships: { linkedin: ent.linkedin, instagram: ent.instagram },
    subscriptions: ent.rows.map(({ razorpay_plan_id: _p, razorpay_subscription_id: _s, ...rest }) => rest),
    member: memberRes.data || null,
    platforms,
    linkedin: linkedinIdentity(user),
    isAdmin: admin,
  }
}

async function setup(user, body) {
  const platform = body.platform
  await requirePlatform(user.id, platform)
  const row = { user_id: user.id, platform }

  if ('domain' in body) {
    if (!Object.keys(DOMAINS[platform]).includes(body.domain)) throw new HttpError(400, 'Choose a domain from the list.')
    row.domain = body.domain
  }
  if ('role_title' in body) row.role_title = str(body.role_title, 80)
  if ('experience' in body) {
    if (body.experience && !EXPERIENCE.includes(body.experience)) throw new HttpError(400, 'Choose your experience.')
    row.experience = body.experience || null
  }
  if ('interests' in body) {
    const existing = await getPlatformRow(user.id, platform)
    const domain = row.domain || existing?.domain
    const allowed = new Set(Object.values(DOMAINS[platform]).flat())
    const interests = [...new Set((body.interests || []).filter((i) => allowed.has(i)))].slice(0, 8)
    if (domain && interests.length === 0) throw new HttpError(400, 'Pick at least one interest.')
    row.interests = interests
  }
  if ('goals' in body) row.goals = [...new Set((body.goals || []).filter((g) => GOALS[platform].includes(g)))].slice(0, 6)
  if ('profile_url' in body) {
    if (body.profile_url) {
      const clean = normalizeProfile(platform, body.profile_url)
      if (!clean) throw new HttpError(400, platform === 'linkedin' ? 'Enter your LinkedIn profile link, e.g. https://www.linkedin.com/in/your-name' : 'Enter your Instagram handle, e.g. @yourname')
      row.profile_url = clean
    } else row.profile_url = null
  }
  if (body.connect_linkedin && platform === 'linkedin') {
    const li = linkedinIdentity(user)
    if (!li) throw new HttpError(400, 'LinkedIn is not connected yet.')
    row.connected_name = str(li.name, 120)
    row.connected_at = new Date().toISOString()
  }
  if (body.complete) row.onboarded_at = new Date().toISOString()

  const { data, error } = await db().from('member_platforms').upsert(row, { onConflict: 'user_id,platform' }).select('*').single()
  if (error) throw error

  if (body.accept_guidelines || body.complete) {
    const patch = { user_id: user.id }
    if (body.accept_guidelines) patch.guidelines_accepted_at = new Date().toISOString()
    const { error: e2 } = await db().from('member_profiles').upsert(patch, { onConflict: 'user_id' })
    if (e2) throw e2
  }
  return { platform: data }
}

async function checklist(user, body) {
  const { platform, key, done } = body
  await requirePlatform(user.id, platform)
  if (!CHECKLIST[platform].some(([k]) => k === key)) throw new HttpError(400, 'Unknown checklist item.')
  const existing = await getPlatformRow(user.id, platform)
  const next = { ...(existing?.checklist || {}), [key]: Boolean(done) }
  const { error } = await db().from('member_platforms').upsert({ user_id: user.id, platform, checklist: next }, { onConflict: 'user_id,platform' })
  if (error) throw error
  return { checklist: next }
}

async function whatsapp(user) {
  const ent = await entitlements(user.id)
  if (!ent.linkedin && !ent.instagram) throw new HttpError(402, 'An active membership is required.')
  const now = new Date().toISOString()
  const { data: existing } = await db().from('member_profiles').select('whatsapp_joined_at').eq('user_id', user.id).maybeSingle()
  if (existing?.whatsapp_joined_at) return { whatsapp_joined_at: existing.whatsapp_joined_at }
  const { error } = await db().from('member_profiles').upsert({ user_id: user.id, whatsapp_joined_at: now }, { onConflict: 'user_id' })
  if (error) throw error
  return { whatsapp_joined_at: now }
}

async function postsThisWeek(userId, platform) {
  const { count, error } = await db()
    .from('member_posts').select('id', { count: 'exact', head: true })
    .eq('user_id', userId).eq('platform', platform).gte('created_at', weekStart().toISOString())
  if (error) throw error
  return count || 0
}

async function home(user, platform) {
  await requirePlatform(user.id, platform)
  const me = await getPlatformRow(user.id, platform)
  const start = weekStart()
  const since = new Date(Date.now() - 7 * 86400000).toISOString()
  const [used, timelineCount, guide, spotlight] = await Promise.all([
    postsThisWeek(user.id, platform),
    me?.domain
      ? db().from('member_posts').select('id', { count: 'exact', head: true })
          .eq('platform', platform).eq('status', 'approved').eq('domain', me.domain).neq('user_id', user.id).gte('reviewed_at', since)
      : Promise.resolve({ count: 0 }),
    me?.domain
      ? db().from('monthly_guides').select('id, month, theme').eq('platform', platform).eq('domain', me.domain).eq('month', monthKey()).eq('published', true).maybeSingle()
      : Promise.resolve({ data: null }),
    db().from('member_posts').select('id, user_id, domain, summary, url, reviewed_at').eq('platform', platform).eq('status', 'approved').eq('featured', true)
      .order('reviewed_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  let spot = null
  if (spotlight.data) {
    const { data: p } = await db().from('profiles').select('full_name').eq('id', spotlight.data.user_id).maybeSingle()
    spot = { name: p?.full_name || 'A member', domain: spotlight.data.domain, summary: spotlight.data.summary, url: spotlight.data.url }
  }
  return {
    week: { label: weekLabel(start), used, limit: WEEKLY_POST_LIMIT },
    timelineNew: timelineCount.count || 0,
    guide: guide.data || null,
    spotlight: spot,
  }
}

async function submit(user, body) {
  const { platform } = body
  await requirePlatform(user.id, platform)
  const me = await getPlatformRow(user.id, platform)
  if (!me?.onboarded_at) throw new HttpError(400, 'Finish setting up your profile first.', { code: 'setup_required' })

  const url = normalizePostUrl(platform, body.url)
  if (!url) {
    throw new HttpError(400, platform === 'linkedin'
      ? 'Paste the link of a published LinkedIn post (linkedin.com/posts/… or linkedin.com/feed/update/…).'
      : 'Paste the link of a published Instagram post or reel (instagram.com/p/… or instagram.com/reel/…).')
  }
  if (!CATEGORIES[platform].includes(body.category)) throw new HttpError(400, 'Choose a category.')
  const topic = body.topic ? String(body.topic) : null
  if (topic && !Object.values(DOMAINS[platform]).flat().includes(topic)) throw new HttpError(400, 'Choose a topic from the list.')
  const summary = String(body.summary || '').trim()
  if (!summary) throw new HttpError(400, 'Add a one-line summary.')
  if (summary.length > SUMMARY_MAX) throw new HttpError(400, `Keep the summary under ${SUMMARY_MAX} characters.`)

  const used = await postsThisWeek(user.id, platform)
  if (used >= WEEKLY_POST_LIMIT) {
    throw new HttpError(429, `You've used both submissions for this week. New slots open on Monday.`, { code: 'weekly_limit' })
  }

  const { data, error } = await db().from('member_posts')
    .insert({ user_id: user.id, platform, url, category: body.category, topic, summary, domain: me.domain })
    .select('id, url, category, topic, summary, status, created_at').single()
  if (error) {
    if (error.code === '23505') throw new HttpError(409, 'You have already submitted this post.')
    throw error
  }
  return { post: data, used: used + 1, limit: WEEKLY_POST_LIMIT }
}

async function timeline(user, platform, filter) {
  await requirePlatform(user.id, platform)
  const me = await getPlatformRow(user.id, platform)
  const interests = me?.interests || []
  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const { data: posts, error } = await db().from('member_posts')
    .select('id, user_id, url, category, topic, summary, domain, reviewed_at')
    .eq('platform', platform).eq('status', 'approved').neq('user_id', user.id).gte('reviewed_at', since)
    .order('reviewed_at', { ascending: false }).limit(300)
  if (error) throw error

  let list = posts
  if (filter === 'domain') list = list.filter((p) => p.domain && p.domain === me?.domain)
  else if (filter && filter !== 'all') list = list.filter((p) => p.topic === filter)
  else list = list.filter((p) => (me?.domain && p.domain === me.domain) || (p.topic && interests.includes(p.topic)))
  list = dailyShuffle(list, `${user.id}:${new Date().toISOString().slice(0, 10)}`).slice(0, 60)

  const ids = [...new Set(list.map((p) => p.user_id))]
  const [profiles, plats] = ids.length
    ? await Promise.all([
        db().from('profiles').select('id, full_name').in('id', ids),
        db().from('member_platforms').select('user_id, role_title, experience').eq('platform', platform).in('user_id', ids),
      ])
    : [{ data: [] }, { data: [] }]
  const nameById = Object.fromEntries((profiles.data || []).map((p) => [p.id, p.full_name]))
  const platById = Object.fromEntries((plats.data || []).map((p) => [p.user_id, p]))

  return {
    filters: ['all', 'domain', ...interests],
    posts: list.map((p) => ({
      id: p.id, url: p.url, category: p.category, topic: p.topic, summary: p.summary, domain: p.domain, approved_at: p.reviewed_at,
      author: { name: nameById[p.user_id] || 'Member', role: platById[p.user_id]?.role_title || null, experience: platById[p.user_id]?.experience || null },
    })),
  }
}

async function myPosts(user, platform) {
  await requirePlatform(user.id, platform)
  const { data, error } = await db().from('member_posts')
    .select('id, url, category, topic, summary, status, moderator_note, created_at')
    .eq('user_id', user.id).eq('platform', platform).order('created_at', { ascending: false }).limit(200)
  if (error) throw error
  return {
    posts: data,
    stats: {
      total: data.length,
      approved: data.filter((p) => p.status === 'approved').length,
      streak: weekStreak(data.map((p) => p.created_at)),
    },
  }
}

async function resources(user, platform) {
  await requirePlatform(user.id, platform)
  const { data, error } = await db().from('resources').select('id, title, youtube_url, duration, sort_order')
    .in('platform', ['all', platform]).eq('published', true).order('sort_order').order('created_at')
  if (error) throw error
  return { resources: data }
}

async function guides(user, platform) {
  await requirePlatform(user.id, platform)
  const me = await getPlatformRow(user.id, platform)
  if (!me?.domain) return { domain: null, current: null, past: [] }
  const { data, error } = await db().from('monthly_guides').select('id, month, theme, weeks, also_inside, pdf_url')
    .eq('platform', platform).eq('domain', me.domain).eq('published', true).lte('month', monthKey())
    .order('month', { ascending: false }).limit(13)
  if (error) throw error
  return { domain: me.domain, month: monthKey(), guides: data }
}

async function billing(user) {
  const ent = await entitlements(user.id)
  const { data, error } = await db().from('payments')
    .select('razorpay_payment_id, razorpay_subscription_id, razorpay_invoice_id, amount, currency, status, method, created_at')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(36)
  if (error) throw error
  const productBySub = Object.fromEntries(ent.rows.map((r) => [r.razorpay_subscription_id, r.product]))
  return {
    payments: data.map((p) => ({
      id: p.razorpay_payment_id, amount: p.amount, currency: p.currency, status: p.status, method: p.method,
      created_at: p.created_at, product: productBySub[p.razorpay_subscription_id] || null, hasInvoice: Boolean(p.razorpay_invoice_id),
    })),
  }
}

async function invoice(user, paymentId) {
  const { data: pay, error } = await db().from('payments').select('razorpay_invoice_id')
    .eq('user_id', user.id).eq('razorpay_payment_id', String(paymentId || '')).maybeSingle()
  if (error) throw error
  if (!pay?.razorpay_invoice_id) throw new HttpError(404, 'No invoice is available for this payment yet.')
  const { keyId, keySecret } = razorpayConfig()
  const res = await fetch(`https://api.razorpay.com/v1/invoices/${encodeURIComponent(pay.razorpay_invoice_id)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
  })
  const inv = await res.json().catch(() => ({}))
  if (!res.ok || !inv.short_url) throw new HttpError(502, 'Could not fetch the invoice right now. Please try again.')
  return { url: inv.short_url }
}

// ── router ─────────────────────────────────────────────────────────────────

const platformParam = (url) => {
  const p = url.searchParams.get('platform')
  if (!PLATFORMS.includes(p)) throw new HttpError(400, 'Unknown platform.')
  return p
}

export const GET = handle(async (request) => {
  const user = await requireUser(request)
  const url = new URL(request.url)
  switch (url.searchParams.get('action')) {
    case 'bootstrap': return json(await bootstrap(user))
    case 'home': return json(await home(user, platformParam(url)))
    case 'timeline': return json(await timeline(user, platformParam(url), url.searchParams.get('filter')))
    case 'my-posts': return json(await myPosts(user, platformParam(url)))
    case 'resources': return json(await resources(user, platformParam(url)))
    case 'guides': return json(await guides(user, platformParam(url)))
    case 'billing': return json(await billing(user))
    case 'invoice': return json(await invoice(user, url.searchParams.get('payment')))
    default: throw new HttpError(404, 'Unknown action.')
  }
})

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  const action = new URL(request.url).searchParams.get('action')
  const body = await readOptionalJson(request)
  switch (action) {
    case 'setup': return json(await setup(user, body))
    case 'checklist': return json(await checklist(user, body))
    case 'whatsapp': return json(await whatsapp(user))
    case 'submit': return json(await submit(user, body))
    default: throw new HttpError(404, 'Unknown action.')
  }
})
