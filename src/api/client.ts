const API_BASE_URL = '/api';

class ApiClient {
  private baseUrl: string;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          return false;
        }

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    return (text as unknown as T);
  }

  private async parseError(response: Response): Promise<Error> {
    try {
      const data = await this.parseResponse<any>(response);
      const message =
        typeof data === 'string'
          ? data
          : data?.error || data?.message || 'Request failed';
      return new Error(message);
    } catch {
      return new Error('Request failed');
    }
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit,
    cacheKey: string,
    useCache: boolean
  ): Promise<T> {
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
      cache: 'no-cache',
    });

    if (response.status === 401 && !endpoint.includes('/auth/')) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...this.getAuthHeaders(),
            ...(options.headers || {}),
          },
          cache: 'no-cache',
        });
      }
    }

    if (!response.ok) {
      this.requestCache.delete(cacheKey);
      throw await this.parseError(response);
    }

    return this.parseResponse<T>(response);
  }

  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = `GET:${endpoint}`;

    if (useCache) {
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    const resultData = await this.fetchWithRetry<T>(
      endpoint,
      { method: 'GET' },
      cacheKey,
      useCache
    );

    if (useCache) {
      this.requestCache.set(cacheKey, { data: resultData, timestamp: Date.now() });
    }
    return resultData;
  }

  async post<T>(endpoint: string, bodyData?: any): Promise<T> {
    const cacheKey = `POST:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const resultData = await this.fetchWithRetry<T>(
      endpoint,
      {
        method: 'POST',
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      },
      cacheKey,
      false
    );

    this.clearRelatedCache(endpoint);
    return resultData;
  }

  async put<T>(endpoint: string, bodyData?: any): Promise<T> {
    const cacheKey = `PUT:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const resultData = await this.fetchWithRetry<T>(
      endpoint,
      {
        method: 'PUT',
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      },
      cacheKey,
      false
    );

    this.clearRelatedCache(endpoint);
    return resultData;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const cacheKey = `DELETE:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const resultData = await this.fetchWithRetry<T>(
      endpoint,
      { method: 'DELETE' },
      cacheKey,
      false
    );

    this.clearRelatedCache(endpoint);
    return resultData;
  }

  async patch<T>(endpoint: string, bodyData?: any): Promise<T> {
    const cacheKey = `PATCH:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const resultData = await this.fetchWithRetry<T>(
      endpoint,
      {
        method: 'PATCH',
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      },
      cacheKey,
      false
    );

    this.clearRelatedCache(endpoint);
    return resultData;
  }

  clearCache(): void {
    this.requestCache.clear();
  }

  private clearRelatedCache(endpoint: string): void {
    for (const key of this.requestCache.keys()) {
      if (key.includes(endpoint)) {
        this.requestCache.delete(key);
      }
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
