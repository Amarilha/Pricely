import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verificarToken } from './app/src/config/firebaseAdmin.js'

export async function middleware(request: NextRequest) {
  // O cookie "session" guarda o ID token do Firebase (gravado no login); só a existência dele não basta.
  const uid = await verificarToken(request.cookies.get('session')?.value)

  if (!uid) {
    const resposta = NextResponse.redirect(new URL('/login', request.url))
    resposta.cookies.delete('session')
    return resposta
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
  runtime: 'nodejs', // firebase-admin não roda no Edge
}
