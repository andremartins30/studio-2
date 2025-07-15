// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, User, AuthResponse } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Carrega o token do localStorage na inicialização
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            // Valida o token carregando o perfil do usuário
            validateToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const validateToken = async (authToken: string) => {
        try {
            const response = await apiService.getProfile(authToken);
            setUser(response.user);
            setToken(authToken);
        } catch (error) {
            console.error('Token inválido:', error);
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await apiService.login({ email, password });

            // Armazena o token
            localStorage.setItem('authToken', response.accessToken);
            setToken(response.accessToken);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await apiService.register({ name, email, password });

            // Armazena o token após registro
            localStorage.setItem('authToken', response.accessToken);
            setToken(response.accessToken);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await apiService.logout(token);
            }
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            // Remove o token independentemente do resultado da API
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
        }
    };

    const updateProfile = async (data: { name?: string; email?: string }) => {
        if (!token) throw new Error('Usuário não autenticado');

        try {
            const response = await apiService.updateProfile(token, data);
            setUser(response.user);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!token) throw new Error('Usuário não autenticado');

        try {
            await apiService.changePassword(token, { currentPassword, newPassword });
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    };

    const value = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
