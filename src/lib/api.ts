// lib/api.ts - Serviço de API para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    accessToken: string;
    user: User;
}

export interface ApiError {
    error: string;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
        value: any;
    }>;
}

class ApiService {
    private getHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
        }

        return data;
    }

    private async handleFetch(url: string, options: RequestInit): Promise<Response> {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('Erro de conectividade: Verifique se a API está rodando e o CORS está configurado corretamente');
            }
            throw error;
        }
    }

    // Auth endpoints
    async register(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        const response = await this.handleFetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });

        return this.handleResponse<AuthResponse>(response);
    }

    async login(credentials: {
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        const response = await this.handleFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(credentials),
        });

        return this.handleResponse<AuthResponse>(response);
    }

    async getProfile(token: string): Promise<{ message: string; user: User }> {
        const response = await this.handleFetch(`${API_BASE_URL}/auth/profile`, {
            headers: this.getHeaders(token),
        });

        return this.handleResponse(response);
    }

    async refreshToken(token: string): Promise<AuthResponse> {
        const response = await this.handleFetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: this.getHeaders(token),
        });

        return this.handleResponse<AuthResponse>(response);
    }

    async logout(token: string): Promise<{ message: string }> {
        const response = await this.handleFetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders(token),
        });

        return this.handleResponse(response);
    }

    // User endpoints
    async updateProfile(
        token: string,
        data: { name?: string; email?: string }
    ): Promise<{ message: string; user: User }> {
        const response = await this.handleFetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data),
        });

        return this.handleResponse(response);
    }

    async changePassword(
        token: string,
        data: { currentPassword: string; newPassword: string }
    ): Promise<{ message: string }> {
        const response = await this.handleFetch(`${API_BASE_URL}/users/password`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data),
        });

        return this.handleResponse(response);
    }

    // Health check
    async healthCheck(): Promise<{
        status: string;
        message: string;
        timestamp: string;
        version: string;
    }> {
        const response = await this.handleFetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {});
        return this.handleResponse(response);
    }
}

export const apiService = new ApiService();
