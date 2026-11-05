/**
 * Member-dashboard settings shared by the browser (src/dashboard) and the
 * server (api/dashboard.js, api/admin.js), so validation always agrees.
 * Plain data + pure functions only.
 */

export const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/D70kr3FVW8TL3EI0E9c6aR'
export const WEEKLY_POST_LIMIT = 2
export const SUMMARY_MAX = 140

export const PLATFORMS = ['linkedin', 'instagram']
export const PLATFORM_LABEL = { linkedin: 'LinkedIn', instagram: 'Instagram' }

/** Domains (LinkedIn) / niches (Instagram) and the topics members can follow in each. */
export const DOMAINS = {
  linkedin: {
    'HR & Talent': ['Hiring', 'Employer branding', 'Culture', 'L&D', 'HR tech'],
    'Finance & Banking': ['Personal finance', 'Markets', 'Fintech', 'Accounting', 'Banking careers'],
    'Sales & BD': ['Prospecting', 'Negotiation', 'Partnerships', 'Sales tools', 'Client success'],
    'Marketing & Creative': ['Content marketing', 'Branding', 'Performance ads', 'Design', 'Social media'],
    'IT & Software': ['Engineering', 'Cloud & DevOps', 'Career in tech', 'Open source', 'Security'],
    'Data & AI': ['AI tools', 'Analytics', 'Machine learning', 'Data careers', 'Automation'],
    Product: ['Product strategy', 'UX research', 'Roadmaps', 'Launches', 'PM careers'],
    Consulting: ['Strategy', 'Operations', 'Client management', 'Frameworks', 'Consulting careers'],
    'Healthcare & Pharma': ['Healthcare marketing', 'Hospital ops', 'Pharma sales', 'Health tech', 'Medical careers'],
  },
  instagram: {
    'Food & Cooking': ['Recipes', 'Restaurant reviews', 'Street food', 'Healthy eating', 'Baking'],
    'Travel': ['India travel', 'International', 'Budget travel', 'Luxury stays', 'Travel tips'],
    'Fashion & Beauty': ['Outfits', 'Skincare', 'Makeup', 'Styling tips', 'Brands'],
    'Fitness & Health': ['Workouts', 'Nutrition', 'Yoga', 'Transformations', 'Wellness'],
    'Tech & Gadgets': ['Reviews', 'Unboxing', 'Apps', 'Tips & tricks', 'AI tools'],
    'Comedy & Entertainment': ['Skits', 'Relatable', 'Memes', 'Pop culture', 'Reactions'],
    'Lifestyle & Vlogs': ['Day in my life', 'Home & decor', 'Productivity', 'Relationships', 'Self growth'],
    'Education & Careers': ['Exam prep', 'Career advice', 'Finance basics', 'Skills', 'Study tips'],
    'Music & Dance': ['Covers', 'Original music', 'Dance', 'Behind the scenes', 'Tutorials'],
  },
}

export const CATEGORIES = {
  linkedin: ['Lessons learned', 'Tools', 'Career', 'Opinion', 'How-to', 'Story', 'Industry news'],
  instagram: ['Reel', 'Carousel', 'Tutorial', 'Story-time', 'Review', 'Behind the scenes', 'Collaboration'],
}

export const EXPERIENCE = ['0–1 yrs', '1–3 yrs', '3–5 yrs', '5–10 yrs', '10+ yrs']

export const GOALS = {
  linkedin: ['Build credibility', 'Grow my network', 'Get hired', 'Win clients', 'Thought leadership', 'Learn from peers'],
  instagram: ['Grow followers', 'Better reach', 'Brand deals', 'Build a community', 'Post consistently', 'Learn from peers'],
}

export const CHECKLIST = {
  linkedin: [
    ['headline', 'Headline says what you do and for whom'],
    ['photo', 'Professional photo and banner'],
    ['about', 'About section with a clear story'],
    ['featured', '2 featured posts pinned'],
    ['skills', 'Skills updated for your domain'],
  ],
  instagram: [
    ['bio', 'Bio says what you post and for whom'],
    ['photo', 'Clear profile photo'],
    ['highlights', 'Story highlights organised'],
    ['pinned', '3 best posts pinned'],
    ['link', 'Link in bio set up'],
  ],
}

export const GUIDELINES = {
  linkedin: [
    'Submit only posts you have already published, and that are your own work.',
    'Keep it relevant to your industry — no generic motivation or reshares.',
    'No engagement bait ("Agree? Comment below", "Like if…").',
    'Engage genuinely with peers’ posts on LinkedIn — no automation or pods.',
    'Up to 2 submissions a week, so every member gets seen.',
  ],
  instagram: [
    'Submit only posts or reels you have already published, and that are your own work.',
    'Keep content original — no reposts of other creators.',
    'No engagement bait ("Follow for follow", "Comment to win").',
    'Engage genuinely with peers’ posts — no bots or automation.',
    'Up to 2 submissions a week, so every member gets seen.',
  ],
}

// ── validation ───────────────────────────────────────────────────────────

const LINKEDIN_POST = /^https:\/\/(www\.)?linkedin\.com\/(posts\/[^\s/?#]+|feed\/update\/urn:li:(activity|share|ugcPost):\d+|pulse\/[^\s/?#]+)\/?([?#][^\s]*)?$/i
const INSTAGRAM_POST = /^https:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?([?#][^\s]*)?$/i

/** Returns a cleaned post URL, or null if it isn't a published post link for that platform. */
export function normalizePostUrl(platform, raw) {
  const value = String(raw || '').trim()
  if (value.length > 500) return null
  const re = platform === 'linkedin' ? LINKEDIN_POST : platform === 'instagram' ? INSTAGRAM_POST : null
  if (!re || !re.test(value)) return null
  const url = new URL(value)
  url.hash = ''
  // Drop tracking parameters; keep the canonical path.
  url.search = ''
  url.hostname = url.hostname.toLowerCase().replace(/^linkedin\.com$/, 'www.linkedin.com').replace(/^instagram\.com$/, 'www.instagram.com')
  return url.toString().replace(/\/$/, '')
}

const LINKEDIN_PROFILE = /^https:\/\/(www\.|[a-z]{2}\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/i
const INSTAGRAM_HANDLE = /^@?[A-Za-z0-9._]{1,30}$/

/** LinkedIn profile URL or Instagram handle; returns cleaned value or null. */
export function normalizeProfile(platform, raw) {
  const value = String(raw || '').trim()
  if (!value) return null
  if (platform === 'linkedin') return LINKEDIN_PROFILE.test(value) ? value.replace(/\/$/, '') : null
  if (platform === 'instagram') return INSTAGRAM_HANDLE.test(value) ? '@' + value.replace(/^@/, '') : null
  return null
}

// ── weeks (India time, Monday start) ──────────────────────────────────────

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

/** Start of the current Monday-to-Sunday week in IST, as a UTC Date. */
export function weekStart(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET_MS)
  const day = (ist.getUTCDay() + 6) % 7 // Monday = 0
  const mondayIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - day)
  return new Date(mondayIst - IST_OFFSET_MS)
}

/** Monday–Sunday label for a week start, e.g. "Mon 26 Oct – Sun 1 Nov". */
export function weekLabel(start) {
  const fmt = (d) => new Date(d.getTime() + IST_OFFSET_MS).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
  return `${fmt(start)} – ${fmt(new Date(start.getTime() + 6 * 86400000))}`
}

/** Consecutive weeks (ending this week or last week) with at least one submission. */
export function weekStreak(dates, now = new Date()) {
  const weeks = new Set(dates.map((d) => weekStart(new Date(d)).getTime()))
  let cursor = weekStart(now).getTime()
  if (!weeks.has(cursor)) cursor -= 7 * 86400000 // this week not posted yet: count from last week
  let streak = 0
  while (weeks.has(cursor)) {
    streak++
    cursor -= 7 * 86400000
  }
  return streak
}

/** First day of the month in IST, as YYYY-MM-01. */
export function monthKey(now = new Date()) {
  const ist = new Date(now.getTime() + IST_OFFSET_MS)
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, '0')}-01`
}

/** Deterministic daily shuffle so every member's post gets seen, but the order is stable within a day. */
export function dailyShuffle(items, seedText) {
  let seed = 0
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** YouTube video id from common URL shapes, or null. */
export function youtubeId(url) {
  const m = String(url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
