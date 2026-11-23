import { NextResponse } from 'next/server';
import { getClient, createClient } from '../../../src/services/routes.js';
import { getUserId } from '@/app/src/config/firebaseAdmin.js';

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    const client = await getClient(userId);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Erro ao buscar client na API:', error?.message);
    return NextResponse.json({ error: 'Erro ao buscar client' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    const clientData = await request.json();
    // O dono vem do token, nunca do corpo da requisição.
    const newClient = await createClient({ ...clientData, id_user: userId });
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint POST:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
