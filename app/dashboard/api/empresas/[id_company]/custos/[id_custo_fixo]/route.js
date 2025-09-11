import { NextResponse } from 'next/server';
import pool from '@/app/src/config/db.js';

export async function PUT(request, { params }) {
  try {
    // ✅ CORREÇÃO: Await dos params
    const { id_company, id_custo_fixo } = await params;
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

    const [custo] = await pool.execute(
      `SELECT * FROM CustoFixo 
       WHERE id_custo_fixo = ? AND id_company = ? AND id_user = ?`,
      [id_custo_fixo, id_company, userId]
    );

    if (custo.length === 0) {
      return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });
    }

    await pool.execute(
      `UPDATE CustoFixo 
       SET descricao = ?, valor = ?, updated_at = CURRENT_TIMESTAMP(3)
       WHERE id_custo_fixo = ? AND id_company = ? AND id_user = ?`,
      [descricao, valor, id_custo_fixo, id_company, userId]
    );

    return NextResponse.json({ message: 'Custo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar custo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // ✅ CORREÇÃO: Await dos params
    const { id_company, id_custo_fixo } = await params;
    const userId = request.headers.get('Authorization');
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const [custo] = await pool.execute(
      `SELECT * FROM CustoFixo 
       WHERE id_custo_fixo = ? AND id_company = ? AND id_user = ?`,
      [id_custo_fixo, id_company, userId]
    );

    if (custo.length === 0) {
      return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });
    }

    await pool.execute(
      `DELETE FROM CustoFixo 
       WHERE id_custo_fixo = ? AND id_company = ? AND id_user = ?`,
      [id_custo_fixo, id_company, userId]
    );

    return NextResponse.json({ message: 'Custo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar custo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}