'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, AlertTriangle } from "lucide-react";

export function SettingsForm() {
    const { user, updateProfile, changePassword } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateProfile(profileForm);
            toast({
                title: 'Perfil atualizado',
                description: 'Suas informações foram atualizadas com sucesso.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar perfil',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Senhas não conferem',
                description: 'A nova senha e a confirmação devem ser iguais.',
            });
            return;
        }

        setIsLoading(true);

        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            toast({
                title: 'Senha alterada',
                description: 'Sua senha foi alterada com sucesso.',
            });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao alterar senha',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informações do Perfil
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome completo</Label>
                            <Input
                                id="name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                placeholder="seu@email.com"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Password Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Alterar Senha
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <Label htmlFor="currentPassword">Senha atual</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        <div>
                            <Label htmlFor="newPassword">Nova senha</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Digite sua nova senha"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Confirme sua nova senha"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Alterando...' : 'Alterar Senha'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Informações do Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Usuário ID:</span>
                        <span className="text-sm font-mono">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tipo de Conta:</span>
                        <span className="text-sm capitalize">{user?.role}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm">{user?.isActive ? 'Ativo' : 'Inativo'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Último Login:</span>
                        <span className="text-sm">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'N/A'}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
