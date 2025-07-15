// src/app/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Em um aplicativo real, você validaria as credenciais em um banco de dados.
  // Aqui, estamos simulando uma verificação de usuário.
  if (email === 'admin@epicontrol.com' && password === 'password') {
    // Define o cookie de sessão. Em um app real, você usaria um token seguro.
    cookies().set('session_token', 'simulated_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
    
    // Redireciona para a página principal após o login.
    redirect('/');
  }

  // Se as credenciais estiverem incorretas, retorna um erro.
  // O formulário no cliente usará isso para exibir uma mensagem.
  return { error: 'Email ou senha incorretos.' };
}

export async function logout() {
  // Limpa o cookie de sessão para fazer logout do usuário.
  cookies().set('session_token', '', { expires: new Date(0) });
  redirect('/login');
}