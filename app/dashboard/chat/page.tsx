'use client'
import React from "react"

import { ChatInterface } from "@/components/chat-interface"
import { PageHeader } from "@/components/page-header"
import { AdsBanner } from "@/components/ads-banner"

export default function ChatPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col h-screen">

      {/* Overlay de manutenção
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="text-[80px] font-bold text-gray-400 opacity-50 rotate-[-30deg]">
          EM MANUTENÇÃO
        </div>
      </div>
      */}
      <div className="p-6">

      {userPlan === "free" && <AdsBanner />}

        <PageHeader
          title="Consultor IA"
          description="Converse com nosso consultor de IA para obter insights sobre seus projetos."
        />
      </div>
      <div className="flex-1 px-6 pb-6">
        <ChatInterface />
      </div>
    </div>
  )
}
