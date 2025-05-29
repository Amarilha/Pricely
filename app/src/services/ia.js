import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Histórico de conversa persistente (opcional: considere usar estado do React se for client-side)
// Define chat history type and initialize from localStorage if available
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// Type definition for TypeScript support
/** @type {Array<{
  role: "user" | "model",
  parts: { text: string }[],
  timestamp: number
}>} */

export async function enviarParaIA(message) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
      },
      systemInstruction: {
        role: "model",
        parts: [{
          text: `Você é um consultor empresarial especializado em pequenas empresas. Sua missão é fornecer orientações claras e acionáveis para,de modo simples , até uma criança vai entender :
       - Use ONLY markdown (**negrito**, listas, quebras de linha)
    - NUNCA use HTML (<br>, <strong>, etc.)
    - Exemplo correto:
      "**Para seu restaurante:**
      1. Margem atual: 20% → baixa!
      2. Aumente para 35% ajustando:
         - Preço do prato principal (+R$ 8)
         - Redução de desperdício ( -10% custos)"

      **#1 Precificação de Serviços**
      - Calcule custos diretos + margem de lucro
      - Analise a concorrência local
      - Justifique o valor percebido pelo cliente
      
      **#2 Gestão de Custos**  
      - Identifique custos fixos vs. variáveis  
      - Elimine desperdícios com soluções práticas  
      - Negocie com fornecedores  
      
      **#3 Estratégias de Faturamento**  
      - Implemente vendas recorrentes  
      - Crie pacotes de upsell  
      - Fidelize clientes com benefícios tangíveis  
      
      **REGRAS DE RESPOSTA:**  
      ✓ Seja DIRETO e PRÁTICO - nada de teorias genéricas  
      ✓ Use **negrito** para valores/dados importantes  
      ✓ Liste passos numerados quando aplicável  
      ✗ Nunca invente dados - peça contexto se necessário  
      
      Exemplo de resposta ideal:  
      **"Para seu café que fatura R$ 15k/mês:**  
      1. Custos atuais: R$ 9k (60% da receita) → muito alto!  
      2. Reduza 10% negociando com fornecedores de grãos  
      3. Aumente ticket médio com combo 'Café + Pão de Queijo' (+R$ 5/venda)"`
        }]
      }
    });

    // Adiciona contexto ao histórico
    chatHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    let responseText = response.text();

    // Limpeza básica da resposta
    responseText = responseText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Mantém negrito
      .replace(/\n/g, '<br>') // Quebras de linha
      .trim()
      .replace(/<br>/g, '\n')          // Substitui <br> por quebras de linha
      .replace(/<\/?strong>/g, '**')   // Converte <strong> para **negrito**
      .replace(/<\/?[^>]+>/g, '')      // Remove QUALQUER outra tag HTML
      .trim();

    // Atualiza histórico
    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }]
    });

    // Limita histórico para evitar excesso
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    return responseText;

  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "⚠️ Erro ao consultar. Reformule sua pergunta ou tente novamente mais tarde.";
  }
}