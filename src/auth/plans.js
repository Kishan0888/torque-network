import { Sparkles, Briefcase } from 'lucide-react'

// Display only. The amount actually charged comes from each product's Razorpay
// plan on the server (instagram -> RAZORPAY_PLAN_ID, linkedin ->
// RAZORPAY_LINKEDIN_PLAN_ID); keep these labels in sync with those plans.
// The browser only sends the product key; the server picks the plan id.
export const PLANS = [
  {
    key: 'instagram',
    eyebrow: 'Torque for Instagram',
    name: 'Standard Member',
    price: '₹750',
    Icon: Sparkles,
    // Same benefit wording as the public pricing card (src/sections/Pricing.jsx).
    included: [
      '500–2,500 real creators watch, save and share your post',
      'Engagement within 48 hours, staggered naturally',
      'A professionally managed network, open to every creator category',
      'Access to a vetted community of 10,000+ influencers',
      'A network that grows with you at no extra cost',
    ],
  },
  {
    key: 'linkedin',
    eyebrow: 'Torque for LinkedIn',
    name: 'LinkedIn Professional',
    price: '₹500',
    Icon: Briefcase,
    included: [
      'Share your LinkedIn posts with the Torque Network community',
      'Genuine engagement from fellow members on your posts',
      'A professionally managed network for LinkedIn professionals',
    ],
  },
]

export const planByKey = (key) => PLANS.find((plan) => plan.key === key) || null
export const priceLabel = (plan) => `${plan.price} / month`

/** Statuses that mean the user already has (or is starting) this membership. */
export const IN_PROGRESS = ['active', 'authenticated', 'pending', 'paused']

/** The user already has this product (paid up, or a subscription in progress). */
export const ownsProduct = (state) =>
  Boolean(state?.entitled) || Boolean(state?.subscription && IN_PROGRESS.includes(state.subscription.status))

/** A product can be bought only if it is offered and the user doesn't already have it. */
export const canPurchase = (state) => Boolean(state?.available) && !ownsProduct(state)

/** Per-product state from /api/subscriptions/me (older responses: Instagram only). */
export const productStateFrom = (membership, key) =>
  membership?.products?.[key] ??
  (key === 'instagram' && membership ? { available: true, entitled: membership.entitled, subscription: membership.subscription } : null)

export const STATUS_COPY = {
  active: ['Active', 'success'],
  authenticated: ['Payment authorised — activating', 'info'],
  pending: ['Payment retrying', 'warn'],
  halted: ['Payment failed', 'error'],
  cancelled: ['Cancelled', 'warn'],
  completed: ['Completed', 'info'],
  expired: ['Expired', 'warn'],
  paused: ['Paused', 'warn'],
}

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
export const fmtAmount = (paise, currency) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format((paise || 0) / 100)
