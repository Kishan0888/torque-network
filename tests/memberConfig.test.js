import { describe, it, expect } from 'vitest'
import { normalizePostUrl, normalizeProfile, weekStart, weekStreak, monthKey, dailyShuffle, youtubeId, DOMAINS, PLATFORM_FEATURES, WHATSAPP_COMMUNITY_URLS } from '../shared/memberConfig.js'

describe('post link validation', () => {
  it.each([
    'https://www.linkedin.com/posts/priya-sharma_campaign-learnings-activity-7255555555555555555-AbCd',
    'https://linkedin.com/posts/priya-sharma_x-activity-1/',
    'https://www.linkedin.com/feed/update/urn:li:activity:7255555555555555555/',
    'https://www.linkedin.com/pulse/my-article-priya-sharma',
  ])('accepts LinkedIn post %s', (url) => expect(normalizePostUrl('linkedin', url)).toMatch(/^https:\/\/www\.linkedin\.com\//))

  it('strips tracking parameters and fragments', () => {
    expect(normalizePostUrl('linkedin', 'https://www.linkedin.com/posts/a_b-activity-1?utm_source=share&rcm=x#c'))
      .toBe('https://www.linkedin.com/posts/a_b-activity-1')
    expect(normalizePostUrl('instagram', 'https://instagram.com/reel/C8xYz_12-a/?igsh=abc')).toBe('https://www.instagram.com/reel/C8xYz_12-a')
  })

  it.each([
    'https://www.linkedin.com/in/priya-sharma',           // profile, not a post
    'http://www.linkedin.com/posts/a_b-activity-1',        // not https
    'https://evil.com/linkedin.com/posts/a',               // other site
    'https://www.linkedin.com.evil.com/posts/a',
    'javascript:alert(1)',
    '',
  ])('rejects %s for LinkedIn', (url) => expect(normalizePostUrl('linkedin', url)).toBe(null))

  it('keeps platforms separate', () => {
    expect(normalizePostUrl('instagram', 'https://www.linkedin.com/posts/a_b-activity-1')).toBe(null)
    expect(normalizePostUrl('linkedin', 'https://www.instagram.com/p/ABC123/')).toBe(null)
    expect(normalizePostUrl('instagram', 'https://www.instagram.com/yourname/')).toBe(null)
  })
})

describe('profile validation', () => {
  it('LinkedIn profile URL and Instagram handle', () => {
    expect(normalizeProfile('linkedin', 'https://www.linkedin.com/in/priya-sharma/')).toBe('https://www.linkedin.com/in/priya-sharma')
    expect(normalizeProfile('linkedin', 'https://www.linkedin.com/company/x')).toBe(null)
    expect(normalizeProfile('instagram', 'yourname.food')).toBe('@yourname.food')
    expect(normalizeProfile('instagram', '@your name')).toBe(null)
  })
})

describe('weeks in India time (Monday start)', () => {
  it('Monday 00:30 IST belongs to the new week; Sunday 23:30 IST to the old one', () => {
    const mon = new Date('2026-11-01T19:00:00Z') // Mon 2 Nov 00:30 IST
    const sun = new Date('2026-11-01T18:00:00Z') // Sun 1 Nov 23:30 IST
    expect(weekStart(mon).toISOString()).toBe('2026-11-01T18:30:00.000Z')
    expect(weekStart(sun).toISOString()).toBe('2026-10-25T18:30:00.000Z')
  })

  it('streak counts consecutive weeks, allowing this week to be still empty', () => {
    const now = new Date('2026-11-05T10:00:00Z') // Thu
    const w = (daysAgo) => new Date(now.getTime() - daysAgo * 86400000).toISOString()
    expect(weekStreak([w(0), w(7), w(14)], now)).toBe(3)
    expect(weekStreak([w(7), w(14)], now)).toBe(2) // not posted yet this week
    expect(weekStreak([w(0), w(14)], now)).toBe(1) // gap last week
    expect(weekStreak([], now)).toBe(0)
  })

  it('month key uses IST', () => {
    expect(monthKey(new Date('2026-10-31T19:00:00Z'))).toBe('2026-11-01') // 1 Nov 00:30 IST
  })
})

describe('timeline shuffle and product settings', () => {
  it('is stable within a day, different across days, and keeps every post', () => {
    const items = Array.from({ length: 20 }, (_, i) => i)
    const a = dailyShuffle(items, 'u1:2026-11-05')
    expect(dailyShuffle(items, 'u1:2026-11-05')).toEqual(a)
    expect(dailyShuffle(items, 'u1:2026-11-06')).not.toEqual(a)
    expect([...a].sort((x, y) => x - y)).toEqual(items)
  })

  it('Monthly guide is switched off; Growth Playbook is LinkedIn-only; one WhatsApp group per product', () => {
    expect(PLATFORM_FEATURES.linkedin).toMatchObject({ playbook: true, guide: false })
    expect(PLATFORM_FEATURES.instagram).toMatchObject({ playbook: false, guide: false })
    expect(WHATSAPP_COMMUNITY_URLS.linkedin).toMatch(/^https:\/\/chat\.whatsapp\.com\//)
    expect(WHATSAPP_COMMUNITY_URLS.instagram).toMatch(/^https:\/\/chat\.whatsapp\.com\//)
    expect(WHATSAPP_COMMUNITY_URLS.linkedin).not.toBe(WHATSAPP_COMMUNITY_URLS.instagram)
  })

  it('every domain has topics', () => {
    for (const p of ['linkedin', 'instagram']) for (const topics of Object.values(DOMAINS[p])) expect(topics.length).toBeGreaterThan(0)
  })

  it('YouTube ids', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://vimeo.com/1')).toBe(null)
  })
})
