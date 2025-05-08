"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, PaperclipIcon } from "lucide-react"

type Message = {
  id: string
  sender: string
  content: string
  timestamp: Date
  isUser: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Consultor IA",
    content: "Olá! Sou seu consultor de IA para projetos. Como posso ajudar você hoje?",
    timestamp: new Date(2023, 6, 15, 9, 0),
    isUser: false,
  },
  {
    id: "2",
    sender: "Consultor IA",
    content:
      "Posso auxiliar com precificação de projetos, estimativas de tempo, análise de riscos ou sugestões para otimizar seu fluxo de trabalho.",
    timestamp: new Date(2023, 6, 15, 9, 1),
    isUser: false,
  },
  {
    id: "3",
    sender: "Você",
    content:
      "Preciso de ajuda para estimar o tempo necessário para desenvolver um site corporativo com 5 páginas e um blog.",
    timestamp: new Date(2023, 6, 15, 9, 5),
    isUser: true,
  },
  {
    id: "4",
    sender: "Consultor IA",
    content:
      "Com base nos dados de projetos similares, um site corporativo com 5 páginas e blog geralmente leva entre 40-60 horas de trabalho. Isso inclui design, desenvolvimento, testes e revisões. Gostaria de uma análise mais detalhada com base nas funcionalidades específicas?",
    timestamp: new Date(2023, 6, 15, 9, 6),
    isUser: false,
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: Date.now().toString(),
      sender: "Você",
      content: newMessage,
      timestamp: new Date(),
      isUser: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
                <Avatar className="h-8 w-8">
                  {message.isUser ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={undefined || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-600 text-white">AI</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <div className={`rounded-lg px-4 py-2 ${message.isUser ? "bg-purple-600 text-white" : "bg-muted"}`}>
                    {!message.isUser && <p className="text-xs font-medium mb-1">{message.sender}</p>}
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button className="bg-purple-600 hover:bg-purple-700" size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
