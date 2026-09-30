const BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

type ErrorBody = {
  statusCode?: number;
  message?: string | string[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? 'Erro inesperado');
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; query?: Record<string, QueryValue> } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers:
        options.body !== undefined
          ? { 'Content-Type': 'application/json' }
          : undefined,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, [
      'Não foi possível conectar à API. Verifique se o servidor está rodando.',
    ]);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as ErrorBody | null)?.message;
    const messages = Array.isArray(message)
      ? message
      : [message ?? `Erro ${response.status}`];
    throw new ApiError(response.status, messages);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string, query?: Record<string, QueryValue>) =>
    request<T>('GET', path, { query }),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>('PATCH', path, { body }),
  delete: (path: string) => request<void>('DELETE', path),
};
