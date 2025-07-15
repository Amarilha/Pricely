import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './app/src/config/firebaseConfig'

export async function middleware(request: NextRequest) {
  // Rotas protegidas
  const protectedPaths = ['/dashboard']
  const path = request.nextUrl.pathname

  // Verifica se a rota atual está na lista de rotas protegidas
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix))

  if (isProtectedPath) {
    // Verifica o cookie de autenticação
    const session = request.cookies.get('session')

    // Se não houver sessão, redireciona para o login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configuração das rotas que o middleware deve verificar
export const config = {
  matcher: ['/dashboard/:path*']
}