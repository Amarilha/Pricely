import { ChatInterface } from "@/components/chat-interface"
import { PageHeader } from "@/components/page-header"
import { AdsBanner } from "@/components/ads-banner"

export default function ChatPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6">
        {userPlan === "free" && <AdsBanner className="mb-6" />}
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
