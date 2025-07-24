'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Users, Shield, Wrench, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const credentials = [
    {
        role: 'Administrador',
        email: 'admin@epicontrol.com',
        password: 'admin123',
        icon: Shield,
        description: 'Acesso completo ao sistema',
        color: 'bg-red-100 text-red-800'
    },
    {
        role: 'Usuário Padrão',
        email: 'user@epicontrol.com',
        password: 'user123',
        icon: Users,
        description: 'Operações básicas',
        color: 'bg-blue-100 text-blue-800'
    },
    {
        role: 'Manutenção',
        email: 'manutencao@epicontrol.com',
        password: 'manut123',
        icon: Wrench,
        description: 'Gestão de materiais',
        color: 'bg-green-100 text-green-800'
    }
];

export function LoginCredentials() {
    const [showPasswords, setShowPasswords] = useState(false);
    const [copiedField, setCopiedField] = useState<string>('');
    const { toast } = useToast();

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            toast({
                title: 'Copiado!',
                description: `${field} copiado para a área de transferência`,
            });
            setTimeout(() => setCopiedField(''), 2000);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível copiar para a área de transferência',
            });
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    🔐 Credenciais de Acesso
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="ml-auto"
                    >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {credentials.map((cred, index) => {
                    const IconComponent = cred.icon;
                    return (
                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <IconComponent className="h-4 w-4" />
                                <span className="font-medium">{cred.role}</span>
                                <Badge className={`text-xs ${cred.color}`}>
                                    {cred.description}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 w-12">Email:</span>
                                    <code className="flex-1 bg-white px-2 py-1 rounded border text-xs">
                                        {cred.email}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(cred.email, 'Email')}
                                        className="h-6 w-6 p-0"
                                    >
                                        {copiedField === 'Email' ? (
                                            <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 w-12">Senha:</span>
                                    <code className="flex-1 bg-white px-2 py-1 rounded border text-xs">
                                        {showPasswords ? cred.password : '•'.repeat(cred.password.length)}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(cred.password, 'Senha')}
                                        className="h-6 w-6 p-0"
                                    >
                                        {copiedField === 'Senha' ? (
                                            <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Clique no ícone do olho para mostrar/ocultar senhas e
                        use os ícones de copiar para preencher automaticamente os campos.
                    </p>
                </div>

                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                        ⚠️ <strong>Desenvolvimento:</strong> Estas são credenciais de demonstração.
                        Em produção, use senhas seguras e autenticação robusta.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
