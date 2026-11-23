import { NextResponse } from 'next/server'
import { getMaoDeObra, createMaoDeObra, deleteMaoDeObra } from '@/app/src/services/routes.js'
import { getUserId } from '@/app/src/config/firebaseAdmin.js'

const naoAutenticado = () => NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })

export async function GET(request) {
  try {
    const userId = await getUserId(request)
    if (!userId) return naoAutenticado()

    const labors = await getMaoDeObra(userId)
    return NextResponse.json(labors)
  } catch (error) {
    console.error('Erro ao buscar mãos de obra:', error?.message)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request)
    if (!userId) return naoAutenticado()

    const { laborName, rateToSave } = await request.json()
    if (!laborName || rateToSave === undefined) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const newLabor = await createMaoDeObra({ id_user: userId, laborName, rateToSave })
    return NextResponse.json(newLabor, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mão de obra:', error?.message)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const userId = await getUserId(request)
    if (!userId) return naoAutenticado()

    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    }

    const result = await deleteMaoDeObra(id, userId)
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Mão de obra não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Mão de obra excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir mão de obra:', error?.message)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
