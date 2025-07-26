// lib/api.ts - Serviço de API para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const SOAP_API_BASE_URL = process.env.NEXT_PUBLIC_SOAP_API_URL || 'http://localhost:3001';

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

// === TIPOS PARA API SOAP ===

// Tipos para colaboradores vindos da API SOAP
export interface ColaboradorSOAP {
    CHAPA: string;
    NOME: string;
    CODFUNCAO: string;
    CODSECAO: string;
    NOMEFUNCAO?: string;
    NOMESECAO?: string;
    ATIVO?: boolean;
}

export interface ColaboradoresResponse {
    success: boolean;
    totalColaboradores: number;
    colaboradores: ColaboradorSOAP[];
}

// Tipos para grupos EPI vindos da API SOAP
export interface GrupoEpiSOAP {
    CODGRUPOEPI: string;
    NOME: string;
    DESCRICAO?: string;
}

export interface GruposEpiResponse {
    success: boolean;
    totalGrupos: number;
    gruposEPI: GrupoEpiSOAP[];
}

// Tipos para catálogo EPI vindos da API SOAP
export interface EpiItemSOAP {
    CODIGO: string;
    NOME: string;
    CA?: string;
    GRUPO?: string;
    TIPO?: string;
    ATIVO?: boolean;
    DESCRICAO?: string;
}

export interface CatalogoEpiResponse {
    success: boolean;
    totalItens: number;
    catalogoEPI: EpiItemSOAP[];
}

// Tipos para consulta SQL genérica
export interface ConsultaSOAPRequest {
    codSentenca: string;
    codColigada: string;
    codSistema: string;
    parameters: string;
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

    // === MÉTODOS PARA API SOAP ===

    /**
     * Busca todos os colaboradores via API SOAP
     */
    async getColaboradores(): Promise<ColaboradoresResponse> {
        console.log('🔍 Buscando colaboradores via API SOAP...');

        const response = await this.handleFetch(`${SOAP_API_BASE_URL}/colaboradores`, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        const data = await this.handleResponse<ColaboradoresResponse>(response);
        console.log(`✅ ${data.totalColaboradores || 0} colaboradores encontrados`);

        return data;
    }

    /**
     * Busca todos os grupos EPI via API SOAP
     */
    async getGruposEpi(): Promise<GruposEpiResponse> {
        console.log('🛡️ Buscando grupos EPI via API SOAP...');

        const response = await this.handleFetch(`${SOAP_API_BASE_URL}/grupo-epi`, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        const data = await this.handleResponse<GruposEpiResponse>(response);
        console.log(`✅ ${data.totalGrupos || 0} grupos EPI encontrados`);

        return data;
    }

    /**
     * Busca o catálogo de EPIs via API SOAP
     * @param codGrupo - Código do grupo EPI (opcional)
     */
    async getCatalogoEpi(codGrupo?: string): Promise<CatalogoEpiResponse> {
        console.log('🛡️ Buscando catálogo EPI via API SOAP...', { codGrupo });

        // Se um grupo específico for informado, enviar como parâmetro
        const body = codGrupo ? {
            codSentenca: '00.003',
            codColigada: '0',
            codSistema: 'V',
            parameters: `COLIGADA=1; CODGRUPO=${codGrupo}`
        } : undefined;

        const response = await this.handleFetch(`${SOAP_API_BASE_URL}/catalogo-epi`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await this.handleResponse<CatalogoEpiResponse>(response);
        console.log(`✅ ${data.totalItens || 0} itens EPI encontrados`);

        return data;
    }

    /**
     * Realiza consulta SQL genérica via API SOAP
     */
    async consultaSOAP(request: ConsultaSOAPRequest): Promise<any> {
        console.log('🔍 Realizando consulta SOAP personalizada...', request);

        const response = await this.handleFetch(`${SOAP_API_BASE_URL}/consulta`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(request),
        });

        const data = await this.handleResponse(response);
        console.log('✅ Consulta SOAP realizada com sucesso');

        return data;
    }

    // === MÉTODOS DE AUTENTICAÇÃO (EXISTENTES) ===

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
