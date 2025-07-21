import { NextResponse } from 'next/server';
import { getClient as fetchClientFromDB } from '../../../src/services/routes'; // Importa a função original
import { createClient as createClient } from '../../../src/services/routes'; // Importa a função original

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
    const clientData = await request.json();
    console.log("Corpo da requisição recebido no POST:", clientData);
    const newClient = await createClient(clientData);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint POST:', error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}