// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Credenciais locais válidas
    const validCredentials = [
        {
            id: '1',
            email: 'admin@epicontrol.com',
            password: 'admin123',
            name: 'Administrador do Sistema',
            role: 'admin'
        },
        {
            id: '2',
            email: 'user@epicontrol.com',
            password: 'user123',
            name: 'Usuário Padrão',
            role: 'user'
        },
        {
            id: '3',
            email: 'manutencao@epicontrol.com',
            password: 'manut123',
            name: 'Equipe de Manutenção',
            role: 'maintenance'
        },
    ];

    // Verifica se existe token no localStorage ao inicializar
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Erro ao recuperar dados salvos:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            // Simula delay de rede para melhor UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verifica credenciais localmente
            const validUser = validCredentials.find(
                cred => cred.email === email && cred.password === password
            );

            if (!validUser) {
                throw new Error('Email ou senha incorretos');
            }

            // Gera token simulado
            const mockToken = `mock_token_${Date.now()}_${validUser.id}`;

            const userObject: User = {
                id: validUser.id,
                name: validUser.name,
                email: validUser.email,
                role: validUser.role
            };

            // Armazena dados localmente
            localStorage.setItem('authToken', mockToken);
            localStorage.setItem('authUser', JSON.stringify(userObject));

            setToken(mockToken);
            setUser(userObject);
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

            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verifica se email já existe
            const existingUser = validCredentials.find(cred => cred.email === email);
            if (existingUser) {
                throw new Error('Este email já está cadastrado');
            }

            // Simula criação de novo usuário
            const newUser: User = {
                id: `${Date.now()}`,
                name,
                email,
                role: 'user'
            };

            const mockToken = `mock_token_${Date.now()}_${newUser.id}`;

            // Armazena dados localmente
            localStorage.setItem('authToken', mockToken);
            localStorage.setItem('authUser', JSON.stringify(newUser));

            setToken(mockToken);
            setUser(newUser);
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Simula delay
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            // Remove dados independentemente do resultado
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
        }
    };

    const updateProfile = async (data: { name?: string; email?: string }) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            // Simula delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedUser: User = {
                ...user,
                ...data
            };

            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            // Simula delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simula validação da senha atual
            const currentUser = validCredentials.find(cred => cred.email === user.email);
            if (!currentUser || currentUser.password !== currentPassword) {
                throw new Error('Senha atual incorreta');
            }

            // Simula mudança de senha (em um sistema real, seria salvo no backend)
            console.log('Senha alterada com sucesso (simulado)');
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
