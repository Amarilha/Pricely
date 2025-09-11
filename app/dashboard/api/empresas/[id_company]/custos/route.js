import { NextResponse } from 'next/server';
import pool from '@/app/src/config/db.js';

export async function GET(request, { params }) {
  try {
    // ✅ CORREÇÃO: Await dos params
    const { id_company } = await params;
    const userId = request.headers.get('Authorization');
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // ✅ CORREÇÃO: Usar 'Company' em vez de 'Empresas'
    const [empresa] = await pool.execute(
      'SELECT * FROM Company WHERE id_company = ? AND id_user = ?',
      [id_company, userId]
    );

    if (empresa.length === 0) {
      return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
    }

    const [custos] = await pool.execute(
      `SELECT * FROM CustoFixo 
       WHERE id_company = ? AND id_user = ? 
       ORDER BY created_at DESC`,
      [id_company, userId]
    );

    return NextResponse.json(custos);
  } catch (error) {
    console.error('Erro ao buscar custos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// No arquivo route.js, altere a parte do INSERT:
export async function POST(request, { params }) {
  try {
    const { id_company } = await params;
    const userId = request.headers.get('Authorization');
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { descricao, valor } = await request.json();

    if (!descricao || !valor) {
      return NextResponse.json(
        { error: 'Descrição e valor são obrigatórios' },
        { status: 400 }
      );
    }

    const [empresa] = await pool.execute(
      'SELECT * FROM Company WHERE id_company = ? AND id_user = ?',
      [id_company, userId]
    );

    if (empresa.length === 0) {
      return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
    }

    // ✅ GERAR UUID MANUALMENTE
    const { v4: uuidv4 } = await import('uuid');
    const id_custo_fixo = uuidv4();

    // ✅ INSERIR COM TODOS OS CAMPOS OBRIGATÓRIOS
    const [result] = await pool.execute(
      `INSERT INTO CustoFixo (id_custo_fixo, id_company, id_user, descricao, valor)
       VALUES (?, ?, ?, ?, ?)`,
      [id_custo_fixo, id_company, userId, descricao, valor]
    );

    return NextResponse.json(
      { message: 'Custo criado com sucesso', id: id_custo_fixo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar custo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}