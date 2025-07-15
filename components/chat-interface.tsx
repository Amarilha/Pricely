"use client";
import { useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { enviarParaIA } from "@/app/src/services/ia.js";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
};

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Consultor IA",
    content: "Olá! Sou seu consultor de IA para projetos. Como posso ajudar você hoje?",
    timestamp: new Date(),
    isUser: false,
  },
];

export function ChatInterface(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;
    setApiError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "Você",
      content: newMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setIsLoading(true);
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await enviarParaIA(newMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "Consultor IA",
          content: response,
          timestamp: new Date(),
          isUser: false,
        },
      ]);
    } catch (error: any) {
      setApiError("Erro ao processar a mensagem. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      {apiError && (
        <Alert variant="destructive" className="m-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.isUser ? "flex-row-reverse" : "flex-row"
                } items-start gap-2`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={message.isUser ? "bg-gray-500" : "bg-purple-600 text-white"}>
                    {message.isUser ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className={`rounded-lg px-4 py-2 ${message.isUser ? "bg-purple-600 text-white" : "bg-muted"}`}>
                    {!message.isUser && (
                      <p className="text-xs font-medium mb-1">{message.sender}</p>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-600 text-white">AI</AvatarFallback>
                </Avatar>
                <div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <p className="text-xs font-medium mb-1">Consultor IA</p>
                    <div className="flex space-x-2">
                      <div className="h-2 w--2 rounded-full bg-purple-600 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce delay-200"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}