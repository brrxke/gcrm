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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const resultData = await response.json();
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const resultData = await response.json();
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const resultData = await response.json();
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    this.clearRelatedCache(endpoint);
    return response.json();
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
