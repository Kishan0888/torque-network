/**
 * /api/admin?action=…  — team admin panel. Every action requires a verified
 * user listed in public.admins.
 *
 * GET  posts      ?status=pending|approved|rejected&platform=
 * POST review     { id, status: approved|rejected, note, featured }
 * GET  resources
 * POST resource   { id?, platform, title, youtube_url, duration, sort_order, published }
 * POST resource-delete { id }
 * GET  guides     ?platform=&domain=
 * POST guide      { id?, platform, domain, month: "YYYY-MM", theme, weeks[], also_inside, pdf_url, published }
 * POST guide-delete { id }
 * GET  members
 * GET  leads      ?status=
 * POST lead-status { id, status }
 */
import { handle, json, HttpError, readOptionalJson } from './_lib/http.js'
import { requireUser } from './_lib/auth.js'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { requireAdmin, entitlements } from './_lib/members.js'
import { DOMAINS, PLATFORMS, youtubeId } from '../shared/memberConfig.js'

const db = () => supabaseAdmin()
const str = (v, max) => {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}
const UUID = /^[0-9a-f-]{36}$/i

async function posts(url) {
  const status = url.searchParams.get('status') || 'pending'
  if (!['pending', 'approved', 'rejected'].includes(status)) throw new HttpError(400, 'Unknown status.')
  let q = db().from('member_posts').select('*').eq('status', status)
  const platform = url.searchParams.get('platform')
  if (PLATFORMS.includes(platform)) q = q.eq('platform', platform)
  q = status === 'pending' ? q.order('created_at', { ascending: true }) : q.order('reviewed_at', { ascending: false })
  const { data, error } = await q.limit(200)
  if (error) throw error
  const ids = [...new Set(data.map((p) => p.user_id))]
  const { data: profiles } = ids.length ? await db().from('profiles').select('id, full_name').in('id', ids) : { data: [] }
  const names = Object.fromEntries((profiles || []).map((p) => [p.id, p.full_name]))
  return { posts: data.map((p) => ({ ...p, author: names[p.user_id] || null })) }
}

async function review(admin, body) {
  if (!UUID.test(body.id || '')) throw new HttpError(400, 'Missing post.')
  const patch = {}
  if (body.status !== undefined) {
    if (!['approved', 'rejected', 'pending'].includes(body.status)) throw new HttpError(400, 'Unknown status.')
    patch.status = body.status
    patch.reviewed_by = body.status === 'pending' ? null : admin.id
    patch.reviewed_at = body.status === 'pending' ? null : new Date().toISOString()
    if (body.status === 'rejected' && !str(body.note, 300)) throw new HttpError(400, 'Add a short note so the member knows what to change.')
  }
  if (body.note !== undefined) patch.moderator_note = str(body.note, 300)
  if (body.featured !== undefined) patch.featured = Boolean(body.featured)
  const { data, error } = await db().from('member_posts').update(patch).eq('id', body.id).select('*').single()
  if (error) throw error
  return { post: data }
}

async function resources() {
  const { data, error } = await db().from('resources').select('*').order('platform').order('sort_order').order('created_at')
  if (error) throw error
  return { resources: data }
}

async function saveResource(body) {
  const row = {
    platform: ['all', ...PLATFORMS].includes(body.platform) ? body.platform : 'all',
    title: str(body.title, 120),
    youtube_url: str(body.youtube_url, 300),
    duration: str(body.duration, 10),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0,
    published: body.published !== false,
  }
  if (!row.title) throw new HttpError(400, 'Add a title.')
  if (!youtubeId(row.youtube_url)) throw new HttpError(400, 'Paste a YouTube video link (youtube.com/watch?v=… or youtu.be/…).')
  const q = body.id
    ? db().from('resources').update(row).eq('id', body.id)
    : db().from('resources').insert(row)
  const { data, error } = await q.select('*').single()
  if (error) throw error
  return { resource: data }
}

async function deleteRow(table, id) {
  if (!UUID.test(id || '')) throw new HttpError(400, 'Missing id.')
  const { error } = await db().from(table).delete().eq('id', id)
  if (error) throw error
  return { deleted: true }
}

async function guides(url) {
  let q = db().from('monthly_guides').select('*')
  const platform = url.searchParams.get('platform')
  const domain = url.searchParams.get('domain')
  if (PLATFORMS.includes(platform)) q = q.eq('platform', platform)
  if (domain) q = q.eq('domain', domain)
  const { data, error } = await q.order('month', { ascending: false }).order('domain').limit(300)
  if (error) throw error
  return { guides: data }
}

async function saveGuide(body) {
  if (!PLATFORMS.includes(body.platform)) throw new HttpError(400, 'Choose a platform.')
  if (!Object.keys(DOMAINS[body.platform]).includes(body.domain)) throw new HttpError(400, 'Choose a domain.')
  if (!/^\d{4}-\d{2}$/.test(body.month || '')) throw new HttpError(400, 'Choose a month.')
  const weeks = (Array.isArray(body.weeks) ? body.weeks : [])
    .map((w, i) => ({ week: str(w.week, 20) || `Week ${i + 1}`, focus: str(w.focus, 60), suggested: str(w.suggested, 200) }))
    .filter((w) => w.focus || w.suggested)
    .slice(0, 6)
  const pdf = str(body.pdf_url, 500)
  if (pdf && !/^https:\/\//i.test(pdf)) throw new HttpError(400, 'The PDF link must start with https://')
  const row = {
    platform: body.platform, domain: body.domain, month: `${body.month}-01`,
    theme: str(body.theme, 200), weeks, also_inside: str(body.also_inside, 300), pdf_url: pdf, published: Boolean(body.published),
  }
  const q = body.id
    ? db().from('monthly_guides').update(row).eq('id', body.id)
    : db().from('monthly_guides').upsert(row, { onConflict: 'platform,domain,month' })
  const { data, error } = await q.select('*').single()
  if (error) throw error
  return { guide: data }
}

async function members() {
  const [profiles, plats, mem, users] = await Promise.all([
    db().from('profiles').select('id, full_name, phone, created_at').order('created_at', { ascending: false }).limit(500),
    db().from('member_platforms').select('user_id, platform, domain, role_title, profile_url, connected_name, onboarded_at'),
    db().from('member_profiles').select('user_id, whatsapp_joined_at'),
    db().auth.admin.listUsers({ perPage: 1000 }),
  ])
  for (const r of [profiles, plats, mem]) if (r.error) throw r.error
  const emails = Object.fromEntries((users.data?.users || []).map((u) => [u.id, u.email]))
  const platsBy = {}
  for (const p of plats.data) (platsBy[p.user_id] ||= []).push(p)
  const memBy = Object.fromEntries(mem.data.map((m) => [m.user_id, m]))
  const rows = await Promise.all(profiles.data.map(async (p) => {
    const ent = await entitlements(p.id)
    return {
      id: p.id, name: p.full_name, email: emails[p.id] || null, phone: p.phone, joined: p.created_at,
      linkedin: ent.linkedin, instagram: ent.instagram,
      platforms: platsBy[p.id] || [], whatsapp_joined_at: memBy[p.id]?.whatsapp_joined_at || null,
    }
  }))
  return { members: rows }
}

const LEAD_STATUSES = ['new', 'contacted', 'converted', 'not_interested']
async function leads(url) {
  let q = db().from('leads').select('*').order('created_at', { ascending: false }).limit(1000)
  const status = url.searchParams.get('status')
  if (LEAD_STATUSES.includes(status)) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return { leads: data }
}
async function leadStatus(body) {
  if (!UUID.test(body.id || '')) throw new HttpError(400, 'Missing lead.')
  if (!LEAD_STATUSES.includes(body.status)) throw new HttpError(400, 'Unknown status.')
  const { data, error } = await db().from('leads').update({ status: body.status }).eq('id', body.id).select('*').single()
  if (error) throw error
  return { lead: data }
}

export const GET = handle(async (request) => {
  const user = await requireUser(request)
  await requireAdmin(user.id)
  const url = new URL(request.url)
  switch (url.searchParams.get('action')) {
    case 'posts': return json(await posts(url))
    case 'resources': return json(await resources())
    case 'guides': return json(await guides(url))
    case 'members': return json(await members())
    case 'leads': return json(await leads(url))
    default: throw new HttpError(404, 'Unknown action.')
  }
})

export const POST = handle(async (request) => {
  const user = await requireUser(request)
  await requireAdmin(user.id)
  const action = new URL(request.url).searchParams.get('action')
  const body = await readOptionalJson(request)
  switch (action) {
    case 'review': return json(await review(user, body))
    case 'resource': return json(await saveResource(body))
    case 'resource-delete': return json(await deleteRow('resources', body.id))
    case 'guide': return json(await saveGuide(body))
    case 'guide-delete': return json(await deleteRow('monthly_guides', body.id))
    case 'lead-status': return json(await leadStatus(body))
    default: throw new HttpError(404, 'Unknown action.')
  }
})
