const API_BASE = import.meta.env.VITE_API_URL || '';

interface ApiErrorData {
  error?: string;
  [key: string]: unknown;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiErrorData
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let csrfTokenCache: string | null = null;
let csrfTokenFetchPromise: Promise<string | null> | null = null;

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isExternalUrl(input: string): boolean {
  return /^https?:\/\//i.test(input);
}

async function fetchCsrfToken(): Promise<string | null> {
  if (csrfTokenCache) return csrfTokenCache;
  if (csrfTokenFetchPromise) return csrfTokenFetchPromise;

  csrfTokenFetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/csrf-token`, {
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

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  headers?: HeadersInit;
  skipCsrf?: boolean;
}

async function request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, skipCsrf, ...rest } = options;

  const method = (rest.method || 'GET').toString().toUpperCase();
  const external = isExternalUrl(endpoint);
  const requiresCsrf = !external && !skipCsrf && UNSAFE_METHODS.has(method);

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !finalHeaders['Content-Type']
  ) {
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

  const response = await fetch(`${API_BASE}${endpoint}`, finalInit);

  if (response.status === 403) {
    const text = await response.text();
    if (text.toLowerCase().includes('csrf')) {
      clearCsrfToken();
      throw new ApiError('CSRF token expired, please retry', 403);
    }
  }

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    const errorData = data as ApiErrorData | undefined;
    throw new ApiError(
      errorData?.error || `HTTP error ${response.status}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null | undefined;

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(
    endpoint: string,
    body: RequestBody,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ) => request<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(
    endpoint: string,
    body: RequestBody,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ) => request<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(
    endpoint: string,
    body: RequestBody,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ) => request<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
  raw: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>(endpoint, options),
};

export { ApiError };
