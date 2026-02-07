const API_BASE_URL = '/api';

class ApiClient {
  private baseUrl: string;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000;

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

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    // If backend returned non-JSON, surface as error-friendly object
    // so callers don't crash on JSON.parse.
    // @ts-ignore - allow returning string payloads when needed
    return (text as T);
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

  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = `GET:${endpoint}`;
    
    if (useCache) {
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      cache: 'no-cache',
    });

    if (!response.ok) {
      this.requestCache.delete(cacheKey);
      throw await this.parseError(response);
    }

    const resultData = await this.parseResponse<T>(response);
    if (useCache) {
      this.requestCache.set(cacheKey, { data: resultData, timestamp: Date.now() });
    }
    return resultData;
  }

  async post<T>(endpoint: string, bodyData?: any): Promise<T> {
    const cacheKey = `POST:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: bodyData ? JSON.stringify(bodyData) : undefined,
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw await this.parseError(response);
    }

    const resultData = await this.parseResponse<T>(response);
    this.clearRelatedCache(endpoint);
    return resultData;
  }

  async put<T>(endpoint: string, bodyData?: any): Promise<T> {
    const cacheKey = `PUT:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: bodyData ? JSON.stringify(bodyData) : undefined,
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw await this.parseError(response);
    }

    const resultData = await this.parseResponse<T>(response);
    this.clearRelatedCache(endpoint);
    return resultData;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const cacheKey = `DELETE:${endpoint}`;
    this.requestCache.delete(cacheKey);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      cache: 'no-cache',
    });

    if (!response.ok) {
      this.requestCache.delete(cacheKey);
      throw await this.parseError(response);
    }

    this.clearRelatedCache(endpoint);
    return this.parseResponse<T>(response);
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
