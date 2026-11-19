// app/dashboard/api/empresas/route.js
import { getEmpresas, createCompany } from '@/app/src/services/routes.js';
import { getUserId } from '@/app/src/config/firebaseAdmin.js';

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    const empresas = await getEmpresas(userId);
    return Response.json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return Response.json({ error: 'Erro ao buscar empresas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    const companyData = await request.json();
    // O dono vem do token, nunca do corpo da requisição.
    const newCompany = await createCompany({ ...companyData, id_user: userId });
    return Response.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint POST:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
