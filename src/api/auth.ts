import { apiClient } from './client';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
}

interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token?: string;
  user_id?: string;
  user?: any;
}

function saveAuth(data: AuthResponse & { user?: any; name?: string; email?: string; phone?: string; age?: number }) {
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    const user = data.user || {};
    localStorage.setItem('user', JSON.stringify({
      id: user._id || user.id || data.user_id,
      name: user.name || data.name,
      email: user.email || data.email,
      phone: user.phone || data.phone,
      age: user.age || data.age,
      role: user.role || 'client',
      membership: user.membership,
      membership_status: user.membership_status || 'inactive',
      expiry_date: user.expiry_date,
    }));
  }
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    saveAuth(response);

    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    saveAuth({
      ...response,
      name: data.name,
      email: data.email,
      phone: data.phone,
      age: data.age,
    });

    return response;
  },

  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        this.logout();
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
    }
  },

  async updateCurrentUser(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      age?: number;
      membership?: string | null;
      membership_status?: 'active' | 'expired' | 'trial' | 'inactive';
      expiry_date?: string | null;
    }
  ): Promise<any> {
    const result = await apiClient.put(`/users/${userId}`, data);
    return result;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  async getCurrentUser(): Promise<any> {
    return apiClient.get('/auth/me');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  },
};
