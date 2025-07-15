import { NextResponse } from 'next/server';
import { getEmpresas as fetchEmpresasFromDB, createCompany } from '../../src/services/routes'; // Importa as funções necessárias

export async function GET(request) {
  try {
    // Obtenha o userId da requisição (ajuste conforme sua autenticação)
    const userId = 'HvafA2jd8JWr5j3Ds6wHX7GZVhj2'; // Substitua por lógica real de autenticação

    const empresas = await fetchEmpresasFromDB(userId);
    return NextResponse.json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas na API:', error);
    return NextResponse.json({ error: 'Erro ao buscar empresas' }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('POST request received');
  try {
    const companyData = await request.json();
    const newCompany = await createCompany(companyData);
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar empresa na API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}