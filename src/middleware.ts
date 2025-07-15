import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplificado para redirecionar a página raiz para login
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se o usuário acessar a raiz (/), redireciona para login
  if (pathname === '/') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apenas intercepta a rota raiz
  matcher: [
    '/',
  ],
}
