import { razorpayConfig } from './env.js'

const API = 'https://api.razorpay.com/v1'

export class RazorpayError extends Error {
  constructor(message, status, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function call(method, path, body) {
  const { keyId, keySecret } = razorpayConfig()
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new RazorpayError(
      data?.error?.description || `Razorpay request failed (${res.status})`,
      res.status,
      data?.error?.code,
    )
  }
  return data
}

export const razorpay = {
  createSubscription: (body) => call('POST', '/subscriptions', body),
  fetchSubscription: (id) => call('GET', `/subscriptions/${encodeURIComponent(id)}`),
  cancelSubscription: (id, cancelAtCycleEnd) =>
    call('POST', `/subscriptions/${encodeURIComponent(id)}/cancel`, {
      cancel_at_cycle_end: cancelAtCycleEnd,
    }),
}
