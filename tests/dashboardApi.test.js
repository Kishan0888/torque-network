import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── tiny in-memory Supabase stand-in ─────────────────────────────────────
const tables = {}
let nextId = 1
function from(name) {
  const rows = (tables[name] ||= [])
  const f = []
  let op = 'select', payload, opts = {}, countMode = false, single = null, limitN = null, orderBy = []
  const api = {
    select(_cols, o) { if (o?.count) countMode = true; return api },
    eq(c, v) { f.push((r) => r[c] === v); return api },
    neq(c, v) { f.push((r) => r[c] !== v); return api },
    in(c, vs) { f.push((r) => vs.includes(r[c])); return api },
    gte(c, v) { f.push((r) => r[c] >= v); return api },
    lte(c, v) { f.push((r) => r[c] <= v); return api },
    order(c, o) { orderBy.push([c, o?.ascending !== false]); return api },
    limit(n) { limitN = n; return api },
    insert(p) { op = 'insert'; payload = p; return api },
    upsert(p, o) { op = 'upsert'; payload = p; opts = o || {}; return api },
    update(p) { op = 'update'; payload = p; return api },
    delete() { op = 'delete'; return api },
    maybeSingle() { single = 'maybe'; return run() },
    single() { single = 'one'; return run() },
    then(res, rej) { return run().then(res, rej) },
  }
  async function run() {
    const match = () => rows.filter((r) => f.every((fn) => fn(r)))
    let data
    if (op === 'insert') {
      const row = { id: `id${nextId++}`, created_at: new Date().toISOString(), status: 'pending', featured: false, ...payload }
      if (name === 'member_posts' && rows.some((r) => r.user_id === row.user_id && r.url === row.url)) return { data: null, error: { code: '23505', message: 'duplicate' } }
      rows.push(row); data = [row]
    } else if (op === 'upsert') {
      const keys = (opts.onConflict || 'id').split(',')
      data = (Array.isArray(payload) ? payload : [payload]).map((p) => {
        let row = rows.find((r) => keys.every((k) => r[k] === p[k]))
        if (row) Object.assign(row, p); else { row = { ...p }; rows.push(row) }
        return row
      })
    } else if (op === 'update') {
      data = match(); data.forEach((r) => Object.assign(r, payload))
    } else if (op === 'delete') {
      const del = match(); tables[name] = rows.filter((r) => !del.includes(r)); data = del
    } else {
      data = match()
      for (const [c, asc] of orderBy.reverse()) data = [...data].sort((a, b) => (a[c] > b[c] ? 1 : -1) * (asc ? 1 : -1))
      if (limitN) data = data.slice(0, limitN)
    }
    if (countMode) return { count: data.length, data: null, error: null }
    if (single) return { data: data[0] ?? null, error: single === 'one' && !data[0] ? { message: 'none' } : null }
    return { data, error: null }
  }
  return api
}
const EMAILS = { u1: 'priya@example.com', u2: 'rohan@example.com', u3: 'free@example.com' }
// public.complimentary_products(): free access by confirmed email, not expired.
const rpc = async (fn, args) => {
  if (fn !== 'complimentary_products') return { data: null, error: null }
  const email = EMAILS[args.p_user_id]
  const rows = (tables.complimentary_access || []).filter((c) => c.email === email && (!c.expires_at || c.expires_at > new Date().toISOString()))
  return { data: rows.map((c) => ({ product: c.product, expires_at: c.expires_at || null })), error: null }
}
const listUsers = async () => ({ data: { users: Object.entries(EMAILS).map(([id, email]) => ({ id, email, email_confirmed_at: '2026-11-01T00:00:00Z', last_sign_in_at: null })) } })
vi.mock('../api/_lib/supabaseAdmin.js', () => ({ supabaseAdmin: () => ({ from, rpc, auth: { admin: { listUsers } } }) }))

let currentUser
vi.mock('../api/_lib/auth.js', () => ({ requireUser: async () => currentUser }))

process.env.RAZORPAY_PLAN_ID = 'plan_IG'
process.env.RAZORPAY_LINKEDIN_PLAN_ID = 'plan_LI'
const dash = await import('../api/dashboard.js')
const admin = await import('../api/admin.js')

const future = new Date(Date.now() + 20 * 864e5).toISOString()
const call = async (mod, method, action, body, qs = '') => {
  const init = { method }
  if (body) init.body = JSON.stringify(body)
  const r = await mod[method](new Request(`https://x.test/api?action=${action}${qs}`, init))
  return { status: r.status, body: await r.json() }
}
const subscribe = (userId, plan) => tables.subscriptions.push({ user_id: userId, razorpay_subscription_id: `sub_${userId}_${plan}`, razorpay_plan_id: plan, status: 'active', current_end: future, created_at: new Date().toISOString() })

beforeEach(() => {
  for (const k of Object.keys(tables)) delete tables[k]
  Object.assign(tables, { complimentary_access: [], subscriptions: [], profiles: [{ id: 'u1', full_name: 'Priya Sharma' }, { id: 'u2', full_name: 'Rohan Mehta' }], member_platforms: [], member_profiles: [], member_posts: [], post_engagements: [], admins: [], resources: [], monthly_guides: [], payments: [] })
  currentUser = { id: 'u1', email: 'priya@example.com', identities: [] }
})

describe('member dashboard API', () => {
  it('bootstrap reports memberships per platform', async () => {
    subscribe('u1', 'plan_LI')
    const { status, body } = await call(dash, 'GET', 'bootstrap')
    expect(status).toBe(200)
    expect(body.memberships).toEqual({ linkedin: true, instagram: false })
    expect(body.user.name).toBe('Priya Sharma')
    expect(JSON.stringify(body)).not.toContain('plan_LI') // plan ids never sent to the browser
  })

  it('platform actions need that platform’s membership', async () => {
    subscribe('u1', 'plan_IG') // Instagram only
    expect((await call(dash, 'GET', 'timeline', null, '&platform=linkedin')).status).toBe(402)
    expect((await call(dash, 'POST', 'setup', { platform: 'linkedin', domain: 'Product' })).status).toBe(402)
    expect((await call(dash, 'GET', 'timeline', null, '&platform=instagram')).status).toBe(200)
  })

  it('setup validates domain and topics, and completes', async () => {
    subscribe('u1', 'plan_LI')
    expect((await call(dash, 'POST', 'setup', { platform: 'linkedin', domain: 'Astrology' })).status).toBe(400)
    expect((await call(dash, 'POST', 'setup', { platform: 'linkedin', domain: 'Marketing & Creative' })).status).toBe(200)
    expect((await call(dash, 'POST', 'setup', { platform: 'linkedin', interests: ['Not a topic'] })).status).toBe(400)
    const ok = await call(dash, 'POST', 'setup', { platform: 'linkedin', interests: ['Branding', 'Design'], goals: ['Get hired'], complete: true })
    expect(ok.status).toBe(200)
    expect(ok.body.platform.onboarded_at).toBeTruthy()
  })

  it('submit: needs setup, validates link, caps at 2 a week, rejects duplicates', async () => {
    subscribe('u1', 'plan_LI')
    const post = (n) => ({ platform: 'linkedin', url: `https://www.linkedin.com/posts/priya_t-activity-${n}`, category: 'Lessons learned', summary: 'A lesson' })
    expect((await call(dash, 'POST', 'submit', post(1))).body.code).toBe('setup_required')
    tables.member_platforms.push({ user_id: 'u1', platform: 'linkedin', domain: 'Marketing & Creative', interests: ['Branding'], onboarded_at: new Date().toISOString() })

    expect((await call(dash, 'POST', 'submit', { ...post(1), url: 'https://www.linkedin.com/in/priya' })).status).toBe(400)
    expect((await call(dash, 'POST', 'submit', { ...post(1), summary: 'x'.repeat(141) })).status).toBe(400)
    expect((await call(dash, 'POST', 'submit', post(1))).status).toBe(200)
    expect((await call(dash, 'POST', 'submit', post(1))).status).toBe(409) // duplicate
    expect((await call(dash, 'POST', 'submit', post(2))).status).toBe(200)
    const third = await call(dash, 'POST', 'submit', post(3))
    expect(third.status).toBe(429)
    expect(third.body.code).toBe('weekly_limit')
    expect(tables.member_posts.every((p) => p.status === 'pending' && p.domain === 'Marketing & Creative')).toBe(true)
  })

  it('timeline shows only approved peers’ posts from my domain/interests, never my own', async () => {
    subscribe('u1', 'plan_LI')
    tables.member_platforms.push(
      { user_id: 'u1', platform: 'linkedin', domain: 'Marketing & Creative', interests: ['Design'], onboarded_at: 'x' },
      { user_id: 'u2', platform: 'linkedin', domain: 'Finance & Banking', role_title: 'Analyst', experience: '1–3 yrs', onboarded_at: 'x' },
    )
    const now = new Date().toISOString()
    tables.member_posts.push(
      { id: 'a', user_id: 'u2', platform: 'linkedin', status: 'approved', domain: 'Marketing & Creative', topic: null, summary: 'same domain', url: 'u', category: 'Tools', reviewed_at: now },
      { id: 'b', user_id: 'u2', platform: 'linkedin', status: 'approved', domain: 'Finance & Banking', topic: 'Design', summary: 'my interest', url: 'u', category: 'Tools', reviewed_at: now },
      { id: 'c', user_id: 'u2', platform: 'linkedin', status: 'approved', domain: 'Finance & Banking', topic: 'Markets', summary: 'unrelated', url: 'u', category: 'Tools', reviewed_at: now },
      { id: 'd', user_id: 'u2', platform: 'linkedin', status: 'pending', domain: 'Marketing & Creative', summary: 'pending', url: 'u', category: 'Tools', reviewed_at: now },
      { id: 'e', user_id: 'u1', platform: 'linkedin', status: 'approved', domain: 'Marketing & Creative', summary: 'mine', url: 'u', category: 'Tools', reviewed_at: now },
      { id: 'f', user_id: 'u2', platform: 'instagram', status: 'approved', domain: 'Marketing & Creative', summary: 'other platform', url: 'u', category: 'Reel', reviewed_at: now },
    )
    const all = await call(dash, 'GET', 'timeline', null, '&platform=linkedin&filter=all')
    expect(all.body.posts.map((p) => p.id).sort()).toEqual(['a', 'b'])
    expect(all.body.posts[0].author.name).toBe('Rohan Mehta')
    const mine = await call(dash, 'GET', 'timeline', null, '&platform=linkedin&filter=domain')
    expect(mine.body.posts.map((p) => p.id)).toEqual(['a'])
  })
})

describe('client feedback: Instagram link-only posts, own categories, engagement analytics', () => {
  const now = () => new Date().toISOString()
  const setupBoth = () => {
    subscribe('u1', 'plan_LI'); subscribe('u1', 'plan_IG'); subscribe('u2', 'plan_LI'); subscribe('u2', 'plan_IG')
    for (const u of ['u1', 'u2']) {
      tables.member_platforms.push({ user_id: u, platform: 'linkedin', domain: 'Marketing & Creative', interests: [], onboarded_at: 'x' })
      tables.member_platforms.push({ user_id: u, platform: 'instagram', domain: 'Food & Cooking', interests: [], onboarded_at: 'x' })
    }
  }

  it('Instagram posts need only the link; LinkedIn accepts a member-typed category', async () => {
    setupBoth()
    const ig = await call(dash, 'POST', 'submit', { platform: 'instagram', url: 'https://www.instagram.com/reel/Cabc123/' })
    expect(ig.status).toBe(200)
    expect(ig.body.post).toMatchObject({ category: null, summary: null })
    const li = (category) => call(dash, 'POST', 'submit', { platform: 'linkedin', url: `https://www.linkedin.com/posts/p_t-activity-${category.length}`, category, summary: 'A lesson' })
    expect((await li('Product launch')).body.post.category).toBe('Product launch')
    expect((await li('<b>')).status).toBe(400)
    expect((await call(dash, 'POST', 'submit', { platform: 'linkedin', url: 'https://www.linkedin.com/posts/p_t-activity-99', category: 'Tools' })).status).toBe(400) // summary still required on LinkedIn
  })

  it('members mark peers’ posts engaged; analytics shows who engaged and what I have / haven’t engaged with', async () => {
    setupBoth()
    tables.member_posts.push(
      { id: '00000000-0000-4000-8000-00000000000a', user_id: 'u2', platform: 'linkedin', status: 'approved', domain: 'Marketing & Creative', summary: 'Rohan post A', url: 'ua', category: 'Tools', reviewed_at: now() },
      { id: '00000000-0000-4000-8000-00000000000b', user_id: 'u2', platform: 'linkedin', status: 'approved', domain: 'Marketing & Creative', summary: 'Rohan post B', url: 'ub', category: 'Tools', reviewed_at: now() },
      { id: '00000000-0000-4000-8000-00000000000c', user_id: 'u1', platform: 'linkedin', status: 'approved', domain: 'Marketing & Creative', summary: 'Priya post', url: 'uc', category: 'Tools', reviewed_at: now() },
      { id: '00000000-0000-4000-8000-00000000000d', user_id: 'u2', platform: 'linkedin', status: 'pending', domain: 'Marketing & Creative', summary: 'pending', url: 'ud', category: 'Tools', reviewed_at: now() },
    )
    const A = '00000000-0000-4000-8000-00000000000a', C = '00000000-0000-4000-8000-00000000000c', D = '00000000-0000-4000-8000-00000000000d'
    expect((await call(dash, 'POST', 'engage', { post_id: C })).status).toBe(400) // own post
    expect((await call(dash, 'POST', 'engage', { post_id: D })).status).toBe(404) // not approved
    expect((await call(dash, 'POST', 'engage', { post_id: A })).body.engaged).toBe(true)
    await call(dash, 'POST', 'engage', { post_id: A }) // idempotent
    expect(tables.post_engagements).toHaveLength(1)

    const todo = await call(dash, 'GET', 'timeline', null, '&platform=linkedin&filter=all&view=todo')
    expect(todo.body.posts.map((p) => p.summary)).toEqual(['Rohan post B'])
    expect(todo.body.counts).toEqual({ todo: 1, done: 1, all: 2 })

    // Rohan engages with Priya's post → Priya's analytics names him.
    currentUser = { id: 'u2', email: 'rohan@example.com', identities: [] }
    await call(dash, 'POST', 'engage', { post_id: C })
    currentUser = { id: 'u1', email: 'priya@example.com', identities: [] }
    const a = await call(dash, 'GET', 'analytics', null, '&platform=linkedin')
    expect(a.body.totals).toMatchObject({ received: 1, uniqueEngagers: 1, livePosts: 1, given: 1, feedDone: 1, feedTodo: 1 })
    expect(a.body.myPosts[0].engagers.map((e) => e.name)).toEqual(['Rohan Mehta'])
    expect(a.body.engaged.map((p) => p.summary)).toEqual(['Rohan post A'])
    expect(a.body.notEngaged.map((p) => p.summary)).toEqual(['Rohan post B'])

    // An Instagram engagement doesn't count on the LinkedIn analytics (and vice versa).
    const IG = '00000000-0000-4000-8000-0000000000e1'
    tables.member_posts.push({ id: IG, user_id: 'u2', platform: 'instagram', status: 'approved', url: 'https://www.instagram.com/reel/abc/', reviewed_at: now() })
    expect((await call(dash, 'POST', 'engage', { post_id: IG })).body.engaged).toBe(true)
    expect((await call(dash, 'GET', 'analytics', null, '&platform=linkedin')).body.totals.given).toBe(1)
    expect((await call(dash, 'GET', 'analytics', null, '&platform=instagram')).body.totals.given).toBe(1)

    // Undo
    expect((await call(dash, 'POST', 'engage', { post_id: A, engaged: false })).body.engaged).toBe(false)
    expect(tables.post_engagements.filter((r) => r.user_id === 'u1' && r.post_id === A)).toHaveLength(0)
  })

  it('WhatsApp joins are tracked per platform; Growth Playbook is empty for Instagram', async () => {
    setupBoth()
    tables.resources.push({ id: 'r1', platform: 'all', title: 'Video', youtube_url: 'https://youtu.be/abcdefghijk', published: true, sort_order: 0 })
    await call(dash, 'POST', 'whatsapp', { platform: 'instagram' })
    const rows = Object.fromEntries(tables.member_platforms.filter((r) => r.user_id === 'u1').map((r) => [r.platform, r.whatsapp_joined_at]))
    expect(rows.instagram).toBeTruthy()
    expect(rows.linkedin).toBeFalsy()
    expect((await call(dash, 'GET', 'resources', null, '&platform=instagram')).body.resources).toEqual([])
    expect((await call(dash, 'GET', 'resources', null, '&platform=linkedin')).body.resources).toHaveLength(1)
  })
})

describe('free (complimentary) access', () => {
  it('pulls clean, de-duplicated emails out of pasted text or a CSV', () => {
    const csv = 'Name,Phone,Email\nVinay,9.18E+11,KVinay01362@Gmail.com\n"Rashmi, R",91700,ranjan.p88@gmail.com\nDup,1,kvinay01362@gmail.com\nBad,2,not-an-email\n'
    expect(admin.parseEmails(csv)).toEqual(['kvinay01362@gmail.com', 'ranjan.p88@gmail.com'])
    expect(admin.parseEmails('a@x.com; b@y.co, <c@z.in>')).toEqual(['a@x.com', 'b@y.co', 'c@z.in'])
  })

  it('admin adds emails → that person gets the product with no payment; expired or other-product entries do not count', async () => {
    tables.admins.push({ user_id: 'u1' })
    // Not admin → refused
    currentUser = { id: 'u3', email: EMAILS.u3, identities: [] }
    expect((await call(admin, 'POST', 'free-access-add', { emails: 'x@y.com', product: 'linkedin' })).status).toBe(403)
    expect((await call(dash, 'GET', 'bootstrap')).body.memberships).toEqual({ linkedin: false, instagram: false })

    currentUser = { id: 'u1', email: EMAILS.u1, identities: [] }
    expect((await call(admin, 'POST', 'free-access-add', { emails: 'nothing here', product: 'linkedin' })).status).toBe(400)
    expect((await call(admin, 'POST', 'free-access-add', { emails: 'a@b.com', product: 'tiktok' })).status).toBe(400)
    const r = await call(admin, 'POST', 'free-access-add', { emails: 'FREE@example.com, someone@else.com', product: 'linkedin', note: 'Meta lead ad' })
    expect(r.body.added).toBe(2)
    expect(tables.complimentary_access.map((c) => c.email).sort()).toEqual(['free@example.com', 'someone@else.com'])

    const list = await call(admin, 'GET', 'free-access')
    const byEmail = Object.fromEntries(list.body.access.map((a) => [a.email, a]))
    expect(byEmail['free@example.com'].account).toBe('active')
    expect(byEmail['someone@else.com'].account).toBe('not_signed_up')

    currentUser = { id: 'u3', email: EMAILS.u3, identities: [] }
    const boot = await call(dash, 'GET', 'bootstrap')
    expect(boot.body.memberships).toEqual({ linkedin: true, instagram: false })
    expect(boot.body.complimentary).toEqual({ linkedin: { expires_at: null } })
    expect((await call(dash, 'GET', 'home', null, '&platform=linkedin')).status).toBe(200)
    expect((await call(dash, 'GET', 'home', null, '&platform=instagram')).status).toBe(402)

    // End date in the past → access ends.
    currentUser = { id: 'u1', email: EMAILS.u1, identities: [] }
    expect((await call(admin, 'POST', 'free-access-update', { email: 'free@example.com', product: 'linkedin', expires_at: '2026-01-01' })).status).toBe(200)
    currentUser = { id: 'u3', email: EMAILS.u3, identities: [] }
    expect((await call(dash, 'GET', 'bootstrap')).body.memberships.linkedin).toBe(false)

    // Removed → gone.
    currentUser = { id: 'u1', email: EMAILS.u1, identities: [] }
    await call(admin, 'POST', 'free-access-update', { email: 'free@example.com', product: 'linkedin', expires_at: null })
    expect((await call(admin, 'POST', 'free-access-remove', { email: 'free@example.com', product: 'linkedin' })).status).toBe(200)
    expect(tables.complimentary_access.map((c) => c.email)).toEqual(['someone@else.com'])
  })
})

describe('admin API', () => {
  it('is for admins only', async () => {
    expect((await call(admin, 'GET', 'posts')).status).toBe(403)
    tables.admins.push({ user_id: 'u1' })
    expect((await call(admin, 'GET', 'posts')).status).toBe(200)
  })

  it('approve / reject (reject needs a note) / spotlight', async () => {
    tables.admins.push({ user_id: 'u1' })
    tables.member_posts.push({ id: '00000000-0000-0000-0000-000000000001', user_id: 'u2', platform: 'linkedin', status: 'pending', featured: false })
    const id = '00000000-0000-0000-0000-000000000001'
    expect((await call(admin, 'POST', 'review', { id, status: 'rejected', note: '' })).status).toBe(400)
    const ok = await call(admin, 'POST', 'review', { id, status: 'approved', note: 'Great hook' })
    expect(ok.body.post).toMatchObject({ status: 'approved', moderator_note: 'Great hook', reviewed_by: 'u1' })
    expect((await call(admin, 'POST', 'review', { id, featured: true })).body.post.featured).toBe(true)
  })

  it('resources need a YouTube link; guides validate domain and month', async () => {
    tables.admins.push({ user_id: 'u1' })
    expect((await call(admin, 'POST', 'resource', { title: 'Hooks', youtube_url: 'https://vimeo.com/1' })).status).toBe(400)
    expect((await call(admin, 'POST', 'resource', { title: 'Hooks', youtube_url: 'https://youtu.be/dQw4w9WgXcQ', platform: 'linkedin' })).status).toBe(200)
    expect((await call(admin, 'POST', 'guide', { platform: 'linkedin', domain: 'Nope', month: '2026-11' })).status).toBe(400)
    const g = await call(admin, 'POST', 'guide', { platform: 'linkedin', domain: 'Product', month: '2026-11', theme: 'Launches', weeks: [{ focus: 'Lessons', suggested: 'A launch you learned from' }, { focus: '', suggested: '' }], published: true })
    expect(g.status).toBe(200)
    expect(g.body.guide).toMatchObject({ month: '2026-11-01', weeks: [{ week: 'Week 1', focus: 'Lessons', suggested: 'A launch you learned from' }] })
  })
})
