// Verificação do ID token do Firebase no servidor.
// Só verificar tokens não exige service account: basta o projectId.
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = getApps()[0] ?? initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });

// Retorna o uid do usuário logado, ou null se o token faltar ou for inválido.
export async function getUserId(request) {
  return verificarToken(request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1]);
}

export async function verificarToken(token) {
  if (!token) return null;
  try {
    return (await getAuth(app).verifyIdToken(token)).uid;
  } catch {
    return null;
  }
}
