'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, User, Mail, KeyRound, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
      });
      return;
    }
    setIsLoading(true);

    // Simula uma chamada de API para registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você já pode fazer login com suas credenciais.',
      });
       // Em um app real, você redirecionaria o usuário
       window.location.href = '/login';
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-accent mb-4" />
          <CardTitle className="text-2xl">Criar uma conta</CardTitle>
          <CardDescription>
            Digite seus dados para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
               <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="name" 
                    placeholder="Seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
