const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
let loading

function loadScript() {
  if (window.Razorpay) return Promise.resolve()
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => {
        loading = null
        reject(new Error('Could not load Razorpay Checkout. Check your connection and try again.'))
      }
      document.body.appendChild(s)
    })
  }
  return loading
}

/**
 * Start downloading Checkout ahead of time (e.g. when the subscribe button
 * becomes visible) so it is ready the instant the user clicks. Safe to call
 * repeatedly; failures are retried on the real click.
 */
export function preloadCheckout() {
  loadScript().catch(() => {})
}

/**
 * Opens Razorpay Checkout for a server-created subscription.
 * Resolves with Razorpay's response on success, or null if the user closes it.
 */
export async function openSubscriptionCheckout({ keyId, subscriptionId, prefill }) {
  await loadScript()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      subscription_id: subscriptionId,
      name: 'Torque Network',
      description: 'Monthly membership',
      image: `${window.location.origin}/logo-sm.png`, // 53 KB instead of the 760 KB full-size logo
      prefill,
      theme: { color: '#3B82F6' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => resolve(null) },
    })
    rzp.on('payment.failed', (resp) => {
      // Checkout stays open so the user can retry; surface the reason only if they close it.
      console.warn('Razorpay payment failed', resp?.error?.code, resp?.error?.description)
    })
    try {
      rzp.open()
    } catch (e) {
      reject(e)
    }
  })
}
