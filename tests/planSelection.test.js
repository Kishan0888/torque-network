import { describe, it, expect, beforeEach } from 'vitest'
import { selectedPlan, rememberPlan, withPlan, planFromSearch } from '../src/lib/planSelection.js'

function memoryStorage() {
  const m = new Map()
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }
}
const searchOf = (path) => new URL(path, 'http://local').search

let storage
beforeEach(() => { storage = memoryStorage() })

describe('LinkedIn selection survives signup → login → account redirects', () => {
  it('homepage LinkedIn button → /signup → /login → /account keeps "linkedin"', () => {
    // Homepage LinkedIn card links here (src/sections/Pricing.jsx: `/signup?plan=${plan.key}`).
    const signupUrl = '/signup?plan=linkedin'
    rememberPlan(planFromSearch(searchOf(signupUrl)), storage) // AccountApp remembers on page open
    expect(selectedPlan({ search: searchOf(signupUrl), storage })).toBe('linkedin')

    // Signup → "Log in" link (or RequireAuth redirect to /login)
    const loginUrl = withPlan('/login', selectedPlan({ search: searchOf(signupUrl), storage }))
    expect(loginUrl).toBe('/login?plan=linkedin')

    // Successful login → /account
    const accountUrl = withPlan('/account', selectedPlan({ search: searchOf(loginUrl), storage }))
    expect(accountUrl).toBe('/account?plan=linkedin')
    expect(selectedPlan({ search: searchOf(accountUrl), storage })).toBe('linkedin')
  })

  it('email verification link (/auth/callback, no ?plan) still lands on LinkedIn via browser storage', () => {
    rememberPlan('linkedin', storage) // remembered when /signup?plan=linkedin was opened
    const callbackSearch = '' // Supabase email link carries no plan
    const next = withPlan('/account?verified=1', selectedPlan({ search: callbackSearch, storage }))
    expect(next).toBe('/account?verified=1&plan=linkedin')
    expect(selectedPlan({ search: searchOf(next), storage: memoryStorage() })).toBe('linkedin')
  })

  it('email link opened on another device (empty storage) uses the plan saved at signup', () => {
    const user = { user_metadata: { selected_plan: 'linkedin' } } // Signup.jsx stores this
    expect(selectedPlan({ search: '', storage: memoryStorage(), user })).toBe('linkedin')
  })

  it('works when browser storage is unavailable (private mode): the URL carries it', () => {
    const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    expect(() => rememberPlan('linkedin', broken)).not.toThrow()
    const url = withPlan('/login', selectedPlan({ search: '?plan=linkedin', storage: broken }))
    expect(selectedPlan({ search: searchOf(withPlan('/account', selectedPlan({ search: searchOf(url), storage: broken }))), storage: broken })).toBe('linkedin')
  })
})

describe('Instagram selection and precedence', () => {
  it('homepage Instagram button keeps "instagram" through the same redirects', () => {
    rememberPlan(planFromSearch('?plan=instagram'), storage)
    expect(withPlan('/account', selectedPlan({ search: searchOf(withPlan('/login', 'instagram')), storage }))).toBe('/account?plan=instagram')
  })

  it('a newer choice in the URL wins over an older remembered one', () => {
    rememberPlan('instagram', storage)
    expect(selectedPlan({ search: '?plan=linkedin', storage })).toBe('linkedin')
  })

  it('no selection anywhere → null (account page keeps its default order)', () => {
    expect(selectedPlan({ search: '', storage, user: { user_metadata: {} } })).toBe(null)
    expect(withPlan('/account', null)).toBe('/account')
  })

  it('only product keys are accepted — never plan ids or other values', () => {
    for (const bad of ['plan_TthdcK6RJ9gUFE', 'youtube', '', 'LINKEDIN']) {
      expect(planFromSearch(`?plan=${bad}`)).toBe(null)
      rememberPlan(bad, storage)
    }
    expect(selectedPlan({ search: '', storage })).toBe(null)
    expect(withPlan('/account', 'plan_TthdcK6RJ9gUFE')).toBe('/account')
  })
})

describe('cart emptied / purchase finished', () => {
  it('forgetPlan clears the remembered selection so the cart stays empty', async () => {
    const { forgetPlan } = await import('../src/lib/planSelection.js')
    const m = new Map()
    const storage = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k) }
    rememberPlan('linkedin', storage)
    expect(selectedPlan({ search: '', storage })).toBe('linkedin')
    forgetPlan(storage)
    expect(selectedPlan({ search: '', storage })).toBe(null)
    expect(() => forgetPlan({ removeItem: () => { throw new Error('blocked') } })).not.toThrow()
  })
})
