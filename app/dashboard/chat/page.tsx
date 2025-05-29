'use client'

import { useEffect, useState } from 'react'

export default function ChatPage() {
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    // Verifica se localStorage está disponível (executa só no cliente)
    const storedUser = localStorage.getItem('user')
    setUser(storedUser)
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      {user ? (
        <p>Bem-vindo, {user}!</p>
      ) : (
        <p>Nenhum usuário logado.</p>
      )}
      {/* Aqui pode incluir seu componente de mensagens, entrada de texto etc. */}
    </main>
  )
}
