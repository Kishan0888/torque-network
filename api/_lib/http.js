import { ConfigError } from './env.js'

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message)
    this.status = status
    this.extra = extra
  }
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export async function readJson(request) {
  try {
    return await request.json()
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.')
  }
}

/** Like readJson, but an empty body is treated as {} (older clients send no body). */
export async function readOptionalJson(request) {
  const text = await request.text()
  if (!text.trim()) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.')
  }
}

/** Resolve and validate the requested subscription product (defaults to Instagram). */
export function productFromBody(body, products, fallback) {
  const product = body?.product ?? fallback
  if (!products.includes(product)) throw new HttpError(400, 'Unknown membership type.')
  return product
}

/** Wrap a handler so errors become safe JSON responses (no stack traces or secrets). */
export function handle(fn) {
  return async (request) => {
    try {
      return await fn(request)
    } catch (err) {
      if (err instanceof HttpError) {
        return json({ error: err.message, ...err.extra }, err.status)
      }
      if (err instanceof ConfigError) {
        console.error('[config]', err.message)
        return json({ error: 'Payments are not configured yet. Please try again later.' }, 503)
      }
      console.error('[api] unexpected error', err)
      return json({ error: 'Something went wrong. Please try again.' }, 500)
    }
  }
}
