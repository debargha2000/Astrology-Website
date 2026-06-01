// Centralized fetch wrapper that automatically handles CSRF tokens
// for state-changing requests against the Aura & Stone backend.
//
// Flow:
//   1. On first state-changing request, GET /api/csrf-token to obtain
//      a CSRF token. The server also sets a signed `_csrf` cookie.
//   2. Subsequent POST/PUT/DELETE/PATCH requests send:
//        - credentials: 'include'   (so the cookie is sent)
//        - X-CSRF-Token: <token>     (validated against the cookie)
//
// The Razorpay webhook path is CSRF-exempt on the server (HMAC verified
// instead), so this wrapper still passes the header through — the server
// will simply not check it for that route.

let csrfTokenCache: string | null = null;
let csrfTokenFetchPromise: Promise<string | null> | null = null;

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isExternalUrl(input: RequestInfo | URL): boolean {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  return /^https?:\/\//i.test(url);
}

async function fetchCsrfToken(): Promise<string | null> {
  if (csrfTokenCache) return csrfTokenCache;
  if (csrfTokenFetchPromise) return csrfTokenFetchPromise;

  csrfTokenFetchPromise = (async () => {
    try {
      const res = await fetch('/api/csrf-token', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { csrfToken?: string };
      csrfTokenCache = data.csrfToken ?? null;
      return csrfTokenCache;
    } catch {
      return null;
    } finally {
      csrfTokenFetchPromise = null;
    }
  })();

  return csrfTokenFetchPromise;
}

export function clearCsrfToken(): void {
  csrfTokenCache = null;
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  skipCsrf?: boolean;
}

export async function apiFetch(
  input: RequestInfo | URL,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { body, headers, skipCsrf, ...rest } = options;

  const method = (rest.method || 'GET').toString().toUpperCase();
  const external = isExternalUrl(input);
  const requiresCsrf = !external && !skipCsrf && UNSAFE_METHODS.has(method);

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined && body !== null && !(body instanceof FormData) && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (requiresCsrf) {
    const token = await fetchCsrfToken();
    if (token) {
      finalHeaders['X-CSRF-Token'] = token;
    }
  }

  const finalInit: RequestInit = {
    ...rest,
    credentials: rest.credentials ?? 'include',
    headers: finalHeaders,
  };

  if (body !== undefined && body !== null) {
    finalInit.body =
      typeof body === 'string' || body instanceof FormData || body instanceof Blob
        ? body
        : JSON.stringify(body);
  }

  return fetch(input, finalInit);
}
