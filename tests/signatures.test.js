import crypto from 'node:crypto'
import { describe, it, expect } from 'vitest'
import { verifyCheckoutSignature, verifyWebhookSignature } from '../api/_lib/signatures.js'

const hmac = (secret, msg) => crypto.createHmac('sha256', secret).update(msg).digest('hex')

describe('verifyCheckoutSignature', () => {
  const keySecret = 'test_key_secret'
  const paymentId = 'pay_ABC123'
  const subscriptionId = 'sub_XYZ789'
  const signature = hmac(keySecret, `${paymentId}|${subscriptionId}`)

  it('accepts a correct signature (payment_id|subscription_id)', () => {
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature, keySecret })).toBe(true)
  })
  it('rejects a signature for a different subscription', () => {
    expect(verifyCheckoutSignature({ paymentId, subscriptionId: 'sub_OTHER', signature, keySecret })).toBe(false)
  })
  it('rejects a signature made with a different secret', () => {
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature: hmac('wrong', `${paymentId}|${subscriptionId}`), keySecret })).toBe(false)
  })
  it('rejects the reversed order (subscription|payment)', () => {
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature: hmac(keySecret, `${subscriptionId}|${paymentId}`), keySecret })).toBe(false)
  })
  it('rejects malformed or missing input', () => {
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature: 'not-hex!', keySecret })).toBe(false)
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature: signature.slice(0, 10), keySecret })).toBe(false)
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature: '', keySecret })).toBe(false)
    expect(verifyCheckoutSignature({ paymentId, subscriptionId, signature, keySecret: '' })).toBe(false)
  })
})

describe('verifyWebhookSignature', () => {
  const secret = 'whsec_test'
  const rawBody = '{"event":"subscription.charged","payload":{}}'
  const signature = hmac(secret, rawBody)

  it('accepts the HMAC of the exact raw body', () => {
    expect(verifyWebhookSignature({ rawBody, signature, secret })).toBe(true)
  })
  it('rejects if the body is re-serialised (whitespace changed)', () => {
    const reformatted = JSON.stringify(JSON.parse(rawBody), null, 2)
    expect(verifyWebhookSignature({ rawBody: reformatted, signature, secret })).toBe(false)
  })
  it('rejects a wrong secret or missing header', () => {
    expect(verifyWebhookSignature({ rawBody, signature, secret: 'other' })).toBe(false)
    expect(verifyWebhookSignature({ rawBody, signature: null, secret })).toBe(false)
  })
})
