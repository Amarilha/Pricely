import { NextRequest, NextResponse } from 'next/server'
import { getMaoDeObra, createMaoDeObra, deleteMaoDeObra } from '@/app/src/services/routes'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const labors = await getMaoDeObra(userId)
    return NextResponse.json(labors)
  } catch (error) {
    console.error('Erro ao buscar mãos de obra:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_user, laborName, rateToSave } = body

    if (!id_user || !laborName || rateToSave === undefined) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const newLabor = await createMaoDeObra({ id_user, laborName, rateToSave })
    return NextResponse.json(newLabor, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mão de obra:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    }

    await deleteMaoDeObra(id)
    return NextResponse.json({ message: 'Mão de obra excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir mão de obra:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}