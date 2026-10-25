import crypto from 'node:crypto'

function hmacHex(secret, message) {
  return crypto.createHmac('sha256', secret).update(message, 'utf8').digest('hex')
}

function safeEqualHex(expected, received) {
  if (typeof received !== 'string' || !/^[0-9a-f]+$/i.test(received)) return false
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(received, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Checkout signature for subscriptions:
 *   HMAC_SHA256(razorpay_payment_id + "|" + subscription_id, key_secret)
 * `subscriptionId` must be the id stored on our server, not the one echoed by Checkout.
 */
export function verifyCheckoutSignature({ paymentId, subscriptionId, signature, keySecret }) {
  if (!paymentId || !subscriptionId || !signature || !keySecret) return false
  return safeEqualHex(hmacHex(keySecret, `${paymentId}|${subscriptionId}`), signature)
}

/** Webhook signature: HMAC_SHA256(raw request body, webhook secret) in X-Razorpay-Signature. */
export function verifyWebhookSignature({ rawBody, signature, secret }) {
  if (typeof rawBody !== 'string' || !signature || !secret) return false
  return safeEqualHex(hmacHex(secret, rawBody), signature)
}
