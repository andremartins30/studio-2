// src/app/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Credenciais de acesso para o sistema EPI
  const validCredentials = [
    { email: 'admin@epicontrol.com', password: 'admin123', role: 'admin' },
    { email: 'user@epicontrol.com', password: 'user123', role: 'user' },
    { email: 'manutencao@epicontrol.com', password: 'manut123', role: 'maintenance' },
    // Mantendo credencial original para compatibilidade
    { email: 'admin@epicontrol.com', password: 'password', role: 'admin' }
  ];

  // Verifica se as credenciais são válidas
  const user = validCredentials.find(
    cred => cred.email === email && cred.password === password
  );

  if (user) {
    // Define o cookie de sessão com informações do usuário
    const cookieStore = await cookies();
    const sessionData = {
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    };

    cookieStore.set('session_token', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    // Redireciona para o dashboard após o login.
    redirect('/dashboard');
  }

  // Se as credenciais estiverem incorretas, retorna um erro.
  return { error: 'Email ou senha incorretos.' };
}

export async function logout() {
  // Limpa o cookie de sessão para fazer logout do usuário.
  const cookieStore = await cookies();
  cookieStore.set('session_token', '', { expires: new Date(0) });
  redirect('/login');
}