// Verificação do ID token do Firebase no servidor.
// Só verificar tokens não exige service account: basta o projectId.
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = getApps()[0] ?? initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });

// Retorna o uid do usuário logado, ou null se o token faltar ou for inválido.
export async function getUserId(request) {
  const token = request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  try {
    return (await getAuth(app).verifyIdToken(token)).uid;
  } catch {
    return null;
  }
}
