import { describe, it, expect } from 'vitest'
import { rememberOAuthIntent, takeOAuthIntent, postAuthPath, rememberPlan, selectedPlan, OAUTH_INTENT_MAX_AGE_MS } from '../src/lib/planSelection.js'

function memoryStorage(seed = {}) {
  const m = new Map(Object.entries(seed))
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }
}

describe('Google sign-in keeps the selected product across the OAuth round trip', () => {
  it.each([
    ['linkedin', '/checkout?plan=linkedin'],
    ['instagram', '/checkout?plan=instagram'],
  ])('clicked "Continue with Google" with %s selected → returns to %s', (plan, expected) => {
    const storage = memoryStorage()
    rememberOAuthIntent(plan, storage, 1_000)             // on /signup or /login, just before leaving for Google
    const intent = takeOAuthIntent(storage, 1_000 + 20_000) // on /auth/callback after Google + Supabase
    expect(postAuthPath(intent.plan)).toBe(expected)
  })

  it('the OAuth choice wins over an older remembered choice and old signup metadata', () => {
    const storage = memoryStorage()
    rememberPlan('instagram', storage)          // older visit
    rememberOAuthIntent('linkedin', storage, 0)  // what they picked this time
    const intent = takeOAuthIntent(storage, 5_000)
    expect(intent.plan).toBe('linkedin')
    // …even though the generic rules would have said instagram
    expect(selectedPlan({ search: '', storage, user: { user_metadata: { selected_plan: 'instagram' } } })).toBe('instagram')
  })

  it('no plan chosen → dashboard (not some stale checkout)', () => {
    const storage = memoryStorage()
    rememberPlan('instagram', storage)
    rememberOAuthIntent(null, storage, 0)
    const intent = takeOAuthIntent(storage, 1)
    expect(intent).toEqual({ plan: null })
    expect(postAuthPath(intent.plan)).toBe('/account')
  })

  it('is single-use: a second callback visit gets nothing', () => {
    const storage = memoryStorage()
    rememberOAuthIntent('linkedin', storage, 0)
    expect(takeOAuthIntent(storage, 1)).toEqual({ plan: 'linkedin' })
    expect(takeOAuthIntent(storage, 2)).toBe(null)
  })

  it('expires after 30 minutes and ignores tampered values', () => {
    let storage = memoryStorage()
    rememberOAuthIntent('linkedin', storage, 0)
    expect(takeOAuthIntent(storage, OAUTH_INTENT_MAX_AGE_MS + 1)).toBe(null)

    storage = memoryStorage({ torque_oauth_intent: JSON.stringify({ plan: 'plan_TthdcK6RJ9gUFE', at: 0 }) })
    expect(takeOAuthIntent(storage, 1)).toEqual({ plan: null })
    storage = memoryStorage({ torque_oauth_intent: 'not json' })
    expect(takeOAuthIntent(storage, 1)).toBe(null)
  })

  it('never throws when storage is blocked', () => {
    const blocked = { getItem: () => { throw new Error('x') }, setItem: () => { throw new Error('x') }, removeItem: () => { throw new Error('x') } }
    expect(() => rememberOAuthIntent('linkedin', blocked)).not.toThrow()
    expect(takeOAuthIntent(blocked)).toBe(null)
  })
})
