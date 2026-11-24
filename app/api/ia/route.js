import { NextResponse } from 'next/server'
import { getUserId } from '@/app/src/config/firebaseAdmin.js'
import { perguntarGemini } from '@/app/src/services/iaServidor.js'

const MAX_TEXTO = 4000
const MAX_HISTORICO = 10

const historicoValido = (h) => Array.isArray(h) && h.length <= MAX_HISTORICO && h.every((m) =>
  (m?.role === 'user' || m?.role === 'model') &&
  Array.isArray(m.parts) && m.parts.length === 1 &&
  typeof m.parts[0]?.text === 'string' && m.parts[0].text.length <= MAX_TEXTO)

export async function POST(request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
  }

  const { message, history = [] } = await request.json().catch(() => ({}))
  if (typeof message !== 'string' || !message.trim() || message.length > MAX_TEXTO || !historicoValido(history)) {
    return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
  }

  try {
    const text = await perguntarGemini(message, history)
    return NextResponse.json({ text })
  } catch (error) {
    console.error('Erro no Gemini:', error.message)
    return NextResponse.json({ error: 'Erro ao consultar a IA' }, { status: 502 })
  }
}
