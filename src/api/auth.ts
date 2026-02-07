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
  user_id?: string;
  user?: any;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    
    // Save token to localStorage
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      const user = response.user || {};
      localStorage.setItem('user', JSON.stringify({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role,
        membership: user.membership,
        membership_status: user.membership_status,
        expiry_date: user.expiry_date,
      }));
    }
    
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Save token to localStorage
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        role: 'client',
        membership: null,
        membership_status: 'inactive',
        expiry_date: null,
      }));
    }
    
    return response;
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
    return apiClient.put(`/users/${userId}`, data);
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<any> {
    return apiClient.get('/auth/me');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
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
