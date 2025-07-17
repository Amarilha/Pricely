// app/dashboard/api/empresas/route.js
import { getEmpresas as fetchEmpresasFromDB, createCompany } from '../../../src/services/routes.js';



export async function GET(request) {
  try {
    // Obtenha o userId do cabeçalho de autorização
    const authHeader = request.headers.get('Authorization');
    const userId = authHeader?.split(' ')[0]; // Assume formato "Bearer USER_ID"

    if (!userId) {
      // Usuário não autenticado
      return Response.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    //conexão com o banco de dados
    const empresas = await fetchEmpresasFromDB(userId);
    return Response.json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return Response.json({ error: 'Erro ao buscar empresas' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const companyData = await request.json();
    const newCompany = await createCompany(companyData);
    return Response.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}