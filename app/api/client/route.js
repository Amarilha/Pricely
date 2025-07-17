import { NextResponse } from 'next/server';
import { getClient as fetchClientFromDB } from '../../src/services/routes'; // Importa a função original
export async function GET(request) {
  try {
    
    const userId = 'HvafA2jd8JWr5j3Ds6wHX7GZVhj2'; // Ajuste para obter o userId da requisição real

    const client  = await fetchClientFromDB(userId);

    return NextResponse.json(client);
  } catch (error) {
    console.error('Erro ao buscar client na API:', error);
    return NextResponse.json({ error: 'Erro ao buscar client' }, { status: 500 });
  }
}

// Se você precisar de outros métodos HTTP (POST, PUT, DELETE), defina as funções correspondentes (ex: export async function POST(request) { ... })
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