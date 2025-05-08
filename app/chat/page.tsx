import { ChatInterface } from "@/components/chat-interface"
import { PageHeader } from "@/components/page-header"

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="p-6">
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
