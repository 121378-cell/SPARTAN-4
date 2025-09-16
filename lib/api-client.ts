// Cliente API para conectar con el backend
import { workoutCache, userCache, aiResponseCache, withCache } from './cache';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_tokens') 
      ? JSON.parse(localStorage.getItem('auth_tokens')!).accessToken 
      : null;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  // Auth methods
  async register(credentials: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await this.request<{
      user: any;
      tokens: { accessToken: string; refreshToken: string; expiresIn: number };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.tokens.accessToken;
      localStorage.setItem('auth_tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }) {
    const response = await this.request<{
      user: any;
      tokens: { accessToken: string; refreshToken: string; expiresIn: number };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.tokens.accessToken;
      localStorage.setItem('auth_tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  }

  async refreshToken() {
    const tokens = localStorage.getItem('auth_tokens');
    if (!tokens) {
      throw new Error('No refresh token available');
    }

    const { refreshToken } = JSON.parse(tokens);
    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.data) {
      this.token = response.data.accessToken;
      localStorage.setItem('auth_tokens', JSON.stringify(response.data));
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('user_data');
  }

  // User methods
  async getUserProfile() {
    return withCache(
      userCache,
      `profile-${this.token}`,
      () => this.request<any>('/user/profile'),
      30 * 60 * 1000 // 30 minutes
    );
  }

  // Workout plans methods
  async getWorkoutPlans() {
    return withCache(
      workoutCache,
      `workouts-${this.token}`,
      () => this.request<any[]>('/workout-plans'),
      10 * 60 * 1000 // 10 minutes
    );
  }

  async createWorkoutPlan(plan: any) {
    return this.request<any>('/workout-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async updateWorkoutPlan(id: string, updates: any) {
    return this.request<any>(`/workout-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteWorkoutPlan(id: string) {
    return this.request<void>(`/workout-plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Progress methods
  async getProgress() {
    return this.request<any[]>('/progress');
  }

  async addProgress(progress: any) {
    return this.request<any>('/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  // AI Generation methods
  async generateWorkout(params: {
    level: string;
    availableDays: string[];
    location: string;
    equipment: string[];
    injuries: string[];
    goals: string[];
  }) {
    return this.request<any>('/generate/workout', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string;
      timestamp: string;
      services: {
        gemini: boolean;
        database: string;
      };
    }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse, ApiError };


