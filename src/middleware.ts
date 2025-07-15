import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Este middleware irá redirecionar o usuário para a página de login se ele tentar acessar qualquer página protegida sem estar "logado".
// A lógica de "estar logado" é simulada aqui com um cookie.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Lista de páginas públicas que não exigem login
  const publicPaths = ['/login', '/register']

  // Se a página acessada for pública, permite o acesso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Simulação: Verifique se um cookie de sessão existe.
  // Em um app real, este cookie seria definido no login.
  // Para este exemplo, vamos assumir que o usuário precisa ir para o login primeiro.
  // Vou usar um cookie chamado `session_token` para simular.
  const sessionToken = request.cookies.get('session_token');

  // Se não houver token de sessão, redirecione para o login
  // Exceto para as próprias páginas de autenticação para evitar loop de redirecionamento.
  if (!sessionToken && !pathname.startsWith('/login')) {
     const loginUrl = new URL('/login', request.url)
     return NextResponse.redirect(loginUrl)
  }
  
  // Se o usuário estiver logado e tentar acessar /login, redirecione para o dashboard
  if (sessionToken && pathname.startsWith('/login')) {
      const homeUrl = new URL('/', request.url)
      return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  // O matcher define quais rotas serão interceptadas pelo middleware.
  // :path* significa todas as rotas.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
