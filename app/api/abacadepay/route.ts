import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, number, expiry, cvv } = await request.json()

  try {
    // TODO: Replace with real Abacadepay integration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
