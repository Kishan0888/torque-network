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
