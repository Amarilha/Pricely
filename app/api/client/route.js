// app/api/empresas/route.js (ou pages/api/empresas.js)

import { NextResponse } from 'next/server';
import { getEmpresas as fetchEmpresasFromDB } from '../../src/services/routes'; // Importa a função original

// A função getEmpresas original deve ser ajustada para não fechar o pool e retornar os dados
// Vou te mostrar como ajustar a função original no próximo passo.

export async function GET(request) {
  try {
    // Aqui você precisará obter o userId da requisição.
    // Dependendo de como você gerencia a autenticação, pode ser do cabeçalho, body, ou query params.
    // Por enquanto, vou usar um userId fixo como no seu exemplo original, mas você deve ajustar isso.
    const userId = 'HvafA2jd8JWr5j3Ds6wHX7GZVhj2'; // Ajuste para obter o userId da requisição real

    const empresas = await fetchEmpresasFromDB(userId);

    return NextResponse.json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas na API:', error);
    return NextResponse.json({ error: 'Erro ao buscar empresas' }, { status: 500 });
  }
}

// Se você precisar de outros métodos HTTP (POST, PUT, DELETE), defina as funções correspondentes (ex: export async function POST(request) { ... })
