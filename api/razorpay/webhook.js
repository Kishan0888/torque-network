/**
 * POST /api/razorpay/webhook
 *
 * 1. Verifies X-Razorpay-Signature over the RAW body with RAZORPAY_WEBHOOK_SECRET.
 * 2. Records the event in razorpay_webhook_events keyed by x-razorpay-event-id;
 *    an event already processed is acknowledged and skipped (idempotent).
 * 3. Re-fetches the subscription from Razorpay and stores its current state,
 *    so renewals, failures, halts, cancellations and completions are all
 *    reflected regardless of delivery order.
 * 4. Returns 5xx on processing failure so Razorpay retries.
 */
import crypto from 'node:crypto'
import { json } from '../_lib/http.js'
import { razorpayWebhookSecret, ConfigError } from '../_lib/env.js'
import { verifyWebhookSignature } from '../_lib/signatures.js'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { syncSubscription, recordPayment } from '../_lib/sync.js'
import { unixToIso } from '../_lib/subscriptionState.js'

export async function POST(request) {
  let secret
  try {
    secret = razorpayWebhookSecret()
  } catch (e) {
    if (e instanceof ConfigError) {
      console.error('[webhook]', e.message)
      return json({ error: 'not configured' }, 503)
    }
    throw e
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')
  if (!verifyWebhookSignature({ rawBody, signature, secret })) {
    return json({ error: 'invalid signature' }, 400)
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const eventId =
    request.headers.get('x-razorpay-event-id') ||
    `sha256:${crypto.createHash('sha256').update(rawBody).digest('hex')}`
  const eventType = String(event?.event || 'unknown')
  const db = supabaseAdmin()

  try {
    // Claim the event. ignoreDuplicates => returns no row if it already exists.
    const { data: inserted, error: insertErr } = await db
      .from('razorpay_webhook_events')
      .upsert(
        { event_id: eventId, event_type: eventType, payload: event },
        { onConflict: 'event_id', ignoreDuplicates: true },
      )
      .select('event_id')
    if (insertErr) throw insertErr

    if (!inserted?.length) {
      const { data: prior, error: priorErr } = await db
        .from('razorpay_webhook_events')
        .select('processed_at, attempts')
        .eq('event_id', eventId)
        .single()
      if (priorErr) throw priorErr
      if (prior.processed_at) return json({ ok: true, duplicate: true })
      await db
        .from('razorpay_webhook_events')
        .update({ attempts: (prior.attempts || 1) + 1 })
        .eq('event_id', eventId)
    }

    const result = await processEvent(event, eventType)

    const { error: doneErr } = await db
      .from('razorpay_webhook_events')
      .update({ processed_at: new Date().toISOString(), last_error: result.note ?? null })
      .eq('event_id', eventId)
    if (doneErr) throw doneErr

    return json({ ok: true })
  } catch (err) {
    console.error('[webhook] processing failed', eventType, eventId, err)
    await db
      .from('razorpay_webhook_events')
      .update({ last_error: String(err?.message || err).slice(0, 500) })
      .eq('event_id', eventId)
      .then(() => {}, () => {})
    return json({ error: 'processing failed' }, 500)
  }
}

async function processEvent(event, eventType) {
  if (!eventType.startsWith('subscription.')) return { note: 'ignored: not a subscription event' }

  const subscriptionEntity = event?.payload?.subscription?.entity
  if (!subscriptionEntity?.id) return { note: 'ignored: no subscription entity' }

  const row = await syncSubscription(subscriptionEntity.id, { eventAt: unixToIso(event.created_at) })
  if (!row) return { note: 'ignored: subscription not created by this app' }

  const paymentEntity = event?.payload?.payment?.entity
  if (paymentEntity) await recordPayment(paymentEntity, row)

  return {}
}
