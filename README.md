# Torque Network website

Vite + React single-page site (torquenetwork.in), deployed on Vercel, plus
member accounts and Razorpay recurring subscriptions.

## Structure

| Path | What it is |
| --- | --- |
| `src/App.jsx`, `src/sections/*` | The public landing page (unchanged behaviour). |
| `public/landing.html`, `public/thankyou.html` | Static ad landing / thank-you pages (lead flow). |
| `src/AccountApp.jsx`, `src/auth/*` | Account area: `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/account` (protected). Lazy-loaded so the landing bundle is unaffected. |
| `api/*` | Vercel serverless functions. All privileged Supabase / Razorpay work happens here. |
| `supabase/migrations/*` | Database schema, RLS policies and entitlement functions (applied to the `torque-network` Supabase project; filenames match the applied versions). |
| `tests/*` | Vitest unit tests (signatures, entitlement rules, webhook idempotency). |
| `vercel.json` | Rewrites for the account routes; no-store headers on `/api`. |

## API routes

| Route | Auth | Purpose |
| --- | --- | --- |
| `POST /api/subscriptions/create` | Bearer (verified email) | Create/reuse a Razorpay subscription for `RAZORPAY_PLAN_ID`; returns `keyId` + `subscriptionId` for Checkout. |
| `POST /api/subscriptions/verify` | Bearer | Verify `HMAC_SHA256(payment_id + "|" + subscription_id, key_secret)` against the server-stored id, then sync state from Razorpay. |
| `POST /api/subscriptions/cancel` | Bearer | Cancel at cycle end (active) or immediately (no active cycle). |
| `GET /api/subscriptions/me` | Bearer | Server-enforced entitlement + latest subscription. |
| `POST /api/razorpay/webhook` | `X-Razorpay-Signature` | Verified over the raw body; idempotent on `x-razorpay-event-id`; re-fetches the subscription from Razorpay so out-of-order events can't regress state. |

Members-only API routes should call `requireEntitlement(request)` from `api/_lib/auth.js`.
In SQL, `public.my_entitlement()` (signed-in user) and `public.is_entitled(uuid)` (service role) give the same answer.

Entitlement: `active` → access; `pending` / `cancelled` / `completed` / `halted` → access until `current_end`; anything else → no access.

## Environment variables

See `.env.example`. `VITE_*` values are public and end up in the browser.
Everything else is server-only and must **never** be prefixed with `VITE_`.
Live Razorpay keys (`rzp_live_…`) are refused unless `RAZORPAY_ALLOW_LIVE=true`.

## Scripts

```bash
npm run dev     # landing + account pages (the /api functions need `vercel dev`)
npm test        # unit tests
npm run lint
npm run build
```
