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
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  {
    id: "2",
    sender: "Consultor IA",
    content:
      "Posso auxiliar com precificação de projetos, estimativas de tempo, análise de riscos ou sugestões para otimizar seu fluxo de trabalho.",
    timestamp: new Date(),
    isUser: false,
  },
];

const DEFAULT_ERROR_MESSAGE =
  "Desculpe, estou tendo dificuldades técnicas no momento. Por favor, tente novamente mais tarde.";
const API_ERROR_MESSAGES: Record<number, string> = {
  400: "Requisição inválida. Verifique os dados enviados.",
  401: "Chave de API inválida ou não fornecida.",
  403: "Acesso negado. Verifique suas permissões.",
  404: "Modelo de IA não encontrado. Verifique o nome do modelo e a versão da API.",
  429: "Muitas solicitações. Aguarde 1 minuto antes de tentar novamente. Considere atualizar seu plano de API.",
  500: "Erro interno do servidor. Tente novamente mais tarde.",
};

export function ChatInterface(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isMissingApiKey, setIsMissingApiKey] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Verificar configuração da API na inicialização
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Chave da API Gemini não configurada");
      setIsMissingApiKey(true);
    } else {
      setIsMissingApiKey(false);
    }
  }, []);

  // Scroll automático para novas mensagens
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchGeminiResponse = async (message: string): Promise<string> => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    // Reduzir o contexto para usar menos tokens
    const context = "Atue como consultor técnico para projetos. Seja conciso. Responda em português.";
    
    while (retries < MAX_RETRIES) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        const genAI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;  

      } catch (error: any) {
        if (retries < MAX_RETRIES) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        throw error;
      }
    }
    throw new Error("Número máximo de tentativas excedido");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Limpar erros anteriores
    setApiError(null);

    // Verificar se a chave API está configurada
    if (isMissingApiKey) {
      setApiError(
        "A chave da API do Gemini não está configurada. Adicione sua chave no arquivo .env.local"
      );
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: "Usuário",
      content: newMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setIsLoading(true);
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await fetchGeminiResponse(newMessage);

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
      console.error("Erro ao enviar mensagem:", error);

      // Extrair mensagem de erro específica ou usar padrão
      const errorMessage = getErrorMessage(error) || DEFAULT_ERROR_MESSAGE;
      setApiError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: "Consultor IA",
          content: errorMessage,
          timestamp: new Date(),
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any): string | null => {
    if (typeof error === "object") {
      // Tentar extrair código de status HTTP
      const statusMatch = error?.message?.match(/HTTP error! status: (\d+)/);
      if (statusMatch && statusMatch[1]) {
        const statusCode = Number(statusMatch[1]);
        return API_ERROR_MESSAGES[statusCode] || `Erro de API (${statusCode})`;
      }

      // Verificar mensagens específicas do Gemini
      if (error?.message?.includes("API_KEY_INVALID")) {
        return "Chave de API inválida. Verifique suas configurações.";
      }

      // Retornar mensagem original se existir
      return error.message || null;
    }
    return null;
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

      {isMissingApiKey && (
        <Alert variant="destructive" className="m-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Chave da API Gemini não configurada. Adicione NEXT_PUBLIC_GEMINI_API_KEY
            no arquivo .env.local
          </AlertDescription>
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
                  {message.isUser ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        AI
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isUser ? "bg-purple-600 text-white" : "bg-muted"
                    }`}
                  >
                    {!message.isUser && (
                      <p className="text-xs font-medium mb-1">
                        {message.sender}
                      </p>
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
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-purple-600 text-white">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <p className="text-xs font-medium mb-1">Consultor IA</p>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"></div>
                      <div
                        className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
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
            disabled={isLoading || !newMessage.trim() || isMissingApiKey}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}