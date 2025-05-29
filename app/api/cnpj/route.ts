import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cnpj = searchParams.get('cnpj')

  if (!cnpj) {
    return NextResponse.json({ error: 'CNPJ não fornecido' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache por 1 minuto
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao consultar CNPJ' },
      { status: 500 }
    )
  }
}