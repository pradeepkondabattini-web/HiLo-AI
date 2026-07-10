/**
 * Minimal delegated-auth HTTP client for business skills. Skills call other HiLo services
 * on behalf of the user with the caller's own bearer token — services enforce authz
 * exactly as if the user called them directly (least privilege, EOS-000 §82).
 */
export interface ServiceHttp {
  get(path: string, token: string): Promise<unknown>;
  post(path: string, token: string, body: unknown): Promise<unknown>;
}

export class FetchServiceHttp implements ServiceHttp {
  constructor(private readonly baseUrl: string) {}

  async get(path: string, token: string): Promise<unknown> {
    return this.send('GET', path, token);
  }

  async post(path: string, token: string, body: unknown): Promise<unknown> {
    return this.send('POST', path, token, body);
  }

  private async send(
    method: string,
    path: string,
    token: string,
    body?: unknown,
  ): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        typeof data === 'object' && data !== null && 'error' in data
          ? JSON.stringify((data as { error: unknown }).error)
          : `HTTP ${res.status}`;
      throw new Error(`Upstream ${method} ${path} failed: ${message}`);
    }
    return data;
  }
}
